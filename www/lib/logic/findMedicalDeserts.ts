
import { db } from '../../db';
import { facilities } from '../../db/schema';
import { arrayContains, isNotNull, and } from 'drizzle-orm';
import { CITY_COORDS } from '../ghana';

// Haversine helper
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export async function findMedicalDesertsLogic({ specialty, thresholdKm = 100 }: { specialty: string; thresholdKm?: number }) {
    try {
      // 1. Get all facilities with the specialty
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
          arrayContains(facilities.specialties, [specialty])
        ));

      if (providers.length === 0) {
        return {
          message: `CRITICAL GAP: No facilities in the entire database offer ${specialty}.`,
          nationalGap: true,
          providerCount: 0,
        };
      }

      // 2. Check each major population center
      const deserts = [];
      const covered = [];

      for (const [city, coords] of Object.entries(CITY_COORDS)) {
        let minDist = Infinity;
        let nearestProvider = null;

        for (const provider of providers) {
          if (provider.lat && provider.lng) {
            const dist = getDistance(coords.lat, coords.lng, provider.lat, provider.lng);
            if (dist < minDist) {
              minDist = dist;
              nearestProvider = provider;
            }
          }
        }

        if (minDist > thresholdKm) {
          deserts.push({
            city,
            region: 'Unknown', // In a real app, map city to region
            distanceToNearest: Math.round(minDist),
            nearestFacility: nearestProvider?.name,
            coordinates: coords,
          });
        } else {
          covered.push({
            city,
            distance: Math.round(minDist),
          });
        }
      }

      // Sort by severity (distance)
      deserts.sort((a, b) => b.distanceToNearest - a.distanceToNearest);

      return {
        specialty,
        providerCount: providers.length,
        thresholdKm,
        desertCount: deserts.length,
        deserts: deserts.slice(0, 10), // Top 10 worst
        message: deserts.length > 0 
          ? `Found ${deserts.length} population centers >${thresholdKm}km from ${specialty}. Worst gap: ${deserts[0].city} (${deserts[0].distanceToNearest}km).` 
          : `No medical deserts found. All major cities are within ${thresholdKm}km of ${specialty}.`,
      };

    } catch (error) {
      console.error('findMedicalDeserts error:', error);
      return { error: 'Failed to analyze medical deserts.' };
    }
}
