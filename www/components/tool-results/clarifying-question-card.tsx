"use client";

import { CheckIcon, MessageCircleQuestionIcon, SendIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
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
        return;
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
    <Card className="my-2 w-full overflow-hidden bg-muted/50">
      <CardHeader className="flex-row items-start gap-2 space-y-0 px-3 py-3">
        <MessageCircleQuestionIcon className="mt-0.5 size-4 shrink-0 text-blue-400" />
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-balance text-sm font-medium text-foreground">
            {question}
          </span>
          {context && (
            <span className="text-pretty text-[11px] text-muted-foreground">
              {context}
            </span>
          )}
        </div>
      </CardHeader>

      <Separator />
      <CardContent className="flex flex-wrap gap-1.5 px-3 py-2.5">
        {options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <Button
              className={cn(
                "h-auto px-3 py-1.5 text-xs",
                isSelected &&
                  "border-blue-500/50 bg-blue-500/10 text-blue-400",
                isAnswered &&
                  !isSelected &&
                  "opacity-50"
              )}
              disabled={isAnswered}
              key={option.value}
              onClick={() => handleSelect(option.value)}
              size="sm"
              type="button"
              variant="outline"
            >
              {isSelected && <CheckIcon className="mr-1 size-3" />}
              {option.label}
            </Button>
          );
        })}
      </CardContent>

      {allowCustomInput && !isAnswered && (
        <>
          <Separator />
          <CardContent className="flex items-center gap-2 px-3 py-2">
            <Input
              className="h-8 flex-1 text-xs"
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
            <Button
              aria-label="Send custom answer"
              className="size-8"
              disabled={!customValue.trim()}
              onClick={handleCustomSubmit}
              size="icon"
              type="button"
            >
              <SendIcon className="size-3.5" />
            </Button>
          </CardContent>
        </>
      )}

      {isAnswered && (
        <>
          <Separator />
          <CardContent className="bg-green-500/5 px-3 py-1.5">
            <Badge
              className="gap-1 border-green-500/20 bg-green-500/10 text-[11px] text-green-400"
              variant="outline"
            >
              <CheckIcon className="size-3" />
              Answered: {selected}
            </Badge>
          </CardContent>
        </>
      )}
    </Card>
  );
}
