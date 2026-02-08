"use client";

import { Eye, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useVF } from "@/lib/vf-context";

interface NearbyFacility {
  id: number;
  name: string;
  type: string;
  city: string;
  lat: number;
  lng: number;
  distanceKm: number;
  doctors: number | null;
  beds: number | null;
}

interface NearbyFacilitiesResultProps {
  result: Record<string, unknown>;
}

export function NearbyFacilitiesResult({
  result,
}: NearbyFacilitiesResultProps) {
  const center = result.center as {
    location: string;
    lat: number;
    lng: number;
  } | null;
  const radiusKm = result.radiusKm as number;
  const count = (result.count as number) ?? 0;
  const facilities = (result.facilities as NearbyFacility[]) ?? [];
  const { setMapFacilities, setMapCenter, setMapZoom, setMapVisible } = useVF();

  const handleViewAll = () => {
    if (facilities.length > 0) {
      setMapFacilities(
        facilities.map((f) => ({
          id: f.id,
          name: f.name,
          lat: f.lat,
          lng: f.lng,
          type: f.type,
          city: f.city,
          distanceKm: f.distanceKm,
        }))
      );
      if (center) {
        setMapCenter([center.lat, center.lng]);
        setMapZoom(10);
      }
      setMapVisible(true);
    }
  };

  return (
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <CardHeader className="flex-row items-center justify-between space-y-0 px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <MapPin className="size-3.5 text-amber-400" />
          <span className="text-xs font-medium text-muted-foreground">
            Near {center?.location ?? "location"} ({radiusKm}km)
          </span>
        </div>
        <Badge className="font-mono text-[11px]" variant="secondary">
          {count} {count === 1 ? "facility" : "facilities"}
        </Badge>
      </CardHeader>

      <CardContent className="px-3 pb-2 pt-0">
        <ul className="flex flex-col gap-1">
          {facilities.map((f) => (
            <li key={f.id}>
              <Card className="flex items-center justify-between px-2.5 py-2">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-xs font-medium text-foreground">
                    {f.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {[
                      f.type,
                      f.beds ? `${f.beds} beds` : null,
                      f.doctors ? `${f.doctors} doctors` : null,
                    ]
                      .filter(Boolean)
                      .join("  \u00b7  ")}
                  </span>
                </div>
                <Badge
                  className="ml-2 shrink-0 font-mono text-[11px] tabular-nums text-amber-400"
                  variant="outline"
                >
                  {f.distanceKm.toFixed(0)} km
                </Badge>
              </Card>
            </li>
          ))}
        </ul>
      </CardContent>

      {facilities.length > 0 && (
        <>
          <Separator />
          <CardFooter className="justify-end px-3 py-2">
            <Button
              aria-label="View all facilities on map"
              className="h-7 gap-1 px-2 text-[11px]"
              onClick={handleViewAll}
              size="sm"
              type="button"
              variant="outline"
            >
              <Eye className="size-3" />
              View All on Map
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
