"use client";

import {
  ClockIcon,
  ExternalLinkIcon,
  GlobeIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
          className="size-3 fill-foreground text-foreground"
          key={`full-${String(i)}`}
        />
      ))}
      {hasHalf && (
        <StarIcon className="size-3 fill-foreground/50 text-foreground" />
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

export function ProviderCard({ provider, compact = false }: ProviderCardProps) {
  const { setMapFacilities, setMapCenter, setMapZoom, setMapVisible } =
    useVF();

  const locationParts = [provider.city, provider.region, provider.country].filter(
    Boolean
  );

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
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-start justify-between space-y-0 px-3 py-2.5">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-sm font-semibold text-foreground">
            {provider.name}
          </span>
          <div className="flex items-center gap-1.5">
            <Badge variant="secondary" className="text-[10px] capitalize">
              {provider.type}
            </Badge>
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
                <span className="tabular-nums text-[10px] text-muted-foreground">
                  {provider.reviewCount.toLocaleString()} reviews
                </span>
              )}
          </div>
        )}
      </CardHeader>

      {(provider.address || locationParts.length > 0) && (
        <>
          <Separator />
          <CardContent className="flex items-start gap-1.5 px-3 py-2">
            <MapPinIcon className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
            <div className="flex min-w-0 flex-col gap-0.5">
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
                  <span className="font-mono text-[11px] font-medium tabular-nums text-muted-foreground">
                    {provider.distanceKm.toFixed(1)} km away
                  </span>
                )}
            </div>
          </CardContent>
        </>
      )}

      {!compact && (provider.hours || provider.phone) && (
        <>
          <Separator />
          <CardContent className="flex items-center gap-3 px-3 py-2">
            {provider.hours && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <ClockIcon className="size-3" />
                {provider.hours}
              </span>
            )}
            {provider.phone && (
              <a
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                href={`tel:${provider.phone}`}
              >
                <PhoneIcon className="size-3" />
                {provider.phone}
              </a>
            )}
          </CardContent>
        </>
      )}

      {!compact &&
        provider.insuranceAccepted &&
        Array.isArray(provider.insuranceAccepted) &&
        provider.insuranceAccepted.length > 0 && (
          <>
            <Separator />
            <CardContent className="px-3 py-2">
              <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Insurance
              </span>
              <div className="flex flex-wrap gap-1">
                {(provider.insuranceAccepted as string[])
                  .slice(0, 4)
                  .map((ins) => (
                    <Badge
                      className="text-[10px] font-normal"
                      key={ins}
                      variant="secondary"
                    >
                      {ins}
                    </Badge>
                  ))}
                {provider.insuranceAccepted.length > 4 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{provider.insuranceAccepted.length - 4} more
                  </span>
                )}
              </div>
            </CardContent>
          </>
        )}

      <Separator />
      <CardFooter className="items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          {provider.website && (
            <Button asChild className="h-7 gap-1 px-2 text-[11px]" size="sm" variant="outline">
              <a href={provider.website} rel="noopener" target="_blank">
                <GlobeIcon className="size-3" />
                Website
                <ExternalLinkIcon className="size-2.5" />
              </a>
            </Button>
          )}
          {provider.phone && (
            <Button asChild className="h-7 gap-1 px-2 text-[11px]" size="sm" variant="outline">
              <a href={`tel:${provider.phone}`}>
                <PhoneIcon className="size-3" />
                Call
              </a>
            </Button>
          )}
        </div>

        {provider.lat && provider.lng && (
          <Button
            aria-label="View provider on map"
            className="h-7 gap-1 px-2 text-[11px]"
            onClick={handleViewOnMap}
            size="sm"
            type="button"
            variant="outline"
          >
            <MapPinIcon className="size-3" />
            Map
          </Button>
        )}
      </CardFooter>

      {provider.sourceUrl && (
        <>
          <Separator />
          <CardContent className="px-3 py-1.5">
            <a
              className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground"
              href={provider.sourceUrl}
              rel="noopener"
              target="_blank"
            >
              via {new URL(provider.sourceUrl).hostname}
            </a>
          </CardContent>
        </>
      )}
    </Card>
  );
}
