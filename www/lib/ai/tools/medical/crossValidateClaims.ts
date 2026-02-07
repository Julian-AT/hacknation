import { z } from "zod";
import { db } from "../../../db";
import { facilities } from "../../../db/schema.facilities";
import { eq, ilike, and, isNotNull } from "drizzle-orm";
import { tool } from "ai";
import { createToolLogger } from "../debug";
import { withTimeout, DB_QUERY_TIMEOUT_MS } from "../safeguards";

/**
 * Medical knowledge base: procedure -> minimum required equipment
 */
const PROCEDURE_EQUIPMENT_MAP: Record<string, string[]> = {
  "cataract surgery": [
    "operating microscope",
    "phaco",
    "intraocular lens",
    "IOL",
  ],
  neurosurgery: ["CT", "MRI", "ICU", "operating room"],
  dialysis: ["dialysis machine", "hemodialysis"],
  "cardiac surgery": [
    "cardiac bypass",
    "heart-lung machine",
    "ICU",
    "echocardiography",
  ],
  endoscopy: ["endoscope", "endoscopy"],
  radiology: ["X-ray", "CT", "MRI", "ultrasound"],
  laparoscopy: ["laparoscope", "laparoscopic"],
};

/**
 * Minimum infrastructure thresholds for specialties
 */
const SPECIALTY_THRESHOLDS: Record<
  string,
  { minBeds: number; minDoctors: number }
> = {
  neurosurgery: { minBeds: 100, minDoctors: 5 },
  "cardiac surgery": { minBeds: 50, minDoctors: 5 },
  "organ transplant": { minBeds: 100, minDoctors: 10 },
  oncology: { minBeds: 50, minDoctors: 3 },
  neonatology: { minBeds: 30, minDoctors: 3 },
};

type ValidationResult = {
  facilityId: number;
  facilityName: string;
  validationType: string;
  severity: "low" | "medium" | "high" | "critical";
  finding: string;
  evidence: Record<string, unknown>;
};

export const crossValidateClaims = tool({
  description:
    "Cross-reference facility claims against medical knowledge to verify consistency. Checks procedure-equipment alignment, specialty-infrastructure thresholds, and claim plausibility.",
  inputSchema: z.object({
    facilityId: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Validate a specific facility by ID"),
    region: z
      .string()
      .max(100)
      .optional()
      .describe("Validate all facilities in a region"),
    validationType: z
      .enum(["procedure_equipment", "specialty_infrastructure", "all"])
      .default("all")
      .describe("Type of validation to perform"),
  }),
  execute: async (
    { facilityId, region, validationType },
    { abortSignal }
  ) => {
    const log = createToolLogger("crossValidateClaims");
    const start = Date.now();
    log.start({ facilityId, region, validationType });

    try {
      const results: ValidationResult[] = [];

      // Build query conditions
      const conditions = [isNotNull(facilities.id)];
      if (facilityId) {
        conditions.push(eq(facilities.id, facilityId));
      }
      if (region) {
        conditions.push(ilike(facilities.addressRegion, `%${region}%`));
      }

      const rows = await withTimeout(
        db
          .select({
            id: facilities.id,
            name: facilities.name,
            beds: facilities.capacity,
            doctors: facilities.numDoctors,
            procedures: facilities.proceduresRaw,
            equipment: facilities.equipmentRaw,
            specialties: facilities.specialtiesRaw,
            type: facilities.facilityType,
          })
          .from(facilities)
          .where(and(...conditions))
          .limit(facilityId ? 1 : 20),
        DB_QUERY_TIMEOUT_MS,
        abortSignal
      );

      log.step("Facilities to validate", rows.length);

      for (const fac of rows) {
        if (abortSignal?.aborted) {
          return { error: "Operation was aborted" };
        }

        const procText = (fac.procedures ?? "").toLowerCase();
        const equipText = (fac.equipment ?? "").toLowerCase();
        const specText = (fac.specialties ?? "").toLowerCase();

        // 1. Procedure-Equipment cross-validation
        if (
          validationType === "all" ||
          validationType === "procedure_equipment"
        ) {
          for (const [procedure, requiredEquipment] of Object.entries(
            PROCEDURE_EQUIPMENT_MAP
          )) {
            if (procText.includes(procedure.toLowerCase())) {
              const hasEquipment = requiredEquipment.some((eq) =>
                equipText.includes(eq.toLowerCase())
              );
              if (!hasEquipment && equipText.length > 0) {
                results.push({
                  facilityId: fac.id,
                  facilityName: fac.name,
                  validationType: "procedure_equipment_mismatch",
                  severity: "high",
                  finding: `Claims "${procedure}" but none of the required equipment found (${requiredEquipment.join(", ")}).`,
                  evidence: {
                    claimedProcedure: procedure,
                    requiredEquipment,
                    listedEquipment: equipText.slice(0, 200),
                  },
                });
              }
            }
          }
        }

        // 2. Specialty-Infrastructure validation
        if (
          validationType === "all" ||
          validationType === "specialty_infrastructure"
        ) {
          for (const [specialty, thresholds] of Object.entries(
            SPECIALTY_THRESHOLDS
          )) {
            if (
              specText.includes(specialty.toLowerCase()) ||
              procText.includes(specialty.toLowerCase())
            ) {
              const beds = fac.beds ?? 0;
              const doctors = fac.doctors ?? 0;
              const issues: string[] = [];

              if (beds > 0 && beds < thresholds.minBeds) {
                issues.push(
                  `${beds} beds (minimum ${thresholds.minBeds} expected)`
                );
              }
              if (doctors > 0 && doctors < thresholds.minDoctors) {
                issues.push(
                  `${doctors} doctors (minimum ${thresholds.minDoctors} expected)`
                );
              }

              if (issues.length > 0) {
                results.push({
                  facilityId: fac.id,
                  facilityName: fac.name,
                  validationType: "specialty_infrastructure_gap",
                  severity:
                    issues.length > 1 ? "critical" : "high",
                  finding: `Claims "${specialty}" but has insufficient infrastructure: ${issues.join("; ")}.`,
                  evidence: {
                    claimedSpecialty: specialty,
                    beds: fac.beds,
                    doctors: fac.doctors,
                    thresholds,
                  },
                });
              }
            }
          }
        }
      }

      const output = {
        facilitiesChecked: rows.length,
        issuesFound: results.length,
        results: results.slice(0, 15),
        summary: results.length > 0
          ? `Found ${results.length} validation issues across ${rows.length} facilities.`
          : `All ${rows.length} facilities passed validation checks.`,
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown validation error";
      log.error(
        error,
        { facilityId, region, validationType },
        Date.now() - start
      );
      return { error: `Cross-validation failed: ${message}` };
    }
  },
});
