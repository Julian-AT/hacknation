"use client";

import {
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useVF } from "@/lib/vf-context";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ToolTraceProps {
  toolCallId: string;
  toolName: string;
  args: any;
  result?: any;
}

const TOOL_LABELS: Record<string, string> = {
  queryDatabase: "Database Query",
  searchFacilities: "Facility Search",
  findNearby: "Nearby Search",
  findMedicalDeserts: "Desert Analysis",
  compareRegions: "Region Comparison",
  detectAnomalies: "Anomaly Detection",
  crossValidateClaims: "Claims Validation",
  classifyServices: "Service Classification",
  planMission: "Mission Planning",
  firecrawlSearch: "Web Search",
  firecrawlScrape: "Web Scrape",
  firecrawlExtract: "Data Extraction",
  getFacility: "Facility Lookup",
  getStats: "Statistics",
  investigateData: "Data Analysis",
  analyzeGeography: "Geographic Analysis",
  medicalReasoning: "Medical Reasoning",
  researchWeb: "Web Research",
};

function formatArgs(
  toolName: string,
  currentArgs: any
): string {
  if (currentArgs.task) {
    const task = String(currentArgs.task);
    return task.slice(0, 60) + (task.length > 60 ? "..." : "");
  }
  if (toolName === "searchFacilities") {
    return `"${String(currentArgs.query)}"`;
  }
  if (toolName === "findNearby") {
    return `near "${String(currentArgs.location)}"`;
  }
  if (toolName === "queryDatabase") {
    return "SQL";
  }
  if (toolName === "planMission") {
    return String(currentArgs.specialty ?? "");
  }
  if (toolName === "compareRegions" && Array.isArray(currentArgs.regions)) {
    return (currentArgs.regions as string[]).join(" vs ");
  }
  if (toolName === "firecrawlSearch") {
    return `"${String(currentArgs.query)}"`;
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

  const displayName = TOOL_LABELS[toolName] ?? toolName;

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
        setMapCenter([markers.at(0).lat, markers.at(0).lng]);
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

  const inputJson = args?.task
    ? String(args.task)
    : JSON.stringify(args, null, 2);

  const outputJson = result ? JSON.stringify(result, null, 2) : null;

  const isSqlTool = toolName === "queryDatabase";
  const sqlQuery = isSqlTool ? (args?.query as string) : null;

  return (
    <Card className="not-prose my-2 w-full overflow-hidden">
      <Collapsible onOpenChange={setIsOpen} open={isOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-muted/50">
          <div className="flex min-w-0 items-center gap-2">
            <WrenchIcon className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate text-sm font-medium text-foreground">
              {displayName}
            </span>
            <span className="hidden max-w-[200px] truncate text-xs text-muted-foreground sm:inline">
              {formatArgs(toolName, args)}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {hasGeoData() && (
              <Button
                aria-label="View on map"
                className="h-6 gap-1 px-2 text-xs"
                onClick={handleViewOnMap}
                size="sm"
                type="button"
                variant="outline"
              >
                <span className="hidden sm:inline">Map</span>
              </Button>
            )}
            {result ? (
              <Badge
                className="gap-1 text-[10px]"
                variant="secondary"
              >
                <CheckCircleIcon className="size-3" />
                Done
              </Badge>
            ) : (
              <Badge
                className="gap-1 text-[10px]"
                variant="outline"
              >
                <ClockIcon className="size-3 animate-pulse" />
                Running
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

        <CollapsibleContent>
          <Separator />
          <CardContent className="space-y-3 p-3">
            {/* Input section */}
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Parameters
              </h4>
              {isSqlTool && sqlQuery ? (
                <CodeBlock className="text-xs" code={sqlQuery} language="sql">
                  <CodeBlockHeader className="px-2 py-1">
                    <span className="text-[10px] text-muted-foreground">
                      SQL
                    </span>
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
              <>
                <Separator />
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {result?.error ? "Error" : "Output"}
                  </h4>
                  <ScrollArea className="max-h-60">
                    <pre
                      className={cn(
                        "whitespace-pre-wrap rounded-md p-2.5 font-mono text-xs",
                        result?.error
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {outputJson}
                    </pre>
                  </ScrollArea>
                </div>
              </>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
