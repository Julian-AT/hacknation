import {
  bigint,
  doublePrecision,
  index,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// demographics_countries — one row per country (national-level indicators)
// ---------------------------------------------------------------------------

export const demographicsCountries = pgTable("demographics_countries", {
  countryCode: varchar("country_code", { length: 3 }).primaryKey(),
  countryName: text("country_name").notNull(),

  totalPopulation: bigint("total_population", { mode: "number" }),
  gdpPerCapitaUsd: doublePrecision("gdp_per_capita_usd"),
  doctorsPer1000: doublePrecision("doctors_per_1000"),
  nursesPer1000: doublePrecision("nurses_per_1000"),
  bedsPer1000: doublePrecision("beds_per_1000"),
  maternalMortalityPer100k: doublePrecision("maternal_mortality_per_100k"),
  under5MortalityPer1k: doublePrecision("under5_mortality_per_1k"),
  lifeExpectancy: doublePrecision("life_expectancy"),

  dataSource: text("data_source"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ---------------------------------------------------------------------------
// demographics_regions — regional data (16 rows for Ghana, extensible)
// ---------------------------------------------------------------------------

export const demographicsRegions = pgTable(
  "demographics_regions",
  {
    id: serial("id").primaryKey(),
    countryCode: varchar("country_code", { length: 3 }).notNull(),
    region: text("region").notNull(),
    capital: text("capital"),

    population: bigint("population", { mode: "number" }),
    urbanPercent: doublePrecision("urban_percent"),
    ruralPercent: doublePrecision("rural_percent"),
    areaSqKm: doublePrecision("area_sq_km"),
    populationDensity: doublePrecision("population_density"),
    classification: text("classification"), // urban-heavy | semi-urban | rural-heavy

    gdpPerCapitaUsd: doublePrecision("gdp_per_capita_usd"),

    // Age distribution
    ageUnder15Pct: doublePrecision("age_under15_pct"),
    ageWorkingPct: doublePrecision("age_working_pct"),
    ageOver65Pct: doublePrecision("age_over65_pct"),

    // Health indicators
    maternalMortalityPer100k: doublePrecision("maternal_mortality_per_100k"),
    under5MortalityPer1k: doublePrecision("under5_mortality_per_1k"),
    doctorsPer1000: doublePrecision("doctors_per_1000"),
    nursesPer1000: doublePrecision("nurses_per_1000"),

    // Disease burden
    diseaseBurden: text("disease_burden").array(),

    dataSource: text("data_source"),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    countryRegionUniq: uniqueIndex("idx_demo_region_uniq").on(
      table.countryCode,
      table.region
    ),
    countryIdx: index("idx_demo_region_country").on(table.countryCode),
  })
);

// ---------------------------------------------------------------------------
// demographics_benchmarks — WHO / developed country reference values
// ---------------------------------------------------------------------------

export const demographicsBenchmarks = pgTable("demographics_benchmarks", {
  id: serial("id").primaryKey(),
  benchmarkName: text("benchmark_name").notNull().unique(),

  doctorsPer1000: doublePrecision("doctors_per_1000"),
  nursesPer1000: doublePrecision("nurses_per_1000"),
  bedsPer1000: doublePrecision("beds_per_1000"),
  maternalMortalityPer100k: doublePrecision("maternal_mortality_per_100k"),
  under5MortalityPer1k: doublePrecision("under5_mortality_per_1k"),
  ophthalmologistsPerCapita: doublePrecision("ophthalmologists_per_capita"),
  surgeonsPerCapita: doublePrecision("surgeons_per_capita"),
  operatingRoomsPer100k: doublePrecision("operating_rooms_per_100k"),

  dataSource: text("data_source"),
  updatedAt: timestamp("updated_at").defaultNow(),
});
