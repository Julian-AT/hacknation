import FirecrawlApp from "@mendable/firecrawl-js";
import { tool } from "ai";
import { z } from "zod";
import { getProviderById } from "@/lib/db/queries";

function getFirecrawlClient() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error("FIRECRAWL_API_KEY environment variable is not set");
  }
  return new FirecrawlApp({ apiKey });
}

export const getProviderProfile = tool({
  description:
    "Get detailed profile information for a single healthcare provider. Can look up by cached provider ID or scrape a provider's website URL for enriched details including services, staff, facilities, and patient reviews.",
  inputSchema: z.object({
    providerId: z
      .string()
      .optional()
      .describe("Cached provider ID from a previous searchProviders result"),
    url: z
      .string()
      .url()
      .optional()
      .describe(
        "Provider website URL to scrape for detailed information"
      ),
  }),
  execute: async ({ providerId, url }) => {
    // 1. Try cached lookup
    if (providerId) {
      try {
        const cached = await getProviderById({ id: providerId });
        if (cached) {
          return {
            source: "cache" as const,
            provider: {
              id: cached.id,
              name: cached.name,
              type: cached.type,
              specialty: cached.specialty,
              address: cached.address,
              city: cached.city,
              region: cached.region,
              country: cached.country,
              phone: cached.phone,
              email: cached.email,
              website: cached.website,
              rating: cached.rating,
              reviewCount: cached.reviewCount,
              hours: cached.hours,
              insuranceAccepted: cached.insuranceAccepted,
              lat: cached.lat,
              lng: cached.lng,
              imageUrl: cached.imageUrl,
              sourceUrl: cached.sourceUrl,
            },
          };
        }
      } catch (error) {
        console.error(
          "[getProviderProfile] Cache lookup failed:",
          error instanceof Error ? error.message : error
        );
      }
    }

    // 2. Scrape URL for enriched details
    if (url) {
      try {
        const client = getFirecrawlClient();
        const scrapeResponse = await client.scrape(url, {
          formats: ["markdown"],
        });

        const markdown = scrapeResponse.markdown ?? "";

        if (markdown) {
          // Extract structured data from the scraped content
          const extractResponse = await client.extract({
            urls: [url],
            prompt:
              "Extract detailed healthcare provider information: name, type (doctor/hospital/clinic), all specialties offered, full address, city, region, country, all phone numbers, email, website, rating, review count, operating hours for each day, insurance plans accepted, number of doctors/staff, number of beds (if hospital), list of services offered, patient reviews summary, parking availability, wheelchair accessibility, languages spoken, and any images.",
          });

          if (extractResponse.success && extractResponse.data) {
            return {
              source: "web" as const,
              url,
              provider: extractResponse.data,
              rawContent: markdown.slice(0, 2000),
            };
          }

          // Fallback: return raw markdown if extraction failed
          return {
            source: "web" as const,
            url,
            provider: null,
            rawContent: markdown.slice(0, 3000),
            note: "Structured extraction failed. Raw content provided for analysis.",
          };
        }

        return {
          error: "Failed to scrape the provider URL. The page may be inaccessible.",
          url,
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        return {
          error: `Failed to get provider details: ${message}`,
          url,
        };
      }
    }

    return {
      error:
        "Please provide either a providerId or a URL to look up provider details.",
    };
  },
});
