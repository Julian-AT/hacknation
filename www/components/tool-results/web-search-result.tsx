"use client";

import { ExternalLink, Globe } from "lucide-react";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <CardHeader className="flex-row items-center justify-between space-y-0 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Globe className="size-3.5 text-emerald-400" />
          <span className="text-xs font-medium text-muted-foreground">
            Web Search
          </span>
        </div>
        <Badge className="font-mono text-[11px]" variant="secondary">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </Badge>
      </CardHeader>

      {query && (
        <>
          <Separator />
          <CardContent className="px-3 py-1.5">
            <span className="font-mono text-[11px] text-muted-foreground">
              &ldquo;{query}&rdquo;
            </span>
          </CardContent>
        </>
      )}

      <CardContent className="px-3 pb-3 pt-0">
        <ul className="flex flex-col gap-1.5">
          {results.slice(0, 3).map((item) => (
            <li key={item.url}>
              <Card className="p-2.5">
                <a
                  className="flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300"
                  href={item.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {item.title}
                  <ExternalLink className="size-3 shrink-0" />
                </a>
                <span className="mt-0.5 block truncate font-mono text-[10px] text-emerald-500/70">
                  {item.url}
                </span>
                {item.snippet && (
                  <p className="mt-1 text-pretty text-[11px] leading-relaxed text-muted-foreground">
                    {item.snippet}
                  </p>
                )}
              </Card>
            </li>
          ))}
        </ul>
      </CardContent>

      {results.length > 3 && (
        <>
          <Separator />
          <CardContent className="px-3 py-2">
            <Sources>
              <SourcesTrigger count={results.length - 3} />
              <SourcesContent>
                {results.slice(3).map((item) => (
                  <Source href={item.url} key={item.url} title={item.title} />
                ))}
              </SourcesContent>
            </Sources>
          </CardContent>
        </>
      )}
    </Card>
  );
}
