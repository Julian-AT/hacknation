
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { facilities } from '../lib/db/schema.facilities';
import { CITY_COORDS } from '../lib/ghana';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

const client = postgres(connectionString);
const db = drizzle(client);

// Path to CSV file relative to this script
const CSV_PATH = path.resolve(__dirname, '../../assets/data/ghana-facilities.csv');

// Helper to parse JSON array strings like '["a","b"]'
function parseArray(str: string | null | undefined): string[] {
  if (!str) return [];
  try {
    // Replace python-style None with null if any (though CSV seems to have standard JSON)
    const jsonStr = str.replace(/'/g, '"').replace(/None/g, 'null'); 
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string');
    }
    return [];
  } catch (e) {
    // If simple comma separated
    if (str.includes(',')) {
      return str.split(',').map(s => s.trim());
    }
    return [str];
  }
}

// Helper to normalize region name
function normalizeRegion(region: string | null | undefined, city: string | null | undefined): string | null {
  if (region) return region;
  
  // Infer from city if region is missing
  // This is a simple heuristic based on the provided city coordinates map or common knowledge
  // Ideally we'd have a full City -> Region map.
  // For now, if city is in our CITY_COORDS, maybe we can assume a default region?
  // Actually, without a map, we can't reliably infer region.
  // But let's try to map major cities.
  if (city) {
    const cityLower = city.toLowerCase();
    if (cityLower === 'accra' || cityLower === 'tema') return 'Greater Accra';
    if (cityLower === 'kumasi') return 'Ashanti';
    if (cityLower === 'tamale') return 'Northern';
    if (cityLower === 'takoradi' || cityLower === 'sekondi-takoradi') return 'Western';
    if (cityLower === 'cape coast') return 'Central';
    if (cityLower === 'ho') return 'Volta';
    if (cityLower === 'koforidua') return 'Eastern';
    if (cityLower === 'sunyani') return 'Bono'; // Formerly Brong-Ahafo
    if (cityLower === 'wa') return 'Upper West';
    if (cityLower === 'bolgatanga') return 'Upper East';
  }
  return null;
}

// Helper to get coordinates
function getCoordinates(latStr: string | null, lngStr: string | null, city: string | null): { lat: number | null, lng: number | null } {
  // Try CSV lat/lng first
  // The CSV doesn't seem to have lat/lng columns in the header I saw?
  // Checking header: ...address_country,address_countryCode,countries,missionStatement...
  // Wait, I don't see lat/lng in the header I read earlier!
  // "source_url,name,pk_unique_id,mongo DB,specialties,procedure,equipment,capability,organization_type,content_table_id,phone_numbers,email,websites,officialWebsite,yearEstablished,acceptsVolunteers,facebookLink,twitterLink,linkedinLink,instagramLink,logo,address_line1,address_line2,address_line3,address_city,address_stateOrRegion,address_zipOrPostcode,address_country,address_countryCode,countries,missionStatement,missionStatementLink,organizationDescription,facilityTypeId,operatorTypeId,affiliationTypeIds,description,area,numberDoctors,capacity,unique_id"
  // Correct, no lat/lng columns. We MUST use city geocoding.
  
  if (city && CITY_COORDS[city]) {
    return CITY_COORDS[city];
  }
  
  // Fallback for known variations
  if (city === 'Sekondi-Takoradi') return CITY_COORDS['Takoradi'];
  
  return { lat: null, lng: null };
}

async function main() {
  console.log('Seeding facilities from CSV...');
  
  const fileContent = fs.readFileSync(CSV_PATH, { encoding: 'utf-8' });
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  }) as any[];

  console.log(`Found ${records.length} records.`);

  const facilitiesData: any[] = [];

  for (const record of records) {
    const city = record.address_city || null;
    const { lat, lng } = getCoordinates(null, null, city);
    
    // Parse arrays
    const specialties = parseArray(record.specialties);
    const procedures = parseArray(record.procedure);
    const equipment = parseArray(record.equipment);
    const capabilities = parseArray(record.capability);
    const phoneNumbers = parseArray(record.phone_numbers);
    const websites = parseArray(record.websites);
    const affiliationTypes = parseArray(record.affiliationTypeIds);

    // Parse integers
    const numDoctors = record.numberDoctors ? parseInt(record.numberDoctors, 10) : null;
    const capacity = record.capacity ? parseInt(record.capacity, 10) : null;
    const areaSqm = record.area ? parseInt(record.area, 10) : null;
    const yearEstablished = record.yearEstablished ? parseInt(record.yearEstablished, 10) : null;
    const pkUniqueId = record.pk_unique_id ? parseInt(record.pk_unique_id, 10) : null;

    facilitiesData.push({
      pkUniqueId,
      name: record.name,
      sourceUrl: record.source_url,
      facilityType: record.facilityTypeId || record.organization_type, // Fallback
      operatorType: record.operatorTypeId,
      organizationType: record.organization_type,
      addressLine1: record.address_line1,
      addressCity: city,
      addressRegion: normalizeRegion(record.address_stateOrRegion, city),
      addressCountry: record.address_country || 'Ghana',
      countryCode: record.address_countryCode || 'GH',
      lat,
      lng,
      numDoctors: isNaN(numDoctors!) ? null : numDoctors,
      capacity: isNaN(capacity!) ? null : capacity,
      areaSqm: isNaN(areaSqm!) ? null : areaSqm,
      yearEstablished: isNaN(yearEstablished!) ? null : yearEstablished,
      phone: phoneNumbers[0] || null, // Take first phone
      email: record.email,
      website: websites[0] || record.officialWebsite || null, // Take first website or official
      officialWebsite: record.officialWebsite,
      facebook: record.facebookLink,
      twitter: record.twitterLink,
      
      // Raw text fields
      specialtiesRaw: record.specialties,
      proceduresRaw: record.procedure,
      equipmentRaw: record.equipment,
      capabilitiesRaw: record.capability,
      description: record.description,
      missionStatement: record.missionStatement,
      orgDescription: record.organizationDescription,

      // Parsed arrays
      specialties,
      procedures,
      equipment,
      capabilities,
      affiliationTypes,
      
      acceptsVolunteers: record.acceptsVolunteers === 'true' || record.acceptsVolunteers === 'True',
    });
  }

  // Batch insert
  console.log('Inserting into database...');
  // Drizzle doesn't support massive batch inserts well with `values` if too large, 
  // but 1000 rows should be fine.
  // We'll do chunks of 50 just in case.
  const chunkSize = 50;
  for (let i = 0; i < facilitiesData.length; i += chunkSize) {
    const chunk = facilitiesData.slice(i, i + chunkSize);
    await db.insert(facilities).values(chunk).onConflictDoNothing();
    console.log(`Inserted chunk ${i / chunkSize + 1}`);
  }

  console.log('Seeding completed successfully.');
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
