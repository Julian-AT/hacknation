"use client";

import type { MapViewState, PickingInfo } from "deck.gl";
import { DeckGL, ScatterplotLayer, TextLayer } from "deck.gl";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { Map as MapGL } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapErrorBoundary } from "./map-error-boundary";

const DARK_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const LIGHT_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

function escapeHtml(str: string): string {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Approximate region centroids for Ghana's 16 regions */
const REGION_CENTROIDS: Record<string, { lat: number; lng: number }> = {
  "Greater Accra": { lat: 5.6037, lng: -0.187 },
  Ashanti: { lat: 6.7470, lng: -1.5209 },
  Northern: { lat: 9.5439, lng: -0.9057 },
  Western: { lat: 5.3960, lng: -1.9741 },
  Eastern: { lat: 6.2374, lng: -0.4502 },
  Central: { lat: 5.4637, lng: -1.2455 },
  Volta: { lat: 6.5781, lng: 0.4502 },
  "Upper East": { lat: 10.7852, lng: -0.8601 },
  "Upper West": { lat: 10.2530, lng: -2.1450 },
  "Brong-Ahafo": { lat: 7.9465, lng: -1.6100 },
  Savannah: { lat: 9.0023, lng: -1.5909 },
  "North East": { lat: 10.3001, lng: -0.3674 },
  Oti: { lat: 7.7801, lng: 0.2827 },
  "Bono East": { lat: 7.7500, lng: -1.0500 },
  Ahafo: { lat: 7.0833, lng: -2.3333 },
  "Western North": { lat: 6.3000, lng: -2.4000 },
  Bono: { lat: 7.4500, lng: -2.3500 },
};

type RegionData = {
  region: string;
  value: number;
  population?: number;
  facilitiesCount?: number;
};

type ChoroplethData = {
  title: string;
  metric: string;
  metricLabel?: string;
  regions: RegionData[];
  stage: string;
  progress: number;
};

type EnrichedRegion = RegionData & {
  lat: number;
  lng: number;
  normalizedValue: number;
};

function interpolateColor(
  t: number
): [number, number, number, number] {
  // Cool blue → warm red gradient
  const r = Math.round(59 + t * (239 - 59));
  const g = Math.round(130 + t * (68 - 130));
  const b = Math.round(246 + t * (68 - 246));
  return [r, g, b, 180];
}

export function RegionChoroplethRenderer({
  data,
}: {
  data: ChoroplethData;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const mapStyle = isDark ? DARK_STYLE : LIGHT_STYLE;

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

  const enrichedRegions: EnrichedRegion[] = useMemo(() => {
    if (data.regions.length === 0) {
      return [];
    }

    const maxValue = Math.max(...data.regions.map((r) => r.value), 1);
    const minValue = Math.min(...data.regions.map((r) => r.value));
    const range = maxValue - minValue || 1;

    return data.regions
      .map((r) => {
        const centroid = REGION_CENTROIDS[r.region];
        if (!centroid) {
          return null;
        }
        return {
          ...r,
          lat: centroid.lat,
          lng: centroid.lng,
          normalizedValue: (r.value - minValue) / range,
        };
      })
      .filter(Boolean) as EnrichedRegion[];
  }, [data.regions]);

  const layers = useMemo(() => {
    if (enrichedRegions.length === 0) {
      return [];
    }

    return [
      // Bubble per region, sized by value
      new ScatterplotLayer<EnrichedRegion>({
        id: "region-bubbles",
        data: enrichedRegions,
        getPosition: (d) => [d.lng, d.lat],
        getFillColor: (d) => interpolateColor(d.normalizedValue),
        getLineColor: [255, 255, 255, 100],
        getRadius: (d) => 12000 + d.normalizedValue * 30000,
        stroked: true,
        lineWidthMinPixels: 1,
        lineWidthMaxPixels: 2,
        pickable: true,
        autoHighlight: true,
        highlightColor: [255, 255, 255, 60],
      }),
      // Region labels
      new TextLayer<EnrichedRegion>({
        id: "region-labels",
        data: enrichedRegions,
        getPosition: (d) => [d.lng, d.lat],
        getText: (d) => d.region,
        getSize: 11,
        getColor: isDark ? [255, 255, 255, 200] : [0, 0, 0, 200],
        getTextAnchor: "middle" as const,
        getAlignmentBaseline: "center" as const,
        fontFamily: "var(--font-geist), system-ui, sans-serif",
        fontWeight: 600,
        outlineColor: isDark ? [0, 0, 0, 200] : [255, 255, 255, 200],
        outlineWidth: 2,
      }),
    ];
  }, [enrichedRegions, isDark]);

  const getTooltip = useMemo(
    () =>
      ({ object }: PickingInfo<EnrichedRegion>) => {
        if (!object) {
          return null;
        }

        const label = data.metricLabel ?? data.metric;
        const popLine = object.population
          ? `<div style="font-size:11px;color:#a1a1aa">Population: ${object.population.toLocaleString()}</div>`
          : "";
        const facLine =
          object.facilitiesCount !== undefined
            ? `<div style="font-size:11px;color:#a1a1aa">Facilities: ${object.facilitiesCount.toLocaleString()}</div>`
            : "";

        return {
          html: `<div style="font-family:var(--font-geist),system-ui,sans-serif;max-width:220px">
            <div style="font-weight:600;font-size:13px">${escapeHtml(object.region)}</div>
            <div style="font-size:12px;color:#60a5fa;margin-top:2px">${escapeHtml(label)}: ${typeof object.value === "number" ? object.value.toLocaleString() : String(object.value)}</div>
            ${popLine}
            ${facLine}
          </div>`,
          style: {
            backgroundColor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px",
            padding: "8px 12px",
            color: "white",
          },
        };
      },
    [data.metric, data.metricLabel]
  );

  if (!isMounted || !data) {
    return (
      <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <div className="size-6 rounded-full border-2 border-muted-foreground/30 border-t-cyan-500 animate-spin" />
          <span className="text-sm">Loading choropleth...</span>
        </div>
      </div>
    );
  }

  const sorted = [...enrichedRegions].sort(
    (a, b) => b.value - a.value
  );

  return (
    <div className="flex size-full flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground text-balance">
            {data.title}
          </h2>
          <p className="text-xs text-muted-foreground tabular-nums">
            {data.regions.length} regions ·{" "}
            {data.metricLabel ?? data.metric}
          </p>
        </div>
        {data.stage !== "complete" && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="size-3 rounded-full border-2 border-muted-foreground/30 border-t-cyan-500 animate-spin" />
            <span className="capitalize">{data.stage}...</span>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative flex-1 z-0">
        <MapErrorBoundary>
          <DeckGL
            controller
            getTooltip={getTooltip}
            initialViewState={viewState}
            layers={layers}
            style={{ position: "relative", width: "100%", height: "100%" }}
          >
            <MapGL key={mapStyle} mapStyle={mapStyle} />
          </DeckGL>
        </MapErrorBoundary>

        {/* Color scale legend */}
        <div className="absolute bottom-4 right-4 z-10 rounded-lg border border-border bg-background/90 px-3 py-2 backdrop-blur-sm">
          <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {data.metricLabel ?? data.metric}
          </p>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-muted-foreground tabular-nums">
              Low
            </span>
            <div
              className="h-2.5 w-24 rounded-sm"
              style={{
                background:
                  "linear-gradient(to right, #3B82F6, #a855f7, #EF4444)",
              }}
            />
            <span className="text-[10px] text-muted-foreground tabular-nums">
              High
            </span>
          </div>
        </div>
      </div>

      {/* Region ranking list */}
      {sorted.length > 0 && (
        <div className="max-h-40 overflow-y-auto border-t border-border bg-background/90">
          {sorted.map((r, i) => (
            <div
              className="flex items-center justify-between border-b border-border/50 px-4 py-1.5 text-xs"
              key={r.region}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="shrink-0 text-muted-foreground tabular-nums w-4 text-right">
                  {i + 1}
                </span>
                <span className="truncate font-medium text-foreground">
                  {r.region}
                </span>
              </div>
              <span className="ml-2 shrink-0 text-blue-400 tabular-nums font-medium">
                {typeof r.value === "number"
                  ? r.value.toLocaleString()
                  : String(r.value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
