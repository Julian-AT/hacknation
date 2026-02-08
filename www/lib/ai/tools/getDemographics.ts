import { z } from "zod";
import { tool } from "ai";
import { createToolLogger } from "./debug";
import {
  GHANA_REGIONS,
  WHO_BENCHMARKS,
  DEVELOPED_COUNTRY_AVERAGES,
  GHANA_NATIONAL,
  findRegion,
  rankRegions,
} from "../../ghana-demographics";
import type { RegionDemographics } from "../../ghana-demographics";

/**
 * Demographics & Population tool — provides Ghana population data, age demographics,
 * health indicators, disease burden, and WHO/international benchmarking.
 *
 * Covers VF Agent questions:
 * - 2.4: Urban vs rural service gaps
 * - 9.1: Population + demographic profile vs service availability
 * - 9.2: Population centers at GDP per capita range with unmet surgical need
 * - 9.3: Age bracket identifying underserved areas
 * - 9.4: Age demographics for age-related procedures
 * - 9.5: Facilities serving population areas too large for capabilities
 * - 9.6: Predicted high-demand procedures with low supply
 * - 10.1: Compare to WHO guidelines / developed country averages
 * - 10.2: "Sweet spot" clusters (high population, some infrastructure, low investment)
 * - 10.3: High-impact intervention sites by population/GDP
 * - 10.4: Population/GDP/urbanicity bands correlated with unmet need
 */
export const getDemographics = tool({
  description:
    "Retrieve Ghana population, demographics, health indicators, disease burden, and WHO benchmarks by region. Use for demand analysis, benchmarking, and identifying underserved populations. Covers questions about population size, age distribution, GDP per capita, doctor-to-patient ratios, urban/rural splits, and disease prevalence.",
  inputSchema: z.object({
    region: z
      .string()
      .max(100)
      .optional()
      .describe("Get demographics for a specific region (e.g., 'Northern', 'Greater Accra')"),
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
  execute: async ({ region, query, gdpRange, populationRange }) => {
    const log = createToolLogger("getDemographics");
    const start = Date.now();
    log.start({ region, query, gdpRange, populationRange });

    try {
      // Apply optional filters
      let filteredRegions = [...GHANA_REGIONS];

      if (gdpRange) {
        if (gdpRange.min !== undefined) {
          filteredRegions = filteredRegions.filter((r) => r.gdpPerCapitaUsd >= (gdpRange.min ?? 0));
        }
        if (gdpRange.max !== undefined) {
          filteredRegions = filteredRegions.filter((r) => r.gdpPerCapitaUsd <= (gdpRange.max ?? Number.POSITIVE_INFINITY));
        }
      }

      if (populationRange) {
        if (populationRange.min !== undefined) {
          filteredRegions = filteredRegions.filter((r) => r.population >= (populationRange.min ?? 0));
        }
        if (populationRange.max !== undefined) {
          filteredRegions = filteredRegions.filter((r) => r.population <= (populationRange.max ?? Number.POSITIVE_INFINITY));
        }
      }

      let output: Record<string, unknown>;

      switch (query) {
        case "region_profile": {
          if (!region) {
            output = { error: "Region name is required for region_profile query" };
            break;
          }
          const found = findRegion(region);
          if (!found) {
            output = {
              error: `Region "${region}" not found. Available: ${GHANA_REGIONS.map((r) => r.region).join(", ")}`,
            };
            break;
          }
          output = {
            region: found,
            nationalComparison: {
              populationShare: `${((found.population / GHANA_NATIONAL.totalPopulation) * 100).toFixed(1)}%`,
              doctorRatioVsNational: `${((found.healthIndicators.doctorsPerCapita / GHANA_NATIONAL.doctorsPerCapita) * 100).toFixed(0)}% of national average`,
              gdpVsNational: `${((found.gdpPerCapitaUsd / GHANA_NATIONAL.gdpPerCapitaUsd) * 100).toFixed(0)}% of national average`,
            },
          };
          break;
        }

        case "all_regions": {
          output = {
            totalRegions: filteredRegions.length,
            nationalPopulation: GHANA_NATIONAL.totalPopulation,
            regions: filteredRegions.map((r) => ({
              region: r.region,
              population: r.population,
              urbanPercent: r.urbanPercent,
              gdpPerCapitaUsd: r.gdpPerCapitaUsd,
              classification: r.classification,
              doctorsPerCapita: r.healthIndicators.doctorsPerCapita,
              maternalMortality: r.healthIndicators.maternalMortalityPer100k,
            })),
          };
          break;
        }

        case "underserved_ranking": {
          // Rank regions by composite "underserved score"
          // Higher = more underserved (low doctors, high mortality, low GDP)
          const scored = filteredRegions.map((r) => {
            const doctorGap = WHO_BENCHMARKS.doctorsPerCapita - r.healthIndicators.doctorsPerCapita;
            const mortalityExcess = r.healthIndicators.maternalMortalityPer100k / GHANA_NATIONAL.maternalMortalityPer100k;
            const gdpDeficit = 1 - (r.gdpPerCapitaUsd / GHANA_NATIONAL.gdpPerCapitaUsd);
            const ruralFactor = r.ruralPercent / 100;
            const score = (doctorGap * 1000) + mortalityExcess + gdpDeficit + ruralFactor;
            return {
              region: r.region,
              population: r.population,
              underservedScore: Math.round(score * 100) / 100,
              doctorsPerCapita: r.healthIndicators.doctorsPerCapita,
              maternalMortality: r.healthIndicators.maternalMortalityPer100k,
              gdpPerCapitaUsd: r.gdpPerCapitaUsd,
              ruralPercent: r.ruralPercent,
              classification: r.classification,
            };
          });
          scored.sort((a, b) => b.underservedScore - a.underservedScore);
          output = {
            methodology: "Composite score based on doctor gap (vs WHO benchmark), maternal mortality excess, GDP deficit, and rural population share. Higher = more underserved.",
            rankings: scored,
          };
          break;
        }

        case "age_demographics": {
          output = {
            regions: filteredRegions.map((r) => ({
              region: r.region,
              population: r.population,
              under15: r.ageDistribution.under15,
              under15Population: Math.round(r.population * r.ageDistribution.under15 / 100),
              working: r.ageDistribution.working,
              over65: r.ageDistribution.over65,
              over65Population: Math.round(r.population * r.ageDistribution.over65 / 100),
              // Age-related procedure demand estimates
              estimatedCataractDemand: Math.round(r.population * r.ageDistribution.over65 / 100 * 0.05), // ~5% of 65+ need cataract
              estimatedPediatricDemand: Math.round(r.population * r.ageDistribution.under15 / 100),
            })),
            note: "Cataract demand estimate: ~5% of 65+ population. Pediatric demand: all under-15 population.",
          };
          break;
        }

        case "disease_burden": {
          if (region) {
            const found = findRegion(region);
            if (!found) {
              output = { error: `Region "${region}" not found.` };
              break;
            }
            output = {
              region: found.region,
              population: found.population,
              diseaseBurden: found.diseaseBurden,
              healthIndicators: found.healthIndicators,
            };
          } else {
            // Aggregate disease mentions across all regions
            const diseaseCounts: Record<string, number> = {};
            for (const r of filteredRegions) {
              for (const disease of r.diseaseBurden) {
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
          const regionData = region ? findRegion(region) : undefined;
          const comparisonRegions: RegionDemographics[] = regionData ? [regionData] : filteredRegions;

          output = {
            whoBenchmarks: WHO_BENCHMARKS,
            developedCountryAverages: DEVELOPED_COUNTRY_AVERAGES,
            ghanaNational: GHANA_NATIONAL,
            regionComparisons: comparisonRegions.map((r) => ({
              region: r.region,
              population: r.population,
              doctorsPerCapita: r.healthIndicators.doctorsPerCapita,
              doctorsVsWho: `${((r.healthIndicators.doctorsPerCapita / WHO_BENCHMARKS.doctorsPerCapita) * 100).toFixed(1)}%`,
              doctorsVsDeveloped: `${((r.healthIndicators.doctorsPerCapita / DEVELOPED_COUNTRY_AVERAGES.doctorsPerCapita) * 100).toFixed(1)}%`,
              maternalMortality: r.healthIndicators.maternalMortalityPer100k,
              maternalMortalityVsDeveloped: `${(r.healthIndicators.maternalMortalityPer100k / DEVELOPED_COUNTRY_AVERAGES.maternalMortalityPer100k).toFixed(0)}x`,
              under5Mortality: r.healthIndicators.under5MortalityPer1k,
            })),
          };
          break;
        }

        case "urban_rural_gap": {
          const urbanRegions = filteredRegions.filter((r) => r.classification === "urban-heavy" || r.urbanPercent > 50);
          const ruralRegions = filteredRegions.filter((r) => r.classification === "rural-heavy" || r.ruralPercent > 60);

          const avgDoctors = (regions: RegionDemographics[]) =>
            regions.length > 0
              ? regions.reduce((sum, r) => sum + r.healthIndicators.doctorsPerCapita, 0) / regions.length
              : 0;
          const avgMortality = (regions: RegionDemographics[]) =>
            regions.length > 0
              ? regions.reduce((sum, r) => sum + r.healthIndicators.maternalMortalityPer100k, 0) / regions.length
              : 0;

          output = {
            urbanRegions: urbanRegions.map((r) => ({ region: r.region, urbanPercent: r.urbanPercent, doctorsPerCapita: r.healthIndicators.doctorsPerCapita })),
            ruralRegions: ruralRegions.map((r) => ({ region: r.region, ruralPercent: r.ruralPercent, doctorsPerCapita: r.healthIndicators.doctorsPerCapita })),
            gap: {
              avgDoctorsUrban: Math.round(avgDoctors(urbanRegions) * 1_000_000) / 1_000_000,
              avgDoctorsRural: Math.round(avgDoctors(ruralRegions) * 1_000_000) / 1_000_000,
              urbanToRuralRatio: avgDoctors(ruralRegions) > 0
                ? `${(avgDoctors(urbanRegions) / avgDoctors(ruralRegions)).toFixed(1)}x`
                : "N/A",
              avgMaternalMortalityUrban: Math.round(avgMortality(urbanRegions)),
              avgMaternalMortalityRural: Math.round(avgMortality(ruralRegions)),
            },
          };
          break;
        }

        case "high_impact_sites": {
          // Identify "sweet spot" regions: high population, some infrastructure, but underserved
          const scored = filteredRegions.map((r) => {
            const popScore = r.population / 1_000_000; // Higher pop = more impact
            const needScore = (WHO_BENCHMARKS.doctorsPerCapita - r.healthIndicators.doctorsPerCapita) * 10_000;
            const accessibilityScore = r.urbanPercent / 100; // Urban = easier to deploy
            const impactScore = popScore * needScore * (0.5 + accessibilityScore);
            return {
              region: r.region,
              population: r.population,
              gdpPerCapitaUsd: r.gdpPerCapitaUsd,
              urbanPercent: r.urbanPercent,
              doctorsPerCapita: r.healthIndicators.doctorsPerCapita,
              maternalMortality: r.healthIndicators.maternalMortalityPer100k,
              impactScore: Math.round(impactScore * 100) / 100,
              rationale: `Population: ${(r.population / 1_000_000).toFixed(1)}M, ${r.urbanPercent}% urban, ${r.healthIndicators.doctorsPerCapita * 1000} doctors/1000 people`,
            };
          });
          scored.sort((a, b) => b.impactScore - a.impactScore);
          output = {
            methodology: "Impact score = (population in millions) × (doctor gap vs WHO) × (0.5 + urban accessibility). Higher = better intervention target.",
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
      const message = error instanceof Error ? error.message : "Unknown demographics error";
      log.error(error, { region, query }, Date.now() - start);
      return { error: `Demographics query failed: ${message}` };
    }
  },
});
