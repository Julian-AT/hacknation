"use client";

import { ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

const LEVEL_BADGE: Record<string, string> = {
  green: "border-green-500/20 bg-green-500/10 text-green-400",
  yellow: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  red: "border-red-500/20 bg-red-500/10 text-red-400",
};

const LEVEL_LABELS: Record<string, string> = {
  red: "flagged",
  yellow: "caution",
  green: "verified",
};

export function CredibilityAssessmentResult({
  result,
}: CredibilityAssessmentResultProps) {
  const facilitiesAssessed = (result.facilitiesAssessed as number) ?? 0;
  const distribution = (result.distribution as Record<string, number>) ?? {};
  const assessments = (result.assessments as FacilityAssessment[]) ?? [];
  const summary = result.summary as string | undefined;

  return (
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <CardHeader className="flex-row items-center justify-between space-y-0 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-3.5 text-amber-400" />
          <span className="text-xs font-medium text-muted-foreground">
            Credibility Assessment
          </span>
        </div>
        <span className="tabular-nums text-[11px] text-muted-foreground">
          {facilitiesAssessed} assessed
        </span>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-2 px-3 pb-2 pt-0">
        {(["red", "yellow", "green"] as const).map((level) => {
          const count = distribution[level] ?? 0;
          if (count === 0) {
            return null;
          }
          const LevelIcon = LEVEL_ICON[level];
          return (
            <Badge
              className={cn("gap-1 text-[10px]", LEVEL_BADGE[level])}
              key={level}
              variant="outline"
            >
              <LevelIcon className="size-2.5" />
              {count} {LEVEL_LABELS[level]}
            </Badge>
          );
        })}
      </CardContent>

      <CardContent className="px-3 pb-3 pt-0">
        <ul className="flex flex-col gap-1.5">
          {assessments.map((assessment) => (
            <li key={assessment.facilityId}>
              <FacilityAssessmentItem assessment={assessment} />
            </li>
          ))}
        </ul>
      </CardContent>

      {summary && (
        <>
          <Separator />
          <CardContent className="px-3 py-2">
            <p className="text-pretty text-[11px] text-muted-foreground">
              {summary}
            </p>
          </CardContent>
        </>
      )}
    </Card>
  );
}

function FacilityAssessmentItem({
  assessment,
}: {
  assessment: FacilityAssessment;
}) {
  const { confidence } = assessment;
  const LevelIcon = LEVEL_ICON[confidence.level];
  const badgeClass = LEVEL_BADGE[confidence.level];

  return (
    <Card className="p-2.5">
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <LevelIcon
            className={cn(
              "size-3.5 shrink-0",
              confidence.level === "green"
                ? "text-green-400"
                : confidence.level === "yellow"
                  ? "text-amber-400"
                  : "text-red-400"
            )}
          />
          <span className="truncate text-xs font-medium text-foreground">
            {assessment.facilityName}
          </span>
        </div>
        <Badge
          className={cn("shrink-0 font-mono tabular-nums text-[11px]", badgeClass)}
          variant="outline"
        >
          {confidence.score}
        </Badge>
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-2">
        {assessment.facilityType && (
          <Badge
            className="border-blue-500/20 bg-blue-500/10 text-[10px] text-blue-400"
            variant="outline"
          >
            {assessment.facilityType}
          </Badge>
        )}
        {(assessment.region ?? assessment.city) && (
          <span className="text-[10px] text-muted-foreground">
            {[assessment.region, assessment.city].filter(Boolean).join(", ")}
          </span>
        )}
        {assessment.beds !== null && (
          <span className="tabular-nums text-[10px] text-muted-foreground">
            {assessment.beds} beds
          </span>
        )}
        {assessment.doctors !== null && (
          <span className="tabular-nums text-[10px] text-muted-foreground">
            {assessment.doctors} doctors
          </span>
        )}
      </div>

      {confidence.flags.length > 0 && (
        <div className="mt-1.5">
          <AnomalyConfidenceBadge confidence={confidence} />
        </div>
      )}
    </Card>
  );
}
