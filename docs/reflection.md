# HW4 Reflection: Claude Code workflow and TDD

*Pair: [Name 1], [Name 2] · Project P3: Transparent Plant Care*

> ✏️ **Draft.** Claude Code wrote this from the session log. Replace every *[bracketed]* part with your own
> experience, and rewrite anything that doesn't sound like you before you submit.

## 1. How Explore → Plan → Implement → Commit compares to our previous approach

**Before.** *[Describe how you usually worked on earlier projects or with AI assistants. For example: we opened
ChatGPT/Copilot, described the feature, pasted the code it gave us into the editor, and fixed errors as they
appeared. We committed once at the end of a feature with a message like "finished UI".]*

**What changed.** The biggest difference was that **Explore produced a written artifact before any code
existed**. For story 2 ("why this watering date"), Claude read the Next.js 16 docs bundled in `node_modules`
before writing the page, because `AGENTS.md` and our CLAUDE.md told it to. Two of the findings would have
broken our usual approach: `params` is now a Promise, and with `cacheComponents` turned on,
`generateStaticParams` must return at least one param. Older Next.js habits would have produced a page that
fails the build. The Explore notes (`4d158e7`) turned these into constraints the plan could design around.

**Plan mode** made the design reviewable while it was still cheap to change. The plan named the files, which
model exports to reuse (the soil and depletion tables from the TDD work), the commit sequence and how we would
verify it. Approving it took a minute. Because the plan said "explain layer derives wording only, no new
maths," the implementation never put calculations in a React component, which was the main risk for our
architecture. With our old approach, that decision would have been made by default inside the generated code.

**Implement and Commit** were smoother but not mistake-free, and the log shows where problems were caught:
`tsc` failed on the generated route types (fixed with `next typegen`), and the browser check found a
lowercase sentence that the unit tests missed. Small, labelled commits made each fix visible in history
instead of hiding it in a large final commit.

**Cost.** The workflow is slower to start. For a one-line change, Explore and Plan feel heavy, which is why our
CLAUDE.md only requires Plan mode for changes that touch more than two files. *[Add your own view: was the
extra time worth it? Where would you skip a phase?]*

### TDD specifically
Strict red → green → refactor worked very well for the model because it is pure functions. Three lessons stood out:

1. **A failing test is only evidence if the test is right.** In AC5 the "green" run still had one failure,
   because the expected value had been hand-rounded too early (0.2983 instead of 0.2982). We recomputed it and
   noted the correction in the commit. CLAUDE.md now says to compute reference values without rounding.
2. **Refactor commits want to grow features.** Twice (NaN rejection and the `capped` flag), new behaviour
   appeared inside a "refactor." Splitting it into its own red/green cycle kept the history honest and meant
   both behaviours have tests that fail without them.
3. **Coverage isn't test quality; mutation testing is closer.** Line coverage was already complete, but Stryker
   scored 97.4 % and found two gaps: we never tested that a −10 °C room is *accepted*, and never checked
   water-loss's pot-diameter error. Two small tests brought it to 100 %.

The property tests (fast-check) captured the plant science better than examples alone: "drier air never
makes watering later" and "a bigger pot never makes it sooner" are the claims users have to trust. They are
also what the story-6 agent will rely on when it explains changes.

## 2. Context management strategies that worked best

- **CLAUDE.md with `@imports` was the most effective strategy.** `/init` produced a correct but generic
  file (commands only). Iterating it to import `docs/PRD.md` and `docs/model-science.md` meant every session,
  including after `/clear`, started out knowing the user stories, equations and constants without us pasting
  them in. We iterated it three times (`docs/claude-md-history/`), and each later rule came from a real mistake
  in the log.
- **Durable knowledge belongs in files, not chat.** Plans (`docs/plans/`), Explore findings and acceptance
  criteria are committed, so `/clear` costs nothing and a partner can pick up the work.
- **`/clear` between phases of different kinds** (model TDD → UI feature) kept the UI session from carrying
  hundreds of lines of test output. *[Describe what you saw when you ran it.]*
- **`/compact` with an instruction** ("Keep: current AC, failing test name, files touched") worked better than
  a bare `/compact` for long TDD runs. *[Confirm from your own run.]*
- **`claude --continue`** to resume the previous day's session, followed by "run `npm test` and tell me where
  we left off", got us back to work quickly. *[Confirm from your own run.]*
- **Filtering tool output** (`vitest … | grep "Tests "`) kept each red/green check to a single line of context.

**Permissions as context control.** The allowlist let test, lint and git commands run without prompts, so
the TDD loop stayed fast. Installs, pushes and edits to CLAUDE.md always required asking, and `.env` files
and network fetches were denied outright.

## 3. What we'd do differently
- Pin dependency versions only after checking `npm view … dist-tags`. Our first choices had a critical
  advisory.
- Stage files by name instead of `git add -A` (it picked up a machine-specific `.claude/launch.json`).
- *[Your own point here, e.g. how you split work between the two partners.]*

*Session evidence: `docs/session-log.md` · Git history: `git log --oneline` (36 commits).*
