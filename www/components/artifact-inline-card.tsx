"use client";

import type { ArtifactData } from "@/lib/ai/artifacts/artifact";
import { cn } from "@/lib/utils";
import { useArtifactStream } from "./artifact-stream-provider";

/**
 * Compact inline card for a single canvas artifact.
 * Shows the artifact type icon, title, and an "Open" button.
 * Clicking the card sets it as the active artifact and opens the canvas panel.
 */
export function ArtifactInlineCard({
  artifact,
  onOpen,
}: {
  artifact: ArtifactData<unknown>;
  onOpen: (id: string) => void;
}) {
  const { state } = useArtifactStream();
  const isActive = state.current?.id === artifact.id;
  const payload = artifact.payload as Record<string, unknown> | null;
  const title =
    payload && typeof payload.title === "string" && payload.title.length > 0
      ? payload.title
      : formatArtifactType(artifact.type);

  return (
    <button
      aria-label={`Open ${title}`}
      className={cn(
        "group/card flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
        isActive
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-muted/30 hover:border-border hover:bg-muted/60"
      )}
      onClick={() => onOpen(artifact.id)}
      type="button"
    >
      {/* Icon */}
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-md",
          isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        )}
      >
        {getTypeIcon(artifact.type)}
      </div>

      {/* Label and metadata */}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-foreground">
          {title}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{formatArtifactType(artifact.type)}</span>
          {artifact.status === "streaming" && (
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-blue-500" />
              Loading
            </span>
          )}
        </div>
      </div>

      {/* Open indicator */}
      <div
        className={cn(
          "flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground group-hover/card:bg-muted group-hover/card:text-foreground"
        )}
      >
        <svg
          className="size-3.5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Open</title>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" x2="21" y1="14" y2="3" />
        </svg>
        {isActive ? "Viewing" : "Open"}
      </div>
    </button>
  );
}

/**
 * Renders a list of all canvas artifacts from history as inline cards.
 * Place this in the message stream to give each artifact a dedicated open widget.
 */
export function ArtifactHistoryCards({
  onOpen,
}: {
  onOpen: (id: string) => void;
}) {
  const { state } = useArtifactStream();
  const { history } = state;

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {history.length > 1 && (
        <span className="text-xs font-medium text-muted-foreground">
          Visualizations ({String(history.length)})
        </span>
      )}
      <div className="flex flex-col gap-1.5">
        {history.map((artifact) => (
          <ArtifactInlineCard
            artifact={artifact}
            key={artifact.id}
            onOpen={onOpen}
          />
        ))}
      </div>
    </div>
  );
}

function formatArtifactType(type: string): string {
  return type
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getTypeIcon(type: string) {
  switch (type) {
    case "facility-map":
    case "specialty-map":
    case "accessibility-map":
    case "data-quality-map":
      return (
        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>Map</title>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "medical-desert":
    case "healthcare-heatmap":
    case "region-choropleth":
      return (
        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>Region</title>
          <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "stats-dashboard":
      return (
        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>Stats</title>
          <path d="M18 20V10M12 20V4M6 20v-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "mission-plan":
      return (
        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>Plan</title>
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5h6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>Artifact</title>
          <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
        </svg>
      );
  }
}
