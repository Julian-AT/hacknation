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
import {
  Task,
  TaskContent,
  TaskItem,
  TaskTrigger,
} from "@/components/ai-elements/task";
import { Badge } from "@/components/ui/badge";
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
  /** All tool invocation parts from the current assistant message */
  steps: ToolStep[];
  /** Whether the orchestrator is still streaming */
  isStreaming?: boolean;
}

/**
 * OrchestratorProgress wraps multiple agent delegation steps into a
 * collapsible Task view, giving users a clear timeline of the orchestrator's
 * multi-step workflow.
 */
export function OrchestratorProgress({
  steps,
  isStreaming = false,
}: OrchestratorProgressProps) {
  const agentSteps = steps.filter((s) => AGENT_TOOLS.has(s.toolName));
  const completedCount = agentSteps.filter(
    (s) => s.result !== undefined
  ).length;
  const totalCount = agentSteps.length;

  // Don't render if no agent delegation steps
  if (totalCount === 0) {
    return null;
  }

  const allDone = completedCount === totalCount && !isStreaming;
  const title = allDone
    ? `Orchestrator completed ${totalCount} ${totalCount === 1 ? "step" : "steps"}`
    : `Orchestrating analysis (${completedCount}/${totalCount})`;

  return (
    <Task defaultOpen={!allDone}>
      <TaskTrigger title={title}>
        <div className="flex w-full cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <BotIcon className="size-4" />
          <p className="text-sm">{title}</p>
          {allDone ? (
            <Badge
              className="ml-auto gap-1 rounded-full border-green-500/20 bg-green-500/10 text-[10px] text-green-600 dark:text-green-400"
              variant="outline"
            >
              <CheckCircleIcon className="size-3" />
              Done
            </Badge>
          ) : (
            <Badge
              className="ml-auto animate-pulse gap-1 rounded-full border-amber-500/20 bg-amber-500/10 text-[10px] text-amber-600 dark:text-amber-400"
              variant="outline"
            >
              <ClockIcon className="size-3" />
              Working
            </Badge>
          )}
        </div>
      </TaskTrigger>
      <TaskContent>
        {agentSteps.map((step) => {
          const config = AGENT_CONFIG[step.toolName];
          if (!config) {
            return null;
          }
          const Icon = config.icon;
          const task = step.args.task as string | undefined;
          const isDone = step.result !== undefined;

          return (
            <TaskItem key={step.toolCallId}>
              <div className="flex items-start gap-2">
                <Icon
                  className={cn("mt-0.5 size-3.5 shrink-0", config.color)}
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
                    <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                      {task.length > 120 ? `${task.slice(0, 120)}...` : task}
                    </p>
                  )}
                </div>
              </div>
            </TaskItem>
          );
        })}
      </TaskContent>
    </Task>
  );
}
