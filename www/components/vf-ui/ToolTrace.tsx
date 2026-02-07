
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Wrench, Search, Map as MapIcon, Activity, Database, AlertTriangle, Eye, Brain, Globe, GitCompare, Stethoscope } from 'lucide-react';
import { useVF } from '@/lib/vf-context';
import { cn } from '@/lib/utils';

/**
 * Agent delegation tool names — these represent subagent calls
 */
const AGENT_TOOLS = new Set([
  'investigateData',
  'analyzeGeography',
  'medicalReasoning',
  'researchWeb',
]);

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ToolTraceProps {
  toolCallId: string;
  toolName: string;
  args: any;
  result?: any;
}

export function ToolTrace({ toolCallId, toolName, args, result }: ToolTraceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setMapFacilities, setMapCenter, setMapZoom, setMapVisible } = useVF();

  const isAgentTool = AGENT_TOOLS.has(toolName);

  const getToolIcon = (name: string) => {
    switch (name) {
      // Agent delegation tools
      case 'investigateData': return <Database className="size-4 text-blue-400" />;
      case 'analyzeGeography': return <MapIcon className="size-4 text-yellow-400" />;
      case 'medicalReasoning': return <Stethoscope className="size-4 text-red-400" />;
      case 'researchWeb': return <Globe className="size-4 text-emerald-400" />;
      // Direct tools (subagent-level)
      case 'queryDatabase': return <Database className="size-4 text-blue-400" />;
      case 'searchFacilities': return <Search className="size-4 text-green-400" />;
      case 'findNearby':
      case 'findMedicalDeserts': return <MapIcon className="size-4 text-yellow-400" />;
      case 'compareRegions': return <GitCompare className="size-4 text-cyan-400" />;
      case 'detectAnomalies': return <AlertTriangle className="size-4 text-red-400" />;
      case 'crossValidateClaims': return <Brain className="size-4 text-orange-400" />;
      case 'classifyServices': return <Stethoscope className="size-4 text-pink-400" />;
      case 'planMission': return <Activity className="size-4 text-pink-400" />;
      case 'firecrawlSearch':
      case 'firecrawlScrape':
      case 'firecrawlExtract': return <Globe className="size-4 text-emerald-400" />;
      default: return <Wrench className="size-4 text-zinc-400" />;
    }
  };

  const getToolDisplayName = (name: string) => {
    switch (name) {
      case 'investigateData': return 'Data Analysis';
      case 'analyzeGeography': return 'Geographic Analysis';
      case 'medicalReasoning': return 'Medical Reasoning';
      case 'researchWeb': return 'Web Research';
      default: return name;
    }
  };

  const formatArgs = (currentArgs: any) => {
    // Agent tools show the task description
    if (isAgentTool && currentArgs.task) {
      const task = String(currentArgs.task);
      return task.slice(0, 60) + (task.length > 60 ? '...' : '');
    }
    if (toolName === 'searchFacilities') return `query: "${currentArgs.query}"`;
    if (toolName === 'findNearby') return `near: "${currentArgs.location}"`;
    if (toolName === 'queryDatabase') return 'SQL Query';
    if (toolName === 'planMission') return `specialty: "${currentArgs.specialty}"`;
    if (toolName === 'compareRegions' && Array.isArray(currentArgs.regions)) {
      return (currentArgs.regions as string[]).join(' vs ');
    }
    if (toolName === 'firecrawlSearch') return `"${currentArgs.query}"`;
    if (toolName === 'firecrawlScrape') return String(currentArgs.url ?? '').slice(0, 40);
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
    <div className={cn(
      "my-2 rounded-md overflow-hidden text-sm",
      isAgentTool
        ? "border border-zinc-700 bg-zinc-900/70"
        : "border border-zinc-800 bg-zinc-900/50"
    )}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 hover:bg-zinc-800/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          {getToolIcon(toolName)}
          <span className="font-medium text-zinc-300 font-mono">
            {isAgentTool ? getToolDisplayName(toolName) : toolName}
          </span>
          {isAgentTool && (
            <span className="text-[10px] px-1 py-0.5 rounded bg-zinc-800 text-zinc-500 uppercase tracking-wider">
              Agent
            </span>
          )}
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
              {isAgentTool ? 'Working...' : 'Running...'}
            </span>
          )}
          {isOpen ? <ChevronDown className="size-4 text-zinc-500" /> : <ChevronRight className="size-4 text-zinc-500" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-3 border-t border-zinc-800 bg-zinc-950 font-mono text-xs overflow-x-auto">
          <div className="mb-2">
            <div className="text-zinc-500 mb-1 uppercase tracking-wider text-[10px]">
              {isAgentTool ? 'Task' : 'Input'}
            </div>
            <pre className="text-zinc-300 whitespace-pre-wrap break-all">
              {isAgentTool
                ? String(args?.task ?? JSON.stringify(args, null, 2))
                : JSON.stringify(args, null, 2)}
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
