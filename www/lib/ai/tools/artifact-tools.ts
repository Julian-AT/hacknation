/**
 * Artifact-enhanced tool wrappers.
 *
 * These thin wrappers call the raw geospatial / stats tools AND stream
 * typed artifacts to the client via the UIMessageStreamWriter so the
 * frontend can render them in a full-width canvas panel.
 */

import { tool, type UIMessageStreamWriter } from "ai";
import { and, between, isNotNull, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { facilities } from "@/lib/db/schema.facilities";
import type { ChatMessage } from "@/lib/types";
import {
  AccessibilityMapArtifact,
  DataQualityMapArtifact,
  FacilityMapArtifact,
  HeatmapArtifact,
  MedicalDesertArtifact,
  MissionPlanArtifact,
  RegionChoroplethArtifact,
  SpecialtyMapArtifact,
  StatsDashboardArtifact,
} from "../artifacts/schemas";
import { findMedicalDeserts as rawFindMedicalDeserts } from "./findMedicalDeserts";
// Re-use the raw tool logic
import { findNearby as rawFindNearby } from "./findNearby";
import { getStats as rawGetStats } from "./getStats";
import { planMission as rawPlanMission } from "./planMission";
import { fetchIsochrones } from "./web/openrouteservice";

type ArtifactToolDeps = {
  dataStream: UIMessageStreamWriter<ChatMessage>;
};

// ── findNearby → FacilityMapArtifact ────────────────────────────────

export const findNearbyArtifact = ({ dataStream }: ArtifactToolDeps) =>
  tool({
    description: rawFindNearby.description,
    inputSchema: rawFindNearby.inputSchema,
    execute: async (params, opts) => {
      // Stream loading state
      const art = FacilityMapArtifact.stream(
        {
          title: `Facilities near ${params.location}`,
          center: { lat: 7.9465, lng: -1.0232 },
          zoom: 10,
          radiusKm: params.radiusKm,
          facilities: [],
          stage: "loading",
          progress: 0,
        },
        dataStream
      );

      await art.update({ stage: "querying", progress: 0.3 } as Record<
        string,
        unknown
      >);

      // Execute the real tool
      const rawResult = await rawFindNearby.execute?.(params, opts);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = rawResult as any;

      if (result.error) {
        await art.error(result.error);
        return result;
      }

      // Stream final data
      await art.complete({
        title: `${result.count} facilities near ${params.location}`,
        center: { lat: result.center.lat, lng: result.center.lng },
        zoom: 10,
        radiusKm: result.radiusKm,
        facilities: result.facilities.map((f: Record<string, unknown>) => ({
          id: f.id as number,
          name: f.name as string,
          type: (f.type as string) ?? null,
          city: (f.city as string) ?? null,
          lat: f.lat as number,
          lng: f.lng as number,
          distanceKm: f.distanceKm as number,
          doctors: (f.doctors as number) ?? null,
          beds: (f.beds as number) ?? null,
        })),
        stage: "complete",
        progress: 1,
      });

      return result;
    },
  });

// ── findMedicalDeserts → MedicalDesertArtifact ──────────────────────

export const findMedicalDesertsArtifact = ({ dataStream }: ArtifactToolDeps) =>
  tool({
    description:
      rawFindMedicalDeserts.description +
      " Optionally overlay real road-network travel time zones (isochrones) on provider coverage.",
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
      showTravelTime: z
        .boolean()
        .default(false)
        .describe(
          "When true, fetch real road-network isochrone polygons for each provider (up to 5) to show actual drive-time coverage instead of simple radius circles"
        ),
    }),
    execute: async (params, opts) => {
      const art = MedicalDesertArtifact.stream(
        {
          title: `Medical deserts: ${params.service}`,
          service: params.service,
          thresholdKm: params.thresholdKm ?? 100,
          totalProviders: 0,
          providers: [],
          desertZones: [],
          providerIsochrones: [],
          stage: "loading",
          progress: 0,
        },
        dataStream
      );

      await art.update({ stage: "analyzing", progress: 0.3 } as Record<
        string,
        unknown
      >);

      const rawResult = await rawFindMedicalDeserts.execute?.(
        { service: params.service, thresholdKm: params.thresholdKm },
        opts
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = rawResult as any;

      if (result.error) {
        await art.error(result.error);
        return result;
      }

      if (result.status === "NATIONAL_GAP") {
        await art.complete({
          title: `National gap: ${params.service}`,
          service: params.service,
          thresholdKm: params.thresholdKm ?? 100,
          totalProviders: 0,
          providers: [],
          desertZones: [],
          providerIsochrones: [],
          stage: "complete",
          progress: 1,
        });
        return result;
      }

      // If showTravelTime, fetch isochrones for top providers (capped at 5)
      let providerIsochrones: Array<{
        providerName: string;
        lat: number;
        lng: number;
        isochrones: Array<{
          rangeMinutes: number;
          geojson: Record<string, unknown>;
        }>;
      }> = [];

      if (params.showTravelTime) {
        await art.update({ progress: 0.6 } as Record<string, unknown>);

        // Query providers with coordinates for isochrone lookup
        const providerRows = await db
          .select({
            name: facilities.name,
            lat: facilities.lat,
            lng: facilities.lng,
          })
          .from(facilities)
          .where(
            and(
              isNotNull(facilities.lat),
              isNotNull(facilities.lng),
              sql`procedures_raw ilike ${`%${params.service}%`}`
            )
          )
          .limit(5);

        const isoResults = await Promise.all(
          providerRows.map(async (p) => {
            if (!p.lat || !p.lng) return null;
            const iso = await fetchIsochrones(
              { lat: p.lat, lng: p.lng },
              "driving-car",
              [30, 60, 120]
            );
            if (iso.error || !iso.features) return null;
            return {
              providerName: p.name,
              lat: p.lat,
              lng: p.lng,
              isochrones: iso.features.map((f) => ({
                rangeMinutes: Math.round(f.properties.value / 60),
                geojson: f as unknown as Record<string, unknown>,
              })),
            };
          })
        );

        providerIsochrones = isoResults.filter(
          (r): r is NonNullable<typeof r> => r !== null
        );
      }

      await art.complete({
        title: `${result.desertZoneCount} desert zones for ${params.service}`,
        service: result.service,
        thresholdKm: result.thresholdKm,
        totalProviders: result.totalProviders,
        providers: [],
        desertZones: result.desertZones.map((dz: Record<string, unknown>) => ({
          city: dz.city as string,
          nearestProvider: (dz.nearestProvider as string) ?? null,
          distanceKm: dz.distanceKm as number,
          coordinates: dz.coordinates as {
            lat: number;
            lng: number;
          },
        })),
        providerIsochrones,
        stage: "complete",
        progress: 1,
      });

      return result;
    },
  });

// ── getStats → StatsDashboardArtifact ───────────────────────────────

export const getStatsArtifact = ({ dataStream }: ArtifactToolDeps) =>
  tool({
    description: rawGetStats.description,
    inputSchema: rawGetStats.inputSchema,
    execute: async (params, opts) => {
      const art = StatsDashboardArtifact.stream(
        {
          title: "Healthcare Statistics",
          groupBy: params.groupBy,
          stats: [],
          stage: "loading",
          progress: 0,
        },
        dataStream
      );

      const rawResult = await rawGetStats.execute?.(params, opts);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = rawResult as any;

      if (result.error) {
        await art.error(result.error);
        return result;
      }

      const stats = result.stats ?? [];
      const title = params.groupBy
        ? `Stats by ${params.groupBy}`
        : "Healthcare Overview";

      await art.complete({
        title,
        groupBy: params.groupBy,
        totalFacilities: result.totalFacilities,
        facilitiesWithCoordinates: result.facilitiesWithCoordinates,
        stats,
        stage: "complete",
        progress: 1,
      });

      return result;
    },
  });

// ── planMission → MissionPlanArtifact ───────────────────────────────

export const planMissionArtifact = ({ dataStream }: ArtifactToolDeps) =>
  tool({
    description: rawPlanMission.description,
    inputSchema: rawPlanMission.inputSchema,
    execute: async (params, opts) => {
      const art = MissionPlanArtifact.stream(
        {
          title: `Mission plan: ${params.specialty}`,
          volunteerProfile: {
            specialty: params.specialty,
            duration: params.duration,
            preference: params.preference,
          },
          analysis: "",
          recommendations: [],
          stage: "loading",
          progress: 0,
        },
        dataStream
      );

      await art.update({ stage: "planning", progress: 0.3 } as Record<
        string,
        unknown
      >);

      const rawResult = await rawPlanMission.execute?.(params, opts);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = rawResult as any;

      if (result.error) {
        await art.error(result.error);
        return result;
      }

      await art.complete({
        title: `Mission plan: ${params.specialty}`,
        volunteerProfile: result.volunteerProfile,
        analysis: result.analysis,
        recommendations: result.recommendations.map(
          (r: Record<string, unknown>) => ({
            priority: r.priority as string,
            region: r.region as string,
            reason: r.reason as string,
            suggestedHost: r.suggestedHost,
            suggestedLocation: r.suggestedLocation,
          })
        ),
        stage: "complete",
        progress: 1,
      });

      return result;
    },
  });

// ── getHeatmap → HeatmapArtifact ────────────────────────────────────

export const getHeatmapArtifact = ({ dataStream }: ArtifactToolDeps) =>
  tool({
    description:
      'Generate an interactive heatmap of healthcare facility density. Use for "show me a heatmap of facilities", "where are healthcare resources concentrated?", "visualize facility density".',
    inputSchema: z.object({
      weightBy: z
        .enum(["count", "beds", "doctors"])
        .default("count")
        .describe("Weight heatmap by facility count, bed capacity, or doctor count"),
    }),
    execute: async ({ weightBy }) => {
      const art = HeatmapArtifact.stream(
        {
          title: "Healthcare Facility Heatmap",
          weightMetric: weightBy,
          facilities: [],
          stage: "loading",
          progress: 0,
        },
        dataStream
      );

      try {
        const rows = await db
          .select({
            lat: facilities.lat,
            lng: facilities.lng,
            name: facilities.name,
            city: facilities.addressCity,
            beds: facilities.capacity,
            doctors: facilities.numDoctors,
          })
          .from(facilities)
          .where(and(isNotNull(facilities.lat), isNotNull(facilities.lng)));

        const points = rows.map((r) => ({
          lat: r.lat as number,
          lng: r.lng as number,
          name: r.name,
          city: r.city,
          weight:
            weightBy === "beds"
              ? (r.beds ?? 1)
              : weightBy === "doctors"
                ? (r.doctors ?? 1)
                : 1,
        }));

        const metricLabels: Record<string, string> = {
          count: "Facility Count",
          beds: "Bed Capacity",
          doctors: "Doctor Count",
        };

        await art.complete({
          title: `Healthcare Heatmap — ${metricLabels[weightBy]}`,
          weightMetric: weightBy,
          facilities: points,
          stage: "complete",
          progress: 1,
        });

        return {
          totalFacilities: points.length,
          weightBy,
          totalWeight: points.reduce((s, p) => s + p.weight, 0),
        };
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        await art.error(message);
        return { error: `Heatmap failed: ${message}` };
      }
    },
  });

// ── getRegionChoropleth → RegionChoroplethArtifact ──────────────────

export const getRegionChoroplethArtifact = ({
  dataStream,
}: ArtifactToolDeps) =>
  tool({
    description:
      'Generate a regional choropleth map showing health metrics by region. Use for "compare regions visually", "show facilities per capita by region", "map healthcare coverage by region".',
    inputSchema: z.object({
      metric: z
        .enum([
          "facilities",
          "facilities_per_capita",
          "hospitals",
          "beds",
          "doctors",
        ])
        .default("facilities")
        .describe("Metric to visualize by region"),
    }),
    execute: async ({ metric }) => {
      const art = RegionChoroplethArtifact.stream(
        {
          title: "Regional Healthcare Comparison",
          metric,
          regions: [],
          stage: "loading",
          progress: 0,
        },
        dataStream
      );

      try {
        const stats = await db
          .select({
            region: facilities.addressRegion,
            count: sql<number>`count(*)`,
            hospitals: sql<number>`count(*) filter (where facility_type = 'hospital')`,
            beds: sql<number>`coalesce(sum(capacity), 0)`,
            doctors: sql<number>`coalesce(sum(num_doctors), 0)`,
          })
          .from(facilities)
          .groupBy(facilities.addressRegion)
          .orderBy(sql`count(*) DESC`);

        // Population data for per-capita calculations
        const REGION_POP: Record<string, number> = {
          "Greater Accra": 5455692,
          Ashanti: 5440463,
          Northern: 2310939,
          Western: 2060585,
          Eastern: 2925653,
          Central: 2859821,
          Volta: 1659040,
          "Upper East": 1301226,
          "Upper West": 901502,
          Savannah: 653266,
          "North East": 658946,
          Oti: 747248,
          "Bono East": 1203400,
          Ahafo: 564668,
          "Western North": 880921,
          Bono: 1208649,
        };

        const metricLabels: Record<string, string> = {
          facilities: "Total Facilities",
          facilities_per_capita: "Facilities per 100k",
          hospitals: "Hospitals",
          beds: "Total Beds",
          doctors: "Total Doctors",
        };

        const regions = stats
          .filter((s) => s.region)
          .map((s) => {
            const pop = REGION_POP[s.region as string] ?? 0;
            let value: number;
            switch (metric) {
              case "facilities_per_capita":
                value = pop > 0 ? Math.round((s.count / pop) * 100000) : 0;
                break;
              case "hospitals":
                value = s.hospitals;
                break;
              case "beds":
                value = s.beds;
                break;
              case "doctors":
                value = s.doctors;
                break;
              default:
                value = s.count;
            }
            return {
              region: s.region as string,
              value,
              population: pop,
              facilitiesCount: s.count,
            };
          });

        await art.complete({
          title: `${metricLabels[metric]} by Region`,
          metric,
          metricLabel: metricLabels[metric],
          regions,
          stage: "complete",
          progress: 1,
        });

        return { metric, regions };
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        await art.error(message);
        return { error: `Choropleth failed: ${message}` };
      }
    },
  });

// ── getAccessibilityMap → AccessibilityMapArtifact ──────────────────

export const getAccessibilityMapArtifact = ({
  dataStream,
}: ArtifactToolDeps) =>
  tool({
    description:
      'Generate a travel time accessibility map showing isochrone polygons (real road-network zones) around a facility or location. Use for "how far can patients travel", "show travel time coverage from X", "accessibility analysis", "isochrone map".',
    inputSchema: z.object({
      facilityId: z
        .number()
        .optional()
        .describe(
          "ID of the facility to use as center. If not provided, lat/lng are required."
        ),
      lat: z
        .number()
        .min(-90)
        .max(90)
        .optional()
        .describe("Center latitude (used when facilityId is not provided)"),
      lng: z
        .number()
        .min(-180)
        .max(180)
        .optional()
        .describe("Center longitude (used when facilityId is not provided)"),
      profile: z
        .enum(["driving-car", "foot-walking", "cycling-regular"])
        .default("driving-car")
        .describe("Transport mode for travel time calculation"),
      rangesMinutes: z
        .array(z.number().min(5).max(240))
        .default([30, 60, 120])
        .describe("Time ranges in minutes for isochrone rings"),
    }),
    execute: async ({ facilityId, lat, lng, profile, rangesMinutes }) => {
      let centerLat = lat;
      let centerLng = lng;
      let facilityName: string | undefined;

      // Resolve facility if ID provided
      if (facilityId) {
        const [row] = await db
          .select({
            name: facilities.name,
            lat: facilities.lat,
            lng: facilities.lng,
          })
          .from(facilities)
          .where(sql`id = ${facilityId}`)
          .limit(1);

        if (!row?.lat || !row?.lng) {
          return { error: `Facility ${String(facilityId)} not found or has no coordinates` };
        }
        centerLat = row.lat;
        centerLng = row.lng;
        facilityName = row.name;
      }

      if (centerLat === undefined || centerLng === undefined) {
        return { error: "Either facilityId or lat/lng coordinates are required" };
      }

      const center = { lat: centerLat, lng: centerLng };

      const art = AccessibilityMapArtifact.stream(
        {
          title: facilityName
            ? `Travel time from ${facilityName}`
            : "Travel Time Accessibility",
          center,
          facilityName,
          profile,
          isochrones: [],
          reachableFacilities: [],
          stage: "loading",
          progress: 0,
        },
        dataStream
      );

      try {
        await art.update({ stage: "computing", progress: 0.2 } as Record<
          string,
          unknown
        >);

        // Fetch isochrone polygons from ORS
        const isoResult = await fetchIsochrones(center, profile, rangesMinutes);

        if (isoResult.error || !isoResult.features) {
          await art.error(isoResult.error ?? "No isochrone features returned");
          return { error: isoResult.error ?? "No isochrone features returned" };
        }

        const isochrones = isoResult.features.map((f) => ({
          rangeMinutes: Math.round(f.properties.value / 60),
          geojson: f as unknown as Record<string, unknown>,
        }));

        await art.update({ progress: 0.6 } as Record<string, unknown>);

        // Find nearby facilities within a bounding box of the largest ring
        // Rough approximation: 1 degree lat ≈ 111km
        const maxRangeMin = Math.max(...rangesMinutes);
        // Estimate max radius: driving ~80km/h → maxRangeMin/60 * 80 = km
        const maxRadiusKm = (maxRangeMin / 60) * 80;
        const latDelta = maxRadiusKm / 111;
        const lngDelta = maxRadiusKm / (111 * Math.cos((center.lat * Math.PI) / 180));

        const nearbyRows = await db
          .select({
            id: facilities.id,
            name: facilities.name,
            lat: facilities.lat,
            lng: facilities.lng,
            type: facilities.facilityType,
          })
          .from(facilities)
          .where(
            and(
              isNotNull(facilities.lat),
              isNotNull(facilities.lng),
              between(facilities.lat, center.lat - latDelta, center.lat + latDelta),
              between(facilities.lng, center.lng - lngDelta, center.lng + lngDelta)
            )
          )
          .limit(100);

        // Classify each facility into the appropriate ring using point-in-ring
        // approximation (Haversine distance → closest matching ring)
        const reachableFacilities = nearbyRows
          .filter((r) => r.lat && r.lng)
          .map((r) => {
            const distKm = haversineKm(center.lat, center.lng, r.lat as number, r.lng as number);
            // Estimate travel minutes from straight-line distance
            // Driving: ~50km/h effective (roads aren't straight)
            const estimatedMinutes = Math.round((distKm / 50) * 60);
            // Find which ring this facility falls within
            const sortedRanges = [...rangesMinutes].sort((a, b) => a - b);
            const ring = sortedRanges.find((r) => estimatedMinutes <= r) ?? sortedRanges.at(-1) ?? maxRangeMin;

            return {
              id: r.id,
              name: r.name,
              lat: r.lat as number,
              lng: r.lng as number,
              type: r.type,
              travelTimeMinutes: estimatedMinutes,
              withinRing: ring,
            };
          })
          .filter((f) => f.travelTimeMinutes <= maxRangeMin)
          // Exclude the origin facility itself
          .filter((f) => !(facilityId && f.id === facilityId))
          .sort((a, b) => a.travelTimeMinutes - b.travelTimeMinutes);

        await art.complete({
          title: facilityName
            ? `Travel time from ${facilityName}`
            : "Travel Time Accessibility",
          center,
          facilityName,
          profile,
          isochrones,
          reachableFacilities,
          stage: "complete",
          progress: 1,
        });

        return {
          center,
          facilityName,
          profile,
          rings: isochrones.map((i) => i.rangeMinutes),
          reachableFacilitiesCount: reachableFacilities.length,
        };
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        await art.error(message);
        return { error: `Accessibility map failed: ${message}` };
      }
    },
  });

/** Haversine distance in km (utility for bounding box estimation) */
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

// ── getDataQualityMap → DataQualityMapArtifact ──────────────────────

export const getDataQualityMapArtifact = ({
  dataStream,
}: ArtifactToolDeps) =>
  tool({
    description:
      'Generate a data quality map showing facility data completeness. Use for "show data quality", "which facilities have incomplete data?", "data completeness map", "where do we need more data?".',
    inputSchema: z.object({
      region: z
        .string()
        .optional()
        .describe("Optional region filter"),
    }),
    execute: async ({ region }) => {
      const art = DataQualityMapArtifact.stream(
        {
          title: "Data Quality Overview",
          facilities: [],
          stage: "loading",
          progress: 0,
        },
        dataStream
      );

      try {
        const conditions = [
          isNotNull(facilities.lat),
          isNotNull(facilities.lng),
        ];

        const rows = await db
          .select({
            id: facilities.id,
            name: facilities.name,
            lat: facilities.lat,
            lng: facilities.lng,
            city: facilities.addressCity,
            region: facilities.addressRegion,
            hasSpecialties: sql<boolean>`specialties is not null and array_length(specialties, 1) > 0`,
            hasProcedures: sql<boolean>`procedures is not null and array_length(procedures, 1) > 0`,
            hasEquipment: sql<boolean>`equipment is not null and array_length(equipment, 1) > 0`,
            hasCapabilities: sql<boolean>`capabilities is not null and array_length(capabilities, 1) > 0`,
            hasDoctors: sql<boolean>`num_doctors is not null and num_doctors > 0`,
            hasBeds: sql<boolean>`capacity is not null and capacity > 0`,
            hasPhone: sql<boolean>`phone is not null and phone != ''`,
            hasEmail: sql<boolean>`email is not null and email != ''`,
          })
          .from(facilities)
          .where(and(...conditions));

        const FIELDS = [
          "hasSpecialties",
          "hasProcedures",
          "hasEquipment",
          "hasCapabilities",
          "hasDoctors",
          "hasBeds",
          "hasPhone",
          "hasEmail",
        ] as const;

        const FIELD_LABELS: Record<string, string> = {
          hasSpecialties: "specialties",
          hasProcedures: "procedures",
          hasEquipment: "equipment",
          hasCapabilities: "capabilities",
          hasDoctors: "doctors",
          hasBeds: "beds",
          hasPhone: "phone",
          hasEmail: "email",
        };

        let filtered = rows;
        if (region) {
          filtered = rows.filter(
            (r) =>
              r.region?.toLowerCase().includes(region.toLowerCase())
          );
        }

        const points = filtered.map((r) => {
          const filledCount = FIELDS.filter(
            (f) => r[f] === true
          ).length;
          const score = filledCount / FIELDS.length;
          const missing = FIELDS.filter((f) => r[f] !== true).map(
            (f) => FIELD_LABELS[f]
          );
          return {
            id: r.id,
            name: r.name,
            lat: r.lat as number,
            lng: r.lng as number,
            city: r.city,
            qualityScore: Math.round(score * 100) / 100,
            missingFields: missing,
          };
        });

        const complete = points.filter((p) => p.qualityScore >= 0.7).length;
        const partial = points.filter(
          (p) => p.qualityScore >= 0.4 && p.qualityScore < 0.7
        ).length;
        const sparse = points.filter((p) => p.qualityScore < 0.4).length;

        await art.complete({
          title: region
            ? `Data Quality — ${region}`
            : "Data Quality Overview",
          facilities: points,
          summary: { complete, partial, sparse },
          stage: "complete",
          progress: 1,
        });

        return {
          totalFacilities: points.length,
          complete,
          partial,
          sparse,
          avgScore:
            Math.round(
              (points.reduce((s, p) => s + p.qualityScore, 0) /
                (points.length || 1)) *
                100
            ) / 100,
        };
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        await art.error(message);
        return { error: `Data quality map failed: ${message}` };
      }
    },
  });
