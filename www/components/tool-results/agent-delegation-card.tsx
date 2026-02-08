"use client";

import {
  Database,
  Map as MapIcon,
  Stethoscope,
  Globe,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AgentDelegationCardProps {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  result?: Record<string, unknown>;
}

const AGENT_CONFIG: Record<
  string,
  { label: string; icon: typeof Database; color: string }
> = {
  investigateData: {
    label: "Data Analysis",
    icon: Database,
    color: "text-blue-500",
  },
  analyzeGeography: {
    label: "Geographic Analysis",
    icon: MapIcon,
    color: "text-amber-500",
  },
  medicalReasoning: {
    label: "Medical Reasoning",
    icon: Stethoscope,
    color: "text-red-500",
  },
  researchWeb: {
    label: "Web Research",
    icon: Globe,
    color: "text-emerald-500",
  },
};

export function AgentDelegationCard({
  toolCallId,
  toolName,
  args,
  result,
}: AgentDelegationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = AGENT_CONFIG[toolName] ?? {
    label: toolName,
    icon: Database,
    color: "text-muted-foreground",
  };
  const Icon = config.icon;
  const task = args.task as string | undefined;

  return (
    <div
      className={cn(
        "my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50",
      )}
    >
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left hover:bg-muted/80"
      >
        <div className="flex items-center gap-2">
          <Icon className={cn("size-3.5", config.color)} />
          <span className="text-xs font-semibold text-foreground">
            {config.label}
          </span>
          <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            Agent
          </span>
        </div>
        <div className="flex items-center gap-2">
          {result ? (
            <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-600 dark:text-green-400">
              Completed
            </span>
          ) : (
            <span className="animate-pulse rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
              Working...
            </span>
          )}
          {isExpanded ? (
            <ChevronDown className="size-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-3.5 text-muted-foreground" />
          )}
        </div>
      </button>

      {task && (
        <div className="border-t border-border px-3 py-2">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {task.length > 200 ? `${task.slice(0, 200)}...` : task}
          </p>
        </div>
      )}

      {isExpanded && result && (
        <div className="border-t border-border px-3 py-2">
          <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap font-mono text-[10px] text-muted-foreground">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
