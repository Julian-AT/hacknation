"use client";

import {
  AlertCircle,
  Stethoscope,
  Tent,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

const SERVICE_TYPE_BADGE: Record<string, string> = {
  permanent: "border-green-500/20 bg-green-500/10 text-green-400",
  itinerant: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  referral: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  unclear: "",
};

const SUMMARY_BADGE: Record<string, string> = {
  permanent: "border-green-500/20 bg-green-500/10 text-green-400",
  itinerant: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  referral: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  unclear: "",
  individualTied: "border-purple-500/20 bg-purple-500/10 text-purple-400",
  campMissionEvidence: "border-orange-500/20 bg-orange-500/10 text-orange-400",
  weakOperationalSignals: "border-red-500/20 bg-red-500/10 text-red-400",
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
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <CardHeader className="flex-row items-center justify-between space-y-0 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Stethoscope className="size-3.5 text-pink-400" />
          <span className="text-xs font-medium text-muted-foreground">
            Service Classification
          </span>
          {focusArea && focusArea !== "all" && (
            <Badge className="text-[9px]" variant="secondary">
              {focusArea.replaceAll("_", " ")}
            </Badge>
          )}
        </div>
        <span className="tabular-nums text-[11px] text-muted-foreground">
          {facilitiesAnalyzed} analyzed
        </span>
      </CardHeader>

      {summary && (
        <CardContent className="flex flex-wrap gap-1.5 px-3 pb-2 pt-0">
          {Object.entries(summary).map(([type, count]) => {
            if (count === 0) {
              return null;
            }
            const label = SUMMARY_LABELS[type] ?? type;
            return (
              <Badge
                className={cn("text-[10px]", SUMMARY_BADGE[type])}
                key={type}
                variant="outline"
              >
                {count} {label}
              </Badge>
            );
          })}
        </CardContent>
      )}

      <CardContent className="px-3 pb-3 pt-0">
        <ul className="flex flex-col gap-1.5">
          {classifications.map((c) => (
            <li key={`${c.facilityId}-${c.serviceType}`}>
              <ClassificationItem classification={c} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ClassificationItem({
  classification: c,
}: {
  classification: Classification;
}) {
  const typeBadge =
    SERVICE_TYPE_BADGE[c.serviceType] ?? SERVICE_TYPE_BADGE.unclear;
  const confidenceDot = CONFIDENCE_DOTS[c.confidence] ?? CONFIDENCE_DOTS.low;

  const hasExtendedFindings =
    c.individualTied ||
    c.campMissionEvidence ||
    (c.weakOperationalSignals && c.weakOperationalSignals.length > 0);

  return (
    <Card className="p-2.5">
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <Badge
            className={cn("text-[10px]", typeBadge)}
            variant="outline"
          >
            {c.serviceType}
          </Badge>
          <span className="truncate text-xs font-medium text-foreground">
            {c.facilityName}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1" title={`${c.confidence} confidence`}>
          <span className={cn("size-1.5 rounded-full", confidenceDot)} />
          <span className="text-[10px] text-muted-foreground">
            {c.confidence}
          </span>
        </div>
      </div>

      {hasExtendedFindings && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {c.individualTied && (
            <Badge
              className="gap-1 border-purple-500/20 bg-purple-500/10 text-[9px] text-purple-400"
              variant="outline"
            >
              <User className="size-2.5" />
              Individual-tied
            </Badge>
          )}
          {c.campMissionEvidence && (
            <Badge
              className="gap-1 border-orange-500/20 bg-orange-500/10 text-[9px] text-orange-400"
              variant="outline"
            >
              <Tent className="size-2.5" />
              Camp/Mission
            </Badge>
          )}
          {c.weakOperationalSignals && c.weakOperationalSignals.length > 0 && (
            <Badge
              className="gap-1 border-red-500/20 bg-red-500/10 text-[9px] text-red-400"
              variant="outline"
            >
              <AlertCircle className="size-2.5" />
              Weak Ops ({c.weakOperationalSignals.length})
            </Badge>
          )}
        </div>
      )}

      {(c.evidenceQuotes.length > 0 ||
        c.matchedPatterns.length > 0 ||
        hasExtendedFindings) && (
        <Collapsible className="mt-1.5">
          <CollapsibleTrigger asChild>
            <Button
              className="h-auto gap-1 p-0 text-[10px]"
              type="button"
              variant="link"
            >
              Evidence
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1.5 space-y-1">
            {c.evidenceQuotes.map((q) => (
              <p
                className="rounded-md bg-muted px-2 py-1 text-[10px] italic text-muted-foreground"
                key={q}
              >
                &ldquo;{q}&rdquo;
              </p>
            ))}
            {c.matchedPatterns.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {c.matchedPatterns.map((p) => (
                  <Badge className="font-mono text-[9px] font-normal" key={p} variant="secondary">
                    {p}
                  </Badge>
                ))}
              </div>
            )}
            {c.individualTiedPatterns && c.individualTiedPatterns.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {c.individualTiedPatterns.map((p) => (
                  <Badge
                    className="border-purple-500/20 bg-purple-500/10 font-mono text-[9px] font-normal text-purple-400"
                    key={p}
                    variant="outline"
                  >
                    {p}
                  </Badge>
                ))}
              </div>
            )}
            {c.weakOperationalSignals && c.weakOperationalSignals.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {c.weakOperationalSignals.map((p) => (
                  <Badge
                    className="border-red-500/20 bg-red-500/10 font-mono text-[9px] font-normal text-red-400"
                    key={p}
                    variant="outline"
                  >
                    {p}
                  </Badge>
                ))}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}
    </Card>
  );
}
