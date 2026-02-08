"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import {
  Sources,
  SourcesTrigger,
  SourcesContent,
  Source,
} from "@/components/ai-elements/sources";

interface WebExtractResultProps {
  result: Record<string, unknown>;
}

export function WebExtractResult({ result }: WebExtractResultProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const urls = (result.urls as string[]) ?? [];
  const prompt = result.prompt as string | undefined;
  const extractedData = result.extractedData;

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <Sparkles className="size-3.5 text-emerald-400" />
        <span className="text-xs font-medium text-muted-foreground">
          Extracted Data
        </span>
      </div>

      {urls.length > 0 && (
        <div className="border-t border-border px-3 py-2">
          <Sources>
            <SourcesTrigger count={urls.length} />
            <SourcesContent>
              {urls.map((url) => (
                <Source key={url} href={url} title={url} />
              ))}
            </SourcesContent>
          </Sources>
        </div>
      )}

      {prompt && (
        <div className="border-t border-border px-3 py-2">
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Extraction Prompt
          </span>
          <p className="text-[11px] text-muted-foreground">{prompt}</p>
        </div>
      )}

      {extractedData !== null && extractedData !== undefined && (
        <div className="border-t border-border px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
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
            className={`mt-1 overflow-x-auto whitespace-pre-wrap font-mono text-[10px] text-muted-foreground ${isExpanded ? "" : "max-h-32 overflow-y-hidden"}`}
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
