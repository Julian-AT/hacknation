"use client";

import { BarChart3 } from "lucide-react";

interface StatsOverviewResultProps {
  result: Record<string, unknown>;
}

export function StatsOverviewResult({ result }: StatsOverviewResultProps) {
  const totalFacilities = result.totalFacilities as number | undefined;
  const facilitiesByType =
    (result.facilitiesByType as Record<string, unknown>[]) ?? [];
  const facilitiesWithCoordinates = result.facilitiesWithCoordinates as
    | number
    | undefined;
  const stats = (result.stats as Record<string, unknown>[]) ?? [];
  const groupBy = result.groupBy as string | undefined;

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <BarChart3 className="size-3.5 text-blue-400" />
        <span className="text-xs font-medium text-zinc-400">
          Facility Statistics
        </span>
      </div>

      {(totalFacilities !== undefined || facilitiesByType.length > 0) && (
        <div className="flex gap-2 px-3 pb-3">
          {totalFacilities !== undefined && (
            <MetricCard label="TOTAL" value={totalFacilities} />
          )}
          {facilitiesByType.slice(0, 4).map((item) => {
            const label = String(
              item.facility_type ?? item.type ?? "Unknown",
            ).toUpperCase();
            const value = Number(item.count ?? 0);
            return <MetricCard key={label} label={label} value={value} accent />;
          })}
          {facilitiesWithCoordinates !== undefined && (
            <MetricCard
              label="GEO-CODED"
              value={facilitiesWithCoordinates}
              accent
            />
          )}
        </div>
      )}

      {stats.length > 0 && (
        <div className="overflow-x-auto border-t border-zinc-800 px-3 py-2">
          {groupBy && (
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Grouped by {groupBy}
            </span>
          )}
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800">
                {Object.keys(stats.at(0) as Record<string, unknown>).map(
                  (col) => (
                    <th
                      key={col}
                      className="whitespace-nowrap px-2 py-1 font-mono text-[11px] font-semibold text-zinc-500"
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {stats.slice(0, 10).map((row, i) => (
                <tr
                  key={`stat-${String(i)}`}
                  className="border-b border-zinc-800/50 last:border-0"
                >
                  {Object.values(row).map((val, j) => (
                    <td
                      key={`${String(i)}-${String(j)}`}
                      className="whitespace-nowrap px-2 py-1 text-zinc-300"
                    >
                      {val === null
                        ? "—"
                        : typeof val === "number"
                          ? val.toLocaleString()
                          : String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col gap-1 rounded-md bg-zinc-800/60 p-3">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </span>
      <span
        className={`font-mono text-lg font-bold ${accent ? "text-blue-400" : "text-zinc-100"}`}
      >
        {value.toLocaleString()}
      </span>
    </div>
  );
}
