"use client";

import { AlertTriangle, Eye } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useVF } from "@/lib/vf-context";

interface DesertZone {
  city: string;
  nearestProvider: string | null;
  distanceKm: number;
  coordinates: { lat: number; lng: number };
}

interface MedicalDesertsResultProps {
  result: Record<string, unknown>;
}

export function MedicalDesertsResult({ result }: MedicalDesertsResultProps) {
  const service = result.service as string;
  const thresholdKm = result.thresholdKm as number;
  const totalProviders = result.totalProviders as number;
  const desertZones = (result.desertZones as DesertZone[]) ?? [];
  const desertZoneCount =
    (result.desertZoneCount as number) ?? desertZones.length;
  const status = result.status as string | undefined;
  const message = result.message as string | undefined;
  const { setMapFacilities, setMapCenter, setMapZoom, setMapVisible } = useVF();

  const handleViewOnMap = () => {
    if (desertZones.length > 0) {
      const markers = desertZones.map((z, i) => ({
        id: i + 10_000,
        name: `${z.city} Gap (${z.distanceKm.toFixed(0)}km)`,
        lat: z.coordinates.lat,
        lng: z.coordinates.lng,
        type: "Medical Desert" as const,
        distanceKm: z.distanceKm,
      }));
      setMapFacilities(markers);
      setMapCenter([markers.at(0)?.lat ?? 7.95, markers.at(0)?.lng ?? -1.02]);
      setMapZoom(7);
      setMapVisible(true);
    }
  };

  if (status === "NATIONAL_GAP") {
    return (
      <Alert className="my-2" variant="destructive">
        <AlertTriangle className="size-4" />
        <AlertTitle>National Gap: {service}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <CardHeader className="flex-row items-center justify-between space-y-0 bg-red-500/5 px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="size-3.5 text-red-400" />
          <span className="text-balance text-xs font-semibold text-red-400">
            Medical Deserts: {service}
          </span>
        </div>
        <Badge
          className="border-red-500/20 bg-red-500/10 font-mono text-[11px] text-red-400"
          variant="outline"
        >
          {desertZoneCount} {desertZoneCount === 1 ? "zone" : "zones"}
        </Badge>
      </CardHeader>

      <CardContent className="flex gap-4 px-3 py-2">
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground">Threshold:</span>
          <Badge className="font-mono tabular-nums text-[10px]" variant="secondary">
            {thresholdKm}km
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground">Providers:</span>
          <Badge className="font-mono tabular-nums text-[10px]" variant="secondary">
            {totalProviders} total
          </Badge>
        </div>
      </CardContent>

      <CardContent className="px-3 pb-2 pt-0">
        <ul className="flex flex-col gap-1">
          {desertZones.map((zone) => (
            <li key={zone.city}>
              <Card className="flex items-center justify-between px-2.5 py-2">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-xs font-medium text-foreground">
                    {zone.city}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {zone.nearestProvider
                      ? `Nearest: ${zone.nearestProvider}`
                      : "No nearby provider"}
                  </span>
                </div>
                <Badge
                  className="ml-2 shrink-0 border-red-500/20 bg-red-500/10 font-mono tabular-nums text-[11px] font-bold text-red-400"
                  variant="outline"
                >
                  {zone.distanceKm.toFixed(0)} km
                </Badge>
              </Card>
            </li>
          ))}
        </ul>
      </CardContent>

      {desertZones.length > 0 && (
        <>
          <Separator />
          <CardFooter className="justify-end px-3 py-2">
            <Button
              aria-label="View desert zones on map"
              className="h-7 gap-1 px-2 text-[11px]"
              onClick={handleViewOnMap}
              size="sm"
              type="button"
              variant="outline"
            >
              <Eye className="size-3" />
              View on Map
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
