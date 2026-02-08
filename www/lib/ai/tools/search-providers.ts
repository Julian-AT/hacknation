import FirecrawlApp from "@mendable/firecrawl-js";
import { tool } from "ai";
import { z } from "zod";
import {
  searchCachedProviders,
  upsertProviders,
} from "@/lib/db/queries";

function getFirecrawlClient() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error("FIRECRAWL_API_KEY environment variable is not set");
  }
  return new FirecrawlApp({ apiKey });
}

const providerSchema = z.object({
  name: z.string(),
  type: z.string(),
  specialty: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  rating: z.number().optional(),
  reviewCount: z.number().optional(),
  hours: z.string().optional(),
  insuranceAccepted: z.array(z.string()).optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  imageUrl: z.string().optional(),
});

type ExtractedProvider = z.infer<typeof providerSchema>;

export const searchProviders = tool({
  description:
    "Search for healthcare providers (doctors, hospitals, clinics) by location and specialty. First checks the local cache, then searches the web for new results. Returns structured provider data with contact info, ratings, and location.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "Search query describing what kind of provider to find (e.g., 'general practitioner', 'pediatric dentist', 'orthopedic surgeon')"
      ),
    location: z
      .string()
      .describe(
        "City, neighborhood, or address to search near (e.g., 'Berlin Mitte', 'San Francisco', 'Accra, Ghana')"
      ),
    specialty: z
      .string()
      .optional()
      .describe("Medical specialty to filter by"),
    limit: z
      .number()
      .min(1)
      .max(10)
      .default(5)
      .describe("Maximum number of providers to return"),
  }),
  execute: async ({ query, location, specialty, limit }) => {
    const startTime = Date.now();

    // 1. Check local cache first
    try {
      const cached = await searchCachedProviders({
        city: location,
        specialty,
        limit,
      });

      if (cached.length >= limit) {
        console.log(
          `[searchProviders] Returning ${cached.length} cached results for "${query}" in ${location}`
        );
        return {
          query,
          location,
          resultCount: cached.length,
          source: "cache" as const,
          providers: cached.map((p) => ({
            id: p.id,
            name: p.name,
            type: p.type,
            specialty: p.specialty,
            address: p.address,
            city: p.city,
            region: p.region,
            country: p.country,
            phone: p.phone,
            email: p.email,
            website: p.website,
            rating: p.rating,
            reviewCount: p.reviewCount,
            hours: p.hours,
            insuranceAccepted: p.insuranceAccepted,
            lat: p.lat,
            lng: p.lng,
            imageUrl: p.imageUrl,
            sourceUrl: p.sourceUrl,
          })),
          durationMs: Date.now() - startTime,
        };
      }
    } catch (cacheError) {
      console.error(
        "[searchProviders] Cache lookup failed:",
        cacheError instanceof Error ? cacheError.message : cacheError
      );
    }

    // 2. Search the web via Firecrawl
    try {
      const client = getFirecrawlClient();
      const searchQuery = `${query} ${specialty ?? ""} ${location} doctor hospital clinic contact address phone rating`.trim();

      console.log(`[searchProviders] Web search: "${searchQuery}"`);

      const searchData = await client.search(searchQuery, {
        limit: Math.min(limit * 2, 10),
      });

      const webResults = searchData.web ?? [];

      if (webResults.length === 0) {
        return {
          query,
          location,
          resultCount: 0,
          source: "web" as const,
          providers: [],
          durationMs: Date.now() - startTime,
          message: "No results found. Try a different location or broader search terms.",
        };
      }

      // 3. Extract structured provider data from top results
      const urls = webResults
        .map((r) => {
          const result = r as Record<string, unknown>;
          return String(result.url ?? "");
        })
        .filter((url) => url.length > 0)
        .slice(0, 5);

      let extractedProviders: ExtractedProvider[] = [];

      if (urls.length > 0) {
        try {
          const extractResponse = await client.extract({
            urls,
            prompt: `Extract healthcare provider information from these pages. For each provider found, extract: name, type (doctor/hospital/clinic/specialist), specialty, full address, city, region/state, country, phone number, email, website URL, rating (number 0-5), review count, operating hours, accepted insurance plans, latitude, longitude, and image URL. Return an array of providers.`,
          });

          if (extractResponse.success && extractResponse.data) {
            const rawData = extractResponse.data as Record<string, unknown>;
            const rawProviders = (
              Array.isArray(rawData)
                ? rawData
                : Array.isArray(rawData.providers)
                  ? rawData.providers
                  : []
            ) as Record<string, unknown>[];

            for (const raw of rawProviders) {
              const parsed = providerSchema.safeParse(raw);
              if (parsed.success) {
                extractedProviders.push(parsed.data);
              }
            }
          }
        } catch (extractError) {
          console.error(
            "[searchProviders] Extraction failed:",
            extractError instanceof Error
              ? extractError.message
              : extractError
          );
        }
      }

      // If extraction didn't work, build basic results from search snippets
      if (extractedProviders.length === 0) {
        extractedProviders = webResults.slice(0, limit).map((r) => {
          const result = r as Record<string, unknown>;
          return {
            name: String(result.title ?? "Unknown Provider"),
            type: specialty ?? "healthcare",
            specialty: specialty ?? undefined,
            city: location,
            website: String(result.url ?? ""),
          };
        });
      }

      // 4. Cache the results
      try {
        const toCache = extractedProviders.map((p) => ({
          name: p.name,
          type: p.type,
          specialty: p.specialty ?? null,
          address: p.address ?? null,
          city: p.city ?? location,
          region: p.region ?? null,
          country: p.country ?? null,
          lat: p.lat ?? null,
          lng: p.lng ?? null,
          phone: p.phone ?? null,
          email: p.email ?? null,
          website: p.website ?? null,
          rating: p.rating ?? null,
          reviewCount: p.reviewCount ?? null,
          hours: p.hours ?? null,
          insuranceAccepted: p.insuranceAccepted ?? null,
          imageUrl: p.imageUrl ?? null,
          sourceUrl: p.website ?? null,
          rawData: null,
        }));

        await upsertProviders(toCache);
      } catch (cacheError) {
        console.error(
          "[searchProviders] Cache write failed:",
          cacheError instanceof Error ? cacheError.message : cacheError
        );
      }

      // 5. Return structured results
      const providers = extractedProviders.slice(0, limit).map((p, idx) => ({
        id: `web-${idx}`,
        name: p.name,
        type: p.type,
        specialty: p.specialty ?? null,
        address: p.address ?? null,
        city: p.city ?? location,
        region: p.region ?? null,
        country: p.country ?? null,
        phone: p.phone ?? null,
        email: p.email ?? null,
        website: p.website ?? null,
        rating: p.rating ?? null,
        reviewCount: p.reviewCount ?? null,
        hours: p.hours ?? null,
        insuranceAccepted: p.insuranceAccepted ?? null,
        lat: p.lat ?? null,
        lng: p.lng ?? null,
        imageUrl: p.imageUrl ?? null,
        sourceUrl: p.website ?? null,
      }));

      console.log(
        `[searchProviders] Returning ${providers.length} web results in ${Date.now() - startTime}ms`
      );

      return {
        query,
        location,
        resultCount: providers.length,
        source: "web" as const,
        providers,
        durationMs: Date.now() - startTime,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown search error";
      console.error(`[searchProviders] Error: ${message}`);
      return {
        error: `Provider search failed: ${message}`,
        query,
        location,
      };
    }
  },
});
