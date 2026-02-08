/**
 * Orchestrator Agent — the main coordinator for CareMap AI.
 *
 * Delegates to specialized sub-agents, manages working memory,
 * and streams artifact results to the client.
 *
 * Key capabilities (AI SDK v6):
 *   - prepareStep: Phased execution with context management
 *   - parallelInvestigate: Run 2-4 sub-agents concurrently via Promise.all
 *   - Streaming delegation: Sub-agent output streams to UI via readUIMessageStream
 *   - toModelOutput: Summarizes sub-agent results to keep orchestrator context clean
 *   - Mission planner: Full autonomous workflow with evaluator-optimizer pattern
 */

import {
  readUIMessageStream,
  stepCountIs,
  ToolLoopAgent,
  tool,
  type UIMessageStreamWriter,
} from "ai";
import type { Session } from "next-auth";
import { z } from "zod";
import type { ChatMessage } from "@/lib/types";
import { createCached } from "../cache";
import {
  CAREMAP_MEMORY_TEMPLATE,
  formatWorkingMemory,
  getWorkingMemoryInstructions,
  memoryProvider,
} from "../memory";
import { artifactsPrompt } from "../prompts";
import { getLanguageModel } from "../providers";
import {
  findMedicalDesertsArtifact,
  findNearbyArtifact,
  getAccessibilityMapArtifact,
  getDataQualityMapArtifact,
  getHeatmapArtifact,
  getRegionChoroplethArtifact,
  getStatsArtifact,
  planMissionArtifact,
} from "../tools/artifact-tools";
import { databaseAgent } from "./database-agent";
import { geospatialAgent } from "./geospatial-agent";
import { healthSearchAgent } from "./health-search-agent";
import { medicalReasoningAgent } from "./medical-reasoning-agent";
import { missionPlannerAgent } from "./mission-planner-agent";
import { orchestratorPrompt } from "./prompts";
import { webResearchAgent } from "./web-research-agent";

type OrchestratorConfig = {
  session: Session;
  dataStream: UIMessageStreamWriter<ChatMessage>;
  modelId: string;
  userId?: string;
  chatId?: string;
  documentContext?: string;
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
    async *execute({ task }, { abortSignal }) {
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
 * Creates a parallel investigation tool that runs 2-4 sub-agents
 * concurrently via Promise.all(). This is the key performance feature —
 * complex queries that need database + medical + geo analysis can
 * run all three simultaneously instead of sequentially.
 */
function createParallelInvestigateTool() {
  // Map of agent names to their ToolLoopAgent instances
  const agentMap = {
    database: databaseAgent,
    geospatial: geospatialAgent,
    medical: medicalReasoningAgent,
    web: webResearchAgent,
  } as const;

  type AgentName = keyof typeof agentMap;

  return tool({
    description:
      "Run 2-4 sub-agent investigations simultaneously for complex queries that need multiple perspectives. MUCH faster than calling delegation tools sequentially. Use when a question needs both data analysis AND medical reasoning, or data AND web verification, etc.",
    inputSchema: z.object({
      tasks: z
        .array(
          z.object({
            agent: z
              .enum(["database", "geospatial", "medical", "web"])
              .describe("Which specialized sub-agent to run"),
            task: z
              .string()
              .describe(
                "Detailed task description for this sub-agent. Be specific about what you need."
              ),
          })
        )
        .min(2)
        .max(4)
        .describe(
          "Array of 2-4 tasks to run in parallel, each assigned to a different sub-agent"
        ),
    }),
    execute: async ({ tasks }, { abortSignal }) => {
      const startTime = Date.now();

      const results = await Promise.all(
        tasks.map(async ({ agent, task }) => {
          const agentInstance = agentMap[agent as AgentName];
          try {
            const result = await agentInstance.generate({
              prompt: task,
              abortSignal,
            } as Parameters<typeof agentInstance.generate>[0]);
            return {
              agent,
              task,
              status: "success" as const,
              result: result.text,
              steps: result.steps.length,
            };
          } catch (error) {
            return {
              agent,
              task,
              status: "error" as const,
              result:
                error instanceof Error
                  ? error.message
                  : "Unknown error during investigation",
              steps: 0,
            };
          }
        })
      );

      const duration = Date.now() - startTime;
      console.log(
        `[parallelInvestigate] ${tasks.length} agents completed in ${duration}ms`
      );

      return {
        investigations: results,
        totalDurationMs: duration,
        successCount: results.filter((r) => r.status === "success").length,
        errorCount: results.filter((r) => r.status === "error").length,
      };
    },
  });
}

/**
 * Creates the main orchestrator agent that delegates to specialized subagents.
 * Direct tools (artifacts, weather) stay at orchestrator level.
 * Data/geo/medical/web tasks are delegated to subagents.
 *
 * New in this refactor:
 *   - parallelInvestigate: runs 2-4 sub-agents concurrently
 *   - planVolunteerMission: full autonomous mission planning workflow
 *   - prepareStep: phased execution with context management
 *   - Increased step limit: 15 (from 10) for complex multi-tool workflows
 */
export async function createOrchestratorAgent({
  session: _session,
  dataStream,
  modelId,
  userId,
  chatId,
  documentContext = "",
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

  // Combine orchestrator prompt with artifacts instructions, memory, and document context
  const instructions = `${orchestratorPrompt}\n\n${artifactsPrompt}${memoryContext}${documentContext}`;

  return new ToolLoopAgent({
    model: getLanguageModel(modelId),
    instructions,
    tools: {
      // --- Direct tools (simple or need session/dataStream) ---
      // --- Artifact-enhanced geospatial tools (stream directly to canvas) ---
      findNearby: createCached({ ttl: 30 * 60 * 1000 })(findNearbyArtifact({ dataStream }), {
        ttl: 30 * 60 * 1000,
      }),
      findMedicalDeserts: createCached({ ttl: 60 * 60 * 1000 })(findMedicalDesertsArtifact({ dataStream }), {
        ttl: 60 * 60 * 1000,
      }),
      getStats: createCached({ ttl: 30 * 60 * 1000 })(getStatsArtifact({ dataStream }), {
        ttl: 30 * 60 * 1000,
      }),
      planMission: createCached({ ttl: 30 * 60 * 1000 })(planMissionArtifact({ dataStream }), {
        ttl: 30 * 60 * 1000,
      }),

      // --- New visualization artifact tools ---
      getHeatmap: getHeatmapArtifact({ dataStream }),
      getRegionChoropleth: getRegionChoroplethArtifact({ dataStream }),
      getDataQualityMap: getDataQualityMapArtifact({ dataStream }),
      getAccessibilityMap: getAccessibilityMapArtifact({ dataStream }),

      // --- Parallel investigation tool (runs 2-4 sub-agents concurrently) ---
      parallelInvestigate: createParallelInvestigateTool(),

      // --- Subagent delegation tools (for complex multi-step analysis) ---
      investigateData: createDelegationTool({
        description:
          "Query and analyze healthcare facility data from the database. Use for counts, aggregations, SQL queries, facility lookups, semantic search, data filtering, AND population/demographics/WHO benchmarks for any country (via getDemographics tool). Use for demand analysis, unmet needs, and benchmarking questions.",
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

      // --- Mission planner delegation (full autonomous workflow) ---
      planVolunteerMission: createDelegationTool({
        description:
          "Run a comprehensive volunteer mission planning workflow. This autonomous agent identifies healthcare gaps for the volunteer's specialty, evaluates candidate host facilities, checks plan quality, and iterates until the recommendation meets quality thresholds. Use for detailed 'where should I volunteer?' questions. Much more thorough than the simple planMission tool.",
        agent: missionPlannerAgent,
      }),

      // --- Health search delegation (interactive provider discovery) ---
      searchHealthcare: createDelegationTool({
        description:
          "Find healthcare providers (doctors, hospitals, clinics, specialists) for a user's personal health needs. This agent reads uploaded medical documents, asks clarifying questions (location, specialty, insurance, preferences), searches the web for matching providers, and returns rich provider cards. Use for: 'find me a doctor', 'I need a specialist', 'best hospital for X near Y', or any personal healthcare search question. The agent will ask the user targeted questions before searching to ensure the best results.",
        agent: healthSearchAgent,
      }),

      // --- Memory tool: let the agent update its working memory ---
      updateWorkingMemory: tool({
        description:
          "Save important facts, user preferences, or analysis summaries to persistent memory. Call this when you learn something important about the user that should persist across conversations.",
        inputSchema: z.object({
          content: z
            .string()
            .describe(
              "Updated working memory content in markdown format. Include all existing facts plus any new information."
            ),
        }),
        execute: async ({ content }) => {
          if (!userId) {
            return { success: false, reason: "No user context" };
          }
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
    stopWhen: stepCountIs(15),

    // --- Phased execution control ---
    prepareStep: ({ stepNumber, messages }) => {
      // Phase 3 (steps 10+): Synthesis — nudge toward completion
      // Only keep memory tool so the agent writes a final response
      if (stepNumber >= 10) {
        return {
          activeTools: ["updateWorkingMemory"],
        };
      }

      // Context management: trim older messages for long conversations
      // Keep the system context (first message) and recent messages
      if (messages.length > 25) {
        return {
          messages: [messages[0], ...messages.slice(-15)],
        };
      }

      // Deployment pipeline guard: detect deployment/volunteer intent
      // and keep artifact tools available (prevent premature delegation)
      if (stepNumber <= 4) {
        const userMessages = messages.filter((m) => m.role === "user");
        const lastUserMsg = userMessages.at(-1);
        const userText =
          lastUserMsg?.content
            ?.toString().toLowerCase() ?? "";

        const isDeploymentQuery =
          /\b(where\s+should\s+we\s+send|where\s+should\s+.+volunteer|deploy|send\s+.+surgeon|send\s+.+doctor|send\s+.+specialist|where\s+should\s+i\s+(go|volunteer))\b/.test(
            userText
          );

        if (isDeploymentQuery) {
          // For deployment queries, prioritise direct artifact tools
          // over delegation tools during the first few steps
          return {
            activeTools: [
              "findMedicalDeserts",
              "planMission",
              "findNearby",
              "getStats",
              "getHeatmap",
              "getRegionChoropleth",
              "getAccessibilityMap",
              "getDataQualityMap",
              "investigateData",
              "updateWorkingMemory",
            ],
          };
        }
      }

      // Phase 1-2 (steps 0-9): All tools available
      return {};
    },

    // --- Step tracking for debugging ---
    onStepFinish: ({ usage, finishReason, toolCalls }) => {
      const toolNames =
        toolCalls?.map((tc) => tc.toolName).join(", ") ?? "none";
      console.log(
        `[Orchestrator] Step finished | reason=${finishReason} | tools=[${toolNames}] | tokens=${usage?.totalTokens ?? "?"}`
      );
    },
  });
}
