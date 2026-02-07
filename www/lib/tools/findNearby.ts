
import { findNearbyLogic } from '../logic/findNearby';
import { tool } from 'ai';
import { z } from 'zod';

export const findNearby = tool({
  description: 'Find facilities within a specific radius (km) of a location (city name or coordinates). Can filter by specialty.',
  parameters: z.object({
    city: z.string().optional().describe('Name of the city/town to search around.'),
    lat: z.number().optional().describe('Latitude (if city not provided).'),
    lng: z.number().optional().describe('Longitude (if city not provided).'),
    radiusKm: z.number().default(50).describe('Search radius in kilometers (default 50).'),
    specialty: z.string().optional().describe('Optional: Filter for facilities offering this specialty.'),
  }),
  execute: async (args) => {
    return await findNearbyLogic(args);
  },
});
