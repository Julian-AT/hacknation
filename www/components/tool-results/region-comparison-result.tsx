"use client";

import { GitCompare } from "lucide-react";
import { cn } from "@/lib/utils";

interface RegionData {
  region: string;
  totalFacilities: number;
  hospitals: number;
  clinics: number;
  totalBeds: number | null;
  totalDoctors: number | null;
  topSpecialties: string[];
  matchingFacilities?: number;
}

interface RegionComparisonResultProps {
  result: Record<string, unknown>;
}

export function RegionComparisonResult({
  result,
}: RegionComparisonResultProps) {
  const comparison = (result.comparison as RegionData[]) ?? [];
  const gaps = (result.gaps as string[]) ?? [];
  const specialtyFilter = result.specialtyFilter as string | null;

  if (comparison.length === 0) {
    return null;
  }

  const metrics: { key: keyof RegionData; label: string; format?: "number" }[] =
    [
      { key: "totalFacilities", label: "Total Facilities", format: "number" },
      { key: "hospitals", label: "Hospitals", format: "number" },
      { key: "clinics", label: "Clinics", format: "number" },
      { key: "totalBeds", label: "Total Beds", format: "number" },
      { key: "totalDoctors", label: "Total Doctors", format: "number" },
    ];

  const getMaxForMetric = (key: keyof RegionData): number => {
    return Math.max(
      ...comparison.map((r) => {
        const val = r[key];
        return typeof val === "number" ? val : 0;
      })
    );
  };

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <GitCompare className="size-3.5 text-cyan-400" />
          <span className="text-xs font-medium text-muted-foreground">
            Region Comparison
          </span>
        </div>
        {specialtyFilter && (
          <span className="rounded bg-cyan-950/40 px-1.5 py-0.5 text-[10px] text-cyan-400">
            {specialtyFilter}
          </span>
        )}
      </div>

      <div className="overflow-x-auto px-3 pb-3">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground">
                Metric
              </th>
              {comparison.map((r) => (
                <th
                  className="px-2 py-1.5 text-[11px] font-semibold text-foreground"
                  key={r.region}
                >
                  {r.region}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => {
              const max = getMaxForMetric(metric.key);
              return (
                <tr
                  className="border-b border-border/50 last:border-0"
                  key={metric.key}
                >
                  <td className="whitespace-nowrap px-2 py-1.5 text-muted-foreground">
                    {metric.label}
                  </td>
                  {comparison.map((r) => {
                    const val = r[metric.key];
                    const numVal = typeof val === "number" ? val : 0;
                    const isMax = numVal === max && max > 0;
                    return (
                      <td
                        className={cn(
                          "whitespace-nowrap px-2 py-1.5 font-mono",
                          isMax ? "text-cyan-400" : "text-foreground"
                        )}
                        key={`${r.region}-${metric.key}`}
                      >
                        {val === null
                          ? "—"
                          : typeof val === "number"
                            ? val.toLocaleString()
                            : String(val)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr className="border-b border-border/50 last:border-0">
              <td className="whitespace-nowrap px-2 py-1.5 text-muted-foreground">
                Top Specialties
              </td>
              {comparison.map((r) => (
                <td
                  className="px-2 py-1.5 text-muted-foreground"
                  key={`${r.region}-specialties`}
                >
                  {r.topSpecialties?.slice(0, 3).join(", ") || "—"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {gaps.length > 0 && (
        <div className="border-t border-border px-3 py-2.5">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Identified Gaps
          </span>
          <div className="flex flex-col gap-1">
            {gaps.map((gap) => (
              <span className="text-[11px] text-amber-400" key={gap}>
                {gap}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
