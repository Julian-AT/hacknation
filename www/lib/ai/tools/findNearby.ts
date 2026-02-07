
import { z } from 'zod';
import { db } from '../../db';
import { facilities } from '../../db/schema.facilities';
import { sql, and, isNotNull, ilike, eq, gte } from 'drizzle-orm';
import { CITY_COORDS } from '../../ghana';
import { tool } from 'ai';

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
    let lat: number;
    let lng: number;

    // Resolve location
    if (location.includes(',')) {
      const parts = location.split(',');
      lat = parseFloat(parts[0].trim());
      lng = parseFloat(parts[1].trim());
    } else {
      // Lookup city
      // Case-insensitive lookup helper
      const cityKey = Object.keys(CITY_COORDS).find(c => c.toLowerCase() === location.toLowerCase());
      if (cityKey) {
        const coords = CITY_COORDS[cityKey];
        lat = coords.lat;
        lng = coords.lng;
      } else {
        return { error: `Could not resolve location "${location}". Please provide coordinates "lat,lng" or a major Ghana city name.` };
      }
    }

    if (isNaN(lat) || isNaN(lng)) {
      return { error: 'Invalid coordinates.' };
    }

    // Haversine formula in SQL
    // 6371 is Earth radius in km
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
        // Check both parsed array and raw text
        conditions.push(sql`(${ilike(facilities.specialtiesRaw, `%${specialty}%`)} OR ${specialty} = ANY(${facilities.specialties}))`);
      }

      if (facilityType) {
        conditions.push(ilike(facilities.facilityType, `%${facilityType}%`));
      }

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

      return {
        center: { location, lat, lng },
        radiusKm,
        count: results.length,
        facilities: results.map(r => ({
          ...r,
          distanceKm: Math.round(Number(r.distanceKm) * 10) / 10 // Round to 1 decimal
        }))
      };

    } catch (error: any) {
      return { error: `Geospatial search failed: ${error.message}` };
    }
  },
} as any);
