import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:3000";
const isCI = Boolean(process.env["CI"]);

// Consumed by Playwright, never imported by TypeScript code.
// fallow-ignore-next-line unused-export
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  ...(isCI ? { workers: 1 } : {}),
  reporter: [[isCI ? "github" : "list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: isCI
      ? "vp run start --hostname 127.0.0.1"
      : "vp run dev --hostname 127.0.0.1",
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
