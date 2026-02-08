"use client";

import { Sparkles, ExternalLink } from "lucide-react";
import { useState } from "react";

interface WebExtractResultProps {
  result: Record<string, unknown>;
}

export function WebExtractResult({ result }: WebExtractResultProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const urls = (result.urls as string[]) ?? [];
  const prompt = result.prompt as string | undefined;
  const extractedData = result.extractedData;

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <Sparkles className="size-3.5 text-emerald-400" />
        <span className="text-xs font-medium text-zinc-400">
          Extracted Data
        </span>
      </div>

      {urls.length > 0 && (
        <div className="border-t border-zinc-800 px-3 py-2">
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Sources
          </span>
          <div className="flex flex-col gap-0.5">
            {urls.map((url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-mono text-[10px] text-emerald-500/70 hover:text-emerald-400"
              >
                {url}
                <ExternalLink className="size-2.5 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {prompt && (
        <div className="border-t border-zinc-800 px-3 py-2">
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Extraction Prompt
          </span>
          <p className="text-[11px] text-zinc-400">{prompt}</p>
        </div>
      )}

      {extractedData !== null && extractedData !== undefined && (
        <div className="border-t border-zinc-800 px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Result
            </span>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[10px] text-blue-400 hover:text-blue-300"
            >
              {isExpanded ? "Collapse" : "Expand"}
            </button>
          </div>
          <pre
            className={`mt-1 overflow-x-auto whitespace-pre-wrap font-mono text-[10px] text-zinc-400 ${isExpanded ? "" : "max-h-32 overflow-y-hidden"}`}
          >
            {typeof extractedData === "string"
              ? extractedData
              : JSON.stringify(extractedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
