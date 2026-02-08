"use client";

/**
 * Client-side artifact stream state.
 *
 * Replaces `@ai-sdk-tools/artifacts/client` — provides a React context +
 * `useArtifactStream()` hook that tracks canvas artifacts (facility-map,
 * medical-desert, stats-dashboard, mission-plan) streamed by the server.
 *
 * Maintains a full history of artifacts so each can be re-opened via its
 * own inline widget in the message stream.
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

export type ArtifactStreamState = {
  /** The currently selected (active) artifact, or `null` if none. */
  current: ArtifactData | null;
  /** All artifacts that have been streamed this session, newest last. */
  history: ArtifactData[];
  /** All artifact types that have been seen this session. */
  types: string[];
};

const initialState: ArtifactStreamState = {
  current: null,
  history: [],
  types: [],
};

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
  | { kind: "select"; id: string }
  | { kind: "reset" };

function updateInHistory(
  history: ArtifactData[],
  id: string,
  updater: (a: ArtifactData) => ArtifactData
): ArtifactData[] {
  return history.map((a) => (a.id === id ? updater(a) : a));
}

function reducer(
  state: ArtifactStreamState,
  action: ArtifactStreamAction
): ArtifactStreamState {
  switch (action.kind) {
    case "stream": {
      const newArtifact: ArtifactData = {
        id: action.id,
        type: action.artifactType,
        payload: action.payload,
        status: "streaming",
      };
      return {
        current: newArtifact,
        history: [...state.history, newArtifact],
        types: state.types.includes(action.artifactType)
          ? state.types
          : [...state.types, action.artifactType],
      };
    }

    case "update": {
      const updater = (a: ArtifactData): ArtifactData => ({
        ...a,
        payload:
          typeof a.payload === "object" && a.payload !== null
            ? { ...a.payload, ...(action.payload as object) }
            : action.payload,
        status: "streaming" as const,
      });

      const updatedHistory = updateInHistory(
        state.history,
        action.id,
        updater
      );
      const updatedCurrent =
        state.current?.id === action.id
          ? updater(state.current)
          : state.current;

      return { ...state, history: updatedHistory, current: updatedCurrent };
    }

    case "complete": {
      const completed: ArtifactData = {
        id: action.id,
        type: action.artifactType,
        payload: action.payload,
        status: "complete",
      };

      const updatedHistory = updateInHistory(
        state.history,
        action.id,
        () => completed
      );
      const updatedCurrent =
        state.current?.id === action.id ? completed : state.current;

      return { ...state, history: updatedHistory, current: updatedCurrent };
    }

    case "error": {
      const updater = (a: ArtifactData): ArtifactData => ({
        ...a,
        status: "error" as const,
        error: action.error,
      });

      const updatedHistory = updateInHistory(
        state.history,
        action.id,
        updater
      );
      const updatedCurrent =
        state.current?.id === action.id
          ? updater(state.current)
          : state.current;

      return { ...state, history: updatedHistory, current: updatedCurrent };
    }

    case "select": {
      const selected = state.history.find((a) => a.id === action.id);
      if (!selected) return state;
      return { ...state, current: selected };
    }

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
  /** Switch the active artifact to the one with the given id. */
  selectArtifact: (id: string) => void;
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

  const selectArtifact = useCallback(
    (id: string) => dispatch({ kind: "select", id }),
    []
  );

  const reset = useCallback(() => dispatch({ kind: "reset" }), []);

  const value = useMemo(
    () => ({ state, processDataPart, selectArtifact, reset }),
    [state, processDataPart, selectArtifact, reset]
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
