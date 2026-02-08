"use client";

import { AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
    <div className="my-2 w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-3.5 text-red-400" />
          <span className="text-xs font-medium text-zinc-400">
            Anomalies{region ? ` in ${region}` : " Found"}
          </span>
        </div>
        <span className="rounded-full bg-red-950/50 px-2 py-0.5 font-mono text-[11px] font-semibold text-red-400">
          {foundAnomalies} {foundAnomalies === 1 ? "issue" : "issues"}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 px-3 pb-3">
        {details.map((detail) => (
          <AnomalyItem key={detail.type} detail={detail} />
        ))}
      </div>
    </div>
  );
}

function AnomalyItem({ detail }: { detail: AnomalyDetail }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-md bg-zinc-800/60 p-2.5">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="rounded bg-red-950/50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-orange-400">
            {detail.type.replaceAll("_", " ")}
          </span>
        </div>
        <p className="text-xs text-zinc-400">{detail.description}</p>
      </div>

      {detail.facilities.length > 0 && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-400"
        >
          {isExpanded ? (
            <ChevronDown className="size-3" />
          ) : (
            <ChevronRight className="size-3" />
          )}
          {detail.facilities.length}{" "}
          {detail.facilities.length === 1 ? "facility" : "facilities"}
        </button>
      )}

      {isExpanded && (
        <div className="mt-1.5 rounded bg-zinc-900/80 p-2">
          <pre className="max-h-32 overflow-y-auto font-mono text-[10px] text-zinc-500">
            {JSON.stringify(detail.facilities, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
