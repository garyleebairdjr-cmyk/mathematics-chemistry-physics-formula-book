import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath, URL } from "node:url";

// When deployed to GitHub Pages the site lives under /<repo-name>/.
// The deploy workflow sets BASE_PATH; locally the site is served from "/".
const base = process.env.BASE_PATH ?? "/";

// When the book runs locally, Natural Voice Reader's voice servers (which do not
// send CORS headers) are reached through this page's own address instead.
const voiceProxy = Object.fromEntries(
  [
    ["nvr-voicestudio", 3900],
    ["nvr-kokoro", 3901],
  ].map(([name, port]) => [
    `${base.replace(/\/$/, "")}/${name}`,
    {
      target: `http://127.0.0.1:${port}`,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(new RegExp(`^.*?/${name}`), ""),
    },
  ]),
);

export default defineConfig({
  base,
  server: { proxy: voiceProxy },
  preview: { proxy: voiceProxy },
  plugins: [tanstackRouter({ target: "react", autoCodeSplitting: true }), react(), tailwindcss()],
  build: {
    // The whole book's text ships in the main chunk on purpose (search needs it).
    chunkSizeWarningLimit: 800,
  },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
