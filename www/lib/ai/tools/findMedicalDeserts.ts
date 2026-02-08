import { z } from "zod";
import { db } from "../../db";
import { facilities } from "../../db/schema.facilities";
import { and, isNotNull, ilike } from "drizzle-orm";
import { CITY_COORDS } from "../../ghana";
import { tool } from "ai";
import { createToolLogger } from "./debug";
import { withTimeout, clampNumber, DB_QUERY_TIMEOUT_MS } from "./safeguards";

// Note: CITY_COORDS is still used as reference points for desert analysis.
// These are the cities checked against provider locations to find gaps.
// Future: could be augmented with cities from other countries.

// Haversine distance in km
function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const findMedicalDeserts = tool({
  description:
    "Identify geographic regions where specific healthcare services are absent or dangerously far. Returns 'desert zones' with gap radius and affected population.",
  inputSchema: z.object({
    service: z
      .string()
      .min(1)
      .max(200)
      .describe(
        'The healthcare service to check (e.g., "neurosurgery", "dialysis")'
      ),
    thresholdKm: z
      .number()
      .min(10)
      .max(500)
      .default(100)
      .describe('Distance threshold to consider an area "served" (10-500km)'),
  }),
  execute: async ({ service, thresholdKm: rawThreshold }, { abortSignal }) => {
    const thresholdKm = clampNumber(rawThreshold, 10, 500, 100);
    const log = createToolLogger("findMedicalDeserts");
    const start = Date.now();
    log.start({ service, thresholdKm });

    try {
      log.step("Querying providers for service", service);
      const providers = await withTimeout(
        db
          .select({
            id: facilities.id,
            name: facilities.name,
            lat: facilities.lat,
            lng: facilities.lng,
            city: facilities.addressCity,
          })
          .from(facilities)
          .where(
            and(
              isNotNull(facilities.lat),
              isNotNull(facilities.lng),
              ilike(facilities.proceduresRaw, `%${service}%`)
            )
          ),
        DB_QUERY_TIMEOUT_MS,
        abortSignal
      );

      log.step("Providers found", providers.length);

      if (providers.length === 0) {
        const output = {
          service,
          status: "NATIONAL_GAP" as const,
          message: `No facilities in the database explicitly list "${service}" in their procedures.`,
        };
        log.success(output, Date.now() - start);
        return output;
      }

      // Check major cities against providers
      const cityEntries = Object.entries(CITY_COORDS);
      const cityCount = cityEntries.length;
      log.step("Computing distances for cities", cityCount);

      const cityGaps: Array<{
        city: string;
        nearestProvider: string | null;
        distanceKm: number;
        coordinates: { lat: number; lng: number };
      }> = [];

      for (const [cityName, coords] of cityEntries) {
        // Respect abort signal during long computation
        if (abortSignal?.aborted) {
          log.step("Aborted during city distance computation");
          return { error: "Operation was aborted" };
        }

        let minDist = Number.POSITIVE_INFINITY;
        let nearestProvider: string | null = null;

        for (const p of providers) {
          if (!p.lat || !p.lng) {
            continue;
          }

          const d = haversineKm(coords.lat, coords.lng, p.lat, p.lng);
          if (d < minDist) {
            minDist = d;
            nearestProvider = p.name;
          }
        }

        if (minDist > thresholdKm) {
          cityGaps.push({
            city: cityName,
            nearestProvider,
            distanceKm: Math.round(minDist),
            coordinates: coords,
          });
        }
      }

      log.step("Desert zones identified", cityGaps.length);

      const output = {
        service,
        thresholdKm,
        totalProviders: providers.length,
        desertZones: cityGaps
          .sort((a, b) => b.distanceKm - a.distanceKm)
          .slice(0, 10),
        desertZoneCount: cityGaps.length,
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown desert analysis error";
      log.error(error, { service, thresholdKm }, Date.now() - start);
      return { error: `Desert analysis failed: ${message}` };
    }
  },
});
