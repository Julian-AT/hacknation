import { createCached } from "@ai-sdk-tools/cache";

/**
 * Environment-aware cache factory for AI tool results.
 *
 * Production: Redis (shares the existing REDIS_URL used for resumable streams)
 * Development: LRU in-memory cache with debug logging
 */
export const cached = createCached({
  ttl: 30 * 60 * 1000, // 30 minutes default
  debug: process.env.NODE_ENV !== "production",
});
