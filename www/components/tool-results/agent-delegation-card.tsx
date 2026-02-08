"use client";

import {
  BotIcon,
  CheckCircle2,
  ChevronDownIcon,
  CircleDot,
  Loader2,
  WrenchIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ToolTrace } from "../vf-ui/ToolTrace";
import { getToolComponent } from "./tool-component-map";

interface AgentDelegationCardProps {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  result?: Record<string, unknown>;
}

const AGENT_CONFIG: Record<
  string,
  {
    label: string;
    description: string;
  }
> = {
  investigateData: {
    label: "Data Analysis",
    description:
      "Database queries, semantic facility search, and facility lookups.",
  },
  analyzeGeography: {
    label: "Geographic Analysis",
    description:
      "Proximity search, medical desert detection, region comparison, and mission planning.",
  },
  medicalReasoning: {
    label: "Medical Reasoning",
    description:
      "Data quality checks, cross-validates claims, and classifies service delivery models.",
  },
  researchWeb: {
    label: "Web Research",
    description:
      "Real-time web search, page scraping, and structured data extraction.",
  },
  searchHealthcare: {
    label: "Healthcare Search",
    description:
      "Provider discovery — searches for matching doctors, hospitals, and clinics.",
  },
  parallelInvestigate: {
    label: "Parallel Investigation",
    description:
      "Runs specialized sub-agents simultaneously for complex multi-perspective analysis.",
  },
};

interface NestedPart {
  type: string;
  toolCallId?: string;
  toolName?: string;
  state?: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  text?: string;
}

function extractToolInfo(part: NestedPart): {
  toolName: string;
  toolCallId: string;
  args: Record<string, unknown>;
  result: Record<string, unknown> | undefined;
} | null {
  const { type } = part;
  let name: string | undefined;

  if (type === "dynamic-tool" && part.toolName) {
    name = part.toolName;
  } else if (type.startsWith("tool-")) {
    name = type.slice(5);
  }

  if (!name || !part.toolCallId) {
    return null;
  }

  return {
    toolName: name,
    toolCallId: part.toolCallId,
    args: part.input ?? {},
    result: part.state === "output-available" ? part.output : undefined,
  };
}

/** Compact activity ticker shown outside the collapsible */
function AgentActivityTicker({
  parts,
  isRunning,
}: {
  parts: NestedPart[];
  isRunning: boolean;
}) {
  const toolParts = useMemo(
    () =>
      parts
        .map((p) => extractToolInfo(p))
        .filter((t): t is NonNullable<typeof t> => t !== null),
    [parts]
  );

  if (toolParts.length === 0 && isRunning) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-muted-foreground">
        <Loader2 className="size-3 animate-spin" />
        <span>Initializing...</span>
      </div>
    );
  }

  if (toolParts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-1.5">
      {toolParts.map((tool) => {
        const isDone = tool.result !== undefined;
        const hasError = isDone && "error" in (tool.result ?? {});

        return (
          <span
            className="flex items-center gap-1 text-[11px]"
            key={tool.toolCallId}
          >
            {isDone ? (
              hasError ? (
                <CircleDot className="size-2.5 text-destructive" />
              ) : (
                <CheckCircle2 className="size-2.5 text-muted-foreground" />
              )
            ) : (
              <Loader2 className="size-2.5 animate-spin text-muted-foreground" />
            )}
            <span
              className={cn(
                "font-mono",
                isDone ? "text-muted-foreground" : "text-foreground"
              )}
            >
              {tool.toolName}
            </span>
          </span>
        );
      })}
    </div>
  );
}

function AgentNestedParts({ result }: { result: Record<string, unknown> }) {
  const parts = result.parts as NestedPart[] | undefined;

  if (Array.isArray(parts) && parts.length > 0) {
    return (
      <div className="space-y-2">
        {parts.map((part, idx) => {
          const toolInfo = extractToolInfo(part);
          if (toolInfo) {
            const { toolName, toolCallId, args, result: toolResult } = toolInfo;

            if (toolResult && !("error" in toolResult)) {
              const custom = getToolComponent(toolName, args, toolResult);
              if (custom) {
                return <div key={toolCallId}>{custom}</div>;
              }
            }

            return (
              <ToolTrace
                args={args}
                key={toolCallId}
                result={toolResult}
                toolCallId={toolCallId}
                toolName={toolName}
              />
            );
          }

          if (part.type === "text" && part.text?.trim()) {
            return (
              <Card
                className="bg-muted"
                key={`text-${idx.toString()}`}
              >
                <CardContent className="p-2.5 text-xs leading-relaxed text-muted-foreground">
                  {part.text}
                </CardContent>
              </Card>
            );
          }

          return null;
        })}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        Output
      </span>
      <ScrollArea className="max-h-48">
        <pre className="rounded-md bg-muted p-2.5 font-mono text-[10px] text-muted-foreground">
          {JSON.stringify(result, null, 2)}
        </pre>
      </ScrollArea>
    </div>
  );
}

export function AgentDelegationCard({
  toolCallId: _toolCallId,
  toolName,
  args,
  result,
}: AgentDelegationCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasResult = result !== undefined;

  const config = AGENT_CONFIG[toolName];
  if (!config) {
    return null;
  }
  const task = args.task as string | undefined;

  const nestedParts = (result?.parts as NestedPart[] | undefined) ?? [];
  const completedTools = nestedParts.filter((p) => {
    const info = extractToolInfo(p);
    return info?.result !== undefined;
  }).length;
  const totalTools = nestedParts.filter(
    (p) => extractToolInfo(p) !== null
  ).length;
  const showTicker = nestedParts.length > 0 || !hasResult;
  const showTaskPreview = Boolean(task) && !isOpen;

  return (
    <Card className="not-prose my-2 overflow-hidden">
      <Collapsible onOpenChange={setIsOpen} open={isOpen}>
        {/* Agent header */}
        <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-muted/50">
          <div className="flex min-w-0 items-center gap-2">
            <BotIcon className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate text-sm font-medium text-foreground">
              {config.label}
            </span>
            <Badge
              className="gap-1 px-1.5 py-0 text-[9px] uppercase tracking-wider"
              variant="secondary"
            >
              Agent
            </Badge>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {hasResult ? (
              <Badge
                className="gap-1 text-[10px]"
                variant="secondary"
              >
                <CheckCircle2 className="size-3" />
                {totalTools > 0
                  ? `${String(completedTools)} tool${completedTools !== 1 ? "s" : ""}`
                  : "Done"}
              </Badge>
            ) : (
              <Badge
                className="gap-1 text-[10px]"
                variant="outline"
              >
                <Loader2 className="size-3 animate-spin" />
                Working
              </Badge>
            )}
            <ChevronDownIcon
              className={cn(
                "size-3.5 text-muted-foreground transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </CollapsibleTrigger>

        {/* Task preview + activity ticker */}
        {(showTaskPreview || showTicker) && (
          <>
            <Separator />
            {showTaskPreview && (
              <div className={cn("px-3 pt-2", showTicker ? "pb-1" : "pb-2")}>
                <p className="line-clamp-2 text-pretty text-[11px] text-muted-foreground">
                  {task}
                </p>
              </div>
            )}
            {showTicker && (
              <AgentActivityTicker isRunning={!hasResult} parts={nestedParts} />
            )}
          </>
        )}

        {/* Expanded: full details + output */}
        <CollapsibleContent>
          <Separator />
          <CardContent className="space-y-3 p-3">
            {/* Task description */}
            {task && (
              <p className="text-pretty text-[11px] leading-relaxed text-muted-foreground">
                {task.length > 300 ? `${task.slice(0, 300)}...` : task}
              </p>
            )}

            {/* Agent description */}
            <p className="text-pretty text-[11px] text-muted-foreground">
              {config.description}
            </p>

            {/* Nested sub-tool results and agent text output */}
            {result && (
              <>
                <Separator />
                <AgentNestedParts result={result} />
              </>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
