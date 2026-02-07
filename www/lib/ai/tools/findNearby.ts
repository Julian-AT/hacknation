
import { z } from 'zod';
import { db } from '../../db';
import { facilities } from '../../db/schema.facilities';
import { sql, and, isNotNull, ilike } from 'drizzle-orm';
import { CITY_COORDS } from '../../ghana';
import { tool } from 'ai';
import { createToolLogger } from './debug';

export const findNearby = tool({
  description: 'Find facilities within a certain distance (km) of a location. Supports filtering by specialty or type.',
  parameters: z.object({
    location: z.string().describe('City name (e.g., "Tamale") or "lat,lng" string'),
    radiusKm: z.number().default(50).describe('Search radius in kilometers'),
    specialty: z.string().optional().describe('Filter by specialty (e.g., "Ophthalmology")'),
    facilityType: z.string().optional().describe('Filter by type (e.g., "Hospital")'),
    limit: z.number().default(20),
  }),
  execute: async ({ location, radiusKm, specialty, facilityType, limit }: any) => {
    const log = createToolLogger('findNearby');
    const start = Date.now();
    log.start({ location, radiusKm, specialty, facilityType, limit });

    let lat: number;
    let lng: number;

    // Resolve location
    if (location.includes(',')) {
      const parts = location.split(',');
      lat = parseFloat(parts[0].trim());
      lng = parseFloat(parts[1].trim());
      log.step('Parsed coordinates from string', { lat, lng });
    } else {
      const cityKey = Object.keys(CITY_COORDS).find(c => c.toLowerCase() === location.toLowerCase());
      if (cityKey) {
        const coords = CITY_COORDS[cityKey];
        lat = coords.lat;
        lng = coords.lng;
        log.step(`Resolved city "${location}" -> "${cityKey}"`, { lat, lng });
      } else {
        log.step('City resolution FAILED', location);
        const result = { error: `Could not resolve location "${location}". Please provide coordinates "lat,lng" or a major Ghana city name.` };
        log.success(result, Date.now() - start);
        return result;
      }
    }

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      log.step('Invalid coordinates after parsing', { lat, lng });
      const result = { error: 'Invalid coordinates.' };
      log.success(result, Date.now() - start);
      return result;
    }

    const distanceSql = sql`
      6371 * acos(
        cos(radians(${lat})) * cos(radians(${facilities.lat})) *
        cos(radians(${facilities.lng}) - radians(${lng})) +
        sin(radians(${lat})) * sin(radians(${facilities.lat}))
      )
    `;

    try {
      const conditions = [
        isNotNull(facilities.lat),
        isNotNull(facilities.lng),
        sql`${distanceSql} <= ${radiusKm}`
      ];

      if (specialty) {
        conditions.push(sql`(${ilike(facilities.specialtiesRaw, `%${specialty}%`)} OR ${specialty} = ANY(${facilities.specialties}))`);
        log.step('Filter added: specialty', specialty);
      }

      if (facilityType) {
        conditions.push(ilike(facilities.facilityType, `%${facilityType}%`));
        log.step('Filter added: facilityType', facilityType);
      }

      log.step('Executing Haversine distance query');
      const results = await db
        .select({
          id: facilities.id,
          name: facilities.name,
          type: facilities.facilityType,
          city: facilities.addressCity,
          lat: facilities.lat,
          lng: facilities.lng,
          distanceKm: distanceSql,
          doctors: facilities.numDoctors,
          beds: facilities.capacity,
        })
        .from(facilities)
        .where(and(...conditions))
        .orderBy(distanceSql)
        .limit(limit);

      log.step('Query returned facilities', results.length);

      const output = {
        center: { location, lat, lng },
        radiusKm,
        count: results.length,
        facilities: results.map(r => ({
          ...r,
          distanceKm: Math.round(Number(r.distanceKm) * 10) / 10
        }))
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: any) {
      log.error(error, { location, radiusKm, specialty, facilityType, limit }, Date.now() - start);
      return { error: `Geospatial search failed: ${error.message}` };
    }
  },
} as any);
