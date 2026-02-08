import { toast } from "sonner";
import { Artifact } from "@/components/create-artifact";
import { MissionPlanRenderer } from "@/components/artifacts/mission-plan";
import { CopyIcon } from "@/components/icons";

export const missionPlanArtifact = new Artifact<"mission-plan">({
  kind: "mission-plan",
  description: "Mission deployment plan with recommendations.",
  onStreamPart: ({ streamPart, setArtifact }) => {
    if (streamPart.type === "data-missionPlanDelta") {
      setArtifact((draft) => ({
        ...draft,
        content: streamPart.data,
        isVisible: true,
        status: "streaming",
      }));
    }
  },
  content: ({ content, isLoading }) => {
    if (isLoading || !content) {
      return (
        <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
          <div className="flex flex-col items-center gap-2">
            <div className="size-6 rounded-full border-2 border-muted-foreground/30 border-t-blue-500 animate-spin" />
            <span className="text-sm">Planning mission...</span>
          </div>
        </div>
      );
    }
    const data = JSON.parse(content);
    return (
      <div className="size-full">
        <MissionPlanRenderer data={data} />
      </div>
    );
  },
  actions: [
    {
      icon: <CopyIcon size={18} />,
      description: "Copy data to clipboard",
      onClick: ({ content }) => {
        navigator.clipboard.writeText(content);
        toast.success("Copied to clipboard!");
      },
    },
  ],
  toolbar: [],
});
