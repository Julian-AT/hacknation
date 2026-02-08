import { z } from "zod";
import { tool } from "ai";
import { createToolLogger } from "../debug";

/**
 * Overpass API tool — cross-reference facility data with OpenStreetMap.
 *
 * Free, no API key required.
 * Finds healthcare facilities in OpenStreetMap near a given location.
 *
 * Covers VF Agent question 3.5:
 * "Which procedures/equipment claims are most often corroborated by multiple independent websites?"
 * — provides an independent second source (OSM) for facility existence.
 */

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

interface OSMElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

export const queryOSMFacilities = tool({
  description:
    "Query OpenStreetMap for healthcare facilities near a location. Free, independent data source for cross-referencing and corroborating facility existence. Returns OSM-listed hospitals, clinics, pharmacies, and doctors within a given radius. Use to verify whether a facility appears in independent mapping data.",
  inputSchema: z.object({
    lat: z.number().min(-90).max(90).describe("Center latitude"),
    lng: z.number().min(-180).max(180).describe("Center longitude"),
    radiusMeters: z
      .number()
      .min(500)
      .max(50_000)
      .default(5_000)
      .describe("Search radius in meters (default: 5000)"),
    facilityType: z
      .enum(["all", "hospital", "clinic", "pharmacy", "doctors", "dentist"])
      .default("all")
      .describe("Filter by OSM amenity type (default: all healthcare)"),
  }),
  execute: async ({ lat, lng, radiusMeters, facilityType }) => {
    const log = createToolLogger("queryOSMFacilities");
    const start = Date.now();
    log.start({ lat, lng, radiusMeters, facilityType });

    try {
      const amenityFilter =
        facilityType === "all"
          ? '["amenity"~"hospital|clinic|pharmacy|doctors|dentist"]'
          : `["amenity"="${facilityType}"]`;

      const query = `
        [out:json][timeout:15];
        (
          node${amenityFilter}(around:${String(radiusMeters)},${String(lat)},${String(lng)});
          way${amenityFilter}(around:${String(radiusMeters)},${String(lat)},${String(lng)});
          relation${amenityFilter}(around:${String(radiusMeters)},${String(lat)},${String(lng)});
        );
        out center;
      `;

      const response = await fetch(OVERPASS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(20_000),
      });

      if (!response.ok) {
        throw new Error(`Overpass API returned ${String(response.status)}`);
      }

      const json = (await response.json()) as { elements?: OSMElement[] };
      const elements = json.elements ?? [];

      const facilities = elements.map((el) => {
        const elLat = el.lat ?? el.center?.lat;
        const elLng = el.lon ?? el.center?.lon;
        const tags = el.tags ?? {};
        return {
          osmId: `${el.type}/${String(el.id)}`,
          name: tags.name ?? tags["name:en"] ?? "Unnamed",
          amenity: tags.amenity ?? "unknown",
          lat: elLat,
          lng: elLng,
          address: [
            tags["addr:street"],
            tags["addr:city"],
            tags["addr:state"],
          ]
            .filter(Boolean)
            .join(", ") || null,
          phone: tags.phone ?? tags["contact:phone"] ?? null,
          website: tags.website ?? tags["contact:website"] ?? null,
          operator: tags.operator ?? null,
          healthcareSpecialty: tags["healthcare:speciality"] ?? tags.healthcare ?? null,
          beds: tags.beds ? Number.parseInt(tags.beds, 10) : null,
          emergency: tags.emergency ?? null,
          openingHours: tags.opening_hours ?? null,
          osmUrl: `https://www.openstreetmap.org/${el.type}/${String(el.id)}`,
        };
      });

      const output = {
        source: "OpenStreetMap (Overpass API)",
        searchCenter: { lat, lng },
        radiusMeters,
        totalFound: facilities.length,
        facilities: facilities.slice(0, 30),
        note: "OSM data is community-contributed. Presence in OSM provides independent corroboration of facility existence. Absence does not mean the facility doesn't exist.",
      };

      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown Overpass API error";
      log.error(error, { lat, lng, radiusMeters }, Date.now() - start);
      return { error: `OSM facility query failed: ${message}` };
    }
  },
});
