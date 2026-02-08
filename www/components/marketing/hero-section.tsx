"use client";

import { MeridianLogo } from "@/components/icons";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SUGGESTED_PROMPTS = [
  "How many hospitals offer cardiology in Ghana?",
  "Find clinics near Tamale that perform cataract surgery",
  "Where are the largest medical deserts for emergency surgery?",
  "Plan a volunteer mission for an ophthalmologist",
];

export function HeroSection() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (value?: string) => {
    const text = value ?? prompt;
    if (!text.trim()) return;
    router.push(`/chat?query=${encodeURIComponent(text.trim())}`);
  };

  return (
    <section id="hero" className="relative w-full">
      <div className="absolute inset-0">
        <div className="absolute inset-0 -z-10 h-[700px] w-full rounded-b-xl [background:radial-gradient(125%_125%_at_50%_10%,var(--background)_40%,var(--primary)_180%)] md:h-[800px]" />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-3xl flex-col items-center gap-8 px-6 pt-28 md:pt-36">
        <div className="flex items-center gap-2 rounded-full border border-border bg-accent px-3 py-1 text-sm text-muted-foreground">
          <MeridianLogo size={16} />
          <span>AI-powered healthcare intelligence</span>
        </div>

        <div className="flex flex-col items-center justify-center gap-5">
          <h1 className="text-balance text-center text-3xl font-medium tracking-tighter text-primary md:text-4xl lg:text-5xl xl:text-6xl">
            Map Ghana&apos;s healthcare landscape with AI
          </h1>
          <p className="text-balance text-center text-base font-medium leading-relaxed tracking-tight text-muted-foreground md:text-lg">
            Analyze 987 healthcare facilities, detect medical deserts, plan
            volunteer missions, and uncover data insights — all through natural
            language.
          </p>
        </div>

        <div className="w-full max-w-2xl">
          <div className="group relative rounded-xl border border-border bg-background shadow-sm transition-shadow focus-within:border-primary/30 focus-within:shadow-md">
            <textarea
              className="w-full resize-none rounded-xl bg-transparent px-4 pb-12 pt-4 text-sm text-primary outline-none placeholder:text-muted-foreground/60 md:text-base"
              placeholder="Ask about healthcare facilities in Ghana..."
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <div className="absolute bottom-3 right-3">
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!prompt.trim()}
                className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-40 disabled:hover:bg-primary"
                aria-label="Send prompt"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SUGGESTED_PROMPTS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSubmit(suggestion)}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/20 hover:bg-muted hover:text-foreground"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
