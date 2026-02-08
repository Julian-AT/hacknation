/**
 * Mission Planner Agent — autonomous volunteer deployment workflow.
 *
 * Uses the evaluator-optimizer pattern: runs gap analysis, finds candidate
 * facilities, evaluates plan quality, and iterates until the recommendation
 * meets quality thresholds.
 *
 * Phases (controlled by prepareStep):
 *   Phase 1 (0-2): Identify gaps — findMedicalDeserts, findNearby
 *   Phase 2 (3-5): Evaluate candidates — getFacility, detectAnomalies
 *   Phase 3 (6-8): Quality check — evaluatePlan, findNearby, getFacility
 *   Phase 4 (9+):  Final synthesis — no tools, generate text
 */

import { ToolLoopAgent, stepCountIs } from "ai";
import { getLanguageModel } from "../providers";
import { findNearby } from "../tools/findNearby";
import { findMedicalDeserts } from "../tools/findMedicalDeserts";
import { getFacility } from "../tools/getFacility";
import { detectAnomalies } from "../tools/detectAnomalies";
import { evaluatePlan } from "../tools/evaluate-plan";
import { missionPlannerPrompt } from "./prompts";

export const missionPlannerAgent = new ToolLoopAgent({
  model: getLanguageModel("google/gemini-2.5-flash-lite"),
  instructions: missionPlannerPrompt,
  tools: {
    findMedicalDeserts,
    findNearby,
    getFacility,
    detectAnomalies,
    evaluatePlan,
  },
  stopWhen: stepCountIs(12),
  prepareStep: async ({ stepNumber }) => {
    // Phase 1 (steps 0-2): Identify gaps
    if (stepNumber <= 2) {
      return {
        activeTools: ["findMedicalDeserts", "findNearby"],
      };
    }

    // Phase 2 (steps 3-5): Evaluate candidate facilities
    if (stepNumber <= 5) {
      return {
        activeTools: ["getFacility", "detectAnomalies"],
      };
    }

    // Phase 3 (steps 6-8): Quality check and iterate
    if (stepNumber <= 8) {
      return {
        activeTools: ["evaluatePlan", "findNearby", "getFacility"],
      };
    }

    // Phase 4 (steps 9+): Final synthesis — no tools, just generate text
    return {
      activeTools: [],
    };
  },
});
