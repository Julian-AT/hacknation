import { devToolsMiddleware } from "@ai-sdk/devtools";
import { gateway } from "@ai-sdk/gateway";
import { wrapLanguageModel } from "ai";
import { chatModels } from "./models";

const isDevMode = process.env.NODE_ENV === "development";

/**
 * Fallback model used for titles, artifacts, and when no model is specified.
 * All routing goes through Vercel AI Gateway using the "provider/model" format.
 * BYOK credentials are configured in the Vercel dashboard under AI Gateway > BYOK.
 */
const FALLBACK_MODEL = "google/gemini-3-flash-preview";

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
 *
 * BYOK: Provider credentials (Google, OpenAI, Anthropic, etc.) are managed
 * in the Vercel dashboard. The gateway uses your keys first and falls back
 * to system credentials if they fail.
 */
export function getLanguageModel(modelId: string) {
  if (!modelId || !isAllowedModel(modelId)) {
    throw new Error(
      `Invalid or disallowed model ID: "${modelId}". Check your model configuration.`
    );
  }

  const model = gateway(modelId);

  if (isDevMode) {
    return wrapLanguageModel({ model, middleware: devToolsMiddleware() });
  }

  return model;
}

/**
 * Model used for generating chat titles. Uses a fast, cheap model via gateway.
 */
export function getTitleModel() {
  return gateway(FALLBACK_MODEL);
}

/**
 * Model used for artifact generation and suggestion requests via gateway.
 */
export function getArtifactModel() {
  return gateway(FALLBACK_MODEL);
}
