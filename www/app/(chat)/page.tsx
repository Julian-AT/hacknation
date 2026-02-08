import { cookies } from "next/headers";
import { Suspense } from "react";
import { Chat } from "@/components/chat";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-dvh" />}>
      <NewChatPage />
    </Suspense>
  );
}

import { Provider as ChatStoreProvider } from "@ai-sdk-tools/store";
import { VFProvider } from "@/lib/vf-context";

async function NewChatPage() {
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("chat-model");
  const id = generateUUID();

  return (
    <ChatStoreProvider key={id}>
      <VFProvider>
        <Chat
          autoResume={false}
          id={id}
          initialChatModel={modelIdFromCookie?.value || DEFAULT_CHAT_MODEL}
          initialMessages={[]}
          initialVisibilityType="private"
          isReadonly={false}
          key={id}
        />
        <DataStreamHandler />
      </VFProvider>
    </ChatStoreProvider>
  );
}
