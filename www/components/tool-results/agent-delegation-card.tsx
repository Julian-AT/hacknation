"use client";

import {
  BotIcon,
  ChevronDownIcon,
  Database,
  Globe,
  HeartPulse,
  Map as MapIcon,
  Stethoscope,
  WrenchIcon,
} from "lucide-react";
import { useState } from "react";
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
    icon: typeof Database;
    color: string;
    model: string;
    tools: string[];
    description: string;
  }
> = {
  investigateData: {
    label: "Data Analysis Agent",
    icon: Database,
    color: "text-blue-400",
    model: "gemini-2.5-flash-lite",
    tools: ["queryDatabase", "searchFacilities", "getFacility"],
    description:
      "Executes database queries, semantic facility search, and deep-dive facility lookups.",
  },
  analyzeGeography: {
    label: "Geographic Analysis Agent",
    icon: MapIcon,
    color: "text-amber-400",
    model: "gemini-2.5-flash-lite",
    tools: [
      "findNearby",
      "findMedicalDeserts",
      "compareRegions",
      "planMission",
    ],
    description:
      "Proximity search, medical desert detection, region comparison, and mission planning.",
  },
  medicalReasoning: {
    label: "Medical Reasoning Agent",
    icon: Stethoscope,
    color: "text-red-400",
    model: "gemini-2.5-flash-lite",
    tools: ["detectAnomalies", "crossValidateClaims", "classifyServices"],
    description:
      "Data quality checks, cross-validates claims, and classifies service delivery models.",
  },
  researchWeb: {
    label: "Web Research Agent",
    icon: Globe,
    color: "text-emerald-400",
    model: "gemini-2.5-flash-lite",
    tools: ["firecrawlSearch", "firecrawlScrape", "firecrawlExtract"],
    description:
      "Real-time web search, page scraping, and structured data extraction.",
  },
  searchHealthcare: {
    label: "Healthcare Search Agent",
    icon: HeartPulse,
    color: "text-pink-400",
    model: "gemini-2.5-flash-lite",
    tools: [
      "askClarifyingQuestion",
      "searchProviders",
      "getProviderProfile",
      "firecrawlSearch",
      "firecrawlScrape",
      "firecrawlExtract",
    ],
    description:
      "Interactive provider discovery — reads medical documents, asks clarifying questions, and searches for matching doctors, hospitals, and clinics.",
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
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
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
  const config = AGENT_CONFIG[toolName];
  if (!config) {
    return null;
  }
  const Icon = config.icon;
  const task = args.task as string | undefined;

  return (
    <Card className="not-prose my-2 overflow-hidden bg-muted/50">
      <Collapsible onOpenChange={setIsOpen} open={isOpen}>
        {/* Agent header */}
        <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-muted/80">
          <div className="flex min-w-0 items-center gap-2">
            <Icon className={cn("size-4 shrink-0", config.color)} />
            <span className="truncate text-xs font-semibold text-foreground">
              {config.label}
            </span>
            <Badge
              className="gap-1 px-1.5 py-0 text-[9px] uppercase tracking-wider"
              variant="secondary"
            >
              <BotIcon className="size-2.5" />
              Agent
            </Badge>
            <Badge
              className="hidden font-mono text-[10px] sm:inline-flex"
              variant="outline"
            >
              {config.model}
            </Badge>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {result ? (
              <Badge
                className="border-green-500/20 bg-green-500/10 text-[10px] text-green-600 dark:text-green-400"
                variant="outline"
              >
                Completed
              </Badge>
            ) : (
              <Badge
                className="animate-pulse border-amber-500/20 bg-amber-500/10 text-[10px] text-amber-600 dark:text-amber-400"
                variant="outline"
              >
                Working...
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

        {/* Task description */}
        {task && (
          <>
            <Separator />
            <div className="px-3 py-2">
              <p className="text-pretty text-[11px] leading-relaxed text-muted-foreground">
                {task.length > 200 ? `${task.slice(0, 200)}...` : task}
              </p>
            </div>
          </>
        )}

        {/* Expanded: agent details + output */}
        <CollapsibleContent className="data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 outline-hidden data-[state=closed]:animate-out data-[state=open]:animate-in">
          <Separator />
          <CardContent className="space-y-3 p-3">
            {/* Agent description */}
            <p className="text-pretty text-[11px] text-muted-foreground">
              {config.description}
            </p>

            {/* Available tools */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Available Tools
              </span>
              <div className="flex flex-wrap gap-1">
                {config.tools.map((tool) => (
                  <Badge
                    className="gap-1 font-mono text-[10px]"
                    key={tool}
                    variant="secondary"
                  >
                    <WrenchIcon className="size-2.5" />
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>

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
