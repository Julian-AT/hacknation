"use client";

import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

export function CredibilityAssessmentResult({
  result,
}: CredibilityAssessmentResultProps) {
  const facilitiesAssessed = (result.facilitiesAssessed as number) ?? 0;
  const distribution = (result.distribution as Record<string, number>) ?? {};
  const assessments = (result.assessments as FacilityAssessment[]) ?? [];
  const summary = result.summary as string | undefined;

  return (
    <Card className="my-2 w-full overflow-hidden">
      <CardHeader className="flex-row items-center justify-between space-y-0 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-3.5 text-muted-foreground" />
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
          const labels = { red: "flagged", yellow: "caution", green: "verified" } as const;
          return (
            <Badge
              className="gap-1 text-[10px]"
              key={level}
              variant="outline"
            >
              {count} {labels[level]}
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

  return (
    <div className="rounded-md border border-border p-2.5">
      <div className="flex items-center justify-between">
        <span className="truncate text-xs font-medium text-foreground">
          {assessment.facilityName}
        </span>
        <Badge
          className="shrink-0 font-mono tabular-nums text-[11px]"
          variant="outline"
        >
          {confidence.score}
        </Badge>
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
        {assessment.facilityType && (
          <Badge variant="secondary" className="text-[10px] font-normal">
            {assessment.facilityType}
          </Badge>
        )}
        {(assessment.region ?? assessment.city) && (
          <span>
            {[assessment.region, assessment.city].filter(Boolean).join(", ")}
          </span>
        )}
        {assessment.beds !== null && (
          <span className="tabular-nums">{assessment.beds} beds</span>
        )}
        {assessment.doctors !== null && (
          <span className="tabular-nums">{assessment.doctors} doctors</span>
        )}
      </div>

      {confidence.flags.length > 0 && (
        <div className="mt-1.5">
          <AnomalyConfidenceBadge confidence={confidence} />
        </div>
      )}
    </div>
  );
}
