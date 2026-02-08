"use client";

import { ExternalLink, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OSMFacilitiesResultProps {
  result: Record<string, unknown>;
}

interface OSMFacility {
  osmId: string;
  name: string;
  amenity: string;
  lat: number | null;
  lng: number | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  operator: string | null;
  healthcareSpecialty: string | null;
  beds: number | null;
  emergency: string | null;
  osmUrl: string;
}

export function OSMFacilitiesResult({ result }: OSMFacilitiesResultProps) {
  const totalFound = result.totalFound as number | undefined;
  const facilities = (result.facilities as OSMFacility[]) ?? [];
  const radiusMeters = result.radiusMeters as number | undefined;
  const note = result.note as string | undefined;

  if (facilities.length === 0) {
    return (
      <Card className="my-2 w-full overflow-hidden bg-muted/50">
        <CardHeader className="flex-row items-center gap-2 space-y-0 px-3 py-2.5">
          <MapPin className="size-3.5 text-orange-400" />
          <span className="text-xs font-medium text-muted-foreground">
            OpenStreetMap &mdash; No facilities found nearby
          </span>
        </CardHeader>
      </Card>
    );
  }

  const amenityCounts: Record<string, number> = {};
  for (const f of facilities) {
    amenityCounts[f.amenity] = (amenityCounts[f.amenity] ?? 0) + 1;
  }

  return (
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <CardHeader className="flex-row items-center justify-between space-y-0 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <MapPin className="size-3.5 text-orange-400" />
          <span className="text-xs font-medium text-muted-foreground">
            OpenStreetMap Facilities
            {radiusMeters
              ? ` (${String(radiusMeters >= 1000 ? `${String(radiusMeters / 1000)}km` : `${String(radiusMeters)}m`)} radius)`
              : ""}
          </span>
        </div>
        <Badge className="font-mono text-[10px]" variant="secondary">
          {totalFound ?? facilities.length} found
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-1.5 px-3 pb-2 pt-0">
        {Object.entries(amenityCounts).map(([amenity, count]) => (
          <Badge className="text-[10px] font-normal" key={amenity} variant="outline">
            {amenity}: {count}
          </Badge>
        ))}
      </CardContent>

      <Separator />
      <CardContent className="px-0 py-2">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-8 px-3 text-[11px]">Name</TableHead>
                <TableHead className="h-8 px-3 text-[11px]">Type</TableHead>
                <TableHead className="h-8 px-3 text-[11px]">
                  Operator
                </TableHead>
                <TableHead className="h-8 px-3 text-[11px]">
                  Details
                </TableHead>
                <TableHead className="h-8 px-3 text-[11px]">OSM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facilities.slice(0, 20).map((f) => (
                <TableRow key={f.osmId}>
                  <TableCell className="max-w-[180px] truncate px-3 py-1.5 text-xs font-medium text-foreground">
                    {f.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-1.5 text-xs text-muted-foreground">
                    {f.amenity}
                  </TableCell>
                  <TableCell className="max-w-[120px] truncate px-3 py-1.5 text-xs text-muted-foreground">
                    {f.operator ?? "\u2014"}
                  </TableCell>
                  <TableCell className="px-3 py-1.5">
                    <span className="flex flex-wrap gap-1">
                      {f.beds !== null && (
                        <Badge
                          className="border-blue-500/20 bg-blue-500/10 px-1 py-0 text-[10px] text-blue-400"
                          variant="outline"
                        >
                          {f.beds} beds
                        </Badge>
                      )}
                      {f.emergency === "yes" && (
                        <Badge
                          className="border-rose-500/20 bg-rose-500/10 px-1 py-0 text-[10px] text-rose-400"
                          variant="outline"
                        >
                          ER
                        </Badge>
                      )}
                      {f.healthcareSpecialty && (
                        <Badge
                          className="border-emerald-500/20 bg-emerald-500/10 px-1 py-0 text-[10px] text-emerald-400"
                          variant="outline"
                        >
                          {f.healthcareSpecialty}
                        </Badge>
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-1.5">
                    <Button
                      aria-label={`View ${f.name} on OpenStreetMap`}
                      asChild
                      className="size-6"
                      size="icon"
                      variant="ghost"
                    >
                      <a
                        href={f.osmUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <ExternalLink className="size-3" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>

      {note && (
        <>
          <Separator />
          <CardContent className="px-3 py-2">
            <p className="text-pretty text-[10px] text-muted-foreground">
              {note}
            </p>
          </CardContent>
        </>
      )}
    </Card>
  );
}
