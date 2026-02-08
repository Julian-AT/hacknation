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

type FacilityPoint = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  city: string | null;
  type: string | null;
  specialties: string[];
  hasTargetSpecialty: boolean;
};

type GapZone = {
  city: string;
  lat: number;
  lng: number;
};

type SpecialtyMapData = {
  title: string;
  specialty: string;
  totalWithSpecialty: number;
  facilities: FacilityPoint[];
  gapZones: GapZone[];
  stage: string;
  progress: number;
};

export function SpecialtyMapRenderer({ data }: { data: SpecialtyMapData }) {
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const mapStyle = isDark ? DARK_STYLE : LIGHT_STYLE;

  const center = useMemo(() => {
    const all = [...data.facilities, ...data.gapZones];
    if (all.length === 0) {
      return { lat: 7.9465, lng: -1.0232 };
    }
    const latSum = all.reduce((s, f) => s + f.lat, 0);
    const lngSum = all.reduce((s, f) => s + f.lng, 0);
    return { lat: latSum / all.length, lng: lngSum / all.length };
  }, [data.facilities, data.gapZones]);

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
    const result = [];

    // Gap zone markers (red pulsing)
    if (data.gapZones.length > 0) {
      result.push(
        new ScatterplotLayer<GapZone>({
          id: "gap-zones",
          data: data.gapZones,
          getPosition: (d) => [d.lng, d.lat],
          getFillColor: [239, 68, 68, 60],
          getLineColor: [239, 68, 68, 160],
          getRadius: 15000,
          stroked: true,
          lineWidthMinPixels: 1,
          pickable: true,
          autoHighlight: true,
          highlightColor: [255, 255, 255, 40],
        })
      );
    }

    // Facilities WITHOUT the target specialty (muted gray)
    const withoutSpecialty = data.facilities.filter(
      (f) => !f.hasTargetSpecialty
    );
    if (withoutSpecialty.length > 0) {
      result.push(
        new ScatterplotLayer<FacilityPoint>({
          id: "facilities-other",
          data: withoutSpecialty,
          getPosition: (d) => [d.lng, d.lat],
          getFillColor: [120, 120, 120, 100],
          getLineColor: [180, 180, 180, 150],
          getRadius: 400,
          radiusMinPixels: 3,
          radiusMaxPixels: 12,
          stroked: true,
          lineWidthMinPixels: 1,
          pickable: true,
          autoHighlight: true,
          highlightColor: [255, 255, 255, 60],
        })
      );
    }

    // Facilities WITH the target specialty (bright green)
    const withSpecialty = data.facilities.filter((f) => f.hasTargetSpecialty);
    if (withSpecialty.length > 0) {
      result.push(
        new ScatterplotLayer<FacilityPoint>({
          id: "facilities-specialty",
          data: withSpecialty,
          getPosition: (d) => [d.lng, d.lat],
          getFillColor: [34, 197, 94, 220],
          getLineColor: [134, 239, 172, 255],
          getRadius: 600,
          radiusMinPixels: 5,
          radiusMaxPixels: 20,
          stroked: true,
          lineWidthMinPixels: 1,
          lineWidthMaxPixels: 2,
          pickable: true,
          autoHighlight: true,
          highlightColor: [255, 255, 255, 80],
        })
      );
    }

    return result;
  }, [data.facilities, data.gapZones]);

  const getTooltip = useMemo(
    () =>
      ({ object, layer }: PickingInfo<FacilityPoint | GapZone>) => {
        if (!object) {
          return null;
        }

        if (layer?.id === "gap-zones") {
          const gap = object as GapZone;
          return {
            html: `<div style="font-family:var(--font-geist),system-ui,sans-serif;max-width:200px">
              <div style="font-weight:600;font-size:13px;color:#ef4444">${escapeHtml(gap.city)}</div>
              <div style="font-size:11px;color:#fca5a5;margin-top:2px">Specialty gap zone</div>
              <div style="font-size:11px;color:#a1a1aa">No ${escapeHtml(data.specialty)} providers nearby</div>
            </div>`,
            style: {
              backgroundColor: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "8px",
              padding: "8px 12px",
              color: "white",
            },
          };
        }

        const fac = object as FacilityPoint;
        const color = fac.hasTargetSpecialty ? "#22c55e" : "#a1a1aa";
        const specialtiesStr =
          fac.specialties.length > 0 ? fac.specialties.join(", ") : "none";
        return {
          html: `<div style="font-family:var(--font-geist),system-ui,sans-serif;max-width:220px">
            <div style="font-weight:600;font-size:13px">${escapeHtml(fac.name)}</div>
            ${fac.type ? `<div style="font-size:11px;color:${color}">${escapeHtml(fac.type)}</div>` : ""}
            ${fac.city ? `<div style="font-size:11px;color:#a1a1aa">${escapeHtml(fac.city)}</div>` : ""}
            <div style="font-size:11px;color:#a1a1aa;margin-top:2px">Specialties: ${escapeHtml(specialtiesStr)}</div>
          </div>`,
          style: {
            backgroundColor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            border: `1px solid rgba(255,255,255,0.15)`,
            borderRadius: "8px",
            padding: "8px 12px",
            color: "white",
          },
        };
      },
    [data.specialty]
  );

  if (!isMounted || !data) {
    return (
      <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <div className="size-6 rounded-full border-2 border-muted-foreground/30 border-t-green-500 animate-spin" />
          <span className="text-sm">Loading specialty map...</span>
        </div>
      </div>
    );
  }

  const withCount = data.facilities.filter((f) => f.hasTargetSpecialty).length;
  const withoutCount = data.facilities.length - withCount;

  return (
    <div className="flex size-full flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground text-balance">
            {data.title}
          </h2>
          <p className="text-xs text-muted-foreground tabular-nums">
            <span className="text-green-400">{withCount} with</span>
            {" · "}
            <span>{withoutCount} without</span>
            {data.gapZones.length > 0 && (
              <>
                {" · "}
                <span className="text-red-400">
                  {data.gapZones.length} gap zones
                </span>
              </>
            )}
          </p>
        </div>
        {data.stage !== "complete" && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="size-3 rounded-full border-2 border-muted-foreground/30 border-t-green-500 animate-spin" />
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
            {data.specialty}
          </p>
          <div className="flex items-center gap-1.5">
            <div className="size-2.5 rounded-full bg-green-500" />
            <span className="text-[10px] text-muted-foreground">
              Has specialty
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2.5 rounded-full bg-zinc-500" />
            <span className="text-[10px] text-muted-foreground">
              Other facilities
            </span>
          </div>
          {data.gapZones.length > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-full bg-red-500/60" />
              <span className="text-[10px] text-muted-foreground">
                Gap zone
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Gap zones list */}
      {data.gapZones.length > 0 && (
        <div className="max-h-32 overflow-y-auto border-t border-border bg-background/90">
          <div className="px-4 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-red-400">
              Gap zones — no {data.specialty} providers
            </p>
          </div>
          {data.gapZones.map((g) => (
            <div
              className="flex items-center justify-between border-b border-border/50 px-4 py-1.5 text-xs"
              key={g.city}
            >
              <span className="text-foreground">{g.city}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
