
import { z } from 'zod';
import { db } from '../../db';
import { sql } from 'drizzle-orm';
import { tool } from 'ai';

export const queryDatabase = tool({
  description: 'Execute a read-only SQL query against the facilities table. Use for counts, aggregations, and structured filtering.',
  parameters: z.object({
    query: z.string().describe('The SQL SELECT query to execute. Must start with SELECT and query the "facilities" table.'),
    reasoning: z.string().describe('Explanation of why this query answers the user question.'),
  }),
  execute: async ({ query }: any) => {
    // Safety check: only allow SELECT
    const normalizedQuery = query.trim().toUpperCase();
    if (!normalizedQuery.startsWith('SELECT')) {
      return { error: 'Only SELECT queries are allowed.' };
    }
    
    // Prevent destructive commands
    if (normalizedQuery.includes('DROP') || normalizedQuery.includes('DELETE') || normalizedQuery.includes('UPDATE') || normalizedQuery.includes('INSERT') || normalizedQuery.includes('ALTER')) {
      return { error: 'Destructive queries are not allowed.' };
    }

    try {
      const result = await db.execute(sql.raw(query));
      return {
        query,
        count: result.length,
        rows: result.slice(0, 100), // Limit to 100 rows to prevent context overflow
        truncated: result.length > 100,
      };
    } catch (error: any) {
      return { error: `Query failed: ${error.message}` };
    }
  },
} as any);
