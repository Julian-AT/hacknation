"use client";

import { Eye, MapPin } from "lucide-react";
import { useVF } from "@/lib/vf-context";

interface NearbyFacility {
  id: number;
  name: string;
  type: string;
  city: string;
  lat: number;
  lng: number;
  distanceKm: number;
  doctors: number | null;
  beds: number | null;
}

interface NearbyFacilitiesResultProps {
  result: Record<string, unknown>;
}

export function NearbyFacilitiesResult({
  result,
}: NearbyFacilitiesResultProps) {
  const center = result.center as {
    location: string;
    lat: number;
    lng: number;
  } | null;
  const radiusKm = result.radiusKm as number;
  const count = (result.count as number) ?? 0;
  const facilities = (result.facilities as NearbyFacility[]) ?? [];
  const { setMapFacilities, setMapCenter, setMapZoom, setMapVisible } = useVF();

  const handleViewAll = () => {
    if (facilities.length > 0) {
      setMapFacilities(
        facilities.map((f) => ({
          id: f.id,
          name: f.name,
          lat: f.lat,
          lng: f.lng,
          type: f.type,
          city: f.city,
          distanceKm: f.distanceKm,
        }))
      );
      if (center) {
        setMapCenter([center.lat, center.lng]);
        setMapZoom(10);
      }
      setMapVisible(true);
    }
  };

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <MapPin className="size-3.5 text-amber-400" />
          <span className="text-xs font-medium text-muted-foreground">
            Near {center?.location ?? "location"} ({radiusKm}km)
          </span>
        </div>
        <span className="rounded-full bg-amber-950/50 px-2 py-0.5 font-mono text-[11px] font-semibold text-amber-400">
          {count} {count === 1 ? "facility" : "facilities"}
        </span>
      </div>

      <div className="flex flex-col gap-1 px-3 pb-2">
        {facilities.map((f) => (
          <div
            className="flex items-center justify-between rounded-md bg-muted px-2.5 py-2"
            key={f.id}
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-foreground">
                {f.name}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {[
                  f.type,
                  f.beds ? `${f.beds} beds` : null,
                  f.doctors ? `${f.doctors} doctors` : null,
                ]
                  .filter(Boolean)
                  .join("  ·  ")}
              </span>
            </div>
            <span className="ml-2 shrink-0 rounded bg-muted px-2 py-0.5 font-mono text-[11px] font-semibold text-amber-400">
              {f.distanceKm.toFixed(0)} km
            </span>
          </div>
        ))}
      </div>

      {facilities.length > 0 && (
        <div className="flex justify-end border-t border-border px-3 py-2">
          <button
            aria-label="View all on map"
            className="flex items-center gap-1 rounded bg-blue-950/30 px-2 py-1 text-[11px] font-medium text-blue-400 hover:bg-blue-950/50"
            onClick={handleViewAll}
            type="button"
          >
            <Eye className="size-3" />
            View All on Map
          </button>
        </div>
      )}
    </div>
  );
}
