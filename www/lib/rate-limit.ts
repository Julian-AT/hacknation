/**
 * Simple sliding-window rate limiter.
 *
 * Uses an in-memory Map so limits are per-process. On serverless platforms
 * (Vercel) each cold-start gets a fresh Map, which still provides meaningful
 * brute-force protection. For stricter guarantees, swap to a Redis-backed
 * implementation (e.g. @upstash/ratelimit).
 */

interface RateLimitOptions {
  /** Time window in milliseconds (default: 60 000 = 1 minute). */
  windowMs?: number;
  /** Maximum requests allowed per window (default: 10). */
  max?: number;
}

interface Entry {
  timestamps: number[];
}

export function rateLimit(options: RateLimitOptions = {}) {
  const { windowMs = 60_000, max = 10 } = options;

  const store = new Map<string, Entry>();

  // Periodically prune stale entries to prevent unbounded memory growth.
  const PRUNE_INTERVAL = Math.max(windowMs * 5, 300_000);
  let lastPrune = Date.now();

  function prune(now: number) {
    if (now - lastPrune < PRUNE_INTERVAL) {
      return;
    }
    lastPrune = now;
    for (const [key, entry] of store) {
      const fresh = entry.timestamps.filter((t) => now - t < windowMs);
      if (fresh.length === 0) {
        store.delete(key);
      } else {
        entry.timestamps = fresh;
      }
    }
  }

  return {
    /**
     * Returns `true` if the request is within the rate limit, `false` if it
     * should be rejected.
     */
    check(key: string): boolean {
      const now = Date.now();
      prune(now);

      const entry = store.get(key);

      if (!entry) {
        store.set(key, { timestamps: [now] });
        return true;
      }

      // Drop timestamps outside the current window.
      entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

      if (entry.timestamps.length >= max) {
        return false;
      }

      entry.timestamps.push(now);
      return true;
    },
  };
}
