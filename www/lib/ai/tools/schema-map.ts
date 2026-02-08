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
  { column: "address_region", type: "text", description: "One of 16 regions in Ghana" },
  { column: "address_country", type: "text", description: "Country (default: Ghana)" },
  { column: "country_code", type: "text", description: "ISO country code (default: GH)" },
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
