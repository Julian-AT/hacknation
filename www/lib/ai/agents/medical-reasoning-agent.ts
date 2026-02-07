import { ToolLoopAgent, stepCountIs } from "ai";
import { getLanguageModel } from "../providers";
import { detectAnomalies } from "../tools/detectAnomalies";
import { crossValidateClaims } from "../tools/medical/crossValidateClaims";
import { classifyServices } from "../tools/medical/classifyServices";
import { medicalReasoningAgentPrompt } from "./prompts";

/**
 * Medical Reasoning Agent — validates data, detects anomalies, classifies services.
 * Tools: detectAnomalies, crossValidateClaims, classifyServices
 */
export const medicalReasoningAgent = new ToolLoopAgent({
  model: getLanguageModel("google/gemini-2.5-flash-lite"),
  instructions: medicalReasoningAgentPrompt,
  tools: {
    detectAnomalies,
    crossValidateClaims,
    classifyServices,
  },
  stopWhen: stepCountIs(6),
});
