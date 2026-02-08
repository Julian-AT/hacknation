"use client";

import type { MapViewState, PickingInfo } from "deck.gl";
import { DeckGL, FlyToInterpolator, ScatterplotLayer } from "deck.gl";
import { useEffect, useMemo, useRef, useState } from "react";
import { Map as MapGL } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useVF } from "@/lib/vf-context";
import { MapErrorBoundary } from "@/components/artifacts/map-error-boundary";

const DARK_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

function escapeHtml(str: string): string {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

type Facility = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type?: string;
  city?: string;
  distanceKm?: number;
};

export default function DeckMap() {
  const { mapFacilities, mapCenter, mapZoom, highlightedFacilityId } = useVF();
  const [isMounted, setIsMounted] = useState(false);
  const [internalViewState, setInternalViewState] = useState<MapViewState>({
    latitude: mapCenter[0],
    longitude: mapCenter[1],
    zoom: mapZoom,
    pitch: 0,
    bearing: 0,
  });

  const prevCenterRef = useRef(mapCenter);
  const prevZoomRef = useRef(mapZoom);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fly to new position when context center/zoom changes
  useEffect(() => {
    const centerChanged =
      prevCenterRef.current[0] !== mapCenter[0] ||
      prevCenterRef.current[1] !== mapCenter[1];
    const zoomChanged = prevZoomRef.current !== mapZoom;

    if (centerChanged || zoomChanged) {
      setInternalViewState((prev) => ({
        ...prev,
        latitude: mapCenter[0],
        longitude: mapCenter[1],
        zoom: mapZoom,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator(),
      }));
      prevCenterRef.current = mapCenter;
      prevZoomRef.current = mapZoom;
    }
  }, [mapCenter, mapZoom]);

  const layers = useMemo(() => {
    const isDesert = (d: Facility) =>
      (d.type ?? "").toLowerCase().includes("desert") ||
      (d.type ?? "").toLowerCase().includes("gap");

    return [
      new ScatterplotLayer<Facility>({
        id: "facilities",
        data: mapFacilities,
        getPosition: (d) => [d.lng, d.lat],
        getFillColor: (d) =>
          isDesert(d) ? [239, 68, 68, 200] : [59, 130, 246, 200],
        getLineColor: (d) =>
          isDesert(d) ? [252, 165, 165, 255] : [147, 197, 253, 255],
        getRadius: (d) =>
          d.id === highlightedFacilityId ? 800 : isDesert(d) ? 600 : 500,
        radiusMinPixels: 4,
        radiusMaxPixels: 25,
        stroked: true,
        lineWidthMinPixels: 1,
        lineWidthMaxPixels: 2,
        pickable: true,
        autoHighlight: true,
        highlightColor: [255, 255, 255, 80],
      }),
    ];
  }, [mapFacilities, highlightedFacilityId]);

  const getTooltip = useMemo(
    () =>
      ({ object }: PickingInfo<Facility>) => {
        if (!object) {
          return null;
        }

        const isDesert =
          (object.type ?? "").toLowerCase().includes("desert") ||
          (object.type ?? "").toLowerCase().includes("gap");

        return {
          html: `<div style="font-family:var(--font-geist),system-ui,sans-serif;max-width:220px">
          <div style="font-weight:600;font-size:13px;margin-bottom:2px">${escapeHtml(object.name)}</div>
          <div style="font-size:11px;color:${isDesert ? "#f87171" : "#93c5fd"}">${escapeHtml(object.type ?? "Facility")}</div>
          ${object.city ? `<div style="font-size:11px;color:#a1a1aa">${escapeHtml(object.city)}</div>` : ""}
          ${object.distanceKm !== undefined ? `<div style="font-size:11px;color:#60a5fa;margin-top:2px">${object.distanceKm} km away</div>` : ""}
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

  if (!isMounted) {
    return (
      <div className="flex size-full items-center justify-center bg-zinc-950 text-zinc-500">
        <div className="flex flex-col items-center gap-2">
          <div className="size-6 rounded-full border-2 border-zinc-700 border-t-blue-500 animate-spin" />
          <span className="text-sm">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full bg-zinc-950">
      <MapErrorBoundary>
        <DeckGL
          controller
          getTooltip={getTooltip}
          layers={layers}
          onViewStateChange={({ viewState }) =>
            setInternalViewState(viewState as MapViewState)
          }
          style={{ position: "relative", width: "100%", height: "100%" }}
          viewState={internalViewState}
        >
          <MapGL mapStyle={DARK_STYLE} />
        </DeckGL>
      </MapErrorBoundary>
    </div>
  );
}
