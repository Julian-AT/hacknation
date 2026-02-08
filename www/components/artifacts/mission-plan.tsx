"use client";

import type { MapViewState } from "deck.gl";
import { DeckGL, ScatterplotLayer } from "deck.gl";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { Map as MapGL } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

const DARK_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const LIGHT_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

/** Approximate region centroids for placing markers */
const REGION_COORDS: Record<string, { lat: number; lng: number }> = {
  "Greater Accra": { lat: 5.6037, lng: -0.187 },
  Ashanti: { lat: 6.747, lng: -1.5209 },
  Northern: { lat: 9.5439, lng: -0.9057 },
  Western: { lat: 5.396, lng: -1.9741 },
  Eastern: { lat: 6.2374, lng: -0.4502 },
  Central: { lat: 5.4637, lng: -1.2455 },
  Volta: { lat: 6.5781, lng: 0.4502 },
  "Upper East": { lat: 10.7852, lng: -0.8601 },
  "Upper West": { lat: 10.253, lng: -2.145 },
  "Brong-Ahafo": { lat: 7.9465, lng: -1.61 },
  Savannah: { lat: 9.0023, lng: -1.5909 },
  "North East": { lat: 10.3001, lng: -0.3674 },
  Oti: { lat: 7.7801, lng: 0.2827 },
  "Bono East": { lat: 7.75, lng: -1.05 },
  Ahafo: { lat: 7.0833, lng: -2.3333 },
  "Western North": { lat: 6.3, lng: -2.4 },
  Bono: { lat: 7.45, lng: -2.35 },
};

type MissionPlanData = {
  title: string;
  volunteerProfile: {
    specialty: string;
    duration?: string;
    preference?: string;
  };
  analysis: string;
  recommendations: Array<{
    priority: string;
    region: string;
    reason: string;
    suggestedHost?: {
      id?: number;
      name: string;
      city?: string | null;
      distanceKm?: number;
    };
    suggestedLocation?: string;
  }>;
  stage: string;
  progress: number;
};

function getPriorityColor(priority: string): string {
  if (priority.toLowerCase().includes("critical")) {
    return "border-red-500/30 bg-red-500/5";
  }
  if (priority.toLowerCase().includes("high")) {
    return "border-orange-500/30 bg-orange-500/5";
  }
  if (priority.toLowerCase().includes("medium")) {
    return "border-yellow-500/30 bg-yellow-500/5";
  }
  return "border-border bg-muted/50";
}

function getPriorityBadgeColor(priority: string): string {
  if (priority.toLowerCase().includes("critical")) {
    return "bg-red-500/20 text-red-400";
  }
  if (priority.toLowerCase().includes("high")) {
    return "bg-orange-500/20 text-orange-400";
  }
  if (priority.toLowerCase().includes("medium")) {
    return "bg-yellow-500/20 text-yellow-400";
  }
  return "bg-muted text-muted-foreground";
}

type MapPoint = {
  lat: number;
  lng: number;
  region: string;
  priority: string;
  index: number;
};

function getPriorityMapColor(
  priority: string
): [number, number, number, number] {
  if (priority.toLowerCase().includes("critical")) {
    return [239, 68, 68, 230];
  }
  if (priority.toLowerCase().includes("high")) {
    return [249, 115, 22, 230];
  }
  if (priority.toLowerCase().includes("medium")) {
    return [234, 179, 8, 230];
  }
  return [120, 120, 120, 180];
}

function MissionMap({
  recommendations,
}: {
  recommendations: MissionPlanData["recommendations"];
}) {
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const mapStyle = isDark ? DARK_STYLE : LIGHT_STYLE;

  const points: MapPoint[] = useMemo(
    () =>
      recommendations
        .map((rec, i) => {
          const coords = REGION_COORDS[rec.region];
          if (!coords) {
            return null;
          }
          return {
            lat: coords.lat,
            lng: coords.lng,
            region: rec.region,
            priority: rec.priority,
            index: i + 1,
          };
        })
        .filter(Boolean) as MapPoint[],
    [recommendations]
  );

  const viewState: MapViewState = useMemo(
    () => ({
      latitude: 7.9465,
      longitude: -1.0232,
      zoom: 6.5,
      pitch: 0,
      bearing: 0,
    }),
    []
  );

  const layers = useMemo(
    () => [
      new ScatterplotLayer<MapPoint>({
        id: "mission-points",
        data: points,
        getPosition: (d) => [d.lng, d.lat],
        getFillColor: (d) => getPriorityMapColor(d.priority),
        getLineColor: [255, 255, 255, 150],
        getRadius: (d) => (d.index === 1 ? 18000 : 14000),
        stroked: true,
        lineWidthMinPixels: 2,
        pickable: false,
      }),
    ],
    [points]
  );

  if (!isMounted || points.length === 0) {
    return null;
  }

  return (
    <div className="relative h-48 border-b border-border">
      <DeckGL
        controller
        initialViewState={viewState}
        layers={layers}
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        <MapGL key={mapStyle} mapStyle={mapStyle} />
      </DeckGL>
      {/* Legend */}
      <div className="absolute bottom-2 right-2 z-10 flex gap-3 rounded-md border border-border bg-background/90 px-2.5 py-1.5 backdrop-blur-sm">
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-red-500" />
          <span className="text-[9px] text-muted-foreground">Critical</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-orange-500" />
          <span className="text-[9px] text-muted-foreground">High</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-yellow-500" />
          <span className="text-[9px] text-muted-foreground">Medium</span>
        </div>
      </div>
    </div>
  );
}

export function MissionPlanRenderer({ data }: { data: MissionPlanData }) {
  if (!data) {
    return (
      <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <div className="size-6 rounded-full border-2 border-muted-foreground/30 border-t-amber-500 animate-spin" />
          <span className="text-sm">Planning mission...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex size-full flex-col overflow-y-auto bg-background">
      {/* Deployment map */}
      {data.recommendations.length > 0 && (
        <MissionMap recommendations={data.recommendations} />
      )}

      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold text-foreground text-balance">
          {data.title}
        </h2>
        {data.stage !== "complete" && (
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="size-3 rounded-full border-2 border-muted-foreground/30 border-t-amber-500 animate-spin" />
            <span className="capitalize">{data.stage}...</span>
          </div>
        )}
      </div>

      {/* Volunteer profile */}
      <div className="border-b border-border px-6 py-4">
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Volunteer Profile
        </h3>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
            {data.volunteerProfile.specialty}
          </span>
          {data.volunteerProfile.duration && (
            <span className="rounded-md bg-muted px-2.5 py-1 text-xs text-foreground">
              {data.volunteerProfile.duration}
            </span>
          )}
          {data.volunteerProfile.preference && (
            <span className="rounded-md bg-muted px-2.5 py-1 text-xs text-foreground">
              {data.volunteerProfile.preference}
            </span>
          )}
        </div>
        {data.analysis && (
          <p className="mt-2 text-sm text-muted-foreground text-pretty">
            {data.analysis}
          </p>
        )}
      </div>

      {/* Recommendations */}
      <div className="flex-1 px-6 py-4">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Deployment Recommendations
        </h3>
        <div className="flex flex-col gap-3">
          {data.recommendations.map((rec, i) => (
            <div
              className={`rounded-lg border p-4 ${getPriorityColor(rec.priority)}`}
              key={`${rec.region}-${rec.priority}-${i}`}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityBadgeColor(rec.priority)}`}
                >
                  {rec.priority}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {rec.region}
                </span>
              </div>
              <p className="text-sm text-foreground text-pretty">
                {rec.reason}
              </p>
              {rec.suggestedHost && (
                <div className="mt-2 rounded-md border border-border/50 bg-muted/50 px-3 py-2 text-xs">
                  <span className="text-muted-foreground">
                    Suggested host:{" "}
                  </span>
                  <span className="font-medium text-foreground">
                    {rec.suggestedHost.name}
                  </span>
                  {rec.suggestedHost.city && (
                    <span className="text-muted-foreground">
                      {" "}
                      · {rec.suggestedHost.city}
                    </span>
                  )}
                  {rec.suggestedHost.distanceKm !== undefined && (
                    <span className="text-muted-foreground tabular-nums">
                      {" "}
                      · {rec.suggestedHost.distanceKm} km
                    </span>
                  )}
                </div>
              )}
              {rec.suggestedLocation && !rec.suggestedHost && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Location: {rec.suggestedLocation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
