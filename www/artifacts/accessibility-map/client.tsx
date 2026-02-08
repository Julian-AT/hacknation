import { toast } from "sonner";
import { Artifact } from "@/components/create-artifact";
import { AccessibilityMapRenderer } from "@/components/artifacts/accessibility-map";
import { CopyIcon } from "@/components/icons";

export const accessibilityMapArtifact = new Artifact<"accessibility-map">({
  kind: "accessibility-map",
  description: "Travel time accessibility map with isochrone polygons.",
  onStreamPart: ({ streamPart, setArtifact }) => {
    if (streamPart.type === "data-accessibilityMapDelta") {
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
            <span className="text-sm">Computing accessibility...</span>
          </div>
        </div>
      );
    }
    const data = JSON.parse(content);
    return (
      <div className="size-full">
        <AccessibilityMapRenderer data={data} />
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
