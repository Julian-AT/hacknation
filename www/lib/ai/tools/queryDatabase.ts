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

export const queryDatabase = tool({
  description:
    'Execute a read-only SQL SELECT query against the facilities table. Use for counts, aggregations, and structured filtering. Only the "facilities" table is available.',
  inputSchema: z.object({
    query: z
      .string()
      .max(2000)
      .describe(
        'The SQL SELECT query to execute. Must start with SELECT and query the "facilities" table.'
      ),
    reasoning: z
      .string()
      .describe("Explanation of why this query answers the user question."),
  }),
  execute: async ({ query, reasoning }, { abortSignal }) => {
    const log = createToolLogger("queryDatabase");
    const start = Date.now();
    log.start({ query, reasoning });

    // Validate SQL safety
    const validation = validateReadOnlySQL(query);
    if (!validation.valid) {
      log.step("SQL validation FAILED", validation.reason);
      return { error: `Query rejected: ${validation.reason}` };
    }

    log.step("SQL validation passed");

    try {
      log.step("Executing SQL query");
      const result = await withTimeout(
        db.execute(sql.raw(query)),
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
        query,
        count: totalCount,
        rows,
        truncated,
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown query error";
      log.error(error, { query, reasoning }, Date.now() - start);
      return { error: `Query failed: ${message}` };
    }
  },
});
