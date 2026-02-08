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

export function ServiceClassificationResult({
  result,
}: ServiceClassificationResultProps) {
  const facilitiesAnalyzed = (result.facilitiesAnalyzed as number) ?? 0;
  const summary = result.summary as Record<string, number> | undefined;
  const classifications = (result.classifications as Classification[]) ?? [];
  const focusArea = result.focusArea as string | undefined;

  return (
    <Card className="my-2 w-full overflow-hidden">
      <CardHeader className="flex-row items-center justify-between space-y-0 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Stethoscope className="size-3.5 text-muted-foreground" />
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
            return (
              <Badge
                className="text-[10px]"
                key={type}
                variant="outline"
              >
                {count} {type}
              </Badge>
            );
          })}
        </CardContent>
      )}

      <CardContent className="px-3 pb-3 pt-0">
        {classifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <Stethoscope className="size-5 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">No classifications available</p>
          </div>
        ) : (
        <ul className="flex flex-col gap-1.5">
          {classifications.map((c) => (
            <li key={`${c.facilityId}-${c.serviceType}`}>
              <ClassificationItem classification={c} />
            </li>
          ))}
        </ul>
        )}
      </CardContent>
    </Card>
  );
}

function ClassificationItem({
  classification: c,
}: {
  classification: Classification;
}) {
  const hasExtendedFindings =
    c.individualTied ||
    c.campMissionEvidence ||
    (c.weakOperationalSignals && c.weakOperationalSignals.length > 0);

  return (
    <div className="rounded-md border border-border p-2.5">
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <Badge
            className="text-[10px]"
            variant="secondary"
          >
            {c.serviceType}
          </Badge>
          <span className="truncate text-xs font-medium text-foreground">
            {c.facilityName}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {c.confidence}
        </span>
      </div>

      {hasExtendedFindings && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {c.individualTied && (
            <Badge className="gap-1 text-[9px]" variant="outline">
              <User className="size-2.5" />
              Individual-tied
            </Badge>
          )}
          {c.campMissionEvidence && (
            <Badge className="gap-1 text-[9px]" variant="outline">
              <Tent className="size-2.5" />
              Camp/Mission
            </Badge>
          )}
          {c.weakOperationalSignals && c.weakOperationalSignals.length > 0 && (
            <Badge className="gap-1 text-[9px]" variant="outline">
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
                  <Badge className="font-mono text-[9px] font-normal" key={p} variant="outline">
                    {p}
                  </Badge>
                ))}
              </div>
            )}
            {c.weakOperationalSignals && c.weakOperationalSignals.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {c.weakOperationalSignals.map((p) => (
                  <Badge className="font-mono text-[9px] font-normal" key={p} variant="outline">
                    {p}
                  </Badge>
                ))}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
