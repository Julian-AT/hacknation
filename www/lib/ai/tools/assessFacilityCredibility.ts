import { tool } from "ai";
import { and, eq, ilike, isNotNull } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { facilities } from "../../db/schema.facilities";
import {
  computeAnomalyConfidence,
  type AnomalyConfidence,
} from "./computeAnomalyConfidence";
import { createToolLogger } from "./debug";
import { DB_QUERY_TIMEOUT_MS, withTimeout } from "./safeguards";

type FacilityAssessment = {
  facilityId: number;
  facilityName: string;
  facilityType: string | null;
  region: string | null;
  city: string | null;
  beds: number | null;
  doctors: number | null;
  confidence: AnomalyConfidence;
};

export const assessFacilityCredibility = tool({
  description:
    "Assess credibility of facility claims by cross-referencing specialties, procedures, equipment, and capacity against medical knowledge thresholds. Returns a green/yellow/red confidence badge with plain-English explanations for each facility. Use this to visually flag potential misrepresentation (VF Agent questions 4.1–4.9).",
  inputSchema: z.object({
    region: z
      .string()
      .max(100)
      .optional()
      .describe("Assess all facilities in a specific region"),
    facilityId: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Assess a single facility by ID"),
    onlyFlagged: z
      .boolean()
      .default(false)
      .describe(
        "If true, only return facilities with yellow or red confidence levels"
      ),
  }),
  execute: async ({ region, facilityId, onlyFlagged }, { abortSignal }) => {
    const log = createToolLogger("assessFacilityCredibility");
    const start = Date.now();
    log.start({ region, facilityId, onlyFlagged });

    try {
      const conditions = [isNotNull(facilities.id)];

      if (facilityId) {
        conditions.push(eq(facilities.id, facilityId));
      }
      if (region) {
        conditions.push(ilike(facilities.addressRegion, `%${region}%`));
      }

      const rows = await withTimeout(
        db
          .select({
            id: facilities.id,
            name: facilities.name,
            facilityType: facilities.facilityType,
            addressRegion: facilities.addressRegion,
            addressCity: facilities.addressCity,
            capacity: facilities.capacity,
            numDoctors: facilities.numDoctors,
            specialtiesRaw: facilities.specialtiesRaw,
            proceduresRaw: facilities.proceduresRaw,
            equipmentRaw: facilities.equipmentRaw,
            procedures: facilities.procedures,
            specialties: facilities.specialties,
            equipment: facilities.equipment,
          })
          .from(facilities)
          .where(and(...conditions))
          .limit(facilityId ? 1 : 50),
        DB_QUERY_TIMEOUT_MS,
        abortSignal
      );

      log.step("Facilities to assess", rows.length);

      const assessments: FacilityAssessment[] = [];

      for (const row of rows) {
        if (abortSignal?.aborted) {
          return { error: "Operation was aborted" };
        }

        const confidence = computeAnomalyConfidence(row);

        if (onlyFlagged && confidence.level === "green") continue;

        assessments.push({
          facilityId: row.id,
          facilityName: row.name,
          facilityType: row.facilityType,
          region: row.addressRegion,
          city: row.addressCity,
          beds: row.capacity,
          doctors: row.numDoctors,
          confidence,
        });
      }

      // Sort by score ascending (most flagged first)
      assessments.sort((a, b) => a.confidence.score - b.confidence.score);

      const redCount = assessments.filter(
        (a) => a.confidence.level === "red"
      ).length;
      const yellowCount = assessments.filter(
        (a) => a.confidence.level === "yellow"
      ).length;
      const greenCount = assessments.filter(
        (a) => a.confidence.level === "green"
      ).length;

      const output = {
        facilitiesAssessed: rows.length,
        distribution: { red: redCount, yellow: yellowCount, green: greenCount },
        assessments: assessments.slice(0, 20),
        summary:
          redCount > 0
            ? `${redCount} facilit${redCount === 1 ? "y" : "ies"} flagged with critical misrepresentation signals. ${yellowCount} require${yellowCount === 1 ? "s" : ""} further review.`
            : yellowCount > 0
              ? `No critical flags, but ${yellowCount} facilit${yellowCount === 1 ? "y" : "ies"} ha${yellowCount === 1 ? "s" : "ve"} moderate issues worth reviewing.`
              : `All ${greenCount} assessed facilit${greenCount === 1 ? "y" : "ies"} passed credibility checks.`,
      };

      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown credibility assessment error";
      log.error(error, { region, facilityId, onlyFlagged }, Date.now() - start);
      return { error: `Credibility assessment failed: ${message}` };
    }
  },
});
