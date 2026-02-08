import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CareMap",
    short_name: "CareMap",
    description:
      "Interactive healthcare facility mapping and AI analysis for Ghana",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#545454",
    orientation: "portrait-primary",
    categories: ["medical", "health", "utilities"],
    icons: [
      {
        src: "/icons/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
    ],
  };
}
