import { tool } from "ai";
import { and, eq, ilike, isNotNull } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../../db";
import { facilities } from "../../../db/schema.facilities";
import { createToolLogger } from "../debug";
import { DB_QUERY_TIMEOUT_MS, withTimeout } from "../safeguards";

/**
 * Language patterns for service classification.
 * Covers questions 5.1, 5.2, 6.4, 6.5, 6.6 from VF Agent reference.
 */
const ITINERANT_PATTERNS = [
  "visiting surgeon",
  "visiting consultant",
  "visiting doctor",
  "visiting specialist",
  "visiting ophthalmologist",
  "visiting physician",
  "camp",
  "outreach",
  "periodic",
  "periodically",
  "twice a year",
  "once a month",
  "once a year",
  "quarterly",
  "biannual",
  "annual visit",
  "mobile clinic",
  "mobile unit",
  "mobile health",
  "medical mission",
  "surgical camp",
  "eye camp",
  "health camp",
  "screening camp",
  "traveling",
  "itinerant",
  "comes every",
  "visits every",
  "available on select days",
  "not available daily",
  "seasonal",
  "temporary service",
  "intermittent",
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
  "referred to",
  "refer to",
  "sending patients",
  "outsource",
  "contracted to",
  "linked with",
  "affiliate arrangement",
  "memorandum of understanding",
  "mou with",
  "telemedicine consult",
  "teleconsult",
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
  "on-site",
  "staffed",
  "round the clock",
  "always available",
  "established department",
  "centre of excellence",
  "center of excellence",
  "specialist unit",
  "ward",
  "operating theatre",
  "operating room",
];

/**
 * Patterns indicating services tied to specific individuals rather than institutions (Q6.6).
 * Implies fragility in continuity — if the individual leaves, the service may disappear.
 */
const INDIVIDUAL_TIED_PATTERNS = [
  "dr.",
  "dr ",
  "professor ",
  "prof.",
  "prof ",
  "consultant surgeon",
  "named surgeon",
  "personal practice",
  "private practice of",
  "led by dr",
  "under dr",
  "performed by dr",
  "only surgeon",
  "sole practitioner",
  "one specialist",
  "single specialist",
  "the surgeon",
  "our surgeon",
];

/**
 * Patterns for surgical camps or temporary medical missions (Q6.5, Q8.4).
 * These indicate NGO or temporary activity substituting for permanent capacity.
 */
const CAMP_MISSION_PATTERNS = [
  "surgical camp",
  "eye camp",
  "health camp",
  "dental camp",
  "screening camp",
  "free surgery camp",
  "medical mission",
  "dental mission",
  "medical camp",
  "health drive",
  "ngo sponsored",
  "ngo-supported",
  "ngo supported",
  "charity surgery",
  "charity operation",
  "volunteer mission",
  "mission trip",
  "remote outreach",
  "remote screening",
  "remote surgery",
  "remote clinic",
  "remote campaign",
  "remote program",
  "humanitarian mission",
  "relief effort",
  "overseas team",
  "foreign team",
  "international team",
  "sponsored by",
  "funded by ngo",
  "donated equipment",
  "temporary facility",
  "pop-up clinic",
  "field hospital",
  "community outreach",
  "free medical",
  "free health",
  "free eye",
  "free dental",
  "free screening",
];

/**
 * Patterns indicating weak operational capability (Q5.3).
 * Strong clinical claims alongside these suggest unreliable service delivery.
 */
const WEAK_OPERATIONAL_PATTERNS = [
  "limited hours",
  "limited opening",
  "part-time",
  "no appointment",
  "walk-in only",
  "no phone",
  "no email",
  "no website",
  "contact not available",
  "under construction",
  "under renovation",
  "temporarily closed",
  "closed for",
  "irregular hours",
  "skeleton staff",
  "understaffed",
  "no emergency",
  "no ambulance",
  "no icu",
  "no intensive care",
];

type ServiceClassification = {
  facilityId: number;
  facilityName: string;
  region: string | null;
  serviceType: "permanent" | "itinerant" | "referral" | "unclear";
  confidence: "high" | "medium" | "low";
  evidenceQuotes: string[];
  matchedPatterns: string[];
  /** Whether service appears tied to a specific individual (fragile continuity) */
  individualTied: boolean;
  individualTiedPatterns: string[];
  /** Whether there is evidence of surgical camps or temporary missions */
  campMissionEvidence: boolean;
  campMissionPatterns: string[];
  /** Whether there are weak operational signals despite clinical claims */
  weakOperationalSignals: string[];
};

function extractSnippet(text: string, pattern: string): string {
  const idx = text.indexOf(pattern);
  if (idx < 0) {
    return "";
  }
  const snippetStart = Math.max(0, idx - 40);
  const snippetEnd = Math.min(text.length, idx + pattern.length + 60);
  return `...${text.slice(snippetStart, snippetEnd).trim()}...`;
}

function matchPatterns(text: string, patterns: string[]): string[] {
  const seen = new Set<string>();
  return patterns.filter((p) => {
    if (seen.has(p)) {
      return false;
    }
    if (text.includes(p)) {
      seen.add(p);
      return true;
    }
    return false;
  });
}

export const classifyServices = tool({
  description:
    "Analyze facility free-text to classify services as permanent, itinerant/visiting, or referral-based. Also detects individual-tied services (fragile continuity), surgical camp/mission evidence, and weak operational signals. Covers VF Agent questions 5.1, 5.2, 5.3, 6.4, 6.5, 6.6.",
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
    focusArea: z
      .enum([
        "all",
        "service_type",
        "individual_tied",
        "camp_missions",
        "weak_operations",
      ])
      .default("all")
      .describe(
        "Focus the classification on a specific aspect: service_type (permanent/itinerant/referral), individual_tied (services depending on specific people), camp_missions (surgical camps/NGO missions), weak_operations (weak operational signals despite clinical claims)"
      ),
  }),
  execute: async (
    { facilityId, region, serviceFilter, focusArea },
    { abortSignal }
  ) => {
    const log = createToolLogger("classifyServices");
    const start = Date.now();
    log.start({ facilityId, region, serviceFilter, focusArea });

    try {
      const conditions = [isNotNull(facilities.id)];
      if (facilityId) {
        conditions.push(eq(facilities.id, facilityId));
      }
      if (region) {
        conditions.push(ilike(facilities.addressRegion, `%${region}%`));
      }
      if (serviceFilter) {
        conditions.push(ilike(facilities.proceduresRaw, `%${serviceFilter}%`));
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
          .limit(facilityId ? 1 : 20),
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

        // Core service type classification
        const itinerantMatches = matchPatterns(allText, ITINERANT_PATTERNS);
        const referralMatches = matchPatterns(allText, REFERRAL_PATTERNS);
        const permanentMatches = matchPatterns(allText, PERMANENT_PATTERNS);

        // Extended classifications
        const individualTiedMatches = matchPatterns(
          allText,
          INDIVIDUAL_TIED_PATTERNS
        );
        const campMissionMatches = matchPatterns(
          allText,
          CAMP_MISSION_PATTERNS
        );
        const weakOpMatches = matchPatterns(allText, WEAK_OPERATIONAL_PATTERNS);

        // Determine primary classification based on pattern matches
        let serviceType: ServiceClassification["serviceType"] = "unclear";
        let confidence: ServiceClassification["confidence"] = "low";
        const matchedPatterns: string[] = [];

        if (itinerantMatches.length > permanentMatches.length) {
          serviceType = "itinerant";
          confidence = itinerantMatches.length >= 2 ? "high" : "medium";
          matchedPatterns.push(...itinerantMatches);
        } else if (
          referralMatches.length > 0 &&
          permanentMatches.length === 0
        ) {
          serviceType = "referral";
          confidence = referralMatches.length >= 2 ? "high" : "medium";
          matchedPatterns.push(...referralMatches);
        } else if (permanentMatches.length > 0) {
          serviceType = "permanent";
          confidence = permanentMatches.length >= 2 ? "high" : "medium";
          matchedPatterns.push(...permanentMatches);
        }

        // Boost confidence with camp/mission or individual-tied evidence
        if (serviceType === "itinerant" && campMissionMatches.length > 0) {
          confidence = "high";
        }
        if (serviceType === "unclear" && campMissionMatches.length > 0) {
          serviceType = "itinerant";
          confidence = campMissionMatches.length >= 2 ? "high" : "medium";
          matchedPatterns.push(...campMissionMatches);
        }

        // Extract evidence quotes (sentences containing matched patterns)
        const evidenceQuotes: string[] = [];
        for (const pattern of matchedPatterns.slice(0, 3)) {
          const snippet = extractSnippet(allText, pattern);
          if (snippet) {
            evidenceQuotes.push(snippet);
          }
        }
        // Add individual-tied evidence
        for (const pattern of individualTiedMatches.slice(0, 2)) {
          const snippet = extractSnippet(allText, pattern);
          if (snippet) {
            evidenceQuotes.push(snippet);
          }
        }

        // Decide whether to include based on focus area
        const hasRelevantFindings =
          serviceType !== "unclear" ||
          individualTiedMatches.length > 0 ||
          campMissionMatches.length > 0 ||
          weakOpMatches.length > 0 ||
          Boolean(facilityId);

        const matchesFocusFilter =
          focusArea === "all" ||
          (focusArea === "service_type" && serviceType !== "unclear") ||
          (focusArea === "individual_tied" &&
            individualTiedMatches.length > 0) ||
          (focusArea === "camp_missions" && campMissionMatches.length > 0) ||
          (focusArea === "weak_operations" && weakOpMatches.length > 0) ||
          Boolean(facilityId);

        if (hasRelevantFindings && matchesFocusFilter) {
          classifications.push({
            facilityId: fac.id,
            facilityName: fac.name,
            region: fac.region,
            serviceType,
            confidence,
            evidenceQuotes: evidenceQuotes.slice(0, 5),
            matchedPatterns,
            individualTied: individualTiedMatches.length > 0,
            individualTiedPatterns: individualTiedMatches,
            campMissionEvidence: campMissionMatches.length > 0,
            campMissionPatterns: campMissionMatches,
            weakOperationalSignals: weakOpMatches,
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
        individualTied: classifications.filter((c) => c.individualTied).length,
        campMissionEvidence: classifications.filter(
          (c) => c.campMissionEvidence
        ).length,
        weakOperationalSignals: classifications.filter(
          (c) => c.weakOperationalSignals.length > 0
        ).length,
      };

      const output = {
        facilitiesAnalyzed: rows.length,
        classificationsFound: classifications.length,
        focusArea,
        summary,
        classifications: classifications.slice(0, 20),
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown classification error";
      log.error(
        error,
        { facilityId, region, serviceFilter, focusArea },
        Date.now() - start
      );
      return { error: `Service classification failed: ${message}` };
    }
  },
});
