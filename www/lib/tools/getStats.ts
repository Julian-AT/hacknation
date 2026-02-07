
import { db } from '../../db';
import { facilities } from '../../db/schema';
import { count, eq, isNotNull, sql } from 'drizzle-orm';
import { tool } from 'ai';
import { z } from 'zod';

export const getStats = tool({
  description: 'Aggregate dashboard statistics and regional breakdowns (total facilities, capacity summary, regional distribution).',
  parameters: z.object({}),
  execute: async () => {
    try {
      // 1. Total Facilities
      const [total] = await db.select({ count: count() }).from(facilities);
      
      // 2. Regional Breakdown
      const regions = await db
        .select({
          region: facilities.addressRegion,
          count: count(),
        })
        .from(facilities)
        .groupBy(facilities.addressRegion)
        .orderBy(sql`count DESC`);

      // 3. Facility Type Breakdown
      const types = await db
        .select({
          type: facilities.facilityType,
          count: count(),
        })
        .from(facilities)
        .groupBy(facilities.facilityType)
        .orderBy(sql`count DESC`);
        
      // 4. Capacity Summary (Total Beds, Doctors)
      // Note: sum returns a string in pg, need to cast or parse
      const [capacity] = await db
        .select({
          totalBeds: sql<number>`SUM(${facilities.capacity})`,
          totalDoctors: sql<number>`SUM(${facilities.numDoctors})`,
          avgBeds: sql<number>`AVG(${facilities.capacity})`,
        })
        .from(facilities);

      return {
        totalFacilities: total.count,
        byRegion: regions,
        byType: types,
        capacity: {
          totalBeds: capacity.totalBeds || 0,
          totalDoctors: capacity.totalDoctors || 0,
          avgBedsPerFacility: Math.round(Number(capacity.avgBeds) || 0),
        },
      };
    } catch (error) {
      console.error('getStats error:', error);
      return { error: 'Failed to retrieve statistics.' };
    }
  },
});
