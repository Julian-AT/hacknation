"use client";

import { ChevronDown, ChevronRight, Database } from "lucide-react";
import { useState } from "react";
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ai-elements/code-block";
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
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Database className="size-3.5 text-blue-400" />
          <span className="text-xs font-medium text-muted-foreground">
            SQL Query
          </span>
        </div>
        <span className="rounded-full bg-blue-950/50 px-2 py-0.5 font-mono text-[11px] font-semibold text-blue-400">
          {count} {count === 1 ? "row" : "rows"}
        </span>
      </div>

      {rows.length > 0 && (
        <div className="overflow-x-auto px-3 pb-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border">
                {columns.map((col) => (
                  <th
                    className="whitespace-nowrap px-2 py-1.5 font-mono text-[11px] font-semibold text-muted-foreground"
                    key={col}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 10).map((row, i) => (
                <tr
                  className={cn(
                    "border-b border-border/50 last:border-0",
                    i % 2 === 1 && "bg-muted/30"
                  )}
                  key={`row-${String(i)}`}
                >
                  {columns.map((col) => (
                    <td
                      className="whitespace-nowrap px-2 py-1.5 text-foreground"
                      key={`${String(i)}-${col}`}
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

      <div className="flex items-center justify-between border-t border-border px-3 py-2">
        {truncated || rows.length < count ? (
          <span className="text-[11px] text-muted-foreground">
            Showing {Math.min(rows.length, 10)} of {count} results
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">
            {count} {count === 1 ? "result" : "results"}
          </span>
        )}
        <button
          className="flex items-center gap-1 text-[11px] font-medium text-blue-400 hover:text-blue-300"
          onClick={() => setShowSql(!showSql)}
          type="button"
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
        <div className="border-t border-border">
          <CodeBlock
            className="border-0 rounded-none"
            code={query}
            language="sql"
          >
            <CodeBlockHeader className="border-b-0 bg-transparent px-3 py-1.5">
              <CodeBlockTitle>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  SQL
                </span>
              </CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton className="size-6 text-muted-foreground hover:text-foreground" />
              </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent code={query} language="sql" />
          </CodeBlock>
        </div>
      )}
    </div>
  );
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "—";
  }
  if (typeof value === "number") {
    return value.toLocaleString();
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return String(value);
}
