import { artifact } from "@ai-sdk-tools/artifacts";
// Note: artifacts package uses zod v4 internally, we use v3. The runtime API
// is compatible (.parse, .safeParse) so we cast through `any` at the boundary.
import { z } from "zod";

// Helper to bridge zod v3 schemas to the artifact() function which expects zod v4 types
const defineArtifact = <T>(id: string, schema: z.ZodType<T>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  artifact(id, schema as any);

/**
 * Facility map artifact — rendered as an interactive Leaflet map with markers.
 * Produced by: findNearby, searchFacilities, getFacility
 */
export const FacilityMapArtifact = defineArtifact(
  "facility-map",
  z.object({
    title: z.string(),
    center: z.object({ lat: z.number(), lng: z.number() }),
    zoom: z.number(),
    radiusKm: z.number().optional(),
    facilities: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        type: z.string().nullable(),
        city: z.string().nullable(),
        lat: z.number(),
        lng: z.number(),
        distanceKm: z.number().optional(),
        doctors: z.number().nullable(),
        beds: z.number().nullable(),
      }),
    ),
    stage: z
      .enum(["loading", "querying", "complete"])
      .default("loading"),
    progress: z.number().min(0).max(1).default(0),
  }),
);

/**
 * Medical desert artifact — rendered as a map with desert zones and provider markers.
 * Produced by: findMedicalDeserts
 */
export const MedicalDesertArtifact = defineArtifact(
  "medical-desert",
  z.object({
    title: z.string(),
    service: z.string(),
    thresholdKm: z.number(),
    totalProviders: z.number(),
    providers: z.array(
      z.object({
        name: z.string(),
        lat: z.number(),
        lng: z.number(),
        city: z.string().nullable(),
      }),
    ),
    desertZones: z.array(
      z.object({
        city: z.string(),
        nearestProvider: z.string().nullable(),
        distanceKm: z.number(),
        coordinates: z.object({ lat: z.number(), lng: z.number() }),
      }),
    ),
    stage: z
      .enum(["loading", "analyzing", "complete"])
      .default("loading"),
    progress: z.number().min(0).max(1).default(0),
  }),
);

/**
 * Stats dashboard artifact — rendered as a metrics grid.
 * Produced by: getStats, compareRegions
 */
export const StatsDashboardArtifact = defineArtifact(
  "stats-dashboard",
  z.object({
    title: z.string(),
    groupBy: z.string().optional(),
    totalFacilities: z.number().optional(),
    facilitiesWithCoordinates: z.number().optional(),
    stats: z.array(z.record(z.string(), z.unknown())).default([]),
    stage: z.enum(["loading", "complete"]).default("loading"),
    progress: z.number().min(0).max(1).default(0),
  }),
);

/**
 * Mission plan artifact — rendered as a timeline with map overlay.
 * Produced by: planMission
 */
export const MissionPlanArtifact = defineArtifact(
  "mission-plan",
  z.object({
    title: z.string(),
    volunteerProfile: z.object({
      specialty: z.string(),
      duration: z.string().optional(),
      preference: z.string().optional(),
    }),
    analysis: z.string(),
    recommendations: z.array(
      z.object({
        priority: z.string(),
        region: z.string(),
        reason: z.string(),
        suggestedHost: z
          .object({
            id: z.number().optional(),
            name: z.string(),
            city: z.string().nullable().optional(),
            distanceKm: z.number().optional(),
          })
          .optional(),
        suggestedLocation: z.string().optional(),
      }),
    ),
    stage: z
      .enum(["loading", "planning", "complete"])
      .default("loading"),
    progress: z.number().min(0).max(1).default(0),
  }),
);
