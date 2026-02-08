/**
 * Artifact-enhanced tool wrappers.
 *
 * These thin wrappers call the raw geospatial / stats tools AND stream
 * typed artifacts to the client via the UIMessageStreamWriter so the
 * frontend can render them in a full-width canvas panel.
 */

import { tool, type UIMessageStreamWriter } from "ai";
import type { ChatMessage } from "@/lib/types";
import {
  FacilityMapArtifact,
  MedicalDesertArtifact,
  StatsDashboardArtifact,
  MissionPlanArtifact,
} from "../artifacts/schemas";

// Re-use the raw tool logic
import { findNearby as rawFindNearby } from "./findNearby";
import { findMedicalDeserts as rawFindMedicalDeserts } from "./findMedicalDeserts";
import { getStats as rawGetStats } from "./getStats";
import { planMission as rawPlanMission } from "./planMission";

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
        dataStream,
      );

      await art.update({ stage: "querying", progress: 0.3 } as Record<string, unknown>);

      // Execute the real tool
      const rawResult = await rawFindNearby.execute!(params, opts);
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
        facilities: result.facilities.map(
          (f: Record<string, unknown>) => ({
            id: f.id as number,
            name: f.name as string,
            type: (f.type as string) ?? null,
            city: (f.city as string) ?? null,
            lat: f.lat as number,
            lng: f.lng as number,
            distanceKm: f.distanceKm as number,
            doctors: (f.doctors as number) ?? null,
            beds: (f.beds as number) ?? null,
          }),
        ),
        stage: "complete",
        progress: 1,
      });

      return result;
    },
  });

// ── findMedicalDeserts → MedicalDesertArtifact ──────────────────────

export const findMedicalDesertsArtifact = ({
  dataStream,
}: ArtifactToolDeps) =>
  tool({
    description: rawFindMedicalDeserts.description,
    inputSchema: rawFindMedicalDeserts.inputSchema,
    execute: async (params, opts) => {
      const art = MedicalDesertArtifact.stream(
        {
          title: `Medical deserts: ${params.service}`,
          service: params.service,
          thresholdKm: params.thresholdKm ?? 100,
          totalProviders: 0,
          providers: [],
          desertZones: [],
          stage: "loading",
          progress: 0,
        },
        dataStream,
      );

      await art.update({ stage: "analyzing", progress: 0.3 } as Record<string, unknown>);

      const rawResult = await rawFindMedicalDeserts.execute!(params, opts);
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
          stage: "complete",
          progress: 1,
        });
        return result;
      }

      await art.complete({
        title: `${result.desertZoneCount} desert zones for ${params.service}`,
        service: result.service,
        thresholdKm: result.thresholdKm,
        totalProviders: result.totalProviders,
        providers: [],
        desertZones: result.desertZones.map(
          (z: Record<string, unknown>) => ({
            city: z.city as string,
            nearestProvider: (z.nearestProvider as string) ?? null,
            distanceKm: z.distanceKm as number,
            coordinates: z.coordinates as {
              lat: number;
              lng: number;
            },
          }),
        ),
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
        dataStream,
      );

      const rawResult = await rawGetStats.execute!(params, opts);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = rawResult as any;

      if (result.error) {
        await art.error(result.error);
        return result;
      }

      const stats = result.stats ?? [];
      const title = params.groupBy
        ? `Stats by ${params.groupBy}`
        : "Ghana Healthcare Overview";

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
        dataStream,
      );

      await art.update({ stage: "planning", progress: 0.3 } as Record<string, unknown>);

      const rawResult = await rawPlanMission.execute!(params, opts);
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
          }),
        ),
        stage: "complete",
        progress: 1,
      });

      return result;
    },
  });
