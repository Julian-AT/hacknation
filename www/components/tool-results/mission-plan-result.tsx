"use client";

import { Activity, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Recommendation {
  priority: string;
  region: string;
  reason: string;
  suggestedHost?: {
    id?: number;
    name: string;
    city?: string;
    distanceKm?: number;
  };
  suggestedLocation?: string;
}

interface MissionPlanResultProps {
  result: Record<string, unknown>;
}

export function MissionPlanResult({ result }: MissionPlanResultProps) {
  const volunteerProfile = result.volunteerProfile as Record<
    string,
    string
  > | null;
  const analysis = result.analysis as string | undefined;
  const recommendations = (result.recommendations as Recommendation[]) ?? [];

  return (
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <CardHeader className="flex-row items-center gap-2 space-y-0 px-3 py-2.5">
        <Activity className="size-3.5 text-pink-400" />
        <span className="text-balance text-xs font-medium text-muted-foreground">
          Mission Plan
          {volunteerProfile?.specialty && `: ${volunteerProfile.specialty}`}
          {volunteerProfile?.duration && `, ${volunteerProfile.duration}`}
        </span>
      </CardHeader>

      {analysis && (
        <>
          <Separator />
          <CardContent className="px-3 py-2.5">
            <p className="text-pretty text-[11px] leading-relaxed text-muted-foreground">
              {analysis}
            </p>
          </CardContent>
        </>
      )}

      <Separator />
      <CardContent className="px-3 py-3">
        {recommendations.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <Activity className="size-5 text-muted-foreground/50" />
            <p className="text-xs text-muted-foreground">No deployment recommendations available</p>
            <p className="text-[11px] text-muted-foreground/70">Try a different specialty or broaden the search area</p>
          </div>
        ) : (
        <ol className="flex flex-col gap-1.5">
          {recommendations.map((rec, i) => (
            <li key={`${rec.region}-${rec.priority}`}>
              <Card className="flex gap-2.5 p-2.5">
                <Badge className="flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold">
                  {i + 1}
                </Badge>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="text-balance text-[13px] font-medium text-foreground">
                    {rec.region}
                  </span>
                  <p className="text-pretty text-[11px] text-muted-foreground">
                    {rec.reason}
                  </p>
                  {rec.suggestedHost && (
                    <div className="flex items-center gap-1">
                      <MapPin className="size-3 shrink-0 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">
                        Host:
                      </span>
                      <span className="truncate text-[10px] font-medium text-cyan-400">
                        {rec.suggestedHost.name}
                      </span>
                      {rec.suggestedHost.city && (
                        <span className="text-[10px] text-muted-foreground">
                          ({rec.suggestedHost.city})
                        </span>
                      )}
                    </div>
                  )}
                  {rec.suggestedLocation && !rec.suggestedHost && (
                    <div className="flex items-center gap-1">
                      <MapPin className="size-3 shrink-0 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">
                        Location:
                      </span>
                      <span className="truncate text-[10px] font-medium text-cyan-400">
                        {rec.suggestedLocation}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ol>
        )}
      </CardContent>
    </Card>
  );
}
