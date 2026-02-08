import { tool } from "ai";
import { z } from "zod";
import type { ColumnDef } from "./schema-map";
import {
  DEMOGRAPHICS_BENCHMARKS_SCHEMA,
  DEMOGRAPHICS_COUNTRIES_SCHEMA,
  DEMOGRAPHICS_REGIONS_SCHEMA,
  FACILITIES_SCHEMA,
} from "./schema-map";

const TABLE_SCHEMAS: Record<string, ColumnDef[]> = {
  facilities: FACILITIES_SCHEMA,
  demographics_countries: DEMOGRAPHICS_COUNTRIES_SCHEMA,
  demographics_regions: DEMOGRAPHICS_REGIONS_SCHEMA,
  demographics_benchmarks: DEMOGRAPHICS_BENCHMARKS_SCHEMA,
};

const AVAILABLE_TABLES = Object.keys(TABLE_SCHEMAS);

/**
 * Schema discovery tool — returns table structures for facilities and
 * demographics tables. Gives the LLM a reliable way to discover column
 * names, types, and descriptions without needing information_schema access.
 *
 * Use when:
 * - A query fails with "column does not exist"
 * - The LLM is unsure about column names
 * - Building a complex query and needs to verify available columns
 */
export const getSchema = tool({
  description:
    "Retrieve the database schema for any table (facilities, demographics_countries, demographics_regions, demographics_benchmarks). Returns column names, data types, and descriptions. Use before writing SQL if unsure about column names, or after a 'column does not exist' error. All column names use snake_case.",
  inputSchema: z.object({
    table: z
      .enum([
        "facilities",
        "demographics_countries",
        "demographics_regions",
        "demographics_benchmarks",
      ])
      .default("facilities")
      .describe(
        "Table to get schema for. Options: facilities, demographics_countries, demographics_regions, demographics_benchmarks"
      ),
    filter: z
      .string()
      .max(100)
      .optional()
      .describe(
        'Optional keyword to filter columns (e.g. "address", "mortality", "doctors"). Returns all columns if omitted.'
      ),
  }),
  execute: ({ table, filter }) => {
    const schema = TABLE_SCHEMAS[table];

    if (!schema) {
      return {
        error: `Table "${table}" not found. Available: ${AVAILABLE_TABLES.join(", ")}`,
      };
    }

    let columns = schema;

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
      table,
      availableTables: AVAILABLE_TABLES,
      totalColumns: schema.length,
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
