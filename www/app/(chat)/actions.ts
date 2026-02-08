"use server";

import { generateText, type UIMessage } from "ai";
import { cookies } from "next/headers";
import { z } from "zod";
import type { VisibilityType } from "@/components/visibility-selector";
import { titlePrompt } from "@/lib/ai/prompts";
import { getTitleModel } from "@/lib/ai/providers";
import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  updateChatVisibilityById,
} from "@/lib/db/queries";
import { getTextFromMessage } from "@/lib/utils";

const uuidSchema = z.string().uuid();
const visibilitySchema = z.enum(["public", "private"]);

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set("chat-model", model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage;
}) {
  const { text } = await generateText({
    model: getTitleModel(),
    system: titlePrompt,
    prompt: getTextFromMessage(message),
  });
  return text
    .replace(/^[#*"\s]+/, "")
    .replace(/["]+$/, "")
    .trim();
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const validatedId = uuidSchema.parse(id);
  const [message] = await getMessageById({ id: validatedId });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  const validatedChatId = uuidSchema.parse(chatId);
  const validatedVisibility = visibilitySchema.parse(
    visibility
  ) as VisibilityType;
  await updateChatVisibilityById({
    chatId: validatedChatId,
    visibility: validatedVisibility,
  });
}
