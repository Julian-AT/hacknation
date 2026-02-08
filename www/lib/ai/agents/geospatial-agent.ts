import { stepCountIs, ToolLoopAgent } from "ai";
import { getLanguageModel } from "../providers";
import { compareRegions } from "../tools/compareRegions";
import { findMedicalDeserts } from "../tools/findMedicalDeserts";
import { findNearby } from "../tools/findNearby";
import { planMission } from "../tools/planMission";
import { getTravelTime } from "../tools/web/openrouteservice";
import { geospatialAgentPrompt } from "./prompts";

/**
 * Geospatial Agent — geographic analysis of healthcare coverage.
 * Tools: findNearby, findMedicalDeserts, compareRegions, planMission, getTravelTime
 *
 * Phased execution via prepareStep:
 *   Phase 1 (0-1): Gap identification — findMedicalDeserts, findNearby
 *   Phase 2 (2-4): Proximity & impact analysis — compareRegions, getTravelTime, planMission
 *   Phase 3 (5+):  Synthesis — no tools, generate final geographic analysis text
 */
export const geospatialAgent = new ToolLoopAgent({
  model: getLanguageModel("google/gemini-2.5-flash-lite"),
  instructions: geospatialAgentPrompt,
  tools: {
    findNearby,
    findMedicalDeserts,
    compareRegions,
    planMission,
    getTravelTime,
  },
  stopWhen: stepCountIs(8),
  prepareStep: ({ stepNumber }) => {
    // Phase 1 (steps 0-1): Gap identification
    if (stepNumber <= 1) {
      return {
        activeTools: ["findMedicalDeserts", "findNearby"],
      };
    }

    // Phase 2 (steps 2-4): Proximity & impact analysis
    if (stepNumber <= 4) {
      return {
        activeTools: [
          "findNearby",
          "compareRegions",
          "planMission",
          "getTravelTime",
        ],
      };
    }

    // Phase 3 (steps 5+): Synthesis — no tools, generate text
    return {
      activeTools: [],
    };
  },
});
