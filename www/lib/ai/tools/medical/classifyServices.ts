import { z } from "zod";
import { db } from "../../../db";
import { facilities } from "../../../db/schema.facilities";
import { and, isNotNull, ilike, eq } from "drizzle-orm";
import { tool } from "ai";
import { createToolLogger } from "../debug";
import { withTimeout, DB_QUERY_TIMEOUT_MS } from "../safeguards";

/**
 * Language patterns for service classification.
 */
const ITINERANT_PATTERNS = [
  "visiting surgeon",
  "visiting consultant",
  "camp",
  "outreach",
  "periodic",
  "twice a year",
  "once a month",
  "mobile clinic",
  "medical mission",
  "surgical camp",
  "traveling",
  "itinerant",
];

const REFERRAL_PATTERNS = [
  "we refer",
  "refer patients",
  "we can arrange",
  "we collaborate",
  "we send to",
  "referral",
  "partnership with",
  "in collaboration",
  "transfer to",
];

const PERMANENT_PATTERNS = [
  "24/7",
  "24-hour",
  "permanent",
  "full-time",
  "dedicated unit",
  "department of",
  "standing service",
  "daily",
  "in-house",
  "resident",
];

type ServiceClassification = {
  facilityId: number;
  facilityName: string;
  serviceType: "permanent" | "itinerant" | "referral" | "unclear";
  confidence: "high" | "medium" | "low";
  evidenceQuotes: string[];
  matchedPatterns: string[];
};

export const classifyServices = tool({
  description:
    "Analyze facility free-text to classify services as permanent, itinerant/visiting, or referral-based. Identifies whether services are standing or temporary based on language patterns.",
  inputSchema: z.object({
    facilityId: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Classify services for a specific facility"),
    region: z
      .string()
      .max(100)
      .optional()
      .describe("Classify services for all facilities in a region"),
    serviceFilter: z
      .string()
      .max(200)
      .optional()
      .describe(
        "Filter by specific service keyword (e.g., 'ophthalmology', 'surgery')"
      ),
  }),
  execute: async ({ facilityId, region, serviceFilter }, { abortSignal }) => {
    const log = createToolLogger("classifyServices");
    const start = Date.now();
    log.start({ facilityId, region, serviceFilter });

    try {
      const conditions = [isNotNull(facilities.id)];
      if (facilityId) {
        conditions.push(eq(facilities.id, facilityId));
      }
      if (region) {
        conditions.push(ilike(facilities.addressRegion, `%${region}%`));
      }
      if (serviceFilter) {
        conditions.push(
          ilike(facilities.proceduresRaw, `%${serviceFilter}%`)
        );
      }

      const rows = await withTimeout(
        db
          .select({
            id: facilities.id,
            name: facilities.name,
            procedures: facilities.proceduresRaw,
            equipment: facilities.equipmentRaw,
            capabilities: facilities.capabilitiesRaw,
            description: facilities.description,
            region: facilities.addressRegion,
          })
          .from(facilities)
          .where(and(...conditions))
          .limit(facilityId ? 1 : 15),
        DB_QUERY_TIMEOUT_MS,
        abortSignal
      );

      log.step("Facilities to classify", rows.length);

      const classifications: ServiceClassification[] = [];

      for (const fac of rows) {
        if (abortSignal?.aborted) {
          return { error: "Operation was aborted" };
        }

        const allText = [
          fac.procedures,
          fac.equipment,
          fac.capabilities,
          fac.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (allText.length === 0) {
          continue;
        }

        const itinerantMatches = ITINERANT_PATTERNS.filter((p) =>
          allText.includes(p)
        );
        const referralMatches = REFERRAL_PATTERNS.filter((p) =>
          allText.includes(p)
        );
        const permanentMatches = PERMANENT_PATTERNS.filter((p) =>
          allText.includes(p)
        );

        // Determine classification based on pattern matches
        let serviceType: ServiceClassification["serviceType"] = "unclear";
        let confidence: ServiceClassification["confidence"] = "low";
        const matchedPatterns: string[] = [];

        if (itinerantMatches.length > permanentMatches.length) {
          serviceType = "itinerant";
          confidence = itinerantMatches.length >= 2 ? "high" : "medium";
          matchedPatterns.push(...itinerantMatches);
        } else if (referralMatches.length > 0 && permanentMatches.length === 0) {
          serviceType = "referral";
          confidence = referralMatches.length >= 2 ? "high" : "medium";
          matchedPatterns.push(...referralMatches);
        } else if (permanentMatches.length > 0) {
          serviceType = "permanent";
          confidence = permanentMatches.length >= 2 ? "high" : "medium";
          matchedPatterns.push(...permanentMatches);
        }

        // Extract evidence quotes (sentences containing matched patterns)
        const evidenceQuotes: string[] = [];
        for (const pattern of matchedPatterns.slice(0, 3)) {
          const idx = allText.indexOf(pattern);
          if (idx >= 0) {
            const snippetStart = Math.max(0, idx - 40);
            const snippetEnd = Math.min(allText.length, idx + pattern.length + 60);
            evidenceQuotes.push(
              `...${allText.slice(snippetStart, snippetEnd).trim()}...`
            );
          }
        }

        // Only include facilities with meaningful classifications
        if (serviceType !== "unclear" || facilityId) {
          classifications.push({
            facilityId: fac.id,
            facilityName: fac.name,
            serviceType,
            confidence,
            evidenceQuotes,
            matchedPatterns,
          });
        }
      }

      const summary = {
        permanent: classifications.filter((c) => c.serviceType === "permanent")
          .length,
        itinerant: classifications.filter((c) => c.serviceType === "itinerant")
          .length,
        referral: classifications.filter((c) => c.serviceType === "referral")
          .length,
        unclear: classifications.filter((c) => c.serviceType === "unclear")
          .length,
      };

      const output = {
        facilitiesAnalyzed: rows.length,
        classificationsFound: classifications.length,
        summary,
        classifications: classifications.slice(0, 15),
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown classification error";
      log.error(
        error,
        { facilityId, region, serviceFilter },
        Date.now() - start
      );
      return { error: `Service classification failed: ${message}` };
    }
  },
});
