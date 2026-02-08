"use client";

import { Stethoscope, ChevronDown, ChevronRight, User, Tent, AlertCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Classification {
  facilityId: number;
  facilityName: string;
  region?: string | null;
  serviceType: "permanent" | "itinerant" | "referral" | "unclear";
  confidence: "high" | "medium" | "low";
  evidenceQuotes: string[];
  matchedPatterns: string[];
  individualTied?: boolean;
  individualTiedPatterns?: string[];
  campMissionEvidence?: boolean;
  campMissionPatterns?: string[];
  weakOperationalSignals?: string[];
}

interface ServiceClassificationResultProps {
  result: Record<string, unknown>;
}

const SERVICE_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  permanent: { bg: "bg-green-950/50", text: "text-green-400" },
  itinerant: { bg: "bg-blue-950/50", text: "text-blue-400" },
  referral: { bg: "bg-amber-950/50", text: "text-amber-400" },
  unclear: { bg: "bg-muted", text: "text-muted-foreground" },
};

const SUMMARY_COLORS: Record<string, { bg: string; text: string }> = {
  ...SERVICE_TYPE_COLORS,
  individualTied: { bg: "bg-purple-950/50", text: "text-purple-400" },
  campMissionEvidence: { bg: "bg-orange-950/50", text: "text-orange-400" },
  weakOperationalSignals: { bg: "bg-red-950/50", text: "text-red-400" },
};

const SUMMARY_LABELS: Record<string, string> = {
  permanent: "permanent",
  itinerant: "itinerant",
  referral: "referral",
  unclear: "unclear",
  individualTied: "individual-tied",
  campMissionEvidence: "camp/mission",
  weakOperationalSignals: "weak ops",
};

const CONFIDENCE_DOTS: Record<string, string> = {
  high: "bg-green-400",
  medium: "bg-amber-400",
  low: "bg-red-400",
};

export function ServiceClassificationResult({
  result,
}: ServiceClassificationResultProps) {
  const facilitiesAnalyzed = (result.facilitiesAnalyzed as number) ?? 0;
  const summary = result.summary as Record<string, number> | undefined;
  const classifications = (result.classifications as Classification[]) ?? [];
  const focusArea = result.focusArea as string | undefined;

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Stethoscope className="size-3.5 text-pink-400" />
          <span className="text-xs font-medium text-muted-foreground">
            Service Classification
          </span>
          {focusArea && focusArea !== "all" && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
              {focusArea.replaceAll("_", " ")}
            </span>
          )}
        </div>
        <span className="text-[11px] text-muted-foreground">
          {facilitiesAnalyzed} analyzed
        </span>
      </div>

      {summary && (
        <div className="flex flex-wrap gap-1.5 px-3 pb-2">
          {Object.entries(summary).map(([type, count]) => {
            if (count === 0) return null;
            const colors = SUMMARY_COLORS[type] ?? SUMMARY_COLORS.unclear;
            const label = SUMMARY_LABELS[type] ?? type;
            return (
              <span
                key={type}
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-semibold",
                  colors.bg,
                  colors.text,
                )}
              >
                {count} {label}
              </span>
            );
          })}
        </div>
      )}

      <div className="flex flex-col gap-1.5 px-3 pb-3">
        {classifications.map((c) => (
          <ClassificationItem key={`${c.facilityId}-${c.serviceType}`} classification={c} />
        ))}
      </div>
    </div>
  );
}

function ClassificationItem({
  classification: c,
}: {
  classification: Classification;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const typeColors =
    SERVICE_TYPE_COLORS[c.serviceType] ?? SERVICE_TYPE_COLORS.unclear;
  const confidenceDot = CONFIDENCE_DOTS[c.confidence] ?? CONFIDENCE_DOTS.low;

  const hasExtendedFindings =
    c.individualTied ||
    c.campMissionEvidence ||
    (c.weakOperationalSignals && c.weakOperationalSignals.length > 0);

  return (
    <div className="rounded-md bg-muted p-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-semibold",
              typeColors.bg,
              typeColors.text,
            )}
          >
            {c.serviceType}
          </span>
          <span className="text-xs font-medium text-foreground">
            {c.facilityName}
          </span>
        </div>
        <div className="flex items-center gap-1" title={`${c.confidence} confidence`}>
          <span className={cn("size-1.5 rounded-full", confidenceDot)} />
          <span className="text-[10px] text-muted-foreground">{c.confidence}</span>
        </div>
      </div>

      {/* Extended finding badges */}
      {hasExtendedFindings && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {c.individualTied && (
            <span className="flex items-center gap-1 rounded bg-purple-950/50 px-1.5 py-0.5 text-[9px] font-semibold text-purple-400">
              <User className="size-2.5" />
              Individual-tied
            </span>
          )}
          {c.campMissionEvidence && (
            <span className="flex items-center gap-1 rounded bg-orange-950/50 px-1.5 py-0.5 text-[9px] font-semibold text-orange-400">
              <Tent className="size-2.5" />
              Camp/Mission
            </span>
          )}
          {c.weakOperationalSignals && c.weakOperationalSignals.length > 0 && (
            <span className="flex items-center gap-1 rounded bg-red-950/50 px-1.5 py-0.5 text-[9px] font-semibold text-red-400">
              <AlertCircle className="size-2.5" />
              Weak Ops ({c.weakOperationalSignals.length})
            </span>
          )}
        </div>
      )}

      {(c.evidenceQuotes.length > 0 || c.matchedPatterns.length > 0 || hasExtendedFindings) && (
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
        >
          {showDetails ? (
            <ChevronDown className="size-3" />
          ) : (
            <ChevronRight className="size-3" />
          )}
          Evidence
        </button>
      )}

      {showDetails && (
        <div className="mt-1.5 space-y-1">
          {c.evidenceQuotes.map((q) => (
            <p
              key={q}
              className="rounded bg-muted/80 px-2 py-1 text-[10px] italic text-muted-foreground"
            >
              &ldquo;{q}&rdquo;
            </p>
          ))}
          {c.matchedPatterns.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {c.matchedPatterns.map((p) => (
                <span
                  key={p}
                  className="rounded bg-muted/80 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground"
                >
                  {p}
                </span>
              ))}
            </div>
          )}
          {c.individualTiedPatterns && c.individualTiedPatterns.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {c.individualTiedPatterns.map((p) => (
                <span
                  key={p}
                  className="rounded bg-purple-950/40 px-1.5 py-0.5 font-mono text-[9px] text-purple-400"
                >
                  {p}
                </span>
              ))}
            </div>
          )}
          {c.weakOperationalSignals && c.weakOperationalSignals.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {c.weakOperationalSignals.map((p) => (
                <span
                  key={p}
                  className="rounded bg-red-950/40 px-1.5 py-0.5 font-mono text-[9px] text-red-400"
                >
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
