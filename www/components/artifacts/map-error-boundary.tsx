"use client";

import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

/**
 * Error boundary that catches WebGL/WebGPU initialisation failures
 * (e.g. luma.gl probing `maxTextureDimension2D` on an undefined device)
 * and renders a graceful fallback instead of crashing the whole page.
 */
export class MapErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    // biome-ignore lint/suspicious/noConsole: intentional error logging
    console.error("[MapErrorBoundary]", error, info);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <svg
              className="size-8 text-muted-foreground/60"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <p className="text-sm font-medium">Map unavailable</p>
              <p className="mt-1 text-xs text-muted-foreground/80">
                WebGL could not be initialised. Try reloading the page or using
                a different browser.
              </p>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
