# AI Bootstrap — SoccerFlow

This file is the mandatory entry point for all AI systems operating in this repository.
Load this file first before any other context.

## Critical Rules

These rules are non-negotiable and apply to every task, every session, without exception.

- **Never commit without explicit instruction from the operator.** Stage changes, show a `git diff --stat` summary, and wait for confirmation. An interrupted or redirected request cancels the prior commit instruction.
- **Never add `Co-Authored-By` to commit messages.**
- **Never use em dashes.** Use a comma, full stop, or rewrite the sentence.
- Commit message format: single-line conventional commits, no body. Types: `feat`, `fix`, `docs`, `refactor`, `chore`, `test`.

---

## Load Order

1. Standards — `.ai/standards/` (load `coding.md`, `constraints.md`, `testing.md`, `security.md`)
2. Context — `.ai/context/` (follow sequence in `.ai/manifests/context.yaml`)
3. Memory — `.ai/memory/`
4. Tasks — `.ai/tasks/active/` (active and blocked tasks; completed tasks are archived in `.ai/tasks/completed/`)

Also load at the start of any task:

- `.ai/agents/assistant.md` — role, analysis checklist, and code review guidance
- `.ai/standards/constraints.md` — hard constraints on libraries, patterns, and platform targets
- `.ai/standards/coding.md` — naming, file structure, and style conventions

## Rules

### Foundation

- Do not create files outside the permitted types: manifests, context, agents, standards, skills, memory, journal, and tasks.
- Do not activate agents not listed in `.ai/manifests/agents.yaml`.
- Use `.ai/manifests/context.yaml` to determine which context files to load and in what order.
- Record all decisions in `.ai/journal/{YYYY}/{today}.md`.
- All architectural decisions require an ADR in `docs/adr/`.
- Do not modify `.ai/manifests/foundation.yaml` after initial setup.

### Project

- **No `any` types** — use `unknown` + type narrowing
- **No `console.log` in production code**
- **All AsyncStorage calls must be wrapped in try-catch**
- **Screens must not access storage directly or contain business logic** — see `.ai/standards/constraints.md`
- **Business logic lives in `src/services/`** — not in stores, screens, or components
- **Do not introduce a Repository layer until a second storage implementation is needed**

## Git

- When changing code, update relevant documentation in the same commit. Do not leave docs out of sync with the implementation.

## Journal

Add a journal entry for each working session. Create `.ai/journal/YYYY/YYYY-MM-DD.md` using today's date, or append to it if it already exists.

Each entry has five sections — fill in what is relevant, skip what is not:

- **What I worked on**
- **Decisions made**
- **What I learned**
- **Problems / friction**
- **Next step**

Keep entries brief. One or two sentences per section is enough.

## Docs

When you change code, update the relevant docs in the same commit.

- If you add or change a screen or flow, update the relevant task in `.ai/tasks/active/`
- If you change the architecture or data flow, update `docs/architecture/overview.md`
- If you make a significant decision, add an ADR to `docs/adr/`

## Active Agents

See `.ai/manifests/agents.yaml`.

## Ownership

See `.ai/manifests/ownership.yaml`.

## Foundation Version

See `.ai/manifests/foundation.yaml`. On upgrade, replace this file with the version from the new foundation release.
