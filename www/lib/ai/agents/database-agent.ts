import { ToolLoopAgent, stepCountIs } from "ai";
import { getLanguageModel } from "../providers";
import { queryDatabase } from "../tools/queryDatabase";
import { searchFacilities } from "../tools/searchFacilities";
import { getFacility } from "../tools/getFacility";
import { databaseAgentPrompt } from "./prompts";

/**
 * Database Agent — queries, filters, and analyzes facility data.
 * Tools: queryDatabase, searchFacilities, getFacility
 */
export const databaseAgent = new ToolLoopAgent({
  model: getLanguageModel("google/gemini-2.5-flash-lite"),
  instructions: databaseAgentPrompt,
  tools: {
    queryDatabase,
    searchFacilities,
    getFacility,
  },
  stopWhen: stepCountIs(6),
});
