import Link from "next/link";

export function CTASection() {
  return (
    <section className="w-full border-t border-border py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-10 text-center md:p-16">
          <h2 className="text-balance text-3xl font-medium tracking-tighter text-primary md:text-4xl">
            Start exploring Ghana&apos;s healthcare data
          </h2>
          <p className="max-w-lg text-balance font-medium text-muted-foreground">
            Ask your first question and see Meridian&apos;s multi-agent system
            in action — no account required.
          </p>
          <Link
            className="flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
            href="/chat"
          >
            Try Meridian
          </Link>
        </div>
      </div>
    </section>
  );
}
