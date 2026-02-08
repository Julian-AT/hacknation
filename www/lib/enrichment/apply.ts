/**
 * Enrichment application — merges, validates, and applies proposed changes.
 *
 * Deduplicates changes from multiple strategies, validates each using
 * the same rules as the validateEnrichment tool, and applies only
 * accepted changes to the database.
 */

import { eq } from "drizzle-orm";
import {
  VALID_FACILITY_TYPES,
  VALID_OPERATOR_TYPES,
  detectContradiction,
  validateNumericRange,
  validateRegion,
} from "../ai/tools/medical/validateEnrichment";
import { db } from "../db";
import { facilities } from "../db/schema.facilities";
import type { Facility, ProposedChange, StrategyResult } from "./detect-gaps";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EnrichmentResult = {
  field: string;
  value: string | number | boolean;
  status: "accepted" | "flagged" | "rejected";
  reason: string;
};

export type EnrichmentSummary = {
  applied: number;
  flagged: number;
  rejected: number;
  details: EnrichmentResult[];
};

// ---------------------------------------------------------------------------
// Field mapping: snake_case DB columns -> camelCase Drizzle properties
// ---------------------------------------------------------------------------

const FIELD_TO_DRIZZLE: Record<string, string> = {
  lat: "lat",
  lng: "lng",
  num_doctors: "numDoctors",
  capacity: "capacity",
  area_sqm: "areaSqm",
  year_established: "yearEstablished",
  address_region: "addressRegion",
  description: "description",
  specialties_raw: "specialtiesRaw",
  procedures_raw: "proceduresRaw",
  equipment_raw: "equipmentRaw",
  capabilities_raw: "capabilitiesRaw",
  operator_type: "operatorType",
};

const CONFIDENCE_RANK: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

// ---------------------------------------------------------------------------
// Core logic
// ---------------------------------------------------------------------------

/**
 * Merge strategy results, deduplicate by field (highest confidence wins),
 * validate, and apply accepted changes to the database.
 */
export async function applyEnrichments(
  facility: Facility,
  results: StrategyResult[]
): Promise<EnrichmentSummary> {
  // 1. Flatten all proposed changes
  const allChanges: ProposedChange[] = [];
  for (const result of results) {
    for (const change of result.changes) {
      allChanges.push(change);
    }
  }

  if (allChanges.length === 0) {
    return { applied: 0, flagged: 0, rejected: 0, details: [] };
  }

  // 2. Deduplicate by field — keep highest confidence
  const byField = new Map<string, ProposedChange>();
  for (const change of allChanges) {
    const existing = byField.get(change.field);
    if (
      !existing ||
      (CONFIDENCE_RANK[change.confidence] ?? 0) >
        (CONFIDENCE_RANK[existing.confidence] ?? 0)
    ) {
      byField.set(change.field, change);
    }
  }

  // 3. Validate each change
  const details: EnrichmentResult[] = [];
  const toApply = new Map<string, string | number | boolean>();

  for (const [field, change] of byField) {
    const drizzleKey = FIELD_TO_DRIZZLE[field] ?? field;
    const existingValue =
      (facility as unknown as Record<string, unknown>)[drizzleKey] ?? null;

    // Source validation
    if (!change.source || change.source.length < 5) {
      details.push({
        field,
        value: change.value,
        status: "rejected",
        reason: "No valid source citation",
      });
      continue;
    }

    // Region validation
    if (field === "address_region" && typeof change.value === "string") {
      const check = validateRegion(
        change.value,
        facility.countryCode ?? "GH"
      );
      if (!check.valid) {
        details.push({
          field,
          value: change.value,
          status: "rejected",
          reason: check.reason,
        });
        continue;
      }
    }

    // Facility type validation
    if (field === "facility_type" && typeof change.value === "string") {
      const isValid = VALID_FACILITY_TYPES.some(
        (t) => t === change.value.toString().toLowerCase().trim()
      );
      if (!isValid) {
        details.push({
          field,
          value: change.value,
          status: "flagged",
          reason: `Not a standard facility type: ${VALID_FACILITY_TYPES.join(", ")}`,
        });
        continue;
      }
    }

    // Operator type validation
    if (field === "operator_type" && typeof change.value === "string") {
      const isValid = VALID_OPERATOR_TYPES.some(
        (t) => t === change.value.toString().toLowerCase().trim()
      );
      if (!isValid) {
        details.push({
          field,
          value: change.value,
          status: "rejected",
          reason: `Not a valid operator type: ${VALID_OPERATOR_TYPES.join(", ")}`,
        });
        continue;
      }
    }

    // Numeric range validation
    if (typeof change.value === "number") {
      const check = validateNumericRange(field, change.value);
      if (!check.valid) {
        details.push({
          field,
          value: change.value,
          status: "rejected",
          reason: check.reason,
        });
        continue;
      }
    }

    // Contradiction detection
    const contradiction = detectContradiction(
      field,
      existingValue as string | number | boolean | null,
      change.value
    );

    if (contradiction.contradicts) {
      if (contradiction.severity === "high") {
        details.push({
          field,
          value: change.value,
          status: "flagged",
          reason: `High-severity contradiction with existing value: ${String(existingValue)}`,
        });
        continue;
      }
      if (change.confidence === "low") {
        details.push({
          field,
          value: change.value,
          status: "flagged",
          reason: `Low-confidence contradiction with existing value: ${String(existingValue)}`,
        });
        continue;
      }
    }

    // Skip if existing value is present and not contradicted (confirms existing data)
    if (
      existingValue !== null &&
      existingValue !== "" &&
      !contradiction.contradicts
    ) {
      details.push({
        field,
        value: change.value,
        status: "accepted",
        reason: "Confirms existing value, no update needed",
      });
      continue;
    }

    // Accept the change for application
    toApply.set(field, change.value);
    details.push({
      field,
      value: change.value,
      status: "accepted",
      reason: `Fills missing data from ${change.source}`,
    });
  }

  // 4. Apply accepted changes to database
  let appliedCount = 0;

  if (toApply.size > 0) {
    const updatePayload: Record<string, string | number | boolean> = {};
    for (const [field, value] of toApply) {
      const drizzleKey = FIELD_TO_DRIZZLE[field];
      if (drizzleKey) {
        updatePayload[drizzleKey] = value;
      }
    }

    appliedCount = Object.keys(updatePayload).length;

    if (appliedCount > 0) {
      await db
        .update(facilities)
        // biome-ignore lint/suspicious/noExplicitAny: Dynamic enrichment payload with validated field names
        .set(updatePayload as Record<string, never>)
        .where(eq(facilities.id, facility.id));
    }
  }

  const flaggedCount = details.filter((d) => d.status === "flagged").length;
  const rejectedCount = details.filter((d) => d.status === "rejected").length;

  return {
    applied: appliedCount,
    flagged: flaggedCount,
    rejected: rejectedCount,
    details,
  };
}
