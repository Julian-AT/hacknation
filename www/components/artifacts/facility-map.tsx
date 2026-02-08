"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
const MapUpdater = dynamic(
  () => import("../vf-ui/MapUpdater"),
  { ssr: false },
);

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type FacilityMapData = {
  title: string;
  center: { lat: number; lng: number };
  zoom: number;
  radiusKm?: number;
  facilities: Array<{
    id: number;
    name: string;
    type: string | null;
    city: string | null;
    lat: number;
    lng: number;
    distanceKm?: number;
    doctors: number | null;
    beds: number | null;
  }>;
  stage: string;
  progress: number;
};

export function FacilityMapRenderer({ data }: { data: FacilityMapData }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const center: [number, number] = [data.center.lat, data.center.lng];

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
            {data.radiusKm ? ` within ${data.radiusKm} km` : ""}
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
        <MapContainer
          center={center}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          zoom={data.zoom}
        >
          <MapUpdater center={center} zoom={data.zoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {data.radiusKm && (
            <Circle
              center={center}
              color="#3b82f6"
              fillColor="#3b82f6"
              fillOpacity={0.05}
              radius={data.radiusKm * 1000}
              weight={1}
            />
          )}

          {data.facilities.map((f) => (
            <LeafletMarker
              icon={defaultIcon}
              key={f.id}
              position={[f.lat, f.lng]}
            >
              <Popup>
                <div className="text-sm">
                  <strong className="mb-1 block text-base">{f.name}</strong>
                  {f.type && (
                    <span className="block text-zinc-600">{f.type}</span>
                  )}
                  {f.city && (
                    <span className="block text-zinc-500">{f.city}</span>
                  )}
                  {f.doctors !== null && f.doctors > 0 && (
                    <span className="block text-zinc-500">
                      {f.doctors} doctors
                    </span>
                  )}
                  {f.beds !== null && f.beds > 0 && (
                    <span className="block text-zinc-500">
                      {f.beds} beds
                    </span>
                  )}
                  {f.distanceKm !== undefined && (
                    <span className="mt-1 block font-medium text-blue-600 tabular-nums">
                      {f.distanceKm} km away
                    </span>
                  )}
                </div>
              </Popup>
            </LeafletMarker>
          ))}
        </MapContainer>
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
