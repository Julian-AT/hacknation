import { tool } from "ai";
import { z } from "zod";
import { createToolLogger } from "../debug";

/**
 * OpenRouteService travel time tool.
 *
 * Free tier: 2,000 requests/day (no credit card required).
 * Sign up at: https://openrouteservice.org/dev/#/signup
 * Requires ORS_API_KEY environment variable.
 *
 * Covers VF Agent question 2.3:
 * "Where are the largest geographic cold spots where a critical procedure
 *  is absent within X km / X hours travel time?"
 *
 * Provides actual road distance and travel time (not straight-line Haversine).
 */

const ORS_BASE = "https://api.openrouteservice.org";

interface ORSDirectionsResponse {
  routes?: {
    summary: {
      distance: number; // meters
      duration: number; // seconds
    };
    geometry: string;
  }[];
}

interface ORSMatrixResponse {
  durations?: (number | null)[][];
  distances?: (number | null)[][];
  sources?: { location: [number, number]; snapped_distance: number }[];
  destinations?: { location: [number, number]; snapped_distance: number }[];
}

export const getTravelTime = tool({
  description:
    "Calculate actual road travel time and distance between locations using OpenRouteService. More accurate than straight-line distance for healthcare access analysis. Supports single route (A→B) or matrix mode (multiple origins to multiple destinations). Requires ORS_API_KEY environment variable. Free tier: 2,000 requests/day.",
  inputSchema: z.object({
    mode: z
      .enum(["route", "matrix"])
      .default("route")
      .describe(
        "route: single A→B travel time. matrix: many-to-many distance/time matrix."
      ),
    profile: z
      .enum(["driving-car", "foot-walking", "cycling-regular"])
      .default("driving-car")
      .describe("Transport mode (default: driving-car)"),
    // Route mode params
    origin: z
      .object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
      })
      .optional()
      .describe("Origin point (route mode)"),
    destination: z
      .object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
      })
      .optional()
      .describe("Destination point (route mode)"),
    // Matrix mode params
    locations: z
      .array(
        z.object({
          lat: z.number().min(-90).max(90),
          lng: z.number().min(-180).max(180),
          label: z.string().optional(),
        })
      )
      .max(25)
      .optional()
      .describe(
        "Locations for matrix mode (max 25). First N are origins, rest are destinations."
      ),
    sourceCount: z
      .number()
      .min(1)
      .max(10)
      .optional()
      .describe(
        "How many of the locations array are origins (matrix mode). Rest are destinations."
      ),
  }),
  execute: async ({
    mode,
    profile,
    origin,
    destination,
    locations,
    sourceCount,
  }) => {
    const log = createToolLogger("getTravelTime");
    const start = Date.now();
    log.start({ mode, profile });

    const apiKey = process.env.ORS_API_KEY;
    if (!apiKey) {
      return {
        error:
          "ORS_API_KEY environment variable is not set. Sign up free at https://openrouteservice.org/dev/#/signup",
      };
    }

    try {
      if (mode === "route") {
        if (!origin || !destination) {
          return { error: "Route mode requires origin and destination" };
        }

        const url = `${ORS_BASE}/v2/directions/${profile}?api_key=${apiKey}&start=${String(origin.lng)},${String(origin.lat)}&end=${String(destination.lng)},${String(destination.lat)}`;

        const response = await fetch(url, {
          signal: AbortSignal.timeout(15_000),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(
            `ORS API returned ${String(response.status)}: ${text.slice(0, 200)}`
          );
        }

        const json = (await response.json()) as {
          features?: {
            properties: NonNullable<ORSDirectionsResponse["routes"]>[number];
          }[];
        };

        const route = json.features?.at(0)?.properties;
        if (!route?.summary) {
          return { error: "No route found between the two points" };
        }

        const distanceKm = route.summary.distance / 1000;
        const durationMin = route.summary.duration / 60;

        const output = {
          source: "OpenRouteService",
          profile,
          origin: { lat: origin.lat, lng: origin.lng },
          destination: { lat: destination.lat, lng: destination.lng },
          distanceKm: Math.round(distanceKm * 10) / 10,
          durationMinutes: Math.round(durationMin),
          durationFormatted: formatDuration(durationMin),
          note: "Road distance and time based on OpenStreetMap road network.",
        };

        log.success(output, Date.now() - start);
        return output;
      }

      // Matrix mode
      if (!locations || locations.length < 2) {
        return { error: "Matrix mode requires at least 2 locations" };
      }

      const coords = locations.map((loc) => [loc.lng, loc.lat]);
      const sources = sourceCount
        ? Array.from({ length: sourceCount }, (_, i) => i)
        : undefined;
      const destinations = sourceCount
        ? Array.from(
            { length: locations.length - sourceCount },
            (_, i) => i + sourceCount
          )
        : undefined;

      const body: Record<string, unknown> = {
        locations: coords,
        metrics: ["distance", "duration"],
      };
      if (sources) {
        body.sources = sources;
      }
      if (destinations) {
        body.destinations = destinations;
      }

      const response = await fetch(`${ORS_BASE}/v2/matrix/${profile}`, {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(20_000),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `ORS Matrix API returned ${String(response.status)}: ${text.slice(0, 200)}`
        );
      }

      const json = (await response.json()) as ORSMatrixResponse;

      const durations = json.durations ?? [];
      const distances = json.distances ?? [];

      // Build readable results
      const sourceLabels = (
        sources ?? Array.from({ length: locations.length }, (_, i) => i)
      ).map((i) => locations[i]?.label ?? `Location ${String(i)}`);
      const destLabels = (
        destinations ?? Array.from({ length: locations.length }, (_, i) => i)
      ).map((i) => locations[i]?.label ?? `Location ${String(i)}`);

      const matrix = sourceLabels.map((srcLabel, si) => {
        const row: Record<string, unknown> = { from: srcLabel };
        destLabels.forEach((destLabel, di) => {
          const dur = durations[si]?.[di];
          const dist = distances[si]?.[di];
          row[destLabel] =
            dur !== null && dur !== undefined
              ? `${formatDuration(dur / 60)} (${String(Math.round((dist ?? 0) / 100) / 10)}km)`
              : "N/A";
        });
        return row;
      });

      const output = {
        source: "OpenRouteService",
        profile,
        matrix,
        note: "Travel times based on OpenStreetMap road network. Traffic conditions not included.",
      };

      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown ORS error";
      log.error(error, { mode, profile }, Date.now() - start);
      return { error: `Travel time calculation failed: ${message}` };
    }
  },
});

function formatDuration(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hrs === 0) {
    return `${String(mins)}min`;
  }
  return `${String(hrs)}h ${String(mins)}min`;
}

// ── Isochrone API ────────────────────────────────────────────────────

/** GeoJSON Feature from ORS isochrone response */
export interface IsochroneFeature {
  type: "Feature";
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
  properties: {
    group_index: number;
    value: number; // seconds
    center: [number, number]; // [lng, lat]
    area?: number; // m²
    reachfactor?: number;
  };
}

interface ORSIsochroneResponse {
  type: "FeatureCollection";
  features: IsochroneFeature[];
}

/**
 * Fetch isochrone polygons from OpenRouteService.
 *
 * Returns GeoJSON polygon features representing the area reachable within
 * the given time ranges from a center point. Each feature's `properties.value`
 * contains the range in seconds.
 *
 * @param center  - Origin point { lat, lng }
 * @param profile - Transport mode (default: "driving-car")
 * @param rangesMinutes - Array of time ranges in minutes (default: [30, 60, 120])
 * @returns Array of GeoJSON Features (sorted largest-first for correct rendering order)
 */
export async function fetchIsochrones(
  center: { lat: number; lng: number },
  profile: "driving-car" | "foot-walking" | "cycling-regular" = "driving-car",
  rangesMinutes: number[] = [30, 60, 120]
): Promise<
  | { features: IsochroneFeature[]; error?: never }
  | { features?: never; error: string }
> {
  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) {
    return {
      error:
        "ORS_API_KEY environment variable is not set. Sign up free at https://openrouteservice.org/dev/#/signup",
    };
  }

  // Convert minutes to seconds, sort descending so largest polygon renders first
  const rangeSeconds = [...rangesMinutes]
    .sort((a, b) => b - a)
    .map((m) => m * 60);

  try {
    const response = await fetch(
      `${ORS_BASE}/v2/isochrones/${profile}`,
      {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locations: [[center.lng, center.lat]],
          range: rangeSeconds,
          range_type: "time",
          attributes: ["area", "reachfactor"],
        }),
        signal: AbortSignal.timeout(30_000),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `ORS Isochrone API returned ${String(response.status)}: ${text.slice(0, 200)}`
      );
    }

    const json = (await response.json()) as ORSIsochroneResponse;

    // Sort features by value descending (largest polygon first)
    const sorted = [...json.features].sort(
      (a, b) => b.properties.value - a.properties.value
    );

    return { features: sorted };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown ORS isochrone error";
    return { error: `Isochrone fetch failed: ${message}` };
  }
}
