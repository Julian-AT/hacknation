"use client";

import type { MapViewState } from "deck.gl";
import { DeckGL, HeatmapLayer } from "deck.gl";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { Map as MapGL } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapErrorBoundary } from "./map-error-boundary";

const DARK_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const LIGHT_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

type HeatmapPoint = {
  lat: number;
  lng: number;
  weight: number;
  name?: string;
  city?: string | null;
};

type HeatmapData = {
  title: string;
  weightMetric: string;
  facilities: HeatmapPoint[];
  stage: string;
  progress: number;
};

const METRIC_LABELS: Record<string, string> = {
  count: "Facility Count",
  beds: "Bed Capacity",
  doctors: "Doctor Count",
};

export function HeatmapRenderer({ data }: { data: HeatmapData }) {
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const mapStyle = isDark ? DARK_STYLE : LIGHT_STYLE;

  // Calculate center from data
  const center = useMemo(() => {
    if (data.facilities.length === 0) {
      return { lat: 7.9465, lng: -1.0232 };
    }
    const latSum = data.facilities.reduce((s, f) => s + f.lat, 0);
    const lngSum = data.facilities.reduce((s, f) => s + f.lng, 0);
    return {
      lat: latSum / data.facilities.length,
      lng: lngSum / data.facilities.length,
    };
  }, [data.facilities]);

  const viewState: MapViewState = useMemo(
    () => ({
      latitude: center.lat,
      longitude: center.lng,
      zoom: 7,
      pitch: 0,
      bearing: 0,
    }),
    [center.lat, center.lng]
  );

  const layers = useMemo(() => {
    if (data.facilities.length === 0) {
      return [];
    }

    const maxWeight = Math.max(...data.facilities.map((f) => f.weight), 1);

    return [
      new HeatmapLayer<HeatmapPoint>({
        id: "heatmap",
        data: data.facilities,
        getPosition: (d) => [d.lng, d.lat],
        getWeight: (d) => d.weight / maxWeight,
        radiusPixels: 60,
        intensity: 1,
        threshold: 0.05,
        colorRange: [
          [1, 152, 189, 255],
          [73, 227, 206, 255],
          [216, 254, 181, 255],
          [254, 237, 177, 255],
          [254, 173, 84, 255],
          [209, 55, 78, 255],
        ],
        aggregation: "SUM",
      }),
    ];
  }, [data.facilities]);

  if (!isMounted || !data) {
    return (
      <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <div className="size-6 rounded-full border-2 border-muted-foreground/30 border-t-orange-500 animate-spin" />
          <span className="text-sm">Loading heatmap...</span>
        </div>
      </div>
    );
  }

  const totalWeight = data.facilities.reduce((s, f) => s + f.weight, 0);
  const metricLabel = METRIC_LABELS[data.weightMetric] ?? data.weightMetric;

  return (
    <div className="flex size-full flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground text-balance">
            {data.title}
          </h2>
          <p className="text-xs text-muted-foreground tabular-nums">
            {data.facilities.length} facilities · Weighted by{" "}
            {metricLabel.toLowerCase()} · Total: {totalWeight.toLocaleString()}
          </p>
        </div>
        {data.stage !== "complete" && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="size-3 rounded-full border-2 border-muted-foreground/30 border-t-orange-500 animate-spin" />
            <span className="capitalize">{data.stage}...</span>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative flex-1 z-0">
        <MapErrorBoundary>
          <DeckGL
            controller
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
            {metricLabel}
          </p>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-muted-foreground tabular-nums">
              Low
            </span>
            <div
              className="h-2.5 w-24 rounded-sm"
              style={{
                background:
                  "linear-gradient(to right, #0198BD, #49E3CE, #D8FEB5, #FEEDB1, #FEAD54, #D1374E)",
              }}
            />
            <span className="text-[10px] text-muted-foreground tabular-nums">
              High
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
