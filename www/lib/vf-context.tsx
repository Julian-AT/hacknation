
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Facility = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type?: string;
  city?: string;
  distanceKm?: number;
};

type VFContextType = {
  mapFacilities: Facility[];
  setMapFacilities: (facilities: Facility[]) => void;
  highlightedFacilityId: number | null;
  setHighlightedFacilityId: (id: number | null) => void;
  mapCenter: [number, number];
  setMapCenter: (center: [number, number]) => void;
  mapZoom: number;
  setMapZoom: (zoom: number) => void;
  isMapVisible: boolean;
  setMapVisible: (visible: boolean) => void;
};

const VFContext = createContext<VFContextType | undefined>(undefined);

export function VFProvider({ children }: { children: ReactNode }) {
  const [mapFacilities, setMapFacilities] = useState<Facility[]>([]);
  const [highlightedFacilityId, setHighlightedFacilityId] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]); // World center (adjusts dynamically when data loads)
  const [mapZoom, setMapZoom] = useState<number>(7);
  const [isMapVisible, setMapVisible] = useState<boolean>(false);

  return (
    <VFContext.Provider
      value={{
        mapFacilities,
        setMapFacilities,
        highlightedFacilityId,
        setHighlightedFacilityId,
        mapCenter,
        setMapCenter,
        mapZoom,
        setMapZoom,
        isMapVisible,
        setMapVisible,
      }}
    >
      {children}
    </VFContext.Provider>
  );
}

export function useVF() {
  const context = useContext(VFContext);
  if (context === undefined) {
    throw new Error('useVF must be used within a VFProvider');
  }
  return context;
}
