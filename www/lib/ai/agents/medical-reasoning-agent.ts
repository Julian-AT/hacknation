import { ToolLoopAgent, stepCountIs } from "ai";
import { getLanguageModel } from "../providers";
import { detectAnomalies } from "../tools/detectAnomalies";
import { crossValidateClaims } from "../tools/medical/crossValidateClaims";
import { classifyServices } from "../tools/medical/classifyServices";
import { validateEnrichment } from "../tools/medical/validateEnrichment";
import { analyzeTextEvidence } from "../tools/medical/analyzeTextEvidence";
import { medicalReasoningAgentPrompt } from "./prompts";

/**
 * Medical Reasoning Agent — validates data, detects anomalies, classifies services.
 * Tools: detectAnomalies, crossValidateClaims, classifyServices, validateEnrichment, analyzeTextEvidence
 *
 * Phased execution via prepareStep:
 *   Phase 1 (0-1): Detection — detectAnomalies, crossValidateClaims
 *   Phase 2 (2-4): Deep validation — classifyServices, analyzeTextEvidence, validateEnrichment
 *   Phase 3 (5+):  Confidence scoring & synthesis — no tools, generate final assessment
 */
export const medicalReasoningAgent = new ToolLoopAgent({
  model: getLanguageModel("google/gemini-2.5-flash-lite"),
  instructions: medicalReasoningAgentPrompt,
  tools: {
    detectAnomalies,
    crossValidateClaims,
    classifyServices,
    validateEnrichment,
    analyzeTextEvidence,
  },
  stopWhen: stepCountIs(8),
  prepareStep: async ({ stepNumber }) => {
    // Phase 1 (steps 0-1): Detection
    if (stepNumber <= 1) {
      return {
        activeTools: ["detectAnomalies", "crossValidateClaims"],
      };
    }

    // Phase 2 (steps 2-4): Deep validation
    if (stepNumber <= 4) {
      return {
        activeTools: [
          "classifyServices",
          "analyzeTextEvidence",
          "validateEnrichment",
          "crossValidateClaims",
        ],
      };
    }

    // Phase 3 (steps 5+): Synthesis — no tools, generate final assessment
    return {
      activeTools: [],
    };
  },
});
