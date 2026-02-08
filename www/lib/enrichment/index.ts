/**
 * On-demand facility enrichment orchestrator.
 *
 * When a facility is viewed, this module checks for missing data and
 * runs parallel enrichment strategies (geocoding, web search, OSM)
 * to fill gaps — without blocking the API response.
 *
 * Guardrails:
 * - 7-day cooldown between enrichment attempts per facility
 * - Max 3 concurrent enrichments (in-memory semaphore)
 * - Only "accepted" validation results are applied to the database
 * - Stale "enriching" status is auto-recovered after 10 minutes
 */

import { eq } from "drizzle-orm";
import { db } from "../db";
import { facilities } from "../db/schema.facilities";
import type { Facility, StrategyResult } from "./detect-gaps";
import { detectGaps } from "./detect-gaps";
import { applyEnrichments } from "./apply";
import { geocodeStrategy } from "./strategies/geocode";
import { webSearchStrategy } from "./strategies/web-search";
import { osmLookupStrategy } from "./strategies/osm-lookup";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const STALE_ENRICHING_MS = 10 * 60 * 1000; // 10 minutes
const MAX_CONCURRENT = 3;

// ---------------------------------------------------------------------------
// In-memory concurrency limiter
// ---------------------------------------------------------------------------

let activeCount = 0;

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

/**
 * Check if a facility needs enrichment and run strategies if so.
 * Designed to be called from `after()` in a Next.js route handler.
 */
export async function enrichIfNeeded(facility: Facility): Promise<void> {
  // 1. Concurrency check
  if (activeCount >= MAX_CONCURRENT) {
    return;
  }

  // 2. Status check — skip if currently enriching (unless stale)
  if (facility.enrichmentStatus === "enriching") {
    if (facility.enrichedAt) {
      const elapsed = Date.now() - facility.enrichedAt.getTime();
      if (elapsed < STALE_ENRICHING_MS) {
        return;
      }
    }
    // Stale "enriching" — allow retry
  }

  // 3. Cooldown check — skip if recently enriched
  if (
    facility.enrichedAt &&
    facility.enrichmentStatus === "enriched"
  ) {
    const elapsed = Date.now() - facility.enrichedAt.getTime();
    if (elapsed < COOLDOWN_MS) {
      return;
    }
  }

  // 4. Gap detection — skip if nothing to enrich
  const gaps = detectGaps(facility);
  if (gaps.strategies.length === 0) {
    return;
  }

  // 5. Start enrichment
  activeCount++;

  try {
    // Mark as enriching
    await db
      .update(facilities)
      .set({ enrichmentStatus: "enriching", enrichedAt: new Date() })
      .where(eq(facilities.id, facility.id));

    console.log(
      `[Enrichment] Starting for "${facility.name}" (ID: ${String(facility.id)}). ` +
        `Strategies: ${gaps.strategies.join(", ")}. Missing: ${gaps.missingFields.join(", ")}`
    );

    // 6. Run strategies in parallel
    const promises: Promise<StrategyResult>[] = [];
    for (const name of gaps.strategies) {
      if (name === "geocode") {
        promises.push(geocodeStrategy(facility));
      } else if (name === "web-search") {
        promises.push(webSearchStrategy(facility));
      } else if (name === "osm-lookup") {
        promises.push(osmLookupStrategy(facility));
      }
    }

    const settled = await Promise.allSettled(promises);

    const results: StrategyResult[] = [];
    for (const outcome of settled) {
      if (outcome.status === "fulfilled") {
        results.push(outcome.value);
      }
    }

    // 7. Apply enrichments
    const summary = await applyEnrichments(facility, results);

    console.log(
      `[Enrichment] Completed for "${facility.name}" (ID: ${String(facility.id)}). ` +
        `Applied: ${String(summary.applied)}, Flagged: ${String(summary.flagged)}, Rejected: ${String(summary.rejected)}`
    );

    // 8. Update status
    await db
      .update(facilities)
      .set({ enrichmentStatus: "enriched", enrichedAt: new Date() })
      .where(eq(facilities.id, facility.id));
  } catch (error: unknown) {
    console.error(
      `[Enrichment] Failed for "${facility.name}" (ID: ${String(facility.id)}):`,
      error instanceof Error ? error.message : error
    );

    try {
      await db
        .update(facilities)
        .set({ enrichmentStatus: "failed", enrichedAt: new Date() })
        .where(eq(facilities.id, facility.id));
    } catch (statusError: unknown) {
      console.error(
        "[Enrichment] Failed to update status:",
        statusError instanceof Error ? statusError.message : statusError
      );
    }
  } finally {
    activeCount--;
  }
}
