"use client";

import { Database, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface QueryDatabaseResultProps {
  args: Record<string, unknown>;
  result: Record<string, unknown>;
}

export function QueryDatabaseResult({
  args,
  result,
}: QueryDatabaseResultProps) {
  const [showSql, setShowSql] = useState(false);
  const rows = (result.rows as Record<string, unknown>[]) ?? [];
  const count = (result.count as number) ?? rows.length;
  const truncated = result.truncated as boolean;
  const query = (result.query as string) ?? (args.query as string) ?? "";

  const columns =
    rows.length > 0 ? Object.keys(rows.at(0) as Record<string, unknown>) : [];

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Database className="size-3.5 text-blue-400" />
          <span className="text-xs font-medium text-zinc-400">SQL Query</span>
        </div>
        <span className="rounded-full bg-blue-950/50 px-2 py-0.5 font-mono text-[11px] font-semibold text-blue-400">
          {count} {count === 1 ? "row" : "rows"}
        </span>
      </div>

      {rows.length > 0 && (
        <div className="overflow-x-auto px-3 pb-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="whitespace-nowrap px-2 py-1.5 font-mono text-[11px] font-semibold text-zinc-500"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 10).map((row, i) => (
                <tr
                  key={`row-${String(i)}`}
                  className={cn(
                    "border-b border-zinc-800/50 last:border-0",
                    i % 2 === 1 && "bg-zinc-800/30",
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={`${String(i)}-${col}`}
                      className="whitespace-nowrap px-2 py-1.5 text-zinc-300"
                    >
                      {formatCellValue(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-zinc-800 px-3 py-2">
        {truncated || rows.length < count ? (
          <span className="text-[11px] text-zinc-500">
            Showing {Math.min(rows.length, 10)} of {count} results
          </span>
        ) : (
          <span className="text-[11px] text-zinc-500">
            {count} {count === 1 ? "result" : "results"}
          </span>
        )}
        <button
          type="button"
          onClick={() => setShowSql(!showSql)}
          className="flex items-center gap-1 text-[11px] font-medium text-blue-400 hover:text-blue-300"
        >
          {showSql ? (
            <ChevronDown className="size-3" />
          ) : (
            <ChevronRight className="size-3" />
          )}
          {showSql ? "Hide SQL" : "Show SQL"}
        </button>
      </div>

      {showSql && query && (
        <div className="border-t border-zinc-800 px-3 py-2">
          <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[11px] text-zinc-400">
            {query}
          </pre>
        </div>
      )}
    </div>
  );
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return value.toLocaleString();
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}
