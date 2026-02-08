/**
 * Local artifact streaming system.
 *
 * Replaces `@ai-sdk-tools/artifacts` — defines typed artifacts that can be
 * streamed to the client through the AI SDK data stream and rendered in
 * the canvas panel.
 */

import type { UIMessageStreamWriter } from "ai";
import { nanoid } from "nanoid";
import type { ZodType } from "zod";

/** Shape of an artifact as seen by the client. */
export type ArtifactData<T = unknown> = {
  id: string;
  type: string;
  payload: T;
  status: "streaming" | "complete" | "error";
  error?: string;
};

/**
 * Define a typed artifact schema.
 *
 * Returns an object with a `.stream()` method that initiates artifact
 * streaming through a `UIMessageStreamWriter`.
 *
 * @param type  - Unique artifact identifier (e.g. "facility-map")
 * @param _schema - Zod schema for the payload (used for documentation; runtime
 *                  validation happens at the tool level)
 */
export function artifact<T>(type: string, _schema: ZodType<T>) {
  return {
    /**
     * Begin streaming an artifact to the client.
     *
     * Sends the initial payload immediately and returns helpers to push
     * partial updates, complete, or signal an error.
     */
    stream(
      initialPayload: T,
      dataStream: UIMessageStreamWriter<never>
    ): {
      update: (partialPayload: Partial<T>) => Promise<void>;
      complete: (fullPayload: T) => Promise<void>;
      error: (message: string) => Promise<void>;
    } {
      const id = nanoid();

      // Send initial artifact data
      (dataStream as UIMessageStreamWriter).write({
        type: "data-artifact-stream",
        data: { id, artifactType: type, payload: initialPayload },
      } as never);

      return {
        async update(partialPayload: Partial<T>) {
          (dataStream as UIMessageStreamWriter).write({
            type: "data-artifact-update",
            data: { id, artifactType: type, payload: partialPayload },
          } as never);
        },

        async complete(fullPayload: T) {
          (dataStream as UIMessageStreamWriter).write({
            type: "data-artifact-complete",
            data: { id, artifactType: type, payload: fullPayload },
          } as never);
        },

        async error(message: string) {
          (dataStream as UIMessageStreamWriter).write({
            type: "data-artifact-error",
            data: { id, artifactType: type, error: message },
          } as never);
        },
      };
    },
  };
}
