import { NextResponse } from "next/server";

import { auth } from "@/app/(auth)/auth";
import { deleteChatDocument, getChatDocuments } from "@/lib/db/queries";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return NextResponse.json(
      { error: "Missing chatId parameter" },
      { status: 400 }
    );
  }

  try {
    const documents = await getChatDocuments({ chatId });
    return NextResponse.json(documents);
  } catch (error) {
    console.error(
      "[Documents] GET error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing id parameter" },
      { status: 400 }
    );
  }

  try {
    await deleteChatDocument({ id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "[Documents] DELETE error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
