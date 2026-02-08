"use client";

import { GitCompare } from "lucide-react";
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

  const metrics: { key: keyof RegionData; label: string }[] = [
    { key: "totalFacilities", label: "Total Facilities" },
    { key: "hospitals", label: "Hospitals" },
    { key: "clinics", label: "Clinics" },
    { key: "totalBeds", label: "Total Beds" },
    { key: "totalDoctors", label: "Total Doctors" },
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
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <CardHeader className="flex-row items-center justify-between space-y-0 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <GitCompare className="size-3.5 text-cyan-400" />
          <span className="text-xs font-medium text-muted-foreground">
            Region Comparison
          </span>
        </div>
        {specialtyFilter && (
          <Badge className="text-[10px]" variant="secondary">
            {specialtyFilter}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="px-0 pb-3">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-8 px-3 text-[11px]">Metric</TableHead>
                {comparison.map((r) => (
                  <TableHead
                    className="h-8 px-3 text-[11px] font-semibold text-foreground"
                    key={r.region}
                  >
                    {r.region}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((metric) => {
                const max = getMaxForMetric(metric.key);
                return (
                  <TableRow key={metric.key}>
                    <TableCell className="px-3 py-1.5 text-xs text-muted-foreground">
                      {metric.label}
                    </TableCell>
                    {comparison.map((r) => {
                      const val = r[metric.key];
                      const numVal = typeof val === "number" ? val : 0;
                      const isMax = numVal === max && max > 0;
                      return (
                        <TableCell
                          className={cn(
                            "whitespace-nowrap px-3 py-1.5 font-mono tabular-nums text-xs",
                            isMax
                              ? "font-semibold text-cyan-400"
                              : "text-foreground"
                          )}
                          key={`${r.region}-${metric.key}`}
                        >
                          {val === null
                            ? "\u2014"
                            : typeof val === "number"
                              ? val.toLocaleString()
                              : String(val)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell className="px-3 py-1.5 text-xs text-muted-foreground">
                  Top Specialties
                </TableCell>
                {comparison.map((r) => (
                  <TableCell
                    className="px-3 py-1.5 text-xs text-muted-foreground"
                    key={`${r.region}-specialties`}
                  >
                    {r.topSpecialties?.slice(0, 3).join(", ") || "\u2014"}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>

      {gaps.length > 0 && (
        <>
          <Separator />
          <CardContent className="px-3 py-2.5">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Identified Gaps
            </span>
            <ul className="flex flex-col gap-1">
              {gaps.map((gap) => (
                <li className="text-[11px] text-amber-400" key={gap}>
                  {gap}
                </li>
              ))}
            </ul>
          </CardContent>
        </>
      )}
    </Card>
  );
}
