import { z } from "zod";
import { tool } from "ai";
import { FACILITIES_SCHEMA } from "./schema-map";

/**
 * Schema discovery tool — returns the facilities table structure.
 * Gives the LLM a reliable way to discover column names, types, and
 * descriptions without needing information_schema access.
 *
 * Use when:
 * - A query fails with "column does not exist"
 * - The LLM is unsure about column names
 * - Building a complex query and needs to verify available columns
 */
export const getSchema = tool({
  description:
    "Retrieve the full database schema for the facilities table, including all column names, data types, and descriptions. Use this tool before writing SQL if you are unsure about column names, or after a query fails with a 'column does not exist' error. All column names use snake_case.",
  inputSchema: z.object({
    filter: z
      .string()
      .max(100)
      .optional()
      .describe(
        'Optional keyword to filter columns (e.g. "address", "type", "raw"). Returns all columns if omitted.'
      ),
  }),
  execute: async ({ filter }) => {
    let columns = FACILITIES_SCHEMA;

    if (filter) {
      const lower = filter.toLowerCase();
      columns = columns.filter(
        (col) =>
          col.column.includes(lower) ||
          col.type.includes(lower) ||
          col.description.toLowerCase().includes(lower)
      );
    }

    return {
      table: "facilities",
      totalColumns: FACILITIES_SCHEMA.length,
      matchedColumns: columns.length,
      columns: columns.map((c) => ({
        name: c.column,
        type: c.type,
        description: c.description,
      })),
      note: "All column names use snake_case in PostgreSQL. Do NOT use camelCase in SQL queries.",
    };
  },
});
