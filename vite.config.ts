import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import ultracite from "ultracite/oxfmt";
import coreRules from "ultracite/oxlint/core";
import nextRules from "ultracite/oxlint/next";
import reactRules from "ultracite/oxlint/react";
import vitestRules from "ultracite/oxlint/vitest";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  lint: {
    extends: [coreRules, reactRules, nextRules, vitestRules],
    ignorePatterns: coreRules.ignorePatterns ?? [],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    overrides: [
      {
        files: ["**/*.{js,jsx,ts,tsx}"],
        rules: {
          "sort-keys": "off",
        },
      },
    ],
  },
  fmt: {
    ...ultracite,
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    environment: "jsdom",
    restoreMocks: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  staged: {
    "*.{js,ts,jsx,tsx,json,jsonc,css,md}": "vp check --fix",
  },
});
