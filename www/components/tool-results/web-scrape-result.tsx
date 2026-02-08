"use client";

import { ExternalLink, FileText } from "lucide-react";
import { useState } from "react";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
    <Card className="my-2 w-full overflow-hidden">
      <CardHeader className="flex-row items-center gap-2 space-y-0 px-3 py-2.5">
        <FileText className="size-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          Scraped Content
        </span>
      </CardHeader>

      <Separator />
      <CardContent className="px-3 py-2">
        {title && (
          <p className="text-balance text-xs font-medium text-foreground">
            {title}
          </p>
        )}
        <a
          className="mt-0.5 flex items-center gap-1 font-mono text-[10px] text-muted-foreground hover:text-foreground"
          href={url}
          rel="noopener noreferrer"
          target="_blank"
        >
          {url}
          <ExternalLink className="size-3 shrink-0" />
        </a>
        <div className="mt-1 flex items-center gap-2">
          <span className="tabular-nums text-[10px] text-muted-foreground">
            {contentLength.toLocaleString()} chars
          </span>
          {truncated && (
            <Badge variant="secondary" className="text-[10px]">
              truncated
            </Badge>
          )}
        </div>
      </CardContent>

      {content && (
        <>
          <Separator />
          <CardContent className="px-3 py-2">
            <p className="whitespace-pre-wrap text-pretty text-[11px] leading-relaxed text-muted-foreground">
              {displayContent}
              {!isExpanded && content.length > previewLength && "..."}
            </p>
            {content.length > previewLength && (
              <Button
                className="mt-1.5 h-auto p-0 text-[11px]"
                onClick={() => setIsExpanded(!isExpanded)}
                type="button"
                variant="link"
              >
                {isExpanded ? "Show less" : "Show more"}
              </Button>
            )}
          </CardContent>
        </>
      )}

      {url && (
        <>
          <Separator />
          <CardContent className="px-3 py-2">
            <Sources>
              <SourcesTrigger count={1} />
              <SourcesContent>
                <Source href={url} title={title ?? url} />
              </SourcesContent>
            </Sources>
          </CardContent>
        </>
      )}
    </Card>
  );
}
