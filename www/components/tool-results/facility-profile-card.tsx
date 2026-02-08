"use client";

import { useState } from "react";
import { Copy, ExternalLink, Eye, MapPin, Phone, Mail, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const [copied, setCopied] = useState(false);

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

  const addressParts = [city, region].filter(Boolean);
  const addressLine = addressParts.join(", ");

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
    const shareText = lat && lng
      ? `${name} — ${addressLine}\nhttps://www.google.com/maps?q=${String(lat)},${String(lng)}`
      : `${name} — ${addressLine}`;

    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="my-2 w-full max-w-md overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      {/* Map preview header */}
      <button
        aria-label="View on map"
        className="relative flex h-28 w-full items-end bg-muted"
        disabled={!lat || !lng}
        onClick={handleViewOnMap}
        type="button"
      >
        {/* Map tile background */}
        <div className="absolute inset-0 overflow-hidden">
          <MapPreviewPattern />
        </div>

        {/* Pin */}
        {lat && lng && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
            <div className="flex flex-col items-center">
              <div className="flex size-8 items-center justify-center rounded-full bg-red-500 shadow-md">
                <MapPin className="size-4 text-white" />
              </div>
              <div className="size-2 -translate-y-0.5 rounded-full bg-red-500/40" />
            </div>
          </div>
        )}

        {/* Coordinates badge */}
        {lat && lng && (
          <span className="absolute bottom-2 right-2 rounded-md bg-background/80 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground tabular-nums backdrop-blur-sm">
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </span>
        )}
      </button>

      {/* Main content */}
      <div className="px-4 py-3">
        {/* Name and type */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-balance text-base font-semibold text-foreground leading-tight">
              {name}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              {type && (
                <Badge
                  className="border-blue-500/20 bg-blue-500/10 text-[10px] text-blue-500 dark:text-blue-400"
                  variant="outline"
                >
                  {type}
                </Badge>
              )}
              {qualityNum !== null && (
                <Badge
                  className={cn(
                    "text-[10px]",
                    qualityNum >= 70
                      ? "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400"
                      : qualityNum >= 40
                        ? "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
                  )}
                  variant="outline"
                >
                  {qualityNum}% quality
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        {addressLine && (
          <div className="mt-2.5 flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-3.5 shrink-0" />
            <span>{addressLine}</span>
          </div>
        )}

        {/* Contact info */}
        {(phone ?? email) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
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
          </div>
        )}
      </div>

      {/* Metrics row */}
      {(beds !== null || doctors !== null || areaSqm !== null) && (
        <>
          <Separator />
          <div className="grid grid-cols-3 divide-x divide-border">
            {beds !== null && <MetricCell label="Beds" value={beds} />}
            {doctors !== null && <MetricCell label="Doctors" value={doctors} />}
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
          </div>
        </>
      )}

      {/* Anomaly confidence */}
      {anomalyConfidence && (
        <>
          <Separator />
          <div className="px-4 py-2.5">
            <AnomalyConfidenceBadge confidence={anomalyConfidence} />
          </div>
        </>
      )}

      {/* Missing data warning */}
      {missingCriticalData && !anomalyConfidence && (
        <>
          <Separator />
          <div className="bg-amber-500/5 px-4 py-2">
            <span className="text-[11px] text-amber-600 dark:text-amber-400">
              Missing: {missingCriticalData}
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

/** SVG pattern that mimics a subtle map grid for the preview header. */
function MapPreviewPattern() {
  return (
    <svg
      className="size-full text-muted-foreground/[0.06]"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          height="20"
          id="map-grid"
          patternUnits="userSpaceOnUse"
          width="20"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect fill="url(#map-grid)" height="100%" width="100%" />
      {/* Subtle diagonal road lines */}
      <line stroke="currentColor" strokeWidth="2" x1="0" x2="100%" y1="40%" y2="60%" />
      <line stroke="currentColor" strokeWidth="2" x1="30%" x2="70%" y1="0" y2="100%" />
      <line stroke="currentColor" strokeWidth="1.5" x1="60%" x2="100%" y1="100%" y2="20%" />
    </svg>
  );
}
