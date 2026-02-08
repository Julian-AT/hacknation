"use client";

import { Activity, Globe, TrendingDown, Users } from "lucide-react";
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

interface DemographicsResultProps {
  args: Record<string, unknown>;
  result: Record<string, unknown>;
}

export function DemographicsResult({ args, result }: DemographicsResultProps) {
  const query = args.query as string | undefined;

  switch (query) {
    case "region_profile":
      return <RegionProfile result={result} />;
    case "all_regions":
      return <AllRegions result={result} />;
    case "underserved_ranking":
      return <UnderservedRanking result={result} />;
    case "age_demographics":
      return <AgeDemographics result={result} />;
    case "disease_burden":
      return <DiseaseBurden result={result} />;
    case "who_benchmarks":
      return <WHOBenchmarks result={result} />;
    case "urban_rural_gap":
      return <UrbanRuralGap result={result} />;
    case "high_impact_sites":
      return <HighImpactSites result={result} />;
    default:
      return null;
  }
}

function SectionHeader({
  icon: Icon,
  label,
  accent = "emerald",
}: {
  icon: typeof Users;
  label: string;
  accent?: string;
}) {
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    rose: "text-rose-400",
    blue: "text-blue-400",
  };
  return (
    <CardHeader className="flex-row items-center gap-2 space-y-0 px-3 py-2.5">
      <Icon
        className={cn("size-3.5", colorMap[accent] ?? "text-emerald-400")}
      />
      <span className="text-balance text-xs font-medium text-muted-foreground">
        {label}
      </span>
    </CardHeader>
  );
}

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  const display =
    typeof value === "number" ? value.toLocaleString() : String(value);
  return (
    <Card className="flex flex-1 basis-20 flex-col gap-1 p-3">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "font-mono text-lg font-bold tabular-nums",
          accent ? "text-emerald-400" : "text-foreground"
        )}
      >
        {display}
      </span>
    </Card>
  );
}

function DataTable({
  rows,
  columns,
  highlightColumn,
}: {
  rows: Record<string, unknown>[];
  columns?: string[];
  highlightColumn?: string;
}) {
  if (rows.length === 0) {
    return null;
  }
  const cols = columns ?? Object.keys(rows.at(0) as Record<string, unknown>);
  return (
    <ScrollArea className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            {cols.map((col) => (
              <TableHead
                className="h-8 whitespace-nowrap px-3 font-mono text-[11px]"
                key={col}
              >
                {formatColumnName(col)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.slice(0, 16).map((row, i) => (
            <TableRow key={`row-${String(i)}`}>
              {cols.map((col) => {
                const val = row[col];
                return (
                  <TableCell
                    className={cn(
                      "whitespace-nowrap px-3 py-1.5 tabular-nums text-xs",
                      col === highlightColumn
                        ? "font-mono font-bold text-emerald-400"
                        : "text-foreground"
                    )}
                    key={`${String(i)}-${col}`}
                  >
                    {formatCell(val)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

function formatColumnName(col: string): string {
  return col
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/Per 1000/i, "/1k")
    .replace(/Per 100k/i, "/100k")
    .trim();
}

function formatCell(val: unknown): string {
  if (val === null || val === undefined) {
    return "\u2014";
  }
  if (typeof val === "number") {
    return val % 1 === 0 ? val.toLocaleString() : val.toFixed(2);
  }
  if (Array.isArray(val)) {
    return val.join(", ");
  }
  return String(val);
}

function RegionProfile({ result }: { result: Record<string, unknown> }) {
  const region = result.region as Record<string, unknown> | undefined;
  const comparison = result.nationalComparison as
    | Record<string, unknown>
    | undefined;
  if (!region) {
    return null;
  }

  const health = region.healthIndicators as Record<string, unknown> | undefined;
  const age = region.ageDistribution as Record<string, unknown> | undefined;
  const diseases = (region.diseaseBurden as string[]) ?? [];

  return (
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <SectionHeader
        icon={Users}
        label={`${String(region.region)} \u2014 Demographics`}
      />

      <CardContent className="flex flex-wrap gap-2 px-3 pb-2 pt-0">
        <MetricCard
          accent
          label="Population"
          value={Number(region.population ?? 0)}
        />
        <MetricCard
          label="Urban"
          value={`${String(region.urbanPercent ?? 0)}%`}
        />
        <MetricCard
          label="GDP/Capita"
          value={`$${Number(region.gdpPerCapitaUsd ?? 0).toLocaleString()}`}
        />
        <MetricCard
          label="Classification"
          value={String(region.classification ?? "\u2014")}
        />
      </CardContent>

      {health && (
        <>
          <Separator />
          <CardContent className="px-3 py-2">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Health Indicators
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(health).map(([key, val]) => (
                <Badge className="text-[11px] font-normal" key={key} variant="secondary">
                  <span className="text-muted-foreground">
                    {formatColumnName(key)}:{" "}
                  </span>
                  {formatCell(val)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </>
      )}

      {age && (
        <>
          <Separator />
          <CardContent className="px-3 py-2">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Age Distribution
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(age).map(([key, val]) => (
                <Badge className="text-[11px] font-normal" key={key} variant="secondary">
                  {formatColumnName(key)}: {formatCell(val)}%
                </Badge>
              ))}
            </div>
          </CardContent>
        </>
      )}

      {diseases.length > 0 && (
        <>
          <Separator />
          <CardContent className="px-3 py-2">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Disease Burden
            </span>
            <div className="flex flex-wrap gap-1">
              {diseases.map((d) => (
                <Badge
                  className="border-rose-500/20 bg-rose-500/10 text-[10px] text-rose-400"
                  key={d}
                  variant="outline"
                >
                  {d}
                </Badge>
              ))}
            </div>
          </CardContent>
        </>
      )}

      {comparison && (
        <>
          <Separator />
          <CardContent className="px-3 py-2.5">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              vs National Average
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(comparison).map(([key, val]) => (
                <Badge className="text-[11px] font-normal" key={key} variant="secondary">
                  <span className="text-muted-foreground">
                    {formatColumnName(key)}:{" "}
                  </span>
                  {String(val)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}

function AllRegions({ result }: { result: Record<string, unknown> }) {
  const regions = (result.regions as Record<string, unknown>[]) ?? [];
  const total = result.totalRegions as number | undefined;
  const nationalPop = result.nationalPopulation as number | undefined;

  return (
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <SectionHeader icon={Globe} label="All Regions Overview" />
      {(total !== undefined || nationalPop !== undefined) && (
        <CardContent className="flex flex-wrap gap-2 px-3 pb-2 pt-0">
          {total !== undefined && (
            <MetricCard accent label="Regions" value={total} />
          )}
          {nationalPop !== undefined && (
            <MetricCard label="National Pop." value={nationalPop} />
          )}
        </CardContent>
      )}
      <CardContent className="px-0 pb-0">
        <DataTable
          columns={[
            "region",
            "population",
            "urbanPercent",
            "gdpPerCapitaUsd",
            "classification",
            "doctorsPer1000",
          ]}
          rows={regions}
        />
      </CardContent>
    </Card>
  );
}

function UnderservedRanking({ result }: { result: Record<string, unknown> }) {
  const rankings = (result.rankings as Record<string, unknown>[]) ?? [];
  const methodology = result.methodology as string | undefined;

  return (
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <SectionHeader
        accent="rose"
        icon={TrendingDown}
        label="Underserved Region Rankings"
      />
      {methodology && (
        <CardContent className="px-3 pb-2 pt-0">
          <p className="text-pretty text-[11px] text-muted-foreground">
            {methodology}
          </p>
        </CardContent>
      )}
      <CardContent className="px-0 pb-0">
        <DataTable
          columns={[
            "region",
            "population",
            "underservedScore",
            "doctorsPer1000",
            "maternalMortality",
            "ruralPercent",
          ]}
          highlightColumn="underservedScore"
          rows={rankings}
        />
      </CardContent>
    </Card>
  );
}

function AgeDemographics({ result }: { result: Record<string, unknown> }) {
  const regions = (result.regions as Record<string, unknown>[]) ?? [];
  const note = result.note as string | undefined;

  return (
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <SectionHeader accent="blue" icon={Users} label="Age Demographics" />
      <CardContent className="px-0 pb-0">
        <DataTable
          columns={[
            "region",
            "population",
            "under15",
            "over65",
            "estimatedCataractDemand",
            "estimatedPediatricDemand",
          ]}
          highlightColumn="estimatedCataractDemand"
          rows={regions}
        />
      </CardContent>
      {note && (
        <>
          <Separator />
          <CardContent className="px-3 py-2">
            <p className="text-pretty text-[11px] text-muted-foreground">
              {note}
            </p>
          </CardContent>
        </>
      )}
    </Card>
  );
}

function DiseaseBurden({ result }: { result: Record<string, unknown> }) {
  const mostPrevalent =
    (result.mostPrevalent as { disease: string; regionCount: number }[]) ?? [];
  const regionDetails =
    (result.regionDetails as { region: string; diseases: string[] }[]) ?? [];
  const singleRegion = result.region as Record<string, unknown> | undefined;

  if (singleRegion) {
    return (
      <Card className="my-2 w-full overflow-hidden bg-muted/50">
        <SectionHeader
          accent="rose"
          icon={Activity}
          label={`Disease Burden \u2014 ${String(result.region)}`}
        />
        <CardContent className="px-3 pb-3 pt-0">
          <div className="flex flex-wrap gap-1">
            {((result.diseaseBurden as string[]) ?? []).map((d) => (
              <Badge
                className="border-rose-500/20 bg-rose-500/10 text-[10px] text-rose-400"
                key={d}
                variant="outline"
              >
                {d}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <SectionHeader
        accent="rose"
        icon={Activity}
        label="Disease Burden by Region"
      />
      {mostPrevalent.length > 0 && (
        <CardContent className="px-3 pb-2 pt-0">
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Most Prevalent Conditions
          </span>
          <div className="flex flex-wrap gap-1">
            {mostPrevalent.slice(0, 10).map((item) => (
              <Badge
                className="border-rose-500/20 bg-rose-500/10 text-[10px] text-rose-400"
                key={item.disease}
                variant="outline"
              >
                {item.disease} ({item.regionCount} regions)
              </Badge>
            ))}
          </div>
        </CardContent>
      )}
      {regionDetails.length > 0 && (
        <>
          <Separator />
          <CardContent className="px-0 py-2">
            <DataTable
              rows={regionDetails.map((r) => ({
                region: r.region,
                diseases: (r.diseases ?? []).join(", "),
              }))}
            />
          </CardContent>
        </>
      )}
    </Card>
  );
}

function WHOBenchmarks({ result }: { result: Record<string, unknown> }) {
  const comparisons =
    (result.regionComparisons as Record<string, unknown>[]) ?? [];

  return (
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <SectionHeader
        accent="amber"
        icon={Globe}
        label="WHO Benchmark Comparison"
      />
      <CardContent className="px-0 pb-0">
        <DataTable
          columns={[
            "region",
            "population",
            "doctorsPer1000",
            "doctorsVsWho",
            "doctorsVsDeveloped",
            "maternalMortality",
            "maternalMortalityVsDeveloped",
          ]}
          highlightColumn="doctorsVsWho"
          rows={comparisons}
        />
      </CardContent>
    </Card>
  );
}

function UrbanRuralGap({ result }: { result: Record<string, unknown> }) {
  const urbanRegions =
    (result.urbanRegions as Record<string, unknown>[]) ?? [];
  const ruralRegions =
    (result.ruralRegions as Record<string, unknown>[]) ?? [];
  const gap = result.gap as Record<string, unknown> | undefined;

  return (
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <SectionHeader
        accent="amber"
        icon={TrendingDown}
        label="Urban vs Rural Healthcare Gap"
      />
      {gap && (
        <CardContent className="flex flex-wrap gap-2 px-3 pb-2 pt-0">
          <MetricCard
            accent
            label="Avg Doctors (Urban)"
            value={String(gap.avgDoctorsUrban)}
          />
          <MetricCard
            label="Avg Doctors (Rural)"
            value={String(gap.avgDoctorsRural)}
          />
          <MetricCard
            label="Urban:Rural Ratio"
            value={String(gap.urbanToRuralRatio)}
          />
        </CardContent>
      )}
      {urbanRegions.length > 0 && (
        <>
          <Separator />
          <CardContent className="px-0 py-2">
            <div className="px-3 pb-1">
              <Badge className="text-[10px] uppercase" variant="secondary">
                Urban Regions
              </Badge>
            </div>
            <DataTable rows={urbanRegions} />
          </CardContent>
        </>
      )}
      {ruralRegions.length > 0 && (
        <>
          <Separator />
          <CardContent className="px-0 py-2">
            <div className="px-3 pb-1">
              <Badge className="text-[10px] uppercase" variant="secondary">
                Rural Regions
              </Badge>
            </div>
            <DataTable rows={ruralRegions} />
          </CardContent>
        </>
      )}
    </Card>
  );
}

function HighImpactSites({ result }: { result: Record<string, unknown> }) {
  const topSites = (result.topSites as Record<string, unknown>[]) ?? [];
  const methodology = result.methodology as string | undefined;

  return (
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <SectionHeader
        accent="emerald"
        icon={TrendingDown}
        label="High-Impact Intervention Sites"
      />
      {methodology && (
        <CardContent className="px-3 pb-2 pt-0">
          <p className="text-pretty text-[11px] text-muted-foreground">
            {methodology}
          </p>
        </CardContent>
      )}
      <CardContent className="px-0 pb-0">
        <DataTable
          columns={[
            "region",
            "population",
            "impactScore",
            "doctorsPer1000",
            "urbanPercent",
            "rationale",
          ]}
          highlightColumn="impactScore"
          rows={topSites}
        />
      </CardContent>
    </Card>
  );
}
