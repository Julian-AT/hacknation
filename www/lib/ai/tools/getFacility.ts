
import { z } from 'zod';
import { db } from '../../db';
import { facilities } from '../../db/schema.facilities';
import { eq, ilike, or } from 'drizzle-orm';
import { tool } from 'ai';

export const getFacility = tool({
  description: 'Get full details for a specific facility by ID or fuzzy name match. Use this when the user asks about a specific hospital.',
  parameters: z.object({
    id: z.number().optional().describe('The facility ID (preferred if known)'),
    name: z.string().optional().describe('The facility name to search for if ID is unknown'),
  }),
  execute: async ({ id, name }: any) => {
    if (!id && !name) {
      return { error: 'Must provide either facility ID or name.' };
    }

    try {
      let result: any[] = [];
      
      if (id) {
        result = await db
          .select()
          .from(facilities)
          .where(eq(facilities.id, id))
          .limit(1);
      } else if (name) {
        // Fuzzy search by name
        result = await db
          .select()
          .from(facilities)
          .where(ilike(facilities.name, `%${name}%`))
          .limit(5); // Return up to 5 if ambiguous
      }

      if (!result || result.length === 0) {
        return { error: 'Facility not found.' };
      }

      if (result.length > 1 && !id) {
        return {
          message: 'Multiple facilities found. Please specify ID or exact name.',
          candidates: result.map(f => ({ id: f.id, name: f.name, city: f.addressCity, region: f.addressRegion }))
        };
      }

      const facility = result[0];
      
      // Calculate data quality score
      const fields = [facility.numDoctors, facility.capacity, facility.proceduresRaw, facility.equipmentRaw, facility.email];
      const presentFields = fields.filter(f => f !== null && f !== '').length;
      const dataQuality = Math.round((presentFields / fields.length) * 100);

      return {
        facility: {
          ...facility,
          embedding: undefined, // Hide vector data
        },
        dataQualityScore: `${dataQuality}%`,
        missingCriticalData: !facility.numDoctors && !facility.capacity ? 'Missing Capacity Data' : null
      };

    } catch (error: any) {
      return { error: `Lookup failed: ${error.message}` };
    }
  },
} as any);
