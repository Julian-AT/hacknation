import { z } from "zod";
import { db } from "../../db";
import { sql } from "drizzle-orm";
import { tool } from "ai";
import { createToolLogger } from "./debug";
import {
  validateReadOnlySQL,
  withTimeout,
  truncateResults,
  DB_QUERY_TIMEOUT_MS,
  MAX_RESULT_ROWS,
} from "./safeguards";
import { FACILITIES_COLUMN_MAP, FACILITIES_COLUMNS_HINT } from "./schema-map";

/**
 * Auto-correct camelCase column names to snake_case before SQL execution.
 * This is a safety net for when the LLM uses Drizzle-style camelCase names
 * (e.g. facilityType) instead of the actual PostgreSQL column names (facility_type).
 */
function normalizeColumnNames(query: string): { normalized: string; corrected: boolean } {
  let normalized = query;
  let corrected = false;

  for (const [camel, snake] of Object.entries(FACILITIES_COLUMN_MAP)) {
    // Match camelCase identifiers as whole words
    const pattern = new RegExp(`\\b${camel}\\b`, "g");
    const replaced = normalized.replace(pattern, snake);
    if (replaced !== normalized) {
      normalized = replaced;
      corrected = true;
    }
  }

  return { normalized, corrected };
}

/**
 * Detect "column does not exist" errors and return a helpful message
 * with the correct column names so the LLM can self-correct.
 */
function enhanceColumnError(message: string): string {
  if (message.includes("does not exist")) {
    return `${message}. Use snake_case column names. ${FACILITIES_COLUMNS_HINT}`;
  }
  return message;
}

export const queryDatabase = tool({
  description:
    'Execute a read-only SQL SELECT query against the facilities table. Use for counts, aggregations, and structured filtering. Only the "facilities" table is available. IMPORTANT: Use snake_case column names (e.g. facility_type, address_region, num_doctors).',
  inputSchema: z.object({
    query: z
      .string()
      .max(2000)
      .describe(
        'The SQL SELECT query to execute. Must start with SELECT and query the "facilities" table. Use snake_case column names (e.g. facility_type NOT facilityType).'
      ),
    reasoning: z
      .string()
      .describe("Explanation of why this query answers the user question."),
  }),
  execute: async ({ query, reasoning }, { abortSignal }) => {
    const log = createToolLogger("queryDatabase");
    const start = Date.now();
    log.start({ query, reasoning });

    // Auto-correct camelCase column names to snake_case
    const { normalized: correctedQuery, corrected } = normalizeColumnNames(query);
    if (corrected) {
      log.step("Column names auto-corrected from camelCase to snake_case");
    }

    // Validate SQL safety
    const validation = validateReadOnlySQL(correctedQuery);
    if (!validation.valid) {
      log.step("SQL validation FAILED", validation.reason);
      return { error: `Query rejected: ${validation.reason}` };
    }

    log.step("SQL validation passed");

    try {
      log.step("Executing SQL query");
      const result = await withTimeout(
        db.execute(sql.raw(correctedQuery)),
        DB_QUERY_TIMEOUT_MS,
        abortSignal
      );

      const rawRows = Array.isArray(result) ? result : [];
      log.step("Query returned rows", rawRows.length);

      const { rows, truncated, totalCount } = truncateResults(
        rawRows,
        MAX_RESULT_ROWS
      );

      const output = {
        query: correctedQuery,
        count: totalCount,
        rows,
        truncated,
        ...(corrected ? { note: "Column names were auto-corrected from camelCase to snake_case." } : {}),
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown query error";
      log.error(error, { query: correctedQuery, reasoning }, Date.now() - start);
      return { error: `Query failed: ${enhanceColumnError(message)}` };
    }
  },
});
