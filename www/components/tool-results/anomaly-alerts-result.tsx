"use client";

import { AlertTriangle, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
    <Card className="my-2 w-full overflow-hidden">
      <CardHeader className="flex-row items-center justify-between space-y-0 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            Anomalies{region ? ` in ${region}` : " Found"}
          </span>
        </div>
        <Badge
          className="font-mono text-[11px]"
          variant="secondary"
        >
          {foundAnomalies} {foundAnomalies === 1 ? "issue" : "issues"}
        </Badge>
      </CardHeader>

      <CardContent className="px-3 pb-3 pt-0">
        {foundAnomalies === 0 || details.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <AlertTriangle className="size-5 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">No anomalies detected</p>
            <p className="text-[11px] text-muted-foreground/70">All checked facilities passed consistency checks</p>
          </div>
        ) : (
        <ul className="flex flex-col gap-1.5">
          {details.map((detail) => (
            <li key={detail.type}>
              <AnomalyItem detail={detail} />
            </li>
          ))}
        </ul>
        )}
      </CardContent>
    </Card>
  );
}

function AnomalyItem({ detail }: { detail: AnomalyDetail }) {
  return (
    <div className="rounded-md border border-border p-2.5">
      <div className="flex flex-col gap-1.5">
        <Badge variant="secondary" className="w-fit text-[9px] uppercase tracking-wider font-medium">
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
            <ul className="mt-1.5 flex flex-col gap-1">
              {detail.facilities.map((f, idx) => (
                <li key={String(f.id ?? f.name ?? idx)}>
                  <AnomalyFacilityCard facility={f} />
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

function AnomalyFacilityCard({ facility }: { facility: Record<string, unknown> }) {
  const name = facility.name as string | undefined;
  const type = (facility.facilityType ?? facility.facility_type ?? facility.type) as string | undefined;
  const region = (facility.addressRegion ?? facility.address_region ?? facility.region) as string | undefined;
  const city = (facility.addressCity ?? facility.address_city ?? facility.city) as string | undefined;
  const beds = (facility.capacity ?? facility.beds) as number | null | undefined;
  const doctors = (facility.numDoctors ?? facility.num_doctors ?? facility.doctors) as number | null | undefined;
  const id = facility.id as number | undefined;

  const standardKeys = new Set(["id", "name", "facilityType", "facility_type", "type", "addressRegion", "address_region", "region", "addressCity", "address_city", "city", "capacity", "beds", "numDoctors", "num_doctors", "doctors", "lat", "lng", "embedding"]);
  const extraEntries = Object.entries(facility).filter(
    ([k, v]) => !standardKeys.has(k) && v !== null && v !== undefined && v !== ""
  );

  return (
    <div className="flex items-start gap-2 rounded-md bg-muted px-2.5 py-2">
      <Building2 className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[11px] font-medium text-foreground">
            {name ?? "Unknown facility"}
          </span>
          {id !== undefined && (
            <span className="shrink-0 font-mono text-[9px] text-muted-foreground">
              #{String(id)}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
          {type && (
            <Badge variant="secondary" className="text-[9px] font-normal">
              {type}
            </Badge>
          )}
          {(region ?? city) && (
            <span>{[city, region].filter(Boolean).join(", ")}</span>
          )}
          {beds !== null && beds !== undefined && (
            <span className="font-mono tabular-nums">{beds} beds</span>
          )}
          {doctors !== null && doctors !== undefined && (
            <span className="font-mono tabular-nums">{doctors} doctors</span>
          )}
        </div>
        {extraEntries.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {extraEntries.slice(0, 4).map(([key, val]) => (
              <span className="text-[9px] text-muted-foreground" key={key}>
                <span className="font-medium">{key.replaceAll("_", " ")}:</span>{" "}
                {typeof val === "number" ? val.toLocaleString() : String(val).slice(0, 60)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
