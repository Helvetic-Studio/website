# Testing conventions

Apply these conventions when adding or changing tests.

- Put assertions inside `it()` or `test()` blocks.
- Use `async`/`await` for asynchronous tests instead of `done` callbacks.
- Do not commit focused or disabled tests such as `.only` or `.skip`.
- Keep suites shallow; introduce nested `describe` blocks only when they communicate a meaningful behavioral context.
- Run the relevant tests with `vp run test`; use `vp run test:watch` or `vp run test:coverage` when the task calls for those modes.
