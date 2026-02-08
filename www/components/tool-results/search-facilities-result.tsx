"use client";

import { Search, Eye } from "lucide-react";
import { useVF } from "@/lib/vf-context";

interface FacilityResult {
  id: number;
  name: string;
  region: string;
  city: string;
  type: string;
  similarity: number;
  procedures: string;
  equipment: string;
}

interface SearchFacilitiesResultProps {
  args: Record<string, unknown>;
  result: Record<string, unknown>;
}

export function SearchFacilitiesResult({
  args,
  result,
}: SearchFacilitiesResultProps) {
  const query = (result.query as string) ?? (args.query as string) ?? "";
  const count = (result.count as number) ?? 0;
  const results = (result.results as FacilityResult[]) ?? [];
  const { setMapFacilities, setMapCenter, setMapZoom, setMapVisible } = useVF();

  const handleViewOnMap = (facility: FacilityResult) => {
    setMapFacilities([
      {
        id: facility.id,
        name: facility.name,
        lat: 0,
        lng: 0,
        type: facility.type,
        city: facility.city,
      },
    ]);
    setMapVisible(true);
  };

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Search className="size-3.5 text-green-400" />
          <span className="text-xs font-medium text-muted-foreground">
            Facilities matching{" "}
            <span className="text-foreground">{query}</span>
          </span>
        </div>
        <span className="rounded-full bg-green-950/50 px-2 py-0.5 font-mono text-[11px] font-semibold text-green-400">
          {count} found
        </span>
      </div>

      <div className="flex flex-col gap-1.5 px-3 pb-3">
        {results.map((facility) => (
          <div
            key={facility.id}
            className="flex flex-col gap-1.5 rounded-md bg-muted p-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-foreground">
                {facility.name}
              </span>
              <span className="font-mono text-[11px] font-semibold text-green-400">
                {Math.round(facility.similarity * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              {facility.type && (
                <span className="rounded bg-blue-950/50 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
                  {facility.type}
                </span>
              )}
              <span className="text-[11px] text-muted-foreground">
                {[facility.region, facility.city].filter(Boolean).join(", ")}
              </span>
            </div>
            {facility.procedures && (
              <p className="line-clamp-1 text-[11px] text-muted-foreground">
                {facility.procedures}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
