# CLAUDE.md iteration

| Snapshot | What changed and why |
|---|---|
| `01-init-output.md` | Raw `/init` output. Useful command list, but it only knew the scaffold: no product context, no testing rules, nothing about the pure-model architecture. |
| `02-iterated.md` | Added project context and `@docs/PRD.md` / `@docs/model-science.md` imports so every session knows the user stories and equations without re-reading them; architecture decisions (pure model, ranges, derived explanations); unit-suffixed naming; strict TDD + property/mutation testing rules; do's/don'ts (no maths in UI/agent, no single dates, out-of-scope features); context-management habits. Kept `/init`'s commands, tightened to the ones we actually use, and noted the local Node path because `/init`-generated commands failed without it. |

Later snapshots are added when a session reveals a missing rule (see `docs/session-log.md`).

| `03-after-features.md` | After the TDD and story-2 sessions: `typecheck` needs `next typegen`; compute test reference values unrounded; keep refactors behaviour-preserving and give new behaviour its own red/green; run Stryker after model changes; sample-plants stand-in and the ≥ 1 `generateStaticParams` rule. Each line comes from a mistake or surprise logged in `docs/session-log.md`. |
