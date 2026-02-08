import { tool } from "ai";
import { and, ilike, isNotNull, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { facilities } from "../../db/schema.facilities";
import { CITY_COORDS } from "../../ghana";
import { createToolLogger } from "./debug";
import { DB_QUERY_TIMEOUT_MS, withTimeout } from "./safeguards";

// Note: CITY_COORDS used as reference cities for desert zone analysis.
// Future: augment with cities from other countries for global coverage.

// Haversine distance in km
function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
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

type HostFacilityProfile = {
  id?: number;
  name: string;
  city?: string | null;
  region?: string | null;
  distanceKm?: number;
  facilityType?: string | null;
  beds?: number | null;
  doctors?: number | null;
  equipment?: string | null;
  procedures?: string | null;
};

type Recommendation = {
  priority: string;
  region: string;
  reason: string;
  suggestedHost?:
    | {
        id?: number;
        name: string;
        city?: string | null;
        distanceKm?: number;
      }
    | undefined;
  suggestedLocation?: string | undefined;
};

export const planMission = tool({
  description:
    "Interactive volunteer deployment planner. Recommends facilities for a volunteer based on their specialty and healthcare needs in the database.",
  inputSchema: z.object({
    specialty: z
      .string()
      .min(1)
      .max(200)
      .describe('Volunteer medical specialty (e.g., "Ophthalmologist")'),
    duration: z
      .string()
      .max(100)
      .optional()
      .describe('Available duration (e.g., "2 weeks")'),
    preference: z
      .string()
      .max(200)
      .optional()
      .describe("Regional or facility type preference"),
  }),
  execute: async ({ specialty, duration, preference }, { abortSignal }) => {
    const log = createToolLogger("planMission");
    const start = Date.now();
    log.start({ specialty, duration, preference });

    try {
      // Step 1: Find facilities that provide this specialty (medical desert analysis)
      log.step("Querying providers for specialty", specialty);
      const providers = await withTimeout(
        db
          .select({
            id: facilities.id,
            name: facilities.name,
            lat: facilities.lat,
            lng: facilities.lng,
            city: facilities.addressCity,
            region: facilities.addressRegion,
          })
          .from(facilities)
          .where(
            and(
              isNotNull(facilities.lat),
              isNotNull(facilities.lng),
              or(
                ilike(facilities.proceduresRaw, `%${specialty}%`),
                ilike(facilities.specialtiesRaw, `%${specialty}%`)
              )
            )
          ),
        DB_QUERY_TIMEOUT_MS,
        abortSignal
      );

      log.step("Providers found for specialty", providers.length);

      const DESERT_THRESHOLD_KM = 50;
      const recommendations: Recommendation[] = [];
      let desertZones: Array<{
        city: string;
        nearestProvider: string | null;
        distanceKm: number;
        coordinates: { lat: number; lng: number };
      }> = [];

      if (providers.length === 0) {
        // NATIONAL_GAP: No facilities offer this specialty at all
        log.step("National gap detected for specialty", specialty);

        // Find the largest hospitals as potential hosts
        const largestHospitals = await withTimeout(
          db
            .select({
              id: facilities.id,
              name: facilities.name,
              city: facilities.addressCity,
              region: facilities.addressRegion,
            })
            .from(facilities)
            .where(
              and(
                isNotNull(facilities.lat),
                isNotNull(facilities.lng),
                ilike(facilities.facilityType, "%Teaching Hospital%")
              )
            )
            .limit(3),
          DB_QUERY_TIMEOUT_MS,
          abortSignal
        );

        const hostName =
          largestHospitals.length > 0
            ? largestHospitals[0].name
            : "a major teaching hospital in the region";
        const hostRegion =
          largestHospitals.length > 0
            ? `${largestHospitals[0].city ?? largestHospitals[0].region ?? "Major City"} (Teaching Hospitals)`
            : "Major City (Teaching Hospitals)";

        recommendations.push({
          priority: "Critical - National Gap",
          region: hostRegion,
          reason: `No facilities in the database explicitly list ${specialty}. Recommend starting at a major teaching hospital to build capacity.`,
          suggestedHost: {
            id: largestHospitals.at(0)?.id,
            name: hostName,
            city: largestHospitals.at(0)?.city,
          },
        });
      } else {
        // Step 2: Find cities that are medical deserts for this specialty
        const cityEntries = Object.entries(CITY_COORDS);

        log.step("Computing desert zones for cities", cityEntries.length);

        for (const [cityName, coords] of cityEntries) {
          if (abortSignal?.aborted) {
            return { error: "Operation was aborted" };
          }

          let minDist = Number.POSITIVE_INFINITY;
          let nearestName: string | null = null;

          for (const p of providers) {
            if (!p.lat || !p.lng) {
              continue;
            }
            const d = haversineKm(coords.lat, coords.lng, p.lat, p.lng);
            if (d < minDist) {
              minDist = d;
              nearestName = p.name;
            }
          }

          if (minDist > DESERT_THRESHOLD_KM) {
            desertZones.push({
              city: cityName,
              nearestProvider: nearestName,
              distanceKm: Math.round(minDist),
              coordinates: coords,
            });
          }
        }

        desertZones.sort((a, b) => b.distanceKm - a.distanceKm);
        log.step("Desert zones found", desertZones.length);

        if (desertZones.length > 0) {
          const topDesert = desertZones[0];
          log.step("Top desert zone", {
            city: topDesert.city,
            distanceKm: topDesert.distanceKm,
          });

          // Step 3: Find nearby hospitals that could host the volunteer
          const distanceSql = sql`(
            6371.0 * acos(
              LEAST(1.0, GREATEST(-1.0,
                cos(radians(${topDesert.coordinates.lat})) * cos(radians(${facilities.lat})) *
                cos(radians(${facilities.lng}) - radians(${topDesert.coordinates.lng})) +
                sin(radians(${topDesert.coordinates.lat})) * sin(radians(${facilities.lat}))
              ))
            )
          )`;

          log.step("Searching for host facilities near desert zone");
          const potentialHosts = await withTimeout(
            db
              .select({
                id: facilities.id,
                name: facilities.name,
                city: facilities.addressCity,
                region: facilities.addressRegion,
                facilityType: facilities.facilityType,
                beds: facilities.capacity,
                doctors: facilities.numDoctors,
                equipment: facilities.equipmentRaw,
                procedures: facilities.proceduresRaw,
                distanceKm: distanceSql,
              })
              .from(facilities)
              .where(
                and(
                  isNotNull(facilities.lat),
                  isNotNull(facilities.lng),
                  ilike(facilities.facilityType, "%Hospital%"),
                  sql`${distanceSql} <= 50`
                )
              )
              .orderBy(distanceSql)
              .limit(3),
            DB_QUERY_TIMEOUT_MS,
            abortSignal
          );

          log.step("Potential host facilities found", potentialHosts.length);

          if (potentialHosts.length > 0) {
            const host = potentialHosts[0];
            recommendations.push({
              priority: "High - Critical Gap",
              region: `${topDesert.city} Area`,
              reason: `This area is a medical desert for ${specialty} (nearest is ${topDesert.distanceKm}km away).`,
              suggestedHost: {
                id: host.id,
                name: host.name,
                city: host.city,
                distanceKm: Math.round(Number(host.distanceKm) * 10) / 10,
              },
            });
          } else {
            recommendations.push({
              priority: "High - Critical Gap (Infrastructure Limited)",
              region: `${topDesert.city} Area`,
              reason: `This area is a severe medical desert (${topDesert.distanceKm}km gap) but lacks major hospitals. Consider mobile clinic deployment.`,
              suggestedLocation: topDesert.city,
            });
          }

          // Add additional desert zones as secondary recommendations
          for (const zone of desertZones.slice(1, 3)) {
            recommendations.push({
              priority: "Medium - Desert Zone",
              region: `${zone.city} Area`,
              reason: `${zone.distanceKm}km from nearest ${specialty} provider (${zone.nearestProvider}).`,
              suggestedLocation: zone.city,
            });
          }
        }
      }

      // Fallback if no specific gaps were found
      if (recommendations.length === 0) {
        log.step("No specific gaps found, using fallback recommendation");

        // Dynamically find underserved regions from the database
        const ruralHospital = await withTimeout(
          db
            .select({
              id: facilities.id,
              name: facilities.name,
              city: facilities.addressCity,
              region: facilities.addressRegion,
            })
            .from(facilities)
            .where(
              and(
                isNotNull(facilities.lat),
                isNotNull(facilities.lng),
                ilike(facilities.facilityType, "%Hospital%")
              )
            )
            .limit(1),
          DB_QUERY_TIMEOUT_MS,
          abortSignal
        );

        const fallbackHost = ruralHospital.at(0);
        recommendations.push({
          priority: "Medium - Rural Support",
          region: fallbackHost?.region ?? "Underserved Region",
          reason:
            "General need for specialists in underserved rural districts.",
          suggestedHost: fallbackHost
            ? {
                id: fallbackHost.id,
                name: fallbackHost.name,
                city: fallbackHost.city,
              }
            : { name: "Contact local health authority for placement" },
        });
      }

      // Apply preference filter if provided
      if (preference) {
        const preferenceMatches = recommendations.filter(
          (r) =>
            r.region.toLowerCase().includes(preference.toLowerCase()) ||
            r.suggestedHost?.city
              ?.toLowerCase()
              .includes(preference.toLowerCase()) ||
            r.suggestedLocation
              ?.toLowerCase()
              .includes(preference.toLowerCase())
        );
        if (preferenceMatches.length > 0) {
          log.step(
            "Preference filter applied, matching recommendations",
            preferenceMatches.length
          );
        }
      }

      log.step("Generated recommendations", recommendations.length);

      // Build enriched host facility profile from the top recommendation
      let hostFacilityProfile: HostFacilityProfile | null = null;
      if (recommendations.length > 0) {
        const topRec = recommendations[0];
        if (topRec.suggestedHost?.id) {
          // Fetch detailed profile for the top suggested host
          const [hostRow] = await withTimeout(
            db
              .select({
                id: facilities.id,
                name: facilities.name,
                city: facilities.addressCity,
                region: facilities.addressRegion,
                facilityType: facilities.facilityType,
                beds: facilities.capacity,
                doctors: facilities.numDoctors,
                equipment: facilities.equipmentRaw,
                procedures: facilities.proceduresRaw,
              })
              .from(facilities)
              .where(sql`id = ${topRec.suggestedHost.id}`)
              .limit(1),
            DB_QUERY_TIMEOUT_MS,
            abortSignal
          );
          if (hostRow) {
            hostFacilityProfile = {
              id: hostRow.id,
              name: hostRow.name,
              city: hostRow.city,
              region: hostRow.region,
              facilityType: hostRow.facilityType,
              beds: hostRow.beds,
              doctors: hostRow.doctors,
              equipment: hostRow.equipment,
              procedures: hostRow.procedures,
              distanceKm: topRec.suggestedHost.distanceKm,
            };
          }
        }
      }

      // Compute top desert zone for the briefing
      const topDesertZone =
        desertZones.length > 0
          ? {
              city: desertZones[0].city,
              distanceKm: desertZones[0].distanceKm,
              nearestProvider: desertZones[0].nearestProvider,
              coordinates: desertZones[0].coordinates,
            }
          : null;

      const output = {
        volunteerProfile: { specialty, duration, preference },
        analysis: `Analyzed ${providers.length} existing providers for ${specialty}. Found ${desertZones.length} desert zone(s) exceeding ${DESERT_THRESHOLD_KM}km threshold.`,
        totalProvidersFound: providers.length,
        desertZoneCount: desertZones.length,
        topDesertZone,
        hostFacilityProfile,
        recommendations,
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown planning error";
      log.error(error, { specialty, duration, preference }, Date.now() - start);
      return { error: `Planning failed: ${message}` };
    }
  },
});
