import { geolocation } from "@vercel/functions";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateId,
} from "ai";
import { after } from "next/server";
import { createResumableStreamContext } from "resumable-stream";
import { auth, type UserType } from "@/app/(auth)/auth";
import { createOrchestratorAgent } from "@/lib/ai/agents";
import { entitlementsByUserType } from "@/lib/ai/entitlements";
import { isProductionEnvironment } from "@/lib/constants";
import {
  createStreamId,
  deleteChatById,
  getChatById,
  getMessageCountByUserId,
  getMessagesByChatId,
  saveChat,
  saveMessages,
  updateChatTitleById,
  updateMessage,
} from "@/lib/db/queries";
import type { DBMessage } from "@/lib/db/schema";
import { ChatSDKError } from "@/lib/errors";
import type { ChatMessage } from "@/lib/types";
import { convertToUIMessages, generateUUID } from "@/lib/utils";
import { generateTitleFromUserMessage } from "../../actions";
import { type PostRequestBody, postRequestBodySchema } from "./schema";

export const maxDuration = 120;

function getStreamContext() {
  try {
    return createResumableStreamContext({ waitUntil: after });
  } catch (_) {
    return null;
  }
}

export { getStreamContext };

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (_) {
    return new ChatSDKError("bad_request:api").toResponse();
  }

  try {
    const {
      id,
      message,
      messages,
      selectedChatModel,
      selectedVisibilityType,
    } = requestBody;

    const session = await auth();

    if (!session?.user) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    const userType: UserType = session.user.type;

    const messageCount = await getMessageCountByUserId({
      id: session.user.id,
      differenceInHours: 24,
    });

    if (messageCount > entitlementsByUserType[userType].maxMessagesPerDay) {
      return new ChatSDKError("rate_limit:chat").toResponse();
    }

    const isToolApprovalFlow = Boolean(messages);

    const chat = await getChatById({ id });
    let messagesFromDb: DBMessage[] = [];
    let titlePromise: Promise<string> | null = null;

    if (chat) {
      if (chat.userId !== session.user.id) {
        return new ChatSDKError("forbidden:chat").toResponse();
      }
      if (!isToolApprovalFlow) {
        messagesFromDb = await getMessagesByChatId({ id });
      }
    } else if (message?.role === "user") {
      await saveChat({
        id,
        userId: session.user.id,
        title: "New chat",
        visibility: selectedVisibilityType,
      });
      titlePromise = generateTitleFromUserMessage({ message });
    }

    const uiMessages = isToolApprovalFlow
      ? (messages as ChatMessage[])
      : [...convertToUIMessages(messagesFromDb), message as ChatMessage];

    if (message?.role === "user") {
      await saveMessages({
        messages: [
          {
            chatId: id,
            id: message.id,
            role: "user",
            parts: message.parts,
            attachments: [],
            createdAt: new Date(),
          },
        ],
      });
    }

    console.log(
      `[ChatRoute] START | chatId=${id} | model=${selectedChatModel} | messages=${uiMessages.length} | isToolApproval=${isToolApprovalFlow}`
    );

    const modelMessages = await convertToModelMessages(uiMessages);

    const stream = createUIMessageStream({
      originalMessages: isToolApprovalFlow ? uiMessages : undefined,
      execute: async ({ writer: dataStream }) => {
        const streamStart = Date.now();
        console.log(
          `[ChatRoute] Agent execute started | model=${selectedChatModel}`
        );

        try {
          // Create the orchestrator agent with dataStream access for artifact tools
          const agent = await createOrchestratorAgent({
            session,
            dataStream,
            modelId: selectedChatModel,
            userId: session.user.id,
            chatId: id,
          });

          // Run the agent and merge its output stream into our data stream
          const result = await agent.stream({
            messages: modelMessages,
          });

          dataStream.merge(
            result.toUIMessageStream({ sendReasoning: true })
          );
        } catch (streamError: unknown) {
          const duration = Date.now() - streamStart;
          const errorMessage =
            streamError instanceof Error
              ? streamError.message
              : String(streamError);
          console.error(
            `[ChatRoute] Agent ERROR | duration=${duration}ms | message=${errorMessage}`
          );
          if (streamError instanceof Error && streamError.stack) {
            console.error(
              `[ChatRoute] Agent ERROR | stack:`,
              streamError.stack
            );
          }
          dataStream.write({ type: "error", errorText: errorMessage });
        }

        if (titlePromise) {
          try {
            const title = await titlePromise;
            dataStream.write({ type: "data-chat-title", data: title });
            updateChatTitleById({ chatId: id, title });
          } catch (titleError) {
            console.error(
              "[ChatRoute] Title generation failed:",
              titleError instanceof Error
                ? titleError.message
                : titleError
            );
          }
        }
      },
      generateId: generateUUID,
      onFinish: async ({ messages: finishedMessages }) => {
        console.log(
          `[ChatRoute] onFinish | saving ${finishedMessages.length} messages | chatId=${id}`
        );
        try {
          if (isToolApprovalFlow) {
            for (const finishedMsg of finishedMessages) {
              const existingMsg = uiMessages.find(
                (m) => m.id === finishedMsg.id
              );
              if (existingMsg) {
                await updateMessage({
                  id: finishedMsg.id,
                  parts: finishedMsg.parts,
                });
              } else {
                await saveMessages({
                  messages: [
                    {
                      id: finishedMsg.id,
                      role: finishedMsg.role,
                      parts: finishedMsg.parts,
                      createdAt: new Date(),
                      attachments: [],
                      chatId: id,
                    },
                  ],
                });
              }
            }
          } else if (finishedMessages.length > 0) {
            await saveMessages({
              messages: finishedMessages.map((currentMessage) => ({
                id: currentMessage.id,
                role: currentMessage.role,
                parts: currentMessage.parts,
                createdAt: new Date(),
                attachments: [],
                chatId: id,
              })),
            });
          }
          console.log(
            `[ChatRoute] Messages saved successfully | chatId=${id}`
          );
        } catch (saveError) {
          console.error(
            `[ChatRoute] Failed to save messages | chatId=${id}:`,
            saveError instanceof Error ? saveError.message : saveError
          );
        }
      },
      onError: (error) => {
        console.error(
          `[ChatRoute] Stream onError | chatId=${id}:`,
          error instanceof Error ? error.stack : error
        );
        return "Oops, an error occurred!";
      },
    });

    return createUIMessageStreamResponse({
      stream,
      async consumeSseStream({ stream: sseStream }) {
        if (!process.env.REDIS_URL) {
          return;
        }
        try {
          const streamContext = getStreamContext();
          if (streamContext) {
            const streamId = generateId();
            await createStreamId({ streamId, chatId: id });
            await streamContext.createNewResumableStream(
              streamId,
              () => sseStream
            );
          }
        } catch (_) {
          // ignore redis errors
        }
      },
    });
  } catch (error) {
    const vercelId = request.headers.get("x-vercel-id");

    if (error instanceof ChatSDKError) {
      console.error(
        `[ChatRoute] ChatSDKError | code=${error.message} | vercelId=${vercelId}`
      );
      return error.toResponse();
    }

    if (
      error instanceof Error &&
      error.message?.includes(
        "AI Gateway requires a valid credit card on file to service requests"
      )
    ) {
      console.error(
        `[ChatRoute] AI Gateway credit card error | vercelId=${vercelId}`
      );
      return new ChatSDKError("bad_request:activate_gateway").toResponse();
    }

    console.error(
      `[ChatRoute] UNHANDLED ERROR | vercelId=${vercelId} | type=${error instanceof Error ? error.constructor.name : typeof error}`
    );
    console.error(
      `[ChatRoute] UNHANDLED ERROR | message=${error instanceof Error ? error.message : String(error)}`
    );
    if (error instanceof Error && error.stack) {
      console.error(`[ChatRoute] UNHANDLED ERROR | stack:`, error.stack);
    }
    return new ChatSDKError("offline:chat").toResponse();
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new ChatSDKError("bad_request:api").toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  const chat = await getChatById({ id });

  if (chat?.userId !== session.user.id) {
    return new ChatSDKError("forbidden:chat").toResponse();
  }

  const deletedChat = await deleteChatById({ id });

  return Response.json(deletedChat, { status: 200 });
}
