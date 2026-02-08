import { tool } from "ai";
import { and, isNotNull, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { facilities } from "../../db/schema.facilities";
import { createToolLogger } from "./debug";
import { clampNumber, DB_QUERY_TIMEOUT_MS, withTimeout } from "./safeguards";

export const getStats = tool({
  description:
    'Get aggregated statistics about healthcare facilities. Use for overview questions like "How many hospitals are there?", "What are the top regions?".',
  inputSchema: z.object({
    groupBy: z
      .enum(["region", "type", "specialty"])
      .optional()
      .describe("Group results by region, facility type, or specialty"),
    limit: z
      .number()
      .min(1)
      .max(50)
      .default(10)
      .describe("Maximum number of grouped results to return"),
  }),
  execute: async ({ groupBy, limit: rawLimit }, { abortSignal }) => {
    const limit = clampNumber(rawLimit, 1, 50, 10);
    const log = createToolLogger("getStats");
    const start = Date.now();
    log.start({ groupBy, limit });

    try {
      if (groupBy === "region") {
        log.step("Aggregating by region");
        const stats = await withTimeout(
          db
            .select({
              region: facilities.addressRegion,
              count: sql<number>`count(*)`,
              doctors: sql<number>`sum(${facilities.numDoctors})`,
              beds: sql<number>`sum(${facilities.capacity})`,
              facilitiesWithDoctorData: sql<number>`count(${facilities.numDoctors})`,
              facilitiesWithBedData: sql<number>`count(${facilities.capacity})`,
            })
            .from(facilities)
            .groupBy(facilities.addressRegion)
            .orderBy(sql`count(*) DESC`)
            .limit(limit),
          DB_QUERY_TIMEOUT_MS,
          abortSignal
        );
        log.step("Region stats returned", stats.length);

        // Add data completeness warnings
        const nullRegionCount = stats.filter(
          (s) => s.region === null || String(s.region) === "null"
        ).length;
        const dataQualityNote =
          nullRegionCount > 0
            ? `${stats.find((s) => s.region === null || String(s.region) === "null")?.count ?? 0} facilities have no region assigned (NULL). Doctor and bed counts show "null" when no facilities in that group have data for that field — check facilitiesWithDoctorData and facilitiesWithBedData for actual coverage.`
            : undefined;

        const output = { groupBy, stats, ...(dataQualityNote ? { dataQualityNote } : {}) };
        log.success(output, Date.now() - start);
        return output;
      }

      if (groupBy === "type") {
        log.step("Aggregating by facility type");
        const stats = await withTimeout(
          db
            .select({
              type: facilities.facilityType,
              count: sql<number>`count(*)`,
            })
            .from(facilities)
            .groupBy(facilities.facilityType)
            .orderBy(sql`count(*) DESC`)
            .limit(limit),
          DB_QUERY_TIMEOUT_MS,
          abortSignal
        );
        log.step("Type stats returned", stats.length);
        const output = { groupBy, stats };
        log.success(output, Date.now() - start);
        return output;
      }

      if (groupBy === "specialty") {
        log.step("Aggregating by specialty");
        // Unnest the specialties array and group
        const stats = await withTimeout(
          db.execute(
            sql`SELECT unnest(specialties) AS specialty, count(*) AS count
                FROM facilities
                WHERE specialties IS NOT NULL
                GROUP BY specialty
                ORDER BY count DESC
                LIMIT ${limit}`
          ),
          DB_QUERY_TIMEOUT_MS,
          abortSignal
        );
        const rows = Array.isArray(stats) ? stats : [];
        log.step("Specialty stats returned", rows.length);
        const output = { groupBy, stats: rows };
        log.success(output, Date.now() - start);
        return output;
      }

      // Default: Total counts
      log.step("Fetching total facility count");
      const total = await withTimeout(
        db.select({ count: sql<number>`count(*)` }).from(facilities),
        DB_QUERY_TIMEOUT_MS,
        abortSignal
      );

      // Also get counts by type for additional context
      const typeCounts = await withTimeout(
        db
          .select({
            type: facilities.facilityType,
            count: sql<number>`count(*)`,
          })
          .from(facilities)
          .groupBy(facilities.facilityType)
          .orderBy(sql`count(*) DESC`),
        DB_QUERY_TIMEOUT_MS,
        abortSignal
      );

      // Count facilities with coordinates for spatial queries
      const geoCount = await withTimeout(
        db
          .select({ count: sql<number>`count(*)` })
          .from(facilities)
          .where(and(isNotNull(facilities.lat), isNotNull(facilities.lng))),
        DB_QUERY_TIMEOUT_MS,
        abortSignal
      );

      log.step("Total count", total[0].count);

      const output = {
        totalFacilities: total[0].count,
        facilitiesByType: typeCounts,
        facilitiesWithCoordinates: geoCount[0].count,
        message:
          'For more specific breakdowns, specify groupBy="region", "type", or "specialty".',
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown stats error";
      log.error(error, { groupBy, limit }, Date.now() - start);
      return { error: `Stats failed: ${message}` };
    }
  },
});
