"use client";

import { ExternalLink, Globe } from "lucide-react";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface WebSearchResultProps {
  result: Record<string, unknown>;
}

export function WebSearchResult({ result }: WebSearchResultProps) {
  const query = result.query as string | undefined;
  const resultCount = (result.resultCount as number) ?? 0;
  const results = (result.results as SearchResult[]) ?? [];

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Globe className="size-3.5 text-emerald-400" />
          <span className="text-xs font-medium text-muted-foreground">
            Web Search
          </span>
        </div>
        <span className="rounded-full bg-emerald-950/50 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-400">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </span>
      </div>

      {query && (
        <div className="border-b border-border px-3 py-1.5">
          <span className="font-mono text-[11px] text-muted-foreground">
            &ldquo;{query}&rdquo;
          </span>
        </div>
      )}

      <div className="flex flex-col gap-1.5 px-3 py-2">
        {results.slice(0, 3).map((item) => (
          <div
            className="flex flex-col gap-1 rounded-md bg-muted p-2.5"
            key={item.url}
          >
            <a
              className="flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300"
              href={item.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {item.title}
              <ExternalLink className="size-3 shrink-0" />
            </a>
            <span className="font-mono text-[10px] text-emerald-500/70">
              {item.url}
            </span>
            {item.snippet && (
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                {item.snippet}
              </p>
            )}
          </div>
        ))}
      </div>

      {results.length > 3 && (
        <div className="border-t border-border px-3 py-2">
          <Sources>
            <SourcesTrigger count={results.length - 3} />
            <SourcesContent>
              {results.slice(3).map((item) => (
                <Source href={item.url} key={item.url} title={item.title} />
              ))}
            </SourcesContent>
          </Sources>
        </div>
      )}
    </div>
  );
}
