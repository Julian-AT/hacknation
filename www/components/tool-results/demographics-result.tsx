"use client";

import { Users, TrendingDown, Activity, Globe } from "lucide-react";
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
    <div className="flex items-center gap-2 px-3 py-2.5">
      <Icon className={cn("size-3.5", colorMap[accent] ?? "text-emerald-400")} />
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
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
    <div className="flex flex-1 flex-col gap-1 rounded-md bg-muted p-3">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "font-mono text-lg font-bold",
          accent ? "text-emerald-400" : "text-foreground",
        )}
      >
        {display}
      </span>
    </div>
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
  if (rows.length === 0) return null;
  const cols = columns ?? Object.keys(rows.at(0) as Record<string, unknown>);
  return (
    <div className="overflow-x-auto px-3 py-2">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-border">
            {cols.map((col) => (
              <th
                key={col}
                className="whitespace-nowrap px-2 py-1 font-mono text-[11px] font-semibold text-muted-foreground"
              >
                {formatColumnName(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 16).map((row, i) => (
            <tr
              key={`row-${String(i)}`}
              className="border-b border-border/50 last:border-0"
            >
              {cols.map((col) => {
                const val = row[col];
                return (
                  <td
                    key={`${String(i)}-${col}`}
                    className={cn(
                      "whitespace-nowrap px-2 py-1",
                      col === highlightColumn
                        ? "font-mono font-bold text-emerald-400"
                        : "text-foreground",
                    )}
                  >
                    {formatCell(val)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
  if (val === null || val === undefined) return "—";
  if (typeof val === "number") {
    return val % 1 === 0 ? val.toLocaleString() : val.toFixed(2);
  }
  if (Array.isArray(val)) return val.join(", ");
  return String(val);
}

function RegionProfile({ result }: { result: Record<string, unknown> }) {
  const region = result.region as Record<string, unknown> | undefined;
  const comparison = result.nationalComparison as
    | Record<string, unknown>
    | undefined;
  if (!region) return null;

  const health = region.healthIndicators as Record<string, unknown> | undefined;
  const age = region.ageDistribution as Record<string, unknown> | undefined;
  const diseases = (region.diseaseBurden as string[]) ?? [];

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      <SectionHeader icon={Users} label={`${String(region.region)} — Demographics`} />

      <div className="flex flex-wrap gap-2 px-3 pb-2">
        <MetricCard
          label="Population"
          value={Number(region.population ?? 0)}
          accent
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
          value={String(region.classification ?? "—")}
        />
      </div>

      {health && (
        <div className="border-t border-border px-3 py-2">
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Health Indicators
          </span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(health).map(([key, val]) => (
              <span
                key={key}
                className="rounded bg-muted px-2 py-1 text-[11px] text-foreground"
              >
                <span className="text-muted-foreground">
                  {formatColumnName(key)}:{" "}
                </span>
                {formatCell(val)}
              </span>
            ))}
          </div>
        </div>
      )}

      {age && (
        <div className="border-t border-border px-3 py-2">
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Age Distribution
          </span>
          <div className="flex gap-2">
            {Object.entries(age).map(([key, val]) => (
              <span
                key={key}
                className="rounded bg-muted px-2 py-1 text-[11px] text-foreground"
              >
                {formatColumnName(key)}: {formatCell(val)}%
              </span>
            ))}
          </div>
        </div>
      )}

      {diseases.length > 0 && (
        <div className="border-t border-border px-3 py-2">
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Disease Burden
          </span>
          <div className="flex flex-wrap gap-1">
            {diseases.map((d) => (
              <span
                key={d}
                className="rounded bg-rose-950/30 px-1.5 py-0.5 text-[10px] text-rose-400"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {comparison && (
        <div className="border-t border-border px-3 py-2.5">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            vs National Average
          </span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(comparison).map(([key, val]) => (
              <span
                key={key}
                className="rounded bg-muted px-2 py-1 text-[11px] text-foreground"
              >
                <span className="text-muted-foreground">
                  {formatColumnName(key)}:{" "}
                </span>
                {String(val)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AllRegions({ result }: { result: Record<string, unknown> }) {
  const regions = (result.regions as Record<string, unknown>[]) ?? [];
  const total = result.totalRegions as number | undefined;
  const nationalPop = result.nationalPopulation as number | undefined;

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      <SectionHeader icon={Globe} label="All Regions Overview" />
      {(total !== undefined || nationalPop !== undefined) && (
        <div className="flex gap-2 px-3 pb-2">
          {total !== undefined && (
            <MetricCard label="Regions" value={total} accent />
          )}
          {nationalPop !== undefined && (
            <MetricCard label="National Pop." value={nationalPop} />
          )}
        </div>
      )}
      <DataTable
        rows={regions}
        columns={[
          "region",
          "population",
          "urbanPercent",
          "gdpPerCapitaUsd",
          "classification",
          "doctorsPer1000",
        ]}
      />
    </div>
  );
}

function UnderservedRanking({ result }: { result: Record<string, unknown> }) {
  const rankings = (result.rankings as Record<string, unknown>[]) ?? [];
  const methodology = result.methodology as string | undefined;

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      <SectionHeader
        icon={TrendingDown}
        label="Underserved Region Rankings"
        accent="rose"
      />
      {methodology && (
        <p className="px-3 pb-2 text-[11px] text-muted-foreground">
          {methodology}
        </p>
      )}
      <DataTable
        rows={rankings}
        columns={[
          "region",
          "population",
          "underservedScore",
          "doctorsPer1000",
          "maternalMortality",
          "ruralPercent",
        ]}
        highlightColumn="underservedScore"
      />
    </div>
  );
}

function AgeDemographics({ result }: { result: Record<string, unknown> }) {
  const regions = (result.regions as Record<string, unknown>[]) ?? [];
  const note = result.note as string | undefined;

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      <SectionHeader icon={Users} label="Age Demographics" accent="blue" />
      <DataTable
        rows={regions}
        columns={[
          "region",
          "population",
          "under15",
          "over65",
          "estimatedCataractDemand",
          "estimatedPediatricDemand",
        ]}
        highlightColumn="estimatedCataractDemand"
      />
      {note && (
        <p className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
          {note}
        </p>
      )}
    </div>
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
      <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
        <SectionHeader
          icon={Activity}
          label={`Disease Burden — ${String(result.region)}`}
          accent="rose"
        />
        <div className="px-3 pb-3">
          <div className="flex flex-wrap gap-1">
            {((result.diseaseBurden as string[]) ?? []).map((d) => (
              <span
                key={d}
                className="rounded bg-rose-950/30 px-1.5 py-0.5 text-[10px] text-rose-400"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      <SectionHeader
        icon={Activity}
        label="Disease Burden by Region"
        accent="rose"
      />
      {mostPrevalent.length > 0 && (
        <div className="px-3 pb-2">
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Most Prevalent Conditions
          </span>
          <div className="flex flex-wrap gap-1">
            {mostPrevalent.slice(0, 10).map((item) => (
              <span
                key={item.disease}
                className="rounded bg-rose-950/30 px-1.5 py-0.5 text-[10px] text-rose-400"
              >
                {item.disease} ({item.regionCount} regions)
              </span>
            ))}
          </div>
        </div>
      )}
      {regionDetails.length > 0 && (
        <div className="border-t border-border px-3 py-2">
          <DataTable
            rows={regionDetails.map((r) => ({
              region: r.region,
              diseases: (r.diseases ?? []).join(", "),
            }))}
          />
        </div>
      )}
    </div>
  );
}

function WHOBenchmarks({ result }: { result: Record<string, unknown> }) {
  const comparisons =
    (result.regionComparisons as Record<string, unknown>[]) ?? [];

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      <SectionHeader
        icon={Globe}
        label="WHO Benchmark Comparison"
        accent="amber"
      />
      <DataTable
        rows={comparisons}
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
      />
    </div>
  );
}

function UrbanRuralGap({ result }: { result: Record<string, unknown> }) {
  const urbanRegions =
    (result.urbanRegions as Record<string, unknown>[]) ?? [];
  const ruralRegions =
    (result.ruralRegions as Record<string, unknown>[]) ?? [];
  const gap = result.gap as Record<string, unknown> | undefined;

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      <SectionHeader
        icon={TrendingDown}
        label="Urban vs Rural Healthcare Gap"
        accent="amber"
      />
      {gap && (
        <div className="flex flex-wrap gap-2 px-3 pb-2">
          <MetricCard
            label="Avg Doctors (Urban)"
            value={String(gap.avgDoctorsUrban)}
            accent
          />
          <MetricCard
            label="Avg Doctors (Rural)"
            value={String(gap.avgDoctorsRural)}
          />
          <MetricCard
            label="Urban:Rural Ratio"
            value={String(gap.urbanToRuralRatio)}
          />
        </div>
      )}
      {urbanRegions.length > 0 && (
        <div className="border-t border-border">
          <span className="block px-3 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Urban Regions
          </span>
          <DataTable rows={urbanRegions} />
        </div>
      )}
      {ruralRegions.length > 0 && (
        <div className="border-t border-border">
          <span className="block px-3 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Rural Regions
          </span>
          <DataTable rows={ruralRegions} />
        </div>
      )}
    </div>
  );
}

function HighImpactSites({ result }: { result: Record<string, unknown> }) {
  const topSites = (result.topSites as Record<string, unknown>[]) ?? [];
  const methodology = result.methodology as string | undefined;

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      <SectionHeader
        icon={TrendingDown}
        label="High-Impact Intervention Sites"
        accent="emerald"
      />
      {methodology && (
        <p className="px-3 pb-2 text-[11px] text-muted-foreground">
          {methodology}
        </p>
      )}
      <DataTable
        rows={topSites}
        columns={[
          "region",
          "population",
          "impactScore",
          "doctorsPer1000",
          "urbanPercent",
          "rationale",
        ]}
        highlightColumn="impactScore"
      />
    </div>
  );
}
