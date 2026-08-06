# Bulletproof React guidance for the Helvetic website

Research date: 2026-08-06. This note uses the current official Bulletproof React repository, the official Next.js App Router documentation, and OWASP guidance. Bulletproof React describes itself as an opinionated guide rather than a template or framework, so the final section deliberately adapts its principles to this repository instead of copying its sample application literally ([Bulletproof React README](https://github.com/alan2207/bulletproof-react)).

## Current upstream guidance

### Structure and boundaries

Bulletproof React places framework-specific composition in `src/app`, most product code in `src/features/<feature>`, and genuinely shared code in top-level areas such as `components`, `hooks`, `lib`, `types`, and `utils`. A feature may contain only the subdirectories it needs—for example `api`, `components`, `hooks`, `stores`, `types`, and `utils`; empty ceremonial directories are discouraged ([project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)).

The important rule is one-way dependency flow:

```text
shared/capability code -> features -> app composition
```

Features should not import other features. When two features participate in one screen or workflow, the application layer composes them. Shared code must not depend on features or the application. The official guide explicitly recommends enforcing both rules with static import restrictions ([project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)).

The current guide no longer recommends feature `index.ts` barrels as public APIs; it recommends direct imports because barrels caused tree-shaking/performance problems in the sample Vite setup. Therefore, the durable boundary is feature independence—not an `index.ts` convention. If this repository later wants a deliberately narrow feature surface, that should be an explicit local rule with measured bundling behavior, not attributed to current Bulletproof React guidance ([project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)).

### API and data access

For browser-facing REST or GraphQL access, Bulletproof React recommends one preconfigured client and separately declared operations. Each operation should colocate request/response types and validation schemas, a fetcher, and—when applicable—a query/mutation hook. Feature-specific operations live with the feature; a central API area is reasonable when operations are broadly shared ([API layer](https://github.com/alan2207/bulletproof-react/blob/master/docs/api-layer.md)).

That client-hook model is not a requirement for all Next.js data access. In App Router, server-only reads can stay on the server and pass minimal data to components. The official Next.js authentication guidance recommends centralizing sensitive reads and authorization in a Data Access Layer (DAL), returning minimal Data Transfer Objects (DTOs), and marking server modules with `server-only` ([Next.js authentication](https://nextjs.org/docs/app/guides/authentication)). Server Actions must be treated as public HTTP endpoints and must repeat authentication, authorization, and input validation at the action boundary ([Next.js data security](https://nextjs.org/docs/15/app/guides/data-security)).

### Testing strategy

Bulletproof React puts the greatest confidence in integration and end-to-end tests:

- Unit-test pure shared functions, shared components, and isolated complex logic.
- Integration-test feature behavior and interactions between components, hooks, and data access. Prefer assertions on user-visible behavior rather than component state or implementation details.
- End-to-end test complete, valuable user journeys against the frontend and backend.
- Use network-level mocks such as MSW rather than mocking `fetch` directly when an integration test needs a controlled API ([testing](https://github.com/alan2207/bulletproof-react/blob/master/docs/testing.md)).

The upstream tool suggestions are Vitest, Testing Library, Playwright, and MSW. This aligns with Next.js guidance, with one important App Router caveat: Vitest does not currently support asynchronous Server Components, so Next.js recommends end-to-end coverage for those components instead of forcing them into unit tests ([Next.js Vitest guide](https://nextjs.org/docs/app/guides/testing/vitest), [Next.js testing overview](https://nextjs.org/docs/app/guides/testing)).

### Error handling and observability

Bulletproof React separates three concerns: API error handling, render failures, and production reporting. A shared API interceptor can handle systemic concerns such as unauthorized sessions, token refresh, consistent notifications, and logging. Multiple local error boundaries should contain render failures rather than relying only on one application-wide fallback. Production exceptions should go to an error tracker, with source maps uploaded so reports map to source code ([error handling](https://github.com/alan2207/bulletproof-react/blob/master/docs/error-handling.md)).

App Router makes the expected/unexpected distinction explicit. Expected failures—validation errors, missing resources, rejected requests—should be modeled and returned to the UI. Unexpected exceptions should be thrown and handled by nested route-segment `error.tsx` boundaries, with `global-error.tsx` reserved for root failures ([Next.js error handling](https://nextjs.org/docs/app/getting-started/error-handling)).

### Security

Bulletproof React states that client-side auth is only a user-experience layer; the server must protect resources. It recommends `HttpOnly` cookies over browser storage for persisted authentication tokens, authorization policies for role- or permission-based access, protection against XSS, and using OWASP as the wider risk catalogue ([security](https://github.com/alan2207/bulletproof-react/blob/master/docs/security.md)).

For React specifically, ordinary text rendering benefits from framework escaping. Sanitization is required when intentionally rendering untrusted HTML, especially through `dangerouslySetInnerHTML`; URL and other browser contexts need their own validation. OWASP recommends safe sinks, a maintained HTML sanitizer for authored HTML, and CSP as defense in depth rather than the primary XSS control ([OWASP XSS prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), [Next.js CSP guide](https://nextjs.org/docs/app/guides/content-security-policy)).

## Recommended contract for this Next.js monorepo

Use these rules as the local interpretation of Bulletproof React:

1. Keep `apps/web/src/app/**` thin and framework-specific: routes, layouts, metadata, loading/error/not-found UI, and cross-feature composition.
2. Put product behavior in `apps/web/src/features/<feature>/**`. A feature owns its UI, validation, domain types, tests, and feature-specific data operations. Create only directories the feature actually needs.
3. Forbid feature-to-feature imports. Move truly generic code downward to shared app code or a capability package; otherwise compose the features in `app`.
4. Keep app-shared UI/utilities in `apps/web/src/{components,hooks,lib,types,utils}/**`. Keep independently reusable technical capabilities such as `ui`, `auth`, `email`, database access, or environment contracts in `packages/*`. Capability packages must never import from the web app.
5. Do not require feature barrel files. Prefer direct imports while Fallow enforces the architectural zones. Introduce a public-surface convention only if the team explicitly chooses and enforces one.
6. Keep secrets and privileged data access in server-only modules. Centralize authentication/authorization checks near data access, return minimal DTOs, and authorize every Route Handler and Server Action independently.
7. Validate untrusted input at every server boundary. Render plain text through React normally; sanitize only deliberate rich HTML and validate untrusted URLs. Never rely on hidden client UI as authorization.
8. Test pure logic narrowly, feature workflows primarily with integration tests, and a small set of business-critical journeys with Playwright. Prefer E2E coverage for async Server Components. Every important error or permission branch should have a test at the lowest level that proves the real behavior.
9. Model expected errors as typed/domain results with useful user feedback. Throw unexpected faults, contain them with the nearest meaningful `error.tsx`, and report production failures with source maps while avoiding sensitive data in logs.

Fallow can mechanically enforce items 1–5 through complete path coverage, one-way zones, isolated auto-discovered features, and package boundaries. Items 6–9 need written agent guidance plus tests and CI checks; import-boundary tooling alone cannot prove them.
