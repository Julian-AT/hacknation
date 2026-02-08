/**
 * OpenStreetMap enrichment strategy.
 *
 * Queries the Overpass API for healthcare facilities near the facility's
 * location and cross-references data from OpenStreetMap.
 */

import { CITY_COORDS } from "../../ghana";
import type { Facility, ProposedChange, StrategyResult } from "../detect-gaps";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

interface OSMElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

/**
 * Fuzzy name match: checks if either name contains the other.
 */
function namesMatch(a: string, b: string): boolean {
  const aLower = a.toLowerCase().trim();
  const bLower = b.toLowerCase().trim();
  if (aLower.length === 0 || bLower.length === 0) return false;
  return aLower.includes(bLower) || bLower.includes(aLower);
}

export async function osmLookupStrategy(
  facility: Facility
): Promise<StrategyResult> {
  const changes: ProposedChange[] = [];

  // Resolve coordinates: use facility's, or fall back to city centroid
  let searchLat = facility.lat;
  let searchLng = facility.lng;

  if (!searchLat || !searchLng) {
    const city = facility.addressCity;
    if (city) {
      const coords = CITY_COORDS[city];
      if (coords) {
        searchLat = coords.lat;
        searchLng = coords.lng;
      }
    }
  }

  if (!searchLat || !searchLng) {
    return { strategy: "osm-lookup", changes };
  }

  try {
    const amenityFilter =
      '["amenity"~"hospital|clinic|pharmacy|doctors|dentist"]';
    const radius = 2000;

    const query = `
      [out:json][timeout:15];
      (
        node${amenityFilter}(around:${String(radius)},${String(searchLat)},${String(searchLng)});
        way${amenityFilter}(around:${String(radius)},${String(searchLat)},${String(searchLng)});
      );
      out center;
    `;

    const response = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      return { strategy: "osm-lookup", changes };
    }

    const json = (await response.json()) as { elements?: OSMElement[] };
    const elements = json.elements ?? [];

    // Find a matching facility by name
    const match = elements.find((el) => {
      const name = el.tags?.name ?? el.tags?.["name:en"] ?? "";
      return namesMatch(name, facility.name);
    });

    if (!match?.tags) {
      return { strategy: "osm-lookup", changes };
    }

    const tags = match.tags;
    const osmSource = `https://www.openstreetmap.org/${match.type}/${String(match.id)}`;

    // Extract bed count
    if (tags.beds && !facility.capacity) {
      const beds = Number.parseInt(tags.beds, 10);
      if (!Number.isNaN(beds) && beds > 0) {
        changes.push({
          field: "capacity",
          value: beds,
          source: osmSource,
          confidence: "high",
        });
      }
    }

    // Extract healthcare specialties
    if (tags["healthcare:speciality"] && !facility.specialties?.length) {
      changes.push({
        field: "specialties_raw",
        value: tags["healthcare:speciality"],
        source: osmSource,
        confidence: "medium",
      });
    }

    // Extract precise coordinates if facility is missing them
    const matchLat = match.lat ?? match.center?.lat;
    const matchLng = match.lon ?? match.center?.lon;

    if (!facility.lat && matchLat) {
      changes.push({
        field: "lat",
        value: matchLat,
        source: osmSource,
        confidence: "high",
      });
    }

    if (!facility.lng && matchLng) {
      changes.push({
        field: "lng",
        value: matchLng,
        source: osmSource,
        confidence: "high",
      });
    }

    // Extract operator type if available
    if (tags.operator && !facility.operatorType) {
      const opLower = tags.operator.toLowerCase();
      if (
        opLower.includes("government") ||
        opLower.includes("public") ||
        opLower.includes("ghs")
      ) {
        changes.push({
          field: "operator_type",
          value: "public",
          source: osmSource,
          confidence: "medium",
        });
      } else if (opLower.includes("private")) {
        changes.push({
          field: "operator_type",
          value: "private",
          source: osmSource,
          confidence: "medium",
        });
      }
    }

    return { strategy: "osm-lookup", changes };
  } catch (error: unknown) {
    console.error(
      "[Enrichment:osm] Failed:",
      error instanceof Error ? error.message : error
    );
    return { strategy: "osm-lookup", changes };
  }
}
