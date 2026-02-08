import { z } from "zod";
import { db } from "../../db";
import { facilities } from "../../db/schema.facilities";
import { sql, and, ilike, isNotNull } from "drizzle-orm";
import { tool } from "ai";
import { createToolLogger } from "./debug";
import { withTimeout, DB_QUERY_TIMEOUT_MS } from "./safeguards";

export const compareRegions = tool({
  description:
    "Compare healthcare metrics between two or more regions. Provides side-by-side statistics including facility counts, capacity, specialties, and coverage gaps.",
  inputSchema: z.object({
    regions: z
      .array(z.string().max(100))
      .min(2)
      .max(5)
      .describe("List of region names to compare (2-5 regions)"),
    metric: z
      .enum([
        "facilities",
        "capacity",
        "specialties",
        "procedures",
        "all",
      ])
      .default("all")
      .describe("Specific metric to compare, or 'all' for full comparison"),
    specialtyFilter: z
      .string()
      .max(200)
      .optional()
      .describe("Filter comparison by a specific specialty or procedure"),
  }),
  execute: async ({ regions, metric, specialtyFilter }, { abortSignal }) => {
    const log = createToolLogger("compareRegions");
    const start = Date.now();
    log.start({ regions, metric, specialtyFilter });

    try {
      const comparison: Array<{
        region: string;
        totalFacilities: number;
        hospitals: number;
        clinics: number;
        totalBeds: number | null;
        totalDoctors: number | null;
        topSpecialties: string[];
        matchingFacilities?: number;
      }> = [];

      for (const region of regions) {
        if (abortSignal?.aborted) {
          return { error: "Operation was aborted" };
        }

        log.step("Analyzing region", region);
        const regionCondition = ilike(facilities.addressRegion, `%${region}%`);

        // Basic counts
        const [stats] = await withTimeout(
          db
            .select({
              total: sql<number>`count(*)`,
              hospitals: sql<number>`count(*) FILTER (WHERE lower(${facilities.facilityType}) LIKE '%hospital%')`,
              clinics: sql<number>`count(*) FILTER (WHERE lower(${facilities.facilityType}) LIKE '%clinic%')`,
              totalBeds: sql<number>`sum(${facilities.capacity})`,
              totalDoctors: sql<number>`sum(${facilities.numDoctors})`,
            })
            .from(facilities)
            .where(regionCondition),
          DB_QUERY_TIMEOUT_MS,
          abortSignal
        );

        // Top specialties
        const specialtiesResult = await withTimeout(
          db.execute(
            sql`SELECT unnest(specialties) AS specialty, count(*) AS cnt
                FROM facilities
                WHERE ${regionCondition} AND specialties IS NOT NULL
                GROUP BY specialty
                ORDER BY cnt DESC
                LIMIT 5`
          ),
          DB_QUERY_TIMEOUT_MS,
          abortSignal
        );

        const topSpecialties = Array.isArray(specialtiesResult)
          ? specialtiesResult.map(
              (r: Record<string, unknown>) => String(r.specialty)
            )
          : [];

        const entry: (typeof comparison)[number] = {
          region,
          totalFacilities: Number(stats.total),
          hospitals: Number(stats.hospitals),
          clinics: Number(stats.clinics),
          totalBeds: stats.totalBeds ? Number(stats.totalBeds) : null,
          totalDoctors: stats.totalDoctors
            ? Number(stats.totalDoctors)
            : null,
          topSpecialties,
        };

        // Optional specialty filter count
        if (specialtyFilter) {
          const [filterResult] = await withTimeout(
            db
              .select({ count: sql<number>`count(*)` })
              .from(facilities)
              .where(
                and(
                  regionCondition,
                  ilike(facilities.proceduresRaw, `%${specialtyFilter}%`)
                )
              ),
            DB_QUERY_TIMEOUT_MS,
            abortSignal
          );
          entry.matchingFacilities = Number(filterResult.count);
        }

        comparison.push(entry);
      }

      // Identify gaps
      const gaps: string[] = [];
      const maxFacilities = Math.max(
        ...comparison.map((c) => c.totalFacilities)
      );
      const minFacilities = Math.min(
        ...comparison.map((c) => c.totalFacilities)
      );

      if (maxFacilities > 0 && minFacilities > 0) {
        const ratio = maxFacilities / minFacilities;
        if (ratio > 3) {
          const highest = comparison.find(
            (c) => c.totalFacilities === maxFacilities
          );
          const lowest = comparison.find(
            (c) => c.totalFacilities === minFacilities
          );
          gaps.push(
            `${highest?.region} has ${ratio.toFixed(1)}x more facilities than ${lowest?.region}`
          );
        }
      }

      if (specialtyFilter) {
        const withFilter = comparison.filter(
          (c) => (c.matchingFacilities ?? 0) === 0
        );
        for (const c of withFilter) {
          gaps.push(
            `${c.region} has 0 facilities matching "${specialtyFilter}"`
          );
        }
      }

      const output = {
        comparison,
        gaps,
        specialtyFilter: specialtyFilter ?? null,
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown comparison error";
      log.error(error, { regions, metric, specialtyFilter }, Date.now() - start);
      return { error: `Region comparison failed: ${message}` };
    }
  },
});
