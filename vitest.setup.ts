import "./apps/web/src/testing/animation-event-polyfill";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vite-plus/test";

afterEach(() => {
  cleanup();
});
