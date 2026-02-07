import { google } from "@ai-sdk/google";

export function getLanguageModel(_modelId: string) {
  return google("gemini-flash-latest");
}

export function getTitleModel() {
  return google("gemini-2.5-flash");
}

export function getArtifactModel() {
  return google("gemini-2.5-flash");
}
