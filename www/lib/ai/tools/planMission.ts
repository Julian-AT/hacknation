
import { z } from 'zod';
import { tool } from 'ai';
import { findMedicalDeserts } from './findMedicalDeserts';
import { findNearby } from './findNearby';
import { createToolLogger } from './debug';

export const planMission = tool({
  description: 'Interactive volunteer deployment planner. Recommends facilities for a volunteer based on their specialty and Ghana\'s needs.',
  parameters: z.object({
    specialty: z.string().describe('Volunteer medical specialty (e.g., "Ophthalmologist")'),
    duration: z.string().optional().describe('Available duration (e.g., "2 weeks")'),
    preference: z.string().optional().describe('Regional or facility type preference'),
  }),
  execute: async ({ specialty, duration, preference }: any, { toolCallId, messages }: any) => {
    const log = createToolLogger('planMission');
    const start = Date.now();
    log.start({ specialty, duration, preference });

    try {
      log.step('Calling findMedicalDeserts sub-tool', { service: specialty, thresholdKm: 50 });
      const desertAnalysis = await (findMedicalDeserts as any).execute(
        { service: specialty, thresholdKm: 50 },
        { toolCallId, messages }
      );
      log.step('findMedicalDeserts returned', {
        hasDesertZones: 'desertZones' in desertAnalysis,
        status: 'status' in desertAnalysis ? desertAnalysis.status : undefined,
        totalProviders: 'totalProviders' in desertAnalysis ? desertAnalysis.totalProviders : 0,
      });
      
      const recommendations: any[] = [];
      
      if ('desertZones' in desertAnalysis && Array.isArray(desertAnalysis.desertZones) && desertAnalysis.desertZones.length > 0) {
        const topDesert = desertAnalysis.desertZones[0];
        log.step('Top desert zone', { city: topDesert.city, distanceKm: topDesert.distanceKm });
        
        log.step('Calling findNearby sub-tool for host facilities');
        const potentialHosts = await (findNearby as any).execute(
          {
             location: `${topDesert.coordinates.lat},${topDesert.coordinates.lng}`,
             radiusKm: 50,
             facilityType: 'Hospital',
             limit: 3
          },
          { toolCallId, messages }
        );
        log.step('findNearby returned', {
          hasFacilities: 'facilities' in potentialHosts,
          count: 'facilities' in potentialHosts ? potentialHosts.facilities?.length : 0,
        });

        if ('facilities' in potentialHosts && Array.isArray(potentialHosts.facilities) && potentialHosts.facilities.length > 0) {
           recommendations.push({
             priority: 'High - Critical Gap',
             region: `${topDesert.city} Area`,
             reason: `This area is a medical desert for ${specialty} (nearest is ${topDesert.distanceKm}km away).`,
             suggestedHost: potentialHosts.facilities[0]
           });
        } else {
           recommendations.push({
             priority: 'High - Critical Gap (Infrastructure Limited)',
             region: `${topDesert.city} Area`,
             reason: `This area is a severe medical desert (${topDesert.distanceKm}km gap) but lacks major hospitals. Consider mobile clinic deployment.`,
             suggestedLocation: topDesert.city
           });
        }
      } else if ('status' in desertAnalysis && desertAnalysis.status === 'NATIONAL_GAP') {
         log.step('National gap detected for specialty', specialty);
         recommendations.push({
           priority: 'Critical - National Gap',
           region: 'Accra / Kumasi (Teaching Hospitals)',
           reason: `No facilities in Ghana explicitly list ${specialty}. Recommend starting at a major teaching hospital to build capacity.`,
           suggestedHost: { name: 'Korle Bu or Komfo Anokye Teaching Hospital' }
         });
      }

      if (recommendations.length === 0) {
         log.step('No specific gaps found, using fallback recommendation');
         recommendations.push({
           priority: 'Medium - Rural Support',
           region: 'Northern Region',
           reason: 'General need for specialists in northern rural districts.',
           suggestedHost: { name: 'Tamale Teaching Hospital', city: 'Tamale' }
         });
      }

      log.step('Generated recommendations', recommendations.length);

      const output = {
        volunteerProfile: { specialty, duration },
        analysis: `Analyzed ${'totalProviders' in desertAnalysis ? desertAnalysis.totalProviders : 0} existing providers for ${specialty}.`,
        recommendations
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: any) {
      log.error(error, { specialty, duration, preference }, Date.now() - start);
      return { error: `Planning failed: ${error.message}` };
    }
  },
} as any);
