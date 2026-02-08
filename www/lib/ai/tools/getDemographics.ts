import { tool } from "ai";
import { and, eq, gte, ilike, lte, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import {
  demographicsBenchmarks,
  demographicsCountries,
  demographicsRegions,
} from "../../db/schema.demographics";
import { createToolLogger } from "./debug";

// ---------------------------------------------------------------------------
// Internal types for DB rows
// ---------------------------------------------------------------------------

type RegionRow = typeof demographicsRegions.$inferSelect;
type CountryRow = typeof demographicsCountries.$inferSelect;
type BenchmarkRow = typeof demographicsBenchmarks.$inferSelect;

// ---------------------------------------------------------------------------
// Helper: find region by fuzzy name match
// ---------------------------------------------------------------------------

async function findRegion(
  countryCode: string,
  name: string
): Promise<RegionRow | undefined> {
  // Try exact match first (case-insensitive)
  const exact = await db
    .select()
    .from(demographicsRegions)
    .where(
      and(
        eq(demographicsRegions.countryCode, countryCode),
        ilike(demographicsRegions.region, name)
      )
    )
    .limit(1);

  if (exact.length > 0) {
    return exact[0];
  }

  // Fuzzy: region contains search term or vice versa
  const fuzzy = await db
    .select()
    .from(demographicsRegions)
    .where(
      and(
        eq(demographicsRegions.countryCode, countryCode),
        ilike(demographicsRegions.region, `%${name}%`)
      )
    )
    .limit(1);

  return fuzzy[0];
}

// ---------------------------------------------------------------------------
// Helper: fetch all data for a query
// ---------------------------------------------------------------------------

async function fetchCountry(code: string): Promise<CountryRow | undefined> {
  const rows = await db
    .select()
    .from(demographicsCountries)
    .where(eq(demographicsCountries.countryCode, code))
    .limit(1);
  return rows[0];
}

function fetchRegions(
  code: string,
  gdpRange?: { min?: number; max?: number },
  populationRange?: { min?: number; max?: number }
): Promise<RegionRow[]> {
  const conditions = [eq(demographicsRegions.countryCode, code)];

  if (gdpRange?.min !== undefined) {
    conditions.push(gte(demographicsRegions.gdpPerCapitaUsd, gdpRange.min));
  }
  if (gdpRange?.max !== undefined) {
    conditions.push(lte(demographicsRegions.gdpPerCapitaUsd, gdpRange.max));
  }
  if (populationRange?.min !== undefined) {
    conditions.push(
      sql`${demographicsRegions.population} >= ${populationRange.min}`
    );
  }
  if (populationRange?.max !== undefined) {
    conditions.push(
      sql`${demographicsRegions.population} <= ${populationRange.max}`
    );
  }

  return db
    .select()
    .from(demographicsRegions)
    .where(and(...conditions));
}

async function fetchBenchmark(name: string): Promise<BenchmarkRow | undefined> {
  const rows = await db
    .select()
    .from(demographicsBenchmarks)
    .where(eq(demographicsBenchmarks.benchmarkName, name))
    .limit(1);
  return rows[0];
}

/**
 * Demographics & Population tool — provides population data, age demographics,
 * health indicators, disease burden, and WHO/international benchmarking.
 *
 * Data is stored in the database (demographics_countries, demographics_regions,
 * demographics_benchmarks tables) and supports any country.
 *
 * Covers VF Agent questions:
 * - 2.4: Urban vs rural service gaps
 * - 9.1–9.6: Unmet needs & demand analysis
 * - 10.1–10.4: Benchmarking & comparative analysis
 */
export const getDemographics = tool({
  description:
    "Retrieve population, demographics, health indicators, disease burden, and WHO benchmarks by region. Data is stored in the database and supports multiple countries. Use for demand analysis, benchmarking, and identifying underserved populations. Covers questions about population size, age distribution, GDP per capita, doctor-to-patient ratios, urban/rural splits, and disease prevalence.",
  inputSchema: z.object({
    countryCode: z
      .string()
      .max(3)
      .default("GHA")
      .describe(
        "ISO 3166-1 alpha-3 country code (e.g., GHA, NGA, KEN, USA, GBR). Defaults to GHA."
      ),
    region: z
      .string()
      .max(100)
      .optional()
      .describe(
        "Get demographics for a specific region (e.g., 'Northern', 'Greater Accra', 'Lagos')"
      ),
    query: z
      .enum([
        "region_profile",
        "all_regions",
        "underserved_ranking",
        "age_demographics",
        "disease_burden",
        "who_benchmarks",
        "urban_rural_gap",
        "high_impact_sites",
      ])
      .describe(
        "Type of query: region_profile (single region details), all_regions (summary table), underserved_ranking (ranked by healthcare access gaps), age_demographics (age distribution analysis), disease_burden (disease prevalence by region), who_benchmarks (compare to WHO/international standards), urban_rural_gap (urban vs rural service availability), high_impact_sites (population + infrastructure sweet spots)"
      ),
    gdpRange: z
      .object({
        min: z.number().optional(),
        max: z.number().optional(),
      })
      .optional()
      .describe("Filter regions by GDP per capita range (USD)"),
    populationRange: z
      .object({
        min: z.number().optional(),
        max: z.number().optional(),
      })
      .optional()
      .describe("Filter regions by population range"),
  }),
  execute: async ({
    countryCode,
    region,
    query,
    gdpRange,
    populationRange,
  }) => {
    const log = createToolLogger("getDemographics");
    const start = Date.now();
    log.start({ countryCode, region, query, gdpRange, populationRange });

    try {
      // Fetch country-level data
      const country = await fetchCountry(countryCode);
      if (!country) {
        const result = {
          error: `Country "${countryCode}" not found in demographics database.`,
        };
        log.error(result, { countryCode }, Date.now() - start);
        return result;
      }

      // Fetch filtered regions
      const filteredRegions = await fetchRegions(
        countryCode,
        gdpRange,
        populationRange
      );

      let output: Record<string, unknown>;

      switch (query) {
        case "region_profile": {
          if (!region) {
            output = {
              error: "Region name is required for region_profile query",
            };
            break;
          }
          const found = await findRegion(countryCode, region);
          if (!found) {
            output = {
              error: `Region "${region}" not found. Available: ${filteredRegions.map((r) => r.region).join(", ")}`,
            };
            break;
          }
          const natPop = country.totalPopulation ?? 1;
          const natDoctors = country.doctorsPer1000 ?? 1;
          const natGdp = country.gdpPerCapitaUsd ?? 1;
          output = {
            region: {
              region: found.region,
              capital: found.capital,
              population: found.population,
              urbanPercent: found.urbanPercent,
              ruralPercent: found.ruralPercent,
              areaSqKm: found.areaSqKm,
              populationDensity: found.populationDensity,
              classification: found.classification,
              gdpPerCapitaUsd: found.gdpPerCapitaUsd,
              ageDistribution: {
                under15: found.ageUnder15Pct,
                working: found.ageWorkingPct,
                over65: found.ageOver65Pct,
              },
              healthIndicators: {
                maternalMortalityPer100k: found.maternalMortalityPer100k,
                under5MortalityPer1k: found.under5MortalityPer1k,
                doctorsPer1000: found.doctorsPer1000,
                nursesPer1000: found.nursesPer1000,
              },
              diseaseBurden: found.diseaseBurden,
            },
            nationalComparison: {
              populationShare: `${(((found.population ?? 0) / natPop) * 100).toFixed(1)}%`,
              doctorRatioVsNational: `${(((found.doctorsPer1000 ?? 0) / natDoctors) * 100).toFixed(0)}% of national average`,
              gdpVsNational: `${(((found.gdpPerCapitaUsd ?? 0) / natGdp) * 100).toFixed(0)}% of national average`,
            },
          };
          break;
        }

        case "all_regions": {
          output = {
            totalRegions: filteredRegions.length,
            nationalPopulation: country.totalPopulation,
            regions: filteredRegions.map((r) => ({
              region: r.region,
              population: r.population,
              urbanPercent: r.urbanPercent,
              gdpPerCapitaUsd: r.gdpPerCapitaUsd,
              classification: r.classification,
              doctorsPer1000: r.doctorsPer1000,
              maternalMortality: r.maternalMortalityPer100k,
            })),
          };
          break;
        }

        case "underserved_ranking": {
          const whoBenchmark = await fetchBenchmark("WHO Minimum");
          const whoDoctors = whoBenchmark?.doctorsPer1000 ?? 1;
          const natMortality = country.maternalMortalityPer100k ?? 1;
          const natGdp = country.gdpPerCapitaUsd ?? 1;

          const scored = filteredRegions.map((r) => {
            const doctorGap = whoDoctors - (r.doctorsPer1000 ?? 0);
            const mortalityExcess =
              (r.maternalMortalityPer100k ?? 0) / natMortality;
            const gdpDeficit = 1 - (r.gdpPerCapitaUsd ?? 0) / natGdp;
            const ruralFactor = (r.ruralPercent ?? 0) / 100;
            const score =
              doctorGap + mortalityExcess + gdpDeficit + ruralFactor;
            return {
              region: r.region,
              population: r.population,
              underservedScore: Math.round(score * 100) / 100,
              doctorsPer1000: r.doctorsPer1000,
              maternalMortality: r.maternalMortalityPer100k,
              gdpPerCapitaUsd: r.gdpPerCapitaUsd,
              ruralPercent: r.ruralPercent,
              classification: r.classification,
            };
          });
          scored.sort((a, b) => b.underservedScore - a.underservedScore);
          output = {
            methodology:
              "Composite score based on doctor gap (vs WHO benchmark), maternal mortality excess, GDP deficit, and rural population share. Higher = more underserved.",
            rankings: scored,
          };
          break;
        }

        case "age_demographics": {
          output = {
            regions: filteredRegions.map((r) => {
              const pop = r.population ?? 0;
              const u15 = r.ageUnder15Pct ?? 0;
              const working = r.ageWorkingPct ?? 0;
              const o65 = r.ageOver65Pct ?? 0;
              return {
                region: r.region,
                population: pop,
                under15: u15,
                under15Population: Math.round((pop * u15) / 100),
                working,
                over65: o65,
                over65Population: Math.round((pop * o65) / 100),
                estimatedCataractDemand: Math.round(((pop * o65) / 100) * 0.05),
                estimatedPediatricDemand: Math.round((pop * u15) / 100),
              };
            }),
            note: "Cataract demand estimate: ~5% of 65+ population. Pediatric demand: all under-15 population.",
          };
          break;
        }

        case "disease_burden": {
          if (region) {
            const found = await findRegion(countryCode, region);
            if (!found) {
              output = { error: `Region "${region}" not found.` };
              break;
            }
            output = {
              region: found.region,
              population: found.population,
              diseaseBurden: found.diseaseBurden,
              healthIndicators: {
                maternalMortalityPer100k: found.maternalMortalityPer100k,
                under5MortalityPer1k: found.under5MortalityPer1k,
                doctorsPer1000: found.doctorsPer1000,
                nursesPer1000: found.nursesPer1000,
              },
            };
          } else {
            const diseaseCounts: Record<string, number> = {};
            for (const r of filteredRegions) {
              for (const disease of r.diseaseBurden ?? []) {
                diseaseCounts[disease] = (diseaseCounts[disease] ?? 0) + 1;
              }
            }
            const sorted = Object.entries(diseaseCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([disease, regionCount]) => ({ disease, regionCount }));

            output = {
              totalRegions: filteredRegions.length,
              mostPrevalent: sorted,
              regionDetails: filteredRegions.map((r) => ({
                region: r.region,
                diseases: r.diseaseBurden,
              })),
            };
          }
          break;
        }

        case "who_benchmarks": {
          const whoBenchmark = await fetchBenchmark("WHO Minimum");
          const developedAvg = await fetchBenchmark(
            "Developed Country Average"
          );

          const regionData = region
            ? await findRegion(countryCode, region)
            : undefined;
          const comparisonRegions = regionData ? [regionData] : filteredRegions;

          const whoDoctors = whoBenchmark?.doctorsPer1000 ?? 1;
          const devDoctors = developedAvg?.doctorsPer1000 ?? 1;
          const devMortality = developedAvg?.maternalMortalityPer100k ?? 1;

          output = {
            whoBenchmarks: whoBenchmark,
            developedCountryAverages: developedAvg,
            nationalData: country,
            regionComparisons: comparisonRegions.map((r) => ({
              region: r.region,
              population: r.population,
              doctorsPer1000: r.doctorsPer1000,
              doctorsVsWho: `${(((r.doctorsPer1000 ?? 0) / whoDoctors) * 100).toFixed(1)}%`,
              doctorsVsDeveloped: `${(((r.doctorsPer1000 ?? 0) / devDoctors) * 100).toFixed(1)}%`,
              maternalMortality: r.maternalMortalityPer100k,
              maternalMortalityVsDeveloped: `${((r.maternalMortalityPer100k ?? 0) / devMortality).toFixed(0)}x`,
              under5Mortality: r.under5MortalityPer1k,
            })),
          };
          break;
        }

        case "urban_rural_gap": {
          const urbanRegions = filteredRegions.filter(
            (r) =>
              r.classification === "urban-heavy" || (r.urbanPercent ?? 0) > 50
          );
          const ruralRegions = filteredRegions.filter(
            (r) =>
              r.classification === "rural-heavy" || (r.ruralPercent ?? 0) > 60
          );

          const avgDoctors = (regions: RegionRow[]) =>
            regions.length > 0
              ? regions.reduce((sum, r) => sum + (r.doctorsPer1000 ?? 0), 0) /
                regions.length
              : 0;
          const avgMortality = (regions: RegionRow[]) =>
            regions.length > 0
              ? regions.reduce(
                  (sum, r) => sum + (r.maternalMortalityPer100k ?? 0),
                  0
                ) / regions.length
              : 0;

          output = {
            urbanRegions: urbanRegions.map((r) => ({
              region: r.region,
              urbanPercent: r.urbanPercent,
              doctorsPer1000: r.doctorsPer1000,
            })),
            ruralRegions: ruralRegions.map((r) => ({
              region: r.region,
              ruralPercent: r.ruralPercent,
              doctorsPer1000: r.doctorsPer1000,
            })),
            gap: {
              avgDoctorsUrban:
                Math.round(avgDoctors(urbanRegions) * 1000) / 1000,
              avgDoctorsRural:
                Math.round(avgDoctors(ruralRegions) * 1000) / 1000,
              urbanToRuralRatio:
                avgDoctors(ruralRegions) > 0
                  ? `${(avgDoctors(urbanRegions) / avgDoctors(ruralRegions)).toFixed(1)}x`
                  : "N/A",
              avgMaternalMortalityUrban: Math.round(avgMortality(urbanRegions)),
              avgMaternalMortalityRural: Math.round(avgMortality(ruralRegions)),
            },
          };
          break;
        }

        case "high_impact_sites": {
          const whoBenchmark = await fetchBenchmark("WHO Minimum");
          const whoDoctors = whoBenchmark?.doctorsPer1000 ?? 1;

          const scored = filteredRegions.map((r) => {
            const popScore = (r.population ?? 0) / 1_000_000;
            const needScore = (whoDoctors - (r.doctorsPer1000 ?? 0)) * 10;
            const accessibilityScore = (r.urbanPercent ?? 0) / 100;
            const impactScore =
              popScore * needScore * (0.5 + accessibilityScore);
            return {
              region: r.region,
              population: r.population,
              gdpPerCapitaUsd: r.gdpPerCapitaUsd,
              urbanPercent: r.urbanPercent,
              doctorsPer1000: r.doctorsPer1000,
              maternalMortality: r.maternalMortalityPer100k,
              impactScore: Math.round(impactScore * 100) / 100,
              rationale: `Population: ${((r.population ?? 0) / 1_000_000).toFixed(1)}M, ${r.urbanPercent}% urban, ${r.doctorsPer1000} doctors/1000 people`,
            };
          });
          scored.sort((a, b) => b.impactScore - a.impactScore);
          output = {
            methodology:
              "Impact score = (population in millions) x (doctor gap vs WHO) x (0.5 + urban accessibility). Higher = better intervention target.",
            topSites: scored.slice(0, 8),
          };
          break;
        }

        default:
          output = { error: `Unknown query type: ${query}` };
      }

      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown demographics error";
      log.error(error, { region, query }, Date.now() - start);
      return { error: `Demographics query failed: ${message}` };
    }
  },
});
