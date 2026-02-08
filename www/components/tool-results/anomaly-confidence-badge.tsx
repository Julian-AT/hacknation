"use client";

import {
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { useState } from "react";
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
    dotColor: "bg-green-400",
    iconColor: "text-green-400",
    bgColor: "bg-green-950/50",
    textColor: "text-green-400",
    borderColor: "border-green-900/50",
  },
  yellow: {
    icon: ShieldAlert,
    label: "Caution",
    dotColor: "bg-amber-400",
    iconColor: "text-amber-400",
    bgColor: "bg-amber-950/50",
    textColor: "text-amber-400",
    borderColor: "border-amber-900/50",
  },
  red: {
    icon: ShieldX,
    label: "Flagged",
    dotColor: "bg-red-400",
    iconColor: "text-red-400",
    bgColor: "bg-red-950/50",
    textColor: "text-red-400",
    borderColor: "border-red-900/50",
  },
} as const;

const SEVERITY_STYLES: Record<string, { bg: string; text: string }> = {
  critical: { bg: "bg-red-950/50", text: "text-red-400" },
  high: { bg: "bg-orange-950/50", text: "text-orange-400" },
  medium: { bg: "bg-amber-950/50", text: "text-amber-400" },
  low: { bg: "bg-green-950/50", text: "text-green-400" },
};

export function AnomalyConfidenceBadge({
  confidence,
  compact = false,
}: AnomalyConfidenceBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = LEVEL_CONFIG[confidence.level];
  const Icon = config.icon;

  // Compact mode: just a colored dot with a tooltip-style title
  if (compact) {
    return (
      <span
        className={cn("inline-block size-2 shrink-0 rounded-full", config.dotColor)}
        title={`${config.label} (${confidence.score}/100): ${confidence.summary}`}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-md border",
        config.borderColor,
        config.bgColor
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-2.5 py-2">
        <div className="flex items-center gap-1.5">
          <Icon className={cn("size-3.5", config.iconColor)} />
          <span
            className={cn("text-[11px] font-semibold", config.textColor)}
          >
            {config.label}
          </span>
        </div>
        <span
          className={cn(
            "font-mono text-[11px] font-bold",
            config.textColor
          )}
        >
          {confidence.score}
        </span>
      </div>

      {/* Summary */}
      <p className="px-2.5 pb-2 text-[11px] text-muted-foreground">
        {confidence.summary}
      </p>

      {/* Expandable flags */}
      {confidence.flags.length > 0 && (
        <div className="border-t border-border/50">
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
              {confidence.flags.map((flag, idx) => {
                const sevStyle =
                  SEVERITY_STYLES[flag.severity] ?? SEVERITY_STYLES.low;
                return (
                  <div
                    className="rounded bg-muted/60 p-2"
                    key={`${flag.checkId}-${idx}`}
                  >
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                        sevStyle.bg,
                        sevStyle.text
                      )}
                    >
                      {flag.severity}
                    </span>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {flag.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
