
import { z } from 'zod';
import { db } from '../../db';
import { sql, desc, cosineDistance, and, isNotNull, ilike } from 'drizzle-orm';
import { facilities } from '../../db/schema.facilities';
import { embed } from '../../embed';
import { tool } from 'ai';
import { createToolLogger } from './debug';

export const searchFacilities = tool({
  description: 'Semantic search for facilities using vector embeddings. Use when the user asks for facilities based on free-text descriptions like "eye surgery", "trauma center", "dialysis", where keywords might not be exact.',
  parameters: z.object({
    query: z.string().describe('The search query (e.g., "ophthalmology", "kidney dialysis center")'),
    region: z.string().optional().describe('Filter by region name if specified'),
    facilityType: z.string().optional().describe('Filter by facility type (Hospital, Clinic, etc.)'),
    limit: z.number().optional().default(10),
  }),
  execute: async ({ query, region, facilityType, limit: rawLimit }: any) => {
    const limit = typeof rawLimit === 'number' && rawLimit > 0 ? rawLimit : 10;
    const log = createToolLogger('searchFacilities');
    const start = Date.now();
    log.start({ query, region, facilityType, limit });

    try {
      log.step('Generating embedding for query', query);
      const queryEmbedding = await embed(query);
      log.step('Embedding generated', `${queryEmbedding.length} dimensions`);

      const similarity = sql<number>`1 - (${cosineDistance(facilities.embedding, queryEmbedding)})`;

      const conditions = [isNotNull(facilities.embedding)];
      if (region) {
        conditions.push(ilike(facilities.addressRegion, `%${region}%`));
        log.step('Filter added: region', region);
      }
      if (facilityType) {
        conditions.push(ilike(facilities.facilityType, `%${facilityType}%`));
        log.step('Filter added: facilityType', facilityType);
      }

      log.step('Executing vector search query');
      const results = await db
        .select({
          id: facilities.id,
          name: facilities.name,
          region: facilities.addressRegion,
          city: facilities.addressCity,
          type: facilities.facilityType,
          similarity,
          procedures: facilities.proceduresRaw,
          equipment: facilities.equipmentRaw,
        })
        .from(facilities)
        .where(and(...conditions))
        .orderBy(desc(similarity))
        .limit(limit);

      log.step('Query returned results', results.length);

      const output = {
        query,
        count: results.length,
        results,
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: any) {
      log.error(error, { query, region, facilityType, limit }, Date.now() - start);
      return { error: `Search failed: ${error.message}` };
    }
  },
} as any);
