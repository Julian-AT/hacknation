import type { UseChatHelpers } from "@ai-sdk/react";
import { ArrowDownIcon } from "lucide-react";
import { useMessages } from "@/hooks/use-messages";
import type { Vote } from "@/lib/db/schema";
import type { ChatMessage } from "@/lib/types";
import { useDataStream } from "./data-stream-provider";
import { Greeting } from "./greeting";
import { PreviewMessage, ThinkingMessage } from "./message";
import { OrchestratorProgress } from "./vf-ui/OrchestratorProgress";

import { ToolResultRouter } from "./tool-results";

const AGENT_TOOLS = new Set([
  "investigateData",
  "analyzeGeography",
  "medicalReasoning",
  "researchWeb",
]);

type MessagesProps = {
  addToolApprovalResponse: UseChatHelpers<ChatMessage>["addToolApprovalResponse"];
  chatId: string;
  status: UseChatHelpers<ChatMessage>["status"];
  votes: Vote[] | undefined;
  messages: ChatMessage[];
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  isReadonly: boolean;
  isArtifactVisible: boolean;
  selectedModelId: string;
};

function PureMessages({
  addToolApprovalResponse,
  chatId,
  status,
  votes,
  messages,
  setMessages,
  regenerate,
  isReadonly,
  selectedModelId: _selectedModelId,
}: MessagesProps) {
  const {
    containerRef: messagesContainerRef,
    endRef: messagesEndRef,
    isAtBottom,
    scrollToBottom,
    hasSentMessage,
  } = useMessages({
    status,
  });

  useDataStream();

  return (
    <div className="relative flex-1">
      <div
        className="absolute inset-0 touch-pan-y overflow-y-auto"
        ref={messagesContainerRef}
      >
        <div className="mx-auto flex min-w-0 max-w-4xl flex-col gap-4 px-2 py-4 md:gap-6 md:px-4">
          {messages.length === 0 && <Greeting />}

          {messages.map((message, index) => (
            <div key={message.id}>
              <PreviewMessage
                addToolApprovalResponse={addToolApprovalResponse}
                chatId={chatId}
                isLoading={
                  status === "streaming" && messages.length - 1 === index
                }
                isReadonly={isReadonly}
                message={message}
                regenerate={regenerate}
                requiresScrollPadding={
                  hasSentMessage && index === messages.length - 1
                }
                setMessages={setMessages}
                vote={
                  votes
                    ? votes.find((vote) => vote.messageId === message.id)
                    : undefined
                }
              />
              
              {message.role === 'assistant' && message.parts && (() => {
                // Extract tool invocation parts
                const toolParts = message.parts
                  .filter((part: any) => part.type === 'tool-invocation')
                  .map((part: any) => ({
                    toolCallId: part.toolInvocation.toolCallId,
                    toolName: part.toolInvocation.toolName,
                    args: part.toolInvocation.args,
                    result: 'result' in part.toolInvocation ? part.toolInvocation.result : undefined,
                  }));

                const agentSteps = toolParts.filter((t: any) => AGENT_TOOLS.has(t.toolName));
                const nonAgentParts = toolParts.filter((t: any) => !AGENT_TOOLS.has(t.toolName));
                const isLastMessage = messages.length - 1 === index;
                const isStreamingMsg = status === "streaming" && isLastMessage;

                return (
                  <div className="ml-10">
                    {/* Orchestrator progress for agent delegation steps */}
                    {agentSteps.length > 0 && (
                      <OrchestratorProgress
                        steps={agentSteps}
                        isStreaming={isStreamingMsg}
                      />
                    )}

                    {/* Individual tool result cards */}
                    {toolParts.map((tool: any) => (
                      <ToolResultRouter
                        key={tool.toolCallId}
                        toolCallId={tool.toolCallId}
                        toolName={tool.toolName}
                        args={tool.args}
                        result={tool.result}
                      />
                    ))}
                  </div>
                );
              })()}
            </div>
          ))}

          {status === "submitted" &&
            !messages.some((msg) =>
              msg.parts?.some(
                (part) => "state" in part && part.state === "approval-responded"
              )
            ) && <ThinkingMessage />}

          <div
            className="min-h-[24px] min-w-[24px] shrink-0"
            ref={messagesEndRef}
          />
        </div>
      </div>

      <button
        aria-label="Scroll to bottom"
        className={`absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full border bg-background p-2 shadow-lg transition-all hover:bg-muted ${
          isAtBottom
            ? "pointer-events-none scale-0 opacity-0"
            : "pointer-events-auto scale-100 opacity-100"
        }`}
        onClick={() => scrollToBottom("smooth")}
        type="button"
      >
        <ArrowDownIcon className="size-4" />
      </button>
    </div>
  );
}

export const Messages = PureMessages;
