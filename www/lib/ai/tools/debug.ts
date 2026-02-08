const TOOL_LOG_PREFIX = "[VFTool]";

function truncate(value: unknown, maxLen = 500): string {
  const str =
    typeof value === "string" ? value : JSON.stringify(value, null, 0);
  if (str && str.length > maxLen) {
    return `${str.slice(0, maxLen)}... (${str.length} chars)`;
  }
  return str ?? "undefined";
}

function summarizeResult(result: unknown): string {
  if (result === null || result === undefined) {
    return "null";
  }
  if (typeof result !== "object") {
    return truncate(result, 200);
  }

  const obj = result as Record<string, unknown>;

  // Check for error result
  if ("error" in obj) {
    return `ERROR: ${truncate(obj.error, 300)}`;
  }

  // Summarize by known shapes
  const parts: string[] = [];
  if ("count" in obj) {
    parts.push(`count=${obj.count}`);
  }
  if ("facilities" in obj && Array.isArray(obj.facilities)) {
    parts.push(`facilities=${obj.facilities.length}`);
  }
  if ("results" in obj && Array.isArray(obj.results)) {
    parts.push(`results=${obj.results.length}`);
  }
  if ("stats" in obj && Array.isArray(obj.stats)) {
    parts.push(`stats=${obj.stats.length}`);
  }
  if ("desertZones" in obj && Array.isArray(obj.desertZones)) {
    parts.push(`desertZones=${obj.desertZones.length}`);
  }
  if ("recommendations" in obj && Array.isArray(obj.recommendations)) {
    parts.push(`recommendations=${obj.recommendations.length}`);
  }
  if ("foundAnomalies" in obj) {
    parts.push(`anomalies=${obj.foundAnomalies}`);
  }
  if ("rows" in obj && Array.isArray(obj.rows)) {
    parts.push(`rows=${obj.rows.length}`);
  }
  if ("totalFacilities" in obj) {
    parts.push(`total=${obj.totalFacilities}`);
  }
  if ("facility" in obj) {
    parts.push("facility=found");
  }
  if ("candidates" in obj && Array.isArray(obj.candidates)) {
    parts.push(`candidates=${obj.candidates.length}`);
  }

  if (parts.length > 0) {
    return `{ ${parts.join(", ")} }`;
  }
  return truncate(result, 300);
}

export function createToolLogger(toolName: string) {
  const tag = `${TOOL_LOG_PREFIX}[${toolName}]`;

  return {
    start(args: Record<string, unknown>) {
      console.log(`${tag} START | args: ${truncate(args, 400)}`);
    },

    step(label: string, data?: unknown) {
      if (data !== undefined) {
        console.log(`${tag} STEP  | ${label}: ${truncate(data, 300)}`);
      } else {
        console.log(`${tag} STEP  | ${label}`);
      }
    },

    success(result: unknown, durationMs: number) {
      console.log(
        `${tag} OK    | ${summarizeResult(result)} in ${durationMs}ms`
      );
    },

    error(err: unknown, args: Record<string, unknown>, durationMs: number) {
      const message = err instanceof Error ? err.message : String(err);
      const stack = err instanceof Error ? err.stack : undefined;

      console.error(`${tag} ERROR | ${message}`);
      if (stack) {
        console.error(`${tag} ERROR | Stack: ${stack}`);
      }
      console.error(
        `${tag} ERROR | Duration: ${durationMs}ms | Args: ${truncate(args, 400)}`
      );
    },
  };
}
