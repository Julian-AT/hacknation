/**
 * Global geocoding utility.
 *
 * Resolves a location string (city name or "lat,lng") to coordinates.
 * Uses a fast local cache (Ghana city coords) first, then falls back
 * to the free OpenStreetMap Nominatim geocoding API for worldwide coverage.
 */

import { CITY_COORDS } from "./ghana";

type GeoResult = {
  lat: number;
  lng: number;
  resolvedName: string;
};

type GeoError = {
  error: string;
};

/**
 * In-memory cache for geocoded cities to avoid repeated Nominatim lookups.
 * Keyed by lowercase city name.
 */
const geocodeCache = new Map<string, GeoResult>();

// Pre-populate cache with Ghana city coords
for (const [name, coords] of Object.entries(CITY_COORDS)) {
  geocodeCache.set(name.toLowerCase(), {
    lat: coords.lat,
    lng: coords.lng,
    resolvedName: name,
  });
}

/**
 * Resolve a location string to lat/lng coordinates.
 *
 * Supports:
 * - "lat,lng" coordinate strings (e.g., "9.4075,-0.8534")
 * - City names (checked against local cache first, then Nominatim)
 *
 * @param location - City name or "lat,lng" string
 * @returns GeoResult on success, GeoError on failure
 */
export async function resolveLocation(
  location: string
): Promise<GeoResult | GeoError> {
  // 1. Try parsing as "lat,lng" coordinate pair
  if (location.includes(",")) {
    const parts = location.split(",");
    if (parts.length === 2) {
      const lat = Number.parseFloat(parts[0].trim());
      const lng = Number.parseFloat(parts[1].trim());
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        return { lat, lng, resolvedName: `${lat},${lng}` };
      }
    }
  }

  // 2. Check local cache (includes all Ghana cities)
  const cacheKey = location.toLowerCase().trim();
  const cached = geocodeCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // 3. Fall back to Nominatim geocoding (free, worldwide)
  try {
    const encoded = encodeURIComponent(location.trim());
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1&addressdetails=0`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "MeridianAI/1.0 (https://meridian.app)",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return {
        error: `Geocoding failed for "${location}" (HTTP ${String(response.status)}). Try providing coordinates as "lat,lng" instead.`,
      };
    }

    const results: Array<{ lat: string; lon: string; display_name: string }> =
      await response.json();

    if (results.length === 0) {
      return {
        error: `Could not resolve location "${location}". Try providing coordinates as "lat,lng" instead.`,
      };
    }

    const result: GeoResult = {
      lat: Number.parseFloat(results[0].lat),
      lng: Number.parseFloat(results[0].lon),
      resolvedName: results[0].display_name,
    };

    // Cache for future lookups
    geocodeCache.set(cacheKey, result);

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      error: `Geocoding failed for "${location}": ${message}. Try providing coordinates as "lat,lng" instead.`,
    };
  }
}

/**
 * Type guard to check if a geocoding result is an error.
 */
export function isGeoError(result: GeoResult | GeoError): result is GeoError {
  return "error" in result;
}
