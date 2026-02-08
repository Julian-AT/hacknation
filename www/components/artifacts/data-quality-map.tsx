"use client";

import type { MapViewState, PickingInfo } from "deck.gl";
import { DeckGL, ScatterplotLayer } from "deck.gl";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { Map as MapGL } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

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

type QualityPoint = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  city: string | null;
  qualityScore: number;
  missingFields: string[];
};

type DataQualityMapData = {
  title: string;
  facilities: QualityPoint[];
  summary?: {
    complete: number;
    partial: number;
    sparse: number;
  };
  stage: string;
  progress: number;
};

function getQualityColor(
  score: number
): [number, number, number, number] {
  if (score >= 0.7) {
    return [34, 197, 94, 220]; // green
  }
  if (score >= 0.4) {
    return [250, 204, 21, 220]; // yellow
  }
  return [239, 68, 68, 220]; // red
}

function getQualityLabel(score: number): string {
  if (score >= 0.7) {
    return "Complete";
  }
  if (score >= 0.4) {
    return "Partial";
  }
  return "Sparse";
}

export function DataQualityMapRenderer({
  data,
}: {
  data: DataQualityMapData;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const mapStyle = isDark ? DARK_STYLE : LIGHT_STYLE;

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

  const layers = useMemo(
    () => [
      new ScatterplotLayer<QualityPoint>({
        id: "quality",
        data: data.facilities,
        getPosition: (d) => [d.lng, d.lat],
        getFillColor: (d) => getQualityColor(d.qualityScore),
        getLineColor: [255, 255, 255, 80],
        getRadius: 500,
        radiusMinPixels: 4,
        radiusMaxPixels: 18,
        stroked: true,
        lineWidthMinPixels: 1,
        pickable: true,
        autoHighlight: true,
        highlightColor: [255, 255, 255, 80],
      }),
    ],
    [data.facilities]
  );

  const getTooltip = useMemo(
    () =>
      ({ object }: PickingInfo<QualityPoint>) => {
        if (!object) {
          return null;
        }

        const pct = Math.round(object.qualityScore * 100);
        const label = getQualityLabel(object.qualityScore);
        const color =
          object.qualityScore >= 0.7
            ? "#22c55e"
            : object.qualityScore >= 0.4
              ? "#facc15"
              : "#ef4444";

        const missingHtml =
          object.missingFields.length > 0
            ? `<div style="font-size:10px;color:#a1a1aa;margin-top:3px">Missing: ${escapeHtml(object.missingFields.join(", "))}</div>`
            : "";

        return {
          html: `<div style="font-family:var(--font-geist),system-ui,sans-serif;max-width:220px">
            <div style="font-weight:600;font-size:13px">${escapeHtml(object.name)}</div>
            ${object.city ? `<div style="font-size:11px;color:#a1a1aa">${escapeHtml(object.city)}</div>` : ""}
            <div style="font-size:12px;color:${color};margin-top:2px;font-weight:600">${label} — ${String(pct)}%</div>
            ${missingHtml}
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
    []
  );

  if (!isMounted || !data) {
    return (
      <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <div className="size-6 rounded-full border-2 border-muted-foreground/30 border-t-yellow-500 animate-spin" />
          <span className="text-sm">Loading quality map...</span>
        </div>
      </div>
    );
  }

  const summary = data.summary ?? {
    complete: data.facilities.filter((f) => f.qualityScore >= 0.7).length,
    partial: data.facilities.filter(
      (f) => f.qualityScore >= 0.4 && f.qualityScore < 0.7
    ).length,
    sparse: data.facilities.filter((f) => f.qualityScore < 0.4).length,
  };

  return (
    <div className="flex size-full flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground text-balance">
            {data.title}
          </h2>
          <p className="text-xs text-muted-foreground tabular-nums">
            <span className="text-green-400">{summary.complete} complete</span>
            {" · "}
            <span className="text-yellow-400">{summary.partial} partial</span>
            {" · "}
            <span className="text-red-400">{summary.sparse} sparse</span>
          </p>
        </div>
        {data.stage !== "complete" && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="size-3 rounded-full border-2 border-muted-foreground/30 border-t-yellow-500 animate-spin" />
            <span className="capitalize">{data.stage}...</span>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative flex-1 z-0">
        <DeckGL
          controller
          getTooltip={getTooltip}
          initialViewState={viewState}
          layers={layers}
          style={{ position: "relative", width: "100%", height: "100%" }}
        >
          <MapGL key={mapStyle} mapStyle={mapStyle} />
        </DeckGL>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5 rounded-lg border border-border bg-background/90 px-3 py-2 backdrop-blur-sm">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Data Quality
          </p>
          <div className="flex items-center gap-1.5">
            <div className="size-2.5 rounded-full bg-green-500" />
            <span className="text-[10px] text-muted-foreground tabular-nums">
              Complete (70%+)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2.5 rounded-full bg-yellow-400" />
            <span className="text-[10px] text-muted-foreground tabular-nums">
              Partial (40-69%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2.5 rounded-full bg-red-500" />
            <span className="text-[10px] text-muted-foreground tabular-nums">
              Sparse (&lt;40%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
