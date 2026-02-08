import { ToolLoopAgent, stepCountIs } from "ai";
import { getLanguageModel } from "../providers";
import { firecrawlSearch } from "../tools/web/firecrawl-search";
import { firecrawlScrape } from "../tools/web/firecrawl-scrape";
import { firecrawlExtract } from "../tools/web/firecrawl-extract";
import { corroborateClaims } from "../tools/web/corroborateClaims";
import { getWHOData } from "../tools/web/who-gho";
import { queryOSMFacilities } from "../tools/web/overpass-facilities";
import { webResearchAgentPrompt } from "./prompts";

/**
 * Web Research Agent — searches and scrapes the web for real-time data.
 * Tools: firecrawlSearch, firecrawlScrape, firecrawlExtract, corroborateClaims, getWHOData, queryOSMFacilities
 *
 * Phased execution via prepareStep:
 *   Phase 1 (0-1): Search — getWHOData, firecrawlSearch, queryOSMFacilities
 *   Phase 2 (2-4): Deep dive — firecrawlScrape, firecrawlExtract, corroborateClaims
 *   Phase 3 (5+):  Synthesis — no tools, generate final research summary
 */
export const webResearchAgent = new ToolLoopAgent({
  model: getLanguageModel("google/gemini-2.5-flash-lite"),
  instructions: webResearchAgentPrompt,
  tools: {
    firecrawlSearch,
    firecrawlScrape,
    firecrawlExtract,
    corroborateClaims,
    getWHOData,
    queryOSMFacilities,
  },
  stopWhen: stepCountIs(8),
  prepareStep: async ({ stepNumber }) => {
    // Phase 1 (steps 0-1): Search — cast a wide net
    if (stepNumber <= 1) {
      return {
        activeTools: [
          "getWHOData",
          "firecrawlSearch",
          "queryOSMFacilities",
        ],
      };
    }

    // Phase 2 (steps 2-4): Deep dive — investigate promising leads
    if (stepNumber <= 4) {
      return {
        activeTools: [
          "firecrawlScrape",
          "firecrawlExtract",
          "corroborateClaims",
          "firecrawlSearch",
        ],
      };
    }

    // Phase 3 (steps 5+): Synthesis — no tools, generate research summary
    return {
      activeTools: [],
    };
  },
});
