import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  root: import.meta.dirname,
  plugins: [vue()],
  resolve: {
    alias: {
      wiux: resolve(import.meta.dirname, "../src/index.ts"),
    },
  },
  server: {
    port: 3100,
    open: true,
    fs: {
      allow: [".."],
    },
  },
});