"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const LeafletMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false },
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false },
);

const desertIcon = L.divIcon({
  html: '<div style="background:#ef4444;width:14px;height:14px;border-radius:50%;border:2px solid #fca5a5;box-shadow:0 0 8px rgba(239,68,68,0.5)"></div>',
  className: "",
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const providerIcon = L.divIcon({
  html: '<div style="background:#22c55e;width:10px;height:10px;border-radius:50%;border:2px solid #86efac"></div>',
  className: "",
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

type MedicalDesertData = {
  title: string;
  service: string;
  thresholdKm: number;
  totalProviders: number;
  providers: Array<{
    name: string;
    lat: number;
    lng: number;
    city: string | null;
  }>;
  desertZones: Array<{
    city: string;
    nearestProvider: string | null;
    distanceKm: number;
    coordinates: { lat: number; lng: number };
  }>;
  stage: string;
  progress: number;
};

export function MedicalDesertRenderer({ data }: { data: MedicalDesertData }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !data) {
    return (
      <div className="flex size-full items-center justify-center bg-zinc-900 text-zinc-500">
        <div className="flex flex-col items-center gap-2">
          <div className="size-6 rounded-full border-2 border-zinc-600 border-t-red-500 animate-spin" />
          <span className="text-sm">Analyzing coverage gaps...</span>
        </div>
      </div>
    );
  }

  // Center map on Ghana or first desert zone
  const center: [number, number] =
    data.desertZones.length > 0
      ? [
          data.desertZones[0].coordinates.lat,
          data.desertZones[0].coordinates.lng,
        ]
      : [7.9465, -1.0232];

  return (
    <div className="flex size-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-white text-balance">
            {data.title}
          </h2>
          <p className="text-xs text-zinc-400">
            Service: <span className="text-zinc-300">{data.service}</span>
            {" · "}Threshold:{" "}
            <span className="text-zinc-300 tabular-nums">{data.thresholdKm} km</span>
            {" · "}Providers:{" "}
            <span className="text-zinc-300 tabular-nums">{data.totalProviders}</span>
          </p>
        </div>
        {data.stage !== "complete" && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <div className="size-3 rounded-full border-2 border-zinc-600 border-t-red-500 animate-spin" />
            <span className="capitalize">{data.stage}...</span>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative flex-1 z-0">
        <MapContainer
          center={center}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          zoom={7}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Desert zones as red markers + radius circles */}
          {data.desertZones.map((zone) => (
            <div key={zone.city}>
              <Circle
                center={[zone.coordinates.lat, zone.coordinates.lng]}
                color="#ef4444"
                fillColor="#ef4444"
                fillOpacity={0.08}
                radius={zone.distanceKm * 1000}
                weight={1}
              />
              <LeafletMarker
                icon={desertIcon}
                position={[zone.coordinates.lat, zone.coordinates.lng]}
              >
                <Popup>
                  <div className="text-sm">
                    <strong className="block text-base text-red-600">
                      {zone.city}
                    </strong>
                    <span className="block text-zinc-600">
                      Medical Desert
                    </span>
                    <span className="block text-zinc-500 tabular-nums">
                      Nearest provider: {zone.distanceKm} km away
                    </span>
                    {zone.nearestProvider && (
                      <span className="block text-zinc-500">
                        ({zone.nearestProvider})
                      </span>
                    )}
                  </div>
                </Popup>
              </LeafletMarker>
            </div>
          ))}

          {/* Provider markers (green) */}
          {data.providers.map((p, i) => (
            <LeafletMarker
              icon={providerIcon}
              key={`provider-${p.name}-${i}`}
              position={[p.lat, p.lng]}
            >
              <Popup>
                <div className="text-sm">
                  <strong className="block">{p.name}</strong>
                  <span className="text-green-600">
                    Provides {data.service}
                  </span>
                </div>
              </Popup>
            </LeafletMarker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 z-10 rounded-lg border border-zinc-800 bg-black/70 p-3 text-xs text-zinc-300 backdrop-blur-sm">
          <div className="mb-2 font-semibold text-white">Legend</div>
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
        <div className="max-h-40 overflow-y-auto border-t border-zinc-800 bg-zinc-950/90">
          {data.desertZones.map((zone) => (
            <div
              className="flex items-center justify-between border-b border-zinc-800/50 px-4 py-2 text-xs"
              key={zone.city}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-red-500" />
                  <span className="truncate font-medium text-zinc-200">
                    {zone.city}
                  </span>
                </div>
                {zone.nearestProvider && (
                  <div className="ml-3.5 text-zinc-500 truncate">
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
