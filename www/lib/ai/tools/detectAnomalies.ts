import { tool } from "ai";
import { and, gt, ilike, isNotNull, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { facilities } from "../../db/schema.facilities";
import { MEDICAL_KNOWLEDGE } from "../../medical-knowledge";
import { createToolLogger } from "./debug";
import { DB_QUERY_TIMEOUT_MS, withTimeout } from "./safeguards";

type Anomaly = {
  type: string;
  description: string;
  facilities: Record<string, unknown>[];
};

export const detectAnomalies = tool({
  description:
    "Identify potential data inconsistencies or suspicious facility claims. Checks for infrastructure mismatches, missing critical data, unlikely capacity claims, bed-to-OR ratio anomalies, subspecialty-size mismatches, and procedure breadth vs infrastructure signals. Covers VF Agent questions 4.2, 4.4, 4.6, 4.7, 4.8, 4.9.",
  inputSchema: z.object({
    region: z
      .string()
      .max(100)
      .optional()
      .describe("Limit detection to a specific region"),
    type: z
      .enum([
        "infrastructure_mismatch",
        "missing_critical_data",
        "unlikely_capacity",
        "bed_to_staff_ratio",
        "subspecialty_size_mismatch",
        "procedure_breadth_mismatch",
      ])
      .optional()
      .describe("Specific anomaly type to check, or omit to check all"),
  }),
  execute: async ({ region, type }, { abortSignal }) => {
    const log = createToolLogger("detectAnomalies");
    const start = Date.now();
    log.start({ region, type });

    try {
      const anomalies: Anomaly[] = [];
      const baseConditions = [isNotNull(facilities.id)];

      if (region) {
        baseConditions.push(ilike(facilities.addressRegion, `%${region}%`));
        log.step("Filter added: region", region);
      }

      // 1. Infrastructure Mismatch: Claims surgery but < 5 beds
      if (!type || type === "infrastructure_mismatch") {
        log.step("Checking infrastructure_mismatch");
        const surgicalMismatch = await withTimeout(
          db
            .select({
              id: facilities.id,
              name: facilities.name,
              beds: facilities.capacity,
              procedures: facilities.proceduresRaw,
            })
            .from(facilities)
            .where(
              and(
                ...baseConditions,
                ilike(facilities.proceduresRaw, "%surgery%"),
                sql`${facilities.capacity} < 5`
              )
            )
            .limit(10),
          DB_QUERY_TIMEOUT_MS,
          abortSignal
        );

        log.step("infrastructure_mismatch results", surgicalMismatch.length);
        if (surgicalMismatch.length > 0) {
          anomalies.push({
            type: "Surgical Capability vs Bed Capacity Mismatch",
            description:
              "Facilities claiming surgical capabilities but listing fewer than 5 beds.",
            facilities: surgicalMismatch,
          });
        }
      }

      // 2. Missing Critical Data: Hospitals with no doctors listed
      if (!type || type === "missing_critical_data") {
        log.step("Checking missing_critical_data");
        const ghostHospitals = await withTimeout(
          db
            .select({
              id: facilities.id,
              name: facilities.name,
              type: facilities.facilityType,
            })
            .from(facilities)
            .where(
              and(
                ...baseConditions,
                ilike(facilities.facilityType, "%Hospital%"),
                sql`${facilities.numDoctors} IS NULL`
              )
            )
            .limit(10),
          DB_QUERY_TIMEOUT_MS,
          abortSignal
        );

        log.step("missing_critical_data results", ghostHospitals.length);
        if (ghostHospitals.length > 0) {
          anomalies.push({
            type: "Missing Doctor Count",
            description:
              "Facilities identified as Hospitals but missing doctor count data.",
            facilities: ghostHospitals,
          });
        }
      }

      // 3. Unlikely Capacity: Facilities claiming very high capacity with few doctors
      if (!type || type === "unlikely_capacity") {
        log.step("Checking unlikely_capacity");
        const unlikelyCapacity = await withTimeout(
          db
            .select({
              id: facilities.id,
              name: facilities.name,
              beds: facilities.capacity,
              doctors: facilities.numDoctors,
              type: facilities.facilityType,
            })
            .from(facilities)
            .where(
              and(
                ...baseConditions,
                isNotNull(facilities.capacity),
                isNotNull(facilities.numDoctors),
                gt(facilities.capacity, 100),
                sql`${facilities.numDoctors} < 5`
              )
            )
            .limit(10),
          DB_QUERY_TIMEOUT_MS,
          abortSignal
        );

        log.step("unlikely_capacity results", unlikelyCapacity.length);
        if (unlikelyCapacity.length > 0) {
          anomalies.push({
            type: "Unlikely Capacity vs Staffing",
            description:
              "Facilities reporting >100 beds but fewer than 5 doctors, suggesting data inconsistency.",
            facilities: unlikelyCapacity,
          });
        }
      }

      // 4. Bed-to-Staff Ratio anomalies (Q4.2, Q4.7)
      // High bed counts but very few doctors, or vice versa
      if (!type || type === "bed_to_staff_ratio") {
        log.step("Checking bed_to_staff_ratio");
        const { expectedRatios } = MEDICAL_KNOWLEDGE;

        const ratioData = await withTimeout(
          db
            .select({
              id: facilities.id,
              name: facilities.name,
              beds: facilities.capacity,
              doctors: facilities.numDoctors,
              type: facilities.facilityType,
              equipment: facilities.equipmentRaw,
            })
            .from(facilities)
            .where(
              and(
                ...baseConditions,
                isNotNull(facilities.capacity),
                isNotNull(facilities.numDoctors),
                gt(facilities.capacity, 0),
                gt(facilities.numDoctors, 0)
              )
            )
            .limit(100),
          DB_QUERY_TIMEOUT_MS,
          abortSignal
        );

        const highBedPerDoctor = ratioData.filter((f) => {
          const ratio = (f.beds ?? 0) / (f.doctors ?? 1);
          return ratio > expectedRatios.bedsPerDoctor.max;
        });

        if (highBedPerDoctor.length > 0) {
          anomalies.push({
            type: "High Bed-to-Doctor Ratio",
            description: `Facilities with more than ${expectedRatios.bedsPerDoctor.max} beds per doctor (expected typical: ${expectedRatios.bedsPerDoctor.typical}). May indicate misrepresentation or data error.`,
            facilities: highBedPerDoctor.slice(0, 10).map((f) => ({
              id: f.id,
              name: f.name,
              beds: f.beds,
              doctors: f.doctors,
              ratio: Math.round(((f.beds ?? 0) / (f.doctors ?? 1)) * 10) / 10,
            })),
          });
        }

        log.step("bed_to_staff_ratio results", highBedPerDoctor.length);
      }

      // 5. Subspecialty-Size Mismatch (Q4.6)
      // Claims advanced subspecialties without appropriate facility size
      if (!type || type === "subspecialty_size_mismatch") {
        log.step("Checking subspecialty_size_mismatch");
        const { specialtyInfrastructure } = MEDICAL_KNOWLEDGE;

        const allFacs = await withTimeout(
          db
            .select({
              id: facilities.id,
              name: facilities.name,
              beds: facilities.capacity,
              doctors: facilities.numDoctors,
              specialties: facilities.specialtiesRaw,
              procedures: facilities.proceduresRaw,
              equipment: facilities.equipmentRaw,
              type: facilities.facilityType,
            })
            .from(facilities)
            .where(and(...baseConditions))
            .limit(200),
          DB_QUERY_TIMEOUT_MS,
          abortSignal
        );

        const subspecialtyMismatches: Record<string, unknown>[] = [];

        for (const fac of allFacs) {
          if (abortSignal?.aborted) {
            return { error: "Operation was aborted" };
          }

          const specText = (fac.specialties ?? "").toLowerCase();
          const procText = (fac.procedures ?? "").toLowerCase();
          const equipText = (fac.equipment ?? "").toLowerCase();
          const beds = fac.beds ?? 0;
          const doctors = fac.doctors ?? 0;

          for (const [specialty, thresholds] of Object.entries(
            specialtyInfrastructure
          )) {
            if (
              specText.includes(specialty.toLowerCase()) ||
              procText.includes(specialty.toLowerCase())
            ) {
              const issues: string[] = [];

              if (beds > 0 && beds < thresholds.minBeds) {
                issues.push(`${beds} beds (min ${thresholds.minBeds})`);
              }
              if (doctors > 0 && doctors < thresholds.minDoctors) {
                issues.push(
                  `${doctors} doctors (min ${thresholds.minDoctors})`
                );
              }
              if (thresholds.requiredEquipment && equipText.length > 0) {
                const hasAny = thresholds.requiredEquipment.some((eq) =>
                  equipText.includes(eq.toLowerCase())
                );
                if (!hasAny) {
                  issues.push(
                    `no required equipment (needs: ${thresholds.requiredEquipment.join(", ")})`
                  );
                }
              }

              if (issues.length > 0) {
                subspecialtyMismatches.push({
                  id: fac.id,
                  name: fac.name,
                  claimedSpecialty: specialty,
                  beds,
                  doctors,
                  issues: issues.join("; "),
                });
              }
            }
          }
        }

        if (subspecialtyMismatches.length > 0) {
          anomalies.push({
            type: "Subspecialty-Size Mismatch",
            description:
              "Facilities claiming advanced subspecialties without appropriate infrastructure (beds, doctors, or equipment).",
            facilities: subspecialtyMismatches.slice(0, 10),
          });
        }

        log.step(
          "subspecialty_size_mismatch results",
          subspecialtyMismatches.length
        );
      }

      // 6. Procedure Breadth Mismatch (Q4.8, Q4.9)
      // Too many procedures claimed relative to facility size
      if (!type || type === "procedure_breadth_mismatch") {
        log.step("Checking procedure_breadth_mismatch");
        const { expectedRatios } = MEDICAL_KNOWLEDGE;

        const breadthData = await withTimeout(
          db
            .select({
              id: facilities.id,
              name: facilities.name,
              beds: facilities.capacity,
              doctors: facilities.numDoctors,
              procedures: facilities.procedures,
              equipment: facilities.equipmentRaw,
              specialties: facilities.specialtiesRaw,
              type: facilities.facilityType,
            })
            .from(facilities)
            .where(and(...baseConditions, isNotNull(facilities.procedures)))
            .limit(200),
          DB_QUERY_TIMEOUT_MS,
          abortSignal
        );

        const breadthAnomalies: Record<string, unknown>[] = [];

        for (const fac of breadthData) {
          if (abortSignal?.aborted) {
            return { error: "Operation was aborted" };
          }

          const procCount = fac.procedures?.length ?? 0;
          if (procCount === 0) {
            continue;
          }

          const beds = fac.beds ?? 0;
          const doctors = fac.doctors ?? 0;
          const equipText = (fac.equipment ?? "").toLowerCase();
          const equipLen = equipText.length;

          let maxExpected = expectedRatios.maxProceduresLargeFacility;
          if (beds > 0 && beds < 20) {
            maxExpected = expectedRatios.maxProceduresSmallFacility;
          } else if (beds >= 20 && beds <= 100) {
            maxExpected = expectedRatios.maxProceduresMediumFacility;
          }

          // Flag if procedure count exceeds expected max for facility size
          const overProcedures = procCount > maxExpected;
          // Flag if many procedures but minimal equipment text
          const thinEquipment = procCount > 10 && equipLen < 50;
          // Flag if many procedures but very few doctors
          const thinStaffing = procCount > 10 && doctors > 0 && doctors < 3;

          if (overProcedures || thinEquipment || thinStaffing) {
            const issues: string[] = [];
            if (overProcedures) {
              issues.push(
                `${procCount} procedures (max ${maxExpected} expected for ${beds > 0 ? `${beds}-bed` : "unknown-size"} facility)`
              );
            }
            if (thinEquipment) {
              issues.push(
                `${procCount} procedures with minimal equipment documentation (${equipLen} chars)`
              );
            }
            if (thinStaffing) {
              issues.push(
                `${procCount} procedures with only ${doctors} doctors`
              );
            }

            breadthAnomalies.push({
              id: fac.id,
              name: fac.name,
              beds,
              doctors,
              procedureCount: procCount,
              equipmentLength: equipLen,
              issues: issues.join("; "),
            });
          }
        }

        if (breadthAnomalies.length > 0) {
          anomalies.push({
            type: "Procedure Breadth vs Infrastructure Mismatch",
            description:
              "Facilities claiming an unusually high number of procedures relative to their stated size, staffing, or equipment documentation.",
            facilities: breadthAnomalies.slice(0, 10),
          });
        }

        log.step("procedure_breadth_mismatch results", breadthAnomalies.length);
      }

      const output = {
        region: region ?? "All regions",
        foundAnomalies: anomalies.length,
        details: anomalies,
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown anomaly detection error";
      log.error(error, { region, type }, Date.now() - start);
      return { error: `Anomaly detection failed: ${message}` };
    }
  },
});
