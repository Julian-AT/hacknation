"use client";

import { Eye, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useVF } from "@/lib/vf-context";
import { AnomalyConfidenceBadge } from "./anomaly-confidence-badge";

interface FacilityProfileCardProps {
  result: Record<string, unknown>;
}

export function FacilityProfileCard({ result }: FacilityProfileCardProps) {
  const facility = result.facility as Record<string, unknown> | undefined;
  const dataQualityScore = result.dataQualityScore as string | undefined;
  const missingCriticalData = result.missingCriticalData as string | null;
  const anomalyConfidence = result.anomalyConfidence as
    | {
        level: "green" | "yellow" | "red";
        score: number;
        summary: string;
        flags: {
          checkId: string;
          severity: "critical" | "high" | "medium" | "low";
          explanation: string;
        }[];
      }
    | undefined;
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
  const phone = facility.phone as string | undefined;
  const email = facility.email as string | undefined;

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
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <CardHeader className="flex-row items-start justify-between space-y-0 px-3 py-3">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-balance text-sm font-semibold text-foreground">
            {name}
          </span>
          <div className="flex items-center gap-1.5">
            {type && (
              <Badge
                className="border-blue-500/20 bg-blue-500/10 text-[10px] text-blue-400"
                variant="outline"
              >
                {type}
              </Badge>
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
          <div className="flex shrink-0 flex-col items-center gap-0.5">
            <span
              className={cn(
                "font-mono text-base font-bold tabular-nums",
                getQualityColor(qualityNum)
              )}
            >
              {qualityNum}%
            </span>
            <span className="text-[9px] font-medium text-muted-foreground">
              quality
            </span>
          </div>
        )}
      </CardHeader>

      <Separator />
      <CardContent className="flex flex-wrap gap-2 px-3 py-3">
        {beds !== null && <CapacityMetric label="BEDS" value={beds} />}
        {doctors !== null && <CapacityMetric label="DOCTORS" value={doctors} />}
        {areaSqm !== null && (
          <CapacityMetric
            label="AREA"
            value={`${areaSqm.toLocaleString()}m\u00b2`}
          />
        )}
      </CardContent>

      {(specialties?.length ?? 0) > 0 && (
        <>
          <Separator />
          <CardContent className="px-3 py-2.5">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Specialties
            </span>
            <div className="flex flex-wrap gap-1">
              {specialties?.slice(0, 8).map((s) => (
                <Badge className="text-[10px] font-normal" key={s} variant="secondary">
                  {s}
                </Badge>
              ))}
              {(specialties?.length ?? 0) > 8 && (
                <span className="text-[10px] text-muted-foreground">
                  +{(specialties?.length ?? 0) - 8} more
                </span>
              )}
            </div>
          </CardContent>
        </>
      )}

      {(procedures?.length ?? 0) > 0 && (
        <>
          <Separator />
          <CardContent className="px-3 py-2.5">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Procedures
            </span>
            <div className="flex flex-wrap gap-1">
              {procedures?.slice(0, 6).map((p) => (
                <Badge className="text-[10px] font-normal" key={p} variant="secondary">
                  {p}
                </Badge>
              ))}
              {(procedures?.length ?? 0) > 6 && (
                <span className="text-[10px] text-muted-foreground">
                  +{(procedures?.length ?? 0) - 6} more
                </span>
              )}
            </div>
          </CardContent>
        </>
      )}

      {anomalyConfidence && (
        <>
          <Separator />
          <CardContent className="px-3 py-2.5">
            <AnomalyConfidenceBadge confidence={anomalyConfidence} />
          </CardContent>
        </>
      )}

      {missingCriticalData && !anomalyConfidence && (
        <>
          <Separator />
          <CardContent className="bg-amber-500/5 px-3 py-2">
            <span className="text-[11px] text-amber-400">
              Missing: {missingCriticalData}
            </span>
          </CardContent>
        </>
      )}

      <Separator />
      <CardFooter className="items-center justify-between px-3 py-2">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          {phone && <span>{phone}</span>}
          {email && <span>{email}</span>}
        </div>
        {lat && lng && (
          <Button
            aria-label="View facility on map"
            className="h-7 gap-1 px-2 text-[11px]"
            onClick={handleViewOnMap}
            size="sm"
            type="button"
            variant="outline"
          >
            <Eye className="size-3" />
            Map
          </Button>
        )}
      </CardFooter>
    </Card>
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
    <Card className="flex flex-1 basis-16 flex-col gap-0.5 p-2">
      <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-base font-bold tabular-nums text-foreground">
        {typeof value === "number" ? value.toLocaleString() : value}
      </span>
    </Card>
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
