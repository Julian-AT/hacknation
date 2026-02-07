'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useVF } from '@/lib/vf-context';

// Dynamic import required -- globe.gl uses WebGL/Three.js (browser-only)
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

// Convert Leaflet zoom (0-18) to globe altitude (0.1-4)
function zoomToAltitude(zoom: number): number {
  // Leaflet zoom 7 ~= altitude 1.8 (Ghana overview)
  // Leaflet zoom 10 ~= altitude 0.6 (city level)
  // Leaflet zoom 12 ~= altitude 0.25 (facility level)
  const mapped = 4.5 - zoom * 0.35;
  return Math.max(0.15, Math.min(4, mapped));
}

type PointData = {
  id: number;
  lat: number;
  lng: number;
  name: string;
  type: string;
  city: string;
  distanceKm: number | undefined;
  isDesert: boolean;
};

export default function GlobeView() {
  const { mapFacilities, mapCenter, mapZoom } = useVF();
  const globeRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Configure globe controls on mount
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    const controls = globe.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;
      controls.enableZoom = true;
      controls.minDistance = 120;
      controls.maxDistance = 800;
    }
  }, [dimensions]); // re-run when globe mounts (dimensions change from 0)

  // Fly to center when mapCenter/mapZoom changes
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    const altitude = zoomToAltitude(mapZoom);
    globe.pointOfView(
      { lat: mapCenter[0], lng: mapCenter[1], altitude },
      1000 // animation duration ms
    );

    // Stop auto-rotate when navigating to data
    const controls = globe.controls();
    if (controls && mapFacilities.length > 0) {
      controls.autoRotate = false;
    }
  }, [mapCenter, mapZoom, mapFacilities.length]);

  // Transform facility data to point data
  const pointsData: PointData[] = useMemo(
    () =>
      mapFacilities.map((f) => ({
        id: f.id,
        lat: f.lat,
        lng: f.lng,
        name: f.name,
        type: f.type ?? 'Facility',
        city: f.city ?? '',
        distanceKm: f.distanceKm,
        isDesert:
          (f.type ?? '').toLowerCase().includes('desert') ||
          (f.type ?? '').toLowerCase().includes('gap'),
      })),
    [mapFacilities]
  );

  // Rings data for medical deserts (pulsing rings)
  const ringsData = useMemo(
    () => pointsData.filter((p) => p.isDesert),
    [pointsData]
  );

  const pointColor = useCallback(
    (d: object) => ((d as PointData).isDesert ? '#ef4444' : '#3b82f6'),
    []
  );

  const pointAltitude = useCallback(
    (d: object) => ((d as PointData).isDesert ? 0.04 : 0.02),
    []
  );

  const pointRadius = useCallback(
    (d: object) => ((d as PointData).isDesert ? 0.4 : 0.3),
    []
  );

  const pointLabel = useCallback(
    (d: object) => {
      const pt = d as PointData;
      return `
        <div style="
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          padding: 8px 12px;
          font-family: var(--font-geist), system-ui, sans-serif;
          max-width: 220px;
          color: white;
        ">
          <div style="font-weight: 600; font-size: 13px; margin-bottom: 2px;">
            ${pt.name}
          </div>
          <div style="font-size: 11px; color: ${pt.isDesert ? '#f87171' : '#93c5fd'};">
            ${pt.type}
          </div>
          ${pt.city ? `<div style="font-size: 11px; color: #a1a1aa;">${pt.city}</div>` : ''}
          ${pt.distanceKm !== undefined ? `<div style="font-size: 11px; color: #60a5fa; margin-top: 2px;">${pt.distanceKm} km away</div>` : ''}
        </div>
      `;
    },
    []
  );

  const ringColor = useCallback(
    () => (t: number) => `rgba(239, 68, 68, ${1 - t})`,
    []
  );

  return (
    <div ref={containerRef} className="size-full bg-zinc-950">
      {dimensions.width > 0 && (
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          // Globe appearance
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          atmosphereColor="#3b82f6"
          atmosphereAltitude={0.15}
          // Points (facilities)
          pointsData={pointsData}
          pointLat="lat"
          pointLng="lng"
          pointColor={pointColor}
          pointAltitude={pointAltitude}
          pointRadius={pointRadius}
          pointLabel={pointLabel}
          pointsMerge={false}
          // Rings (medical deserts pulsing effect)
          ringsData={ringsData}
          ringLat="lat"
          ringLng="lng"
          ringColor={ringColor}
          ringMaxRadius={3}
          ringPropagationSpeed={2}
          ringRepeatPeriod={1200}
        />
      )}
    </div>
  );
}
