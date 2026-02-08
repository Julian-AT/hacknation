import { motion } from "framer-motion";
import { MeridianLogo } from "./icons";

export const Greeting = () => {
  return (
    <div
      className="mx-auto mt-4 flex size-full max-w-4xl flex-col justify-center px-4 md:mt-16 md:px-8"
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
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="font-semibold text-xl md:text-2xl"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
      >
        Welcome to Meridian
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-base text-zinc-500 md:text-lg"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
      >
        Meridian is an AI assistant for advanced healthcare data analytics. Analyze facility-level attributes, orchestrate mission strategies, identify critical service gaps, and extract actionable intelligence.
      </motion.div>
    </div>
  );
};
