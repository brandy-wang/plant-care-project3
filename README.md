# Plant Care (P3): watering predictions that show their working

Predicts when each houseplant needs water from room humidity (VPD), light (DLI), pot and soil, using published
plant science, and always explains **why**, with the numbers, as a range. See [docs/PRD.md](docs/PRD.md).

```bash
export PATH=~/.local/node/bin:$PATH   # local Node 22 (see CLAUDE.md)
npm install
npm test            # 42 example + property tests
npm run mutate      # Stryker mutation testing (model)
npm run dev         # http://localhost:3000 → /plants/pothos
```

## HW4: where to find each deliverable

| Rubric item | Evidence |
|---|---|
| **Part 1: CLAUDE.md & setup** | [CLAUDE.md](CLAUDE.md) (stack, architecture decisions, conventions, testing strategy, do's/don'ts, `@docs/PRD.md` / `@docs/model-science.md` / `@AGENTS.md` imports) · permissions in [.claude/settings.json](.claude/settings.json) · `/init` output and two iterations in [docs/claude-md-history/](docs/claude-md-history/README.md) · context strategy in CLAUDE.md §Context management and [session log §5](docs/session-log.md) |
| **Part 2: Explore→Plan→Implement→Commit** | Story 2 ("why this date"): explore notes [docs/features/why-explanation.md](docs/features/why-explanation.md) (`4d158e7`) → approved plan [docs/plans/why-explanation-plan.md](docs/plans/why-explanation-plan.md) (`a2b5236`) → implement commits `f26944c`…`8eeb78e` |
| **Part 3: TDD** | Story 1 model: acceptance criteria in [docs/features/watering-prediction.md](docs/features/watering-prediction.md); `test(...): red` / `feat(...): green` / `refactor(...)` commits `875a420`…`b620c8f`; Stryker 100 % |
| **Part 4: Reflection & log** | [docs/reflection.md](docs/reflection.md) · [docs/session-log.md](docs/session-log.md) |

`git log --oneline --reverse` shows the full workflow.
