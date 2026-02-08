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
  stopWhen: stepCountIs(6),
});
