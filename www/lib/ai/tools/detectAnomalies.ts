import { z } from "zod";
import { db } from "../../db";
import { facilities } from "../../db/schema.facilities";
import { sql, isNotNull, and, ilike, gt } from "drizzle-orm";
import { tool } from "ai";
import { createToolLogger } from "./debug";
import { withTimeout, DB_QUERY_TIMEOUT_MS } from "./safeguards";

type Anomaly = {
  type: string;
  description: string;
  facilities: Array<Record<string, unknown>>;
};

export const detectAnomalies = tool({
  description:
    "Identify potential data inconsistencies or suspicious facility claims. Checks for infrastructure mismatches, missing critical data, and unlikely capacity claims.",
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

      const output = {
        region: region ?? "All Ghana",
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
