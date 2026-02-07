import { z } from "zod";
import { tool } from "ai";
import FirecrawlApp from "@mendable/firecrawl-js";
import { createToolLogger } from "../debug";

function getFirecrawlClient() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error("FIRECRAWL_API_KEY environment variable is not set");
  }
  return new FirecrawlApp({ apiKey });
}

export const firecrawlSearch = tool({
  description:
    "Search the web for real-time information. Use for finding current health data, news, WHO reports, facility updates, or any external data not in the database.",
  inputSchema: z.object({
    query: z
      .string()
      .min(1)
      .max(500)
      .describe("The search query to find relevant web content"),
    limit: z
      .number()
      .min(1)
      .max(10)
      .default(5)
      .describe("Maximum number of search results to return"),
  }),
  execute: async ({ query, limit }) => {
    const log = createToolLogger("firecrawlSearch");
    const start = Date.now();
    log.start({ query, limit });

    try {
      const client = getFirecrawlClient();

      log.step("Executing web search", query);
      // Firecrawl v4: search returns SearchData with web/news arrays
      const searchData = await client.search(query, { limit });

      const webResults = searchData.web ?? [];

      const results = webResults.map((result) => {
        // Handle both SearchResultWeb and Document types
        const r = result as Record<string, unknown>;
        return {
          title: String(r.title ?? "No title"),
          url: String(r.url ?? ""),
          snippet: String(
            r.description ?? r.summary ?? r.markdown ?? "No description available"
          ).slice(0, 300),
        };
      });

      log.step("Search results returned", results.length);

      const output = {
        query,
        resultCount: results.length,
        results,
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown search error";
      log.error(error, { query, limit }, Date.now() - start);
      return { error: `Web search failed: ${message}` };
    }
  },
});
