/**
 * Evaluate Plan Tool — scores mission plans using structured evaluation.
 *
 * Uses generateObject to produce typed quality metrics for a volunteer
 * mission plan, enabling the evaluator-optimizer pattern in the
 * mission planner agent.
 */

import { generateObject, tool } from "ai";
import { z } from "zod";
import { getLanguageModel } from "../providers";

const evaluationSchema = z.object({
  gapCoverage: z
    .number()
    .min(1)
    .max(10)
    .describe(
      "How well does the plan address the identified healthcare gaps? 1=poor, 10=excellent"
    ),
  facilityReadiness: z
    .number()
    .min(1)
    .max(10)
    .describe(
      "How ready are the recommended host facilities to support the volunteer? 1=not ready, 10=fully equipped"
    ),
  practicalFeasibility: z
    .number()
    .min(1)
    .max(10)
    .describe(
      "How feasible is the plan in terms of travel, logistics, and duration? 1=impractical, 10=very feasible"
    ),
  overallScore: z
    .number()
    .min(1)
    .max(10)
    .describe("Weighted overall quality score"),
  missingAnalysis: z
    .array(z.string())
    .describe(
      "Key areas of analysis that are missing or incomplete in the plan"
    ),
  improvementSuggestions: z
    .array(z.string())
    .describe(
      "Specific, actionable suggestions to improve the plan quality"
    ),
  strengths: z
    .array(z.string())
    .describe("What the plan does well"),
});

export const evaluatePlan = tool({
  description:
    "Evaluate the quality of a volunteer mission plan and suggest improvements. Use after generating an initial plan to check its quality and iterate if needed.",
  inputSchema: z.object({
    plan: z
      .string()
      .describe(
        "The mission plan text to evaluate, including recommended locations and reasoning"
      ),
    volunteerSpecialty: z
      .string()
      .describe("The volunteer's medical specialty"),
    volunteerDuration: z
      .string()
      .optional()
      .describe("How long the volunteer is available"),
    facilitiesAnalyzed: z
      .number()
      .optional()
      .describe("Number of candidate facilities that were analyzed"),
    desertsIdentified: z
      .number()
      .optional()
      .describe("Number of medical desert zones identified"),
  }),
  execute: async ({
    plan,
    volunteerSpecialty,
    volunteerDuration,
    facilitiesAnalyzed,
    desertsIdentified,
  }) => {
    try {
      const { object: evaluation } = await generateObject({
        model: getLanguageModel("google/gemini-2.5-flash-lite"),
        schema: evaluationSchema,
        prompt: `You are evaluating a volunteer medical mission plan for a ${volunteerSpecialty}${volunteerDuration ? ` available for ${volunteerDuration}` : ""}.

Context:
- Facilities analyzed: ${facilitiesAnalyzed ?? "unknown"}
- Medical desert zones identified: ${desertsIdentified ?? "unknown"}

Evaluate this plan on three dimensions:
1. Gap Coverage: Does the plan target the areas of greatest need? Are the recommended locations in or near identified medical deserts?
2. Facility Readiness: Do the recommended host facilities have adequate infrastructure (beds, equipment, staff) to support a visiting ${volunteerSpecialty}?
3. Practical Feasibility: Is the plan realistic in terms of travel distances, logistics, and the volunteer's available time?

Score each 1-10 and provide an overall weighted score (gap coverage 40%, facility readiness 35%, feasibility 25%).

Plan to evaluate:
${plan}`,
      });

      return {
        ...evaluation,
        meetsThreshold: evaluation.overallScore >= 7,
        recommendation:
          evaluation.overallScore >= 7
            ? "Plan meets quality threshold. Ready for final synthesis."
            : "Plan needs improvement. Address the missing analysis areas and apply suggestions.",
      };
    } catch (error) {
      console.error("[evaluatePlan] Evaluation failed:", error);
      return {
        gapCoverage: 0,
        facilityReadiness: 0,
        practicalFeasibility: 0,
        overallScore: 0,
        missingAnalysis: ["Evaluation failed — proceed with current plan"],
        improvementSuggestions: [],
        strengths: [],
        meetsThreshold: true,
        recommendation: "Evaluation unavailable. Use current plan as-is.",
      };
    }
  },
});
