import { tool } from "ai";
import {
  and,
  cosineDistance,
  desc,
  eq,
  ilike,
  isNotNull,
  sql,
} from "drizzle-orm";
import { z } from "zod";
import { db } from "../../../db";
import { facilities } from "../../../db/schema.facilities";
import { embed } from "../../../embed";
import { createToolLogger } from "../debug";
import { DB_QUERY_TIMEOUT_MS, withTimeout } from "../safeguards";

/**
 * VS Index Point Lookup — targeted text evidence analysis on facility free-text fields.
 *
 * Unlike `searchFacilities` (which finds facilities matching a query),
 * this tool retrieves facilities and deeply analyzes their raw text for
 * specific evidence patterns. It combines vector search with pattern detection.
 *
 * Covers VF Agent questions:
 * - 3.2: Detect temporary/periodic equipment language
 * - 6.5: Evidence of surgical camps or temporary missions
 * - 6.6: Services tied to individuals vs institutions
 * - 7.4: Legacy vs newer equipment detection
 * - 8.4: NGO activity substituting for permanent capacity
 */

/**
 * Evidence pattern definitions — each category maps to one or more VF Agent questions.
 */
const EVIDENCE_CATEGORIES = {
  temporary_equipment: {
    label: "Temporary / Periodic Equipment",
    description:
      "Equipment that appears to be brought in periodically rather than permanently installed (Q3.2)",
    patterns: [
      "brought in",
      "borrowed",
      "shared equipment",
      "loaned",
      "mobile unit",
      "portable",
      "temporary",
      "on loan",
      "periodic",
      "intermittent",
      "seasonal",
      "donated temporarily",
      "equipment rotation",
      "shared with",
      "comes with",
    ],
  },
  surgical_camp: {
    label: "Surgical Camp / Temporary Mission Evidence",
    description:
      "Evidence of surgical camps or temporary medical missions rather than standing services (Q6.5, Q8.4)",
    patterns: [
      "surgical camp",
      "eye camp",
      "medical camp",
      "health camp",
      "screening camp",
      "dental camp",
      "medical mission",
      "outreach program",
      "community outreach",
      "field surgery",
      "ngo",
      "volunteer team",
      "international team",
      "mission trip",
      "charity",
      "free surgery",
      "sponsored",
      "funded by",
      "remote surgery",
      "humanitarian",
      "relief",
      "pop-up",
      "temporary clinic",
      "field hospital",
    ],
  },
  individual_tied: {
    label: "Individual-Tied Services",
    description:
      "Services that depend on specific individuals rather than institutions, implying fragile continuity (Q6.6)",
    patterns: [
      "dr.",
      "dr ",
      "professor ",
      "prof.",
      "prof ",
      "named surgeon",
      "the surgeon",
      "our surgeon",
      "sole practitioner",
      "one specialist",
      "single specialist",
      "only doctor",
      "only surgeon",
      "personal practice",
      "private practice of",
      "led by",
      "performed by",
      "consultant surgeon",
      "visiting consultant",
    ],
  },
  equipment_age: {
    label: "Equipment Age / Legacy Signals",
    description:
      "Indicators of older/legacy equipment vs newer modalities (Q7.4)",
    patterns: [
      // Legacy signals
      "analog",
      "film-based",
      "manual",
      "outdated",
      "old model",
      "refurbished",
      "second-hand",
      "secondhand",
      "donated equipment",
      "reconditioned",
      "legacy",
      // Modern signals
      "digital",
      "latest",
      "state-of-the-art",
      "new",
      "recently acquired",
      "upgraded",
      "modern",
      "latest generation",
      "brand new",
      "newly installed",
    ],
    /** Patterns split into legacy vs modern for classification */
    subCategories: {
      legacy: [
        "analog",
        "film-based",
        "manual",
        "outdated",
        "old model",
        "refurbished",
        "second-hand",
        "secondhand",
        "donated equipment",
        "reconditioned",
        "legacy",
      ],
      modern: [
        "digital",
        "latest",
        "state-of-the-art",
        "recently acquired",
        "upgraded",
        "modern",
        "latest generation",
        "brand new",
        "newly installed",
      ],
    },
  },
  ngo_substitution: {
    label: "NGO Substituting for Permanent Capacity",
    description:
      "Evidence that periodic NGO activity substitutes for permanent capacity (Q8.4)",
    patterns: [
      "ngo",
      "non-governmental",
      "international organization",
      "medical mission",
      "volunteer doctor",
      "visiting team",
      "outreach event",
      "annual campaign",
      "periodic screening",
      "sponsored by",
      "funded by",
      "supported by",
      "partnership with ngo",
      "collaboration with ngo",
      "charity organization",
      "humanitarian organization",
      "international aid",
      "development partner",
      "remote surgery day",
      "free surgery day",
    ],
  },
} as const;

type EvidenceCategoryKey = keyof typeof EVIDENCE_CATEGORIES;

interface TextEvidence {
  facilityId: number;
  facilityName: string;
  region: string | null;
  category: string;
  categoryLabel: string;
  matchedPatterns: string[];
  evidenceSnippets: string[];
  /** For equipment_age: classified as legacy or modern */
  equipmentAgeClass?: "legacy" | "modern" | "mixed" | "unknown";
}

function extractSnippets(
  text: string,
  patterns: string[],
  maxSnippets = 3
): string[] {
  const snippets: string[] = [];
  for (const pattern of patterns) {
    if (snippets.length >= maxSnippets) {
      break;
    }
    const idx = text.indexOf(pattern);
    if (idx >= 0) {
      const snippetStart = Math.max(0, idx - 50);
      const snippetEnd = Math.min(text.length, idx + pattern.length + 70);
      snippets.push(`...${text.slice(snippetStart, snippetEnd).trim()}...`);
    }
  }
  return snippets;
}

export const analyzeTextEvidence = tool({
  description:
    "Targeted text evidence analysis on facility free-text fields. Retrieves facilities via semantic search and analyzes their raw text for specific evidence patterns: temporary equipment, surgical camps, individual-tied services, equipment age signals, and NGO substitution. Use for deep text pattern detection beyond simple search.",
  inputSchema: z.object({
    searchQuery: z
      .string()
      .min(1)
      .max(500)
      .optional()
      .describe(
        "Semantic search query to find relevant facilities (e.g., 'ophthalmology', 'surgery equipment'). If omitted, analyzes all facilities matching the filters."
      ),
    facilityId: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Analyze a specific facility by ID"),
    region: z
      .string()
      .max(100)
      .optional()
      .describe("Limit analysis to a specific region"),
    evidenceCategory: z
      .enum([
        "temporary_equipment",
        "surgical_camp",
        "individual_tied",
        "equipment_age",
        "ngo_substitution",
        "all",
      ])
      .default("all")
      .describe("Category of evidence to search for"),
    limit: z.number().min(1).max(30).default(15),
  }),
  execute: async (
    { searchQuery, facilityId, region, evidenceCategory, limit },
    { abortSignal }
  ) => {
    const log = createToolLogger("analyzeTextEvidence");
    const start = Date.now();
    log.start({ searchQuery, facilityId, region, evidenceCategory, limit });

    try {
      let rows: Array<{
        id: number;
        name: string;
        procedures: string | null;
        equipment: string | null;
        capabilities: string | null;
        description: string | null;
        specialties: string | null;
        region: string | null;
      }>;

      if (facilityId) {
        // Direct lookup
        rows = await withTimeout(
          db
            .select({
              id: facilities.id,
              name: facilities.name,
              procedures: facilities.proceduresRaw,
              equipment: facilities.equipmentRaw,
              capabilities: facilities.capabilitiesRaw,
              description: facilities.description,
              specialties: facilities.specialtiesRaw,
              region: facilities.addressRegion,
            })
            .from(facilities)
            .where(eq(facilities.id, facilityId))
            .limit(1),
          DB_QUERY_TIMEOUT_MS,
          abortSignal
        );
      } else if (searchQuery) {
        // Semantic search then analyze
        log.step("Generating embedding for search query");
        const queryEmbedding = await withTimeout(
          embed(searchQuery),
          10_000,
          abortSignal
        );
        const similarity = sql<number>`1 - (${cosineDistance(facilities.embedding, queryEmbedding)})`;

        const conditions = [isNotNull(facilities.embedding)];
        if (region) {
          conditions.push(ilike(facilities.addressRegion, `%${region}%`));
        }

        rows = await withTimeout(
          db
            .select({
              id: facilities.id,
              name: facilities.name,
              procedures: facilities.proceduresRaw,
              equipment: facilities.equipmentRaw,
              capabilities: facilities.capabilitiesRaw,
              description: facilities.description,
              specialties: facilities.specialtiesRaw,
              region: facilities.addressRegion,
            })
            .from(facilities)
            .where(and(...conditions))
            .orderBy(desc(similarity))
            .limit(limit),
          DB_QUERY_TIMEOUT_MS,
          abortSignal
        );
      } else {
        // Filter-based lookup
        const conditions = [isNotNull(facilities.id)];
        if (region) {
          conditions.push(ilike(facilities.addressRegion, `%${region}%`));
        }

        rows = await withTimeout(
          db
            .select({
              id: facilities.id,
              name: facilities.name,
              procedures: facilities.proceduresRaw,
              equipment: facilities.equipmentRaw,
              capabilities: facilities.capabilitiesRaw,
              description: facilities.description,
              specialties: facilities.specialtiesRaw,
              region: facilities.addressRegion,
            })
            .from(facilities)
            .where(and(...conditions))
            .limit(limit),
          DB_QUERY_TIMEOUT_MS,
          abortSignal
        );
      }

      log.step("Facilities to analyze", rows.length);

      const allEvidence: TextEvidence[] = [];
      const categoriesToCheck: EvidenceCategoryKey[] =
        evidenceCategory === "all"
          ? (Object.keys(EVIDENCE_CATEGORIES) as EvidenceCategoryKey[])
          : [evidenceCategory as EvidenceCategoryKey];

      for (const fac of rows) {
        if (abortSignal?.aborted) {
          return { error: "Operation was aborted" };
        }

        const allText = [
          fac.procedures,
          fac.equipment,
          fac.capabilities,
          fac.description,
          fac.specialties,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (allText.length === 0) {
          continue;
        }

        for (const catKey of categoriesToCheck) {
          const category = EVIDENCE_CATEGORIES[catKey];
          const matched = category.patterns.filter((p) => allText.includes(p));

          if (matched.length > 0) {
            const evidence: TextEvidence = {
              facilityId: fac.id,
              facilityName: fac.name,
              region: fac.region,
              category: catKey,
              categoryLabel: category.label,
              matchedPatterns: matched,
              evidenceSnippets: extractSnippets(allText, matched),
            };

            // Special handling for equipment age classification
            if (catKey === "equipment_age") {
              const subCats = EVIDENCE_CATEGORIES.equipment_age.subCategories;
              const legacyMatches = subCats.legacy.filter((p) =>
                allText.includes(p)
              );
              const modernMatches = subCats.modern.filter((p) =>
                allText.includes(p)
              );

              if (legacyMatches.length > 0 && modernMatches.length > 0) {
                evidence.equipmentAgeClass = "mixed";
              } else if (legacyMatches.length > 0) {
                evidence.equipmentAgeClass = "legacy";
              } else if (modernMatches.length > 0) {
                evidence.equipmentAgeClass = "modern";
              } else {
                evidence.equipmentAgeClass = "unknown";
              }
            }

            allEvidence.push(evidence);
          }
        }
      }

      // Build summary by category
      const categorySummary: Record<string, number> = {};
      for (const e of allEvidence) {
        categorySummary[e.category] = (categorySummary[e.category] ?? 0) + 1;
      }

      const output = {
        facilitiesAnalyzed: rows.length,
        evidenceFound: allEvidence.length,
        categorySummary,
        evidence: allEvidence.slice(0, 25),
      };

      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown text analysis error";
      log.error(
        error,
        { searchQuery, facilityId, region, evidenceCategory },
        Date.now() - start
      );
      return { error: `Text evidence analysis failed: ${message}` };
    }
  },
});
