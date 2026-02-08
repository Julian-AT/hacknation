"use client";

import type { ArtifactData } from "@ai-sdk-tools/artifacts";
import { useArtifacts } from "@ai-sdk-tools/artifacts/client";
import { FacilityMapRenderer } from "./artifacts/facility-map";
import { MedicalDesertRenderer } from "./artifacts/medical-desert";
import { MissionPlanRenderer } from "./artifacts/mission-plan";
import { StatsDashboardRenderer } from "./artifacts/stats-dashboard";

/**
 * Canvas panel that renders the active artifact streamed by AI tools.
 * Switches on artifact type to display the appropriate visualization.
 */
export function ArtifactCanvas({ onClose }: { onClose?: () => void }) {
  const [{ current, types }] = useArtifacts();

  // Show the most recently streamed artifact
  const artifact = current;

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

      {/* Artifact type tabs (when multiple types have data) */}
      {types.length > 1 && (
        <div className="flex gap-1 border-b border-border bg-background px-3 py-1.5">
          {types.map((type) => {
            const isActive = artifact?.type === type;
            return (
              <span
                className={`rounded-md px-2 py-1 text-xs ${
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground"
                }`}
                key={type}
              >
                {formatArtifactType(type)}
              </span>
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
    default:
      return (
        <div className="flex size-full items-center justify-center bg-background text-muted-foreground">
          <p className="text-sm">Unknown artifact type: {artifact.type}</p>
        </div>
      );
  }
}

function formatArtifactType(type: string): string {
  return type
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
