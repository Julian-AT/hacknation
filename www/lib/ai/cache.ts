/**
 * Simple in-memory TTL cache for AI tool results.
 *
 * Replaces `@ai-sdk-tools/cache` — wraps tool objects so that repeated
 * calls with the same input parameters return a cached result within
 * the TTL window.
 */

type CachedOptions = {
  /** Default time-to-live in milliseconds. */
  ttl: number;
  /** Log cache hits/misses to the console. */
  debug?: boolean;
};

type CacheEntry = {
  data: unknown;
  timestamp: number;
};

/**
 * Create a caching wrapper factory.
 *
 * Usage:
 * ```ts
 * const cached = createCached({ ttl: 30 * 60 * 1000 });
 * const tool = cached(myTool, { ttl: 60_000 });
 * ```
 */
export function createCached(defaultOptions: CachedOptions) {
  const cache = new Map<string, CacheEntry>();

  /**
   * Wrap a tool (or any object with an `execute` method) so that
   * its results are cached by serialized input parameters.
   */
  return function cached<
    T extends { execute?: (...args: never[]) => Promise<unknown> },
  >(toolDef: T, overrideOptions?: { ttl?: number }): T {
    const ttl = overrideOptions?.ttl ?? defaultOptions.ttl;
    const debug = defaultOptions.debug ?? false;

    const originalExecute = toolDef.execute;
    if (!originalExecute) return toolDef;

    return {
      ...toolDef,
      execute: async (...args: unknown[]) => {
        const key = JSON.stringify(args.at(0));
        const entry = cache.get(key);

        if (entry && Date.now() - entry.timestamp < ttl) {
          if (debug) {
            console.log(`[cache] HIT: ${key.slice(0, 100)}`);
          }
          return entry.data;
        }

        if (debug) {
          console.log(`[cache] MISS: ${key.slice(0, 100)}`);
        }

        const result = await (originalExecute as Function).apply(
          toolDef,
          args
        );
        cache.set(key, { data: result, timestamp: Date.now() });
        return result;
      },
    } as T;
  };
}
