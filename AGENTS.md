# Helvetic Studio Website

The marketing website for Helvetic Studio, a web design and web engineering studio for companies.

## Tooling

- Use pnpm 11.20.0 for package management.
- Use Vite+ (`vp`) to run project scripts and checks.
- Build the workspace with `vp run build`.
- Type-check the workspace with `vp run check-types`.
- Run static validation with `vp run check`; apply safe formatting and lint fixes with `vp run fix`.

<!-- fallow:setup-hooks:start -->

## Fallow local gate

Before any `git commit` or `git push`, run `pnpm exec fallow audit --format json --quiet --explain --gate-marker agent`. If the verdict is `fail`, fix the reported findings before retrying. Treat JSON runtime errors like `{ "error": true, ... }` as non-blocking.

Audit defaults to `gate=new-only`: only findings introduced by the current changeset affect the verdict. Inherited findings on touched files are reported under `attribution` and annotated with `introduced: false`, but do not block the commit. Set `"audit": { "gate": "all" }` in `.fallowrc.json` to gate every finding in changed files.

This repo configures fallow in `.fallowrc.json` (not `fallow.toml`). It enables `typeAware`, which rejects the `github-annotations` / `github-summary` output formats — use `--format compact`, `json`, `sarif`, or `markdown` instead.

For non-skill agents, treat the task map below as the local onboarding source: run the listed fallow command before destructive edits, before commits, and before pull request handoff.

## Fallow task map

| When the agent is about to... | Run |
| --- | --- |
| delete an "unused" export or file | `pnpm exec fallow dead-code --trace <file>:<export>` |
| prove a TypeScript symbol's exact consumers before refactoring | `pnpm exec fallow dead-code --type-aware --symbol-impact <file>:<export-or-class.method>` |
| delete an "unused" dependency | `pnpm exec fallow dead-code --trace-dependency <name>` |
| commit or open a PR | `pnpm exec fallow audit --base <ref>` |
| prioritize refactoring | `pnpm exec fallow health --hotspots --targets` |
| ask who owns code | `pnpm exec fallow health --ownership` |
| check untested-but-reachable code | `pnpm exec fallow health --coverage-gaps` |
| consolidate duplication | `pnpm exec fallow dupes --trace dup:<fingerprint>` |
| find feature flags | `pnpm exec fallow flags` |
| check which architecture rules apply to a file before changing it | `pnpm exec fallow guard <files>` |
| surface security candidates | `pnpm exec fallow security` |
| understand a finding | `pnpm exec fallow explain <issue-type>` |
| scope a monorepo | `--workspace <glob> / --changed-workspaces <ref>` (global flags, prefix any command) |

<!-- fallow:setup-hooks:end -->

## Architecture

Read [Application architecture](docs/agents/architecture.md) before adding or moving application modules, features, server code, or workspace packages. Run `pnpm exec fallow guard <files>` before changing architectural boundaries.

## Task-specific guidance

Read only the guides relevant to the files being changed:

- [TypeScript conventions](docs/agents/typescript.md)
- [React and Next.js conventions](docs/agents/react-nextjs.md)
- [Testing conventions](docs/agents/testing.md)
- [Application architecture](docs/agents/architecture.md)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
