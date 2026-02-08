"use client";

import { MapPinIcon, SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVF } from "@/lib/vf-context";
import { ProviderCard } from "./provider-card";

interface ProviderSearchResultProps {
  args: Record<string, unknown>;
  result: Record<string, unknown>;
}

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
}

export function ProviderSearchResult({ result }: ProviderSearchResultProps) {
  const { setMapFacilities, setMapCenter, setMapZoom, setMapVisible } =
    useVF();

  const query = result.query as string | undefined;
  const location = result.location as string | undefined;
  const resultCount = result.resultCount as number | undefined;
  const source = result.source as string | undefined;
  const providers = (result.providers ?? []) as ProviderData[];
  const error = result.error as string | undefined;

  if (error) {
    return (
      <Card className="my-2 bg-destructive/10">
        <CardContent className="px-3 py-3">
          <span className="text-[11px] text-destructive">{error}</span>
        </CardContent>
      </Card>
    );
  }

  const mappableProviders = providers.filter(
    (p) => p.lat !== null && p.lng !== null
  );

  const handleViewAllOnMap = () => {
    if (mappableProviders.length === 0) {
      return;
    }

    setMapFacilities(
      mappableProviders.map((p, idx) => ({
        id: typeof p.id === "number" ? p.id : idx,
        name: p.name,
        lat: p.lat as number,
        lng: p.lng as number,
        type: p.type,
        city: p.city ?? undefined,
      }))
    );

    const first = mappableProviders.at(0);
    if (first?.lat && first?.lng) {
      setMapCenter([first.lat, first.lng]);
      setMapZoom(12);
    }
    setMapVisible(true);
  };

  return (
    <div className="my-2 w-full">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SearchIcon className="size-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {resultCount ?? providers.length} result
            {(resultCount ?? providers.length) !== 1 ? "s" : ""}
            {query ? ` for "${query}"` : ""}
            {location ? ` in ${location}` : ""}
          </span>
          {source && (
            <Badge className="text-[10px]" variant="secondary">
              {source}
            </Badge>
          )}
        </div>

        {mappableProviders.length > 1 && (
          <Button
            aria-label="View all providers on map"
            className="h-7 gap-1 px-2 text-[11px]"
            onClick={handleViewAllOnMap}
            size="sm"
            type="button"
            variant="outline"
          >
            <MapPinIcon className="size-3" />
            View All on Map
          </Button>
        )}
      </div>

      <ScrollArea className="max-h-[600px]">
        <ul className="flex flex-col gap-2">
          {providers.map((provider, idx) => (
            <li key={provider.id ?? `provider-${String(idx)}`}>
              <ProviderCard
                compact={providers.length > 3}
                provider={provider}
              />
            </li>
          ))}
        </ul>
      </ScrollArea>

      {providers.length === 0 && (
        <Card className="border-dashed px-4 py-6 text-center">
          <span className="text-sm text-muted-foreground">
            No providers found. Try broadening your search or adjusting the
            location.
          </span>
        </Card>
      )}
    </div>
  );
}
