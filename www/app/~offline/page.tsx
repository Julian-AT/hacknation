"use client";

import { MeridianLogo } from "@/components/icons";

export default function OfflinePage() {
  return (
    <div className="flex h-dvh w-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <MeridianLogo size={64} />
      <div className="flex flex-col gap-2">
        <h1 className="text-balance font-semibold text-2xl">You are offline</h1>
        <p className="text-pretty text-muted-foreground">
          Meridian requires an internet connection to access healthcare facility
          data and AI analysis. Please check your connection and try again.
        </p>
      </div>
      <button
        className="rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground text-sm"
        onClick={() => {
          window.location.reload();
        }}
        type="button"
      >
        Retry
      </button>
    </div>
  );
}
