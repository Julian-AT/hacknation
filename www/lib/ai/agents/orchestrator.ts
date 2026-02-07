import {
  ToolLoopAgent,
  readUIMessageStream,
  stepCountIs,
  tool,
  type UIMessageStreamWriter,
} from "ai";
import type { Session } from "next-auth";
import { z } from "zod";
import type { ChatMessage } from "@/lib/types";
import { artifactsPrompt } from "../prompts";
import { getLanguageModel } from "../providers";
import { createDocument } from "../tools/create-document";
import { getWeather } from "../tools/get-weather";
import { requestSuggestions } from "../tools/request-suggestions";
import { updateDocument } from "../tools/update-document";
import { databaseAgent } from "./database-agent";
import { geospatialAgent } from "./geospatial-agent";
import { medicalReasoningAgent } from "./medical-reasoning-agent";
import { orchestratorPrompt } from "./prompts";
import { webResearchAgent } from "./web-research-agent";

type OrchestratorConfig = {
  session: Session;
  dataStream: UIMessageStreamWriter<ChatMessage>;
  modelId: string;
};

/**
 * Helper to create a delegation tool that streams a subagent's output
 * back to the orchestrator as preliminary results, then summarizes
 * the final output for the orchestrator's context via toModelOutput.
 */
function createDelegationTool({
  description,
  agent,
}: {
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  agent: ToolLoopAgent<any, any, any>;
}) {
  return tool({
    description,
    inputSchema: z.object({
      task: z
        .string()
        .describe(
          "A detailed description of the task for the specialized agent to perform."
        ),
    }),
    execute: async function* ({ task }, { abortSignal }) {
      const result = await agent.stream(
        // Use the prompt + abortSignal pattern for subagent streaming
        { prompt: task, abortSignal } as Parameters<typeof agent.stream>[0]
      );

      for await (const message of readUIMessageStream({
        stream: result.toUIMessageStream(),
      })) {
        yield message;
      }
    },
    toModelOutput: ({ output }) => {
      // Summarize the subagent's final text output for the orchestrator's context
      if (!output?.parts) {
        return { type: "text" as const, value: "No results from subagent." };
      }
      const textParts = output.parts.filter(
        (p: { type: string }) => p.type === "text"
      );
      const lastText = textParts.at(-1);
      const value =
        lastText && "text" in lastText
          ? (lastText.text as string)
          : "Subagent completed but produced no text output.";
      return { type: "text" as const, value };
    },
  });
}

/**
 * Creates the main orchestrator agent that delegates to specialized subagents.
 * Direct tools (artifacts, weather) stay at orchestrator level.
 * Data/geo/medical/web tasks are delegated to subagents.
 */
export function createOrchestratorAgent({
  session,
  dataStream,
  modelId,
}: OrchestratorConfig) {
  // Combine orchestrator prompt with artifacts instructions
  const instructions = `${orchestratorPrompt}\n\n${artifactsPrompt}`;

  return new ToolLoopAgent({
    model: getLanguageModel(modelId),
    instructions,
    tools: {
      // --- Direct tools (need session/dataStream or are simple) ---
      getWeather,
      createDocument: createDocument({ session, dataStream }),
      updateDocument: updateDocument({ session, dataStream }),
      requestSuggestions: requestSuggestions({ session, dataStream }),

      // --- Subagent delegation tools ---
      investigateData: createDelegationTool({
        description:
          "Query and analyze healthcare facility data from the database. Use for counts, aggregations, SQL queries, facility lookups, semantic search, and data filtering.",
        agent: databaseAgent,
      }),

      analyzeGeography: createDelegationTool({
        description:
          "Analyze geographic distribution and accessibility of healthcare facilities. Use for finding nearby facilities, identifying medical deserts, comparing regions, and planning volunteer missions.",
        agent: geospatialAgent,
      }),

      medicalReasoning: createDelegationTool({
        description:
          "Apply medical expertise to validate facility data. Use for cross-validating claims against equipment/infrastructure, detecting anomalies, and classifying service types (permanent vs itinerant vs referral).",
        agent: medicalReasoningAgent,
      }),

      researchWeb: createDelegationTool({
        description:
          "Search the web for real-time external data. Use for WHO statistics, GHS reports, disease prevalence, healthcare workforce data, government policies, and any information not in the database.",
        agent: webResearchAgent,
      }),
    },
    stopWhen: stepCountIs(15),
  });
}
