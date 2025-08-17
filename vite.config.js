/// <reference types="vitest/config" />
import path from "path"
import { defineConfig } from "vite"
import hyperapp from "vite-plugin-hyperapp"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/shopping/",
  plugins: [
    hyperapp(),
    VitePWA({
      registerType: "autoUpdate", // keeps SW up to date
      includeAssets: [
        "icon-sprites.svg",
        "icons/icon-192.png",
        "icons/icon-512.png",
        "icons/icon-180.png", // optional Apple fallback
      ],
      manifest: {
        name: "Shopping List",
        short_name: "ShopList",
        description: "A simple shopping list app.",
        display: "standalone",
        background_color: "#6495ED",
        theme_color: "#6495ED",
        icons: [
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  test: {},
})
