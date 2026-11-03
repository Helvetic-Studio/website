// Types for the jest-dom matchers registered in vitest.setup.ts.
//
// `@testing-library/jest-dom/vitest` (7.0.1) augments `Assertion<T>`, but Vitest 5
// declares `Assertion<R, T>`, so the merge yields wrong return types (e.g. `.resolves`
// matchers are no longer awaitable). Augment Vitest's `Matchers<R, T>` instead.
// Remove once https://github.com/testing-library/jest-dom/issues/738 is fixed.
// The empty single-extends interface is allowed by a lint override in vite.config.ts.
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "vitest" {
  interface Matchers<
    R extends void | Promise<void> = void | Promise<void>,
    T = unknown,
  > extends TestingLibraryMatchers<unknown, R> {}
}
