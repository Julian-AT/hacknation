
/**
 * Ghana Population & Demographics Data
 *
 * Static dataset of Ghana's 16 regions with population, demographics, and economic indicators.
 * Sources: Ghana Statistical Service (2021 Population & Housing Census), World Bank, WHO.
 *
 * This data unblocks VF Agent questions in categories 9 (Unmet Needs & Demand Analysis)
 * and 10 (Benchmarking & Comparative Analysis): 2.4, 9.1–9.6, 10.1–10.4.
 */

export interface RegionDemographics {
  /** Region name as stored in the facilities database */
  region: string;
  /** Total population (2021 Census) */
  population: number;
  /** Urban population percentage */
  urbanPercent: number;
  /** Rural population percentage */
  ruralPercent: number;
  /** Area in square kilometers */
  areaSqKm: number;
  /** Population density per sq km */
  populationDensity: number;
  /** Classification: urban-heavy, semi-urban, rural-heavy */
  classification: "urban-heavy" | "semi-urban" | "rural-heavy";
  /** Estimated GDP per capita in USD (purchasing power parity) */
  gdpPerCapitaUsd: number;
  /** Age distribution */
  ageDistribution: {
    /** 0-14 years (%) */
    under15: number;
    /** 15-64 years (%) */
    working: number;
    /** 65+ years (%) */
    over65: number;
  };
  /** Key health indicators */
  healthIndicators: {
    /** Maternal mortality ratio per 100,000 live births (regional estimate) */
    maternalMortalityPer100k: number;
    /** Under-5 mortality rate per 1,000 live births */
    under5MortalityPer1k: number;
    /** Estimated doctor-to-population ratio */
    doctorsPerCapita: number;
    /** Estimated nurse-to-population ratio */
    nursesPerCapita: number;
  };
  /** Common disease burden / prevalent conditions */
  diseaseBurden: string[];
  /** Regional capital */
  capital: string;
}

/**
 * WHO benchmark ratios for comparison (Q10.1).
 */
export const WHO_BENCHMARKS = {
  /** WHO minimum: 1 doctor per 1,000 population */
  doctorsPerCapita: 1 / 1_000,
  /** WHO minimum: 1 nurse/midwife per 500 population */
  nursesPerCapita: 1 / 500,
  /** Ophthalmologist target: 1 per 250,000 */
  ophthalmologistsPerCapita: 1 / 250_000,
  /** Surgeon target: 1 per 15,000-20,000 */
  surgeonsPerCapita: 1 / 20_000,
  /** Hospital beds per 1,000 population (WHO min ~2.5) */
  bedsPerCapita: 2.5 / 1_000,
  /** OR per 100,000 population (WHO target ~14) */
  operatingRoomsPer100k: 14,
};

/**
 * Developed country averages for comparison (Q10.1).
 */
export const DEVELOPED_COUNTRY_AVERAGES = {
  doctorsPerCapita: 3.5 / 1_000,
  nursesPerCapita: 9 / 1_000,
  bedsPerCapita: 4.7 / 1_000,
  maternalMortalityPer100k: 11,
  under5MortalityPer1k: 5,
};

/**
 * Ghana national averages.
 */
export const GHANA_NATIONAL = {
  totalPopulation: 30_832_019,
  gdpPerCapitaUsd: 2_445,
  doctorsPerCapita: 0.18 / 1_000,
  nursesPerCapita: 1.3 / 1_000,
  bedsPerCapita: 0.9 / 1_000,
  maternalMortalityPer100k: 308,
  under5MortalityPer1k: 48,
  lifeExpectancy: 64,
};

/**
 * Population data by region (16 regions of Ghana).
 * Based on 2021 Population and Housing Census data.
 */
export const GHANA_REGIONS: RegionDemographics[] = [
  {
    region: "Greater Accra",
    population: 5_455_692,
    urbanPercent: 90.5,
    ruralPercent: 9.5,
    areaSqKm: 3_245,
    populationDensity: 1_681,
    classification: "urban-heavy",
    gdpPerCapitaUsd: 4_200,
    capital: "Accra",
    ageDistribution: { under15: 28.5, working: 66.2, over65: 5.3 },
    healthIndicators: {
      maternalMortalityPer100k: 150,
      under5MortalityPer1k: 35,
      doctorsPerCapita: 0.35 / 1_000,
      nursesPerCapita: 2.1 / 1_000,
    },
    diseaseBurden: ["malaria", "hypertension", "diabetes", "respiratory infections", "road traffic injuries"],
  },
  {
    region: "Ashanti",
    population: 5_432_485,
    urbanPercent: 60.6,
    ruralPercent: 39.4,
    areaSqKm: 24_389,
    populationDensity: 223,
    classification: "semi-urban",
    gdpPerCapitaUsd: 2_800,
    capital: "Kumasi",
    ageDistribution: { under15: 35.2, working: 60.1, over65: 4.7 },
    healthIndicators: {
      maternalMortalityPer100k: 250,
      under5MortalityPer1k: 45,
      doctorsPerCapita: 0.22 / 1_000,
      nursesPerCapita: 1.5 / 1_000,
    },
    diseaseBurden: ["malaria", "diarrheal diseases", "pneumonia", "hypertension", "sickle cell"],
  },
  {
    region: "Western",
    population: 1_924_577,
    urbanPercent: 42.4,
    ruralPercent: 57.6,
    areaSqKm: 13_842,
    populationDensity: 139,
    classification: "rural-heavy",
    gdpPerCapitaUsd: 2_100,
    capital: "Sekondi-Takoradi",
    ageDistribution: { under15: 37.1, working: 58.5, over65: 4.4 },
    healthIndicators: {
      maternalMortalityPer100k: 320,
      under5MortalityPer1k: 52,
      doctorsPerCapita: 0.12 / 1_000,
      nursesPerCapita: 1.0 / 1_000,
    },
    diseaseBurden: ["malaria", "skin diseases", "diarrheal diseases", "anemia", "helminth infections"],
  },
  {
    region: "Eastern",
    population: 2_916_485,
    urbanPercent: 43.1,
    ruralPercent: 56.9,
    areaSqKm: 19_323,
    populationDensity: 151,
    classification: "rural-heavy",
    gdpPerCapitaUsd: 1_950,
    capital: "Koforidua",
    ageDistribution: { under15: 36.8, working: 58.8, over65: 4.4 },
    healthIndicators: {
      maternalMortalityPer100k: 310,
      under5MortalityPer1k: 50,
      doctorsPerCapita: 0.10 / 1_000,
      nursesPerCapita: 1.1 / 1_000,
    },
    diseaseBurden: ["malaria", "buruli ulcer", "hypertension", "diarrheal diseases", "tuberculosis"],
  },
  {
    region: "Central",
    population: 2_563_228,
    urbanPercent: 47.1,
    ruralPercent: 52.9,
    areaSqKm: 9_826,
    populationDensity: 261,
    classification: "semi-urban",
    gdpPerCapitaUsd: 1_800,
    capital: "Cape Coast",
    ageDistribution: { under15: 37.5, working: 57.8, over65: 4.7 },
    healthIndicators: {
      maternalMortalityPer100k: 350,
      under5MortalityPer1k: 55,
      doctorsPerCapita: 0.09 / 1_000,
      nursesPerCapita: 0.9 / 1_000,
    },
    diseaseBurden: ["malaria", "schistosomiasis", "diarrheal diseases", "anemia", "pneumonia"],
  },
  {
    region: "Volta",
    population: 1_651_269,
    urbanPercent: 34.0,
    ruralPercent: 66.0,
    areaSqKm: 9_528,
    populationDensity: 173,
    classification: "rural-heavy",
    gdpPerCapitaUsd: 1_600,
    capital: "Ho",
    ageDistribution: { under15: 36.2, working: 58.3, over65: 5.5 },
    healthIndicators: {
      maternalMortalityPer100k: 380,
      under5MortalityPer1k: 58,
      doctorsPerCapita: 0.07 / 1_000,
      nursesPerCapita: 0.8 / 1_000,
    },
    diseaseBurden: ["malaria", "schistosomiasis", "onchocerciasis", "diarrheal diseases", "anemia"],
  },
  {
    region: "Northern",
    population: 2_310_939,
    urbanPercent: 30.7,
    ruralPercent: 69.3,
    areaSqKm: 25_448,
    populationDensity: 91,
    classification: "rural-heavy",
    gdpPerCapitaUsd: 1_200,
    capital: "Tamale",
    ageDistribution: { under15: 42.1, working: 54.2, over65: 3.7 },
    healthIndicators: {
      maternalMortalityPer100k: 450,
      under5MortalityPer1k: 70,
      doctorsPerCapita: 0.05 / 1_000,
      nursesPerCapita: 0.7 / 1_000,
    },
    diseaseBurden: ["malaria", "meningitis", "guinea worm", "malnutrition", "diarrheal diseases"],
  },
  {
    region: "Upper East",
    population: 1_301_226,
    urbanPercent: 21.0,
    ruralPercent: 79.0,
    areaSqKm: 8_842,
    populationDensity: 147,
    classification: "rural-heavy",
    gdpPerCapitaUsd: 1_100,
    capital: "Bolgatanga",
    ageDistribution: { under15: 40.5, working: 55.0, over65: 4.5 },
    healthIndicators: {
      maternalMortalityPer100k: 500,
      under5MortalityPer1k: 72,
      doctorsPerCapita: 0.04 / 1_000,
      nursesPerCapita: 0.6 / 1_000,
    },
    diseaseBurden: ["malaria", "meningitis", "malnutrition", "tuberculosis", "trachoma"],
  },
  {
    region: "Upper West",
    population: 901_502,
    urbanPercent: 16.3,
    ruralPercent: 83.7,
    areaSqKm: 18_476,
    populationDensity: 49,
    classification: "rural-heavy",
    gdpPerCapitaUsd: 1_050,
    capital: "Wa",
    ageDistribution: { under15: 41.8, working: 54.5, over65: 3.7 },
    healthIndicators: {
      maternalMortalityPer100k: 520,
      under5MortalityPer1k: 75,
      doctorsPerCapita: 0.03 / 1_000,
      nursesPerCapita: 0.5 / 1_000,
    },
    diseaseBurden: ["malaria", "meningitis", "malnutrition", "guinea worm", "diarrheal diseases"],
  },
  {
    region: "Brong-Ahafo",
    population: 1_824_822,
    urbanPercent: 44.5,
    ruralPercent: 55.5,
    areaSqKm: 15_892,
    populationDensity: 115,
    classification: "rural-heavy",
    gdpPerCapitaUsd: 1_700,
    capital: "Sunyani",
    ageDistribution: { under15: 37.0, working: 58.5, over65: 4.5 },
    healthIndicators: {
      maternalMortalityPer100k: 340,
      under5MortalityPer1k: 53,
      doctorsPerCapita: 0.08 / 1_000,
      nursesPerCapita: 0.9 / 1_000,
    },
    diseaseBurden: ["malaria", "diarrheal diseases", "respiratory infections", "buruli ulcer"],
  },
  {
    region: "Savannah",
    population: 649_627,
    urbanPercent: 18.2,
    ruralPercent: 81.8,
    areaSqKm: 35_862,
    populationDensity: 18,
    classification: "rural-heavy",
    gdpPerCapitaUsd: 950,
    capital: "Damongo",
    ageDistribution: { under15: 43.5, working: 52.8, over65: 3.7 },
    healthIndicators: {
      maternalMortalityPer100k: 550,
      under5MortalityPer1k: 80,
      doctorsPerCapita: 0.02 / 1_000,
      nursesPerCapita: 0.4 / 1_000,
    },
    diseaseBurden: ["malaria", "meningitis", "malnutrition", "guinea worm", "tuberculosis"],
  },
  {
    region: "North East",
    population: 738_425,
    urbanPercent: 15.5,
    ruralPercent: 84.5,
    areaSqKm: 9_071,
    populationDensity: 81,
    classification: "rural-heavy",
    gdpPerCapitaUsd: 900,
    capital: "Nalerigu",
    ageDistribution: { under15: 44.0, working: 52.5, over65: 3.5 },
    healthIndicators: {
      maternalMortalityPer100k: 560,
      under5MortalityPer1k: 82,
      doctorsPerCapita: 0.02 / 1_000,
      nursesPerCapita: 0.4 / 1_000,
    },
    diseaseBurden: ["malaria", "meningitis", "malnutrition", "diarrheal diseases", "trachoma"],
  },
  {
    region: "Oti",
    population: 759_799,
    urbanPercent: 22.0,
    ruralPercent: 78.0,
    areaSqKm: 11_066,
    populationDensity: 69,
    classification: "rural-heavy",
    gdpPerCapitaUsd: 1_050,
    capital: "Dambai",
    ageDistribution: { under15: 41.0, working: 55.0, over65: 4.0 },
    healthIndicators: {
      maternalMortalityPer100k: 480,
      under5MortalityPer1k: 68,
      doctorsPerCapita: 0.03 / 1_000,
      nursesPerCapita: 0.5 / 1_000,
    },
    diseaseBurden: ["malaria", "onchocerciasis", "schistosomiasis", "diarrheal diseases"],
  },
  {
    region: "Bono East",
    population: 1_160_430,
    urbanPercent: 35.0,
    ruralPercent: 65.0,
    areaSqKm: 15_074,
    populationDensity: 77,
    classification: "rural-heavy",
    gdpPerCapitaUsd: 1_400,
    capital: "Techiman",
    ageDistribution: { under15: 38.5, working: 57.0, over65: 4.5 },
    healthIndicators: {
      maternalMortalityPer100k: 370,
      under5MortalityPer1k: 56,
      doctorsPerCapita: 0.06 / 1_000,
      nursesPerCapita: 0.7 / 1_000,
    },
    diseaseBurden: ["malaria", "diarrheal diseases", "respiratory infections", "buruli ulcer"],
  },
  {
    region: "Ahafo",
    population: 564_536,
    urbanPercent: 32.0,
    ruralPercent: 68.0,
    areaSqKm: 5_193,
    populationDensity: 109,
    classification: "rural-heavy",
    gdpPerCapitaUsd: 1_350,
    capital: "Goaso",
    ageDistribution: { under15: 38.0, working: 57.5, over65: 4.5 },
    healthIndicators: {
      maternalMortalityPer100k: 360,
      under5MortalityPer1k: 54,
      doctorsPerCapita: 0.05 / 1_000,
      nursesPerCapita: 0.6 / 1_000,
    },
    diseaseBurden: ["malaria", "diarrheal diseases", "respiratory infections", "buruli ulcer"],
  },
  {
    region: "Western North",
    population: 926_957,
    urbanPercent: 28.0,
    ruralPercent: 72.0,
    areaSqKm: 10_075,
    populationDensity: 92,
    classification: "rural-heavy",
    gdpPerCapitaUsd: 1_300,
    capital: "Sefwi Wiawso",
    ageDistribution: { under15: 39.0, working: 56.5, over65: 4.5 },
    healthIndicators: {
      maternalMortalityPer100k: 400,
      under5MortalityPer1k: 60,
      doctorsPerCapita: 0.04 / 1_000,
      nursesPerCapita: 0.5 / 1_000,
    },
    diseaseBurden: ["malaria", "yaws", "diarrheal diseases", "buruli ulcer", "anemia"],
  },
];

/**
 * Lookup a region by name (case-insensitive fuzzy matching).
 */
export function findRegion(name: string): RegionDemographics | undefined {
  const lower = name.toLowerCase();
  return GHANA_REGIONS.find(
    (r) =>
      r.region.toLowerCase() === lower ||
      r.region.toLowerCase().includes(lower) ||
      lower.includes(r.region.toLowerCase())
  );
}

/**
 * Get all regions sorted by a numeric key (descending).
 */
export function rankRegions(
  key: (r: RegionDemographics) => number,
  ascending = false
): RegionDemographics[] {
  const sorted = [...GHANA_REGIONS].sort((a, b) => key(b) - key(a));
  return ascending ? sorted.reverse() : sorted;
}
