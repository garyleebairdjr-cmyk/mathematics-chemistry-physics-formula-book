import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath, URL } from "node:url";

// When deployed to GitHub Pages the site lives under /<repo-name>/.
// The deploy workflow sets BASE_PATH; locally the site is served from "/".
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base,
  plugins: [tanstackRouter({ target: "react", autoCodeSplitting: true }), react(), tailwindcss()],
  build: {
    // The whole book's text ships in the main chunk on purpose (search needs it).
    chunkSizeWarningLimit: 800,
  },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
