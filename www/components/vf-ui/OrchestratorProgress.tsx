"use client";

import {
  BotIcon,
  CheckCircleIcon,
  ClockIcon,
  Database,
  Globe,
  Map as MapIcon,
  Stethoscope,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const AGENT_TOOLS = new Set([
  "investigateData",
  "analyzeGeography",
  "medicalReasoning",
  "researchWeb",
]);

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

interface ToolStep {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  result?: Record<string, unknown>;
}

interface OrchestratorProgressProps {
  steps: ToolStep[];
  isStreaming?: boolean;
}

export function OrchestratorProgress({
  steps,
  isStreaming = false,
}: OrchestratorProgressProps) {
  const agentSteps = steps.filter((s) => AGENT_TOOLS.has(s.toolName));
  const completedCount = agentSteps.filter(
    (s) => s.result !== undefined
  ).length;
  const totalCount = agentSteps.length;

  if (totalCount === 0) {
    return null;
  }

  const allDone = completedCount === totalCount && !isStreaming;
  const progressValue =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const title = allDone
    ? `Orchestrator completed ${totalCount} ${totalCount === 1 ? "step" : "steps"}`
    : `Orchestrating analysis (${completedCount}/${totalCount})`;

  return (
    <Card className="not-prose my-2 overflow-hidden">
      <Collapsible defaultOpen={!allDone}>
        <CollapsibleTrigger className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-muted/50">
          <BotIcon className="size-4 shrink-0 text-muted-foreground" />
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <p className="truncate text-sm text-muted-foreground">{title}</p>
          </div>
          {allDone ? (
            <Badge
              className="shrink-0 gap-1 border-green-500/20 bg-green-500/10 text-[10px] text-green-600 dark:text-green-400"
              variant="outline"
            >
              <CheckCircleIcon className="size-3" />
              Done
            </Badge>
          ) : (
            <Badge
              className="shrink-0 animate-pulse gap-1 border-amber-500/20 bg-amber-500/10 text-[10px] text-amber-600 dark:text-amber-400"
              variant="outline"
            >
              <ClockIcon className="size-3" />
              Working
            </Badge>
          )}
        </CollapsibleTrigger>

        <CollapsibleContent className="data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 outline-hidden data-[state=closed]:animate-out data-[state=open]:animate-in">
          <Separator />
          <CardContent className="space-y-3 p-3">
            {/* Progress bar */}
            <Progress
              className="h-1.5"
              value={progressValue}
            />

            {/* Agent steps */}
            <ul className="space-y-2">
              {agentSteps.map((step) => {
                const config = AGENT_CONFIG[step.toolName];
                if (!config) {
                  return null;
                }
                const Icon = config.icon;
                const task = step.args.task as string | undefined;
                const isDone = step.result !== undefined;

                return (
                  <li key={step.toolCallId}>
                    <div className="flex items-start gap-2">
                      <Icon
                        className={cn(
                          "mt-0.5 size-3.5 shrink-0",
                          config.color
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium text-foreground">
                            {config.label}
                          </span>
                          {isDone ? (
                            <CheckCircleIcon className="size-3 text-green-500" />
                          ) : (
                            <ClockIcon className="size-3 animate-pulse text-amber-500" />
                          )}
                        </div>
                        {task && (
                          <p className="mt-0.5 text-pretty text-[11px] leading-relaxed text-muted-foreground">
                            {task.length > 120
                              ? `${task.slice(0, 120)}...`
                              : task}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
