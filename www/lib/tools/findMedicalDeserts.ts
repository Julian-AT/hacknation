
import { findMedicalDesertsLogic } from '../logic/findMedicalDeserts';
import { tool } from 'ai';
import { z } from 'zod';

export const findMedicalDeserts = tool({
  description: 'Identify geographic regions (medical deserts) where a specific service is absent or dangerously far away.',
  parameters: z.object({
    specialty: z.string().describe('The medical specialty to analyze (e.g., "Neurosurgery", "Cardiology").'),
    thresholdKm: z.number().default(100).describe('Distance threshold to define a desert (default 100km).'),
  }),
  execute: async (args) => {
    return await findMedicalDesertsLogic(args);
  },
});
