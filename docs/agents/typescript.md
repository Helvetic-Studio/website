# TypeScript conventions

Apply these conventions when changing TypeScript or JavaScript.

## Types

- Prefer `unknown` to `any` when a value's type is not known.
- Narrow types through control flow instead of using type assertions.
- Use `as const` when values should retain literal types and remain immutable.
- Add explicit parameter and return types when they make an interface or non-obvious behavior clearer.

## Control flow and data handling

- Default to `const`; use `let` only when reassignment is necessary, and do not use `var`.
- Prefer `for...of` when iteration needs control flow or side effects.
- Do not use object or array spread as an accumulator inside a loop.
- Extract complex conditions and unexplained numeric values into well-named constants.
- Prefer early returns to deeply nested branches and avoid nested ternaries.

## Async code and errors

- Prefer `async`/`await` when it makes asynchronous control flow easier to follow.
- Await promises when their completion or result is required; intentionally returned promises are valid.
- Do not use an async function as a `Promise` constructor executor.
- Throw `Error` instances with enough context to diagnose the failure.
- Catch errors only when the code can recover, add useful context, or translate the error.

## Module organization

- Prefer direct imports over namespace imports.
- Do not add barrel files that only re-export other modules.
- Keep regular expressions outside frequently executed loops when they can be reused.
