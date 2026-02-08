import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import { getChatById, getVotesByChatId, voteMessage } from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";

const voteLimiter = rateLimit({ windowMs: 60_000, max: 30 });

const voteSchema = z.object({
  chatId: z.string().uuid(),
  messageId: z.string().uuid(),
  type: z.enum(["up", "down"]),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameter chatId is required."
    ).toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError("unauthorized:vote").toResponse();
  }

  const chat = await getChatById({ id: chatId });

  if (!chat) {
    return new ChatSDKError("not_found:chat").toResponse();
  }

  if (chat.userId !== session.user.id) {
    return new ChatSDKError("forbidden:vote").toResponse();
  }

  const votes = await getVotesByChatId({ id: chatId });

  return Response.json(votes, { status: 200 });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const parsed = voteSchema.safeParse(body);

  if (!parsed.success) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameters chatId (uuid), messageId (uuid), and type (up|down) are required."
    ).toResponse();
  }

  const { chatId, messageId, type } = parsed.data;

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError("unauthorized:vote").toResponse();
  }

  if (!voteLimiter.check(session.user.id)) {
    return new ChatSDKError("rate_limit:vote").toResponse();
  }

  const chat = await getChatById({ id: chatId });

  if (!chat) {
    return new ChatSDKError("not_found:vote").toResponse();
  }

  if (chat.userId !== session.user.id) {
    return new ChatSDKError("forbidden:vote").toResponse();
  }

  await voteMessage({
    chatId,
    messageId,
    type,
  });

  return new Response("Message voted", { status: 200 });
}
