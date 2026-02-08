"use client";

import { Building2, MapPin } from "lucide-react";
import {
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
} from "@/components/ai-elements/inline-citation";
import { Badge } from "@/components/ui/badge";
import { HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

interface FacilityCitationProps {
  /** Facility ID from the database */
  facilityId: number;
  /** Facility name */
  name: string;
  /** Facility type (hospital, clinic, etc.) */
  facilityType?: string;
  /** Region */
  region?: string;
  /** City */
  city?: string;
  /** Number of beds */
  beds?: number | null;
  /** Number of doctors */
  doctors?: number | null;
  /** Specialties list */
  specialties?: string[];
  /** Additional class names */
  className?: string;
}

/**
 * FacilityCitation renders a facility reference as an inline hoverable badge
 * that shows a quick summary on hover. Built on the InlineCitation AI Element.
 */
export function FacilityCitation({
  facilityId,
  name,
  facilityType,
  region,
  city,
  beds,
  doctors,
  specialties,
  className,
}: FacilityCitationProps) {
  const location = [city, region].filter(Boolean).join(", ");

  return (
    <InlineCitation className={className}>
      <InlineCitationCard>
        <HoverCardTrigger asChild>
          <Badge
            className="ml-0.5 cursor-default gap-1 rounded-full text-[11px]"
            variant="secondary"
          >
            <Building2 className="size-3" />
            {name}
            <span className="text-muted-foreground">#{facilityId}</span>
          </Badge>
        </HoverCardTrigger>
        <InlineCitationCardBody className="w-72">
          <div className="space-y-2 p-3">
            {/* Header */}
            <div>
              <h4 className="text-sm font-semibold leading-tight">{name}</h4>
              <div className="mt-1 flex items-center gap-1.5">
                {facilityType && (
                  <span className="rounded bg-blue-950/50 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
                    {facilityType}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                    <MapPin className="size-3" />
                    {location}
                  </span>
                )}
              </div>
            </div>

            {/* Capacity metrics */}
            {(beds !== null && beds !== undefined) ||
            (doctors !== null && doctors !== undefined) ? (
              <div className="flex gap-2">
                {beds !== null && beds !== undefined && (
                  <div className="flex flex-col rounded bg-muted px-2 py-1">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Beds
                    </span>
                    <span className="font-mono text-sm font-bold tabular-nums">
                      {beds.toLocaleString()}
                    </span>
                  </div>
                )}
                {doctors !== null && doctors !== undefined && (
                  <div className="flex flex-col rounded bg-muted px-2 py-1">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Doctors
                    </span>
                    <span className="font-mono text-sm font-bold tabular-nums">
                      {doctors.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            ) : null}

            {/* Specialties */}
            {specialties && specialties.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {specialties.slice(0, 4).map((s) => (
                  <span
                    className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                    key={s}
                  >
                    {s}
                  </span>
                ))}
                {specialties.length > 4 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{specialties.length - 4} more
                  </span>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="text-[10px] text-muted-foreground">
              Facility ID: {facilityId}
            </div>
          </div>
        </InlineCitationCardBody>
      </InlineCitationCard>
    </InlineCitation>
  );
}

/**
 * SimpleFacilityCitation renders a minimal inline facility reference badge.
 * Use when only the name and ID are available.
 */
export function SimpleFacilityCitation({
  facilityId,
  name,
  className,
}: {
  facilityId: number;
  name: string;
  className?: string;
}) {
  return (
    <Badge
      className={cn("ml-0.5 gap-1 rounded-full text-[11px]", className)}
      variant="secondary"
    >
      <Building2 className="size-3" />
      {name}
      <span className="text-muted-foreground">#{facilityId}</span>
    </Badge>
  );
}
