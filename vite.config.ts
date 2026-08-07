import react from "@vitejs/plugin-react";
import ultracite from "ultracite/oxfmt";
import coreRules from "ultracite/oxlint/core";
import nextRules from "ultracite/oxlint/next";
import reactRules from "ultracite/oxlint/react";
import vitestRules from "ultracite/oxlint/vitest";
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  lint: {
    extends: [
      coreRules,
      reactRules,
      nextRules,
      // Ultracite targets *.{test,spec}; keep Vitest rules on *.test only (Playwright uses *.spec).
      {
        overrides: (vitestRules.overrides ?? []).map((override) => ({
          ...override,
          files: [
            "**/*.test.{ts,tsx,js,jsx}",
            "**/__tests__/**/*.{ts,tsx,js,jsx}",
          ],
        })),
      },
    ],
    ignorePatterns: [
      ...(coreRules.ignorePatterns ?? []),
      "**/cloudflare-env.d.ts",
    ],
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
    // Playwright owns *.spec.ts under e2e/; Vitest only runs *.test.*.
    include: ["**/*.test.{ts,tsx,js,jsx}", "**/__tests__/**/*.{ts,tsx,js,jsx}"],
    exclude: ["**/node_modules/**", "**/e2e/**", "**/*.spec.{ts,tsx,js,jsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "json-summary", "html"],
      reportsDirectory: "./coverage",
      // Keep coverage artifacts when tests fail so the CI report action can run.
      reportOnFailure: true,
      // Include uncovered sources so the report isn't limited to files imported by tests.
      include: [
        "apps/web/src/**/*.{ts,tsx}",
        "packages/ui/src/lib/**/*.{ts,tsx}",
        "packages/ui/src/hooks/**/*.{ts,tsx}",
      ],
      exclude: [
        // Declaration files match `*.{ts,tsx}` globs.
        "**/*.d.ts",
        // Shared Vitest fixtures/helpers — not production code.
        "apps/web/src/testing/**",
        // Thin App Router shells and Server Components — owned by Playwright e2e.
        "apps/web/src/app/**",
        // Type-only modules have no runtime to cover.
        "apps/web/src/types/**",
        // Trivial next-themes re-export — no behavior worth unit-covering.
        "apps/web/src/components/theme/theme-provider.tsx",
      ],
    },
    passWithNoTests: true,
    environment: "jsdom",
    restoreMocks: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  staged: {
    "*.{js,ts,jsx,tsx,json,jsonc,css,md,yml,yaml}": [
      () => "vp run typegen",
      "vp check --fix",
    ],
  },
});
