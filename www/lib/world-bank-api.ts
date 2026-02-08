/**
 * World Bank API client with in-memory TTL cache.
 *
 * Fetches national-level indicators for any country and can update
 * the demographics_countries table with fresh data.
 *
 * API docs: https://datahelpdesk.worldbank.org/knowledgebase/articles/898581
 */

import { eq } from "drizzle-orm";
import { db } from "./db";
import { demographicsCountries } from "./db/schema.demographics";

// ---------------------------------------------------------------------------
// Indicator mapping: World Bank code → our column name
// ---------------------------------------------------------------------------

const INDICATOR_MAP = {
  "SP.POP.TOTL": "totalPopulation",
  "NY.GDP.PCAP.CD": "gdpPerCapitaUsd",
  "SH.MED.PHYS.ZS": "doctorsPer1000",
  "SH.MED.NUMW.P3": "nursesPer1000",
  "SH.MED.BEDS.ZS": "bedsPer1000",
  "SH.STA.MMRT": "maternalMortalityPer100k",
  "SH.DYN.MORT": "under5MortalityPer1k",
  "SP.DYN.LE00.IN": "lifeExpectancy",
} as const;

type IndicatorCode = keyof typeof INDICATOR_MAP;

// ---------------------------------------------------------------------------
// In-memory TTL cache
// ---------------------------------------------------------------------------

interface CacheEntry {
  value: number;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

/** Default cache TTL: 24 hours */
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function getCached(key: string): number | undefined {
  const entry = cache.get(key);
  if (!entry) {
    return undefined;
  }
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return undefined;
  }
  return entry.value;
}

function setCache(key: string, value: number): void {
  cache.set(key, { value, timestamp: Date.now() });
}

// ---------------------------------------------------------------------------
// Fetch a single indicator from the World Bank API
// ---------------------------------------------------------------------------

interface WorldBankDataPoint {
  date: string;
  value: number | null;
}

/**
 * Fetch the most recent non-null value for a given indicator and country.
 * Returns `undefined` if the API call fails or no data is available.
 */
export async function fetchIndicator(
  countryCode: string,
  indicatorId: IndicatorCode
): Promise<number | undefined> {
  const cacheKey = `${countryCode}:${indicatorId}`;
  const cached = getCached(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  try {
    const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicatorId}?format=json&date=2018:2026&per_page=20`;
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return undefined;
    }

    const json = await response.json();

    // World Bank API returns [metadata, dataArray]
    if (!Array.isArray(json) || json.length < 2 || !Array.isArray(json[1])) {
      return undefined;
    }

    const dataPoints: WorldBankDataPoint[] = json[1];

    // Find the most recent non-null value (data is sorted newest-first)
    const latest = dataPoints.find((dp) => dp.value !== null);
    if (!latest || latest.value === null) {
      return undefined;
    }

    setCache(cacheKey, latest.value);
    return latest.value;
  } catch {
    return undefined;
  }
}

// ---------------------------------------------------------------------------
// Refresh country data from World Bank API → database
// ---------------------------------------------------------------------------

/**
 * Fetch all 8 indicators for a country in parallel, then update
 * the demographics_countries row. Only updates fields that
 * successfully returned data; leaves others unchanged.
 */
export async function refreshCountryData(
  countryCode: string
): Promise<{ updated: string[]; failed: string[] }> {
  const indicatorCodes = Object.keys(INDICATOR_MAP) as IndicatorCode[];

  const results = await Promise.allSettled(
    indicatorCodes.map(async (code) => {
      const value = await fetchIndicator(countryCode, code);
      return { code, field: INDICATOR_MAP[code], value };
    })
  );

  const updatePayload: Record<string, number> = {};
  const updated: string[] = [];
  const failed: string[] = [];

  for (const result of results) {
    if (result.status === "fulfilled" && result.value.value !== undefined) {
      updatePayload[result.value.field] = result.value.value;
      updated.push(result.value.field);
    } else {
      const field =
        result.status === "fulfilled" ? result.value.field : "unknown";
      failed.push(field);
    }
  }

  if (Object.keys(updatePayload).length > 0) {
    // Add source + timestamp
    const payload = {
      ...updatePayload,
      dataSource: `World Bank API, refreshed ${new Date().toISOString().slice(0, 10)}`,
      updatedAt: new Date(),
    };

    await db
      .update(demographicsCountries)
      .set(payload)
      .where(eq(demographicsCountries.countryCode, countryCode));
  }

  return { updated, failed };
}
