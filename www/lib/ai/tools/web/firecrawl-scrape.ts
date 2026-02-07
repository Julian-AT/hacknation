import { z } from "zod";
import { tool } from "ai";
import FirecrawlApp from "@mendable/firecrawl-js";
import { createToolLogger } from "../debug";

const MAX_CONTENT_LENGTH = 10_000;

function getFirecrawlClient() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error("FIRECRAWL_API_KEY environment variable is not set");
  }
  return new FirecrawlApp({ apiKey });
}

export const firecrawlScrape = tool({
  description:
    "Scrape a specific web page and extract its content as clean markdown. Use after searching to read full page content from a URL.",
  inputSchema: z.object({
    url: z
      .string()
      .url()
      .describe("The URL to scrape and extract content from"),
  }),
  execute: async ({ url }) => {
    const log = createToolLogger("firecrawlScrape");
    const start = Date.now();
    log.start({ url });

    try {
      const client = getFirecrawlClient();

      log.step("Scraping URL", url);
      // Firecrawl v4: method is `scrape`, not `scrapeUrl`
      const response = await client.scrape(url, {
        formats: ["markdown"],
        timeout: 15_000,
      });

      const markdown = response.markdown ?? "";
      const truncated = markdown.length > MAX_CONTENT_LENGTH;
      const content = truncated
        ? `${markdown.slice(0, MAX_CONTENT_LENGTH)}\n\n[Content truncated - ${markdown.length} chars total]`
        : markdown;

      const output = {
        url,
        title: response.metadata?.title ?? "Unknown",
        contentLength: markdown.length,
        truncated,
        content,
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown scrape error";
      log.error(error, { url }, Date.now() - start);
      return { error: `Scrape failed: ${message}` };
    }
  },
});
