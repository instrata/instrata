import path from "node:path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import TailwindCSS from "@tailwindcss/vite";
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import YamlDtsPlugin from "./scripts/vite-plugin-yaml-dts";

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [
    VueRouter({
      routesFolder: [
        { src: "src/main/pages" },
      ],
    }),
    Vue(),
    VueI18nPlugin({
        include: ["src/locales/*"],
    }),
    TailwindCSS(),
    YamlDtsPlugin({
        source: "src/locales/en.yaml",
        output: "typed-i18n.d.ts",
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: [
          path.resolve(__dirname, "index.html"),
          path.resolve(__dirname, "screenshot-overlay.html"),
      ],
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
