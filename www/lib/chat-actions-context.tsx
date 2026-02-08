"use client";

import { createContext, useContext } from "react";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { ChatMessage } from "@/lib/types";

type ChatActionsContextValue = {
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"] | null;
};

const ChatActionsContext = createContext<ChatActionsContextValue>({
  sendMessage: null,
});

export function ChatActionsProvider({
  sendMessage,
  children,
}: {
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
  children: React.ReactNode;
}) {
  return (
    <ChatActionsContext.Provider value={{ sendMessage }}>
      {children}
    </ChatActionsContext.Provider>
  );
}

export function useChatActions() {
  return useContext(ChatActionsContext);
}
