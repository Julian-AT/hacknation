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
    <Card className="my-2 w-full overflow-hidden">
      <CardHeader className="flex-row items-center justify-between space-y-0 px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">
            Medical Deserts: {service}
          </span>
        </div>
        <Badge
          className="font-mono text-[11px]"
          variant="secondary"
        >
          {desertZoneCount} {desertZoneCount === 1 ? "zone" : "zones"}
        </Badge>
      </CardHeader>

      <CardContent className="flex gap-4 px-3 py-2">
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground">Threshold:</span>
          <span className="font-mono tabular-nums text-[11px] text-foreground">{thresholdKm}km</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground">Providers:</span>
          <span className="font-mono tabular-nums text-[11px] text-foreground">{totalProviders}</span>
        </div>
      </CardContent>

      <CardContent className="px-3 pb-2 pt-0">
        {desertZones.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <AlertTriangle className="size-5 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">No medical deserts detected</p>
            <p className="text-[11px] text-muted-foreground/70">All areas have {service} coverage within {thresholdKm}km</p>
          </div>
        ) : (
        <ul className="flex flex-col gap-1">
          {desertZones.map((zone) => (
            <li key={zone.city}>
              <div className="flex items-center justify-between rounded-md border border-border px-2.5 py-2">
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
                  className="ml-2 shrink-0 font-mono tabular-nums text-[11px]"
                  variant="outline"
                >
                  {zone.distanceKm.toFixed(0)} km
                </Badge>
              </div>
            </li>
          ))}
        </ul>
        )}
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
