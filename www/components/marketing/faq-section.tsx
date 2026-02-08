"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    question: "What is Meridian?",
    answer:
      "Meridian is an AI-powered healthcare intelligence platform built for the Virtue Foundation. It helps NGO coordinators, volunteer doctors, and healthcare planners understand Ghana's medical infrastructure by analyzing data from 987 healthcare facilities using natural language queries.",
  },
  {
    question: "What kind of questions can I ask?",
    answer:
      'You can ask about facility capabilities ("How many hospitals offer cardiology?"), geographic coverage ("Where are medical deserts for emergency surgery?"), data quality ("Which facilities claim unrealistic procedures?"), volunteer planning ("Plan a mission for an ophthalmologist"), and more. Meridian covers all 15 must-have evaluation questions from the challenge brief.',
  },
  {
    question: "How does the multi-agent system work?",
    answer:
      "Meridian uses an orchestrator agent that coordinates four specialized sub-agents: a database agent for structured queries, a geospatial agent for location-based analysis, a medical reasoning agent for anomaly detection and validation, and a web research agent for real-time data. They collaborate automatically based on your question.",
  },
  {
    question: "What data does Meridian use?",
    answer:
      "Meridian analyzes 987 healthcare facilities across Ghana including hospitals, clinics, and pharmacies. The data covers specialties, procedures, equipment, capacity, staffing, and geographic coordinates. Semantic search via pgvector embeddings enables natural language queries over unstructured facility descriptions.",
  },
  {
    question: "Can I visualize the results on a map?",
    answer:
      "Yes — Meridian features an interactive 3D globe built with deck.gl and MapLibre. Query results are displayed as color-coded markers with fly-to transitions, hover tooltips, and highlighted selections. Medical desert zones are rendered as distinct overlay regions.",
  },
  {
    question: "Is Meridian free to use?",
    answer:
      "Meridian supports guest access with rate limits (20 queries per day) and registered users get extended limits (50 queries per day). No credit card is required to start exploring the data.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="w-full border-t border-border py-16 md:py-24"
    >
      <div className="mx-auto max-w-3xl px-6">
        <div className="mx-auto mb-12 max-w-xl text-center md:mb-16">
          <h2 className="text-balance text-3xl font-medium tracking-tighter text-primary md:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-balance font-medium text-muted-foreground">
            Everything you need to know about Meridian and its capabilities.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={item.question}
              className="rounded-lg border border-border bg-card"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="pr-4 text-sm font-medium text-primary">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    openIndex === index && "rotate-180",
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-200",
                  openIndex === index
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
