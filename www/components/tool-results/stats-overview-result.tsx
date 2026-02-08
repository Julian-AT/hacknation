"use client";

import { BarChart3 } from "lucide-react";
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
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <CardHeader className="flex-row items-center gap-2 space-y-0 px-3 py-2.5">
        <BarChart3 className="size-3.5 text-blue-400" />
        <span className="text-xs font-medium text-muted-foreground">
          Facility Statistics
        </span>
      </CardHeader>

      {(totalFacilities !== undefined || facilitiesByType.length > 0) && (
        <CardContent className="flex flex-wrap gap-2 px-3 pb-3 pt-0">
          {totalFacilities !== undefined && (
            <MetricCard label="TOTAL" value={totalFacilities} />
          )}
          {facilitiesByType.slice(0, 4).map((item) => {
            const label = String(
              item.facility_type ?? item.type ?? "Unknown"
            ).toUpperCase();
            const value = Number(item.count ?? 0);
            return (
              <MetricCard accent key={label} label={label} value={value} />
            );
          })}
          {facilitiesWithCoordinates !== undefined && (
            <MetricCard
              accent
              label="GEO-CODED"
              value={facilitiesWithCoordinates}
            />
          )}
        </CardContent>
      )}

      {stats.length > 0 && (
        <>
          <Separator />
          <CardContent className="px-0 py-2">
            {groupBy && (
              <div className="px-3 pb-1">
                <Badge className="text-[10px] uppercase" variant="secondary">
                  Grouped by {groupBy}
                </Badge>
              </div>
            )}
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(
                      stats.at(0) as Record<string, unknown>
                    ).map((col) => (
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
                  {stats.slice(0, 10).map((row, i) => (
                    <TableRow key={`stat-${String(i)}`}>
                      {Object.values(row).map((val, j) => (
                        <TableCell
                          className="whitespace-nowrap px-3 py-1.5 tabular-nums text-xs"
                          key={`${String(i)}-${String(j)}`}
                        >
                          {val === null
                            ? "\u2014"
                            : typeof val === "number"
                              ? val.toLocaleString()
                              : String(val)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </>
      )}
    </Card>
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
    <Card className="flex flex-1 basis-20 flex-col gap-1 p-3">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span
        className={`font-mono text-lg font-bold tabular-nums ${accent ? "text-blue-400" : "text-foreground"}`}
      >
        {value.toLocaleString()}
      </span>
    </Card>
  );
}
