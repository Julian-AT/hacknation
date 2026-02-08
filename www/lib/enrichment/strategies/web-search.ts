/**
 * Web search enrichment strategy.
 *
 * Uses Firecrawl to search the web for facility information,
 * then extracts structured data from the top results.
 */

import FirecrawlApp from "@mendable/firecrawl-js";
import type { Facility, ProposedChange, StrategyResult } from "../detect-gaps";

function getFirecrawlClient(): FirecrawlApp | null {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new FirecrawlApp({ apiKey });
}

/**
 * Parse a numeric value from various formats.
 */
function parseNumeric(raw: unknown): number | null {
  if (typeof raw === "number") {
    return Number.isFinite(raw) ? raw : null;
  }
  if (typeof raw === "string") {
    const cleaned = raw.replace(/[,\s]/g, "");
    const num = Number.parseInt(cleaned, 10);
    return Number.isNaN(num) ? null : num;
  }
  return null;
}

/**
 * Try multiple keys to find a value in extracted data.
 */
function extractField(
  data: Record<string, unknown>,
  ...keys: string[]
): unknown {
  for (const key of keys) {
    const val = data[key];
    if (val !== undefined && val !== null && val !== "") {
      return val;
    }
  }
  return null;
}

export async function webSearchStrategy(
  facility: Facility
): Promise<StrategyResult> {
  const changes: ProposedChange[] = [];
  const client = getFirecrawlClient();

  if (!client) {
    return { strategy: "web-search", changes };
  }

  try {
    const city = facility.addressCity ?? "";
    const query = `"${facility.name}" ${city} Ghana healthcare facility`;

    // Step 1: Search for the facility
    const searchData = await client.search(query, { limit: 3 });
    // Firecrawl v4 returns { web: [...], news: [...] }
    const webResults =
      ((searchData as Record<string, unknown>).web as
        | Array<Record<string, unknown>>
        | undefined) ?? [];

    if (webResults.length === 0) {
      return { strategy: "web-search", changes };
    }

    // Step 2: Get URLs from search results
    const urls: string[] = [];
    for (const result of webResults) {
      const url = String(result.url ?? "");
      if (url.length > 0) {
        urls.push(url);
      }
    }

    if (urls.length === 0) {
      return { strategy: "web-search", changes };
    }

    const sourceUrl = urls[0];

    // Step 3: Extract structured data from top results
    const extractResult = await client.extract({
      urls: urls.slice(0, 2),
      prompt: [
        "Extract the following healthcare facility information if available:",
        "- number_of_doctors: total number of doctors/physicians (integer)",
        "- number_of_beds: total bed capacity (integer)",
        "- area_sqm: facility area in square meters (integer)",
        "- year_established: year the facility was founded (integer, e.g. 1992)",
        "- specialties: medical specialties offered (comma-separated string)",
        "- procedures: medical procedures performed (comma-separated string)",
        "- equipment: medical equipment available (comma-separated string)",
        "- region: administrative region or state",
        "- description: brief description of the facility",
        "Return only fields with clear factual data found on the page.",
      ].join("\n"),
    });

    if (!extractResult.success || !extractResult.data) {
      return { strategy: "web-search", changes };
    }

    const data = extractResult.data as Record<string, unknown>;

    // Step 4: Map extracted data to proposed changes
    if (!facility.numDoctors) {
      const val = parseNumeric(
        extractField(
          data,
          "number_of_doctors",
          "numberOfDoctors",
          "doctors",
          "physician_count"
        )
      );
      if (val !== null && val > 0) {
        changes.push({
          field: "num_doctors",
          value: val,
          source: sourceUrl,
          confidence: "medium",
        });
      }
    }

    if (!facility.capacity) {
      const val = parseNumeric(
        extractField(
          data,
          "number_of_beds",
          "numberOfBeds",
          "beds",
          "bed_capacity",
          "capacity"
        )
      );
      if (val !== null && val > 0) {
        changes.push({
          field: "capacity",
          value: val,
          source: sourceUrl,
          confidence: "medium",
        });
      }
    }

    if (!facility.areaSqm) {
      const val = parseNumeric(
        extractField(data, "area_sqm", "areaSqm", "area")
      );
      if (val !== null && val > 0) {
        changes.push({
          field: "area_sqm",
          value: val,
          source: sourceUrl,
          confidence: "low",
        });
      }
    }

    if (!facility.yearEstablished) {
      const val = parseNumeric(
        extractField(
          data,
          "year_established",
          "yearEstablished",
          "year_founded",
          "founded"
        )
      );
      if (val !== null && val >= 1800 && val <= 2026) {
        changes.push({
          field: "year_established",
          value: val,
          source: sourceUrl,
          confidence: "medium",
        });
      }
    }

    if (!facility.specialties?.length) {
      const val = extractField(data, "specialties", "medical_specialties");
      if (typeof val === "string" && val.length > 0) {
        changes.push({
          field: "specialties_raw",
          value: val,
          source: sourceUrl,
          confidence: "medium",
        });
      }
    }

    if (!facility.procedures?.length) {
      const val = extractField(
        data,
        "procedures",
        "medical_procedures",
        "services"
      );
      if (typeof val === "string" && val.length > 0) {
        changes.push({
          field: "procedures_raw",
          value: val,
          source: sourceUrl,
          confidence: "medium",
        });
      }
    }

    if (!facility.equipment?.length) {
      const val = extractField(data, "equipment", "medical_equipment");
      if (typeof val === "string" && val.length > 0) {
        changes.push({
          field: "equipment_raw",
          value: val,
          source: sourceUrl,
          confidence: "medium",
        });
      }
    }

    if (!facility.addressRegion) {
      const val = extractField(
        data,
        "region",
        "state",
        "administrative_region"
      );
      if (typeof val === "string" && val.length > 0) {
        changes.push({
          field: "address_region",
          value: val,
          source: sourceUrl,
          confidence: "medium",
        });
      }
    }

    if (!facility.description) {
      const val = extractField(data, "description", "about", "summary");
      if (typeof val === "string" && val.length > 10) {
        changes.push({
          field: "description",
          value: val,
          source: sourceUrl,
          confidence: "medium",
        });
      }
    }

    return { strategy: "web-search", changes };
  } catch (error: unknown) {
    console.error(
      "[Enrichment:web-search] Failed:",
      error instanceof Error ? error.message : error
    );
    return { strategy: "web-search", changes };
  }
}
