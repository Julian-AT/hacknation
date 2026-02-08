import { tool } from "ai";
import { z } from "zod";

/**
 * A pass-through tool that lets the agent ask the user a structured
 * clarifying question with predefined options. The UI renders this as
 * an interactive card with clickable buttons.
 *
 * The agent calls this tool, the result is the same structured data,
 * and the ClarifyingQuestionCard component renders it with options
 * the user can click to respond.
 */
export const askClarifyingQuestion = tool({
  description:
    "Ask the user a clarifying question with predefined options to refine a healthcare search. The user can click an option or type a custom answer. Use this to gather information like location, distance preference, specialty needs, insurance requirements, or scheduling preferences before searching for providers.",
  inputSchema: z.object({
    question: z
      .string()
      .describe("The question to ask the user"),
    options: z
      .array(
        z.object({
          label: z.string().describe("Display text for the option"),
          value: z.string().describe("Value sent back when selected"),
        })
      )
      .min(2)
      .max(6)
      .describe("Predefined answer options for the user to choose from"),
    allowCustomInput: z
      .boolean()
      .default(true)
      .describe("Whether to show a text input for custom answers"),
    context: z
      .string()
      .optional()
      .describe(
        "Brief explanation of why you are asking this question, shown as secondary text"
      ),
  }),
  execute: async (input) => {
    // Pass-through: return the input as the result so the UI can render it
    return input;
  },
});
