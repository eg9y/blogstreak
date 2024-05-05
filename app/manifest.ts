import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BlogStreak",
    short_name: "BStreak",
    icons: [
      {
        src: "/icons/logo-192x192.webp",
        sizes: "192x192",
        type: "image/webp",
        purpose: "maskable",
      },
      {
        src: "/icons/logo-512x512.webp",
        sizes: "512x512",
        type: "image/webp",
      },
    ],
    theme_color: "#FFFFFF",
    background_color: "#FFFFFF",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
  };
}
