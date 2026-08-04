import ultraciteFmt from "ultracite/oxfmt";
import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";
import react from "ultracite/oxlint/react";
import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    extends: [core, react, next],
    ignorePatterns: core.ignorePatterns ?? [],
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
    ...ultraciteFmt,
  },
  staged: {
    "*.{js,ts,jsx,tsx,json,jsonc,css,md}": "vp check --fix",
  },
});
