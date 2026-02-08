import { auth } from "@/app/(auth)/auth";
import {
  deleteChatDocument,
  getChatById,
  getChatDocumentById,
  getChatDocuments,
} from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";

const UUID_RE =
  /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameter chatId is required."
    ).toResponse();
  }

  if (!UUID_RE.test(chatId)) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameter chatId must be a valid UUID."
    ).toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError("unauthorized:document").toResponse();
  }

  const chat = await getChatById({ id: chatId });

  if (!chat) {
    return new ChatSDKError("not_found:chat").toResponse();
  }

  if (chat.userId !== session.user.id) {
    return new ChatSDKError("forbidden:document").toResponse();
  }

  try {
    const documents = await getChatDocuments({ chatId });
    return Response.json(documents, { status: 200 });
  } catch (error) {
    console.error(
      "[Documents] GET error:",
      error instanceof Error ? error.message : error
    );
    return new ChatSDKError(
      "bad_request:document",
      "Failed to fetch documents"
    ).toResponse();
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameter id is required."
    ).toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError("unauthorized:document").toResponse();
  }

  const doc = await getChatDocumentById({ id });

  if (!doc) {
    return new ChatSDKError("not_found:document").toResponse();
  }

  const chat = await getChatById({ id: doc.chatId });

  if (!chat) {
    return new ChatSDKError("not_found:chat").toResponse();
  }

  if (chat.userId !== session.user.id) {
    return new ChatSDKError("forbidden:document").toResponse();
  }

  try {
    await deleteChatDocument({ id });
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(
      "[Documents] DELETE error:",
      error instanceof Error ? error.message : error
    );
    return new ChatSDKError(
      "bad_request:document",
      "Failed to delete document"
    ).toResponse();
  }
}
