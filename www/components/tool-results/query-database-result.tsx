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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    <Card className="my-2 w-full overflow-hidden">
      <CardHeader className="flex-row items-center justify-between space-y-0 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Database className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            SQL Query
          </span>
        </div>
        <Badge className="font-mono text-[11px]" variant="secondary">
          {count} {count === 1 ? "row" : "rows"}
        </Badge>
      </CardHeader>

      {rows.length === 0 && (
        <CardContent className="flex flex-col items-center gap-2 py-6 text-center">
          <Database className="size-5 text-muted-foreground/40" />
          <p className="text-xs text-muted-foreground">Query returned no results</p>
        </CardContent>
      )}

      {rows.length > 0 && (
        <CardContent className="px-0 pb-0">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead
                      className="h-8 whitespace-nowrap px-3 font-mono text-[11px]"
                      key={col}
                    >
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice(0, 10).map((row, i) => (
                  <TableRow
                    className={cn(i % 2 === 1 && "bg-muted/30")}
                    key={`row-${String(i)}`}
                  >
                    {columns.map((col) => (
                      <TableCell
                        className="whitespace-nowrap px-3 py-1.5 tabular-nums text-xs"
                        key={`${String(i)}-${col}`}
                      >
                        {formatCellValue(row[col])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      )}

      <Separator />
      <CardFooter className="flex items-center justify-between px-3 py-2">
        {truncated || rows.length < count ? (
          <span className="text-[11px] text-muted-foreground">
            Showing {Math.min(rows.length, 10)} of {count} results
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">
            {count} {count === 1 ? "result" : "results"}
          </span>
        )}
        <Button
          className="h-6 gap-1 px-2 text-[11px]"
          onClick={() => setShowSql(!showSql)}
          size="sm"
          type="button"
          variant="ghost"
        >
          {showSql ? (
            <ChevronDown className="size-3" />
          ) : (
            <ChevronRight className="size-3" />
          )}
          {showSql ? "Hide SQL" : "Show SQL"}
        </Button>
      </CardFooter>

      {showSql && query && (
        <>
          <Separator />
          <CodeBlock
            className="rounded-none border-0"
            code={query}
            language="sql"
          >
            <CodeBlockHeader className="border-b-0 bg-transparent px-3 py-1.5">
              <CodeBlockTitle>
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  SQL
                </span>
              </CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton className="size-6 text-muted-foreground hover:text-foreground" />
              </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent code={query} language="sql" />
          </CodeBlock>
        </>
      )}
    </Card>
  );
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "\u2014";
  }
  if (typeof value === "number") {
    return value.toLocaleString();
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return String(value);
}
