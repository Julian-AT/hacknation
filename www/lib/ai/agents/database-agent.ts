import { stepCountIs, ToolLoopAgent } from "ai";
import { getLanguageModel } from "../providers";
import { getDemographics } from "../tools/getDemographics";
import { getFacility } from "../tools/getFacility";
import { getSchema } from "../tools/getSchema";
import { queryDatabase } from "../tools/queryDatabase";
import { searchFacilities } from "../tools/searchFacilities";
import { databaseAgentPrompt } from "./prompts";

/**
 * Database Agent — queries, filters, and analyzes facility data.
 * Tools: queryDatabase, searchFacilities, getFacility, getSchema, getDemographics
 *
 * Phased execution via prepareStep:
 *   Phase 1 (0-1): Schema discovery + initial queries
 *   Phase 2 (2-4): Deep investigation with all query tools
 *   Phase 3 (5+):  Synthesis — no tools, generate final analysis text
 */
export const databaseAgent = new ToolLoopAgent({
  model: getLanguageModel("google/gemini-2.5-flash-lite"),
  instructions: databaseAgentPrompt,
  tools: {
    queryDatabase,
    searchFacilities,
    getFacility,
    getSchema,
    getDemographics,
  },
  stopWhen: stepCountIs(8),
  prepareStep: ({ stepNumber }) => {
    // Phase 1 (steps 0-1): Schema discovery + initial query
    if (stepNumber <= 1) {
      return {
        activeTools: ["getSchema", "queryDatabase", "getDemographics"],
      };
    }

    // Phase 2 (steps 2-4): Deep investigation with all tools
    if (stepNumber <= 4) {
      return {
        activeTools: [
          "queryDatabase",
          "searchFacilities",
          "getFacility",
          "getDemographics",
        ],
      };
    }

    // Phase 3 (steps 5+): Synthesis — no tools, generate text
    return {
      activeTools: [],
    };
  },
});
