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
    <Card className="my-2 w-full overflow-hidden">
      <CardHeader className="flex-row items-center gap-2 space-y-0 px-3 py-2.5">
        <Activity className="size-3.5 text-muted-foreground" />
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
            <Activity className="size-5 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">No deployment recommendations available</p>
          </div>
        ) : (
        <ol className="flex flex-col gap-1.5">
          {recommendations.map((rec, i) => (
            <li key={`${rec.region}-${rec.priority}`}>
              <div className="flex gap-2.5 rounded-md border border-border p-2.5">
                <Badge className="flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold" variant="secondary">
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
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <MapPin className="size-3 shrink-0" />
                      <span>Host:</span>
                      <span className="font-medium text-foreground">
                        {rec.suggestedHost.name}
                      </span>
                      {rec.suggestedHost.city && (
                        <span>({rec.suggestedHost.city})</span>
                      )}
                    </div>
                  )}
                  {rec.suggestedLocation && !rec.suggestedHost && (
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <MapPin className="size-3 shrink-0" />
                      <span>Location:</span>
                      <span className="font-medium text-foreground">
                        {rec.suggestedLocation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
        )}
      </CardContent>
    </Card>
  );
}
