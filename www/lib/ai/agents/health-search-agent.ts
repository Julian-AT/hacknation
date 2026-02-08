import { stepCountIs, ToolLoopAgent } from "ai";
import { getLanguageModel } from "../providers";
import { askClarifyingQuestion } from "../tools/ask-clarifying-question";
import { getProviderProfile } from "../tools/get-provider-profile";
import { searchProviders } from "../tools/search-providers";
import { firecrawlExtract } from "../tools/web/firecrawl-extract";
import { firecrawlScrape } from "../tools/web/firecrawl-scrape";
import { firecrawlSearch } from "../tools/web/firecrawl-search";
import { healthSearchAgentPrompt } from "./prompts";

/**
 * Health Search Agent — interactive provider discovery with iterative refinement.
 *
 * This agent specializes in personal healthcare search. It:
 *   1. Analyzes uploaded documents for health context
 *   2. Asks clarifying questions to refine the search
 *   3. Searches for providers via web + local cache
 *   4. Returns structured results with rich provider cards
 *
 * Phased execution via prepareStep:
 *   Phase 1 (0-2):  Understanding — askClarifyingQuestion only
 *   Phase 2 (3-6):  Search — searchProviders + web tools
 *   Phase 3 (7-8):  Enrichment — getProviderProfile for deep dives
 *   Phase 4 (9+):   Synthesis — no tools, final recommendation
 */
export const healthSearchAgent = new ToolLoopAgent({
  model: getLanguageModel("google/gemini-2.5-flash-lite"),
  instructions: healthSearchAgentPrompt,
  tools: {
    askClarifyingQuestion,
    searchProviders,
    getProviderProfile,
    firecrawlSearch,
    firecrawlScrape,
    firecrawlExtract,
  },
  stopWhen: stepCountIs(12),
  prepareStep: ({ stepNumber }) => {
    // Phase 1 (steps 0-2): Understanding — gather info from user
    if (stepNumber <= 2) {
      return {
        activeTools: ["askClarifyingQuestion"],
      };
    }

    // Phase 2 (steps 3-6): Search — find providers
    if (stepNumber <= 6) {
      return {
        activeTools: [
          "searchProviders",
          "firecrawlSearch",
          "firecrawlScrape",
          "firecrawlExtract",
          "askClarifyingQuestion",
        ],
      };
    }

    // Phase 3 (steps 7-8): Enrichment — deep dive on top results
    if (stepNumber <= 8) {
      return {
        activeTools: ["getProviderProfile", "searchProviders"],
      };
    }

    // Phase 4 (steps 9+): Synthesis — write final recommendation
    return {
      activeTools: [],
    };
  },
  onStepFinish: ({ usage, finishReason, toolCalls }) => {
    const toolNames =
      toolCalls?.map((tc) => tc.toolName).join(", ") ?? "none";
    console.log(
      `[HealthSearchAgent] Step finished | reason=${finishReason} | tools=[${toolNames}] | tokens=${usage?.totalTokens ?? "?"}`
    );
  },
});
