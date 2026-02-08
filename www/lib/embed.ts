import { embed as aiEmbed } from "ai";
import { openai } from "@ai-sdk/openai";

/**
 * Generate a vector embedding for the given text using gateway-routed OpenAI embeddings.
 * Returns a 1536-dimension float array for pgvector cosine similarity search.
 */
export async function embed(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    throw new Error("Cannot generate embedding for empty text");
  }

  try {
    const { embedding } = await aiEmbed({
      model: openai.embedding('text-embedding-3-small'),
      value: text.replace(/\n/g, " ").trim(),
    });
    return embedding;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown embedding error";
    console.error("[Embed] Failed to generate embedding:", message);
    throw new Error(`Failed to generate embedding: ${message}`);
  }
}
