"use client";

import type { MouseEvent } from "react";
import { FileText, Code, Image, Table, ExternalLink } from "lucide-react";
import type { ArtifactKind } from "@/components/artifact";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useArtifact } from "@/hooks/use-artifact";

interface DocumentResultCardProps {
  type: "create" | "update";
  result: Record<string, unknown>;
}

/**
 * Inline card for document artifacts (`createDocument` / `updateDocument` tool results).
 * Shows the document title, kind badge, and a clickable "Open" button
 * to view/edit the document in the full artifact overlay.
 */
export function DocumentResultCard({ type, result }: DocumentResultCardProps) {
  const { setArtifact } = useArtifact();

  const document = result.document as Record<string, unknown> | undefined;
  const id =
    (typeof result.id === "string" ? result.id : undefined) ??
    (typeof result.documentId === "string" ? result.documentId : undefined) ??
    (typeof document?.id === "string" ? document.id : undefined);
  const title =
    (typeof result.title === "string" ? result.title : undefined) ??
    (typeof document?.title === "string" ? document.title : undefined) ??
    (typeof result.name === "string" ? result.name : undefined);
  const kind = ((typeof result.kind === "string" ? result.kind : undefined) ??
    (typeof document?.kind === "string" ? document.kind : undefined) ??
    "text") as ArtifactKind;

  if (!id || !title) {
    return null;
  }

  const Icon = getKindIcon(kind);
  const kindLabel = getKindLabel(kind);
  const actionLabel = type === "create" ? "Created" : "Updated";

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setArtifact((current) => ({
      documentId: id,
      kind,
      content: current.content,
      title,
      isVisible: true,
      status: "idle",
      boundingBox: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
    }));
  };

  return (
    <Card className="not-prose w-full bg-muted/50">
      <CardContent className="flex items-center gap-3 p-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-balance text-sm font-semibold text-foreground">
            {title}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <Badge
              className="px-1.5 py-0 text-[9px] uppercase tracking-wider"
              variant="secondary"
            >
              {actionLabel}
            </Badge>
            <Badge
              className="px-1.5 py-0 text-[9px] uppercase tracking-wider"
              variant="outline"
            >
              {kindLabel}
            </Badge>
          </div>
        </div>

        <Button
          className="h-7 gap-1 px-2 text-[11px]"
          onClick={handleOpen}
          size="sm"
          type="button"
          variant="outline"
        >
          <ExternalLink className="size-3.5" />
          Open
        </Button>
      </CardContent>
    </Card>
  );
}

function getKindIcon(kind: ArtifactKind) {
  switch (kind) {
    case "code":
      return Code;
    case "image":
      return Image;
    case "sheet":
      return Table;
    default:
      return FileText;
  }
}

function getKindLabel(kind: ArtifactKind) {
  switch (kind) {
    case "code":
      return "Code";
    case "image":
      return "Image";
    case "sheet":
      return "Spreadsheet";
    default:
      return "Document";
  }
}
