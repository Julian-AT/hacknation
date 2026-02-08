"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface WebExtractResultProps {
  result: Record<string, unknown>;
}

export function WebExtractResult({ result }: WebExtractResultProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const urls = (result.urls as string[]) ?? [];
  const prompt = result.prompt as string | undefined;
  const extractedData = result.extractedData;

  return (
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <CardHeader className="flex-row items-center gap-2 space-y-0 px-3 py-2.5">
        <Sparkles className="size-3.5 text-emerald-400" />
        <span className="text-xs font-medium text-muted-foreground">
          Extracted Data
        </span>
      </CardHeader>

      {urls.length > 0 && (
        <>
          <Separator />
          <CardContent className="px-3 py-2">
            <Sources>
              <SourcesTrigger count={urls.length} />
              <SourcesContent>
                {urls.map((url) => (
                  <Source href={url} key={url} title={url} />
                ))}
              </SourcesContent>
            </Sources>
          </CardContent>
        </>
      )}

      {prompt && (
        <>
          <Separator />
          <CardContent className="px-3 py-2">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Extraction Prompt
            </span>
            <p className="text-pretty text-[11px] text-muted-foreground">
              {prompt}
            </p>
          </CardContent>
        </>
      )}

      {extractedData !== null && extractedData !== undefined && (
        <>
          <Separator />
          <CardContent className="px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Result
              </span>
              <Button
                className="h-auto p-0 text-[10px]"
                onClick={() => setIsExpanded(!isExpanded)}
                type="button"
                variant="link"
              >
                {isExpanded ? "Collapse" : "Expand"}
              </Button>
            </div>
            <ScrollArea className={isExpanded ? "" : "max-h-32"}>
              <pre className="mt-1 whitespace-pre-wrap font-mono text-[10px] text-muted-foreground">
                {typeof extractedData === "string"
                  ? extractedData
                  : JSON.stringify(extractedData, null, 2)}
              </pre>
            </ScrollArea>
          </CardContent>
        </>
      )}
    </Card>
  );
}
