"use client";

import type { MapViewState, PickingInfo } from "deck.gl";
import { DeckGL, GeoJsonLayer, ScatterplotLayer } from "deck.gl";
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

type IsochroneRing = {
  rangeMinutes: number;
  geojson: Record<string, unknown>;
};

type ReachableFacility = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: string | null;
  travelTimeMinutes?: number;
  withinRing: number;
};

type AccessibilityMapData = {
  title: string;
  center: { lat: number; lng: number };
  facilityName?: string;
  profile: string;
  isochrones: IsochroneRing[];
  reachableFacilities: ReachableFacility[];
  stage: string;
  progress: number;
};

/** Teal-based color scale for isochrone rings (innermost → outermost) */
const RING_COLORS: Record<number, [number, number, number, number]> = {
  30: [0, 150, 136, 140],
  60: [77, 182, 172, 100],
  120: [178, 223, 219, 70],
};

/** Border colors matching fills but more opaque */
const RING_LINE_COLORS: Record<number, [number, number, number, number]> = {
  30: [0, 150, 136, 220],
  60: [77, 182, 172, 180],
  120: [178, 223, 219, 140],
};

/** Get color for a given ring range, falling back to a default */
function getRingFillColor(minutes: number): [number, number, number, number] {
  if (minutes <= 30) return RING_COLORS[30];
  if (minutes <= 60) return RING_COLORS[60];
  return RING_COLORS[120];
}

function getRingLineColor(minutes: number): [number, number, number, number] {
  if (minutes <= 30) return RING_LINE_COLORS[30];
  if (minutes <= 60) return RING_LINE_COLORS[60];
  return RING_LINE_COLORS[120];
}

const PROFILE_LABELS: Record<string, string> = {
  "driving-car": "Driving",
  "foot-walking": "Walking",
  "cycling-regular": "Cycling",
};

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${String(minutes)}min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${String(hrs)}hr`;
  return `${String(hrs)}hr ${String(mins)}min`;
}

export function AccessibilityMapRenderer({
  data,
}: {
  data: AccessibilityMapData;
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
      latitude: data.center.lat,
      longitude: data.center.lng,
      zoom: 9,
      pitch: 0,
      bearing: 0,
    }),
    [data.center.lat, data.center.lng]
  );

  const layers = useMemo(() => {
    const result: (
      | GeoJsonLayer
      | ScatterplotLayer<ReachableFacility>
      | ScatterplotLayer<[number, number]>
    )[] = [];

    // Isochrone polygons — render largest first (they're already sorted)
    const sortedIsos = [...data.isochrones].sort(
      (a, b) => b.rangeMinutes - a.rangeMinutes
    );

    for (const iso of sortedIsos) {
      result.push(
        new GeoJsonLayer({
          id: `isochrone-${String(iso.rangeMinutes)}`,
          data: iso.geojson as unknown as GeoJSON.Feature,
          filled: true,
          stroked: true,
          getFillColor: getRingFillColor(iso.rangeMinutes),
          getLineColor: getRingLineColor(iso.rangeMinutes),
          getLineWidth: 2,
          lineWidthMinPixels: 1,
          pickable: true,
          autoHighlight: true,
          highlightColor: [255, 255, 255, 40],
        })
      );
    }

    // Reachable facilities (green markers)
    if (data.reachableFacilities.length > 0) {
      result.push(
        new ScatterplotLayer<ReachableFacility>({
          id: "reachable-facilities",
          data: data.reachableFacilities,
          getPosition: (d) => [d.lng, d.lat],
          getFillColor: [34, 197, 94, 200],
          getLineColor: [134, 239, 172, 255],
          getRadius: 400,
          radiusMinPixels: 4,
          radiusMaxPixels: 12,
          stroked: true,
          lineWidthMinPixels: 1,
          pickable: true,
          autoHighlight: true,
          highlightColor: [255, 255, 255, 80],
        })
      );
    }

    // Center facility marker (blue dot, on top)
    result.push(
      new ScatterplotLayer<[number, number]>({
        id: "center-marker",
        data: [[data.center.lng, data.center.lat]],
        getPosition: (d) => d,
        getFillColor: [59, 130, 246, 240],
        getLineColor: [147, 197, 253, 255],
        getRadius: 600,
        radiusMinPixels: 7,
        radiusMaxPixels: 20,
        stroked: true,
        lineWidthMinPixels: 2,
        lineWidthMaxPixels: 3,
        pickable: false,
      })
    );

    return result;
  }, [
    data.isochrones,
    data.reachableFacilities,
    data.center.lat,
    data.center.lng,
  ]);

  const getTooltip = useMemo(
    () =>
      ({ object, layer }: PickingInfo) => {
        if (!object) return null;

        // Isochrone polygon hover
        if (layer?.id.startsWith("isochrone-")) {
          const minutes = Number(layer.id.split("-").at(1));
          const props = (object as { properties?: { area?: number } })
            .properties;
          const areaKm2 = props?.area
            ? Math.round(props.area / 1_000_000)
            : null;
          return {
            html: `<div style="font-family:var(--font-geist),system-ui,sans-serif;max-width:200px">
              <div style="font-weight:600;font-size:13px;margin-bottom:2px">${formatMinutes(minutes)} travel zone</div>
              ${areaKm2 ? `<div style="font-size:11px;color:#a1a1aa">Area: ${String(areaKm2)} km²</div>` : ""}
              <div style="font-size:11px;color:#a1a1aa">Mode: ${escapeHtml(PROFILE_LABELS[data.profile] ?? data.profile)}</div>
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
        }

        // Facility marker hover
        if (layer?.id === "reachable-facilities") {
          const fac = object as ReachableFacility;
          return {
            html: `<div style="font-family:var(--font-geist),system-ui,sans-serif;max-width:220px">
              <div style="font-weight:600;font-size:13px;margin-bottom:2px">${escapeHtml(fac.name)}</div>
              ${fac.type ? `<div style="font-size:11px;color:#a1a1aa">${escapeHtml(fac.type)}</div>` : ""}
              ${fac.travelTimeMinutes !== undefined ? `<div style="font-size:11px;color:#86efac">Travel: ${formatMinutes(fac.travelTimeMinutes)}</div>` : `<div style="font-size:11px;color:#86efac">Within ${formatMinutes(fac.withinRing)} zone</div>`}
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
        }

        return null;
      },
    [data.profile]
  );

  if (!isMounted || !data) {
    return (
      <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <div className="size-6 rounded-full border-2 border-muted-foreground/30 border-t-teal-500 animate-spin" />
          <span className="text-sm">Computing travel zones...</span>
        </div>
      </div>
    );
  }

  const sortedRings = [...data.isochrones].sort(
    (a, b) => a.rangeMinutes - b.rangeMinutes
  );
  const sortedFacilities = [...data.reachableFacilities].sort(
    (a, b) => (a.travelTimeMinutes ?? a.withinRing) - (b.travelTimeMinutes ?? b.withinRing)
  );
  const profileLabel = PROFILE_LABELS[data.profile] ?? data.profile;

  return (
    <div className="flex size-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground text-balance">
            {data.title}
          </h2>
          <p className="text-xs text-muted-foreground">
            {data.facilityName && (
              <>
                <span className="text-foreground">{data.facilityName}</span>
                {" · "}
              </>
            )}
            <span className="inline-flex items-center rounded bg-teal-500/15 px-1.5 py-0.5 text-[10px] font-medium text-teal-600 dark:text-teal-400">
              {profileLabel}
            </span>
            {" · "}
            <span className="tabular-nums">
              {data.reachableFacilities.length} reachable
            </span>
          </p>
        </div>
        {data.stage !== "complete" && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="size-3 rounded-full border-2 border-muted-foreground/30 border-t-teal-500 animate-spin" />
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
        <div className="absolute bottom-4 right-4 z-10 rounded-lg border border-border bg-background/70 p-3 text-xs text-foreground backdrop-blur-sm">
          <div className="mb-2 font-semibold">Travel Time Zones</div>
          {sortedRings.map((ring) => (
            <div
              className="mb-1 flex items-center gap-2"
              key={ring.rangeMinutes}
            >
              <span
                className="size-3 rounded-sm border"
                style={{
                  backgroundColor: `rgba(${getRingFillColor(ring.rangeMinutes).join(",")})`,
                  borderColor: `rgba(${getRingLineColor(ring.rangeMinutes).join(",")})`,
                }}
              />
              <span>{formatMinutes(ring.rangeMinutes)}</span>
            </div>
          ))}
          <div className="mt-1.5 flex items-center gap-2 border-t border-border/50 pt-1.5">
            <span className="size-2.5 rounded-full bg-blue-500" />
            <span>Origin</span>
          </div>
          {data.reachableFacilities.length > 0 && (
            <div className="mt-1 flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-green-500" />
              <span>Reachable facility</span>
            </div>
          )}
        </div>
      </div>

      {/* Reachable facilities list */}
      {sortedFacilities.length > 0 && (
        <div className="max-h-40 overflow-y-auto border-t border-border bg-background/90">
          {sortedFacilities.map((fac) => (
            <div
              className="flex items-center justify-between border-b border-border/50 px-4 py-2 text-xs"
              key={fac.id}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-green-500" />
                  <span className="truncate font-medium text-foreground">
                    {fac.name}
                  </span>
                </div>
                {fac.type && (
                  <div className="ml-3.5 truncate text-muted-foreground">
                    {fac.type}
                  </div>
                )}
              </div>
              <span className="ml-2 shrink-0 font-medium text-teal-500 tabular-nums">
                {fac.travelTimeMinutes !== undefined
                  ? formatMinutes(fac.travelTimeMinutes)
                  : `≤ ${formatMinutes(fac.withinRing)}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
