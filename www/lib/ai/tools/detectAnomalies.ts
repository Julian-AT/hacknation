
import { z } from 'zod';
import { db } from '../../db';
import { facilities } from '../../db/schema.facilities';
import { sql, isNotNull, and, not, ilike } from 'drizzle-orm';
import { tool } from 'ai';

export const detectAnomalies = tool({
  description: 'Identify potential data inconsistencies or suspicious facility claims. Checks for infrastructure mismatches (e.g., major surgery claims with no beds).',
  parameters: z.object({
    region: z.string().optional().describe('Limit detection to a specific region'),
    type: z.enum(['infrastructure_mismatch', 'missing_critical_data', 'unlikely_capacity']).optional(),
  }),
  execute: async ({ region, type }: any) => {
    try {
      const anomalies: any[] = [];
      const conditions = [isNotNull(facilities.id)];
      
      if (region) {
        conditions.push(ilike(facilities.addressRegion, `%${region}%`));
      }

      // 1. Infrastructure Mismatch: Claims surgery but < 5 beds
      // (Assuming 'surgery' keyword in procedures implies inpatient need)
      if (!type || type === 'infrastructure_mismatch') {
        const surgicalMismatch = await db
          .select({
            id: facilities.id,
            name: facilities.name,
            beds: facilities.capacity,
            procedures: facilities.proceduresRaw,
          })
          .from(facilities)
          .where(and(
            ...conditions,
            ilike(facilities.proceduresRaw, '%surgery%'),
            sql`${facilities.capacity} < 5` // Allow nulls (captured below), but if explicitly < 5 it's weird
          ))
          .limit(10);
        
        if (surgicalMismatch.length > 0) {
          anomalies.push({
            type: 'Surgical Capability vs Bed Capacity Mismatch',
            description: 'Facilities claiming surgical capabilities but listing fewer than 5 beds.',
            facilities: surgicalMismatch
          });
        }
      }

      // 2. Missing Critical Data: Hospitals with no doctors listed
      if (!type || type === 'missing_critical_data') {
        const ghostHospitals = await db
          .select({
            id: facilities.id,
            name: facilities.name,
            type: facilities.facilityType,
          })
          .from(facilities)
          .where(and(
            ...conditions,
            ilike(facilities.facilityType, '%Hospital%'),
            sql`${facilities.numDoctors} IS NULL`
          ))
          .limit(10);

        if (ghostHospitals.length > 0) {
          anomalies.push({
            type: 'Missing Doctor Count',
            description: 'Facilities identified as Hospitals but missing doctor count data.',
            facilities: ghostHospitals
          });
        }
      }

      return {
        region: region || 'All Ghana',
        foundAnomalies: anomalies.length,
        details: anomalies
      };

    } catch (error: any) {
      return { error: `Anomaly detection failed: ${error.message}` };
    }
  },
} as any);
