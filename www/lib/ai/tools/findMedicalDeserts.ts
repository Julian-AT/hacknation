
import { z } from 'zod';
import { db } from '../../db';
import { facilities } from '../../db/schema.facilities';
import { and, isNotNull, ilike } from 'drizzle-orm';
import { CITY_COORDS } from '../../ghana';
import { tool } from 'ai';
import { createToolLogger } from './debug';

export const findMedicalDeserts = tool({
  description: 'Identify geographic regions where specific healthcare services are absent or dangerously far. Returns "desert zones" with gap radius and affected population.',
  parameters: z.object({
    service: z.string().describe('The healthcare service to check (e.g., "neurosurgery", "dialysis")'),
    thresholdKm: z.number().default(100).describe('Distance threshold to consider an area "served"'),
  }),
  execute: async ({ service, thresholdKm: rawThresholdKm }: any) => {
    const thresholdKm = typeof rawThresholdKm === 'number' && rawThresholdKm > 0 ? rawThresholdKm : 100;
    const log = createToolLogger('findMedicalDeserts');
    const start = Date.now();
    log.start({ service, thresholdKm });

    try {
      log.step('Querying providers for service', service);
      const providers = await db
        .select({
          id: facilities.id,
          name: facilities.name,
          lat: facilities.lat,
          lng: facilities.lng,
          city: facilities.addressCity,
        })
        .from(facilities)
        .where(and(
          isNotNull(facilities.lat),
          isNotNull(facilities.lng),
          ilike(facilities.proceduresRaw, `%${service}%`)
        ));

      log.step('Providers found', providers.length);

      if (providers.length === 0) {
        const output = {
          service,
          status: 'NATIONAL_GAP',
          message: `No facilities in Ghana explicitly list "${service}" in their procedures.`,
        };
        log.success(output, Date.now() - start);
        return output;
      }

      // Check major cities against providers
      const cityCount = Object.keys(CITY_COORDS).length;
      log.step('Computing distances for cities', cityCount);

      const cityGaps: any[] = [];
      
      for (const [cityName, coords] of Object.entries(CITY_COORDS)) {
        let minDist = Infinity;
        let nearestProvider = null;

        for (const p of providers) {
          if (!p.lat || !p.lng) continue;
          
          const d = getDistanceFromLatLonInKm(coords.lat, coords.lng, p.lat, p.lng);
          if (d < minDist) {
            minDist = d;
            nearestProvider = p;
          }
        }

        if (minDist > thresholdKm) {
          cityGaps.push({
            city: cityName,
            nearestProvider: nearestProvider?.name,
            distanceKm: Math.round(minDist),
            coordinates: coords,
          });
        }
      }

      log.step('Desert zones identified', cityGaps.length);

      const output = {
        service,
        thresholdKm,
        totalProviders: providers.length,
        desertZones: cityGaps.sort((a: any, b: any) => b.distanceKm - a.distanceKm).slice(0, 10),
        affectedPopulationEstimate: 'Calculating population impact requires precise region mapping.'
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: any) {
      log.error(error, { service, thresholdKm }, Date.now() - start);
      return { error: `Desert analysis failed: ${error.message}` };
    }
  },
} as any) as any;

// Helper
function getDistanceFromLatLonInKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
