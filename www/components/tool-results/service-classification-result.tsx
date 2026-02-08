"use client";

import { Stethoscope, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Classification {
  facilityId: number;
  facilityName: string;
  serviceType: "permanent" | "itinerant" | "referral" | "unclear";
  confidence: "high" | "medium" | "low";
  evidenceQuotes: string[];
  matchedPatterns: string[];
}

interface ServiceClassificationResultProps {
  result: Record<string, unknown>;
}

const SERVICE_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  permanent: { bg: "bg-green-950/50", text: "text-green-400" },
  itinerant: { bg: "bg-blue-950/50", text: "text-blue-400" },
  referral: { bg: "bg-amber-950/50", text: "text-amber-400" },
  unclear: { bg: "bg-zinc-800", text: "text-zinc-400" },
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

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Stethoscope className="size-3.5 text-pink-400" />
          <span className="text-xs font-medium text-zinc-400">
            Service Classification
          </span>
        </div>
        <span className="text-[11px] text-zinc-500">
          {facilitiesAnalyzed} analyzed
        </span>
      </div>

      {summary && (
        <div className="flex gap-2 px-3 pb-2">
          {Object.entries(summary).map(([type, count]) => {
            if (count === 0) return null;
            const colors =
              SERVICE_TYPE_COLORS[type] ?? SERVICE_TYPE_COLORS.unclear;
            return (
              <span
                key={type}
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-semibold",
                  colors.bg,
                  colors.text,
                )}
              >
                {count} {type}
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

  return (
    <div className="rounded-md bg-zinc-800/60 p-2.5">
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
          <span className="text-xs font-medium text-zinc-300">
            {c.facilityName}
          </span>
        </div>
        <div className="flex items-center gap-1" title={`${c.confidence} confidence`}>
          <span className={cn("size-1.5 rounded-full", confidenceDot)} />
          <span className="text-[10px] text-zinc-500">{c.confidence}</span>
        </div>
      </div>

      {(c.evidenceQuotes.length > 0 || c.matchedPatterns.length > 0) && (
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="mt-1.5 flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-400"
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
              className="rounded bg-zinc-900/80 px-2 py-1 text-[10px] italic text-zinc-500"
            >
              &ldquo;{q}&rdquo;
            </p>
          ))}
          {c.matchedPatterns.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {c.matchedPatterns.map((p) => (
                <span
                  key={p}
                  className="rounded bg-zinc-900/80 px-1.5 py-0.5 font-mono text-[9px] text-zinc-500"
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
