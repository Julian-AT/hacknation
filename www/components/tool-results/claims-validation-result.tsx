"use client";

import { Brain, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ValidationIssue {
  facilityId: number;
  facilityName: string;
  validationType: string;
  severity: "low" | "medium" | "high" | "critical";
  finding: string;
  evidence: Record<string, unknown>;
}

interface ClaimsValidationResultProps {
  result: Record<string, unknown>;
}

const SEVERITY_COLORS: Record<string, { bg: string; text: string }> = {
  critical: { bg: "bg-red-950/50", text: "text-red-400" },
  high: { bg: "bg-orange-950/50", text: "text-orange-400" },
  medium: { bg: "bg-amber-950/50", text: "text-amber-400" },
  low: { bg: "bg-green-950/50", text: "text-green-400" },
};

export function ClaimsValidationResult({
  result,
}: ClaimsValidationResultProps) {
  const facilitiesChecked = (result.facilitiesChecked as number) ?? 0;
  const issuesFound = (result.issuesFound as number) ?? 0;
  const results = (result.results as ValidationIssue[]) ?? [];
  const summary = result.summary as string | undefined;

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Brain className="size-3.5 text-orange-400" />
          <span className="text-xs font-medium text-muted-foreground">
            Claims Validation
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">
            {facilitiesChecked} checked
          </span>
          <span className="rounded-full bg-orange-950/50 px-2 py-0.5 font-mono text-[11px] font-semibold text-orange-400">
            {issuesFound} {issuesFound === 1 ? "issue" : "issues"}
          </span>
        </div>
      </div>

      {/* Severity distribution */}
      {results.length > 0 && (
        <div className="flex gap-2 px-3 pb-2">
          {(["critical", "high", "medium", "low"] as const).map((sev) => {
            const sevCount = results.filter((r) => r.severity === sev).length;
            if (sevCount === 0) return null;
            const colors = SEVERITY_COLORS[sev];
            return (
              <span
                key={sev}
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                  colors.bg,
                  colors.text,
                )}
              >
                {sevCount} {sev}
              </span>
            );
          })}
        </div>
      )}

      <div className="flex flex-col gap-1.5 px-3 pb-3">
        {results.map((issue) => (
          <ValidationIssueItem key={`${issue.facilityId}-${issue.validationType}`} issue={issue} />
        ))}
      </div>

      {summary && (
        <div className="border-t border-border px-3 py-2">
          <p className="text-[11px] text-muted-foreground">{summary}</p>
        </div>
      )}
    </div>
  );
}

function ValidationIssueItem({ issue }: { issue: ValidationIssue }) {
  const [showEvidence, setShowEvidence] = useState(false);
  const colors = SEVERITY_COLORS[issue.severity] ?? SEVERITY_COLORS.low;

  return (
    <div className="rounded-md bg-muted p-2.5">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
            colors.bg,
            colors.text,
          )}
        >
          {issue.severity}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          {issue.validationType}
        </span>
      </div>
      <p className="mt-1 text-xs font-medium text-foreground">
        {issue.facilityName}
      </p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{issue.finding}</p>

      <button
        type="button"
        onClick={() => setShowEvidence(!showEvidence)}
        className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-muted-foreground"
      >
        {showEvidence ? (
          <ChevronDown className="size-3" />
        ) : (
          <ChevronRight className="size-3" />
        )}
        Evidence
      </button>

      {showEvidence && (
        <pre className="mt-1 max-h-24 overflow-y-auto rounded bg-muted/80 p-2 font-mono text-[10px] text-muted-foreground">
          {JSON.stringify(issue.evidence, null, 2)}
        </pre>
      )}
    </div>
  );
}
