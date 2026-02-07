
import { db } from '../../db';
import { sql } from 'drizzle-orm';
import { tool } from 'ai';
import { z } from 'zod';

export const queryDatabase = tool({
  description: 'Execute a read-only SQL query against the facilities table. Use this for structured data questions (counts, aggregations, groupings).',
  parameters: z.object({
    query: z.string().describe('The SQL query to execute. MUST be a SELECT statement.'),
  }),
  execute: async ({ query }) => {
    try {
      // Security Check: Read-only
      const normalizedQuery = query.trim().toUpperCase();
      if (!normalizedQuery.startsWith('SELECT')) {
        return { error: 'Only SELECT queries are allowed.' };
      }
      if (normalizedQuery.includes('DROP') || normalizedQuery.includes('DELETE') || normalizedQuery.includes('UPDATE') || normalizedQuery.includes('INSERT') || normalizedQuery.includes('ALTER')) {
        return { error: 'Mutating queries are strictly forbidden.' };
      }

      console.log('Executing SQL:', query);
      // Drizzle raw SQL execution
      const result = await db.execute(sql.raw(query));
      
      return {
        rowCount: result.length,
        rows: result,
      };
    } catch (error) {
      console.error('queryDatabase error:', error);
      return { error: `Query failed: ${error instanceof Error ? error.message : String(error)}` };
    }
  },
});
