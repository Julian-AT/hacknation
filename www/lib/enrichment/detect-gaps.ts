/**
 * Gap detection for facility enrichment.
 *
 * Analyzes a facility row and determines which enrichment strategies
 * should run based on missing fields.
 */

import { facilities } from "../db/schema.facilities";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Facility = typeof facilities.$inferSelect;

export type ProposedChange = {
  field: string;
  value: string | number | boolean;
  source: string;
  confidence: "high" | "medium" | "low";
};

export type EnrichmentStrategyName = "geocode" | "web-search" | "osm-lookup";

export type StrategyResult = {
  strategy: EnrichmentStrategyName;
  changes: ProposedChange[];
};

export type GapAnalysis = {
  strategies: EnrichmentStrategyName[];
  missingFields: string[];
};

// ---------------------------------------------------------------------------
// Gap detection
// ---------------------------------------------------------------------------

/**
 * Inspect a facility row and return which enrichment strategies to run.
 * Only includes strategies that have enough source data to work with.
 */
export function detectGaps(facility: Facility): GapAnalysis {
  const strategies = new Set<EnrichmentStrategyName>();
  const missingFields: string[] = [];

  // Missing coordinates with city available -> geocode
  if (
    (!facility.lat || !facility.lng) &&
    facility.addressCity &&
    facility.addressCity !== "null"
  ) {
    strategies.add("geocode");
    if (!facility.lat) missingFields.push("lat");
    if (!facility.lng) missingFields.push("lng");
  }

  // Missing capacity data -> web search
  if (!facility.numDoctors) {
    strategies.add("web-search");
    missingFields.push("num_doctors");
  }
  if (!facility.capacity) {
    strategies.add("web-search");
    missingFields.push("capacity");
  }
  if (!facility.areaSqm) {
    strategies.add("web-search");
    missingFields.push("area_sqm");
  }

  // Missing services -> web search + OSM
  if (!facility.specialties?.length) {
    strategies.add("web-search");
    missingFields.push("specialties");
  }
  if (!facility.procedures?.length) {
    strategies.add("web-search");
    missingFields.push("procedures");
  }
  if (!facility.equipment?.length) {
    strategies.add("web-search");
    missingFields.push("equipment");
  }

  // Missing metadata -> web search
  if (!facility.yearEstablished) {
    strategies.add("web-search");
    missingFields.push("year_established");
  }
  if (!facility.addressRegion) {
    strategies.add("web-search");
    missingFields.push("address_region");
  }
  if (!facility.description) {
    strategies.add("web-search");
    missingFields.push("description");
  }

  // OSM lookup for cross-referencing services and capacity.
  // Works with existing coords or city centroid from CITY_COORDS.
  if (
    (facility.lat && facility.lng) ||
    (facility.addressCity && facility.addressCity !== "null")
  ) {
    if (
      !facility.specialties?.length ||
      !facility.procedures?.length ||
      !facility.equipment?.length ||
      !facility.capacity
    ) {
      strategies.add("osm-lookup");
    }
  }

  return { strategies: [...strategies], missingFields };
}
