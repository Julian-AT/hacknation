"use client";

import type { ArtifactData } from "@/lib/ai/artifacts/artifact";
import { cn } from "@/lib/utils";
import { useArtifactStream } from "./artifact-stream-provider";
import { AccessibilityMapRenderer } from "./artifacts/accessibility-map";
import { DataQualityMapRenderer } from "./artifacts/data-quality-map";
import { FacilityMapRenderer } from "./artifacts/facility-map";
import { HeatmapRenderer } from "./artifacts/heatmap";
import { MedicalDesertRenderer } from "./artifacts/medical-desert";
import { MissionPlanRenderer } from "./artifacts/mission-plan";
import { RegionChoroplethRenderer } from "./artifacts/region-choropleth";
import { SpecialtyMapRenderer } from "./artifacts/specialty-map";
import { StatsDashboardRenderer } from "./artifacts/stats-dashboard";

/**
 * Canvas panel that renders the active artifact streamed by AI tools.
 * Shows per-artifact tabs when multiple artifacts exist in history,
 * allowing the user to switch between them.
 */
export function ArtifactCanvas({ onClose }: { onClose?: () => void }) {
  const { state, selectArtifact } = useArtifactStream();

  const artifact = state.current;
  const { history } = state;

  if (!artifact) {
    return (
      <div className="flex size-full flex-col items-center justify-center bg-background text-muted-foreground">
        <svg
          className="mb-3 size-12 opacity-30"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-sm text-pretty">
          Ask a question to see results here
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60 text-pretty">
          Facility maps, desert analysis, and statistics render in this panel
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex size-full flex-col">
      {/* Close button */}
      {onClose && (
        <button
          aria-label="Close canvas panel"
          className="absolute left-4 top-4 z-20 flex size-8 items-center justify-center rounded-lg border border-border bg-background/70 text-muted-foreground backdrop-blur-sm hover:bg-muted hover:text-foreground"
          onClick={onClose}
          type="button"
        >
          <svg
            fill="none"
            height="16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}

      {/* Per-artifact tabs (when multiple artifacts exist in history) */}
      {history.length > 1 && (
        <div className="flex gap-1 overflow-x-auto border-b border-border bg-background px-3 py-1.5 pl-14">
          {history.map((item, index) => {
            const isActive = artifact.id === item.id;
            const label = getArtifactLabel(item, index);
            return (
              <button
                aria-label={`Switch to ${label}`}
                className={cn(
                  "shrink-0 rounded-md px-2.5 py-1 text-xs transition-colors",
                  isActive
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                key={item.id}
                onClick={() => selectArtifact(item.id)}
                type="button"
              >
                <span className="flex items-center gap-1.5">
                  {getArtifactIcon(item.type)}
                  <span className="truncate max-w-32">{label}</span>
                  {item.status === "streaming" && (
                    <span className="size-1.5 shrink-0 rounded-full bg-blue-500" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Render based on type */}
      <div className="flex-1 overflow-hidden">
        <ArtifactRouter artifact={artifact} />
      </div>
    </div>
  );
}

function ArtifactRouter({ artifact }: { artifact: ArtifactData<unknown> }) {
  switch (artifact.type) {
    case "facility-map":
      return (
        <FacilityMapRenderer
          data={
            artifact.payload as Parameters<
              typeof FacilityMapRenderer
            >[0]["data"]
          }
        />
      );
    case "medical-desert":
      return (
        <MedicalDesertRenderer
          data={
            artifact.payload as Parameters<
              typeof MedicalDesertRenderer
            >[0]["data"]
          }
        />
      );
    case "stats-dashboard":
      return (
        <StatsDashboardRenderer
          data={
            artifact.payload as Parameters<
              typeof StatsDashboardRenderer
            >[0]["data"]
          }
        />
      );
    case "mission-plan":
      return (
        <MissionPlanRenderer
          data={
            artifact.payload as Parameters<
              typeof MissionPlanRenderer
            >[0]["data"]
          }
        />
      );
    case "healthcare-heatmap":
      return (
        <HeatmapRenderer
          data={
            artifact.payload as Parameters<typeof HeatmapRenderer>[0]["data"]
          }
        />
      );
    case "region-choropleth":
      return (
        <RegionChoroplethRenderer
          data={
            artifact.payload as Parameters<
              typeof RegionChoroplethRenderer
            >[0]["data"]
          }
        />
      );
    case "specialty-map":
      return (
        <SpecialtyMapRenderer
          data={
            artifact.payload as Parameters<
              typeof SpecialtyMapRenderer
            >[0]["data"]
          }
        />
      );
    case "data-quality-map":
      return (
        <DataQualityMapRenderer
          data={
            artifact.payload as Parameters<
              typeof DataQualityMapRenderer
            >[0]["data"]
          }
        />
      );
    case "accessibility-map":
      return (
        <AccessibilityMapRenderer
          data={
            artifact.payload as Parameters<
              typeof AccessibilityMapRenderer
            >[0]["data"]
          }
        />
      );
    default:
      return (
        <div className="flex size-full items-center justify-center bg-background text-muted-foreground">
          <p className="text-sm">Unknown artifact type: {artifact.type}</p>
        </div>
      );
  }
}

/** Extract a human-readable label from an artifact's payload or type. */
function getArtifactLabel(artifact: ArtifactData<unknown>, index: number): string {
  const payload = artifact.payload as Record<string, unknown> | null;
  if (payload && typeof payload.title === "string" && payload.title.length > 0) {
    return payload.title;
  }
  return `${formatArtifactType(artifact.type)} ${String(index + 1)}`;
}

function formatArtifactType(type: string): string {
  return type
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Small icon for the artifact type in tabs. */
function getArtifactIcon(type: string) {
  switch (type) {
    case "facility-map":
    case "specialty-map":
    case "accessibility-map":
    case "data-quality-map":
      return (
        <svg className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "medical-desert":
    case "healthcare-heatmap":
    case "region-choropleth":
      return (
        <svg className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "stats-dashboard":
      return (
        <svg className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 20V10M12 20V4M6 20v-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "mission-plan":
      return (
        <svg className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5h6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
        </svg>
      );
  }
}
