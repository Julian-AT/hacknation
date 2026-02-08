"use client";

import {
  ClockIcon,
  ExternalLinkIcon,
  GlobeIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
} from "lucide-react";
import { useVF } from "@/lib/vf-context";

interface ProviderData {
  id?: string;
  name: string;
  type: string;
  specialty?: string | null;
  address?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  hours?: string | null;
  insuranceAccepted?: string[] | null;
  lat?: number | null;
  lng?: number | null;
  imageUrl?: string | null;
  sourceUrl?: string | null;
  distanceKm?: number | null;
}

interface ProviderCardProps {
  provider: ProviderData;
  compact?: boolean;
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }, (_, i) => (
        <StarIcon
          className="size-3 fill-amber-400 text-amber-400"
          key={`full-${String(i)}`}
        />
      ))}
      {hasHalf && (
        <StarIcon className="size-3 fill-amber-400/50 text-amber-400" />
      )}
      {Array.from({ length: emptyStars }, (_, i) => (
        <StarIcon
          className="size-3 text-muted-foreground/30"
          key={`empty-${String(i)}`}
        />
      ))}
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    hospital: "bg-blue-950/50 text-blue-400",
    doctor: "bg-green-950/50 text-green-400",
    clinic: "bg-purple-950/50 text-purple-400",
    specialist: "bg-amber-950/50 text-amber-400",
    dentist: "bg-teal-950/50 text-teal-400",
    pharmacy: "bg-pink-950/50 text-pink-400",
  };

  const colorClass =
    colors[type.toLowerCase()] ?? "bg-muted text-muted-foreground";

  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-medium capitalize ${colorClass}`}
    >
      {type}
    </span>
  );
}

export function ProviderCard({ provider, compact = false }: ProviderCardProps) {
  const { setMapFacilities, setMapCenter, setMapZoom, setMapVisible } =
    useVF();

  const locationParts = [provider.city, provider.region, provider.country]
    .filter(Boolean);

  const handleViewOnMap = () => {
    if (provider.lat && provider.lng) {
      setMapFacilities([
        {
          id: typeof provider.id === "number" ? provider.id : 0,
          name: provider.name,
          lat: provider.lat,
          lng: provider.lng,
          type: provider.type,
          city: provider.city ?? undefined,
        },
      ]);
      setMapCenter([provider.lat, provider.lng]);
      setMapZoom(14);
      setMapVisible(true);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-muted/50">
      {/* Header: Name + Type + Rating */}
      <div className="flex items-start justify-between px-3 py-2.5">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="truncate text-sm font-semibold text-foreground">
            {provider.name}
          </span>
          <div className="flex items-center gap-1.5">
            <TypeBadge type={provider.type} />
            {provider.specialty && (
              <span className="truncate text-[11px] text-muted-foreground">
                {provider.specialty}
              </span>
            )}
          </div>
        </div>

        {provider.rating !== null && provider.rating !== undefined && (
          <div className="flex shrink-0 flex-col items-end gap-0.5">
            <div className="flex items-center gap-1">
              <span className="font-mono text-sm font-bold tabular-nums text-foreground">
                {provider.rating.toFixed(1)}
              </span>
              <StarRating rating={provider.rating} />
            </div>
            {provider.reviewCount !== null &&
              provider.reviewCount !== undefined && (
                <span className="text-[10px] tabular-nums text-muted-foreground">
                  {provider.reviewCount.toLocaleString()} reviews
                </span>
              )}
          </div>
        )}
      </div>

      {/* Location */}
      {(provider.address || locationParts.length > 0) && (
        <div className="flex items-start gap-1.5 border-t border-border px-3 py-2">
          <MapPinIcon className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
          <div className="flex flex-col gap-0.5 min-w-0">
            {provider.address && (
              <span className="truncate text-[11px] text-foreground">
                {provider.address}
              </span>
            )}
            {locationParts.length > 0 && (
              <span className="text-[11px] text-muted-foreground">
                {locationParts.join(", ")}
              </span>
            )}
            {provider.distanceKm !== null &&
              provider.distanceKm !== undefined && (
                <span className="font-mono text-[11px] font-medium tabular-nums text-amber-400">
                  {provider.distanceKm.toFixed(1)} km away
                </span>
              )}
          </div>
        </div>
      )}

      {/* Quick info: Hours + Phone */}
      {!compact && (provider.hours || provider.phone) && (
        <div className="flex items-center gap-3 border-t border-border px-3 py-2">
          {provider.hours && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <ClockIcon className="size-3" />
              {provider.hours}
            </span>
          )}
          {provider.phone && (
            <a
              className="flex items-center gap-1 text-[11px] text-blue-400 hover:underline"
              href={`tel:${provider.phone}`}
            >
              <PhoneIcon className="size-3" />
              {provider.phone}
            </a>
          )}
        </div>
      )}

      {/* Insurance */}
      {!compact &&
        provider.insuranceAccepted &&
        Array.isArray(provider.insuranceAccepted) &&
        provider.insuranceAccepted.length > 0 && (
          <div className="border-t border-border px-3 py-2">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Insurance
            </span>
            <div className="flex flex-wrap gap-1">
              {(provider.insuranceAccepted as string[]).slice(0, 4).map((ins) => (
                <span
                  className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                  key={ins}
                >
                  {ins}
                </span>
              ))}
              {provider.insuranceAccepted.length > 4 && (
                <span className="text-[10px] text-muted-foreground">
                  +{provider.insuranceAccepted.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

      {/* Action buttons */}
      <div className="flex items-center justify-between border-t border-border px-3 py-2">
        <div className="flex items-center gap-2">
          {provider.website && (
            <a
              className="flex items-center gap-1 rounded-md bg-background px-2 py-1 text-[11px] text-foreground hover:bg-muted"
              href={provider.website}
              rel="noopener"
              target="_blank"
            >
              <GlobeIcon className="size-3" />
              Website
              <ExternalLinkIcon className="size-2.5" />
            </a>
          )}
          {provider.phone && (
            <a
              className="flex items-center gap-1 rounded-md bg-background px-2 py-1 text-[11px] text-foreground hover:bg-muted"
              href={`tel:${provider.phone}`}
            >
              <PhoneIcon className="size-3" />
              Call
            </a>
          )}
        </div>

        {provider.lat && provider.lng && (
          <button
            aria-label="View on map"
            className="flex items-center gap-1 rounded bg-blue-950/30 px-2 py-1 text-[11px] text-blue-400 hover:bg-blue-950/50"
            onClick={handleViewOnMap}
            type="button"
          >
            <MapPinIcon className="size-3" />
            Map
          </button>
        )}
      </div>

      {/* Source attribution */}
      {provider.sourceUrl && (
        <div className="border-t border-border px-3 py-1.5">
          <a
            className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground"
            href={provider.sourceUrl}
            rel="noopener"
            target="_blank"
          >
            via {new URL(provider.sourceUrl).hostname}
          </a>
        </div>
      )}
    </div>
  );
}
