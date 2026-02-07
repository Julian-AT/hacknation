import { geolocation } from "@vercel/functions";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateId,
  stepCountIs,
  streamText,
} from "ai";
import { after } from "next/server";
import { createResumableStreamContext } from "resumable-stream";
import { auth, type UserType } from "@/app/(auth)/auth";
import { entitlementsByUserType } from "@/lib/ai/entitlements";
import { type RequestHints, systemPrompt } from "@/lib/ai/prompts";
import { getLanguageModel } from "@/lib/ai/providers";
import { createDocument } from "@/lib/ai/tools/create-document";
import { getWeather } from "@/lib/ai/tools/get-weather";
import { requestSuggestions } from "@/lib/ai/tools/request-suggestions";
import { updateDocument } from "@/lib/ai/tools/update-document";
import { 
  queryDatabase,
  searchFacilities,
  getFacility,
  findNearby,
  findMedicalDeserts,
  detectAnomalies,
  getStats,
  planMission 
} from "@/lib/ai/tools";
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

export const maxDuration = 60;

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
    const { id, message, messages, selectedChatModel, selectedVisibilityType } =
      requestBody;

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

    const { longitude, latitude, city, country } = geolocation(request);

    const requestHints: RequestHints = {
      longitude,
      latitude,
      city,
      country,
    };

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

    const isReasoningModel =
      selectedChatModel.includes("reasoning") ||
      selectedChatModel.includes("thinking");

    const modelMessages = await convertToModelMessages(uiMessages);

    const toolNames = isReasoningModel
      ? ['getWeather', 'createDocument', 'updateDocument', 'requestSuggestions']
      : ['getWeather', 'createDocument', 'updateDocument', 'requestSuggestions', 'queryDatabase', 'searchFacilities', 'getFacility', 'findNearby', 'findMedicalDeserts', 'detectAnomalies', 'getStats', 'planMission'];

    console.log(`[ChatRoute] START | chatId=${id} | model=${selectedChatModel} | reasoning=${isReasoningModel} | tools=[${toolNames.join(', ')}] | messages=${uiMessages.length} | isToolApproval=${isToolApprovalFlow}`);

    const stream = createUIMessageStream({
      originalMessages: isToolApprovalFlow ? uiMessages : undefined,
      execute: async ({ writer: dataStream }) => {
        const streamStart = Date.now();
        console.log(`[ChatRoute] Stream execute started | model=${selectedChatModel}`);

        const tools: any = isReasoningModel
          ? {
              getWeather,
              createDocument: createDocument({ session, dataStream }),
              updateDocument: updateDocument({ session, dataStream }),
              requestSuggestions: requestSuggestions({ session, dataStream }),
            }
          : {
              getWeather,
              createDocument: createDocument({ session, dataStream }),
              updateDocument: updateDocument({ session, dataStream }),
              requestSuggestions: requestSuggestions({ session, dataStream }),
              queryDatabase,
              searchFacilities,
              getFacility,
              findNearby,
              findMedicalDeserts,
              detectAnomalies,
              getStats,
              planMission,
            };

        try {
          console.log(`[ChatRoute] Calling streamText | maxSteps=${isReasoningModel ? 1 : 10}`);
          const result = streamText({
            model: getLanguageModel(selectedChatModel),
            system: systemPrompt({ selectedChatModel, requestHints }),
            messages: modelMessages,
            providerOptions: isReasoningModel
              ? {
                  anthropic: {
                    thinking: { type: "enabled", budgetTokens: 10_000 },
                  },
                }
              : undefined,
            tools,
            maxSteps: isReasoningModel ? 1 : 10,
            experimental_telemetry: {
              isEnabled: isProductionEnvironment,
              functionId: "stream-text",
            },
            onFinish: (event) => {
              const duration = Date.now() - streamStart;
              console.log(`[ChatRoute] Stream finished | duration=${duration}ms | usage=${JSON.stringify(event.usage)}`);
            },
            onStepFinish: (event) => {
              const toolCalls = event.toolCalls ?? [];
              const toolResults = event.toolResults ?? [];
              if (toolCalls.length > 0) {
                for (const tc of toolCalls) {
                  console.log(`[ChatRoute] Tool called: ${tc.toolName} | callId=${tc.toolCallId} | args=${JSON.stringify(tc.args).slice(0, 300)}`);
                }
              }
              if (toolResults.length > 0) {
                for (const tr of toolResults) {
                  const resultStr = JSON.stringify(tr.result);
                  const hasError = typeof tr.result === 'object' && tr.result !== null && 'error' in tr.result;
                  console.log(`[ChatRoute] Tool result: ${tr.toolName} | callId=${tr.toolCallId} | hasError=${hasError} | size=${resultStr.length} chars`);
                  if (hasError) {
                    console.error(`[ChatRoute] Tool ERROR: ${tr.toolName} | error=${(tr.result as any).error}`);
                  }
                }
              }
            },
          } as any);

          dataStream.merge(result.toUIMessageStream({ sendReasoning: true }));
        } catch (streamError: any) {
          const duration = Date.now() - streamStart;
          console.error(`[ChatRoute] streamText ERROR | duration=${duration}ms | message=${streamError.message}`);
          console.error(`[ChatRoute] streamText ERROR | stack:`, streamError.stack);
          console.error(`[ChatRoute] streamText ERROR | model=${selectedChatModel} | chatId=${id}`);
          dataStream.write({ type: 'error', data: streamError.message });
        }

        if (titlePromise) {
          try {
            const title = await titlePromise;
            dataStream.write({ type: "data-chat-title", data: title });
            updateChatTitleById({ chatId: id, title });
          } catch (titleError) {
            console.error('[ChatRoute] Title generation failed:', titleError instanceof Error ? titleError.message : titleError);
          }
        }
      },
      generateId: generateUUID,
      onFinish: async ({ messages: finishedMessages }) => {
        console.log(`[ChatRoute] onFinish | saving ${finishedMessages.length} messages | chatId=${id}`);
        try {
          if (isToolApprovalFlow) {
            for (const finishedMsg of finishedMessages) {
              const existingMsg = uiMessages.find((m) => m.id === finishedMsg.id);
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
          console.log(`[ChatRoute] Messages saved successfully | chatId=${id}`);
        } catch (saveError) {
          console.error(`[ChatRoute] Failed to save messages | chatId=${id}:`, saveError instanceof Error ? saveError.message : saveError);
        }
      },
      onError: (error) => {
        console.error(`[ChatRoute] Stream onError | chatId=${id}:`, error instanceof Error ? error.stack : error);
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
      console.error(`[ChatRoute] ChatSDKError | code=${error.message} | vercelId=${vercelId}`);
      return error.toResponse();
    }

    if (
      error instanceof Error &&
      error.message?.includes(
        "AI Gateway requires a valid credit card on file to service requests"
      )
    ) {
      console.error(`[ChatRoute] AI Gateway credit card error | vercelId=${vercelId}`);
      return new ChatSDKError("bad_request:activate_gateway").toResponse();
    }

    console.error(`[ChatRoute] UNHANDLED ERROR | vercelId=${vercelId} | type=${error instanceof Error ? error.constructor.name : typeof error}`);
    console.error(`[ChatRoute] UNHANDLED ERROR | message=${error instanceof Error ? error.message : String(error)}`);
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
