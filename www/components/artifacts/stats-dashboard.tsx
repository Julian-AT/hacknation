"use client";

type StatsDashboardData = {
  title: string;
  groupBy?: string;
  totalFacilities?: number;
  facilitiesWithCoordinates?: number;
  stats: Array<Record<string, unknown>>;
  stage: string;
  progress: number;
};

export function StatsDashboardRenderer({
  data,
}: {
  data: StatsDashboardData;
}) {
  if (!data) {
    return (
      <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <div className="size-6 rounded-full border-2 border-muted-foreground/30 border-t-emerald-500 animate-spin" />
          <span className="text-sm">Loading statistics...</span>
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
            <div className="size-3 rounded-full border-2 border-muted-foreground/30 border-t-emerald-500 animate-spin" />
            <span className="capitalize">{data.stage}...</span>
          </div>
        )}
      </div>

      {/* Top-level metrics */}
      {(data.totalFacilities !== undefined ||
        data.facilitiesWithCoordinates !== undefined) && (
        <div className="grid grid-cols-2 gap-4 border-b border-border p-6">
          {data.totalFacilities !== undefined && (
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="text-xs text-muted-foreground">Total Facilities</div>
              <div className="mt-1 text-2xl font-bold text-foreground tabular-nums">
                {data.totalFacilities.toLocaleString()}
              </div>
            </div>
          )}
          {data.facilitiesWithCoordinates !== undefined && (
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="text-xs text-muted-foreground">
                With Coordinates
              </div>
              <div className="mt-1 text-2xl font-bold text-foreground tabular-nums">
                {data.facilitiesWithCoordinates.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats table */}
      {data.stats.length > 0 && (
        <div className="flex-1 p-6">
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {Object.keys(data.stats[0]).map((key) => (
                    <th
                      className="px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground"
                      key={key}
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.stats.map((row, i) => (
                  <tr
                    className="border-b border-border/50 transition-colors hover:bg-muted/30"
                    key={i}
                  >
                    {Object.entries(row).map(([key, val]) => (
                      <td className="px-4 py-2 text-foreground" key={key}>
                        {typeof val === "number" ? (
                          <span className="tabular-nums">
                            {val.toLocaleString()}
                          </span>
                        ) : (
                          String(val ?? "—")
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
