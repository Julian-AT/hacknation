"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useArtifactStream } from "./artifact-stream-provider";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { ChatHeader } from "@/components/chat-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAutoResume } from "@/hooks/use-auto-resume";
import { useChatVisibility } from "@/hooks/use-chat-visibility";
import type { Vote } from "@/lib/db/schema";
import { ChatSDKError } from "@/lib/errors";
import type { Attachment, ChatMessage } from "@/lib/types";
import { cn, fetcher, fetchWithErrorHandlers, generateUUID } from "@/lib/utils";
import { useVF } from "@/lib/vf-context";
import { ArtifactCanvas } from "./artifact-canvas";
import { useDataStream } from "./data-stream-provider";
import { ChatActionsProvider } from "@/lib/chat-actions-context";
import { ChatDocuments } from "./chat-documents";
import { Messages } from "./messages";
import { MultimodalInput } from "./multimodal-input";
import { getChatHistoryPaginationKey } from "./sidebar-history";
import { toast } from "./toast";
import type { VisibilityType } from "./visibility-selector";

const DeckMap = dynamic(() => import("./vf-ui/DeckMap"), { ssr: false });

export function Chat({
  id,
  initialMessages,
  initialChatModel,
  initialVisibilityType,
  isReadonly,
  autoResume,
}: {
  id: string;
  initialMessages: ChatMessage[];
  initialChatModel: string;
  initialVisibilityType: VisibilityType;
  isReadonly: boolean;
  autoResume: boolean;
}) {
  const router = useRouter();
  const {
    setMapFacilities,
    setMapCenter,
    setMapZoom,
    isMapVisible,
    setMapVisible,
  } = useVF();

  // Track whether the artifact canvas should be visible
  const {
    state: artifactState,
    processDataPart,
    selectArtifact,
    reset: resetArtifacts,
  } = useArtifactStream();
  const activeArtifact = artifactState.current;
  const [canvasDismissed, setCanvasDismissed] = useState(false);
  const isCanvasVisible = activeArtifact !== null && !canvasDismissed;

  // Helper to open a specific artifact from the history (e.g. inline card click)
  const openArtifact = useCallback(
    (id: string) => {
      selectArtifact(id);
      setCanvasDismissed(false);
    },
    [selectArtifact]
  );

  const { visibilityType } = useChatVisibility({
    chatId: id,
    initialVisibilityType,
  });

  const { mutate } = useSWRConfig();

  // --- Chat state reset: clear stale state when navigating to a new chat ---
  const { setDataStream } = useDataStream();
  const isNewChat = initialMessages.length === 0;

  useEffect(() => {
    // Clear layout-level data stream so old artifacts don't bleed through
    setDataStream([]);

    // Reset map state
    setMapFacilities([]);
    setMapVisible(false);

    // Reset canvas artifact state
    resetArtifacts();

    // Reset old artifact SWR state
    if (isNewChat) {
      mutate(
        "artifact",
        {
          documentId: "init",
          content: "",
          kind: "text",
          title: "",
          status: "idle",
          isVisible: false,
          boundingBox: { top: 0, left: 0, width: 0, height: 0 },
        },
        false
      );
    }

    // Reset canvas dismissed state
    setCanvasDismissed(false);
  }, [isNewChat, mutate, resetArtifacts, setDataStream, setMapFacilities, setMapVisible]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      // When user navigates back/forward, refresh to sync with URL
      router.refresh();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  const [input, setInput] = useState<string>("");
  const [showCreditCardAlert, setShowCreditCardAlert] = useState(false);
  const [currentModelId, setCurrentModelId] = useState(initialChatModel);
  const currentModelIdRef = useRef(currentModelId);

  useEffect(() => {
    currentModelIdRef.current = currentModelId;
  }, [currentModelId]);

  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
    regenerate,
    resumeStream,
    addToolApprovalResponse,
  } = useChat<ChatMessage>({
    id,
    messages: initialMessages,
    generateId: generateUUID,
    sendAutomaticallyWhen: ({ messages: currentMessages }) => {
      const lastMessage = currentMessages.at(-1);
      const shouldContinue =
        lastMessage?.parts?.some(
          (part) =>
            "state" in part &&
            part.state === "approval-responded" &&
            "approval" in part &&
            (part.approval as { approved?: boolean })?.approved === true
        ) ?? false;
      return shouldContinue;
    },
    transport: new DefaultChatTransport({
      api: "/api/chat",
      fetch: fetchWithErrorHandlers as typeof fetch,
      prepareSendMessagesRequest(request) {
        const lastMessage = request.messages.at(-1);
        const isToolApprovalContinuation =
          lastMessage?.role !== "user" ||
          request.messages.some((msg) =>
            msg.parts?.some((part) => {
              const state = (part as { state?: string }).state;
              return (
                state === "approval-responded" || state === "output-denied"
              );
            })
          );

        return {
          body: {
            id: request.id,
            ...(isToolApprovalContinuation
              ? { messages: request.messages }
              : { message: lastMessage }),
            selectedChatModel: currentModelIdRef.current,
            selectedVisibilityType: visibilityType,
            ...request.body,
          },
        };
      },
    }),
    onData: (dataPart) => {
      // Route canvas-artifact events to the artifact stream provider
      processDataPart(dataPart as { type: string; data?: unknown });
      // Forward all parts to the document artifact handler
      setDataStream((ds) => (ds ? [...ds, dataPart as never] : []));
    },
    onFinish: () => {
      mutate(unstable_serialize(getChatHistoryPaginationKey));
    },
    onError: (error) => {
      if (error instanceof ChatSDKError) {
        if (
          error.message?.includes("AI Gateway requires a valid credit card")
        ) {
          setShowCreditCardAlert(true);
        } else {
          toast({
            type: "error",
            description: error.message,
          });
        }
      }
    },
  });

  // Fallback: listen for tool results to show on legacy VF map
  // (findNearby, findMedicalDeserts, getStats, planMission now stream via artifacts)
  useEffect(() => {
    const lastMessage = messages.at(-1);
    if (lastMessage?.role !== "assistant" || !lastMessage.parts) {
      return;
    }

    for (const part of lastMessage.parts) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = part as any;
      const { type } = p;

      // Match tool results by static type or dynamic-tool pattern
      let toolName: string | undefined;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let result: any;

      if (type === "tool-getFacility" || (type === "dynamic-tool" && p.toolName === "getFacility")) {
        toolName = "getFacility";
        result = p.state === "output-available" ? p.output : undefined;
      } else if (type === "tool-searchFacilities" || (type === "dynamic-tool" && p.toolName === "searchFacilities")) {
        toolName = "searchFacilities";
        result = p.state === "output-available" ? p.output : undefined;
      }

      if (!toolName || !result) {
        continue;
      }

      // getFacility: single facility → show on map
      if (toolName === "getFacility" && result.facility?.lat && result.facility?.lng) {
        setMapFacilities([
          {
            id: result.facility.id,
            name: result.facility.name,
            lat: result.facility.lat,
            lng: result.facility.lng,
            type: result.facility.facilityType,
            city: result.facility.addressCity,
          },
        ]);
        setMapCenter([result.facility.lat, result.facility.lng]);
        setMapZoom(12);
        setMapVisible(true);
      }

      // searchFacilities: multiple facilities → show all on map
      if (toolName === "searchFacilities" && result.results?.length > 0) {
        const geoResults = result.results.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (r: any) => r.lat != null && r.lng != null
        );
        if (geoResults.length > 0) {
          setMapFacilities(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            geoResults.map((r: any) => ({
              id: r.id,
              name: r.name,
              lat: r.lat,
              lng: r.lng,
              type: r.type,
              city: r.city,
            }))
          );
          // Center on the first result
          setMapCenter([geoResults[0].lat, geoResults[0].lng]);
          setMapZoom(7);
          setMapVisible(true);
        }
      }
    }
  }, [messages, setMapFacilities, setMapCenter, setMapZoom, setMapVisible]);

  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

  useEffect(() => {
    if (query && !hasAppendedQuery) {
      sendMessage({
        role: "user" as const,
        parts: [{ type: "text", text: query }],
      });

      setHasAppendedQuery(true);
      window.history.replaceState({}, "", `/chat/${id}`);
    }
  }, [query, sendMessage, hasAppendedQuery, id]);

  const { data: votes } = useSWR<Vote[]>(
    messages.length >= 2 ? `/api/vote?chatId=${id}` : null,
    fetcher
  );

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  useAutoResume({
    autoResume,
    initialMessages,
    resumeStream,
    setMessages,
  });

  // Reset canvas dismissed state when a new artifact streams in
  useEffect(() => {
    if (activeArtifact) {
      setCanvasDismissed(false);
    }
  }, [activeArtifact?.id, activeArtifact]);

  return (
    <>
    <ChatActionsProvider sendMessage={sendMessage}>
      <div className="flex h-dvh min-w-0 bg-background overflow-hidden">
        {/* Left Panel: Chat */}
        <div
          className={cn(
            "flex flex-col h-full",
            isCanvasVisible || isMapVisible
              ? "w-[45%] border-r border-border"
              : "w-full"
          )}
        >
          <ChatHeader
            chatId={id}
            isReadonly={isReadonly}
            selectedVisibilityType={initialVisibilityType}
          />

          <Messages
            addToolApprovalResponse={addToolApprovalResponse}
            chatId={id}
            isArtifactVisible={isCanvasVisible}
            isReadonly={isReadonly}
            messages={messages}
            onOpenArtifact={openArtifact}
            regenerate={regenerate}
            selectedModelId={initialChatModel}
            setMessages={setMessages}
            status={status}
            votes={votes}
          />

          <div className="sticky bottom-0 z-1 mx-auto flex w-full flex-col gap-2 border-t-0 bg-background px-2 pb-3 md:px-4 md:pb-4">
            {!isReadonly && <ChatDocuments chatId={id} />}
            {!isReadonly && (
              <MultimodalInput
                attachments={attachments}
                chatId={id}
                input={input}
                isNewChat={isNewChat}
                messages={messages}
                onModelChange={setCurrentModelId}
                selectedModelId={currentModelId}
                selectedVisibilityType={visibilityType}
                sendMessage={sendMessage}
                setAttachments={setAttachments}
                setInput={setInput}
                setMessages={setMessages}
                status={status}
                stop={stop}
              />
            )}
          </div>
        </div>

        {/* Right Panel: Artifact Canvas (streamed visualizations) */}
        {isCanvasVisible && (
          <div className="w-[55%] h-full bg-background relative">
            <ArtifactCanvas onClose={() => setCanvasDismissed(true)} />
          </div>
        )}

        {/* Right Panel: Map (only visible when geographic data is available) */}
        {isMapVisible && !isCanvasVisible && (
          <div className="w-[55%] h-full bg-background relative">
            <DeckMap />

            <button
              aria-label="Close map panel"
              className="absolute top-4 right-4 z-10 flex items-center justify-center size-8 rounded-lg bg-background/70 backdrop-blur-sm border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => {
                setMapVisible(false);
                setMapFacilities([]);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setMapVisible(false);
                  setMapFacilities([]);
                }
              }}
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
                <title>Close</title>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      </ChatActionsProvider>

      <AlertDialog
        onOpenChange={setShowCreditCardAlert}
        open={showCreditCardAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate AI Gateway</AlertDialogTitle>
            <AlertDialogDescription>
              This application requires{" "}
              {process.env.NODE_ENV === "production" ? "the owner" : "you"} to
              activate Vercel AI Gateway.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                window.open(
                  "https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%3Fmodal%3Dadd-credit-card",
                  "_blank"
                );
                window.location.href = "/";
              }}
            >
              Activate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
