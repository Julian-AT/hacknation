/**
 * Geocode enrichment strategy.
 *
 * Resolves missing lat/lng coordinates using OpenStreetMap Nominatim.
 * Free API, no key required. Rate limit: 1 request per second.
 */

import type { Facility, StrategyResult } from "../detect-gaps";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/search";
const SOURCE = "https://nominatim.openstreetmap.org";

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export async function geocodeStrategy(
  facility: Facility
): Promise<StrategyResult> {
  const changes: StrategyResult["changes"] = [];

  if (facility.lat && facility.lng) {
    return { strategy: "geocode", changes };
  }

  const city = facility.addressCity;
  if (!city || city === "null") {
    return { strategy: "geocode", changes };
  }

  try {
    const query = facility.addressRegion
      ? `${city}, ${facility.addressRegion}, Ghana`
      : `${city}, Ghana`;

    const params = new URLSearchParams({
      q: query,
      format: "json",
      limit: "1",
      countrycodes: "GH",
    });

    const response = await fetch(`${NOMINATIM_BASE}?${params.toString()}`, {
      headers: {
        "User-Agent": "MeridianAI/1.0 (healthcare-facility-geocoder)",
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return { strategy: "geocode", changes };
    }

    const results = (await response.json()) as NominatimResult[];
    if (results.length === 0) {
      return { strategy: "geocode", changes };
    }

    const [best] = results;
    if (!best) {
      return { strategy: "geocode", changes };
    }

    const lat = Number.parseFloat(best.lat);
    const lng = Number.parseFloat(best.lon);

    if (!Number.isNaN(lat)) {
      changes.push({
        field: "lat",
        value: lat,
        source: SOURCE,
        confidence: "high",
      });
    }

    if (!Number.isNaN(lng)) {
      changes.push({
        field: "lng",
        value: lng,
        source: SOURCE,
        confidence: "high",
      });
    }

    return { strategy: "geocode", changes };
  } catch (error: unknown) {
    console.error(
      "[Enrichment:geocode] Failed:",
      error instanceof Error ? error.message : error
    );
    return { strategy: "geocode", changes };
  }
}
