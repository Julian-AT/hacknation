
import { z } from 'zod';
import { db } from '../../db';
import { sql, gt, desc, cosineDistance, and, isNotNull, ilike, eq } from 'drizzle-orm';
import { facilities } from '../../db/schema.facilities';
import { embed } from '../../embed';
import { tool } from 'ai';

export const searchFacilities = tool({
  description: 'Semantic search for facilities using vector embeddings. Use when the user asks for facilities based on free-text descriptions like "eye surgery", "trauma center", "dialysis", where keywords might not be exact.',
  parameters: z.object({
    query: z.string().describe('The search query (e.g., "ophthalmology", "kidney dialysis center")'),
    region: z.string().optional().describe('Filter by region name if specified'),
    facilityType: z.string().optional().describe('Filter by facility type (Hospital, Clinic, etc.)'),
    limit: z.number().optional().default(10),
  }),
  execute: async ({ query, region, facilityType, limit }: any) => {
    try {
      const queryEmbedding = await embed(query);
      const similarity = sql<number>`1 - (${cosineDistance(facilities.embedding, queryEmbedding)})`;
      
      let baseQuery = db
        .select({
          id: facilities.id,
          name: facilities.name,
          region: facilities.addressRegion,
          type: facilities.facilityType,
          similarity: similarity,
          description: facilities.description,
          specialties: facilities.specialtiesRaw,
          procedures: facilities.proceduresRaw,
        })
        .from(facilities)
        .where(isNotNull(facilities.embedding))
        .orderBy(desc(similarity))
        .limit(limit);

      if (region) {
        // Simple case-insensitive match for region
        // Note: Drizzle's `ilike` is useful here.
        // But since baseQuery is a chain, we need to construct the where clause dynamically
        // Drizzle query builder allows chaining .where().
        // However, mixing similarity sort with where requires careful construction if not using query builder API fully.
        // Let's use the $dynamic API or just simple where chaining.
        
        // Actually, with `cosineDistance` in `orderBy`, we need to ensure the WHERE clause is applied.
        // Drizzle's `.where()` appends AND.
        
        // We'll reimplement using query builder pattern more cleanly:
        const conditions = [isNotNull(facilities.embedding)];
        
        if (region) conditions.push(ilike(facilities.addressRegion, `%${region}%`));
        if (facilityType) conditions.push(ilike(facilities.facilityType, `%${facilityType}%`));
        
        // Threshold for relevance? Usually handled by limit, but let's keep it simple.
        
        const results = await db
          .select({
            id: facilities.id,
            name: facilities.name,
            region: facilities.addressRegion,
            type: facilities.facilityType,
            similarity: similarity,
            description: facilities.description,
            // Return snippets of text fields for context
            procedures: facilities.proceduresRaw,
          })
          .from(facilities)
          .where(and(...conditions))
          .orderBy(desc(similarity))
          .limit(limit);
          
        return {
          query,
          results: results.map(r => ({
            ...r,
            matchConfidence: r.similarity > 0.8 ? 'High' : r.similarity > 0.7 ? 'Medium' : 'Low'
          }))
        };
      }
      
      // If no filters, run the basic query (logic repeated because of 'let' vs const issue in TS if not structured well)
      // I'll refactor slightly to be cleaner.
      const conditions = [isNotNull(facilities.embedding)];
      if (region) conditions.push(ilike(facilities.addressRegion, `%${region}%`));
      if (facilityType) conditions.push(ilike(facilities.facilityType, `%${facilityType}%`));

      const results = await db
        .select({
          id: facilities.id,
          name: facilities.name,
          region: facilities.addressRegion,
          city: facilities.addressCity,
          type: facilities.facilityType,
          similarity: similarity,
          procedures: facilities.proceduresRaw,
          equipment: facilities.equipmentRaw,
        })
        .from(facilities)
        .where(and(...conditions))
        .orderBy(desc(similarity))
        .limit(limit);

      return {
        query,
        count: results.length,
        results: results
      };

    } catch (error: any) {
      return { error: `Search failed: ${error.message}` };
    }
  },
} as any);
