"use client";

type MissionPlanData = {
  title: string;
  volunteerProfile: {
    specialty: string;
    duration?: string;
    preference?: string;
  };
  analysis: string;
  recommendations: Array<{
    priority: string;
    region: string;
    reason: string;
    suggestedHost?: {
      id?: number;
      name: string;
      city?: string | null;
      distanceKm?: number;
    };
    suggestedLocation?: string;
  }>;
  stage: string;
  progress: number;
};

function getPriorityColor(priority: string): string {
  if (priority.toLowerCase().includes("critical"))
    return "border-red-500/30 bg-red-500/5";
  if (priority.toLowerCase().includes("high"))
    return "border-orange-500/30 bg-orange-500/5";
  if (priority.toLowerCase().includes("medium"))
    return "border-yellow-500/30 bg-yellow-500/5";
  return "border-border bg-muted/50";
}

function getPriorityBadgeColor(priority: string): string {
  if (priority.toLowerCase().includes("critical"))
    return "bg-red-500/20 text-red-400";
  if (priority.toLowerCase().includes("high"))
    return "bg-orange-500/20 text-orange-400";
  if (priority.toLowerCase().includes("medium"))
    return "bg-yellow-500/20 text-yellow-400";
  return "bg-muted text-muted-foreground";
}

export function MissionPlanRenderer({ data }: { data: MissionPlanData }) {
  if (!data) {
    return (
      <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <div className="size-6 rounded-full border-2 border-muted-foreground/30 border-t-amber-500 animate-spin" />
          <span className="text-sm">Planning mission...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex size-full flex-col overflow-y-auto bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold text-foreground text-balance">{data.title}</h2>
        {data.stage !== "complete" && (
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="size-3 rounded-full border-2 border-muted-foreground/30 border-t-amber-500 animate-spin" />
            <span className="capitalize">{data.stage}...</span>
          </div>
        )}
      </div>

      {/* Volunteer profile */}
      <div className="border-b border-border px-6 py-4">
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Volunteer Profile
        </h3>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
            {data.volunteerProfile.specialty}
          </span>
          {data.volunteerProfile.duration && (
            <span className="rounded-md bg-muted px-2.5 py-1 text-xs text-foreground">
              {data.volunteerProfile.duration}
            </span>
          )}
          {data.volunteerProfile.preference && (
            <span className="rounded-md bg-muted px-2.5 py-1 text-xs text-foreground">
              {data.volunteerProfile.preference}
            </span>
          )}
        </div>
        {data.analysis && (
          <p className="mt-2 text-sm text-muted-foreground text-pretty">{data.analysis}</p>
        )}
      </div>

      {/* Recommendations */}
      <div className="flex-1 px-6 py-4">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Deployment Recommendations
        </h3>
        <div className="flex flex-col gap-3">
          {data.recommendations.map((rec, i) => (
            <div
              className={`rounded-lg border p-4 ${getPriorityColor(rec.priority)}`}
              key={i}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityBadgeColor(rec.priority)}`}
                >
                  {rec.priority}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {rec.region}
                </span>
              </div>
              <p className="text-sm text-foreground text-pretty">{rec.reason}</p>
              {rec.suggestedHost && (
                <div className="mt-2 rounded-md border border-border/50 bg-muted/50 px-3 py-2 text-xs">
                  <span className="text-muted-foreground">Suggested host: </span>
                  <span className="font-medium text-foreground">
                    {rec.suggestedHost.name}
                  </span>
                  {rec.suggestedHost.city && (
                    <span className="text-muted-foreground">
                      {" "}
                      · {rec.suggestedHost.city}
                    </span>
                  )}
                  {rec.suggestedHost.distanceKm !== undefined && (
                    <span className="text-muted-foreground tabular-nums">
                      {" "}
                      · {rec.suggestedHost.distanceKm} km
                    </span>
                  )}
                </div>
              )}
              {rec.suggestedLocation && !rec.suggestedHost && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Location: {rec.suggestedLocation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
