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

type DesertZone = {
  city: string;
  nearestProvider: string | null;
  distanceKm: number;
  coordinates: { lat: number; lng: number };
};

type Provider = {
  name: string;
  lat: number;
  lng: number;
  city: string | null;
};

type MedicalDesertData = {
  title: string;
  service: string;
  thresholdKm: number;
  totalProviders: number;
  providers: Provider[];
  desertZones: DesertZone[];
  stage: string;
  progress: number;
};

export function MedicalDesertRenderer({ data }: { data: MedicalDesertData }) {
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const mapStyle = isDark ? DARK_STYLE : LIGHT_STYLE;

  // Center map on first desert zone or Ghana
  const viewState: MapViewState = useMemo(() => {
    const center =
      data.desertZones.length > 0
        ? {
            lat: data.desertZones[0].coordinates.lat,
            lng: data.desertZones[0].coordinates.lng,
          }
        : { lat: 7.9465, lng: -1.0232 };

    return {
      latitude: center.lat,
      longitude: center.lng,
      zoom: 7,
      pitch: 0,
      bearing: 0,
    };
  }, [data.desertZones]);

  const layers = useMemo(() => {
    // Desert zone radius circles (drawn first, underneath)
    const desertRadiusLayer = new ScatterplotLayer<DesertZone>({
      id: "desert-radius",
      data: data.desertZones,
      getPosition: (d) => [d.coordinates.lng, d.coordinates.lat],
      getFillColor: [239, 68, 68, 20],
      getLineColor: [239, 68, 68, 80],
      getRadius: (d) => d.distanceKm * 1000,
      stroked: true,
      lineWidthMinPixels: 1,
      filled: true,
      pickable: false,
    });

    // Desert zone center markers (red dots)
    const desertMarkerLayer = new ScatterplotLayer<DesertZone>({
      id: "desert-markers",
      data: data.desertZones,
      getPosition: (d) => [d.coordinates.lng, d.coordinates.lat],
      getFillColor: [239, 68, 68, 220],
      getLineColor: [252, 165, 165, 255],
      getRadius: 600,
      radiusMinPixels: 6,
      radiusMaxPixels: 18,
      stroked: true,
      lineWidthMinPixels: 2,
      lineWidthMaxPixels: 3,
      pickable: true,
      autoHighlight: true,
      highlightColor: [255, 255, 255, 80],
    });

    // Provider markers (green dots)
    const providerLayer = new ScatterplotLayer<Provider>({
      id: "providers",
      data: data.providers,
      getPosition: (d) => [d.lng, d.lat],
      getFillColor: [34, 197, 94, 200],
      getLineColor: [134, 239, 172, 255],
      getRadius: 400,
      radiusMinPixels: 4,
      radiusMaxPixels: 14,
      stroked: true,
      lineWidthMinPixels: 1,
      lineWidthMaxPixels: 2,
      pickable: true,
      autoHighlight: true,
      highlightColor: [255, 255, 255, 80],
    });

    return [desertRadiusLayer, providerLayer, desertMarkerLayer];
  }, [data.desertZones, data.providers]);

  const getTooltip = useMemo(
    () =>
      ({ object, layer }: PickingInfo) => {
        if (!object) {
          return null;
        }

        if (layer?.id === "desert-markers") {
          const zone = object as DesertZone;
          const lines = [
            `<div style="font-weight:600;font-size:13px;color:#f87171;margin-bottom:2px">${escapeHtml(zone.city)}</div>`,
            `<div style="font-size:11px;color:#a1a1aa">Medical Desert</div>`,
            `<div style="font-size:11px;color:#a1a1aa">Nearest provider: ${String(zone.distanceKm)} km away</div>`,
          ];
          if (zone.nearestProvider) {
            lines.push(
              `<div style="font-size:11px;color:#a1a1aa">(${escapeHtml(zone.nearestProvider)})</div>`
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
        }

        if (layer?.id === "providers") {
          const provider = object as Provider;
          return {
            html: `<div style="font-family:var(--font-geist),system-ui,sans-serif;max-width:220px">
              <div style="font-weight:600;font-size:13px;margin-bottom:2px">${escapeHtml(provider.name)}</div>
              <div style="font-size:11px;color:#86efac">Provides ${escapeHtml(data.service)}</div>
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
    [data.service]
  );

  if (!isMounted || !data) {
    return (
      <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <div className="size-6 rounded-full border-2 border-muted-foreground/30 border-t-red-500 animate-spin" />
          <span className="text-sm">Analyzing coverage gaps...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex size-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground text-balance">
            {data.title}
          </h2>
          <p className="text-xs text-muted-foreground">
            Service: <span className="text-foreground">{data.service}</span>
            {" · "}Threshold:{" "}
            <span className="text-foreground tabular-nums">
              {data.thresholdKm} km
            </span>
            {" · "}Providers:{" "}
            <span className="text-foreground tabular-nums">
              {data.totalProviders}
            </span>
          </p>
        </div>
        {data.stage !== "complete" && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="size-3 rounded-full border-2 border-muted-foreground/30 border-t-red-500 animate-spin" />
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
          <div className="mb-2 font-semibold">Legend</div>
          <div className="mb-1 flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-red-500" />
            <span>Desert zone</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-green-500" />
            <span>Provider</span>
          </div>
        </div>
      </div>

      {/* Desert zones list */}
      {data.desertZones.length > 0 && (
        <div className="max-h-40 overflow-y-auto border-t border-border bg-background/90">
          {data.desertZones.map((zone) => (
            <div
              className="flex items-center justify-between border-b border-border/50 px-4 py-2 text-xs"
              key={zone.city}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-red-500" />
                  <span className="truncate font-medium text-foreground">
                    {zone.city}
                  </span>
                </div>
                {zone.nearestProvider && (
                  <div className="ml-3.5 truncate text-muted-foreground">
                    Nearest: {zone.nearestProvider}
                  </div>
                )}
              </div>
              <span className="ml-2 shrink-0 font-medium text-red-400 tabular-nums">
                {zone.distanceKm} km
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
