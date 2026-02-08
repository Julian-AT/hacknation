"use client";

import { useState, useEffect, useMemo } from "react";
import { DeckGL, ScatterplotLayer } from "deck.gl";
import type { MapViewState, PickingInfo } from "deck.gl";
import { Map } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

const DARK_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

type FacilityItem = {
  id: number;
  name: string;
  type: string | null;
  city: string | null;
  lat: number;
  lng: number;
  distanceKm?: number;
  doctors: number | null;
  beds: number | null;
};

type FacilityMapData = {
  title: string;
  center: { lat: number; lng: number };
  zoom: number;
  radiusKm?: number;
  facilities: FacilityItem[];
  stage: string;
  progress: number;
};

export function FacilityMapRenderer({ data }: { data: FacilityMapData }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const viewState: MapViewState = useMemo(
    () => ({
      latitude: data.center.lat,
      longitude: data.center.lng,
      zoom: data.zoom,
      pitch: 0,
      bearing: 0,
    }),
    [data.center.lat, data.center.lng, data.zoom],
  );

  const layers = useMemo(() => {
    const facilityLayer = new ScatterplotLayer<FacilityItem>({
      id: "facilities",
      data: data.facilities,
      getPosition: (d) => [d.lng, d.lat],
      getFillColor: [59, 130, 246, 200],
      getLineColor: [147, 197, 253, 255],
      getRadius: 500,
      radiusMinPixels: 5,
      radiusMaxPixels: 20,
      stroked: true,
      lineWidthMinPixels: 1,
      lineWidthMaxPixels: 2,
      pickable: true,
      autoHighlight: true,
      highlightColor: [255, 255, 255, 80],
    });

    const result = [facilityLayer];

    // Radius circle layer (if radiusKm is specified)
    if (data.radiusKm) {
      const radiusLayer = new ScatterplotLayer({
        id: "search-radius",
        data: [
          {
            position: [data.center.lng, data.center.lat] as [number, number],
          },
        ],
        getPosition: (d: { position: [number, number] }) => d.position,
        getFillColor: [59, 130, 246, 12],
        getLineColor: [59, 130, 246, 100],
        getRadius: data.radiusKm * 1000,
        stroked: true,
        lineWidthMinPixels: 1,
        filled: true,
        pickable: false,
      });
      result.unshift(radiusLayer);
    }

    return result;
  }, [data.facilities, data.radiusKm, data.center.lat, data.center.lng]);

  const getTooltip = useMemo(
    () =>
      ({ object }: PickingInfo<FacilityItem>) => {
        if (!object) return null;

        const lines = [
          `<div style="font-weight:600;font-size:13px;margin-bottom:2px">${object.name}</div>`,
        ];
        if (object.type) {
          lines.push(
            `<div style="font-size:11px;color:#93c5fd">${object.type}</div>`,
          );
        }
        if (object.city) {
          lines.push(
            `<div style="font-size:11px;color:#a1a1aa">${object.city}</div>`,
          );
        }
        if (object.doctors !== null && object.doctors > 0) {
          lines.push(
            `<div style="font-size:11px;color:#a1a1aa">${String(object.doctors)} doctors</div>`,
          );
        }
        if (object.beds !== null && object.beds > 0) {
          lines.push(
            `<div style="font-size:11px;color:#a1a1aa">${String(object.beds)} beds</div>`,
          );
        }
        if (object.distanceKm !== undefined) {
          lines.push(
            `<div style="font-size:11px;color:#60a5fa;margin-top:2px">${String(object.distanceKm)} km away</div>`,
          );
        }

        return {
          html: `<div style="font-family:var(--font-geist),system-ui,sans-serif;max-width:220px">${lines.join("")}</div>`,
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
    [],
  );

  if (!isMounted || !data) {
    return (
      <div className="flex size-full items-center justify-center bg-zinc-900 text-zinc-500">
        <div className="flex flex-col items-center gap-2">
          <div className="size-6 rounded-full border-2 border-zinc-600 border-t-blue-500 animate-spin" />
          <span className="text-sm">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex size-full flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-white text-balance">
            {data.title}
          </h2>
          <p className="text-xs text-zinc-400 tabular-nums">
            {data.facilities.length} facilities
            {data.radiusKm ? ` within ${String(data.radiusKm)} km` : ""}
          </p>
        </div>
        {data.stage !== "complete" && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <div className="size-3 rounded-full border-2 border-zinc-600 border-t-blue-500 animate-spin" />
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
          <Map mapStyle={DARK_STYLE} />
        </DeckGL>
      </div>

      {/* Facility list sidebar */}
      {data.facilities.length > 0 && (
        <div className="max-h-48 overflow-y-auto border-t border-zinc-800 bg-zinc-950/90">
          {data.facilities.map((f) => (
            <div
              className="flex items-center justify-between border-b border-zinc-800/50 px-4 py-2 text-xs"
              key={f.id}
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-zinc-200">
                  {f.name}
                </div>
                <div className="text-zinc-500">
                  {f.type}
                  {f.city ? ` · ${f.city}` : ""}
                </div>
              </div>
              {f.distanceKm !== undefined && (
                <span className="ml-2 shrink-0 text-blue-400 tabular-nums">
                  {f.distanceKm} km
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
