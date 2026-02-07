
import { z } from 'zod';
import { db } from '../../db';
import { facilities } from '../../db/schema.facilities';
import { sql } from 'drizzle-orm';
import { tool } from 'ai';
import { createToolLogger } from './debug';

export const getStats = tool({
  description: 'Get aggregated statistics about the facilities in Ghana. Use for overview questions like "How many hospitals are there?", "What are the top regions?".',
  parameters: z.object({
    groupBy: z.enum(['region', 'type', 'specialty']).optional().describe('Group results by region, facility type, or specialty'),
    limit: z.number().default(10),
  }),
  execute: async ({ groupBy, limit: rawLimit }: any) => {
    const limit = typeof rawLimit === 'number' && rawLimit > 0 ? rawLimit : 10;
    const log = createToolLogger('getStats');
    const start = Date.now();
    log.start({ groupBy, limit });

    try {
      if (groupBy === 'region') {
        log.step('Aggregating by region');
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
        log.step('Region stats returned', stats.length);
        const output = { stats };
        log.success(output, Date.now() - start);
        return output;
      }

      if (groupBy === 'type') {
        log.step('Aggregating by facility type');
        const stats = await db
          .select({
            type: facilities.facilityType,
            count: sql<number>`count(*)`,
          })
          .from(facilities)
          .groupBy(facilities.facilityType)
          .orderBy(sql`count(*) DESC`)
          .limit(limit);
        log.step('Type stats returned', stats.length);
        const output = { stats };
        log.success(output, Date.now() - start);
        return output;
      }

      // Default: Total counts
      log.step('Fetching total facility count');
      const total = await db.select({ count: sql<number>`count(*)` }).from(facilities);
      log.step('Total count', total[0].count);
      
      const output = {
        totalFacilities: total[0].count,
        message: 'For more specific breakdowns, please specify groupBy="region" or "type".'
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: any) {
      log.error(error, { groupBy, limit }, Date.now() - start);
      return { error: `Stats failed: ${error.message}` };
    }
  },
} as any);
