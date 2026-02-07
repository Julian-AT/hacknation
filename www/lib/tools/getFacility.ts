
import { db } from '../../db';
import { facilities } from '../../db/schema';
import { eq, ilike, or, sql } from 'drizzle-orm';
import { tool } from 'ai';
import { z } from 'zod';

export const getFacility = tool({
  description: 'Retrieve detailed profile for a specific facility by ID or name (fuzzy match). Returns all fields including parsed arrays and raw text.',
  parameters: z.object({
    id: z.number().optional().describe('Facility ID (preferred).'),
    name: z.string().optional().describe('Facility name (fuzzy search if ID not provided).'),
  }),
  execute: async ({ id, name }) => {
    try {
      if (id) {
        const result = await db
          .select()
          .from(facilities)
          .where(eq(facilities.id, id))
          .limit(1);
        
        return result[0] || { error: 'Facility not found by ID.' };
      }
      
      if (name) {
        // Simple ILIKE fuzzy match
        const result = await db
          .select()
          .from(facilities)
          .where(ilike(facilities.name, `%${name}%`))
          .limit(5); // Return up to 5 potential matches
          
        if (result.length === 0) return { error: 'No facility found with that name.' };
        if (result.length === 1) return result[0];
        
        // If multiple matches, return list of names/IDs for disambiguation
        return {
          multiple_matches: true,
          matches: result.map(f => ({ id: f.id, name: f.name, region: f.addressRegion, city: f.addressCity })),
          message: 'Multiple facilities found. Please specify ID or exact name.',
        };
      }
      
      return { error: 'Please provide either an ID or a name.' };
    } catch (error) {
      console.error('getFacility error:', error);
      return { error: 'Failed to retrieve facility details.' };
    }
  },
});
