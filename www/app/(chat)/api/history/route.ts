import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import { deleteAllChatsByUserId, getChatsByUserId } from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";

const limitSchema = z.coerce.number().int().min(1).max(100).catch(10);
const uuidSchema = z.string().uuid();

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const limit = limitSchema.parse(searchParams.get("limit") ?? "10");
  const startingAfterRaw = searchParams.get("starting_after");
  const endingBeforeRaw = searchParams.get("ending_before");

  const startingAfter = startingAfterRaw
    ? uuidSchema.safeParse(startingAfterRaw).success
      ? startingAfterRaw
      : null
    : null;
  const endingBefore = endingBeforeRaw
    ? uuidSchema.safeParse(endingBeforeRaw).success
      ? endingBeforeRaw
      : null
    : null;

  if (startingAfter && endingBefore) {
    return new ChatSDKError(
      "bad_request:api",
      "Only one of starting_after or ending_before can be provided."
    ).toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  const chats = await getChatsByUserId({
    id: session.user.id,
    limit,
    startingAfter,
    endingBefore,
  });

  return Response.json(chats);
}

export async function DELETE() {
  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  const result = await deleteAllChatsByUserId({ userId: session.user.id });

  return Response.json(result, { status: 200 });
}
