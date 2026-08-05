# Helvetic Studio Website

The marketing website for Helvetic Studio, a web design and web engineering studio for companies.

## Tooling

- Use pnpm 11.20.0 for package management.
- Use Vite+ (`vp`) to run project scripts and checks.
- Build the workspace with `vp run build`.
- Type-check the workspace with `vp run check-types`.
- Run static validation with `vp run check`; apply safe formatting and lint fixes with `vp run fix`.

## Task-specific guidance

Read only the guides relevant to the files being changed:

- [TypeScript conventions](docs/agents/typescript.md)
- [React and Next.js conventions](docs/agents/react-nextjs.md)
- [Testing conventions](docs/agents/testing.md)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
