"use client";

import { Eye, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useVF } from "@/lib/vf-context";
import { AnomalyConfidenceBadge } from "./anomaly-confidence-badge";

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
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <CardHeader className="flex-row items-center justify-between space-y-0 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Search className="size-3.5 text-green-400" />
          <span className="text-xs font-medium text-muted-foreground">
            Facilities matching{" "}
            <span className="text-foreground">{query}</span>
          </span>
        </div>
        <Badge className="font-mono text-[11px]" variant="secondary">
          {count} found
        </Badge>
      </CardHeader>

      <CardContent className="px-3 pb-3 pt-0">
        {results.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <Search className="size-5 text-muted-foreground/50" />
            <p className="text-xs text-muted-foreground">No matching facilities found</p>
            <p className="text-[11px] text-muted-foreground/70">Try different keywords or broaden your search</p>
          </div>
        ) : (
        <ul className="flex flex-col gap-1.5">
          {results.map((facility) => (
            <li key={facility.id}>
              <Card className="p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex min-w-0 items-center gap-1.5">
                    {facility.confidence && (
                      <AnomalyConfidenceBadge
                        compact
                        confidence={{
                          level: facility.confidence.level,
                          score: facility.confidence.score,
                          summary:
                            facility.confidence.flagCount > 0
                              ? `${facility.confidence.flagCount} issue${facility.confidence.flagCount === 1 ? "" : "s"} detected`
                              : "No issues detected",
                          flags: [],
                        }}
                      />
                    )}
                    <span className="truncate text-[13px] font-medium text-foreground">
                      {facility.name}
                    </span>
                  </div>
                  <Badge
                    className="shrink-0 font-mono text-[11px] text-green-400"
                    variant="outline"
                  >
                    {Math.round(facility.similarity * 100)}%
                  </Badge>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  {facility.type && (
                    <Badge
                      className="border-blue-500/20 bg-blue-500/10 text-[10px] text-blue-400"
                      variant="outline"
                    >
                      {facility.type}
                    </Badge>
                  )}
                  <span className="truncate text-[11px] text-muted-foreground">
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
              </Card>
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
