import {
  Activity,
  AlertTriangle,
  Globe,
  MapPin,
  Search,
  Stethoscope,
} from "lucide-react";

const FEATURES = [
  {
    icon: Search,
    title: "Intelligent Facility Search",
    description:
      "Query 987 healthcare facilities across Ghana using natural language. Semantic search understands context — find clinics by specialty, procedure, equipment, or capability.",
  },
  {
    icon: MapPin,
    title: "Medical Desert Detection",
    description:
      "Identify geographic gaps where critical healthcare services are absent. Visualize coverage cold spots and quantify population impact for resource allocation.",
  },
  {
    icon: Stethoscope,
    title: "Volunteer Mission Planning",
    description:
      "Plan deployment missions for volunteer doctors. Input your specialty and availability to get ranked location recommendations with reasoning.",
  },
  {
    icon: Globe,
    title: "Interactive 3D Globe",
    description:
      "Explore facility data on an interactive deck.gl globe with fly-to transitions, color-coded markers, and real-time query result highlighting.",
  },
  {
    icon: AlertTriangle,
    title: "Anomaly Detection",
    description:
      "Detect suspicious facility claims — find clinics reporting unrealistic procedures for their infrastructure, and cross-validate equipment against capabilities.",
  },
  {
    icon: Activity,
    title: "Multi-Agent Analysis",
    description:
      "Four specialized AI sub-agents collaborate on your queries: database, geospatial, medical reasoning, and web research — orchestrated seamlessly.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="w-full border-t border-border py-16 md:py-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto mb-12 max-w-xl text-center md:mb-16">
          <h2 className="text-balance text-3xl font-medium tracking-tighter text-primary md:text-4xl">
            Built for healthcare intelligence
          </h2>
          <p className="mt-3 text-balance font-medium text-muted-foreground">
            Purpose-built tools to help NGO coordinators, volunteer doctors, and
            healthcare planners understand Ghana&apos;s medical infrastructure.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-primary">
                {feature.title}
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
