import { tool } from "ai";
import { and, cosineDistance, desc, ilike, isNotNull, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { facilities } from "../../db/schema.facilities";
import { embed } from "../../embed";
import { computeAnomalyConfidence } from "./computeAnomalyConfidence";
import { createToolLogger } from "./debug";
import {
  clampNumber,
  DB_QUERY_TIMEOUT_MS,
  MAX_SEARCH_ROWS,
  withTimeout,
} from "./safeguards";

export const searchFacilities = tool({
  description:
    "Semantic search for facilities using vector embeddings. Use when the user asks for facilities based on free-text descriptions like 'eye surgery', 'trauma center', 'dialysis', where keywords might not be exact.",
  inputSchema: z.object({
    query: z
      .string()
      .min(1)
      .max(500)
      .describe(
        'The search query (e.g., "ophthalmology", "kidney dialysis center")'
      ),
    region: z
      .string()
      .max(100)
      .optional()
      .describe("Filter by region name if specified"),
    facilityType: z
      .string()
      .max(100)
      .optional()
      .describe("Filter by facility type (Hospital, Clinic, etc.)"),
    limit: z.number().min(1).max(50).default(10),
  }),
  execute: async (
    { query, region, facilityType, limit: rawLimit },
    { abortSignal }
  ) => {
    const limit = clampNumber(rawLimit, 1, MAX_SEARCH_ROWS, 10);
    const log = createToolLogger("searchFacilities");
    const start = Date.now();
    log.start({ query, region, facilityType, limit });

    try {
      log.step("Generating embedding for query", query);
      const queryEmbedding = await withTimeout(
        embed(query),
        10_000,
        abortSignal
      );
      log.step("Embedding generated", `${queryEmbedding.length} dimensions`);

      const similarity = sql<number>`1 - (${cosineDistance(facilities.embedding, queryEmbedding)})`;

      const conditions = [isNotNull(facilities.embedding)];
      if (region) {
        conditions.push(ilike(facilities.addressRegion, `%${region}%`));
        log.step("Filter added: region", region);
      }
      if (facilityType) {
        conditions.push(ilike(facilities.facilityType, `%${facilityType}%`));
        log.step("Filter added: facilityType", facilityType);
      }

      log.step("Executing vector search query");
      const rows = await withTimeout(
        db
          .select({
            id: facilities.id,
            name: facilities.name,
            region: facilities.addressRegion,
            city: facilities.addressCity,
            type: facilities.facilityType,
            lat: facilities.lat,
            lng: facilities.lng,
            similarity,
            procedures: facilities.proceduresRaw,
            equipment: facilities.equipmentRaw,
            // Extra fields for confidence scoring
            capacity: facilities.capacity,
            numDoctors: facilities.numDoctors,
            specialtiesRaw: facilities.specialtiesRaw,
            proceduresArr: facilities.procedures,
          })
          .from(facilities)
          .where(and(...conditions))
          .orderBy(desc(similarity))
          .limit(limit),
        DB_QUERY_TIMEOUT_MS,
        abortSignal
      );

      log.step("Query returned results", rows.length);

      // Enrich each result with a lightweight confidence assessment
      const results = rows.map((row) => {
        const confidence = computeAnomalyConfidence({
          facilityType: row.type,
          capacity: row.capacity,
          numDoctors: row.numDoctors,
          specialtiesRaw: row.specialtiesRaw,
          proceduresRaw: row.procedures,
          equipmentRaw: row.equipment,
          procedures: row.proceduresArr,
        });
        return {
          id: row.id,
          name: row.name,
          region: row.region,
          city: row.city,
          type: row.type,
          lat: row.lat,
          lng: row.lng,
          similarity: row.similarity,
          procedures: row.procedures,
          equipment: row.equipment,
          confidence: {
            level: confidence.level,
            score: confidence.score,
            flagCount: confidence.flags.length,
          },
        };
      });

      const output = {
        query,
        count: results.length,
        results,
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown search error";
      log.error(
        error,
        { query, region, facilityType, limit },
        Date.now() - start
      );
      return { error: `Search failed: ${message}` };
    }
  },
});
