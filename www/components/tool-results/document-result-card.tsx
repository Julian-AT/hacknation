"use client";

import { FileText, Code, Image, Table, ExternalLink } from "lucide-react";
import { useArtifact } from "@/hooks/use-artifact";
import type { ArtifactKind } from "@/components/artifact";
import { cn } from "@/lib/utils";

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

  const id = result.id as string | undefined;
  const title = result.title as string | undefined;
  const kind = (result.kind ?? "text") as ArtifactKind;

  if (!id || !title) {
    return null;
  }

  const Icon = getKindIcon(kind);
  const kindLabel = getKindLabel(kind);
  const actionLabel = type === "create" ? "Created" : "Updated";

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
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
    <button
      className={cn(
        "group/doc flex w-full max-w-sm items-center gap-3 rounded-lg border border-border",
        "bg-background px-3 py-2.5 text-left transition-colors",
        "hover:border-primary/30 hover:bg-muted/50"
      )}
      onClick={handleOpen}
      type="button"
    >
      {/* Icon */}
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </div>

      {/* Label */}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-foreground">
          {title}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{actionLabel}</span>
          <span className="text-muted-foreground/50">&middot;</span>
          <span>{kindLabel}</span>
        </div>
      </div>

      {/* Open action */}
      <div className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors group-hover/doc:bg-muted group-hover/doc:text-foreground">
        <ExternalLink className="size-3.5" />
        Open
      </div>
    </button>
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
