"use client";

import { MapPinIcon, SearchIcon } from "lucide-react";
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

export function ProviderSearchResult({
  result,
}: ProviderSearchResultProps) {
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
      <div className="my-2 rounded-lg border border-border bg-muted/50 px-3 py-3">
        <span className="text-[11px] text-red-400">{error}</span>
      </div>
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

    // Center on the first provider
    const first = mappableProviders.at(0);
    if (first?.lat && first?.lng) {
      setMapCenter([first.lat, first.lng]);
      setMapZoom(12);
    }
    setMapVisible(true);
  };

  return (
    <div className="my-2 w-full">
      {/* Header */}
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
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {source}
            </span>
          )}
        </div>

        {mappableProviders.length > 1 && (
          <button
            className="flex items-center gap-1 rounded-md bg-blue-950/30 px-2 py-1 text-[11px] text-blue-400 hover:bg-blue-950/50"
            onClick={handleViewAllOnMap}
            type="button"
          >
            <MapPinIcon className="size-3" />
            View All on Map
          </button>
        )}
      </div>

      {/* Provider list */}
      <div className="flex max-h-[600px] flex-col gap-2 overflow-y-auto">
        {providers.map((provider, idx) => (
          <ProviderCard
            compact={providers.length > 3}
            key={provider.id ?? `provider-${String(idx)}`}
            provider={provider}
          />
        ))}
      </div>

      {providers.length === 0 && (
        <div className="rounded-lg border border-dashed border-border px-4 py-6 text-center">
          <span className="text-sm text-muted-foreground">
            No providers found. Try broadening your search or adjusting the
            location.
          </span>
        </div>
      )}
    </div>
  );
}
