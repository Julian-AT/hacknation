"use client";

import { Activity, MapPin, Eye } from "lucide-react";
import { useVF } from "@/lib/vf-context";

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
  const { setMapVisible } = useVF();

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      {/* Profile header */}
      <div className="flex items-center gap-2 bg-cyan-950/20 px-3 py-2.5">
        <Activity className="size-3.5 text-pink-400" />
        <span className="text-xs font-medium text-muted-foreground">
          Mission Plan
          {volunteerProfile?.specialty &&
            `: ${volunteerProfile.specialty}`}
          {volunteerProfile?.duration &&
            `, ${volunteerProfile.duration}`}
        </span>
      </div>

      {/* Analysis */}
      {analysis && (
        <div className="border-b border-border px-3 py-2.5">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {analysis}
          </p>
        </div>
      )}

      {/* Recommendations */}
      <div className="flex flex-col gap-1.5 px-3 py-3">
        {recommendations.map((rec, i) => (
          <div
            key={`${rec.region}-${rec.priority}`}
            className="flex gap-2.5 rounded-md bg-muted p-2.5"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-cyan-400 font-mono text-xs font-bold text-foreground">
              {i + 1}
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-medium text-foreground">
                {rec.region}
              </span>
              <p className="text-[11px] text-muted-foreground">{rec.reason}</p>
              {rec.suggestedHost && (
                <div className="flex items-center gap-1">
                  <MapPin className="size-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Host:</span>
                  <span className="text-[10px] font-medium text-cyan-400">
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
                  <MapPin className="size-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Location:</span>
                  <span className="text-[10px] font-medium text-cyan-400">
                    {rec.suggestedLocation}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
