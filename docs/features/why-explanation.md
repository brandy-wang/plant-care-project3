# Feature: "why this watering date" (story 2) — Explore → Plan → Implement → Commit

> As an owner, I want to see why a watering date was suggested (light, humidity, pot), so that I can
> trust or correct it.

## Phase 1 — Explore (findings)
Tools used: Glob/`find`, Grep, Read (see `docs/session-log.md`, entries E1–E6).

- **Model API** (`grep -rn "^export" src/lib/model`): `predictWatering(plant, env)` already returns
  `factors { vpdKPa, dli, budgetL, lossLPerDay, centralDays }` and `capped`. Soil and depletion tables
  (`SOIL_AVAILABLE_WATER_FRACTION`, `ALLOWABLE_DEPLETION`) are exported, so explanations can quote them
  without new maths.
- **App** (`src/app/page.tsx`, `layout.tsx`): still the create-next-app placeholder. No components,
  no data layer, no `src/lib/explain/` yet.
- **Next.js 16 specifics** (`node_modules/next/dist/docs/`, as `AGENTS.md` requires):
  - `params` is a `Promise` and must be awaited (`03-layouts-and-pages.md`).
  - With `cacheComponents: true`, a dynamic route's `generateStaticParams` must return **at least one**
    param; `dynamicParams` is not supported (`migrating-to-cache-components.md`).
  - Server Components by default; only add `"use client"` where interactivity is needed.
- **Gap:** nothing turns numbers into the plain-language "why" the PRD requires, and there's no page
  to show it. Postgres/auth are not wired, so the page needs sample plants for now.

## Phase 2 — Plan
See `docs/plans/why-explanation-plan.md` (written and approved in Claude Code Plan mode).
