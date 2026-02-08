"use client";
import type { UseChatHelpers } from "@ai-sdk/react";
import { useState, useMemo } from "react";
import type { Vote } from "@/lib/db/schema";
import type { ChatMessage } from "@/lib/types";
import { cn, sanitizeText } from "@/lib/utils";
import { useDataStream } from "./data-stream-provider";
import { MessageContent } from "./elements/message";
import { Response } from "./elements/response";
import { Tool, ToolContent, ToolHeader, ToolInput } from "./elements/tool";
import { SparklesIcon } from "./icons";
import { MessageActions } from "./message-actions";
import { MessageEditor } from "./message-editor";
import { MessageReasoning } from "./message-reasoning";
import { PreviewAttachment } from "./preview-attachment";
import { ToolResultRouter } from "./tool-results";
import { FacilityInlineCard } from "./vf-ui/FacilityInlineCard";

/** Regex to match <<facility:ID:Name>> citation syntax in AI responses */
const FACILITY_CITE_RE = /<<facility:(\d+):([^>]+)>>/g;

type TextSegment =
  | { kind: "text"; text: string }
  | { kind: "facility"; id: number; name: string };

function parseTextWithCitations(raw: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let lastIndex = 0;

  for (const match of raw.matchAll(FACILITY_CITE_RE)) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      segments.push({ kind: "text", text: raw.slice(lastIndex, matchIndex) });
    }
    segments.push({
      kind: "facility",
      id: Number.parseInt(match[1], 10),
      name: match[2].trim(),
    });
    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < raw.length) {
    segments.push({ kind: "text", text: raw.slice(lastIndex) });
  }

  return segments;
}

function MessageTextWithCitations({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const segments = useMemo(
    () => parseTextWithCitations(sanitizeText(text)),
    [text]
  );

  const hasCitations = segments.some((s) => s.kind === "facility");

  if (!hasCitations) {
    return <Response>{sanitizeText(text)}</Response>;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {segments.map((seg, i) => {
        const key = `seg-${String(i)}`;
        if (seg.kind === "text") {
          return seg.text.trim() ? (
            <Response key={key}>{seg.text}</Response>
          ) : null;
        }
        return (
          <FacilityInlineCard
            facilityId={seg.id}
            key={key}
            name={seg.name}
          />
        );
      })}
    </div>
  );
}


const PurePreviewMessage = ({
  addToolApprovalResponse,
  chatId,
  message,
  vote,
  isLoading,
  setMessages,
  regenerate,
  isReadonly,
  requiresScrollPadding: _requiresScrollPadding,
}: {
  addToolApprovalResponse: UseChatHelpers<ChatMessage>["addToolApprovalResponse"];
  chatId: string;
  message: ChatMessage;
  vote: Vote | undefined;
  isLoading: boolean;
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  isReadonly: boolean;
  requiresScrollPadding: boolean;
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  const attachmentsFromMessage =
    message.parts?.filter((part) => part.type === "file") ?? [];

  useDataStream();

  return (
    <div
      className="group/message fade-in w-full animate-in duration-200"
      data-role={message.role}
      data-testid={`message-${message.role}`}
    >
      <div
        className={cn("flex w-full min-w-0 items-start gap-2 md:gap-3", {
          "justify-end": message.role === "user" && mode !== "edit",
          "justify-start": message.role === "assistant",
        })}
      >
        {message.role === "assistant" && (
          <div className="-mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border">
            <SparklesIcon size={14} />
          </div>
        )}

        <div
          className={cn("flex min-w-0 flex-col", {
            "gap-2 md:gap-4": message.parts?.some(
              (p) => p.type === "text" && p.text?.trim()
            ),
            "w-full":
              (message.role === "assistant" &&
                (message.parts?.some(
                  (p) => p.type === "text" && p.text?.trim()
                ) ||
                  message.parts?.some(
                    (p) =>
                      p.type.startsWith("tool-") || p.type === "dynamic-tool"
                  ))) ||
              mode === "edit",
            "max-w-[calc(100%-2.5rem)] sm:max-w-[min(fit-content,80%)]":
              message.role === "user" && mode !== "edit",
          })}
        >
          {attachmentsFromMessage.length > 0 && (
            <div
              className="flex flex-row justify-end gap-2"
              data-testid={"message-attachments"}
            >
              {attachmentsFromMessage.map((attachment) => (
                <PreviewAttachment
                  attachment={{
                    name: attachment.filename ?? "file",
                    contentType: attachment.mediaType,
                    url: attachment.url,
                  }}
                  key={attachment.url}
                />
              ))}
            </div>
          )}

          {message.parts?.map((part, index) => {
            const { type } = part;
            const key = `message-${message.id}-part-${index}`;

            if (type === "reasoning") {
              const hasContent = part.text?.trim().length > 0;
              const isStreaming = "state" in part && part.state === "streaming";
              if (hasContent || isStreaming) {
                return (
                  <MessageReasoning
                    isLoading={isLoading || isStreaming}
                    key={key}
                    reasoning={part.text || ""}
                  />
                );
              }
            }

            if (type === "text") {
              if (mode === "view") {
                return (
                  <div key={key}>
                    <MessageContent
                      className={cn({
                        "wrap-break-word w-fit rounded-2xl bg-primary px-3 py-2 text-right text-primary-foreground":
                          message.role === "user",
                        "bg-transparent px-0 py-0 text-left":
                          message.role === "assistant",
                      })}
                      data-testid="message-content"
                    >
                      {message.role === "assistant" ? (
                        <MessageTextWithCitations text={part.text} />
                      ) : (
                        <Response>{sanitizeText(part.text)}</Response>
                      )}
                    </MessageContent>
                  </div>
                );
              }

              if (mode === "edit") {
                return (
                  <div
                    className="flex w-full flex-row items-start gap-3"
                    key={key}
                  >
                    <div className="size-8" />
                    <div className="min-w-0 flex-1">
                      <MessageEditor
                        key={message.id}
                        message={message}
                        regenerate={regenerate}
                        setMessages={setMessages}
                        setMode={setMode}
                      />
                    </div>
                  </div>
                );
              }
            }

            // All other tool parts: both static (tool-<name>) and dynamic formats
            if (type.startsWith("tool-") || type === "dynamic-tool") {
              const toolName =
                type === "dynamic-tool"
                  ? (part as unknown as { toolName: string }).toolName
                  : type.slice(5); // Remove "tool-" prefix

              const toolPart = part as unknown as {
                toolCallId: string;
                state: string;
                input?: Record<string, unknown>;
                output?: Record<string, unknown>;
              };

              return (
                <ToolResultRouter
                  args={toolPart.input ?? {}}
                  key={toolPart.toolCallId}
                  result={
                    toolPart.state === "output-available"
                      ? toolPart.output
                      : undefined
                  }
                  toolCallId={toolPart.toolCallId}
                  toolName={toolName}
                />
              );
            }

            return null;
          })}

          {!isReadonly && (
            <MessageActions
              chatId={chatId}
              isLoading={isLoading}
              key={`action-${message.id}`}
              message={message}
              setMode={setMode}
              vote={vote}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const PreviewMessage = PurePreviewMessage;

export const ThinkingMessage = () => {
  return (
    <div
      className="group/message fade-in w-full animate-in duration-300"
      data-role="assistant"
      data-testid="message-assistant-loading"
    >
      <div className="flex items-start justify-start gap-3">
        <div className="-mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border">
          <div className="animate-pulse">
            <SparklesIcon size={14} />
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 md:gap-4">
          <div className="flex items-center gap-1 p-0 text-muted-foreground text-sm">
            <span className="animate-pulse">Thinking</span>
            <span className="inline-flex">
              <span className="animate-bounce [animation-delay:0ms]">.</span>
              <span className="animate-bounce [animation-delay:150ms]">.</span>
              <span className="animate-bounce [animation-delay:300ms]">.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
