# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start the Next.js dev server on http://localhost:3000
- `npm run build` — production build
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)
- `npm run typecheck` — `tsc --noEmit`
- `npm test` — run all Vitest tests once (`src/**/*.test.ts`)
- `npx vitest run path/to/file.test.ts` — run a single test file; add `-t "name"` to filter by test name
- `npm run coverage` — V8 coverage for `src/lib/**`
- `npm run mutate` — Stryker mutation testing over `src/lib/model/**` (break threshold 75%)

## Architecture

- Next.js 16 App Router under `src/app/` (React 19, Tailwind CSS v4 via `@tailwindcss/turbopack`).
- `next.config.ts` enables `cacheComponents` and `partialPrefetching`; these change data-fetching/caching semantics, so check `node_modules/next/dist/docs/` before writing server components or route handlers.
- Path alias `@/*` → `src/*` (configured in both `tsconfig.json` and `vitest.config.ts`).
- Tests run in the Node environment (no DOM); Stryker mutates only `src/lib/model/**`.
