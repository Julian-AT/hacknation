import { z } from "zod";
import { artifact } from "./artifact";

/**
 * Facility map artifact — rendered as an interactive deck.gl map with markers.
 * Produced by: findNearby, searchFacilities, getFacility
 */
export const FacilityMapArtifact = artifact(
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
      })
    ),
    stage: z.enum(["loading", "querying", "complete"]).default("loading"),
    progress: z.number().min(0).max(1).default(0),
  })
);

/**
 * Medical desert artifact — rendered as a map with desert zones and provider markers.
 * Produced by: findMedicalDeserts
 */
export const MedicalDesertArtifact = artifact(
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
      })
    ),
    desertZones: z.array(
      z.object({
        city: z.string(),
        nearestProvider: z.string().nullable(),
        distanceKm: z.number(),
        coordinates: z.object({ lat: z.number(), lng: z.number() }),
      })
    ),
    providerIsochrones: z
      .array(
        z.object({
          providerName: z.string(),
          lat: z.number(),
          lng: z.number(),
          isochrones: z.array(
            z.object({
              rangeMinutes: z.number(),
              geojson: z.record(z.unknown()),
            })
          ),
        })
      )
      .default([]),
    stage: z.enum(["loading", "analyzing", "complete"]).default("loading"),
    progress: z.number().min(0).max(1).default(0),
  })
);

/**
 * Stats dashboard artifact — rendered as a metrics grid.
 * Produced by: getStats, compareRegions
 */
export const StatsDashboardArtifact = artifact(
  "stats-dashboard",
  z.object({
    title: z.string(),
    groupBy: z.string().optional(),
    totalFacilities: z.number().optional(),
    facilitiesWithCoordinates: z.number().optional(),
    stats: z.array(z.record(z.string(), z.unknown())).default([]),
    stage: z.enum(["loading", "complete"]).default("loading"),
    progress: z.number().min(0).max(1).default(0),
  })
);

/**
 * Mission plan artifact — rendered as a timeline with map overlay.
 * Produced by: planMission
 */
export const MissionPlanArtifact = artifact(
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
      })
    ),
    stage: z.enum(["loading", "planning", "complete"]).default("loading"),
    progress: z.number().min(0).max(1).default(0),
  })
);

/**
 * Healthcare heatmap artifact — rendered as a deck.gl HeatmapLayer.
 * Produced by: getStats (when heatmap view is appropriate)
 */
export const HeatmapArtifact = artifact(
  "healthcare-heatmap",
  z.object({
    title: z.string(),
    weightMetric: z.enum(["count", "beds", "doctors"]).default("count"),
    facilities: z.array(
      z.object({
        lat: z.number(),
        lng: z.number(),
        weight: z.number(),
        name: z.string().optional(),
        city: z.string().nullable().optional(),
      })
    ),
    stage: z.enum(["loading", "complete"]).default("loading"),
    progress: z.number().min(0).max(1).default(0),
  })
);

/**
 * Region choropleth artifact — rendered as a deck.gl GeoJsonLayer.
 * Produced by: getDemographics, compareRegions
 */
export const RegionChoroplethArtifact = artifact(
  "region-choropleth",
  z.object({
    title: z.string(),
    metric: z.string(),
    metricLabel: z.string().optional(),
    regions: z.array(
      z.object({
        region: z.string(),
        value: z.number(),
        population: z.number().optional(),
        facilitiesCount: z.number().optional(),
      })
    ),
    stage: z.enum(["loading", "complete"]).default("loading"),
    progress: z.number().min(0).max(1).default(0),
  })
);

/**
 * Specialty coverage map artifact — shows which specialties are where.
 * Produced by: searchFacilities, classifyServices
 */
export const SpecialtyMapArtifact = artifact(
  "specialty-map",
  z.object({
    title: z.string(),
    specialty: z.string(),
    totalWithSpecialty: z.number(),
    facilities: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        lat: z.number(),
        lng: z.number(),
        city: z.string().nullable(),
        type: z.string().nullable(),
        specialties: z.array(z.string()).default([]),
        hasTargetSpecialty: z.boolean(),
      })
    ),
    gapZones: z
      .array(
        z.object({
          city: z.string(),
          lat: z.number(),
          lng: z.number(),
        })
      )
      .default([]),
    stage: z.enum(["loading", "analyzing", "complete"]).default("loading"),
    progress: z.number().min(0).max(1).default(0),
  })
);

/**
 * Data quality map artifact — colors facilities by data completeness.
 * Produced by: detectAnomalies
 */
export const DataQualityMapArtifact = artifact(
  "data-quality-map",
  z.object({
    title: z.string(),
    facilities: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        lat: z.number(),
        lng: z.number(),
        city: z.string().nullable(),
        qualityScore: z.number().min(0).max(1),
        missingFields: z.array(z.string()).default([]),
      })
    ),
    summary: z
      .object({
        complete: z.number(),
        partial: z.number(),
        sparse: z.number(),
      })
      .optional(),
    stage: z.enum(["loading", "complete"]).default("loading"),
    progress: z.number().min(0).max(1).default(0),
  })
);

/**
 * Travel time / accessibility map artifact — rendered with GeoJsonLayer isochrone
 * polygons and ScatterplotLayer facility markers.
 * Produced by: getAccessibilityMap
 */
export const AccessibilityMapArtifact = artifact(
  "accessibility-map",
  z.object({
    title: z.string(),
    center: z.object({ lat: z.number(), lng: z.number() }),
    facilityName: z.string().optional(),
    profile: z
      .enum(["driving-car", "foot-walking", "cycling-regular"])
      .default("driving-car"),
    isochrones: z.array(
      z.object({
        rangeMinutes: z.number(),
        geojson: z.record(z.unknown()), // GeoJSON Feature
      })
    ),
    reachableFacilities: z
      .array(
        z.object({
          id: z.number(),
          name: z.string(),
          lat: z.number(),
          lng: z.number(),
          type: z.string().nullable(),
          travelTimeMinutes: z.number().optional(),
          withinRing: z.number(), // which isochrone ring (minutes)
        })
      )
      .default([]),
    stage: z.enum(["loading", "computing", "complete"]).default("loading"),
    progress: z.number().min(0).max(1).default(0),
  })
);
