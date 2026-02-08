import { tool } from "ai";
import { and, ilike, isNotNull, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { facilities } from "../../db/schema.facilities";
import { isGeoError, resolveLocation } from "../../geocode";
import { createToolLogger } from "./debug";
import {
  clampNumber,
  DB_QUERY_TIMEOUT_MS,
  isValidCoordinates,
  MAX_SEARCH_ROWS,
  withTimeout,
} from "./safeguards";

export const findNearby = tool({
  description:
    "Find facilities within a certain distance (km) of a location. Supports filtering by specialty or type.",
  inputSchema: z.object({
    location: z
      .string()
      .min(1)
      .max(100)
      .describe('City name (e.g., "Tamale") or "lat,lng" string'),
    radiusKm: z
      .number()
      .min(1)
      .max(500)
      .default(50)
      .describe("Search radius in kilometers (max 500)"),
    specialty: z
      .string()
      .max(100)
      .optional()
      .describe('Filter by specialty (e.g., "Ophthalmology")'),
    facilityType: z
      .string()
      .max(100)
      .optional()
      .describe('Filter by type (e.g., "Hospital")'),
    limit: z.number().min(1).max(50).default(20),
  }),
  execute: async (
    {
      location,
      radiusKm: rawRadiusKm,
      specialty,
      facilityType,
      limit: rawLimit,
    },
    { abortSignal }
  ) => {
    const radiusKm = clampNumber(rawRadiusKm, 1, 500, 50);
    const limit = clampNumber(rawLimit, 1, MAX_SEARCH_ROWS, 20);
    const log = createToolLogger("findNearby");
    const start = Date.now();
    log.start({ location, radiusKm, specialty, facilityType, limit });

    // Resolve location (supports any city worldwide via geocoding)
    const geo = await resolveLocation(location);
    if (isGeoError(geo)) {
      log.step("Location resolution FAILED", location);
      return { error: geo.error };
    }
    const { lat, lng } = geo;
    log.step(`Resolved location "${location}" -> "${geo.resolvedName}"`, {
      lat,
      lng,
    });

    // Validate coordinates
    const coordCheck = isValidCoordinates(lat, lng);
    if (!coordCheck.valid) {
      log.step("Invalid coordinates", coordCheck.reason);
      return { error: `Invalid coordinates: ${coordCheck.reason}` };
    }

    const distanceSql = sql`(
      6371.0 * acos(
        LEAST(1.0, GREATEST(-1.0,
          cos(radians(${lat})) * cos(radians(${facilities.lat})) *
          cos(radians(${facilities.lng}) - radians(${lng})) +
          sin(radians(${lat})) * sin(radians(${facilities.lat}))
        ))
      )
    )`;

    try {
      const conditions = [
        isNotNull(facilities.lat),
        isNotNull(facilities.lng),
        sql`${distanceSql} <= ${radiusKm}`,
      ];

      if (specialty) {
        conditions.push(
          sql`(${ilike(facilities.specialtiesRaw, `%${specialty}%`)} OR ${specialty} = ANY(${facilities.specialties}))`
        );
        log.step("Filter added: specialty", specialty);
      }

      if (facilityType) {
        conditions.push(ilike(facilities.facilityType, `%${facilityType}%`));
        log.step("Filter added: facilityType", facilityType);
      }

      log.step("Executing Haversine distance query");
      const results = await withTimeout(
        db
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
          .limit(limit),
        DB_QUERY_TIMEOUT_MS,
        abortSignal
      );

      log.step("Query returned facilities", results.length);

      const mappedFacilities = results.map((r) => ({
        ...r,
        distanceKm: Math.round(Number(r.distanceKm) * 10) / 10,
      }));

      // Detect coordinate clustering — indicates city-level geocoding only
      let coordinateQualityWarning: string | undefined;
      if (mappedFacilities.length > 3) {
        const uniqueCoords = new Set(
          mappedFacilities.map((f) => `${f.lat},${f.lng}`)
        );
        if (uniqueCoords.size === 1) {
          coordinateQualityWarning =
            "All facilities share identical coordinates (city-level geocoding only). Distance calculations between these facilities are unreliable — they all appear at 0km from each other.";
          log.step("WARNING: all facilities share identical coordinates");
        } else if (
          uniqueCoords.size < mappedFacilities.length * 0.2 &&
          uniqueCoords.size < 5
        ) {
          coordinateQualityWarning = `Only ${uniqueCoords.size} unique coordinate(s) across ${mappedFacilities.length} facilities. Most facilities use city-level geocoding. Distance calculations may be unreliable.`;
          log.step(
            "WARNING: low coordinate diversity",
            `${uniqueCoords.size}/${mappedFacilities.length}`
          );
        }
      }

      const output = {
        center: { location, lat, lng },
        radiusKm,
        count: results.length,
        facilities: mappedFacilities,
        ...(coordinateQualityWarning ? { coordinateQualityWarning } : {}),
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown geospatial error";
      log.error(
        error,
        { location, radiusKm, specialty, facilityType, limit },
        Date.now() - start
      );
      return { error: `Geospatial search failed: ${message}` };
    }
  },
});
