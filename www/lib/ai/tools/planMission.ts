
import { z } from 'zod';
import { tool } from 'ai';
import { findMedicalDeserts } from './findMedicalDeserts';
import { findNearby } from './findNearby';

export const planMission = tool({
  description: 'Interactive volunteer deployment planner. Recommends facilities for a volunteer based on their specialty and Ghana\'s needs.',
  parameters: z.object({
    specialty: z.string().describe('Volunteer medical specialty (e.g., "Ophthalmologist")'),
    duration: z.string().optional().describe('Available duration (e.g., "2 weeks")'),
    preference: z.string().optional().describe('Regional or facility type preference'),
  }),
  execute: async ({ specialty, duration, preference }: any, { toolCallId, messages }: any) => {
    try {
      // Let's implement specific logic for planning:
      // Find deserts for this specialty
      const desertAnalysis = await (findMedicalDeserts as any).execute(
        { service: specialty, thresholdKm: 50 },
        { toolCallId, messages }
      );
      
      const recommendations: any[] = [];
      
      // Type guard for tool result
      // The tool returns either { error: string } or the success object
      if ('desertZones' in desertAnalysis && Array.isArray(desertAnalysis.desertZones) && desertAnalysis.desertZones.length > 0) {
        // We have deserts!
        // Recommend facilities NEAR the desert zones that match "Hospital" type (to host a specialist)
        const topDesert = desertAnalysis.desertZones[0]; // Worst gap
        
        // Find host in that area
        const potentialHosts = await (findNearby as any).execute(
          {
             location: `${topDesert.coordinates.lat},${topDesert.coordinates.lng}`,
             radiusKm: 50,
             facilityType: 'Hospital', // Host needs infrastructure
             limit: 3
          },
          { toolCallId, messages }
        );

        if ('facilities' in potentialHosts && Array.isArray(potentialHosts.facilities) && potentialHosts.facilities.length > 0) {
           recommendations.push({
             priority: 'High - Critical Gap',
             region: `${topDesert.city} Area`,
             reason: `This area is a medical desert for ${specialty} (nearest is ${topDesert.distanceKm}km away).`,
             suggestedHost: potentialHosts.facilities[0]
           });
        } else {
           // No hospital nearby, maybe a clinic?
           recommendations.push({
             priority: 'High - Critical Gap (Infrastructure Limited)',
             region: `${topDesert.city} Area`,
             reason: `This area is a severe medical desert (${topDesert.distanceKm}km gap) but lacks major hospitals. Consider mobile clinic deployment.`,
             suggestedLocation: topDesert.city
           });
        }
      } else if ('status' in desertAnalysis && desertAnalysis.status === 'NATIONAL_GAP') {
         recommendations.push({
           priority: 'Critical - National Gap',
           region: 'Accra / Kumasi (Teaching Hospitals)',
           reason: `No facilities in Ghana explicitly list ${specialty}. Recommend starting at a major teaching hospital to build capacity.`,
           suggestedHost: { name: 'Korle Bu or Komfo Anokye Teaching Hospital' }
         });
      }

      // If no specific deserts found (maybe common specialty), just recommend under-served rural areas
      if (recommendations.length === 0) {
         recommendations.push({
           priority: 'Medium - Rural Support',
           region: 'Northern Region',
           reason: 'General need for specialists in northern rural districts.',
           suggestedHost: { name: 'Tamale Teaching Hospital', city: 'Tamale' } // Fallback
         });
      }

      return {
        volunteerProfile: { specialty, duration },
        analysis: `Analyzed ${'totalProviders' in desertAnalysis ? desertAnalysis.totalProviders : 0} existing providers for ${specialty}.`,
        recommendations
      };

    } catch (error: any) {
      return { error: `Planning failed: ${error.message}` };
    }
  },
} as any);
