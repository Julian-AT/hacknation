"use client";

import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
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
  const { setMapFacilities, setMapVisible } = useVF();

  const _handleViewOnMap = (facility: FacilityResult) => {
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
      </CardContent>
    </Card>
  );
}
