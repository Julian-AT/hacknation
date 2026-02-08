"use client";

import { CheckIcon, MessageCircleQuestionIcon, SendIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useChatActions } from "@/lib/chat-actions-context";

interface ClarifyingQuestionCardProps {
  args: Record<string, unknown>;
  result: Record<string, unknown>;
}

export function ClarifyingQuestionCard({
  result,
}: ClarifyingQuestionCardProps) {
  const question = result.question as string;
  const options = result.options as { label: string; value: string }[];
  const allowCustomInput = (result.allowCustomInput as boolean) ?? true;
  const context = result.context as string | undefined;
  const { sendMessage } = useChatActions();

  const [selected, setSelected] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = useCallback(
    (value: string) => {
      if (selected) {
        return; // Already answered
      }
      setSelected(value);

      sendMessage?.({
        role: "user",
        parts: [{ type: "text", text: value }],
      });
    },
    [selected, sendMessage]
  );

  const handleCustomSubmit = useCallback(() => {
    const trimmed = customValue.trim();
    if (!trimmed || selected) {
      return;
    }
    setSelected(trimmed);

    sendMessage?.({
      role: "user",
      parts: [{ type: "text", text: trimmed }],
    });
  }, [customValue, selected, sendMessage]);

  const isAnswered = selected !== null;

  return (
    <div className="my-2 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
      {/* Question header */}
      <div className="flex items-start gap-2 px-3 py-3">
        <MessageCircleQuestionIcon className="mt-0.5 size-4 shrink-0 text-blue-400" />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">
            {question}
          </span>
          {context && (
            <span className="text-[11px] text-muted-foreground">
              {context}
            </span>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-1.5 border-t border-border px-3 py-2.5">
        {options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <button
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                isSelected
                  ? "border-blue-500/50 bg-blue-950/40 text-blue-400"
                  : isAnswered
                    ? "cursor-default border-border bg-muted/30 text-muted-foreground/50"
                    : "border-border bg-background text-foreground hover:border-blue-500/30 hover:bg-blue-950/20 hover:text-blue-400"
              }`}
              disabled={isAnswered}
              key={option.value}
              onClick={() => handleSelect(option.value)}
              type="button"
            >
              {isSelected && <CheckIcon className="mr-1 inline size-3" />}
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Custom input */}
      {allowCustomInput && !isAnswered && (
        <div className="flex items-center gap-2 border-t border-border px-3 py-2">
          <input
            className="flex-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-blue-500/50 focus:outline-none"
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCustomSubmit();
              }
            }}
            placeholder="Or type your own answer..."
            ref={inputRef}
            type="text"
            value={customValue}
          />
          <button
            aria-label="Send custom answer"
            className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            disabled={!customValue.trim()}
            onClick={handleCustomSubmit}
            type="button"
          >
            <SendIcon className="size-3.5" />
          </button>
        </div>
      )}

      {/* Answered state */}
      {isAnswered && (
        <div className="border-t border-border bg-green-950/10 px-3 py-1.5">
          <span className="text-[11px] text-green-400">
            <CheckIcon className="mr-1 inline size-3" />
            Answered: {selected}
          </span>
        </div>
      )}
    </div>
  );
}
