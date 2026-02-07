
import { db } from '../../db';
import { facilities } from '../../db/schema';
import { embed } from '../embed';
import { cosineDistance, desc, gt, sql, and, eq, like } from 'drizzle-orm';
import { tool } from 'ai';
import { z } from 'zod';

export const searchFacilities = tool({
  description: 'Semantic search over free-text fields (procedures, equipment, capabilities). Use this to find facilities based on meaning, not just keywords.',
  parameters: z.object({
    query: z.string().describe('The search query (e.g., "eye surgery", "MRI machine", "trauma center").'),
    region: z.string().optional().describe('Optional filter by region name.'),
    facilityType: z.string().optional().describe('Optional filter by facility type (hospital, clinic, etc.).'),
    limit: z.number().default(5).describe('Number of results to return (default 5).'),
  }),
  execute: async ({ query, region, facilityType, limit = 5 }) => {
    try {
      const queryEmbedding = await embed(query);
      
      const similarity = sql<number>`1 - (${cosineDistance(facilities.embedding, queryEmbedding)})`;
      
      const results = await db
        .select({
          id: facilities.id,
          name: facilities.name,
          region: facilities.addressRegion,
          type: facilities.facilityType,
          similarity: similarity,
          procedures: facilities.proceduresRaw,
          equipment: facilities.equipmentRaw,
          capabilities: facilities.capabilitiesRaw,
          description: facilities.description,
        })
        .from(facilities)
        .where(and(
          gt(similarity, 0.5), // Similarity threshold
          region ? eq(facilities.addressRegion, region) : undefined,
          facilityType ? like(facilities.facilityType, `%${facilityType}%`) : undefined
        ))
        .orderBy(desc(similarity))
        .limit(limit);

      return results;
    } catch (error) {
      console.error('searchFacilities error:', error);
      return { error: 'Failed to search facilities.' };
    }
  },
});
