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
  return "border-zinc-700 bg-zinc-900/50";
}

function getPriorityBadgeColor(priority: string): string {
  if (priority.toLowerCase().includes("critical"))
    return "bg-red-500/20 text-red-400";
  if (priority.toLowerCase().includes("high"))
    return "bg-orange-500/20 text-orange-400";
  if (priority.toLowerCase().includes("medium"))
    return "bg-yellow-500/20 text-yellow-400";
  return "bg-zinc-700/50 text-zinc-400";
}

export function MissionPlanRenderer({ data }: { data: MissionPlanData }) {
  if (!data) {
    return (
      <div className="flex size-full items-center justify-center bg-zinc-900 text-zinc-500">
        <div className="flex flex-col items-center gap-2">
          <div className="size-6 rounded-full border-2 border-zinc-600 border-t-amber-500 animate-spin" />
          <span className="text-sm">Planning mission...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex size-full flex-col overflow-y-auto bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4">
        <h2 className="text-lg font-semibold text-white text-balance">{data.title}</h2>
        {data.stage !== "complete" && (
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
            <div className="size-3 rounded-full border-2 border-zinc-600 border-t-amber-500 animate-spin" />
            <span className="capitalize">{data.stage}...</span>
          </div>
        )}
      </div>

      {/* Volunteer profile */}
      <div className="border-b border-zinc-800 px-6 py-4">
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Volunteer Profile
        </h3>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
            {data.volunteerProfile.specialty}
          </span>
          {data.volunteerProfile.duration && (
            <span className="rounded-md bg-zinc-700/50 px-2.5 py-1 text-xs text-zinc-300">
              {data.volunteerProfile.duration}
            </span>
          )}
          {data.volunteerProfile.preference && (
            <span className="rounded-md bg-zinc-700/50 px-2.5 py-1 text-xs text-zinc-300">
              {data.volunteerProfile.preference}
            </span>
          )}
        </div>
        {data.analysis && (
          <p className="mt-2 text-sm text-zinc-400 text-pretty">{data.analysis}</p>
        )}
      </div>

      {/* Recommendations */}
      <div className="flex-1 px-6 py-4">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
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
                <span className="shrink-0 text-xs text-zinc-500">
                  {rec.region}
                </span>
              </div>
              <p className="text-sm text-zinc-300 text-pretty">{rec.reason}</p>
              {rec.suggestedHost && (
                <div className="mt-2 rounded-md border border-zinc-700/50 bg-zinc-900/50 px-3 py-2 text-xs">
                  <span className="text-zinc-500">Suggested host: </span>
                  <span className="font-medium text-zinc-200">
                    {rec.suggestedHost.name}
                  </span>
                  {rec.suggestedHost.city && (
                    <span className="text-zinc-500">
                      {" "}
                      · {rec.suggestedHost.city}
                    </span>
                  )}
                  {rec.suggestedHost.distanceKm !== undefined && (
                    <span className="text-zinc-500 tabular-nums">
                      {" "}
                      · {rec.suggestedHost.distanceKm} km
                    </span>
                  )}
                </div>
              )}
              {rec.suggestedLocation && !rec.suggestedHost && (
                <div className="mt-2 text-xs text-zinc-500">
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
