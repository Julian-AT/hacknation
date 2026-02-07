/**
 * Shared safeguard utilities for AI tool executions.
 * Provides timeout management, result truncation, input validation, and SQL safety.
 */

// ---------------------------------------------------------------------------
// Timeout wrapper
// ---------------------------------------------------------------------------

export class ToolTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`Tool execution timed out after ${timeoutMs}ms`);
    this.name = "ToolTimeoutError";
  }
}

/**
 * Wraps an async operation with a timeout and optional abort signal support.
 * Rejects with `ToolTimeoutError` if the operation exceeds `timeoutMs`.
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  abortSignal?: AbortSignal
): Promise<T> {
  if (abortSignal?.aborted) {
    throw new Error("Operation was aborted before execution");
  }

  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new ToolTimeoutError(timeoutMs));
    }, timeoutMs);

    const onAbort = () => {
      clearTimeout(timer);
      reject(new Error("Operation was aborted"));
    };

    if (abortSignal) {
      abortSignal.addEventListener("abort", onAbort, { once: true });
    }

    promise
      .then((result) => {
        clearTimeout(timer);
        if (abortSignal) {
          abortSignal.removeEventListener("abort", onAbort);
        }
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timer);
        if (abortSignal) {
          abortSignal.removeEventListener("abort", onAbort);
        }
        reject(error);
      });
  });
}

// ---------------------------------------------------------------------------
// Result truncation
// ---------------------------------------------------------------------------

/**
 * Truncates a result array to a maximum number of rows.
 * Returns metadata about truncation for the LLM to communicate to the user.
 */
export function truncateResults<T>(
  rows: T[],
  maxRows: number
): { rows: T[]; truncated: boolean; totalCount: number } {
  return {
    rows: rows.slice(0, maxRows),
    truncated: rows.length > maxRows,
    totalCount: rows.length,
  };
}

/**
 * Strips the `embedding` vector field from facility objects to save tokens.
 * Embedding vectors are 1536-dimension arrays that waste context window space.
 */
export function stripEmbeddings<T extends Record<string, unknown>>(
  rows: T[]
): T[] {
  return rows.map((row) => {
    const { embedding: _, ...rest } = row;
    return rest as T;
  });
}

// ---------------------------------------------------------------------------
// SQL validation (enhanced)
// ---------------------------------------------------------------------------

const DESTRUCTIVE_KEYWORDS = [
  "DROP",
  "DELETE",
  "UPDATE",
  "INSERT",
  "ALTER",
  "TRUNCATE",
  "CREATE",
  "REPLACE",
  "GRANT",
  "REVOKE",
  "EXEC",
  "EXECUTE",
  "MERGE",
  "UPSERT",
  "COPY",
] as const;

const BLOCKED_TABLE_PATTERNS = [
  "pg_",
  "information_schema",
  "pg_shadow",
  "pg_authid",
  "pg_roles",
  "pg_user",
  "pg_catalog",
] as const;

const MAX_QUERY_LENGTH = 2000;

/**
 * Validates that a SQL query is safe for read-only execution.
 * Blocks destructive keywords, system table access, and enforces length limits.
 */
export function validateReadOnlySQL(query: string): {
  valid: boolean;
  reason?: string;
} {
  if (!query || query.trim().length === 0) {
    return { valid: false, reason: "Query is empty" };
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return {
      valid: false,
      reason: `Query exceeds maximum length of ${MAX_QUERY_LENGTH} characters`,
    };
  }

  // Strip SQL comments to prevent bypass via --comment or /*comment*/
  const stripped = query
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .trim();

  const normalized = stripped.toUpperCase();

  // Must start with SELECT or WITH (for CTEs)
  if (!normalized.startsWith("SELECT") && !normalized.startsWith("WITH")) {
    return { valid: false, reason: "Only SELECT queries are allowed" };
  }

  // Block destructive keywords (check against comment-stripped version)
  for (const keyword of DESTRUCTIVE_KEYWORDS) {
    // Use word boundary matching to avoid false positives
    const pattern = new RegExp(`\\b${keyword}\\b`, "i");
    if (pattern.test(stripped)) {
      return {
        valid: false,
        reason: `Destructive keyword "${keyword}" is not allowed`,
      };
    }
  }

  // Block system table access
  for (const pattern of BLOCKED_TABLE_PATTERNS) {
    if (normalized.includes(pattern.toUpperCase())) {
      return {
        valid: false,
        reason: `Access to system table "${pattern}" is not allowed`,
      };
    }
  }

  // Block multiple statements (semicolons, except at end)
  const semiCount = (stripped.match(/;/g) ?? []).length;
  if (semiCount > 1 || (semiCount === 1 && !stripped.trimEnd().endsWith(";"))) {
    return {
      valid: false,
      reason: "Multiple SQL statements are not allowed",
    };
  }

  return { valid: true };
}

// ---------------------------------------------------------------------------
// Input validation helpers
// ---------------------------------------------------------------------------

/**
 * Clamps a numeric value to a min/max range with a default fallback.
 */
export function clampNumber(
  value: unknown,
  min: number,
  max: number,
  defaultValue: number
): number {
  const num = typeof value === "number" && !Number.isNaN(value) ? value : defaultValue;
  return Math.max(min, Math.min(max, num));
}

/**
 * Validates latitude/longitude coordinate pair.
 */
export function isValidCoordinates(
  lat: number,
  lng: number
): { valid: boolean; reason?: string } {
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return { valid: false, reason: "Coordinates contain NaN values" };
  }
  if (lat < -90 || lat > 90) {
    return { valid: false, reason: `Latitude ${lat} is out of range (-90..90)` };
  }
  if (lng < -180 || lng > 180) {
    return {
      valid: false,
      reason: `Longitude ${lng} is out of range (-180..180)`,
    };
  }
  return { valid: true };
}

// ---------------------------------------------------------------------------
// Default constants
// ---------------------------------------------------------------------------

/** Default timeout for database queries in milliseconds */
export const DB_QUERY_TIMEOUT_MS = 15_000;

/** Maximum number of rows returned from any tool */
export const MAX_RESULT_ROWS = 100;

/** Maximum number of rows for search/nearby results */
export const MAX_SEARCH_ROWS = 50;
