"use client";

import {
  Activity,
  AlertTriangle,
  Brain,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  Database,
  Eye,
  GitCompare,
  Globe,
  Map as MapIcon,
  Search,
  Stethoscope,
  WrenchIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
} from "@/components/ai-elements/code-block";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useVF } from "@/lib/vf-context";

/**
 * Agent delegation tool names — these represent subagent calls
 */
const AGENT_TOOLS = new Set([
  "investigateData",
  "analyzeGeography",
  "medicalReasoning",
  "researchWeb",
]);

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ToolTraceProps {
  toolCallId: string;
  toolName: string;
  args: any;
  result?: any;
}

const TOOL_ICONS: Record<string, ReactNode> = {
  investigateData: <Database className="size-4 text-blue-500" />,
  analyzeGeography: <MapIcon className="size-4 text-amber-500" />,
  medicalReasoning: <Stethoscope className="size-4 text-red-500" />,
  researchWeb: <Globe className="size-4 text-emerald-500" />,
  queryDatabase: <Database className="size-4 text-blue-500" />,
  searchFacilities: <Search className="size-4 text-green-500" />,
  findNearby: <MapIcon className="size-4 text-amber-500" />,
  findMedicalDeserts: <MapIcon className="size-4 text-amber-500" />,
  compareRegions: <GitCompare className="size-4 text-cyan-500" />,
  detectAnomalies: <AlertTriangle className="size-4 text-red-500" />,
  crossValidateClaims: <Brain className="size-4 text-orange-500" />,
  classifyServices: <Stethoscope className="size-4 text-pink-500" />,
  planMission: <Activity className="size-4 text-pink-500" />,
  firecrawlSearch: <Globe className="size-4 text-emerald-500" />,
  firecrawlScrape: <Globe className="size-4 text-emerald-500" />,
  firecrawlExtract: <Globe className="size-4 text-emerald-500" />,
  getFacility: <Database className="size-4 text-blue-500" />,
  getStats: <Database className="size-4 text-blue-500" />,
};

const AGENT_DISPLAY_NAMES: Record<string, string> = {
  investigateData: "Data Analysis",
  analyzeGeography: "Geographic Analysis",
  medicalReasoning: "Medical Reasoning",
  researchWeb: "Web Research",
};

function formatArgs(
  toolName: string,
  currentArgs: any,
  isAgentTool: boolean
): string {
  if (isAgentTool && currentArgs.task) {
    const task = String(currentArgs.task);
    return task.slice(0, 60) + (task.length > 60 ? "..." : "");
  }
  if (toolName === "searchFacilities") {
    return `query: "${currentArgs.query}"`;
  }
  if (toolName === "findNearby") {
    return `near: "${currentArgs.location}"`;
  }
  if (toolName === "queryDatabase") {
    return "SQL Query";
  }
  if (toolName === "planMission") {
    return `specialty: "${currentArgs.specialty}"`;
  }
  if (toolName === "compareRegions" && Array.isArray(currentArgs.regions)) {
    return (currentArgs.regions as string[]).join(" vs ");
  }
  if (toolName === "firecrawlSearch") {
    return `"${currentArgs.query}"`;
  }
  if (toolName === "firecrawlScrape") {
    return String(currentArgs.url ?? "").slice(0, 40);
  }
  const str = JSON.stringify(currentArgs);
  return str.slice(0, 30) + (str.length > 30 ? "..." : "");
}

export function ToolTrace({
  toolCallId: _toolCallId,
  toolName,
  args,
  result,
}: ToolTraceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setMapFacilities, setMapCenter, setMapZoom, setMapVisible } = useVF();

  const isAgentTool = AGENT_TOOLS.has(toolName);
  const icon = TOOL_ICONS[toolName] ?? (
    <WrenchIcon className="size-4 text-muted-foreground" />
  );
  const displayName = isAgentTool
    ? (AGENT_DISPLAY_NAMES[toolName] ?? toolName)
    : toolName;

  const hasGeoData = (): boolean => {
    if (!result || result.error) {
      return false;
    }
    if (toolName === "findNearby" && result.facilities?.length > 0) {
      return true;
    }
    if (toolName === "findMedicalDeserts" && result.desertZones?.length > 0) {
      return true;
    }
    if (
      toolName === "getFacility" &&
      result.facility?.lat &&
      result.facility?.lng
    ) {
      return true;
    }
    return false;
  };

  const handleViewOnMap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!result) {
      return;
    }

    if (toolName === "findNearby" && result.facilities) {
      setMapFacilities(result.facilities);
      if (result.center) {
        setMapCenter([result.center.lat, result.center.lng]);
        setMapZoom(10);
      }
      setMapVisible(true);
    } else if (toolName === "findMedicalDeserts" && result.desertZones) {
      const markers = result.desertZones.map((z: any) => ({
        id: Math.random(),
        name: `${z.city} Gap (${z.distanceKm}km)`,
        lat: z.coordinates.lat,
        lng: z.coordinates.lng,
        type: "Medical Desert",
        distanceKm: z.distanceKm,
      }));
      setMapFacilities(markers);
      if (markers.length > 0) {
        setMapCenter([markers[0].lat, markers[0].lng]);
        setMapZoom(7);
      }
      setMapVisible(true);
    } else if (
      toolName === "getFacility" &&
      result.facility?.lat &&
      result.facility?.lng
    ) {
      setMapFacilities([
        {
          id: result.facility.id,
          name: result.facility.name,
          lat: result.facility.lat,
          lng: result.facility.lng,
          type: result.facility.facilityType,
          city: result.facility.addressCity,
        },
      ]);
      setMapCenter([result.facility.lat, result.facility.lng]);
      setMapZoom(12);
      setMapVisible(true);
    }
  };

  // Determine the input JSON to display
  const inputJson = isAgentTool
    ? String(args?.task ?? JSON.stringify(args, null, 2))
    : JSON.stringify(args, null, 2);

  const outputJson = result ? JSON.stringify(result, null, 2) : null;

  // Determine if the input is SQL for syntax highlighting
  const isSqlTool = toolName === "queryDatabase";
  const sqlQuery = isSqlTool ? (args?.query as string) : null;

  return (
    <Collapsible
      className="not-prose my-2 w-full overflow-hidden rounded-md border border-border bg-muted/50"
      onOpenChange={setIsOpen}
      open={isOpen}
    >
      {/* Header */}
      <CollapsibleTrigger className="flex w-full items-center justify-between p-2 text-left transition-colors hover:bg-muted/80">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-mono text-sm font-medium text-foreground">
            {displayName}
          </span>
          {isAgentTool && (
            <Badge
              className="px-1.5 py-0 text-[9px] font-semibold uppercase tracking-wider"
              variant="secondary"
            >
              Agent
            </Badge>
          )}
          <span className="max-w-[200px] truncate text-xs text-muted-foreground">
            {formatArgs(toolName, args, isAgentTool)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hasGeoData() && (
            <button
              aria-label="View on map"
              className="flex items-center gap-1 rounded border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-xs text-blue-600 hover:bg-blue-500/20 dark:text-blue-400"
              onClick={handleViewOnMap}
              type="button"
            >
              <Eye className="size-3" />
              Map
            </button>
          )}
          {result ? (
            <Badge
              className="gap-1 rounded-full border-green-500/20 bg-green-500/10 text-[10px] text-green-600 dark:text-green-400"
              variant="outline"
            >
              <CheckCircleIcon className="size-3" />
              Done
            </Badge>
          ) : (
            <Badge
              className="animate-pulse gap-1 rounded-full border-amber-500/20 bg-amber-500/10 text-[10px] text-amber-600 dark:text-amber-400"
              variant="outline"
            >
              <ClockIcon className="size-3" />
              {isAgentTool ? "Working..." : "Running..."}
            </Badge>
          )}
          <ChevronDownIcon
            className={cn(
              "size-4 text-muted-foreground transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </CollapsibleTrigger>

      {/* Expanded content */}
      <CollapsibleContent className="data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in">
        <div className="space-y-3 border-t border-border p-3">
          {/* Input section */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {isAgentTool ? "Task" : "Parameters"}
            </h4>
            {isSqlTool && sqlQuery ? (
              <CodeBlock className="text-xs" code={sqlQuery} language="sql">
                <CodeBlockHeader className="px-2 py-1">
                  <span className="text-[10px] text-muted-foreground">SQL</span>
                  <CodeBlockActions>
                    <CodeBlockCopyButton className="size-5" />
                  </CodeBlockActions>
                </CodeBlockHeader>
                <CodeBlockContent code={sqlQuery} language="sql" />
              </CodeBlock>
            ) : (
              <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-md bg-muted p-2.5 font-mono text-xs text-foreground">
                {inputJson}
              </pre>
            )}
          </div>

          {/* Output section */}
          {outputJson && (
            <div className="space-y-1">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {result?.error ? "Error" : "Output"}
              </h4>
              <pre
                className={cn(
                  "max-h-60 overflow-y-auto whitespace-pre-wrap rounded-md p-2.5 font-mono text-xs",
                  result?.error
                    ? "bg-destructive/10 text-destructive"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {outputJson}
              </pre>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
