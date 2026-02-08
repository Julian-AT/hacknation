"use client";

import { useState } from "react";
import {
  Building2,
  Check,
  Copy,
  ExternalLink,
  Eye,
  Mail,
  MapPin,
  Phone,
  Users,
  BedDouble,
  Maximize,
  Calendar,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useVF } from "@/lib/vf-context";

interface FacilityProfileCardProps {
  result: Record<string, unknown>;
}

export function FacilityProfileCard({ result }: FacilityProfileCardProps) {
  const facility = result.facility as Record<string, unknown> | undefined;
  const dataQualityScore = result.dataQualityScore as string | undefined;
  const missingCriticalData = result.missingCriticalData as string | null;
  const { setMapFacilities, setMapCenter, setMapZoom, setMapVisible } = useVF();
  const [copied, setCopied] = useState(false);

  if (!facility) {
    return null;
  }

  const name = facility.name as string;
  const type = facility.facilityType as string | undefined;
  const operatorType = facility.operatorType as string | undefined;
  const region = facility.addressRegion as string | undefined;
  const city = facility.addressCity as string | undefined;
  const beds = facility.capacity as number | null;
  const doctors = facility.numDoctors as number | null;
  const areaSqm = facility.areaSqm as number | null;
  const lat = facility.lat as number | undefined;
  const lng = facility.lng as number | undefined;
  const specialties = facility.specialties as string[] | undefined;
  const procedures = facility.procedures as string[] | undefined;
  const equipment = facility.equipment as string[] | undefined;
  const phone = facility.phone as string | undefined;
  const email = facility.email as string | undefined;
  const website = facility.website as string | undefined;
  const yearEstablished = facility.yearEstablished as number | undefined;

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

  const hasMetrics = beds !== null || doctors !== null || areaSqm !== null;
  const hasContact = Boolean(phone ?? email ?? website);
  const hasSpecialties = (specialties?.length ?? 0) > 0;
  const hasProcedures = (procedures?.length ?? 0) > 0;
  const hasEquipment = (equipment?.length ?? 0) > 0;

  return (
    <div className="not-prose my-2 w-full overflow-hidden rounded-lg border border-border bg-background shadow-sm">
      {/* Primary block: Name, type, operator */}
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-balance text-base font-semibold leading-tight text-foreground">
              {name}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              {type && (
                <Badge variant="secondary" className="text-[11px] font-normal">
                  {type}
                </Badge>
              )}
              {operatorType && (
                <Badge variant="outline" className="text-[11px] font-normal">
                  {operatorType}
                </Badge>
              )}
              {yearEstablished && (
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  Est. {String(yearEstablished)}
                </span>
              )}
            </div>
          </div>
          {qualityNum !== null && (
            <div className="flex shrink-0 flex-col items-end">
              <span className="font-mono text-lg font-bold tabular-nums text-foreground">
                {qualityNum}%
              </span>
              <span className="text-[10px] text-muted-foreground">
                data quality
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Location block */}
      {(addressLine || (lat && lng)) && (
        <>
          <Separator />
          <div className="px-4 py-2.5">
            {addressLine && (
              <div className="flex items-start gap-2 text-sm text-foreground">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                <span>{addressLine}</span>
              </div>
            )}
            {lat && lng && (
              <span className="mt-1 block pl-5.5 font-mono text-[11px] tabular-nums text-muted-foreground">
                {lat.toFixed(4)}, {lng.toFixed(4)}
              </span>
            )}
          </div>
        </>
      )}

      {/* Contact block */}
      {hasContact && (
        <>
          <Separator />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-4 py-2.5">
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
        </>
      )}

      {/* Metrics block */}
      {hasMetrics && (
        <>
          <Separator />
          <div className="grid grid-cols-3 divide-x divide-border">
            {beds !== null && (
              <MetricCell icon={BedDouble} label="Beds" value={beds} />
            )}
            {doctors !== null && (
              <MetricCell icon={Users} label="Doctors" value={doctors} />
            )}
            {areaSqm !== null && (
              <MetricCell
                icon={Maximize}
                label="Area"
                value={`${areaSqm.toLocaleString()}m\u00b2`}
              />
            )}
          </div>
        </>
      )}

      {/* Specialties block */}
      {hasSpecialties && (
        <>
          <Separator />
          <div className="px-4 py-2.5">
            <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Specialties
            </span>
            <div className="flex flex-wrap gap-1">
              {specialties?.slice(0, 8).map((s) => (
                <Badge className="text-[11px] font-normal" key={s} variant="secondary">
                  {s}
                </Badge>
              ))}
              {(specialties?.length ?? 0) > 8 && (
                <span className="self-center text-[11px] text-muted-foreground">
                  +{(specialties?.length ?? 0) - 8} more
                </span>
              )}
            </div>
          </div>
        </>
      )}

      {/* Procedures block */}
      {hasProcedures && (
        <>
          <Separator />
          <div className="px-4 py-2.5">
            <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Procedures
            </span>
            <div className="flex flex-wrap gap-1">
              {procedures?.slice(0, 6).map((p) => (
                <Badge className="text-[11px] font-normal" key={p} variant="secondary">
                  {p}
                </Badge>
              ))}
              {(procedures?.length ?? 0) > 6 && (
                <span className="self-center text-[11px] text-muted-foreground">
                  +{(procedures?.length ?? 0) - 6} more
                </span>
              )}
            </div>
          </div>
        </>
      )}

      {/* Equipment block */}
      {hasEquipment && (
        <>
          <Separator />
          <div className="px-4 py-2.5">
            <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Equipment
            </span>
            <div className="flex flex-wrap gap-1">
              {equipment?.slice(0, 6).map((e) => (
                <Badge className="text-[11px] font-normal" key={e} variant="outline">
                  {e}
                </Badge>
              ))}
              {(equipment?.length ?? 0) > 6 && (
                <span className="self-center text-[11px] text-muted-foreground">
                  +{(equipment?.length ?? 0) - 6} more
                </span>
              )}
            </div>
          </div>
        </>
      )}

      {/* Missing data notice */}
      {missingCriticalData && (
        <>
          <Separator />
          <div className="px-4 py-2">
            <span className="text-[11px] text-muted-foreground">
              Missing data: {missingCriticalData}
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
            <Check className="size-3.5" />
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
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 py-3">
      <Icon className="mb-0.5 size-3.5 text-muted-foreground" />
      <span className="font-mono text-base font-bold tabular-nums text-foreground">
        {typeof value === "number" ? value.toLocaleString() : value}
      </span>
      <span className="text-[10px] font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
