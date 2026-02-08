"use client";

import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AnomalyDetail {
  type: string;
  description: string;
  facilities: Record<string, unknown>[];
}

interface AnomalyAlertsResultProps {
  result: Record<string, unknown>;
}

export function AnomalyAlertsResult({ result }: AnomalyAlertsResultProps) {
  const region = result.region as string | undefined;
  const foundAnomalies = (result.foundAnomalies as number) ?? 0;
  const details = (result.details as AnomalyDetail[]) ?? [];

  return (
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <CardHeader className="flex-row items-center justify-between space-y-0 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-3.5 text-red-400" />
          <span className="text-xs font-medium text-muted-foreground">
            Anomalies{region ? ` in ${region}` : " Found"}
          </span>
        </div>
        <Badge
          className="border-red-500/20 bg-red-500/10 font-mono text-[11px] text-red-400"
          variant="outline"
        >
          {foundAnomalies} {foundAnomalies === 1 ? "issue" : "issues"}
        </Badge>
      </CardHeader>

      <CardContent className="px-3 pb-3 pt-0">
        <ul className="flex flex-col gap-1.5">
          {details.map((detail) => (
            <li key={detail.type}>
              <AnomalyItem detail={detail} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function AnomalyItem({ detail }: { detail: AnomalyDetail }) {
  return (
    <Card className="p-2.5">
      <div className="flex flex-col gap-1.5">
        <Badge
          className="w-fit border-red-500/20 bg-red-500/10 text-[9px] uppercase tracking-wider text-orange-400"
          variant="outline"
        >
          {detail.type.replaceAll("_", " ")}
        </Badge>
        <p className="text-pretty text-xs text-muted-foreground">
          {detail.description}
        </p>
      </div>

      {detail.facilities.length > 0 && (
        <Collapsible className="mt-2">
          <CollapsibleTrigger asChild>
            <Button
              className="h-auto gap-1 p-0 text-[11px]"
              type="button"
              variant="link"
            >
              {detail.facilities.length}{" "}
              {detail.facilities.length === 1 ? "facility" : "facilities"}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ScrollArea className="mt-1.5 max-h-32">
              <pre className="rounded-md bg-muted p-2 font-mono text-[10px] text-muted-foreground">
                {JSON.stringify(detail.facilities, null, 2)}
              </pre>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      )}
    </Card>
  );
}
