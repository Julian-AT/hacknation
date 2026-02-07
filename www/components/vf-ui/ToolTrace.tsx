
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Wrench, Search, Map as MapIcon, Activity, BarChart, Database, AlertTriangle } from 'lucide-react';

interface ToolTraceProps {
  toolCallId: string;
  toolName: string;
  args: any;
  result?: any;
}

export function ToolTrace({ toolCallId, toolName, args, result }: ToolTraceProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getToolIcon = (name: string) => {
    switch (name) {
      case 'queryDatabase': return <Database className="w-4 h-4 text-blue-400" />;
      case 'searchFacilities': return <Search className="w-4 h-4 text-green-400" />;
      case 'findNearby': 
      case 'findMedicalDeserts': return <MapIcon className="w-4 h-4 text-yellow-400" />;
      case 'detectAnomalies': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'getStats': return <BarChart className="w-4 h-4 text-purple-400" />;
      case 'planMission': return <Activity className="w-4 h-4 text-pink-400" />;
      default: return <Wrench className="w-4 h-4 text-zinc-400" />;
    }
  };

  const formatArgs = (args: any) => {
    // Summarize args for header
    if (toolName === 'searchFacilities') return `query: "${args.query}"`;
    if (toolName === 'findNearby') return `near: "${args.location}"`;
    if (toolName === 'queryDatabase') return 'SQL Query';
    if (toolName === 'planMission') return `specialty: "${args.specialty}"`;
    return JSON.stringify(args).slice(0, 30) + (JSON.stringify(args).length > 30 ? '...' : '');
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
          {result ? (
            <span className="text-xs px-1.5 py-0.5 rounded bg-green-900/30 text-green-400 border border-green-900/50">
              Completed
            </span>
          ) : (
            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-900/30 text-amber-400 border border-amber-900/50 animate-pulse">
              Running...
            </span>
          )}
          {isOpen ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
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
