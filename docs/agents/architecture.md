# Application architecture

Use this guide when adding or moving application code. The repository follows a Bulletproof React-style, feature-first architecture adapted to the Next.js App Router and this monorepo.

## Dependency direction

Dependencies flow in one direction:

```text
shared <- server <- features <- app
   ^         ^          |
   +---------+----------+
```

- `apps/web/src/app` owns routes, layouts, metadata, and application-level composition. Keep route files thin.
- `apps/web/src/features/<feature>` owns one product capability and its feature-specific components, actions, schemas, hooks, types, and utilities.
- `apps/web/src/server` owns web-app server infrastructure shared by multiple features.
- Shared folders and `packages/ui` contain genuinely domain-neutral building blocks. Shared code must not import from features, server, or app.
- `packages/env` contains the environment contract. Add packages for independently useful technical capabilities such as email or authentication, not merely to avoid a feature folder.

Features must not import from other features. Compose features in the app layer or move a genuinely shared primitive downward. Fallow enforces these rules and requires every analyzed source file to belong to a zone.

Before adding or moving files, run:

```bash
pnpm exec fallow guard <files>
```

## Placement

Keep code as close as possible to its only consumer:

1. Route-only code may be colocated with its route in `app`.
2. Domain-specific code used across a user workflow belongs to its feature.
3. Code used by several features belongs in a shared app folder only when it is domain-neutral.
4. Extract a workspace package when it has multiple consumers, a stable public contract, distinct dependencies, or a useful server/client boundary.

A feature may contain only the folders it needs:

```text
features/contact/
├── actions/
├── components/
├── schemas/
├── server/
├── types/
└── utils/
```

Prefer direct imports. Do not add feature barrel files or reach into another feature's internals.

## Data and side effects

- Fetch in Server Components by default. Use Client Components only for browser APIs, event handling, or client-side state.
- Keep persistence, network, email, and authentication details behind a narrow server or capability interface.
- Validate untrusted input and external responses at the boundary. Do not let an unchecked transport shape become a domain type.
- Keep request declarations and their schemas near the owning feature. Share a preconfigured transport client rather than configuring requests ad hoc.
- Server authorization is authoritative. Hiding UI is not authorization.

## Error handling

Separate expected failures from unexpected exceptions:

- Return expected outcomes such as validation errors, conflicts, or permission denials as typed results that the UI can render next to the relevant action.
- Throw unexpected failures. Do not convert programming or infrastructure bugs into successful-looking empty states.
- Use `notFound()` for absent route resources and Next.js redirects for expected navigation outcomes.
- Add `error.tsx` at the narrowest route segment that can offer a useful fallback or retry. Keep `global-error.tsx` as the final containment boundary.
- Error boundaries do not catch event-handler failures. Catch those at the interaction boundary and update the UI explicitly.
- Catch an error only to recover, translate it into a stable domain result, or add diagnostic context. Preserve the original cause when wrapping it.
- Log unexpected errors once at a trusted boundary. User-facing messages must not expose stack traces, secrets, database details, or upstream payloads.

Test both the successful path and the failure contract whenever error behavior is part of the feature.

## What to test

Choose the highest-confidence test at the lowest useful cost:

| Test | Write it for |
| --- | --- |
| Unit | Pure domain rules, validation, formatting, and complex shared utilities |
| Component | Synchronous Client Component behavior and accessible interactions |
| Integration | The default for a feature workflow spanning components, actions, validation, or mocked boundaries |
| End-to-end | Critical user journeys, routing, real browser behavior, and async Server Component flows |

- Assert user-visible behavior and stable contracts, not internal state or implementation details.
- Put unit and component tests beside their subject. Put cross-module feature tests in the owning feature's `__tests__` directory. See [Testing conventions](testing.md) for the complete placement and naming rules.
- Prefer realistic boundary fakes over mocking internal functions. Mock network behavior at the transport boundary when a real dependency is impractical.
- Cover validation rejection, authorization failure, dependency failure, retry, and empty states where those outcomes matter.
- Avoid tests for TypeScript guarantees, trivial wrappers, static markup with no behavior, or framework behavior already owned by React or Next.js.
- Prefer end-to-end coverage for async Server Components because the current Next.js guidance notes that unit-test tooling does not fully support them.
- Keep the end-to-end suite focused on valuable journeys rather than duplicating every lower-level assertion.

Follow [Testing conventions](testing.md) for test mechanics and commands. The primary-source background for these decisions is captured in [Bulletproof React research](../research/bulletproof-react.md).
