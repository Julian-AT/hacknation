"use client";

import {
  Database,
  Map as MapIcon,
  Stethoscope,
  Globe,
  ChevronDown,
  ChevronRight,
  BotIcon,
  WrenchIcon,
} from "lucide-react";
import { useState } from "react";
import {
  Agent,
  AgentContent,
} from "@/components/ai-elements/agent";
import { Badge } from "@/components/ui/badge";
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
    bgColor: string;
    model: string;
    tools: string[];
    description: string;
  }
> = {
  investigateData: {
    label: "Data Analysis Agent",
    icon: Database,
    color: "text-blue-400",
    bgColor: "bg-blue-950/30",
    model: "gemini-2.5-flash-lite",
    tools: ["queryDatabase", "searchFacilities", "getFacility"],
    description:
      "Executes database queries, semantic facility search, and deep-dive facility lookups.",
  },
  analyzeGeography: {
    label: "Geographic Analysis Agent",
    icon: MapIcon,
    color: "text-amber-400",
    bgColor: "bg-amber-950/30",
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
    bgColor: "bg-red-950/30",
    model: "gemini-2.5-flash-lite",
    tools: ["detectAnomalies", "crossValidateClaims", "classifyServices"],
    description:
      "Data quality checks, cross-validates claims, and classifies service delivery models.",
  },
  researchWeb: {
    label: "Web Research Agent",
    icon: Globe,
    color: "text-emerald-400",
    bgColor: "bg-emerald-950/30",
    model: "gemini-2.5-flash-lite",
    tools: ["firecrawlSearch", "firecrawlScrape", "firecrawlExtract"],
    description:
      "Real-time web search, page scraping, and structured data extraction.",
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

/**
 * Extracts the tool name from a nested part, handling both
 * "tool-<name>" (static) and "dynamic-tool" (dynamic) formats.
 */
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

  if (!name || !part.toolCallId) return null;

  return {
    toolName: name,
    toolCallId: part.toolCallId,
    args: part.input ?? {},
    result: part.state === "output-available" ? part.output : undefined,
  };
}

/**
 * Renders the nested parts from an agent delegation result,
 * routing sub-tool calls to their custom UI components and
 * rendering text output inline.
 */
function AgentNestedParts({ result }: { result: Record<string, unknown> }) {
  const parts = result.parts as NestedPart[] | undefined;

  // If the result has a parts array (agent response), render each part
  if (Array.isArray(parts) && parts.length > 0) {
    return (
      <div className="space-y-2">
        {parts.map((part, idx) => {
          // Render sub-tool results with custom UI
          const toolInfo = extractToolInfo(part);
          if (toolInfo) {
            const { toolName, toolCallId, args, result: toolResult } = toolInfo;

            // Try custom component first
            if (toolResult && !("error" in toolResult)) {
              const custom = getToolComponent(toolName, args, toolResult);
              if (custom) {
                return <div key={toolCallId}>{custom}</div>;
              }
            }

            // Fall back to ToolTrace
            return (
              <ToolTrace
                key={toolCallId}
                toolCallId={toolCallId}
                toolName={toolName}
                args={args}
                result={toolResult}
              />
            );
          }

          // Render text parts
          if (part.type === "text" && part.text?.trim()) {
            return (
              <div
                key={`text-${idx.toString()}`}
                className="rounded-md bg-muted p-2.5 text-xs leading-relaxed text-muted-foreground"
              >
                {part.text}
              </div>
            );
          }

          // Skip step-start, reasoning, and other non-visual parts
          return null;
        })}
      </div>
    );
  }

  // Fallback: result has no parts array, show raw JSON
  return (
    <div className="space-y-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Output
      </span>
      <pre className="max-h-48 overflow-y-auto rounded-md bg-muted p-2.5 font-mono text-[10px] text-muted-foreground">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}

export function AgentDelegationCard({
  toolCallId,
  toolName,
  args,
  result,
}: AgentDelegationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = AGENT_CONFIG[toolName];
  if (!config) {
    return null;
  }
  const Icon = config.icon;
  const task = args.task as string | undefined;

  return (
    <Agent className="my-2 border-border bg-muted/50">
      {/* Agent header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left hover:bg-muted/80"
      >
        <div className="flex items-center gap-2">
          <Icon className={cn("size-4", config.color)} />
          <span className="text-xs font-semibold text-foreground">
            {config.label}
          </span>
          <Badge
            className="gap-1 rounded-full px-1.5 py-0 text-[9px] font-semibold uppercase tracking-wider"
            variant="secondary"
          >
            <BotIcon className="size-2.5" />
            Agent
          </Badge>
          <Badge className="font-mono text-[10px]" variant="outline">
            {config.model}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {result ? (
            <Badge
              className="rounded-full border-green-900/50 bg-green-950/50 text-[10px] text-green-400"
              variant="outline"
            >
              Completed
            </Badge>
          ) : (
            <Badge
              className="animate-pulse rounded-full border-amber-900/50 bg-amber-950/50 text-[10px] text-amber-400"
              variant="outline"
            >
              Working...
            </Badge>
          )}
          {isExpanded ? (
            <ChevronDown className="size-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-3.5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Task description */}
      {task && (
        <div className="border-t border-border px-3 py-2">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {task.length > 200 ? `${task.slice(0, 200)}...` : task}
          </p>
        </div>
      )}

      {/* Expanded: agent details + output */}
      {isExpanded && (
        <AgentContent className="border-t border-border p-3">
          {/* Agent description */}
          <p className="text-[11px] text-muted-foreground">
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
                  key={tool}
                  className="gap-1 font-mono text-[10px]"
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
            <AgentNestedParts result={result} />
          )}
        </AgentContent>
      )}
    </Agent>
  );
}
