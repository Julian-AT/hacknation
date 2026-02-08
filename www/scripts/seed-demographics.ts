/**
 * Seed script for demographics tables.
 *
 * Reads from the existing ghana-demographics.ts hardcoded data and inserts
 * into the demographics_countries, demographics_regions, and demographics_benchmarks
 * tables. Uses upsert (ON CONFLICT DO UPDATE) so it's safe to re-run.
 *
 * Usage:
 *   pnpm db:seed-demographics
 */

import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  demographicsBenchmarks,
  demographicsCountries,
  demographicsRegions,
} from "../lib/db/schema.demographics";
import {
  DEVELOPED_COUNTRY_AVERAGES,
  GHANA_NATIONAL,
  GHANA_REGIONS,
  WHO_BENCHMARKS,
} from "../lib/ghana-demographics";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

const client = postgres(connectionString);
const db = drizzle(client);

async function seed() {
  console.log("Seeding demographics tables...\n");

  // ── 1. Country-level data ─────────────────────────────────────────────
  console.log("  → demographics_countries (Ghana)");

  await db
    .insert(demographicsCountries)
    .values({
      countryCode: "GHA",
      countryName: "Ghana",
      totalPopulation: GHANA_NATIONAL.totalPopulation,
      gdpPerCapitaUsd: GHANA_NATIONAL.gdpPerCapitaUsd,
      doctorsPer1000: GHANA_NATIONAL.doctorsPerCapita * 1000,
      nursesPer1000: GHANA_NATIONAL.nursesPerCapita * 1000,
      bedsPer1000: GHANA_NATIONAL.bedsPerCapita * 1000,
      maternalMortalityPer100k: GHANA_NATIONAL.maternalMortalityPer100k,
      under5MortalityPer1k: GHANA_NATIONAL.under5MortalityPer1k,
      lifeExpectancy: GHANA_NATIONAL.lifeExpectancy,
      dataSource: "Ghana Statistical Service 2021 Census, World Bank",
    })
    .onConflictDoUpdate({
      target: demographicsCountries.countryCode,
      set: {
        countryName: "Ghana",
        totalPopulation: GHANA_NATIONAL.totalPopulation,
        gdpPerCapitaUsd: GHANA_NATIONAL.gdpPerCapitaUsd,
        doctorsPer1000: GHANA_NATIONAL.doctorsPerCapita * 1000,
        nursesPer1000: GHANA_NATIONAL.nursesPerCapita * 1000,
        bedsPer1000: GHANA_NATIONAL.bedsPerCapita * 1000,
        maternalMortalityPer100k: GHANA_NATIONAL.maternalMortalityPer100k,
        under5MortalityPer1k: GHANA_NATIONAL.under5MortalityPer1k,
        lifeExpectancy: GHANA_NATIONAL.lifeExpectancy,
        dataSource: "Ghana Statistical Service 2021 Census, World Bank",
        updatedAt: new Date(),
      },
    });

  console.log("    ✓ Ghana national data inserted");

  // ── 2. Regional data ──────────────────────────────────────────────────
  console.log(`  → demographics_regions (${GHANA_REGIONS.length} regions)`);

  for (const r of GHANA_REGIONS) {
    await db
      .insert(demographicsRegions)
      .values({
        countryCode: "GHA",
        region: r.region,
        capital: r.capital,
        population: r.population,
        urbanPercent: r.urbanPercent,
        ruralPercent: r.ruralPercent,
        areaSqKm: r.areaSqKm,
        populationDensity: r.populationDensity,
        classification: r.classification,
        gdpPerCapitaUsd: r.gdpPerCapitaUsd,
        ageUnder15Pct: r.ageDistribution.under15,
        ageWorkingPct: r.ageDistribution.working,
        ageOver65Pct: r.ageDistribution.over65,
        maternalMortalityPer100k: r.healthIndicators.maternalMortalityPer100k,
        under5MortalityPer1k: r.healthIndicators.under5MortalityPer1k,
        doctorsPer1000: r.healthIndicators.doctorsPerCapita * 1000,
        nursesPer1000: r.healthIndicators.nursesPerCapita * 1000,
        diseaseBurden: r.diseaseBurden,
        dataSource: "Ghana Statistical Service 2021 Census, WHO",
      })
      .onConflictDoUpdate({
        target: [demographicsRegions.countryCode, demographicsRegions.region],
        set: {
          capital: r.capital,
          population: r.population,
          urbanPercent: r.urbanPercent,
          ruralPercent: r.ruralPercent,
          areaSqKm: r.areaSqKm,
          populationDensity: r.populationDensity,
          classification: r.classification,
          gdpPerCapitaUsd: r.gdpPerCapitaUsd,
          ageUnder15Pct: r.ageDistribution.under15,
          ageWorkingPct: r.ageDistribution.working,
          ageOver65Pct: r.ageDistribution.over65,
          maternalMortalityPer100k: r.healthIndicators.maternalMortalityPer100k,
          under5MortalityPer1k: r.healthIndicators.under5MortalityPer1k,
          doctorsPer1000: r.healthIndicators.doctorsPerCapita * 1000,
          nursesPer1000: r.healthIndicators.nursesPerCapita * 1000,
          diseaseBurden: r.diseaseBurden,
          dataSource: "Ghana Statistical Service 2021 Census, WHO",
          updatedAt: new Date(),
        },
      });
  }

  console.log(`    ✓ ${GHANA_REGIONS.length} regions inserted`);

  // ── 3. Benchmarks ─────────────────────────────────────────────────────
  console.log("  → demographics_benchmarks");

  // WHO minimum benchmarks
  await db
    .insert(demographicsBenchmarks)
    .values({
      benchmarkName: "WHO Minimum",
      doctorsPer1000: WHO_BENCHMARKS.doctorsPerCapita * 1000,
      nursesPer1000: WHO_BENCHMARKS.nursesPerCapita * 1000,
      bedsPer1000: WHO_BENCHMARKS.bedsPerCapita * 1000,
      ophthalmologistsPerCapita: WHO_BENCHMARKS.ophthalmologistsPerCapita,
      surgeonsPerCapita: WHO_BENCHMARKS.surgeonsPerCapita,
      operatingRoomsPer100k: WHO_BENCHMARKS.operatingRoomsPer100k,
      dataSource: "WHO Guidelines",
    })
    .onConflictDoUpdate({
      target: demographicsBenchmarks.benchmarkName,
      set: {
        doctorsPer1000: WHO_BENCHMARKS.doctorsPerCapita * 1000,
        nursesPer1000: WHO_BENCHMARKS.nursesPerCapita * 1000,
        bedsPer1000: WHO_BENCHMARKS.bedsPerCapita * 1000,
        ophthalmologistsPerCapita: WHO_BENCHMARKS.ophthalmologistsPerCapita,
        surgeonsPerCapita: WHO_BENCHMARKS.surgeonsPerCapita,
        operatingRoomsPer100k: WHO_BENCHMARKS.operatingRoomsPer100k,
        dataSource: "WHO Guidelines",
        updatedAt: new Date(),
      },
    });

  // Developed country averages
  await db
    .insert(demographicsBenchmarks)
    .values({
      benchmarkName: "Developed Country Average",
      doctorsPer1000: DEVELOPED_COUNTRY_AVERAGES.doctorsPerCapita * 1000,
      nursesPer1000: DEVELOPED_COUNTRY_AVERAGES.nursesPerCapita * 1000,
      bedsPer1000: DEVELOPED_COUNTRY_AVERAGES.bedsPerCapita * 1000,
      maternalMortalityPer100k:
        DEVELOPED_COUNTRY_AVERAGES.maternalMortalityPer100k,
      under5MortalityPer1k: DEVELOPED_COUNTRY_AVERAGES.under5MortalityPer1k,
      dataSource: "World Bank / OECD averages",
    })
    .onConflictDoUpdate({
      target: demographicsBenchmarks.benchmarkName,
      set: {
        doctorsPer1000: DEVELOPED_COUNTRY_AVERAGES.doctorsPerCapita * 1000,
        nursesPer1000: DEVELOPED_COUNTRY_AVERAGES.nursesPerCapita * 1000,
        bedsPer1000: DEVELOPED_COUNTRY_AVERAGES.bedsPerCapita * 1000,
        maternalMortalityPer100k:
          DEVELOPED_COUNTRY_AVERAGES.maternalMortalityPer100k,
        under5MortalityPer1k: DEVELOPED_COUNTRY_AVERAGES.under5MortalityPer1k,
        dataSource: "World Bank / OECD averages",
        updatedAt: new Date(),
      },
    });

  console.log("    ✓ WHO Minimum + Developed Country Average inserted");

  console.log("\n✅ Demographics seeding complete!");
}

seed()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await client.end();
  });
