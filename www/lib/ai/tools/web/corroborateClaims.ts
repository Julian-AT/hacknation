import { z } from "zod";
import { tool } from "ai";
import FirecrawlApp from "@mendable/firecrawl-js";
import { db } from "../../../db";
import { facilities } from "../../../db/schema.facilities";
import { eq, ilike, and, isNotNull } from "drizzle-orm";
import { createToolLogger } from "../debug";
import { withTimeout, DB_QUERY_TIMEOUT_MS } from "../safeguards";

/**
 * Multi-Source Corroboration Tool — verifies facility claims across independent web sources.
 *
 * Covers VF Agent questions:
 * - 3.5: Which procedures/equipment claims are most often corroborated by multiple independent websites?
 * - 4.1: What correlation exists between website quality indicators and actual facility capabilities?
 *
 * Workflow:
 * 1. Retrieve facility data from the database
 * 2. Extract key claims (procedures, specialties, equipment)
 * 3. Search the web for independent mentions of the facility + its claims
 * 4. Compare findings to build a corroboration report
 */

function getFirecrawlClient() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error("FIRECRAWL_API_KEY environment variable is not set");
  }
  return new FirecrawlApp({ apiKey });
}

interface CorroborationResult {
  facilityId: number;
  facilityName: string;
  region: string | null;
  /** Key claims extracted from the database record */
  claimsFromDatabase: {
    procedures: string[];
    specialties: string[];
    equipment: string[];
  };
  /** Web sources found */
  webSources: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
  /** Claims that were corroborated by at least one web source */
  corroboratedClaims: string[];
  /** Claims with no web corroboration found */
  uncorroboratedClaims: string[];
  /** Website quality indicators */
  websiteQuality: {
    hasOfficialWebsite: boolean;
    hasSocialMedia: boolean;
    webSourceCount: number;
    qualityScore: "high" | "medium" | "low" | "none";
  };
  /** Overall corroboration confidence */
  corroborationRate: number;
}

export const corroborateClaims = tool({
  description:
    "Verify facility claims by searching for independent web sources that confirm or contradict the facility's stated procedures, specialties, and equipment. Also assesses website quality indicators. Use to determine claim reliability and detect potential misrepresentation.",
  inputSchema: z.object({
    facilityId: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Corroborate claims for a specific facility by ID"),
    facilityName: z
      .string()
      .max(200)
      .optional()
      .describe("Corroborate claims for a facility by name (fuzzy match)"),
    region: z
      .string()
      .max(100)
      .optional()
      .describe("Corroborate facilities in a region (picks top 3 with most claims)"),
    maxWebSearches: z
      .number()
      .min(1)
      .max(5)
      .default(3)
      .describe("Maximum number of web searches to perform per facility"),
  }),
  execute: async ({ facilityId, facilityName, region, maxWebSearches }, { abortSignal }) => {
    const log = createToolLogger("corroborateClaims");
    const start = Date.now();
    log.start({ facilityId, facilityName, region, maxWebSearches });

    try {
      // 1. Retrieve facilities from database
      const conditions = [isNotNull(facilities.id)];
      if (facilityId) {
        conditions.push(eq(facilities.id, facilityId));
      }
      if (facilityName) {
        conditions.push(ilike(facilities.name, `%${facilityName}%`));
      }
      if (region) {
        conditions.push(ilike(facilities.addressRegion, `%${region}%`));
      }

      const rows = await withTimeout(
        db
          .select({
            id: facilities.id,
            name: facilities.name,
            procedures: facilities.procedures,
            specialties: facilities.specialties,
            equipment: facilities.equipment,
            proceduresRaw: facilities.proceduresRaw,
            specialtiesRaw: facilities.specialtiesRaw,
            equipmentRaw: facilities.equipmentRaw,
            website: facilities.website,
            officialWebsite: facilities.officialWebsite,
            facebook: facilities.facebook,
            twitter: facilities.twitter,
            region: facilities.addressRegion,
            city: facilities.addressCity,
            country: facilities.addressCountry,
          })
          .from(facilities)
          .where(and(...conditions))
          .limit(facilityId || facilityName ? 1 : 3),
        DB_QUERY_TIMEOUT_MS,
        abortSignal
      );

      if (rows.length === 0) {
        return { error: "No facilities found matching the criteria" };
      }

      log.step("Facilities to corroborate", rows.length);

      let client: FirecrawlApp;
      try {
        client = getFirecrawlClient();
      } catch {
        // If no API key, do database-only analysis
        log.step("No Firecrawl API key — performing database-only analysis");
        const results: CorroborationResult[] = rows.map((fac) => {
          const procs = fac.procedures ?? [];
          const specs = fac.specialties ?? [];
          const equip = fac.equipment ?? [];
          const hasWebsite = Boolean(fac.website || fac.officialWebsite);
          const hasSocial = Boolean(fac.facebook || fac.twitter);

          return {
            facilityId: fac.id,
            facilityName: fac.name,
            region: fac.region,
            claimsFromDatabase: {
              procedures: procs.slice(0, 10),
              specialties: specs.slice(0, 10),
              equipment: equip.slice(0, 10),
            },
            webSources: [],
            corroboratedClaims: [],
            uncorroboratedClaims: [...procs.slice(0, 5), ...specs.slice(0, 5)],
            websiteQuality: {
              hasOfficialWebsite: hasWebsite,
              hasSocialMedia: hasSocial,
              webSourceCount: 0,
              qualityScore: hasWebsite ? (hasSocial ? "medium" : "low") : "none",
            },
            corroborationRate: 0,
          };
        });

        return {
          facilitiesChecked: rows.length,
          note: "Web search unavailable (no FIRECRAWL_API_KEY). Results based on database analysis only.",
          results,
        };
      }

      // 2. For each facility, search the web and corroborate
      const results: CorroborationResult[] = [];

      for (const fac of rows) {
        if (abortSignal?.aborted) {
          return { error: "Operation was aborted" };
        }

        const procs = fac.procedures ?? [];
        const specs = fac.specialties ?? [];
        const equip = fac.equipment ?? [];
        const allClaims = [...procs.slice(0, 5), ...specs.slice(0, 5)];

        // Website quality assessment
        const hasWebsite = Boolean(fac.website || fac.officialWebsite);
        const hasSocial = Boolean(fac.facebook || fac.twitter);

        // Build search queries
        const searchQueries: string[] = [];
        // Primary: facility name + location
        const country = fac.country ?? fac.city ?? "";
        searchQueries.push(`"${fac.name}" ${country} hospital`);
        // Secondary: facility name + top claims
        if (procs.length > 0) {
          searchQueries.push(`"${fac.name}" ${procs.slice(0, 3).join(" ")}`);
        }
        if (specs.length > 0) {
          searchQueries.push(`"${fac.name}" ${specs.slice(0, 3).join(" ")}`);
        }

        // Execute web searches
        const webSources: Array<{ title: string; url: string; snippet: string }> = [];

        for (const query of searchQueries.slice(0, maxWebSearches)) {
          if (abortSignal?.aborted) break;
          try {
            const searchData = await client.search(query, { limit: 3 });
            const webResults = searchData.web ?? [];
            for (const result of webResults) {
              const r = result as Record<string, unknown>;
              const source = {
                title: String(r.title ?? "No title"),
                url: String(r.url ?? ""),
                snippet: String(r.description ?? r.summary ?? r.markdown ?? "").slice(0, 300),
              };
              // Avoid duplicates by URL
              if (!webSources.some((s) => s.url === source.url)) {
                webSources.push(source);
              }
            }
          } catch (e) {
            log.step("Web search failed for query", query);
          }
        }

        log.step(`Web sources found for ${fac.name}`, webSources.length);

        // 3. Check which claims are corroborated
        const allSnippets = webSources.map((s) => s.snippet.toLowerCase()).join(" ");
        const allTitles = webSources.map((s) => s.title.toLowerCase()).join(" ");
        const combinedWebText = `${allSnippets} ${allTitles}`;

        const corroboratedClaims: string[] = [];
        const uncorroboratedClaims: string[] = [];

        for (const claim of allClaims) {
          const claimLower = claim.toLowerCase();
          // Check if any web source mentions this claim
          if (combinedWebText.includes(claimLower)) {
            corroboratedClaims.push(claim);
          } else {
            // Try partial matching (e.g., "cataract" matching "cataract surgery")
            const words = claimLower.split(" ").filter((w) => w.length > 3);
            const hasPartialMatch = words.some((word) => combinedWebText.includes(word));
            if (hasPartialMatch) {
              corroboratedClaims.push(claim);
            } else {
              uncorroboratedClaims.push(claim);
            }
          }
        }

        const totalClaims = allClaims.length;
        const corroborationRate = totalClaims > 0
          ? Math.round((corroboratedClaims.length / totalClaims) * 100) / 100
          : 0;

        // Quality score
        let qualityScore: "high" | "medium" | "low" | "none" = "none";
        if (webSources.length >= 3 && hasWebsite) {
          qualityScore = "high";
        } else if (webSources.length >= 1 || hasWebsite) {
          qualityScore = hasSocial ? "medium" : "low";
        }

        results.push({
          facilityId: fac.id,
          facilityName: fac.name,
          region: fac.region,
          claimsFromDatabase: {
            procedures: procs.slice(0, 10),
            specialties: specs.slice(0, 10),
            equipment: equip.slice(0, 10),
          },
          webSources: webSources.slice(0, 5),
          corroboratedClaims,
          uncorroboratedClaims,
          websiteQuality: {
            hasOfficialWebsite: hasWebsite,
            hasSocialMedia: hasSocial,
            webSourceCount: webSources.length,
            qualityScore,
          },
          corroborationRate,
        });
      }

      const output = {
        facilitiesChecked: results.length,
        results,
        summary: {
          avgCorroborationRate: results.length > 0
            ? Math.round(results.reduce((sum, r) => sum + r.corroborationRate, 0) / results.length * 100)
            : 0,
          facilitiesWithHighQuality: results.filter((r) => r.websiteQuality.qualityScore === "high").length,
          facilitiesWithNoWebPresence: results.filter((r) => r.websiteQuality.qualityScore === "none").length,
        },
      };

      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown corroboration error";
      log.error(error, { facilityId, facilityName, region }, Date.now() - start);
      return { error: `Claim corroboration failed: ${message}` };
    }
  },
});
