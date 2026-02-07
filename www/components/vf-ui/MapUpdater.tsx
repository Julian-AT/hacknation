'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export default function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom);
  }, [map, center, zoom]);

  return null;
}
