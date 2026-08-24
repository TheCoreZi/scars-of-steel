import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "/",
  plugins: [react(), buildInfo()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
  },
});

function buildInfo(): Plugin {
  return {
    name: "build-info",
    generateBundle() {
      const buildInfo = {
        commit: process.env.COMMIT_SHA ?? "local",
        version:
          process.env.RELEASE_VERSION ??
          process.env.npm_package_version ??
          "development",
      };

      this.emitFile({
        fileName: "build-info.json",
        source: `${JSON.stringify(buildInfo, null, 2)}\n`,
        type: "asset",
      });
    },
  };
}
