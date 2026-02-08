"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Eye,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useVF } from "@/lib/vf-context";
import { AnomalyConfidenceBadge } from "@/components/tool-results/anomaly-confidence-badge";

interface FacilityData {
  facility: Record<string, unknown>;
  dataQualityScore?: string;
  missingCriticalData?: string | null;
  anomalyConfidence?: {
    level: "green" | "yellow" | "red";
    score: number;
    summary: string;
    flags: {
      checkId: string;
      severity: "critical" | "high" | "medium" | "low";
      explanation: string;
    }[];
  };
}

interface FacilityInlineCardProps {
  facilityId: number;
  name: string;
}

export function FacilityInlineCard({
  facilityId,
  name,
}: FacilityInlineCardProps) {
  const [data, setData] = useState<FacilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { setMapFacilities, setMapCenter, setMapZoom, setMapVisible } = useVF();

  useEffect(() => {
    let cancelled = false;

    async function fetchFacility() {
      try {
        const res = await fetch(`/api/facilities/${String(facilityId)}`);
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const json = (await res.json()) as FacilityData;
        if (!cancelled) {
          setData(json);
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchFacility();
    return () => {
      cancelled = true;
    };
  }, [facilityId]);

  // Fallback badge if loading or error
  if (loading) {
    return (
      <span className="my-1 inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2.5 py-1.5 text-xs">
        <Building2 className="size-3.5 text-muted-foreground" />
        <span className="font-medium">{name}</span>
        <span className="text-muted-foreground">#{String(facilityId)}</span>
        <span className="size-2 animate-pulse rounded-full bg-muted-foreground/30" />
      </span>
    );
  }

  if (error || !data?.facility) {
    return (
      <span className="my-1 inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2.5 py-1.5 text-xs">
        <Building2 className="size-3.5 text-muted-foreground" />
        <span className="font-medium">{name}</span>
        <span className="text-muted-foreground">#{String(facilityId)}</span>
      </span>
    );
  }

  const f = data.facility;
  const facilityName = (f.name as string) || name;
  const type = f.facilityType as string | undefined;
  const region = f.addressRegion as string | undefined;
  const city = f.addressCity as string | undefined;
  const beds = f.capacity as number | null;
  const doctors = f.numDoctors as number | null;
  const areaSqm = f.areaSqm as number | null;
  const lat = f.lat as number | undefined;
  const lng = f.lng as number | undefined;
  const specialties = f.specialties as string[] | undefined;
  const procedures = f.procedures as string[] | undefined;
  const phone = f.phone as string | undefined;
  const email = f.email as string | undefined;
  const website = f.website as string | undefined;
  const yearEstablished = f.yearEstablished as number | undefined;
  const operatorType = f.operatorType as string | undefined;

  const qualityNum = data.dataQualityScore
    ? Number.parseInt(data.dataQualityScore, 10)
    : null;

  const addressParts = [city, region].filter(Boolean);
  const addressLine = addressParts.join(", ");

  const handleViewOnMap = () => {
    if (lat && lng) {
      setMapFacilities([
        {
          id: facilityId,
          name: facilityName,
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

  const handleDirections = () => {
    if (lat && lng) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${String(lat)},${String(lng)}`,
        "_blank",
        "noopener"
      );
    }
  };

  const handleShare = () => {
    const shareText =
      lat && lng
        ? `${facilityName} — ${addressLine}\nhttps://www.google.com/maps?q=${String(lat)},${String(lng)}`
        : `${facilityName} — ${addressLine}`;

    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Collapsible
      className="not-prose my-2 w-full max-w-md overflow-hidden rounded-xl border border-border bg-background shadow-sm"
      onOpenChange={setIsOpen}
      open={isOpen}
    >
      {/* Compact header - always visible */}
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors hover:bg-muted/50">
        <div className="flex min-w-0 items-center gap-2">
          <Building2 className="size-4 shrink-0 text-blue-500" />
          <span className="truncate text-sm font-semibold">{facilityName}</span>
          {type && (
            <Badge
              className="shrink-0 border-blue-500/20 bg-blue-500/10 text-[10px] text-blue-500 dark:text-blue-400"
              variant="outline"
            >
              {type}
            </Badge>
          )}
          {qualityNum !== null && (
            <Badge
              className={cn(
                "shrink-0 text-[10px]",
                qualityNum >= 70
                  ? "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400"
                  : qualityNum >= 40
                    ? "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
              )}
              variant="outline"
            >
              {String(qualityNum)}%
            </Badge>
          )}
        </div>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </CollapsibleTrigger>

      {/* Compact metrics row - always visible */}
      {(beds !== null || doctors !== null) && !isOpen && (
        <div className="flex items-center gap-3 border-t border-border/50 px-3 py-1.5">
          {addressLine && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="size-3" />
              {addressLine}
            </span>
          )}
          {beds !== null && (
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {beds.toLocaleString()} beds
            </span>
          )}
          {doctors !== null && (
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {doctors.toLocaleString()} doctors
            </span>
          )}
        </div>
      )}

      {/* Expanded content */}
      <CollapsibleContent>
        <Separator />
        <div className="space-y-0">
          {/* Location & basic info */}
          <div className="px-4 py-3">
            {addressLine && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-3.5 shrink-0" />
                <span>{addressLine}</span>
              </div>
            )}
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {operatorType && (
                <Badge className="text-[10px]" variant="secondary">
                  {operatorType}
                </Badge>
              )}
              {yearEstablished && (
                <span className="text-[11px] text-muted-foreground">
                  Est. {String(yearEstablished)}
                </span>
              )}
            </div>

            {/* Contact info */}
            {(phone ?? email ?? website) && (
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {phone && (
                  <a
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    href={`tel:${phone}`}
                  >
                    <Phone className="size-3" />
                    {phone}
                  </a>
                )}
                {email && (
                  <a
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    href={`mailto:${email}`}
                  >
                    <Mail className="size-3" />
                    {email}
                  </a>
                )}
                {website && (
                  <a
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    href={website.startsWith("http") ? website : `https://${website}`}
                    rel="noopener"
                    target="_blank"
                  >
                    <ExternalLink className="size-3" />
                    Website
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Metrics row */}
          {(beds !== null || doctors !== null || areaSqm !== null) && (
            <>
              <Separator />
              <div className="grid grid-cols-3 divide-x divide-border">
                {beds !== null && (
                  <MetricCell label="Beds" value={beds} />
                )}
                {doctors !== null && (
                  <MetricCell label="Doctors" value={doctors} />
                )}
                {areaSqm !== null && (
                  <MetricCell
                    label="Area"
                    value={`${areaSqm.toLocaleString()}m\u00b2`}
                  />
                )}
              </div>
            </>
          )}

          {/* Specialties */}
          {(specialties?.length ?? 0) > 0 && (
            <>
              <Separator />
              <div className="px-4 py-2.5">
                <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Specialties
                </span>
                <div className="flex flex-wrap gap-1">
                  {specialties?.slice(0, 8).map((s) => (
                    <Badge
                      className="text-[10px] font-normal"
                      key={s}
                      variant="secondary"
                    >
                      {s}
                    </Badge>
                  ))}
                  {(specialties?.length ?? 0) > 8 && (
                    <span className="text-[10px] text-muted-foreground">
                      +{String((specialties?.length ?? 0) - 8)} more
                    </span>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Procedures */}
          {(procedures?.length ?? 0) > 0 && (
            <>
              <Separator />
              <div className="px-4 py-2.5">
                <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Procedures
                </span>
                <div className="flex flex-wrap gap-1">
                  {procedures?.slice(0, 6).map((p) => (
                    <Badge
                      className="text-[10px] font-normal"
                      key={p}
                      variant="secondary"
                    >
                      {p}
                    </Badge>
                  ))}
                  {(procedures?.length ?? 0) > 6 && (
                    <span className="text-[10px] text-muted-foreground">
                      +{String((procedures?.length ?? 0) - 6)} more
                    </span>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Anomaly confidence */}
          {data.anomalyConfidence && (
            <>
              <Separator />
              <div className="px-4 py-2.5">
                <AnomalyConfidenceBadge confidence={data.anomalyConfidence} />
              </div>
            </>
          )}

          {/* Missing data warning */}
          {data.missingCriticalData && !data.anomalyConfidence && (
            <>
              <Separator />
              <div className="bg-amber-500/5 px-4 py-2">
                <span className="text-[11px] text-amber-600 dark:text-amber-400">
                  Missing: {data.missingCriticalData}
                </span>
              </div>
            </>
          )}

          {/* Action buttons */}
          <Separator />
          <div className="flex items-center gap-1.5 px-3 py-2">
            {lat && lng && (
              <Button
                aria-label="View facility on map"
                className="h-8 gap-1.5 text-xs"
                onClick={handleViewOnMap}
                size="sm"
                type="button"
                variant="outline"
              >
                <Eye className="size-3.5" />
                View on Map
              </Button>
            )}
            {lat && lng && (
              <Button
                aria-label="Get directions to facility"
                className="h-8 gap-1.5 text-xs"
                onClick={handleDirections}
                size="sm"
                type="button"
                variant="outline"
              >
                <ExternalLink className="size-3.5" />
                Directions
              </Button>
            )}
            <Button
              aria-label="Copy facility details"
              className="h-8 gap-1.5 text-xs"
              onClick={handleShare}
              size="sm"
              type="button"
              variant="ghost"
            >
              {copied ? (
                <Check className="size-3.5 text-green-500" />
              ) : (
                <Copy className="size-3.5" />
              )}
              {copied ? "Copied" : "Share"}
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function MetricCell({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 py-2.5">
      <span className="font-mono text-base font-bold tabular-nums text-foreground">
        {typeof value === "number" ? value.toLocaleString() : value}
      </span>
      <span className="text-[10px] font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
