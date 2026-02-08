"use client";

/**
 * Client-side artifact stream state.
 *
 * Replaces `@ai-sdk-tools/artifacts/client` — provides a React context +
 * `useArtifactStream()` hook that tracks canvas artifacts (facility-map,
 * medical-desert, stats-dashboard, mission-plan) streamed by the server.
 */

import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import type { ArtifactData } from "@/lib/ai/artifacts/artifact";

// ── State ────────────────────────────────────────────────────────────

type ArtifactStreamState = {
  /** The most recent (active) artifact, or `null` if none. */
  current: ArtifactData | null;
  /** All artifact types that have been seen this session. */
  types: string[];
};

const initialState: ArtifactStreamState = { current: null, types: [] };

// ── Actions ──────────────────────────────────────────────────────────

type ArtifactStreamAction =
  | {
      kind: "stream";
      id: string;
      artifactType: string;
      payload: unknown;
    }
  | {
      kind: "update";
      id: string;
      artifactType: string;
      payload: unknown;
    }
  | {
      kind: "complete";
      id: string;
      artifactType: string;
      payload: unknown;
    }
  | {
      kind: "error";
      id: string;
      artifactType: string;
      error: string;
    }
  | { kind: "reset" };

function reducer(
  state: ArtifactStreamState,
  action: ArtifactStreamAction
): ArtifactStreamState {
  switch (action.kind) {
    case "stream":
      return {
        current: {
          id: action.id,
          type: action.artifactType,
          payload: action.payload,
          status: "streaming",
        },
        types: state.types.includes(action.artifactType)
          ? state.types
          : [...state.types, action.artifactType],
      };

    case "update":
      if (state.current?.id !== action.id) return state;
      return {
        ...state,
        current: {
          ...state.current,
          payload:
            typeof state.current.payload === "object" &&
            state.current.payload !== null
              ? { ...state.current.payload, ...(action.payload as object) }
              : action.payload,
          status: "streaming",
        },
      };

    case "complete":
      return {
        ...state,
        current: {
          id: action.id,
          type: action.artifactType,
          payload: action.payload,
          status: "complete",
        },
      };

    case "error":
      if (state.current?.id !== action.id) return state;
      return {
        ...state,
        current: {
          ...state.current,
          status: "error",
          error: action.error,
        },
      };

    case "reset":
      return initialState;

    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────────────

type ArtifactStreamContextValue = {
  state: ArtifactStreamState;
  /**
   * Feed a data-stream part from `onData` into the artifact state machine.
   * Returns `true` if the part was an artifact event, `false` otherwise.
   */
  processDataPart: (part: { type: string; data?: unknown }) => boolean;
  /** Reset all artifact state (useful on chat navigation). */
  reset: () => void;
};

const ArtifactStreamContext = createContext<ArtifactStreamContextValue | null>(
  null
);

// ── Provider ─────────────────────────────────────────────────────────

export function ArtifactStreamProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const processDataPart = useCallback(
    (part: { type: string; data?: unknown }): boolean => {
      const d = part.data as Record<string, unknown> | undefined;

      switch (part.type) {
        case "data-artifact-stream":
          dispatch({
            kind: "stream",
            id: d?.id as string,
            artifactType: d?.artifactType as string,
            payload: d?.payload,
          });
          return true;

        case "data-artifact-update":
          dispatch({
            kind: "update",
            id: d?.id as string,
            artifactType: d?.artifactType as string,
            payload: d?.payload,
          });
          return true;

        case "data-artifact-complete":
          dispatch({
            kind: "complete",
            id: d?.id as string,
            artifactType: d?.artifactType as string,
            payload: d?.payload,
          });
          return true;

        case "data-artifact-error":
          dispatch({
            kind: "error",
            id: d?.id as string,
            artifactType: d?.artifactType as string,
            error: d?.error as string,
          });
          return true;

        default:
          return false;
      }
    },
    []
  );

  const reset = useCallback(() => dispatch({ kind: "reset" }), []);

  const value = useMemo(
    () => ({ state, processDataPart, reset }),
    [state, processDataPart, reset]
  );

  return (
    <ArtifactStreamContext.Provider value={value}>
      {children}
    </ArtifactStreamContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────

/**
 * Access the canvas artifact stream state.
 *
 * Drop-in replacement for the old `useArtifacts()` from
 * `@ai-sdk-tools/artifacts/client`.
 */
export function useArtifactStream() {
  const ctx = useContext(ArtifactStreamContext);
  if (!ctx) {
    throw new Error(
      "useArtifactStream must be used within an ArtifactStreamProvider"
    );
  }
  return ctx;
}
