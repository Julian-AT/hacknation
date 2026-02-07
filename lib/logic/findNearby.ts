
import { db } from '../../db';
import { facilities } from '../../db/schema';
import { sql, asc, and, isNotNull, like, arrayContains } from 'drizzle-orm';
import { CITY_COORDS } from '../ghana';

export async function findNearbyLogic({ city, lat, lng, radiusKm = 50, specialty }: { city?: string; lat?: number; lng?: number; radiusKm?: number; specialty?: string }) {
    try {
      let centerLat = lat;
      let centerLng = lng;

      // Resolve city to coordinates
      if (city) {
        // Simple case-insensitive lookup
        const cityKey = Object.keys(CITY_COORDS).find(k => k.toLowerCase() === city.toLowerCase());
        if (cityKey) {
          centerLat = CITY_COORDS[cityKey].lat;
          centerLng = CITY_COORDS[cityKey].lng;
        } else {
          return { error: `City "${city}" not found in database. Please provide coordinates or try a major city.` };
        }
      }

      if (centerLat === undefined || centerLng === undefined) {
        return { error: 'Please provide either a valid city name or lat/lng coordinates.' };
      }

      // SQL Haversine Formula
      // 6371 is Earth radius in km
      const distance = sql<number>`
        (6371 * acos(
          cos(radians(${centerLat})) * cos(radians(${facilities.lat})) * cos(radians(${facilities.lng}) - radians(${centerLng})) + 
          sin(radians(${centerLat})) * sin(radians(${facilities.lat}))
        ))
      `;

      const results = await db
        .select({
          id: facilities.id,
          name: facilities.name,
          city: facilities.addressCity,
          distance: distance,
          lat: facilities.lat,
          lng: facilities.lng,
          specialties: facilities.specialties,
          facilityType: facilities.facilityType,
        })
        .from(facilities)
        .where(and(
          isNotNull(facilities.lat),
          isNotNull(facilities.lng),
          sql`${distance} < ${radiusKm}`,
          specialty ? arrayContains(facilities.specialties, [specialty]) : undefined
        ))
        .orderBy(asc(distance))
        .limit(20);

      return {
        center: { lat: centerLat, lng: centerLng, location: city || 'Custom Coordinates' },
        radiusKm,
        count: results.length,
        facilities: results.map(f => ({
            ...f,
            distance: Math.round((f.distance as unknown as number) * 10) / 10 // Round to 1 decimal
        })),
      };

    } catch (error) {
      console.error('findNearby error:', error);
      return { error: 'Failed to search nearby facilities.' };
    }
}
