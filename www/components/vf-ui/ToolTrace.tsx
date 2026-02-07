
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Wrench, Search, Map as MapIcon, Activity, BarChart, Database, AlertTriangle, Eye } from 'lucide-react';
import { useVF } from '@/lib/vf-context';

interface ToolTraceProps {
  toolCallId: string;
  toolName: string;
  args: any;
  result?: any;
}

export function ToolTrace({ toolCallId, toolName, args, result }: ToolTraceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setMapFacilities, setMapCenter, setMapZoom, setMapVisible } = useVF();

  const getToolIcon = (name: string) => {
    switch (name) {
      case 'queryDatabase': return <Database className="size-4 text-blue-400" />;
      case 'searchFacilities': return <Search className="size-4 text-green-400" />;
      case 'findNearby': 
      case 'findMedicalDeserts': return <MapIcon className="size-4 text-yellow-400" />;
      case 'detectAnomalies': return <AlertTriangle className="size-4 text-red-400" />;
      case 'getStats': return <BarChart className="size-4 text-purple-400" />;
      case 'planMission': return <Activity className="size-4 text-pink-400" />;
      default: return <Wrench className="size-4 text-zinc-400" />;
    }
  };

  const formatArgs = (currentArgs: any) => {
    if (toolName === 'searchFacilities') return `query: "${currentArgs.query}"`;
    if (toolName === 'findNearby') return `near: "${currentArgs.location}"`;
    if (toolName === 'queryDatabase') return 'SQL Query';
    if (toolName === 'planMission') return `specialty: "${currentArgs.specialty}"`;
    const str = JSON.stringify(currentArgs);
    return str.slice(0, 30) + (str.length > 30 ? '...' : '');
  };

  const hasGeoData = (): boolean => {
    if (!result || result.error) return false;
    if (toolName === 'findNearby' && result.facilities?.length > 0) return true;
    if (toolName === 'findMedicalDeserts' && result.desertZones?.length > 0) return true;
    if (toolName === 'getFacility' && result.facility?.lat && result.facility?.lng) return true;
    return false;
  };

  const handleViewOnMap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!result) return;

    if (toolName === 'findNearby' && result.facilities) {
      setMapFacilities(result.facilities);
      if (result.center) {
        setMapCenter([result.center.lat, result.center.lng]);
        setMapZoom(10);
      }
      setMapVisible(true);
    } else if (toolName === 'findMedicalDeserts' && result.desertZones) {
      const markers = result.desertZones.map((z: any) => ({
        id: Math.random(),
        name: `${z.city} Gap (${z.distanceKm}km)`,
        lat: z.coordinates.lat,
        lng: z.coordinates.lng,
        type: 'Medical Desert',
        distanceKm: z.distanceKm,
      }));
      setMapFacilities(markers);
      if (markers.length > 0) {
        setMapCenter([markers[0].lat, markers[0].lng]);
        setMapZoom(7);
      }
      setMapVisible(true);
    } else if (toolName === 'getFacility' && result.facility?.lat && result.facility?.lng) {
      setMapFacilities([{
        id: result.facility.id,
        name: result.facility.name,
        lat: result.facility.lat,
        lng: result.facility.lng,
        type: result.facility.facilityType,
        city: result.facility.addressCity,
      }]);
      setMapCenter([result.facility.lat, result.facility.lng]);
      setMapZoom(12);
      setMapVisible(true);
    }
  };

  return (
    <div className="my-2 border border-zinc-800 rounded-md bg-zinc-900/50 overflow-hidden text-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 hover:bg-zinc-800/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          {getToolIcon(toolName)}
          <span className="font-medium text-zinc-300 font-mono">{toolName}</span>
          <span className="text-zinc-500 text-xs truncate max-w-[200px]">
            {formatArgs(args)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hasGeoData() && (
            <button
              type="button"
              aria-label="View on map"
              onClick={handleViewOnMap}
              className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-blue-900/30 text-blue-400 border border-blue-900/50 hover:bg-blue-900/50"
            >
              <Eye className="size-3" />
              Map
            </button>
          )}
          {result ? (
            <span className="text-xs px-1.5 py-0.5 rounded bg-green-900/30 text-green-400 border border-green-900/50">
              Completed
            </span>
          ) : (
            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-900/30 text-amber-400 border border-amber-900/50 animate-pulse">
              Running...
            </span>
          )}
          {isOpen ? <ChevronDown className="size-4 text-zinc-500" /> : <ChevronRight className="size-4 text-zinc-500" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-3 border-t border-zinc-800 bg-zinc-950 font-mono text-xs overflow-x-auto">
          <div className="mb-2">
            <div className="text-zinc-500 mb-1 uppercase tracking-wider text-[10px]">Input</div>
            <pre className="text-zinc-300 whitespace-pre-wrap break-all">
              {JSON.stringify(args, null, 2)}
            </pre>
          </div>
          
          {result && (
            <div>
              <div className="text-zinc-500 mb-1 uppercase tracking-wider text-[10px]">Output</div>
              <pre className="text-zinc-400 whitespace-pre-wrap max-h-60 overflow-y-auto custom-scrollbar">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
