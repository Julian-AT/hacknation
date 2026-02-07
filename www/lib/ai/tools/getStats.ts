
import { z } from 'zod';
import { db } from '../../db';
import { facilities } from '../../db/schema.facilities';
import { sql } from 'drizzle-orm';
import { tool } from 'ai';

export const getStats = tool({
  description: 'Get aggregated statistics about the facilities in Ghana. Use for overview questions like "How many hospitals are there?", "What are the top regions?".',
  parameters: z.object({
    groupBy: z.enum(['region', 'type', 'specialty']).optional().describe('Group results by region, facility type, or specialty'),
    limit: z.number().default(10),
  }),
  execute: async ({ groupBy, limit }: any) => {
    try {
      if (groupBy === 'region') {
        const stats = await db
          .select({
            region: facilities.addressRegion,
            count: sql<number>`count(*)`,
            doctors: sql<number>`sum(${facilities.numDoctors})`,
            beds: sql<number>`sum(${facilities.capacity})`,
          })
          .from(facilities)
          .groupBy(facilities.addressRegion)
          .orderBy(sql`count(*) DESC`)
          .limit(limit);
        return { stats };
      }

      if (groupBy === 'type') {
        const stats = await db
          .select({
            type: facilities.facilityType,
            count: sql<number>`count(*)`,
          })
          .from(facilities)
          .groupBy(facilities.facilityType)
          .orderBy(sql`count(*) DESC`)
          .limit(limit);
        return { stats };
      }

      // Default: Total counts
      const total = await db.select({ count: sql<number>`count(*)` }).from(facilities);
      
      return {
        totalFacilities: total[0].count,
        message: 'For more specific breakdowns, please specify groupBy="region" or "type".'
      };

    } catch (error: any) {
      return { error: `Stats failed: ${error.message}` };
    }
  },
} as any);
