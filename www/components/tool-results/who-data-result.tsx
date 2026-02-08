"use client";

import { Globe, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

  if (comparisonTable && comparisonTable.length > 0) {
    const cols = Object.keys(comparisonTable.at(0) as Record<string, unknown>);
    return (
      <Card className="my-2 w-full overflow-hidden bg-muted/50">
        <CardHeader className="flex-row items-center gap-2 space-y-0 px-3 py-2.5">
          <Globe className="size-3.5 text-blue-400" />
          <span className="text-balance text-xs font-medium text-muted-foreground">
            WHO Health Indicators &mdash; Country Comparison
          </span>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  {cols.map((col) => (
                    <TableHead
                      className="h-8 whitespace-nowrap px-3 font-mono text-[11px]"
                      key={col}
                    >
                      {col === "indicator" ? "Indicator" : col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonTable.map((row, i) => (
                  <TableRow key={`cmp-${String(i)}`}>
                    {cols.map((col) => (
                      <TableCell
                        className={cn(
                          "whitespace-nowrap px-3 py-1.5 tabular-nums text-xs",
                          col === "indicator"
                            ? "max-w-[200px] truncate text-muted-foreground"
                            : "font-mono text-foreground"
                        )}
                        key={`${String(i)}-${col}`}
                      >
                        {String(row[col] ?? "\u2014")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
        {note && (
          <>
            <Separator />
            <CardContent className="px-3 py-2">
              <p className="text-pretty text-[10px] text-muted-foreground">
                {note}
              </p>
            </CardContent>
          </>
        )}
      </Card>
    );
  }

  if (!indicators) {
    return null;
  }

  const entries = Object.entries(indicators);

  return (
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <CardHeader className="flex-row items-center justify-between space-y-0 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Globe className="size-3.5 text-blue-400" />
          <span className="text-xs font-medium text-muted-foreground">
            WHO Health Indicators &mdash; {country ?? "Ghana"}
          </span>
        </div>
        <Badge className="text-[10px]" variant="secondary">
          WHO GHO
        </Badge>
      </CardHeader>

      {summary.length > 0 && (
        <CardContent className="px-3 pb-2 pt-0">
          {summary.map((line) => (
            <p className="text-pretty text-[11px] text-foreground" key={line}>
              {line}
            </p>
          ))}
        </CardContent>
      )}

      <Separator />
      <CardContent className="px-0 py-2">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-8 px-3 text-[11px]">
                  Indicator
                </TableHead>
                <TableHead className="h-8 px-3 text-[11px]">Value</TableHead>
                <TableHead className="h-8 px-3 text-[11px]">Year</TableHead>
                <TableHead className="h-8 px-3 text-[11px]">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map(([key, data]) => (
                <TableRow key={key}>
                  <TableCell className="max-w-[220px] truncate px-3 py-1.5 text-xs text-muted-foreground">
                    {data.label}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-1.5 font-mono font-bold tabular-nums text-xs text-emerald-400">
                    {data.value !== null
                      ? typeof data.value === "number"
                        ? data.value.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })
                        : String(data.value)
                      : "N/A"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-1.5 tabular-nums text-xs text-muted-foreground">
                    {data.year ?? "\u2014"}
                  </TableCell>
                  <TableCell className="px-3 py-1.5">
                    {data.trend && data.trend.length > 1 && (
                      <MiniTrend points={data.trend} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>

      {note && (
        <>
          <Separator />
          <CardContent className="px-3 py-2">
            <p className="text-pretty text-[10px] text-muted-foreground">
              Source: WHO Global Health Observatory. {note}
            </p>
          </CardContent>
        </>
      )}
    </Card>
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
          "tabular-nums text-[10px]",
          isUp ? "text-emerald-400" : "text-rose-400"
        )}
      >
        {isUp ? "+" : ""}
        {diff.toFixed(1)}
      </span>
    </span>
  );
}
