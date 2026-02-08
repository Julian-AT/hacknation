import {
  boolean,
  doublePrecision,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  vector,
} from "drizzle-orm/pg-core";

export const facilities = pgTable(
  "facilities",
  {
    id: serial("id").primaryKey(),
    pkUniqueId: integer("pk_unique_id").unique(),
    name: text("name").notNull(),
    sourceUrl: text("source_url"),

    // Classification
    facilityType: text("facility_type"), // hospital | clinic | doctor | pharmacy | dentist
    operatorType: text("operator_type"), // public | private
    organizationType: text("organization_type"),

    // Location
    addressLine1: text("address_line1"),
    addressCity: text("address_city"),
    addressRegion: text("address_region"),
    addressCountry: text("address_country").default("Ghana"),
    countryCode: text("country_code").default("GH"),
    lat: doublePrecision("lat"),
    lng: doublePrecision("lng"),

    // Capacity signals
    numDoctors: integer("num_doctors"),
    capacity: integer("capacity"), // beds
    areaSqm: integer("area_sqm"),
    yearEstablished: integer("year_established"),

    // Contact
    phone: text("phone"),
    email: text("email"),
    website: text("website"),
    officialWebsite: text("official_website"),
    facebook: text("facebook"),
    twitter: text("twitter"),

    // === FREE-TEXT FIELDS (the IDP core) ===
    specialtiesRaw: text("specialties_raw"),
    proceduresRaw: text("procedures_raw"),
    equipmentRaw: text("equipment_raw"),
    capabilitiesRaw: text("capabilities_raw"),
    description: text("description"),
    missionStatement: text("mission_statement"),
    orgDescription: text("org_description"),

    // === PARSED ARRAYS (structured from free-text during seeding) ===
    specialties: text("specialties").array(),
    procedures: text("procedures").array(),
    equipment: text("equipment").array(),
    capabilities: text("capabilities").array(),

    // Affiliations
    affiliationTypes: text("affiliation_types").array(),
    acceptsVolunteers: boolean("accepts_volunteers"),

    // === VECTOR EMBEDDING (pgvector) ===
    // 1536 dimensions for text-embedding-3-small
    embedding: vector("embedding", { dimensions: 1536 }),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    regionIdx: index("idx_fac_region").on(table.addressRegion),
    cityIdx: index("idx_fac_city").on(table.addressCity),
    typeIdx: index("idx_fac_type").on(table.facilityType),
    geoIdx: index("idx_fac_geo").on(table.lat, table.lng),
  })
);
