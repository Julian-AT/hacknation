/**
 * Geocode facilities that are missing lat/lng using OSM Nominatim.
 *
 * Free, no API key required. Rate limit: 1 request per second.
 * Only geocodes facilities that have an address_city but no coordinates.
 *
 * Usage:
 *   npx tsx scripts/geocode-facilities.ts
 *   npx tsx scripts/geocode-facilities.ts --dry-run   # Preview without updating
 */

import dotenv from "dotenv";
import { and, isNotNull, isNull, ne, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { facilities } from "../lib/db/schema.facilities";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

const isDryRun = process.argv.includes("--dry-run");
const client = postgres(connectionString);
const db = drizzle(client);

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/search";
const DELAY_MS = 1100; // Nominatim requires max 1 req/sec

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  importance: number;
}

async function geocodeCity(
  city: string,
  region: string | null,
  country: string
): Promise<{ lat: number; lng: number } | null> {
  const query = region
    ? `${city}, ${region}, ${country}`
    : `${city}, ${country}`;

  const params = new URLSearchParams({
    q: query,
    format: "json",
    limit: "1",
    countrycodes: "GH",
  });

  const response = await fetch(`${NOMINATIM_BASE}?${params.toString()}`, {
    headers: {
      "User-Agent": "CareMapAI/1.0 (healthcare-facility-geocoder)",
    },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    return null;
  }

  const results = (await response.json()) as NominatimResult[];
  if (results.length === 0) {
    return null;
  }

  const best = results[0];
  return {
    lat: Number.parseFloat(best.lat),
    lng: Number.parseFloat(best.lon),
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function main() {
  console.log(
    isDryRun
      ? "DRY RUN — no database updates will be made\n"
      : "Geocoding facilities with missing coordinates...\n"
  );

  // Find facilities with city but no coords
  const missing = await db
    .select({
      id: facilities.id,
      name: facilities.name,
      city: facilities.addressCity,
      region: facilities.addressRegion,
      country: facilities.addressCountry,
    })
    .from(facilities)
    .where(
      and(
        or(isNull(facilities.lat), isNull(facilities.lng)),
        isNotNull(facilities.addressCity),
        ne(facilities.addressCity, "null")
      )
    );

  console.log(`Found ${String(missing.length)} facilities to geocode\n`);

  let updated = 0;
  let failed = 0;
  let skipped = 0;

  for (const fac of missing) {
    if (!fac.city || fac.city === "null") {
      skipped++;
      continue;
    }

    const coords = await geocodeCity(
      fac.city,
      fac.region,
      fac.country ?? "Ghana"
    );

    if (coords) {
      console.log(
        `  ✓ ${fac.name} (${fac.city}) → ${String(coords.lat)}, ${String(coords.lng)}`
      );

      if (!isDryRun) {
        await db
          .update(facilities)
          .set({ lat: coords.lat, lng: coords.lng })
          .where(sql`${facilities.id} = ${fac.id}`);
      }
      updated++;
    } else {
      console.log(`  ✗ ${fac.name} (${fac.city}) — not found`);
      failed++;
    }

    // Respect Nominatim rate limit
    await sleep(DELAY_MS);
  }

  console.log("\nDone!");
  console.log(`  Updated: ${String(updated)}`);
  console.log(`  Failed:  ${String(failed)}`);
  console.log(`  Skipped: ${String(skipped)}`);

  await client.end();
}

main().catch((error) => {
  console.error("Geocoding failed:", error);
  process.exit(1);
});
