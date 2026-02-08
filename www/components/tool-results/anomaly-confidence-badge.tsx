"use client";

import {
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AnomalyFlag {
  checkId: string;
  severity: "critical" | "high" | "medium" | "low";
  explanation: string;
}

interface AnomalyConfidenceData {
  level: "green" | "yellow" | "red";
  score: number;
  summary: string;
  flags: AnomalyFlag[];
}

interface AnomalyConfidenceBadgeProps {
  confidence: AnomalyConfidenceData;
  /** Render a compact inline dot instead of the full badge */
  compact?: boolean;
}

const LEVEL_CONFIG = {
  green: {
    icon: ShieldCheck,
    label: "Verified",
  },
  yellow: {
    icon: ShieldAlert,
    label: "Caution",
  },
  red: {
    icon: ShieldX,
    label: "Flagged",
  },
} as const;

export function AnomalyConfidenceBadge({
  confidence,
  compact = false,
}: AnomalyConfidenceBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = LEVEL_CONFIG[confidence.level];
  const Icon = config.icon;

  // Compact mode: just a small badge
  if (compact) {
    return (
      <Badge variant="outline" className="gap-1 text-[10px] font-normal" title={`${config.label} (${confidence.score}/100): ${confidence.summary}`}>
        <Icon className="size-2.5" />
        {confidence.score}
      </Badge>
    );
  }

  return (
    <div className="rounded-md border border-border">
      {/* Header row */}
      <div className="flex items-center justify-between px-2.5 py-2">
        <div className="flex items-center gap-1.5">
          <Icon className="size-3.5 text-muted-foreground" />
          <span className="text-[11px] font-medium text-foreground">
            {config.label}
          </span>
        </div>
        <span className="font-mono text-[11px] font-bold tabular-nums text-foreground">
          {confidence.score}
        </span>
      </div>

      {/* Summary */}
      <p className="px-2.5 pb-2 text-[11px] text-muted-foreground">
        {confidence.summary}
      </p>

      {/* Expandable flags */}
      {confidence.flags.length > 0 && (
        <div className="border-t border-border">
          <button
            className="flex w-full items-center gap-1 px-2.5 py-1.5 text-[10px] text-muted-foreground hover:text-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
            type="button"
          >
            {isExpanded ? (
              <ChevronDown className="size-3" />
            ) : (
              <ChevronRight className="size-3" />
            )}
            {confidence.flags.length}{" "}
            {confidence.flags.length === 1 ? "finding" : "findings"}
          </button>

          {isExpanded && (
            <div className="flex flex-col gap-1 px-2.5 pb-2.5">
              {confidence.flags.map((flag, idx) => (
                <div
                  className="rounded bg-muted p-2"
                  key={`${flag.checkId}-${idx}`}
                >
                  <Badge variant="secondary" className="text-[9px] uppercase tracking-wider font-medium">
                    {flag.severity}
                  </Badge>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {flag.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
