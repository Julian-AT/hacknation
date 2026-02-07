
import { db } from '../lib/db';
import { facilities } from '../lib/db/schema.facilities';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { sql } from 'drizzle-orm';

const CSV_FILE = path.join(process.cwd(), '../assets/data/ghana-facilities.csv');

// Ghana Cities Coordinates Lookup Table (Lat/Lng) - Simplified for MVP
// In a real app, this would be more comprehensive or use a geocoding API.
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  'Accra': { lat: 5.6037, lng: -0.1870 },
  'Kumasi': { lat: 6.6885, lng: -1.6244 },
  'Tamale': { lat: 9.4075, lng: -0.8534 },
  'Takoradi': { lat: 4.8845, lng: -1.7554 },
  'Sunyani': { lat: 7.3399, lng: -2.3268 },
  'Cape Coast': { lat: 5.1315, lng: -1.2795 },
  'Obuasi': { lat: 6.2152, lng: -1.6666 },
  'Koforidua': { lat: 6.0941, lng: -0.2609 },
  'Techiman': { lat: 7.5833, lng: -1.9333 },
  'Ho': { lat: 6.6008, lng: 0.4713 },
  'Wa': { lat: 10.0601, lng: -2.5099 },
  'Bolgatanga': { lat: 10.7856, lng: -0.8514 },
  'Tema': { lat: 5.6698, lng: 0.0166 },
  'Bawku': { lat: 11.0616, lng: -0.2417 },
  'Yendi': { lat: 9.4450, lng: -0.0093 },
  'Konongo': { lat: 6.6167, lng: -1.2167 },
  'Nkawkaw': { lat: 6.5500, lng: -0.7667 },
  'Berekum': { lat: 7.4534, lng: -2.5840 },
  'Navrongo': { lat: 10.8956, lng: -1.0921 },
  'Winneba': { lat: 5.3511, lng: -0.6231 },
  'Agona Swedru': { lat: 5.5333, lng: -0.7000 },
  'Nsawam': { lat: 5.8089, lng: -0.3503 },
  'Bibiani': { lat: 6.4635, lng: -2.3194 },
  'Dunkwa-on-Offin': { lat: 5.9656, lng: -1.7800 },
  'Tarkwa': { lat: 5.3000, lng: -1.9833 },
  'Elmina': { lat: 5.0867, lng: -1.3528 },
  'Goaso': { lat: 6.8000, lng: -2.5167 },
  'Mampong': { lat: 7.0628, lng: -1.4006 },
  'Wenchi': { lat: 7.7333, lng: -2.1000 },
  'Kintampo': { lat: 8.0563, lng: -1.7306 },
  'Akim Oda': { lat: 5.9267, lng: -0.9856 },
  'Sefwi Wiawso': { lat: 6.2000, lng: -2.4833 },
  'Aflao': { lat: 6.1167, lng: 1.1833 },
  'Prestea': { lat: 5.4328, lng: -2.1428 },
  'Ejura': { lat: 7.3833, lng: -1.3667 },
  'Asamankese': { lat: 5.8600, lng: -0.6600 },
  'Bekwai': { lat: 6.4531, lng: -1.5833 },
  'Atebubu': { lat: 7.7500, lng: -0.9833 },
  'Kpandu': { lat: 7.0000, lng: 0.3000 },
  'Hohoe': { lat: 7.1519, lng: 0.4739 },
  'Suhum': { lat: 6.0400, lng: -0.4500 },
  'Offinso': { lat: 6.9000, lng: -1.6500 },
  'Bawjiase': { lat: 5.6167, lng: -0.6167 },
  'Yeji': { lat: 8.2167, lng: -0.6500 },
  'Nkoranza': { lat: 7.5667, lng: -1.7000 },
  'Kasoa': { lat: 5.5345, lng: -0.4169 },
  'Ashaiman': { lat: 5.7000, lng: -0.0333 },
  'Madina': { lat: 5.6667, lng: -0.1667 },
  'Teshie': { lat: 5.5836, lng: -0.1061 },
  'Nungua': { lat: 5.6000, lng: -0.0667 },
  'Dome': { lat: 5.6500, lng: -0.2333 },
  'Gbawe': { lat: 5.5770, lng: -0.3090 },
  'Oyarifa': { lat: 5.7667, lng: -0.1667 },
  'Lashibi': { lat: 5.6667, lng: -0.0500 },
  'Sakumono': { lat: 5.6333, lng: -0.0667 },
  'Taifa': { lat: 5.6667, lng: -0.2500 },
  'Awoshie': { lat: 5.5833, lng: -0.2833 },
  'Anyaa': { lat: 5.6000, lng: -0.2833 },
  'Santa Maria': { lat: 5.6167, lng: -0.2667 },
  'Ablekuma': { lat: 5.6167, lng: -0.3167 },
  'Bortianor': { lat: 5.5333, lng: -0.3333 },
  'Ofankor': { lat: 5.6500, lng: -0.2667 },
  'Pokuase': { lat: 5.6833, lng: -0.2833 },
  'Amasaman': { lat: 5.7000, lng: -0.3000 },
  'Achimota': { lat: 5.6128, lng: -0.2343 },
  'Legon': { lat: 5.6500, lng: -0.1833 },
  'Adenta': { lat: 5.7167, lng: -0.1667 },
  'Dansoman': { lat: 5.5500, lng: -0.2667 },
  'Korle Bu': { lat: 5.5376, lng: -0.2307 },
  'Osu': { lat: 5.5500, lng: -0.1833 },
  'Labadi': { lat: 5.5667, lng: -0.1500 },
  'Spintex': { lat: 5.6333, lng: -0.1000 },
  'East Legon': { lat: 5.6358, lng: -0.1610 },
  'West Legon': { lat: 5.6558, lng: -0.2057 },
  'North Legon': { lat: 5.6725, lng: -0.1906 },
  'Cantonments': { lat: 5.5833, lng: -0.1667 },
  'Airport Residential': { lat: 5.6050, lng: -0.1833 },
  'Ridge': { lat: 5.5667, lng: -0.1983 },
  'Ministries': { lat: 5.5500, lng: -0.2000 },
  'Makola': { lat: 5.5469, lng: -0.2091 },
  'Tudu': { lat: 5.5500, lng: -0.2000 },
  'Abeka': { lat: 5.6000, lng: -0.2333 },
  'Lapaz': { lat: 5.6000, lng: -0.2333 },
  'Darkuman': { lat: 5.5833, lng: -0.2500 },
  'Kwashieman': { lat: 5.6000, lng: -0.2667 },
  'Odorkor': { lat: 5.5667, lng: -0.2500 },
  'Kaneshie': { lat: 5.5667, lng: -0.2333 },
  'Bubuashie': { lat: 5.5833, lng: -0.2333 },
  'North Kaneshie': { lat: 5.5833, lng: -0.2333 },
  'Tesano': { lat: 5.6000, lng: -0.2167 },
  'Alajo': { lat: 5.6000, lng: -0.2000 },
  'Kotobabi': { lat: 5.6000, lng: -0.1833 },
  'Newtown': { lat: 5.6000, lng: -0.1833 },
  'Nima': { lat: 5.5833, lng: -0.1833 },
  'Mamobi': { lat: 5.5833, lng: -0.1833 },
  'Pig Farm': { lat: 5.6000, lng: -0.1833 },
  'Roman Ridge': { lat: 5.6000, lng: -0.1833 },
  'Dzorwulu': { lat: 5.6167, lng: -0.2000 },
  'Abelemkpe': { lat: 5.6167, lng: -0.2167 },
  'Abelenkpe': { lat: 5.6167, lng: -0.2167 },
};


// Helper to parse comma-separated strings into arrays
function parseList(input: string | undefined): string[] {
  if (!input) return [];
  return input.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
}

// Helper to normalize facility type from ID or raw string (Basic mapping)
function mapFacilityType(id: string | undefined, name: string): string {
    // This is a placeholder logic. In reality, we'd have a lookup table for facilityTypeId.
    // For now, we try to infer from name if typeId is obscure, or just use 'Unknown'
    const lowerName = name.toLowerCase();
    if (lowerName.includes('hospital')) return 'hospital';
    if (lowerName.includes('clinic')) return 'clinic';
    if (lowerName.includes('pharmacy')) return 'pharmacy';
    if (lowerName.includes('center') || lowerName.includes('centre')) return 'health_center';
    if (lowerName.includes('maternity')) return 'maternity_home';
    if (lowerName.includes('lab')) return 'laboratory';
    
    return 'other';
}


interface CsvRecord {
  pk_unique_id: string;
  name: string;
  source_url: string;
  facilityTypeId: string;
  operatorTypeId: string;
  organization_type: string;
  address_line1: string;
  address_city: string;
  address_stateOrRegion: string;
  address_country: string;
  address_countryCode: string;
  numberDoctors: string;
  capacity: string;
  yearEstablished: string;
  area: string;
  phone_numbers: string;
  email: string;
  websites: string;
  officialWebsite: string;
  facebookLink: string;
  twitterLink: string;
  specialties: string;
  procedure: string;
  equipment: string;
  capability: string;
  description: string;
  missionStatement: string;
  organizationDescription: string;
  affiliationTypeIds: string;
  acceptsVolunteers: string;
}

async function main() {
  console.log('Reading CSV file:', CSV_FILE);
  const fileContent = fs.readFileSync(CSV_FILE, 'utf-8');
  
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRecord[];

  console.log(`Found ${records.length} records. Processing...`);

  const rowsToInsert = [];

  for (const record of records) {
    // 1. Geocoding (Lookup)
    let lat = null;
    let lng = null;
    const city = record.address_city;
    
    // Try exact match first
    if (city && CITY_COORDS[city]) {
      lat = CITY_COORDS[city].lat;
      lng = CITY_COORDS[city].lng;
    } else {
       // Try fuzzy match or look for city in name? 
       // For MVP, if no coord, it stays null (or default to Ghana center?)
       // We'll leave it null so we can detect missing location data.
    }

    // 2. Parse Arrays
    const specialties = parseList(record.specialties);
    const procedures = parseList(record.procedure); // CSV header is 'procedure'
    const equipment = parseList(record.equipment);
    const capabilities = parseList(record.capability); // CSV header is 'capability'
    const affiliationTypes = parseList(record.affiliationTypeIds); // Or name?

    // 3. Normalize Numbers
    const numDoctors = record.numberDoctors ? parseInt(record.numberDoctors, 10) : null;
    const capacity = record.capacity ? parseInt(record.capacity, 10) : null; // beds
    const yearEstablished = record.yearEstablished ? parseInt(record.yearEstablished, 10) : null;
    const areaSqm = record.area ? parseInt(record.area, 10) : null;

    rowsToInsert.push({
      pkUniqueId: record.pk_unique_id ? parseInt(record.pk_unique_id, 10) : null,
      name: record.name,
      sourceUrl: record.source_url,
      
      facilityType: mapFacilityType(record.facilityTypeId, record.name),
      operatorType: record.operatorTypeId, // Or map?
      organizationType: record.organization_type,

      addressLine1: record.address_line1,
      addressCity: record.address_city,
      addressRegion: record.address_stateOrRegion, // CSV header
      addressCountry: record.address_country || 'Ghana',
      countryCode: record.address_countryCode || 'GH',
      lat: lat,
      lng: lng,

      numDoctors: isNaN(numDoctors!) ? null : numDoctors,
      capacity: isNaN(capacity!) ? null : capacity,
      areaSqm: isNaN(areaSqm!) ? null : areaSqm,
      yearEstablished: isNaN(yearEstablished!) ? null : yearEstablished,

      phone: record.phone_numbers,
      email: record.email,
      website: record.websites,
      officialWebsite: record.officialWebsite,
      facebook: record.facebookLink,
      twitter: record.twitterLink,

      // Raw text for search/embeddings
      specialtiesRaw: record.specialties,
      proceduresRaw: record.procedure,
      equipmentRaw: record.equipment,
      capabilitiesRaw: record.capability,
      description: record.description,
      missionStatement: record.missionStatement,
      orgDescription: record.organizationDescription,

      // Parsed arrays
      specialties: specialties,
      procedures: procedures,
      equipment: equipment,
      capabilities: capabilities,
      affiliationTypes: affiliationTypes,
      
      acceptsVolunteers: record.acceptsVolunteers === 'TRUE' || record.acceptsVolunteers === 'true' || record.acceptsVolunteers === '1',
    });
  }

  // Batch insert
  console.log(`Inserting ${rowsToInsert.length} rows into database...`);
  
  // Chunking to avoid query size limits
  const CHUNK_SIZE = 50;
  for (let i = 0; i < rowsToInsert.length; i += CHUNK_SIZE) {
    const chunk = rowsToInsert.slice(i, i + CHUNK_SIZE);
    await db.insert(facilities).values(chunk).onConflictDoNothing();
    process.stdout.write('.');
  }
  
  console.log('\nDone seeding facilities!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
