"use client";

import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Globe,
  Heart,
  MapPin,
  Search,
  Stethoscope,
} from "lucide-react";
import type { ReactNode } from "react";
import { useChatActions } from "@/lib/chat-actions-context";
import { MeridianLogo } from "./icons";

const SUGGESTED_QUERIES: { icon: ReactNode; label: string; query: string }[] = [
  {
    icon: <BarChart3 className="size-3.5 shrink-0" />,
    label: "Hospitals with cardiology",
    query: "How many hospitals offer cardiology in Ghana and Kenya?",
  },
  {
    icon: <Search className="size-3.5 shrink-0" />,
    label: "Cataract surgery near Tamale",
    query: "Clinics near Tamale, Ghana that do cataract surgery",
  },
  {
    icon: <MapPin className="size-3.5 shrink-0" />,
    label: "Medical deserts for emergency surgery",
    query: "Largest medical deserts for emergency surgery in Nigeria",
  },
  {
    icon: <AlertTriangle className="size-3.5 shrink-0" />,
    label: "Detect suspicious facility claims",
    query: "Facilities in Uganda with unrealistic procedure claims for their size",
  },
  {
    icon: <Stethoscope className="size-3.5 shrink-0" />,
    label: "Compare regions in Ghana",
    query: "Compare healthcare capacity across regions in Ghana",
  },
  {
    icon: <Activity className="size-3.5 shrink-0" />,
    label: "Plan a volunteer mission",
    query: "Plan a volunteer ophthalmology mission in Tanzania",
  },
  {
    icon: <Globe className="size-3.5 shrink-0" />,
    label: "Compare Austria with the US",
    query: "Compare healthcare access between Austria and the US",
  },
  {
    icon: <Heart className="size-3.5 shrink-0" />,
    label: "Maternal care gaps",
    query: "Maternal care deserts in Ethiopia and where to place new clinics",
  },
];

export const Greeting = () => {
  const { sendMessage } = useChatActions();

  const handleSuggestion = (query: string) => {
    if (sendMessage) {
      sendMessage({
        role: "user" as const,
        parts: [{ type: "text" as const, text: query }],
      });
    }
  };

  return (
    <div
      className="mx-auto mt-4 flex size-full max-w-4xl flex-col justify-center px-4 md:mt-32 md:px-8"
      key="overview"
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 text-muted-foreground"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.4 }}
      >
        <MeridianLogo size={36} />
      </motion.div>
      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className="text-balance font-semibold text-xl md:text-2xl"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
      >
        Welcome to Meridian
      </motion.h1>
      <motion.p
        animate={{ opacity: 1, y: 0 }}
        className="text-pretty text-base text-muted-foreground md:text-lg"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
      >
        Meridian is an AI assistant for advanced healthcare data analytics. Analyze facility-level attributes, orchestrate mission strategies, identify critical service gaps, and extract actionable intelligence.
      </motion.p>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 flex flex-wrap gap-2"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.7 }}
      >
        {SUGGESTED_QUERIES.map((suggestion) => (
          <button
            className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-foreground/20 hover:bg-muted hover:text-foreground"
            key={suggestion.label}
            onClick={() => handleSuggestion(suggestion.query)}
            type="button"
          >
            {suggestion.icon}
            <span>{suggestion.label}</span>
          </button>
        ))}
      </motion.div>
    </div>
  );
};
