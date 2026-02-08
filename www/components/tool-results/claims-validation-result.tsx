"use client";

import { Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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

const SEVERITY_BADGE: Record<string, string> = {
  critical: "border-red-500/20 bg-red-500/10 text-red-400",
  high: "border-orange-500/20 bg-orange-500/10 text-orange-400",
  medium: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  low: "border-green-500/20 bg-green-500/10 text-green-400",
};

export function ClaimsValidationResult({
  result,
}: ClaimsValidationResultProps) {
  const facilitiesChecked = (result.facilitiesChecked as number) ?? 0;
  const issuesFound = (result.issuesFound as number) ?? 0;
  const results = (result.results as ValidationIssue[]) ?? [];
  const summary = result.summary as string | undefined;

  return (
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <CardHeader className="flex-row items-center justify-between space-y-0 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Brain className="size-3.5 text-orange-400" />
          <span className="text-xs font-medium text-muted-foreground">
            Claims Validation
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="tabular-nums text-[11px] text-muted-foreground">
            {facilitiesChecked} checked
          </span>
          <Badge
            className="border-orange-500/20 bg-orange-500/10 font-mono text-[11px] text-orange-400"
            variant="outline"
          >
            {issuesFound} {issuesFound === 1 ? "issue" : "issues"}
          </Badge>
        </div>
      </CardHeader>

      {results.length > 0 && (
        <CardContent className="flex flex-wrap gap-2 px-3 pb-2 pt-0">
          {(["critical", "high", "medium", "low"] as const).map((sev) => {
            const sevCount = results.filter((r) => r.severity === sev).length;
            if (sevCount === 0) {
              return null;
            }
            return (
              <Badge
                className={cn("text-[10px] uppercase", SEVERITY_BADGE[sev])}
                key={sev}
                variant="outline"
              >
                {sevCount} {sev}
              </Badge>
            );
          })}
        </CardContent>
      )}

      <CardContent className="px-3 pb-3 pt-0">
        <ul className="flex flex-col gap-1.5">
          {results.map((issue) => (
            <li key={`${issue.facilityId}-${issue.validationType}`}>
              <ValidationIssueItem issue={issue} />
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

function ValidationIssueItem({ issue }: { issue: ValidationIssue }) {
  const badgeClass = SEVERITY_BADGE[issue.severity] ?? SEVERITY_BADGE.low;

  return (
    <Card className="p-2.5">
      <div className="flex items-center gap-2">
        <Badge
          className={cn("text-[9px] uppercase tracking-wider", badgeClass)}
          variant="outline"
        >
          {issue.severity}
        </Badge>
        <span className="font-mono text-[10px] text-muted-foreground">
          {issue.validationType}
        </span>
      </div>
      <p className="mt-1 text-xs font-medium text-foreground">
        {issue.facilityName}
      </p>
      <p className="mt-0.5 text-pretty text-[11px] text-muted-foreground">
        {issue.finding}
      </p>

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
        <CollapsibleContent>
          <ScrollArea className="mt-1 max-h-24">
            <pre className="rounded-md bg-muted p-2 font-mono text-[10px] text-muted-foreground">
              {JSON.stringify(issue.evidence, null, 2)}
            </pre>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
