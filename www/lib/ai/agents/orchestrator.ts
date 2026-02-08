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
import { getWeather } from "../tools/get-weather";
import {
  findNearbyArtifact,
  findMedicalDesertsArtifact,
  getStatsArtifact,
  planMissionArtifact,
} from "../tools/artifact-tools";
import { cached } from "../cache";
import {
  memoryProvider,
  CAREMAP_MEMORY_TEMPLATE,
  formatWorkingMemory,
  getWorkingMemoryInstructions,
} from "../memory";
import { databaseAgent } from "./database-agent";
import { geospatialAgent } from "./geospatial-agent";
import { medicalReasoningAgent } from "./medical-reasoning-agent";
import { orchestratorPrompt } from "./prompts";
import { webResearchAgent } from "./web-research-agent";

type OrchestratorConfig = {
  session: Session;
  dataStream: UIMessageStreamWriter<ChatMessage>;
  modelId: string;
  userId?: string;
  chatId?: string;
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
 *
 * Artifact-enhanced geospatial tools are also available directly so map data
 * streams to the client canvas without going through the delegation layer.
 */
export async function createOrchestratorAgent({
  session,
  dataStream,
  modelId,
  userId,
  chatId,
}: OrchestratorConfig) {
  // Load working memory for this user
  let memoryContext = "";
  if (userId) {
    try {
      const wm = await memoryProvider.getWorkingMemory({
        userId,
        scope: "user",
      });
      if (wm) {
        memoryContext = `\n\n## Working Memory (persistent context about this user)\n${formatWorkingMemory(wm)}\n\n${getWorkingMemoryInstructions(CAREMAP_MEMORY_TEMPLATE)}`;
      }
    } catch (e) {
      // Memory loading is best-effort
      console.error("[Orchestrator] Failed to load working memory:", e);
    }
  }

  // Combine orchestrator prompt with artifacts instructions and memory
  const instructions = `${orchestratorPrompt}\n\n${artifactsPrompt}${memoryContext}`;

  return new ToolLoopAgent({
    model: getLanguageModel(modelId),
    instructions,
    tools: {
      // --- Direct tools (simple or need session/dataStream) ---
      getWeather,

      // --- Artifact-enhanced geospatial tools (stream directly to canvas) ---
      findNearby: cached(findNearbyArtifact({ dataStream }), { ttl: 30 * 60 * 1000 }),
      findMedicalDeserts: cached(findMedicalDesertsArtifact({ dataStream }), { ttl: 60 * 60 * 1000 }),
      getStats: cached(getStatsArtifact({ dataStream }), { ttl: 30 * 60 * 1000 }),
      planMission: planMissionArtifact({ dataStream }),

      // --- Subagent delegation tools (for complex multi-step analysis) ---
      investigateData: createDelegationTool({
        description:
          "Query and analyze healthcare facility data from the database. Use for counts, aggregations, SQL queries, facility lookups, semantic search, data filtering, AND Ghana population/demographics/WHO benchmarks (via getDemographics tool). Use for demand analysis, unmet needs, and benchmarking questions.",
        agent: databaseAgent,
      }),

      analyzeGeography: createDelegationTool({
        description:
          "Perform complex multi-step geographic analysis that requires chaining multiple tools. For simple proximity searches or desert detection, prefer the direct findNearby / findMedicalDeserts tools instead.",
        agent: geospatialAgent,
      }),

      medicalReasoning: createDelegationTool({
        description:
          "Apply medical expertise to validate facility data. Use for: cross-validating procedure claims against equipment (60+ mappings), detecting anomalies (infrastructure mismatches, ratio checks, subspecialty-size mismatches, procedure breadth), classifying service types (permanent vs itinerant vs referral), detecting individual-tied services, surgical camp evidence, weak operational signals, and deep text evidence analysis (temporary equipment, equipment age, NGO substitution).",
        agent: medicalReasoningAgent,
      }),

      researchWeb: createDelegationTool({
        description:
          "Search the web for real-time external data and verify facility claims. Use for WHO statistics, GHS reports, disease prevalence, healthcare workforce data, government policies, multi-source claim corroboration (verifying facility claims across independent web sources), and website quality assessment.",
        agent: webResearchAgent,
      }),

      // --- Memory tool: let the agent update its working memory ---
      updateWorkingMemory: tool({
        description:
          "Save important facts, user preferences, or analysis summaries to persistent memory. Call this when you learn something important about the user that should persist across conversations.",
        inputSchema: z.object({
          content: z
            .string()
            .describe(
              "Updated working memory content in markdown format. Include all existing facts plus any new information.",
            ),
        }),
        execute: async ({ content }) => {
          if (!userId) return { success: false, reason: "No user context" };
          try {
            await memoryProvider.updateWorkingMemory({
              userId,
              chatId,
              scope: "user",
              content,
            });
            return { success: true };
          } catch (e) {
            console.error("[Memory] Failed to update:", e);
            return { success: false, reason: "Storage error" };
          }
        },
      }),
    },
    stopWhen: stepCountIs(10),
  });
}
