"use client";

import { ExternalLink, MapPin } from "lucide-react";

interface OSMFacilitiesResultProps {
  result: Record<string, unknown>;
}

interface OSMFacility {
  osmId: string;
  name: string;
  amenity: string;
  lat: number | null;
  lng: number | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  operator: string | null;
  healthcareSpecialty: string | null;
  beds: number | null;
  emergency: string | null;
  osmUrl: string;
}

export function OSMFacilitiesResult({ result }: OSMFacilitiesResultProps) {
  const totalFound = result.totalFound as number | undefined;
  const facilities = (result.facilities as OSMFacility[]) ?? [];
  const radiusMeters = result.radiusMeters as number | undefined;
  const note = result.note as string | undefined;

  if (facilities.length === 0) {
    return (
      <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <MapPin className="size-3.5 text-orange-400" />
          <span className="text-xs font-medium text-muted-foreground">
            OpenStreetMap — No facilities found nearby
          </span>
        </div>
      </div>
    );
  }

  const amenityCounts: Record<string, number> = {};
  for (const f of facilities) {
    amenityCounts[f.amenity] = (amenityCounts[f.amenity] ?? 0) + 1;
  }

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <MapPin className="size-3.5 text-orange-400" />
          <span className="text-xs font-medium text-muted-foreground">
            OpenStreetMap Facilities
            {radiusMeters
              ? ` (${String(radiusMeters >= 1000 ? `${String(radiusMeters / 1000)}km` : `${String(radiusMeters)}m`)} radius)`
              : ""}
          </span>
        </div>
        <span className="rounded bg-orange-950/40 px-1.5 py-0.5 text-[10px] text-orange-400">
          {totalFound ?? facilities.length} found
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 px-3 pb-2">
        {Object.entries(amenityCounts).map(([amenity, count]) => (
          <span
            className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
            key={amenity}
          >
            {amenity}: {count}
          </span>
        ))}
      </div>

      <div className="overflow-x-auto border-t border-border px-3 py-2">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                Name
              </th>
              <th className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                Type
              </th>
              <th className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                Operator
              </th>
              <th className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                Details
              </th>
              <th className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                OSM
              </th>
            </tr>
          </thead>
          <tbody>
            {facilities.slice(0, 20).map((f) => (
              <tr
                className="border-b border-border/50 last:border-0"
                key={f.osmId}
              >
                <td className="max-w-[180px] truncate px-2 py-1.5 font-medium text-foreground">
                  {f.name}
                </td>
                <td className="whitespace-nowrap px-2 py-1.5 text-muted-foreground">
                  {f.amenity}
                </td>
                <td className="max-w-[120px] truncate px-2 py-1.5 text-muted-foreground">
                  {f.operator ?? "—"}
                </td>
                <td className="px-2 py-1.5 text-muted-foreground">
                  <span className="flex flex-wrap gap-1">
                    {f.beds !== null && (
                      <span className="rounded bg-blue-950/30 px-1 py-0.5 text-[10px] text-blue-400">
                        {f.beds} beds
                      </span>
                    )}
                    {f.emergency === "yes" && (
                      <span className="rounded bg-rose-950/30 px-1 py-0.5 text-[10px] text-rose-400">
                        ER
                      </span>
                    )}
                    {f.healthcareSpecialty && (
                      <span className="rounded bg-emerald-950/30 px-1 py-0.5 text-[10px] text-emerald-400">
                        {f.healthcareSpecialty}
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-2 py-1.5">
                  <a
                    className="text-blue-400 hover:underline"
                    href={f.osmUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <ExternalLink className="size-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {note && (
        <p className="border-t border-border px-3 py-2 text-[10px] text-muted-foreground">
          {note}
        </p>
      )}
    </div>
  );
}
