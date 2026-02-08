"use client";

import { AlertTriangle, Eye } from "lucide-react";
import { useVF } from "@/lib/vf-context";

interface DesertZone {
  city: string;
  nearestProvider: string | null;
  distanceKm: number;
  coordinates: { lat: number; lng: number };
}

interface MedicalDesertsResultProps {
  result: Record<string, unknown>;
}

export function MedicalDesertsResult({ result }: MedicalDesertsResultProps) {
  const service = result.service as string;
  const thresholdKm = result.thresholdKm as number;
  const totalProviders = result.totalProviders as number;
  const desertZones = (result.desertZones as DesertZone[]) ?? [];
  const desertZoneCount = (result.desertZoneCount as number) ?? desertZones.length;
  const status = result.status as string | undefined;
  const message = result.message as string | undefined;
  const { setMapFacilities, setMapCenter, setMapZoom, setMapVisible } = useVF();

  const handleViewOnMap = () => {
    if (desertZones.length > 0) {
      const markers = desertZones.map((z, i) => ({
        id: i + 10000,
        name: `${z.city} Gap (${z.distanceKm.toFixed(0)}km)`,
        lat: z.coordinates.lat,
        lng: z.coordinates.lng,
        type: "Medical Desert" as const,
        distanceKm: z.distanceKm,
      }));
      setMapFacilities(markers);
      setMapCenter([markers.at(0)?.lat ?? 7.95, markers.at(0)?.lng ?? -1.02]);
      setMapZoom(7);
      setMapVisible(true);
    }
  };

  if (status === "NATIONAL_GAP") {
    return (
      <div className="my-2 w-full overflow-hidden rounded-lg border border-red-900/50 bg-red-950/20">
        <div className="flex items-center gap-2 px-3 py-3">
          <AlertTriangle className="size-4 text-red-400" />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-red-400">
              National Gap: {service}
            </span>
            <span className="text-[11px] text-zinc-400">{message}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center justify-between bg-red-950/30 px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="size-3.5 text-red-400" />
          <span className="text-xs font-semibold text-red-400">
            Medical Deserts: {service}
          </span>
        </div>
        <span className="font-mono text-[11px] font-semibold text-red-400">
          {desertZoneCount} {desertZoneCount === 1 ? "zone" : "zones"}
        </span>
      </div>

      <div className="flex gap-4 px-3 py-2">
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-zinc-500">Threshold:</span>
          <span className="font-mono text-[10px] font-semibold text-zinc-400">
            {thresholdKm}km
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-zinc-500">Providers:</span>
          <span className="font-mono text-[10px] font-semibold text-zinc-400">
            {totalProviders} total
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-3 pb-2">
        {desertZones.map((zone) => (
          <div
            key={zone.city}
            className="flex items-center justify-between rounded-md bg-zinc-800/60 px-2.5 py-2"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-zinc-200">
                {zone.city}
              </span>
              <span className="text-[10px] text-zinc-500">
                {zone.nearestProvider
                  ? `Nearest: ${zone.nearestProvider}`
                  : "No nearby provider"}
              </span>
            </div>
            <span className="ml-2 shrink-0 rounded bg-red-950/50 px-2 py-0.5 font-mono text-[11px] font-bold text-red-400">
              {zone.distanceKm.toFixed(0)} km
            </span>
          </div>
        ))}
      </div>

      {desertZones.length > 0 && (
        <div className="flex justify-end border-t border-zinc-800 px-3 py-2">
          <button
            type="button"
            aria-label="View desert zones on map"
            onClick={handleViewOnMap}
            className="flex items-center gap-1 rounded bg-blue-950/30 px-2 py-1 text-[11px] font-medium text-blue-400 hover:bg-blue-950/50"
          >
            <Eye className="size-3" />
            View on Map
          </button>
        </div>
      )}
    </div>
  );
}
