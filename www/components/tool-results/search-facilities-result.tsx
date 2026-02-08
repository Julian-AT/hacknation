"use client";

import { Eye, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useVF } from "@/lib/vf-context";

interface FacilityConfidence {
  level: "green" | "yellow" | "red";
  score: number;
  flagCount: number;
}

interface FacilityResult {
  id: number;
  name: string;
  region: string;
  city: string;
  type: string;
  similarity: number;
  procedures: string;
  equipment: string;
  lat?: number;
  lng?: number;
  confidence?: FacilityConfidence;
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

  const geoResults = results.filter((f) => f.lat != null && f.lng != null);

  const handleViewAllOnMap = () => {
    if (geoResults.length > 0) {
      setMapFacilities(
        geoResults.map((f) => ({
          id: f.id,
          name: f.name,
          lat: f.lat as number,
          lng: f.lng as number,
          type: f.type,
          city: f.city,
        }))
      );
      setMapCenter([geoResults.at(0)?.lat as number, geoResults.at(0)?.lng as number]);
      setMapZoom(7);
      setMapVisible(true);
    }
  };

  return (
    <Card className="my-2 w-full overflow-hidden">
      <CardHeader className="flex-row items-center justify-between space-y-0 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Search className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            Facilities matching{" "}
            <span className="text-foreground">&ldquo;{query}&rdquo;</span>
          </span>
        </div>
        <Badge className="font-mono text-[11px]" variant="secondary">
          {count} found
        </Badge>
      </CardHeader>

      <CardContent className="px-3 pb-3 pt-0">
        {results.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <Search className="size-5 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">No matching facilities found</p>
            <p className="text-[11px] text-muted-foreground/70">Try different keywords or broaden your search</p>
          </div>
        ) : (
        <ul className="flex flex-col gap-1.5">
          {results.map((facility) => (
            <li key={facility.id}>
              <div className="rounded-md border border-border p-2.5">
                <div className="flex items-center justify-between">
                  <span className="truncate text-[13px] font-medium text-foreground">
                    {facility.name}
                  </span>
                  <Badge
                    className="shrink-0 font-mono text-[11px]"
                    variant="outline"
                  >
                    {Math.round(facility.similarity * 100)}%
                  </Badge>
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  {facility.type && (
                    <Badge variant="secondary" className="text-[10px] font-normal">
                      {facility.type}
                    </Badge>
                  )}
                  <span className="truncate">
                    {[facility.region, facility.city]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
                {facility.procedures && (
                  <p className="mt-1 line-clamp-1 text-pretty text-[11px] text-muted-foreground">
                    {facility.procedures}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
        )}
      </CardContent>

      {geoResults.length > 0 && (
        <>
          <Separator />
          <CardFooter className="justify-end px-3 py-2">
            <Button
              aria-label="View all matching facilities on map"
              className="h-7 gap-1 px-2 text-[11px]"
              onClick={handleViewAllOnMap}
              size="sm"
              type="button"
              variant="outline"
            >
              <Eye className="size-3" />
              View All on Map
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
