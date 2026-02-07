
import { embed as aiEmbed } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function embed(text: string): Promise<number[]> {
  try {
    const { embedding } = await aiEmbed({
      model: openai.embedding('text-embedding-3-small'),
      value: text.replace(/\n/g, ' '),
    });
    return embedding;
  } catch (error) {
    console.error('Embedding failed:', error);
    throw new Error('Failed to generate embedding');
  }
}
