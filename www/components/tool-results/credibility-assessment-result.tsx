"use client";

import { ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AnomalyConfidenceBadge } from "./anomaly-confidence-badge";

interface AnomalyFlag {
  checkId: string;
  severity: "critical" | "high" | "medium" | "low";
  explanation: string;
}

interface FacilityAssessment {
  facilityId: number;
  facilityName: string;
  facilityType: string | null;
  region: string | null;
  city: string | null;
  beds: number | null;
  doctors: number | null;
  confidence: {
    level: "green" | "yellow" | "red";
    score: number;
    summary: string;
    flags: AnomalyFlag[];
  };
}

interface CredibilityAssessmentResultProps {
  result: Record<string, unknown>;
}

const LEVEL_ICON = {
  green: ShieldCheck,
  yellow: ShieldAlert,
  red: ShieldX,
} as const;

const LEVEL_COLORS = {
  green: { bg: "bg-green-950/50", text: "text-green-400" },
  yellow: { bg: "bg-amber-950/50", text: "text-amber-400" },
  red: { bg: "bg-red-950/50", text: "text-red-400" },
} as const;

export function CredibilityAssessmentResult({
  result,
}: CredibilityAssessmentResultProps) {
  const facilitiesAssessed = (result.facilitiesAssessed as number) ?? 0;
  const distribution = (result.distribution as Record<string, number>) ?? {};
  const assessments = (result.assessments as FacilityAssessment[]) ?? [];
  const summary = result.summary as string | undefined;

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-3.5 text-amber-400" />
          <span className="text-xs font-medium text-muted-foreground">
            Credibility Assessment
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground">
          {facilitiesAssessed} assessed
        </span>
      </div>

      {/* Distribution badges */}
      <div className="flex gap-2 px-3 pb-2">
        {(["red", "yellow", "green"] as const).map((level) => {
          const count = distribution[level] ?? 0;
          if (count === 0) return null;
          const colors = LEVEL_COLORS[level];
          const LevelIcon = LEVEL_ICON[level];
          return (
            <span
              className={cn(
                "flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold",
                colors.bg,
                colors.text
              )}
              key={level}
            >
              <LevelIcon className="size-2.5" />
              {count} {level === "red" ? "flagged" : level === "yellow" ? "caution" : "verified"}
            </span>
          );
        })}
      </div>

      {/* Facility list */}
      <div className="flex flex-col gap-1.5 px-3 pb-3">
        {assessments.map((assessment) => (
          <FacilityAssessmentItem
            assessment={assessment}
            key={assessment.facilityId}
          />
        ))}
      </div>

      {/* Summary */}
      {summary && (
        <div className="border-t border-border px-3 py-2">
          <p className="text-[11px] text-muted-foreground">{summary}</p>
        </div>
      )}
    </div>
  );
}

function FacilityAssessmentItem({
  assessment,
}: {
  assessment: FacilityAssessment;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const { confidence } = assessment;
  const colors = LEVEL_COLORS[confidence.level];
  const LevelIcon = LEVEL_ICON[confidence.level];

  return (
    <div className="rounded-md bg-muted p-2.5">
      {/* Facility header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LevelIcon className={cn("size-3.5", colors.text)} />
          <span className="text-xs font-medium text-foreground">
            {assessment.facilityName}
          </span>
        </div>
        <span
          className={cn(
            "font-mono text-[11px] font-bold",
            colors.text
          )}
        >
          {confidence.score}
        </span>
      </div>

      {/* Facility meta */}
      <div className="mt-1 flex items-center gap-2">
        {assessment.facilityType && (
          <span className="rounded bg-blue-950/50 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
            {assessment.facilityType}
          </span>
        )}
        {(assessment.region ?? assessment.city) && (
          <span className="text-[10px] text-muted-foreground">
            {[assessment.region, assessment.city].filter(Boolean).join(", ")}
          </span>
        )}
        {assessment.beds !== null && (
          <span className="text-[10px] text-muted-foreground">
            {assessment.beds} beds
          </span>
        )}
        {assessment.doctors !== null && (
          <span className="text-[10px] text-muted-foreground">
            {assessment.doctors} doctors
          </span>
        )}
      </div>

      {/* Toggle details */}
      {confidence.flags.length > 0 && (
        <button
          className="mt-1.5 text-[10px] text-muted-foreground hover:text-foreground"
          onClick={() => setShowDetails(!showDetails)}
          type="button"
        >
          {showDetails ? "Hide" : "Show"} {confidence.flags.length}{" "}
          {confidence.flags.length === 1 ? "finding" : "findings"}
        </button>
      )}

      {showDetails && (
        <div className="mt-1.5">
          <AnomalyConfidenceBadge confidence={confidence} />
        </div>
      )}
    </div>
  );
}
