# Testing conventions

Apply these conventions when adding or changing tests.

- Follow the test-selection guidance in [Application architecture](architecture.md): integration tests are the default for feature workflows, while end-to-end tests cover critical journeys and async Server Components.
- Assert user-observable behavior and stable contracts rather than implementation details.
- Put assertions inside `it()` or `test()` blocks.
- Use `async`/`await` for asynchronous tests instead of `done` callbacks.
- Do not commit focused or disabled tests such as `.only` or `.skip`.
- Keep suites shallow; introduce nested `describe` blocks only when they communicate a meaningful behavioral context.
- Run the relevant tests with `vp run test`; use `vp run test:watch` or `vp run test:coverage` when the task calls for those modes.

## Test placement

| Test type | Location | Naming |
| --- | --- | --- |
| Unit | Beside the function, schema, hook, or domain module | `thing.test.ts` |
| Component | Beside the component | `thing.test.tsx` |
| Feature integration | `apps/web/src/features/<feature>/__tests__/` | `workflow.test.tsx` |
| End-to-end | `apps/web/e2e/` | `journey.spec.ts` |
| Shared test infrastructure | `apps/web/src/testing/` | Descriptive utility names |

- Use `.test.ts` and `.test.tsx` for Vitest. Use `.spec.ts` for Playwright tests.
- When one production file is the subject, put its test beside it.
- When a workflow spanning several modules is the subject, put the test in the owning feature's `__tests__` directory.
- Keep feature-specific fixtures, factories, and mocks inside that feature. Promote them to `apps/web/src/testing` only when multiple features use them.
- Keep end-to-end tests at the application boundary rather than under a feature because they exercise the deployed application and browser.
- Do not create a repository-wide `tests/unit` or `tests/integration` mirror of the source tree.
