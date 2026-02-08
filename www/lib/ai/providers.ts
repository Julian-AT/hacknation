import { gateway, wrapLanguageModel } from "ai";
import { devToolsMiddleware } from "@ai-sdk/devtools";
import { chatModels } from "./models";
import { google } from "@ai-sdk/google";  
import { openai } from "@ai-sdk/openai";

const isDevMode = process.env.NODE_ENV === "development";

/**
 * Validates that a model ID exists in the allowed models list.
 * Falls back to gateway resolution if the model ID format is valid (provider/model).
 */
function isAllowedModel(modelId: string): boolean {
  if (chatModels.some((m) => m.id === modelId)) {
    return true;
  }
  // Allow any provider/model format as a fallback for gateway routing
  return /^[a-z0-9-]+\/[a-z0-9._-]+$/i.test(modelId);
}

/**
 * Resolves a model ID to a language model instance via the Vercel AI Gateway.
 * Wraps with DevTools middleware in development for debugging.
 */
export function getLanguageModel(modelId: string) {
  if (!modelId || !isAllowedModel(modelId)) {
    throw new Error(
      `Invalid or disallowed model ID: "${modelId}". Check your model configuration.`
    );
  }

  // const model = gateway(modelId);
  const model = openai('gpt-5-mini')

  if (isDevMode) {
    return wrapLanguageModel({ model, middleware: devToolsMiddleware() });
  }

  return model;
}

/**
 * Model used for generating chat titles. Uses a fast, cheap model.
 */
export function getTitleModel() {
  return openai('gpt-5-nano');
}

/**
 * Model used for artifact generation and suggestion requests.
 */
export function getArtifactModel() {
  return openai('gpt-5-mini');
}
