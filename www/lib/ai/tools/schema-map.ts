/**
 * Facilities table schema map — the single source of truth for column name
 * mappings between Drizzle ORM camelCase and PostgreSQL snake_case.
 *
 * Used by:
 * - queryDatabase: auto-corrects camelCase → snake_case in raw SQL
 * - getSchema: returns column metadata to the LLM
 * - error messages: provides column name hints on query failures
 */

// ---------------------------------------------------------------------------
// camelCase → snake_case column name mapping
// ---------------------------------------------------------------------------

/**
 * Maps every camelCase Drizzle property name to its PostgreSQL column name.
 * Only includes columns where the names differ (same-name columns like
 * `name`, `capacity`, `lat`, `lng`, etc. don't need mapping).
 */
export const FACILITIES_COLUMN_MAP: Record<string, string> = {
  // Identifiers
  pkUniqueId: "pk_unique_id",
  sourceUrl: "source_url",

  // Classification
  facilityType: "facility_type",
  operatorType: "operator_type",
  organizationType: "organization_type",

  // Location
  addressLine1: "address_line1",
  addressCity: "address_city",
  addressRegion: "address_region",
  addressCountry: "address_country",
  countryCode: "country_code",

  // Capacity
  numDoctors: "num_doctors",
  areaSqm: "area_sqm",
  yearEstablished: "year_established",

  // Contact
  officialWebsite: "official_website",

  // Free-text (IDP)
  specialtiesRaw: "specialties_raw",
  proceduresRaw: "procedures_raw",
  equipmentRaw: "equipment_raw",
  capabilitiesRaw: "capabilities_raw",
  missionStatement: "mission_statement",
  orgDescription: "org_description",

  // Parsed arrays
  affiliationTypes: "affiliation_types",

  // Other
  acceptsVolunteers: "accepts_volunteers",
  createdAt: "created_at",
} as const;

// ---------------------------------------------------------------------------
// Full schema definition for the getSchema tool
// ---------------------------------------------------------------------------

export type ColumnDef = {
  column: string;
  type: string;
  description: string;
};

export const FACILITIES_SCHEMA: ColumnDef[] = [
  // Core
  { column: "id", type: "serial", description: "Primary key (auto-increment)" },
  { column: "pk_unique_id", type: "integer", description: "Original source unique ID" },
  { column: "name", type: "text", description: "Facility name (NOT NULL)" },
  { column: "source_url", type: "text", description: "URL the data was scraped from" },

  // Classification
  { column: "facility_type", type: "text", description: "Type: hospital, clinic, doctor, pharmacy, dentist" },
  { column: "operator_type", type: "text", description: "Operator: public, private" },
  { column: "organization_type", type: "text", description: "Organization classification" },

  // Location
  { column: "address_line1", type: "text", description: "Street address" },
  { column: "address_city", type: "text", description: "City name" },
  { column: "address_region", type: "text", description: "Administrative region" },
  { column: "address_country", type: "text", description: "Country name" },
  { column: "country_code", type: "text", description: "ISO country code (e.g., GH, NG, KE)" },
  { column: "lat", type: "double precision", description: "Latitude coordinate" },
  { column: "lng", type: "double precision", description: "Longitude coordinate" },

  // Capacity
  { column: "num_doctors", type: "integer", description: "Number of doctors (often null — ~600 nulls)" },
  { column: "capacity", type: "integer", description: "Bed count (often null — ~700 nulls)" },
  { column: "area_sqm", type: "integer", description: "Facility area in square meters" },
  { column: "year_established", type: "integer", description: "Year the facility was established" },

  // Contact
  { column: "phone", type: "text", description: "Phone number" },
  { column: "email", type: "text", description: "Email address" },
  { column: "website", type: "text", description: "Website URL" },
  { column: "official_website", type: "text", description: "Official website URL" },
  { column: "facebook", type: "text", description: "Facebook page URL" },
  { column: "twitter", type: "text", description: "Twitter/X handle or URL" },

  // Free-text fields (IDP core)
  { column: "specialties_raw", type: "text", description: "Raw free-text specialties (use ILIKE for search)" },
  { column: "procedures_raw", type: "text", description: "Raw free-text procedures (use ILIKE for search)" },
  { column: "equipment_raw", type: "text", description: "Raw free-text equipment (use ILIKE for search)" },
  { column: "capabilities_raw", type: "text", description: "Raw free-text capabilities (use ILIKE for search)" },
  { column: "description", type: "text", description: "General description of the facility" },
  { column: "mission_statement", type: "text", description: "Facility mission statement" },
  { column: "org_description", type: "text", description: "Organization description" },

  // Parsed arrays (structured from free-text)
  { column: "specialties", type: "text[]", description: "Parsed array of specialties (use ANY() for filtering)" },
  { column: "procedures", type: "text[]", description: "Parsed array of procedures (use ANY() for filtering)" },
  { column: "equipment", type: "text[]", description: "Parsed array of equipment (use ANY() for filtering)" },
  { column: "capabilities", type: "text[]", description: "Parsed array of capabilities (use ANY() for filtering)" },
  { column: "affiliation_types", type: "text[]", description: "Parsed array of affiliation types" },

  // Other
  { column: "accepts_volunteers", type: "boolean", description: "Whether the facility accepts volunteers" },
  { column: "created_at", type: "timestamp", description: "Record creation timestamp" },
];

// ---------------------------------------------------------------------------
// Compact column hint for error messages
// ---------------------------------------------------------------------------

const KEY_COLUMNS = [
  "id", "name", "facility_type", "operator_type",
  "address_region", "address_city", "lat", "lng",
  "num_doctors", "capacity", "specialties", "procedures",
  "equipment", "specialties_raw", "procedures_raw",
  "equipment_raw", "description", "accepts_volunteers",
];

export const FACILITIES_COLUMNS_HINT =
  `Available columns include: ${KEY_COLUMNS.join(", ")}, and more. Use the getSchema tool for the full list.`;

// ---------------------------------------------------------------------------
// Demographics tables schema definitions
// ---------------------------------------------------------------------------

export const DEMOGRAPHICS_COUNTRIES_SCHEMA: ColumnDef[] = [
  { column: "country_code", type: "varchar(3)", description: "ISO 3166-1 alpha-3 country code (PK, e.g. GHA, NGA, KEN)" },
  { column: "country_name", type: "text", description: "Country name (NOT NULL)" },
  { column: "total_population", type: "bigint", description: "Total population (national)" },
  { column: "gdp_per_capita_usd", type: "double precision", description: "GDP per capita in USD" },
  { column: "doctors_per_1000", type: "double precision", description: "Physicians per 1,000 people" },
  { column: "nurses_per_1000", type: "double precision", description: "Nurses/midwives per 1,000 people" },
  { column: "beds_per_1000", type: "double precision", description: "Hospital beds per 1,000 people" },
  { column: "maternal_mortality_per_100k", type: "double precision", description: "Maternal mortality ratio per 100,000 live births" },
  { column: "under5_mortality_per_1k", type: "double precision", description: "Under-5 mortality rate per 1,000 live births" },
  { column: "life_expectancy", type: "double precision", description: "Life expectancy at birth (years)" },
  { column: "data_source", type: "text", description: "Data source (e.g. World Bank API 2024)" },
  { column: "updated_at", type: "timestamp", description: "Last update timestamp" },
];

export const DEMOGRAPHICS_REGIONS_SCHEMA: ColumnDef[] = [
  { column: "id", type: "serial", description: "Primary key (auto-increment)" },
  { column: "country_code", type: "varchar(3)", description: "ISO country code (FK to demographics_countries)" },
  { column: "region", type: "text", description: "Region name (NOT NULL)" },
  { column: "capital", type: "text", description: "Regional capital city" },
  { column: "population", type: "bigint", description: "Total population" },
  { column: "urban_percent", type: "double precision", description: "Urban population percentage" },
  { column: "rural_percent", type: "double precision", description: "Rural population percentage" },
  { column: "area_sq_km", type: "double precision", description: "Area in square kilometers" },
  { column: "population_density", type: "double precision", description: "Population density per sq km" },
  { column: "classification", type: "text", description: "Classification: urban-heavy, semi-urban, rural-heavy" },
  { column: "gdp_per_capita_usd", type: "double precision", description: "Regional GDP per capita (USD)" },
  { column: "age_under15_pct", type: "double precision", description: "Percentage of population under 15" },
  { column: "age_working_pct", type: "double precision", description: "Percentage of working-age population (15-64)" },
  { column: "age_over65_pct", type: "double precision", description: "Percentage of population over 65" },
  { column: "maternal_mortality_per_100k", type: "double precision", description: "Regional maternal mortality per 100,000 live births" },
  { column: "under5_mortality_per_1k", type: "double precision", description: "Regional under-5 mortality per 1,000 live births" },
  { column: "doctors_per_1000", type: "double precision", description: "Doctors per 1,000 people" },
  { column: "nurses_per_1000", type: "double precision", description: "Nurses per 1,000 people" },
  { column: "disease_burden", type: "text[]", description: "Common diseases in the region (use ANY() for filtering)" },
  { column: "data_source", type: "text", description: "Data source" },
  { column: "updated_at", type: "timestamp", description: "Last update timestamp" },
];

export const DEMOGRAPHICS_BENCHMARKS_SCHEMA: ColumnDef[] = [
  { column: "id", type: "serial", description: "Primary key (auto-increment)" },
  { column: "benchmark_name", type: "text", description: "Benchmark name: WHO Minimum, Developed Country Average (UNIQUE)" },
  { column: "doctors_per_1000", type: "double precision", description: "Doctors per 1,000 people" },
  { column: "nurses_per_1000", type: "double precision", description: "Nurses per 1,000 people" },
  { column: "beds_per_1000", type: "double precision", description: "Hospital beds per 1,000 people" },
  { column: "maternal_mortality_per_100k", type: "double precision", description: "Maternal mortality per 100,000 live births" },
  { column: "under5_mortality_per_1k", type: "double precision", description: "Under-5 mortality per 1,000 live births" },
  { column: "ophthalmologists_per_capita", type: "double precision", description: "Ophthalmologists per capita" },
  { column: "surgeons_per_capita", type: "double precision", description: "Surgeons per capita" },
  { column: "operating_rooms_per_100k", type: "double precision", description: "Operating rooms per 100,000 people" },
  { column: "data_source", type: "text", description: "Data source" },
  { column: "updated_at", type: "timestamp", description: "Last update timestamp" },
];

/** All demographics schemas combined for the getSchema tool. */
export const ALL_DEMOGRAPHICS_SCHEMAS = {
  demographics_countries: DEMOGRAPHICS_COUNTRIES_SCHEMA,
  demographics_regions: DEMOGRAPHICS_REGIONS_SCHEMA,
  demographics_benchmarks: DEMOGRAPHICS_BENCHMARKS_SCHEMA,
};
