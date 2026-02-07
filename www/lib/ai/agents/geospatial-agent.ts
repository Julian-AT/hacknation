import { ToolLoopAgent, stepCountIs } from "ai";
import { getLanguageModel } from "../providers";
import { findNearby } from "../tools/findNearby";
import { findMedicalDeserts } from "../tools/findMedicalDeserts";
import { compareRegions } from "../tools/compareRegions";
import { planMission } from "../tools/planMission";
import { geospatialAgentPrompt } from "./prompts";

/**
 * Geospatial Agent — geographic analysis of healthcare coverage.
 * Tools: findNearby, findMedicalDeserts, compareRegions, planMission
 */
export const geospatialAgent = new ToolLoopAgent({
  model: getLanguageModel("google/gemini-2.5-flash-lite"),
  instructions: geospatialAgentPrompt,
  tools: {
    findNearby,
    findMedicalDeserts,
    compareRegions,
    planMission,
  },
  stopWhen: stepCountIs(6),
});
