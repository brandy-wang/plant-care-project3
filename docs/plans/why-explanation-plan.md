# Plan — Story 2: "Why this watering date"

## Context
PRD story 2: owners must see *why* a watering range was suggested (light, humidity, pot) with the
numbers, so they can trust or correct it. Explore found: `predictWatering` (`src/lib/model/predict-watering.ts`)
already returns every factor (`vpdKPa, dli, budgetL, lossLPerDay, centralDays`, `capped`); the soil and
depletion tables are exported from `src/lib/model/pot.ts`; the app is still the scaffold; Postgres/auth
aren't wired. Next 16 + `cacheComponents`: `params` is a Promise, `generateStaticParams` must return ≥1 param.

## Approach
Derive explanations from model factors in a pure `src/lib/explain/` layer (CLAUDE.md decision #3), render
them in a server-component page. No new maths in UI.

1. **`src/lib/explain/explain-watering.ts`** (TDD: tests first, red→green→refactor commits)
   `explainWatering(plant, prediction) → { headline, reasons[], method }`
   - `headline`: "Water in 9–13 days", or "Check the soil by hand — it's drying very slowly" when `capped`.
   - `reasons` — one per factor, each `{ factor: "humidity"|"light"|"pot", value, sentence, effect: "sooner"|"later"|"typical" }`:
     - humidity: quotes VPD kPa; > 1.5 ⇒ sooner, < 1.0 ⇒ later, else typical.
     - light: quotes DLI with the band from `docs/model-science.md` (<2 low, 2–6 medium, 6–12 bright, >12 direct); bright/direct ⇒ sooner, low ⇒ later.
     - pot: quotes diameter, soil fraction (`SOIL_AVAILABLE_WATER_FRACTION`) and depletion (`ALLOWABLE_DEPLETION`), budget in mL and loss in mL/day.
   - `method`: one sentence with the formula (budget ÷ daily loss, ±15 %).
   - Numbers formatted consistently (kPa 2 dp, DLI 1 dp, mL integers).
2. **`src/lib/plants/sample-plants.ts`** — 3 typed sample plants (pothos, calathea, snake plant) with
   name, `PlantInput` and `EnvInput`; `getSamplePlant(id)`. Stand-in for `src/lib/db/` until Postgres.
3. **`src/components/why-card.tsx`** — server component: headline + reason list (value, sentence, effect badge) + method.
4. **`src/app/plants/[id]/page.tsx`** — `await params`, `generateStaticParams` from sample plants,
   `notFound()` for unknown ids, compute `predictWatering` → `explainWatering` → `<WhyCard>`.
5. **`src/app/page.tsx`** — replace scaffold with a plant list (name + range) linking to detail; update `layout.tsx` metadata.

## Commits (Implement → Commit)
- `test(explain): red — …` / `feat(explain): green — …` / `refactor(explain): …`
- `feat(plants): sample plant fixtures`
- `feat(ui): plant page with WhyCard explanation`
- `feat(ui): home page lists plants with watering ranges`
- `docs: story 2 plan + session log`

## Verification
- `npm test` (incl. new explain tests), `npm run typecheck`, `npm run lint`, `npm run build`.
- `npm run dev`, open `/` and `/plants/pothos` in the browser pane; confirm range matches the 9–13 day model example and every reason shows a number.
- `/plants/nope` returns 404.
