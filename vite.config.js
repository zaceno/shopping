/// <reference types="vitest/config" />
import path from "path"
import { defineConfig } from "vite"
import hyperapp from "vite-plugin-hyperapp"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/shopping/",
  plugins: [hyperapp()],
  test: {},
})
