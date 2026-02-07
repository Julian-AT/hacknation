
import { findMedicalDesertsLogic } from '../logic/findMedicalDeserts';
import { findNearbyLogic } from '../logic/findNearby';
import { tool } from 'ai';
import { z } from 'zod';

export const planMission = tool({
  description: 'Interactive mission planner for volunteers. Suggests deployment locations based on specialty and need.',
  parameters: z.object({
    specialty: z.string().describe('Volunteer medical specialty.'),
    durationWeeks: z.number().optional().describe('Duration of availability (context only).'),
  }),
  execute: async ({ specialty }) => {
    try {
      // 1. Find deserts (Needs Analysis)
      // Call logic directly
      const desertReport = await findMedicalDesertsLogic({ specialty, thresholdKm: 50 });
      
      if (!desertReport || 'error' in desertReport) return { error: 'Failed to analyze needs.' };
      if (!desertReport.deserts || desertReport.deserts.length === 0) {
        return { message: `Great news! No critical coverage gaps found for ${specialty}. Consider supporting general capacity building.` };
      }

      // 2. For top 3 deserts, find potential host facilities nearby (Capacity Analysis)
      const recommendations = [];

      for (const desert of desertReport.deserts.slice(0, 3)) {
        const coords = desert.coordinates;
        // Find ANY hospital/clinic nearby to host, radius 20km
        const hosts = await findNearbyLogic({ 
          lat: coords.lat, 
          lng: coords.lng, 
          radiusKm: 20,
        });
        
        if (hosts && 'facilities' in hosts && hosts.facilities && hosts.facilities.length > 0) {
           // Filter for hospitals or large clinics
           const potentialHosts = hosts.facilities.filter((f: any) => 
             f.name.toLowerCase().includes('hospital') || f.name.toLowerCase().includes('clinic')
           );
           
           if (potentialHosts.length > 0) {
             const host = potentialHosts[0];
             recommendations.push({
               location: desert.city,
               gapSeverity: `${desert.distanceToNearest}km to nearest specialist`,
               recommendedHost: host.name,
               hostDistance: `${host.distance}km from center`,
               reasoning: `High need area. ${host.name} is a viable base of operations.`,
             });
           }
        }
      }

      return {
        specialty,
        recommendations,
        message: recommendations.length > 0 
          ? `Found ${recommendations.length} high-impact deployment opportunities.` 
          : 'Found critical gaps but no suitable host facilities nearby. Consider mobile clinic deployment.',
      };

    } catch (error) {
      console.error('planMission error:', error);
      return { error: 'Failed to plan mission.' };
    }
  },
});
