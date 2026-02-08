"use client";

import { ExternalLink, FileText } from "lucide-react";
import { useState } from "react";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";

interface WebScrapeResultProps {
  result: Record<string, unknown>;
}

export function WebScrapeResult({ result }: WebScrapeResultProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const url = result.url as string;
  const title = result.title as string | undefined;
  const contentLength = (result.contentLength as number) ?? 0;
  const truncated = result.truncated as boolean;
  const content = result.content as string | undefined;

  const previewLength = 500;
  const displayContent = isExpanded
    ? content
    : content?.slice(0, previewLength);

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <FileText className="size-3.5 text-emerald-400" />
        <span className="text-xs font-medium text-muted-foreground">
          Scraped Content
        </span>
      </div>

      <div className="border-t border-border px-3 py-2">
        {title && (
          <p className="text-xs font-medium text-foreground">{title}</p>
        )}
        <a
          className="mt-0.5 flex items-center gap-1 font-mono text-[10px] text-emerald-500/70 hover:text-emerald-400"
          href={url}
          rel="noopener noreferrer"
          target="_blank"
        >
          {url}
          <ExternalLink className="size-3 shrink-0" />
        </a>
        <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>{contentLength.toLocaleString()} chars</span>
          {truncated && (
            <span className="rounded bg-amber-950/40 px-1 py-0.5 text-amber-400">
              truncated
            </span>
          )}
        </div>
      </div>

      {content && (
        <div className="border-t border-border px-3 py-2">
          <p className="whitespace-pre-wrap text-[11px] leading-relaxed text-muted-foreground">
            {displayContent}
            {!isExpanded && content.length > previewLength && "..."}
          </p>
          {content.length > previewLength && (
            <button
              className="mt-1.5 text-[11px] font-medium text-blue-400 hover:text-blue-300"
              onClick={() => setIsExpanded(!isExpanded)}
              type="button"
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}

      {url && (
        <div className="border-t border-border px-3 py-2">
          <Sources>
            <SourcesTrigger count={1} />
            <SourcesContent>
              <Source href={url} title={title ?? url} />
            </SourcesContent>
          </Sources>
        </div>
      )}
    </div>
  );
}
