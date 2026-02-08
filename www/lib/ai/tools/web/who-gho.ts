import { tool } from "ai";
import { z } from "zod";
import { createToolLogger } from "../debug";

/**
 * WHO Global Health Observatory (GHO) API tool.
 *
 * Free, no API key required.
 * API docs: https://www.who.int/data/gho/info/gho-odata-api
 * Base URL: https://ghoapi.azureedge.net/api/
 *
 * Covers VF Agent questions:
 * - 2.2: Disease prevalence vs facility coverage
 * - 9.1-9.6: Unmet needs (population health indicators)
 * - 10.1-10.4: Benchmarking against WHO standards
 */

const WHO_GHO_BASE = "https://ghoapi.azureedge.net/api";

/** Curated indicators relevant to healthcare facility planning. */
const INDICATOR_MAP: Record<
  string,
  { code: string; label: string; unit: string; category: string }
> = {
  physicians: {
    code: "WHS6_102",
    label: "Medical doctors (per 10,000 population)",
    unit: "per 10,000",
    category: "workforce",
  },
  nurses: {
    code: "WHS6_104",
    label: "Nursing and midwifery personnel (per 10,000 population)",
    unit: "per 10,000",
    category: "workforce",
  },
  dentists: {
    code: "WHS6_105",
    label: "Dentists (per 10,000 population)",
    unit: "per 10,000",
    category: "workforce",
  },
  pharmacists: {
    code: "WHS6_106",
    label: "Pharmacists (per 10,000 population)",
    unit: "per 10,000",
    category: "workforce",
  },
  hospital_beds: {
    code: "WHS7_104",
    label: "Hospital beds (per 10,000 population)",
    unit: "per 10,000",
    category: "infrastructure",
  },
  maternal_mortality: {
    code: "MDG_0000000001",
    label: "Maternal mortality ratio (per 100,000 live births)",
    unit: "per 100,000 live births",
    category: "mortality",
  },
  under5_mortality: {
    code: "MDG_0000000007",
    label: "Under-five mortality rate (per 1,000 live births)",
    unit: "per 1,000 live births",
    category: "mortality",
  },
  neonatal_mortality: {
    code: "MDG_0000000003",
    label: "Neonatal mortality rate (per 1,000 live births)",
    unit: "per 1,000 live births",
    category: "mortality",
  },
  life_expectancy: {
    code: "WHOSIS_000001",
    label: "Life expectancy at birth (years)",
    unit: "years",
    category: "health_status",
  },
  uhc_coverage: {
    code: "UHC_INDEX_REPORTED",
    label: "UHC service coverage index",
    unit: "index (0-100)",
    category: "coverage",
  },
  cataract_surgery: {
    code: "WHS7_142",
    label: "Cataract surgical rate (per million population)",
    unit: "per million",
    category: "surgical",
  },
  tb_incidence: {
    code: "MDG_0000000020",
    label: "Tuberculosis incidence (per 100,000 population)",
    unit: "per 100,000",
    category: "disease",
  },
  malaria_incidence: {
    code: "MALARIA_EST_INCIDENCE",
    label: "Malaria incidence (per 1,000 population at risk)",
    unit: "per 1,000 at risk",
    category: "disease",
  },
  hiv_prevalence: {
    code: "MDG_0000000029",
    label: "HIV prevalence among adults 15-49 (%)",
    unit: "%",
    category: "disease",
  },
};

const INDICATOR_KEYS = Object.keys(
  INDICATOR_MAP
) as (keyof typeof INDICATOR_MAP)[];

interface GHODataPoint {
  IndicatorCode: string;
  SpatialDim: string;
  TimeDim: number;
  NumericValue: number | null;
  Value: string;
  Comments: string | null;
}

async function fetchGHOIndicator(
  indicatorCode: string,
  countryCode: string,
  limit = 5
): Promise<GHODataPoint[]> {
  const url = `${WHO_GHO_BASE}/${indicatorCode}?$filter=SpatialDim eq '${countryCode}'&$orderby=TimeDim desc&$top=${String(limit)}`;

  const response = await fetch(url, {
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`WHO GHO API returned ${String(response.status)}`);
  }

  const json = (await response.json()) as { value?: GHODataPoint[] };
  return json.value ?? [];
}

export const getWHOData = tool({
  description:
    "Fetch live health indicators from the WHO Global Health Observatory (GHO). Free, authoritative data covering workforce density, hospital beds, mortality rates, disease burden, surgical rates, and UHC coverage. Use for benchmarking, demand analysis, and identifying health system gaps. Supports any country by ISO-3 code.",
  inputSchema: z.object({
    countryCode: z
      .string()
      .length(3)
      .describe(
        "ISO 3166-1 alpha-3 country code (e.g., GHA, NGA, KEN, USA, GBR, IND). Required."
      ),
    indicators: z
      .array(z.enum(INDICATOR_KEYS as [string, ...string[]]))
      .min(1)
      .max(8)
      .describe(
        `Which indicators to fetch. Available: ${INDICATOR_KEYS.join(", ")}`
      ),
    compareWith: z
      .array(z.string().length(3))
      .max(3)
      .optional()
      .describe(
        "Optional: up to 3 additional country codes to compare (e.g., ['NGA', 'KEN', 'ZAF'])"
      ),
  }),
  execute: async ({ countryCode, indicators, compareWith }) => {
    const log = createToolLogger("getWHOData");
    const start = Date.now();
    log.start({ countryCode, indicators, compareWith });

    try {
      const countries = [countryCode, ...(compareWith ?? [])];
      const results: Record<string, Record<string, unknown>> = {};

      // Fetch all indicators for all countries in parallel
      const fetchPromises = countries.flatMap((cc) =>
        indicators.map(async (key) => {
          const meta = INDICATOR_MAP[key];
          if (!meta) {
            return null;
          }

          const dataPoints = await fetchGHOIndicator(meta.code, cc, 5);

          // Get most recent non-null value
          const latest = dataPoints.find((dp) => dp.NumericValue !== null);

          return {
            country: cc,
            indicator: key,
            label: meta.label,
            unit: meta.unit,
            category: meta.category,
            value: latest?.NumericValue ?? null,
            year: latest?.TimeDim ?? null,
            source: latest?.Comments ?? "WHO GHO",
            trend: dataPoints
              .filter((dp) => dp.NumericValue !== null)
              .slice(0, 3)
              .map((dp) => ({
                year: dp.TimeDim,
                value: dp.NumericValue,
              })),
          };
        })
      );

      const settled = await Promise.allSettled(fetchPromises);

      for (const item of settled) {
        if (item.status !== "fulfilled" || !item.value) {
          continue;
        }
        const { country, indicator, ...data } = item.value;

        if (!results[country]) {
          results[country] = {};
        }
        results[country][indicator] = data;
      }

      // Build summary for single-country case
      const output: Record<string, unknown> = {
        source: "WHO Global Health Observatory (GHO)",
        apiUrl: "https://ghoapi.azureedge.net/api/",
        note: "Data may lag 1-3 years. Values represent most recent available year.",
      };

      if (countries.length === 1) {
        const countryData = results[countryCode] ?? {};
        output.country = countryCode;
        output.indicators = countryData;

        // Generate quick summary
        const summaryLines: string[] = [];
        for (const key of indicators) {
          const d = countryData[key] as
            | { value: number | null; year: number | null; label: string }
            | undefined;
          if (d?.value !== null && d?.value !== undefined) {
            summaryLines.push(
              `${d.label}: ${String(d.value)} (${String(d.year)})`
            );
          }
        }
        output.summary = summaryLines;
      } else {
        // Comparison mode
        output.countries = results;

        // Build comparison table
        const comparisonTable = indicators.map((key) => {
          const row: Record<string, unknown> = {
            indicator: INDICATOR_MAP[key]?.label ?? key,
          };
          for (const cc of countries) {
            const d = results[cc]?.[key] as
              | { value: number | null; year: number | null }
              | undefined;
            row[cc] =
              d?.value !== null && d?.value !== undefined
                ? `${String(d.value)} (${String(d.year)})`
                : "N/A";
          }
          return row;
        });
        output.comparisonTable = comparisonTable;
      }

      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown WHO GHO error";
      log.error(error, { countryCode, indicators }, Date.now() - start);
      return { error: `WHO GHO query failed: ${message}` };
    }
  },
});
