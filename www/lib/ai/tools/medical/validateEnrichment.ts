import { z } from "zod";
import { db } from "../../../db";
import { facilities } from "../../../db/schema.facilities";
import { eq } from "drizzle-orm";
import { tool } from "ai";
import { createToolLogger } from "../debug";
import { withTimeout, DB_QUERY_TIMEOUT_MS } from "../safeguards";

/**
 * Enrichment validation — prevents false data injection.
 *
 * When research/scraping agents discover new metadata about a facility
 * (e.g., updated doctor count, new equipment, corrected region), this tool
 * validates the proposed change against existing data before accepting it.
 *
 * Design principles:
 * - Quarantine pattern: proposed changes are flagged for review, never auto-committed
 * - Confidence scoring: each change gets a confidence rating based on evidence strength
 * - Source attribution: every change must cite its source
 * - Contradiction detection: flags when new data conflicts with existing data
 */

// ---------------------------------------------------------------------------
// Validation rules for specific field types
// ---------------------------------------------------------------------------

/**
 * Known regions by country. Used for soft validation — unknown regions
 * are flagged but not rejected, since data may cover any country.
 */
const KNOWN_REGIONS: Record<string, readonly string[]> = {
  GH: [
    "Greater Accra",
    "Ashanti",
    "Northern",
    "Western",
    "Eastern",
    "Central",
    "Volta",
    "Upper East",
    "Upper West",
    "Brong-Ahafo",
    "Savannah",
    "North East",
    "Oti",
    "Bono East",
    "Ahafo",
    "Western North",
  ],
} as const;

const VALID_FACILITY_TYPES = [
  "hospital",
  "clinic",
  "doctor",
  "pharmacy",
  "dentist",
] as const;

const VALID_OPERATOR_TYPES = ["public", "private"] as const;

type EnrichmentCheck = {
  field: string;
  proposedValue: string | number | boolean;
  existingValue: string | number | boolean | null;
  status: "accepted" | "flagged" | "rejected";
  confidence: "high" | "medium" | "low";
  reason: string;
  contradicts: boolean;
};

/**
 * Validate that a proposed region value is a known region.
 * Checks against known regions for the given country code, if available.
 * Unknown regions are flagged (not rejected) since data may cover any country.
 */
function validateRegion(value: string, countryCode?: string): { valid: boolean; reason: string } {
  const normalized = value.trim();
  const regions = countryCode ? KNOWN_REGIONS[countryCode.toUpperCase()] : undefined;

  if (!regions) {
    // No known region list for this country — accept but flag
    return {
      valid: true,
      reason: `Region "${normalized}" accepted (no region list available for country ${countryCode ?? "unknown"}).`,
    };
  }

  const match = regions.find(
    (r) => r.toLowerCase() === normalized.toLowerCase()
  );
  if (match) {
    return { valid: true, reason: `Matches known region: ${match}` };
  }
  // Fuzzy check for partial matches
  const partial = regions.find((r) =>
    r.toLowerCase().includes(normalized.toLowerCase())
  );
  if (partial) {
    return {
      valid: true,
      reason: `Partial match to region: ${partial} (verify exact name)`,
    };
  }
  return {
    valid: false,
    reason: `"${value}" is not a recognized region. Known regions for ${countryCode}: ${regions.join(", ")}`,
  };
}

/**
 * Validate numeric fields are within plausible ranges.
 */
function validateNumericRange(
  field: string,
  value: number
): { valid: boolean; reason: string } {
  const RANGES: Record<string, { min: number; max: number; label: string }> = {
    num_doctors: { min: 0, max: 5000, label: "doctor count" },
    capacity: { min: 0, max: 10000, label: "bed count" },
    area_sqm: { min: 10, max: 500000, label: "area (sqm)" },
    year_established: { min: 1800, max: 2026, label: "year established" },
  };

  const range = RANGES[field];
  if (!range) {
    return { valid: true, reason: "No range validation for this field" };
  }

  if (value < range.min || value > range.max) {
    return {
      valid: false,
      reason: `${range.label} value ${value} is outside plausible range (${range.min}-${range.max})`,
    };
  }
  return { valid: true, reason: `${range.label} value ${value} is within plausible range` };
}

/**
 * Check if a new value contradicts existing non-null data.
 */
function detectContradiction(
  field: string,
  existing: string | number | boolean | null,
  proposed: string | number | boolean
): { contradicts: boolean; severity: "low" | "medium" | "high" } {
  if (existing === null || existing === undefined || existing === "") {
    // Filling in missing data — no contradiction
    return { contradicts: false, severity: "low" };
  }

  // String comparison (case-insensitive)
  if (typeof existing === "string" && typeof proposed === "string") {
    if (existing.toLowerCase() === proposed.toLowerCase()) {
      return { contradicts: false, severity: "low" };
    }
    return { contradicts: true, severity: "medium" };
  }

  // Numeric comparison with tolerance
  if (typeof existing === "number" && typeof proposed === "number") {
    const diff = Math.abs(existing - proposed);
    const tolerance = Math.max(existing * 0.2, 1); // 20% tolerance
    if (diff <= tolerance) {
      return { contradicts: false, severity: "low" };
    }
    if (diff <= existing * 0.5) {
      return { contradicts: true, severity: "medium" };
    }
    return { contradicts: true, severity: "high" };
  }

  // Boolean
  if (typeof existing === "boolean" && typeof proposed === "boolean") {
    return {
      contradicts: existing !== proposed,
      severity: existing !== proposed ? "high" : "low",
    };
  }

  return { contradicts: true, severity: "medium" };
}

// ---------------------------------------------------------------------------
// Tool definition
// ---------------------------------------------------------------------------

export const validateEnrichment = tool({
  description:
    "Validate proposed data enrichments or corrections from research/scraping agents before they are applied to the database. Checks for plausibility, contradictions with existing data, and data quality. Returns a quarantine report — changes are NEVER auto-applied. Each proposed change must include a source URL or citation.",
  inputSchema: z.object({
    facilityId: z
      .number()
      .int()
      .positive()
      .describe("The facility ID to validate enrichment for"),
    proposedChanges: z
      .array(
        z.object({
          field: z
            .string()
            .describe(
              "The database column name (snake_case, e.g. num_doctors, address_region)"
            ),
          value: z
            .union([z.string(), z.number(), z.boolean()])
            .describe("The proposed new value"),
          source: z
            .string()
            .describe(
              "Source URL or citation for this data (required for traceability)"
            ),
          confidence: z
            .enum(["high", "medium", "low"])
            .describe(
              "How confident the research agent is in this value"
            ),
        })
      )
      .min(1)
      .max(20)
      .describe("Array of proposed field changes with source attribution"),
    reasoning: z
      .string()
      .describe("Why these enrichments are being proposed"),
  }),
  execute: async ({ facilityId, proposedChanges, reasoning }, { abortSignal }) => {
    const log = createToolLogger("validateEnrichment");
    const start = Date.now();
    log.start({ facilityId, changeCount: proposedChanges.length, reasoning });

    try {
      // Fetch the existing facility record
      const [existing] = await withTimeout(
        db
          .select()
          .from(facilities)
          .where(eq(facilities.id, facilityId))
          .limit(1),
        DB_QUERY_TIMEOUT_MS,
        abortSignal
      );

      if (!existing) {
        return {
          error: `Facility with ID ${facilityId} not found`,
          status: "rejected",
        };
      }

      log.step("Found facility", existing.name);

      const checks: EnrichmentCheck[] = [];
      let acceptedCount = 0;
      let flaggedCount = 0;
      let rejectedCount = 0;

      for (const change of proposedChanges) {
        const { field, value, source, confidence } = change;

        // Get the existing value for this field
        const existingValue =
          (existing as Record<string, unknown>)[field] ?? null;

        let status: EnrichmentCheck["status"] = "accepted";
        let reason = "";
        let contradicts = false;

        // 1. Source validation — reject changes without proper source
        if (!source || source.trim().length < 5) {
          status = "rejected";
          reason = "No valid source citation provided. All enrichments must be traceable.";
          rejectedCount++;
          checks.push({
            field,
            proposedValue: value,
            existingValue: existingValue as string | number | boolean | null,
            status,
            confidence,
            reason,
            contradicts: false,
          });
          continue;
        }

        // 2. Field-specific validation
        if (field === "address_region" && typeof value === "string") {
          const regionCheck = validateRegion(value);
          if (!regionCheck.valid) {
            status = "rejected";
            reason = regionCheck.reason;
            rejectedCount++;
            checks.push({
              field,
              proposedValue: value,
              existingValue: existingValue as string | number | boolean | null,
              status,
              confidence,
              reason,
              contradicts: false,
            });
            continue;
          }
        }

        if (field === "facility_type" && typeof value === "string") {
          const normalizedType = value.toLowerCase().trim();
          const isValid = VALID_FACILITY_TYPES.some(
            (t) => t === normalizedType
          );
          if (!isValid) {
            status = "flagged";
            reason = `Facility type "${value}" is not in standard types: ${VALID_FACILITY_TYPES.join(", ")}. Needs manual review.`;
            flaggedCount++;
            checks.push({
              field,
              proposedValue: value,
              existingValue: existingValue as string | number | boolean | null,
              status,
              confidence,
              reason,
              contradicts: false,
            });
            continue;
          }
        }

        if (field === "operator_type" && typeof value === "string") {
          const normalizedOp = value.toLowerCase().trim();
          const isValid = VALID_OPERATOR_TYPES.some(
            (t) => t === normalizedOp
          );
          if (!isValid) {
            status = "rejected";
            reason = `Operator type "${value}" is not valid. Must be: ${VALID_OPERATOR_TYPES.join(", ")}`;
            rejectedCount++;
            checks.push({
              field,
              proposedValue: value,
              existingValue: existingValue as string | number | boolean | null,
              status,
              confidence,
              reason,
              contradicts: false,
            });
            continue;
          }
        }

        // Numeric range validation
        if (typeof value === "number") {
          const rangeCheck = validateNumericRange(field, value);
          if (!rangeCheck.valid) {
            status = "rejected";
            reason = rangeCheck.reason;
            rejectedCount++;
            checks.push({
              field,
              proposedValue: value,
              existingValue: existingValue as string | number | boolean | null,
              status,
              confidence,
              reason,
              contradicts: false,
            });
            continue;
          }
        }

        // 3. Contradiction detection
        const contradiction = detectContradiction(
          field,
          existingValue as string | number | boolean | null,
          value
        );
        contradicts = contradiction.contradicts;

        if (contradicts) {
          if (contradiction.severity === "high") {
            status = "flagged";
            reason = `CONTRADICTS existing data: existing="${String(existingValue)}", proposed="${String(value)}". High-severity change requires manual review.`;
            flaggedCount++;
          } else if (confidence === "low") {
            status = "flagged";
            reason = `Contradicts existing data with low confidence. Existing="${String(existingValue)}", proposed="${String(value)}".`;
            flaggedCount++;
          } else {
            status = "accepted";
            reason = `Minor update from existing "${String(existingValue)}" to "${String(value)}". Source: ${source}`;
            acceptedCount++;
          }
        } else {
          // No contradiction — filling in missing data or confirming existing
          if (existingValue === null || existingValue === "") {
            status = "accepted";
            reason = `Fills missing ${field} value. Source: ${source}`;
            acceptedCount++;
          } else {
            status = "accepted";
            reason = `Confirms existing value. No change needed.`;
            acceptedCount++;
          }
        }

        checks.push({
          field,
          proposedValue: value,
          existingValue: existingValue as string | number | boolean | null,
          status,
          confidence,
          reason,
          contradicts,
        });
      }

      const output = {
        facilityId,
        facilityName: existing.name,
        totalChanges: proposedChanges.length,
        accepted: acceptedCount,
        flagged: flaggedCount,
        rejected: rejectedCount,
        quarantineReport: checks,
        recommendation:
          rejectedCount > 0
            ? "Some changes were rejected due to validation failures. Review the quarantine report."
            : flaggedCount > 0
              ? "Some changes were flagged for manual review due to contradictions or uncertainty."
              : "All proposed changes passed validation. Safe to apply after human review.",
        note: "Changes are QUARANTINED — they are NOT automatically applied to the database. A human reviewer must approve flagged and accepted changes before they are committed.",
      };

      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown validation error";
      log.error(
        error,
        { facilityId, changeCount: proposedChanges.length },
        Date.now() - start
      );
      return { error: `Enrichment validation failed: ${message}` };
    }
  },
});
