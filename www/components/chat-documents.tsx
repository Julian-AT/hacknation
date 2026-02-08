"use client";

import { FileTextIcon, XIcon } from "lucide-react";
import { useCallback } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import type { ChatDocument } from "@/lib/db/schema";
import { fetcher } from "@/lib/utils";

function getDocIcon(contentType: string) {
  if (contentType === "application/pdf") {
    return "PDF";
  }
  if (contentType === "text/csv") {
    return "CSV";
  }
  if (contentType === "text/plain") {
    return "TXT";
  }
  if (contentType.startsWith("image/")) {
    return "IMG";
  }
  return "DOC";
}

export function ChatDocuments({ chatId }: { chatId: string }) {
  const { data: documents, mutate } = useSWR<ChatDocument[]>(
    chatId ? `/api/documents?chatId=${chatId}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const handleRemove = useCallback(
    async (docId: string) => {
      try {
        const response = await fetch(`/api/documents?id=${docId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          mutate();
        } else {
          toast.error("Failed to remove document");
        }
      } catch (_error) {
        toast.error("Failed to remove document");
      }
    },
    [mutate]
  );

  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5 px-1">
      {documents.map((doc) => (
        <div
          className="group flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 py-1 text-xs text-muted-foreground"
          key={doc.id}
        >
          <FileTextIcon className="size-3 shrink-0" />
          <span className="max-w-[120px] truncate">{doc.name}</span>
          <span className="rounded bg-muted px-1 text-[10px] font-medium uppercase">
            {getDocIcon(doc.contentType)}
          </span>
          <button
            aria-label={`Remove ${doc.name}`}
            className="ml-0.5 rounded-sm p-0.5 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
            onClick={() => handleRemove(doc.id)}
            type="button"
          >
            <XIcon className="size-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
