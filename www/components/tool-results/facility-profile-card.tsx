"use client";

import { Eye, MapPin } from "lucide-react";
import { useVF } from "@/lib/vf-context";

interface FacilityProfileCardProps {
  result: Record<string, unknown>;
}

export function FacilityProfileCard({ result }: FacilityProfileCardProps) {
  const facility = result.facility as Record<string, unknown> | undefined;
  const dataQualityScore = result.dataQualityScore as string | undefined;
  const missingCriticalData = result.missingCriticalData as string | null;
  const { setMapFacilities, setMapCenter, setMapZoom, setMapVisible } = useVF();

  if (!facility) {
    return null;
  }

  const name = facility.name as string;
  const type = facility.facilityType as string | undefined;
  const region = facility.addressRegion as string | undefined;
  const city = facility.addressCity as string | undefined;
  const beds = facility.capacity as number | null;
  const doctors = facility.numDoctors as number | null;
  const areaSqm = facility.areaSqm as number | null;
  const lat = facility.lat as number | undefined;
  const lng = facility.lng as number | undefined;
  const specialties = facility.specialties as string[] | undefined;
  const procedures = facility.procedures as string[] | undefined;
  const _equipment = facility.equipment as string[] | undefined;
  const phone = facility.phone as string | undefined;
  const email = facility.email as string | undefined;
  const _website = facility.website as string | undefined;

  const qualityNum = dataQualityScore
    ? Number.parseInt(dataQualityScore, 10)
    : null;

  const handleViewOnMap = () => {
    if (lat && lng) {
      setMapFacilities([
        {
          id: facility.id as number,
          name,
          lat,
          lng,
          type,
          city,
        },
      ]);
      setMapCenter([lat, lng]);
      setMapZoom(12);
      setMapVisible(true);
    }
  };

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      {/* Header */}
      <div className="flex items-start justify-between px-3 py-3">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">{name}</span>
          <div className="flex items-center gap-1.5">
            {type && (
              <span className="rounded bg-blue-950/50 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
                {type}
              </span>
            )}
            {(region ?? city) && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="size-3" />
                {[region, city].filter(Boolean).join(", ")}
              </span>
            )}
          </div>
        </div>
        {qualityNum !== null && (
          <div className="flex flex-col items-center gap-0.5">
            <span
              className={`font-mono text-base font-bold ${getQualityColor(qualityNum)}`}
            >
              {qualityNum}%
            </span>
            <span className="text-[9px] font-medium text-muted-foreground">
              quality
            </span>
          </div>
        )}
      </div>

      {/* Capacity metrics */}
      <div className="border-t border-border">
        <div className="flex gap-2 px-3 py-3">
          {beds !== null && <CapacityMetric label="BEDS" value={beds} />}
          {doctors !== null && (
            <CapacityMetric label="DOCTORS" value={doctors} />
          )}
          {areaSqm !== null && (
            <CapacityMetric
              label="AREA"
              value={`${areaSqm.toLocaleString()}m²`}
            />
          )}
        </div>
      </div>

      {/* Services */}
      {(specialties?.length ?? 0) > 0 && (
        <div className="border-t border-border px-3 py-2.5">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Specialties
          </span>
          <div className="flex flex-wrap gap-1">
            {specialties?.slice(0, 8).map((s) => (
              <span
                className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                key={s}
              >
                {s}
              </span>
            ))}
            {(specialties?.length ?? 0) > 8 && (
              <span className="text-[10px] text-muted-foreground">
                +{(specialties?.length ?? 0) - 8} more
              </span>
            )}
          </div>
        </div>
      )}

      {(procedures?.length ?? 0) > 0 && (
        <div className="border-t border-border px-3 py-2.5">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Procedures
          </span>
          <div className="flex flex-wrap gap-1">
            {procedures?.slice(0, 6).map((p) => (
              <span
                className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                key={p}
              >
                {p}
              </span>
            ))}
            {(procedures?.length ?? 0) > 6 && (
              <span className="text-[10px] text-muted-foreground">
                +{(procedures?.length ?? 0) - 6} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Missing data warning */}
      {missingCriticalData && (
        <div className="border-t border-border bg-amber-950/20 px-3 py-2">
          <span className="text-[11px] text-amber-400">
            Missing: {missingCriticalData}
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-3 py-2">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          {phone && <span>{phone}</span>}
          {email && <span>{email}</span>}
        </div>
        {lat && lng && (
          <button
            aria-label="View on map"
            className="flex items-center gap-1 rounded bg-blue-950/30 px-1.5 py-0.5 text-[11px] text-blue-400 hover:bg-blue-950/50"
            onClick={handleViewOnMap}
            type="button"
          >
            <Eye className="size-3" />
            Map
          </button>
        )}
      </div>
    </div>
  );
}

function CapacityMetric({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex flex-1 flex-col gap-0.5 rounded-md bg-muted p-2">
      <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-base font-bold text-foreground">
        {typeof value === "number" ? value.toLocaleString() : value}
      </span>
    </div>
  );
}

function getQualityColor(score: number): string {
  if (score >= 70) {
    return "text-green-400";
  }
  if (score >= 40) {
    return "text-amber-400";
  }
  return "text-red-400";
}
