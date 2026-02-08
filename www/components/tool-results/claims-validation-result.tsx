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
import { Separator } from "@/components/ui/separator";

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

export function ClaimsValidationResult({
  result,
}: ClaimsValidationResultProps) {
  const facilitiesChecked = (result.facilitiesChecked as number) ?? 0;
  const issuesFound = (result.issuesFound as number) ?? 0;
  const results = (result.results as ValidationIssue[]) ?? [];
  const summary = result.summary as string | undefined;

  return (
    <Card className="my-2 w-full overflow-hidden">
      <CardHeader className="flex-row items-center justify-between space-y-0 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Brain className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            Claims Validation
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="tabular-nums text-[11px] text-muted-foreground">
            {facilitiesChecked} checked
          </span>
          <Badge
            className="font-mono text-[11px]"
            variant="secondary"
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
                className="text-[10px] uppercase"
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
        {results.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <Brain className="size-5 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">No validation issues found</p>
          </div>
        ) : (
        <ul className="flex flex-col gap-1.5">
          {results.map((issue) => (
            <li key={`${issue.facilityId}-${issue.validationType}`}>
              <ValidationIssueItem issue={issue} />
            </li>
          ))}
        </ul>
        )}
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
  return (
    <div className="rounded-md border border-border p-2.5">
      <div className="flex items-center gap-2">
        <Badge
          className="text-[9px] uppercase tracking-wider"
          variant="secondary"
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

      {Object.keys(issue.evidence).length > 0 && (
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
            <div className="mt-1.5 flex flex-col gap-1">
              {Object.entries(issue.evidence).map(([key, val]) => (
                <EvidenceRow key={key} label={key} value={val} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

function EvidenceRow({ label, value }: { label: string; value: unknown }) {
  const displayLabel = label
    .replaceAll("_", " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());

  const renderValue = (): string => {
    if (value === null || value === undefined) {
      return "\u2014";
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (typeof value === "number") {
      return value.toLocaleString();
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : "\u2014";
    }
    if (typeof value === "object") {
      return Object.entries(value as Record<string, unknown>)
        .map(([k, v]) => `${k}: ${String(v)}`)
        .join(", ");
    }
    return String(value);
  };

  return (
    <div className="flex items-baseline gap-2 rounded-md bg-muted px-2.5 py-1.5">
      <span className="shrink-0 text-[10px] font-medium text-muted-foreground">
        {displayLabel}:
      </span>
      <span className="text-[10px] text-foreground">
        {renderValue()}
      </span>
    </div>
  );
}
