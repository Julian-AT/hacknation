"use client";

import { Globe, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface WHODataResultProps {
  result: Record<string, unknown>;
}

export function WHODataResult({ result }: WHODataResultProps) {
  const country = result.country as string | undefined;
  const indicators = result.indicators as
    | Record<string, IndicatorData>
    | undefined;
  const comparisonTable = result.comparisonTable as
    | Record<string, unknown>[]
    | undefined;
  const summary = (result.summary as string[]) ?? [];
  const note = result.note as string | undefined;

  // Comparison mode
  if (comparisonTable && comparisonTable.length > 0) {
    const cols = Object.keys(comparisonTable.at(0) as Record<string, unknown>);
    return (
      <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <Globe className="size-3.5 text-blue-400" />
          <span className="text-xs font-medium text-muted-foreground">
            WHO Health Indicators — Country Comparison
          </span>
        </div>
        <div className="overflow-x-auto px-3 pb-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border">
                {cols.map((col) => (
                  <th
                    className="whitespace-nowrap px-2 py-1 font-mono text-[11px] font-semibold text-muted-foreground"
                    key={col}
                  >
                    {col === "indicator" ? "Indicator" : col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonTable.map((row, i) => (
                <tr
                  className="border-b border-border/50 last:border-0"
                  key={`cmp-${String(i)}`}
                >
                  {cols.map((col) => (
                    <td
                      className={cn(
                        "whitespace-nowrap px-2 py-1",
                        col === "indicator"
                          ? "max-w-[200px] truncate text-muted-foreground"
                          : "font-mono text-foreground"
                      )}
                      key={`${String(i)}-${col}`}
                    >
                      {String(row[col] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {note && (
          <p className="border-t border-border px-3 py-2 text-[10px] text-muted-foreground">
            {note}
          </p>
        )}
      </div>
    );
  }

  // Single country mode
  if (!indicators) {
    return null;
  }

  const entries = Object.entries(indicators);

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Globe className="size-3.5 text-blue-400" />
          <span className="text-xs font-medium text-muted-foreground">
            WHO Health Indicators — {country ?? "Ghana"}
          </span>
        </div>
        <span className="rounded bg-blue-950/40 px-1.5 py-0.5 text-[10px] text-blue-400">
          WHO GHO
        </span>
      </div>

      {summary.length > 0 && (
        <div className="px-3 pb-2">
          {summary.map((line) => (
            <p className="text-[11px] text-foreground" key={line}>
              {line}
            </p>
          ))}
        </div>
      )}

      <div className="overflow-x-auto border-t border-border px-3 py-2">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                Indicator
              </th>
              <th className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                Value
              </th>
              <th className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                Year
              </th>
              <th className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([key, data]) => (
              <tr className="border-b border-border/50 last:border-0" key={key}>
                <td className="max-w-[220px] truncate px-2 py-1.5 text-muted-foreground">
                  {data.label}
                </td>
                <td className="whitespace-nowrap px-2 py-1.5 font-mono font-bold text-emerald-400">
                  {data.value !== null
                    ? typeof data.value === "number"
                      ? data.value.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })
                      : String(data.value)
                    : "N/A"}
                </td>
                <td className="whitespace-nowrap px-2 py-1.5 text-muted-foreground">
                  {data.year ?? "—"}
                </td>
                <td className="px-2 py-1.5">
                  {data.trend && data.trend.length > 1 && (
                    <MiniTrend points={data.trend} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {note && (
        <p className="border-t border-border px-3 py-2 text-[10px] text-muted-foreground">
          Source: WHO Global Health Observatory. {note}
        </p>
      )}
    </div>
  );
}

interface IndicatorData {
  label: string;
  unit: string;
  category: string;
  value: number | null;
  year: number | null;
  source: string;
  trend?: { year: number; value: number }[];
}

function MiniTrend({
  points,
}: {
  points: { year: number; value: number | null }[];
}) {
  const valid = points.filter(
    (p): p is { year: number; value: number } => p.value !== null
  );
  if (valid.length < 2) {
    return null;
  }

  const latest = valid.at(0)?.value ?? 0;
  const previous = valid.at(1)?.value ?? 0;
  const diff = latest - previous;
  const isUp = diff > 0;

  return (
    <span className="flex items-center gap-1">
      <TrendingUp
        className={cn(
          "size-3",
          isUp ? "text-emerald-400" : "rotate-180 text-rose-400"
        )}
      />
      <span
        className={cn(
          "text-[10px]",
          isUp ? "text-emerald-400" : "text-rose-400"
        )}
      >
        {isUp ? "+" : ""}
        {diff.toFixed(1)}
      </span>
    </span>
  );
}
