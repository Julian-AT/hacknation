import { Cpu, FileText, MapIcon, MessageSquare } from "lucide-react";

const STEPS = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Ask a question",
    description:
      'Type a natural language question like "Which regions lack emergency surgery?" or "Plan a volunteer mission for a cardiologist."',
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI agents collaborate",
    description:
      "The orchestrator delegates to specialized sub-agents — database, geospatial, medical reasoning, and web research — to gather comprehensive answers.",
  },
  {
    icon: MapIcon,
    step: "03",
    title: "See it on the map",
    description:
      "Results appear on an interactive 3D globe with color-coded facility markers, desert zones, and fly-to transitions to relevant locations.",
  },
  {
    icon: FileText,
    step: "04",
    title: "Get actionable insights",
    description:
      "Receive structured reports with citations, statistics, and mission plans — ready for decision-making and resource allocation.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      className="w-full border-t border-border py-16 md:py-24"
      id="how-it-works"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto mb-12 max-w-xl text-center md:mb-16">
          <h2 className="text-balance text-3xl font-medium tracking-tighter text-primary md:text-4xl">
            How Meridian works
          </h2>
          <p className="mt-3 text-balance font-medium text-muted-foreground">
            From natural language to actionable healthcare intelligence in
            seconds.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div className="flex flex-col gap-4" key={step.step}>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="size-5" />
                </div>
                <span className="text-xs font-semibold tracking-widest text-muted-foreground">
                  STEP {step.step}
                </span>
              </div>
              <h3 className="text-base font-semibold text-primary">
                {step.title}
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
