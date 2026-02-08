import FirecrawlApp from "@mendable/firecrawl-js";
import { tool } from "ai";
import { z } from "zod";
import { createToolLogger } from "../debug";

function getFirecrawlClient() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error("FIRECRAWL_API_KEY environment variable is not set");
  }
  return new FirecrawlApp({ apiKey });
}

export const firecrawlExtract = tool({
  description:
    "Extract structured data from one or more web pages using AI. Can extract facility details, health statistics, or custom data based on a prompt. Use for pulling specific data points from web pages.",
  inputSchema: z.object({
    urls: z
      .array(z.string().url())
      .min(1)
      .max(5)
      .describe("URLs to extract data from (1-5 URLs)"),
    prompt: z
      .string()
      .min(1)
      .max(500)
      .describe(
        "Describe what data to extract from the pages (e.g., 'Extract the facility name, services offered, number of beds, and contact information')"
      ),
  }),
  execute: async ({ urls, prompt }) => {
    const log = createToolLogger("firecrawlExtract");
    const start = Date.now();
    log.start({ urls, prompt });

    try {
      const client = getFirecrawlClient();

      log.step("Extracting structured data from URLs", urls.length);
      // Firecrawl v4: extract takes a single args object
      const response = await client.extract({
        urls,
        prompt,
      });

      if (!response.success) {
        log.error(
          new Error("Extraction failed"),
          { urls, prompt },
          Date.now() - start
        );
        return {
          error:
            "Failed to extract data from the provided URLs. The pages may be inaccessible or the extraction prompt may need refinement.",
        };
      }

      const output = {
        urls,
        prompt,
        extractedData: response.data ?? null,
      };
      log.success(output, Date.now() - start);
      return output;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown extraction error";
      log.error(error, { urls, prompt }, Date.now() - start);
      return { error: `Data extraction failed: ${message}` };
    }
  },
});
