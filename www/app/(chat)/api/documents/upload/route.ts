import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/app/(auth)/auth";
import { getChatById, saveChatDocument } from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";

const ACCEPTED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "text/plain",
  "text/csv",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const UploadSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size should be less than 10MB",
    })
    .refine((file) => ACCEPTED_TYPES.has(file.type), {
      message:
        "File type must be PDF, JPEG, PNG, TXT, or CSV",
    }),
  chatId: z.string().uuid(),
});

async function extractTextFromPdf(buffer: ArrayBuffer): Promise<string> {
  // pdf-parse requires a Buffer — use unknown cast for CJS/ESM interop
  const pdfParseModule = await import("pdf-parse");
  const pdfParse = (
    (pdfParseModule as unknown as { default?: unknown }).default ?? pdfParseModule
  ) as unknown as (buf: Buffer) => Promise<{ text: string }>;
  const nodeBuffer = Buffer.from(buffer);
  const data = await pdfParse(nodeBuffer);
  return data.text;
}

function extractTextFromPlaintext(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(buffer);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError("unauthorized:document").toResponse();
  }

  if (request.body === null) {
    return new ChatSDKError(
      "bad_request:api",
      "Request body is empty."
    ).toResponse();
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob | null;
    const chatId = formData.get("chatId") as string | null;

    if (!file || !chatId) {
      return new ChatSDKError(
        "bad_request:api",
        "Missing file or chatId."
      ).toResponse();
    }

    const validated = UploadSchema.safeParse({ file, chatId });

    if (!validated.success) {
      const errorMessage = validated.error.errors
        .map((e) => e.message)
        .join(", ");
      return new ChatSDKError("bad_request:document", errorMessage).toResponse();
    }

    const chat = await getChatById({ id: chatId });

    if (!chat) {
      return new ChatSDKError("not_found:chat").toResponse();
    }

    if (chat.userId !== session.user.id) {
      return new ChatSDKError("forbidden:document").toResponse();
    }

    const filename = (formData.get("file") as File).name;
    const fileBuffer = await file.arrayBuffer();

    // Extract text content based on file type
    let textContent: string | null = null;

    try {
      if (file.type === "application/pdf") {
        textContent = await extractTextFromPdf(fileBuffer);
      } else if (file.type === "text/plain" || file.type === "text/csv") {
        textContent = extractTextFromPlaintext(fileBuffer);
      }
      // Images (JPEG/PNG) don't have text extraction — they'll be
      // available via their URL for multimodal models
    } catch (extractError) {
      // Text extraction is best-effort; proceed with upload even if it fails
      console.error(
        "[DocumentUpload] Text extraction failed:",
        extractError instanceof Error ? extractError.message : extractError
      );
    }

    // Upload to Vercel Blob
    const blobData = await put(`documents/${chatId}/${filename}`, fileBuffer, {
      access: "public",
    });

    // Save metadata + extracted text to DB
    const doc = await saveChatDocument({
      chatId,
      userId: session.user.id,
      name: filename,
      contentType: file.type,
      url: blobData.url,
      textContent,
    });

    return NextResponse.json({
      id: doc.id,
      name: doc.name,
      contentType: doc.contentType,
      url: doc.url,
      hasTextContent: textContent !== null,
    });
  } catch (error) {
    console.error(
      "[DocumentUpload] Error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}
