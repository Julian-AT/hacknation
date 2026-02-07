import { z } from "zod";
import { db } from "../../db";
import { facilities } from "../../db/schema.facilities";
import { eq, ilike } from "drizzle-orm";
import { tool } from "ai";
import { createToolLogger } from "./debug";
import { withTimeout, DB_QUERY_TIMEOUT_MS } from "./safeguards";

export const getFacility = tool({
  description:
    "Get full details for a specific facility by ID or fuzzy name match. Use this when the user asks about a specific hospital.",
  inputSchema: z.object({
    id: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("The facility ID (preferred if known)"),
    name: z
      .string()
      .min(1)
      .max(200)
      .optional()
      .describe("The facility name to search for if ID is unknown"),
  }),
  execute: async ({ id, name }, { abortSignal }) => {
    const log = createToolLogger("getFacility");
    const start = Date.now();
    log.start({ id, name });

    if (!id && !name) {
      log.step("Validation failed: no id or name provided");
      return { error: "Must provide either facility ID or name." };
    }

    try {
      let result: (typeof facilities.$inferSelect)[] = [];

      if (id) {
        log.step("Lookup by ID", id);
        result = await withTimeout(
          db
            .select()
            .from(facilities)
            .where(eq(facilities.id, id))
            .limit(1),
          DB_QUERY_TIMEOUT_MS,
          abortSignal
        );
      } else if (name) {
        log.step("Fuzzy search by name", name);
        result = await withTimeout(
          db
            .select()
            .from(facilities)
            .where(ilike(facilities.name, `%${name}%`))
            .limit(5),
          DB_QUERY_TIMEOUT_MS,
          abortSignal
        );
      }

      log.step("Query returned matches", result.length);

      if (result.length === 0) {
        const output = { error: "Facility not found." };
        log.success(output, Date.now() - start);
        return output;
      }

      if (result.length > 1 && !id) {
        log.step(
          "Multiple matches found, returning candidates",
          result.length
        );
        const output = {
          message:
            "Multiple facilities found. Please specify ID or exact name.",
          candidates: result.map((f) => ({
            id: f.id,
            name: f.name,
            city: f.addressCity,
            region: f.addressRegion,
          })),
        };
        log.success(output, Date.now() - start);
        return output;
      }

      const facility = result[0];

      // Calculate data quality score
      const fields = [
        facility.numDoctors,
        facility.capacity,
        facility.proceduresRaw,
        facility.equipmentRaw,
        facility.email,
      ];
      const presentFields = fields.filter(
        (f: unknown) => f !== null && f !== ""
      ).length;
      const dataQuality = Math.round((presentFields / fields.length) * 100);

      log.step("Data quality score", `${dataQuality}%`);

      // Strip embedding vector to save tokens
      const { embedding: _, ...facilityWithoutEmbedding } = facility;

      const output = {
        facility: facilityWithoutEmbedding,
        dataQualityScore: `${dataQuality}%`,
        missingCriticalData:
          !facility.numDoctors && !facility.capacity
            ? "Missing Capacity Data"
            : null,
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown lookup error";
      log.error(error, { id, name }, Date.now() - start);
      return { error: `Lookup failed: ${message}` };
    }
  },
});
