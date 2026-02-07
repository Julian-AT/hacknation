
import { z } from 'zod';
import { db } from '../../db';
import { sql } from 'drizzle-orm';
import { tool } from 'ai';
import { createToolLogger } from './debug';

export const queryDatabase = tool({
  description: 'Execute a read-only SQL query against the facilities table. Use for counts, aggregations, and structured filtering.',
  parameters: z.object({
    query: z.string().describe('The SQL SELECT query to execute. Must start with SELECT and query the "facilities" table.'),
    reasoning: z.string().describe('Explanation of why this query answers the user question.'),
  }),
  execute: async ({ query, reasoning }: any) => {
    const log = createToolLogger('queryDatabase');
    const start = Date.now();
    log.start({ query, reasoning });

    // Safety check: only allow SELECT
    const normalizedQuery = query.trim().toUpperCase();
    if (!normalizedQuery.startsWith('SELECT')) {
      log.step('Safety check FAILED', 'Query does not start with SELECT');
      const result = { error: 'Only SELECT queries are allowed.' };
      log.success(result, Date.now() - start);
      return result;
    }
    
    // Prevent destructive commands
    const destructiveKeywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER'];
    const foundDestructive = destructiveKeywords.find(kw => normalizedQuery.includes(kw));
    if (foundDestructive) {
      log.step('Safety check FAILED', `Found destructive keyword: ${foundDestructive}`);
      const result = { error: 'Destructive queries are not allowed.' };
      log.success(result, Date.now() - start);
      return result;
    }

    log.step('Safety checks passed');

    try {
      log.step('Executing SQL query');
      const result = await db.execute(sql.raw(query));
      log.step('Query returned rows', result.length);

      const output = {
        query,
        count: result.length,
        rows: result.slice(0, 100),
        truncated: result.length > 100,
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: any) {
      log.error(error, { query, reasoning }, Date.now() - start);
      return { error: `Query failed: ${error.message}` };
    }
  },
} as any);
