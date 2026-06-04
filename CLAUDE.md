# CLAUDE.md — SoccerFlow

This file defines how Claude should behave in this repository.
For architecture details, see [docs/overview.md](docs/overview.md).

---

## Always read before working

Load these files at the start of any task in this project:

- `config/assistant-tasks.md` — role, analysis checklist, and code review guidance
- `config/constraints.md` — hard constraints on libraries, patterns, and platform targets
- `config/code-standards.md` — naming, file structure, and style conventions

---

## Rules

- **Never commit without being explicitly asked** — stage and show a `git diff --stat`, then wait
- **Never add `Co-Authored-By` to commit messages**
- **No `any` types** — use `unknown` + type narrowing
- **No console.log in production code**
- **All AsyncStorage calls must be wrapped in try-catch**
- **Screens must not access storage directly or contain business logic** — see `config/constraints.md`
- **Business logic lives in `src/services/`** — not in stores, screens, or components
- **Do not introduce a Repository layer until a second storage implementation is needed**

---

## Git

Use conventional commits with no body:

```
feat: add team list screen
fix: correct timer pause behaviour
refactor: extract activity list into component
docs: update architecture with navigation diagram
chore: upgrade expo to 51
```

Types: `feat`, `fix`, `docs`, `refactor`, `chore`, `test`

---

## Journal

Add a journal entry for each working session. Create `journal/YYYY-MM-DD.md` using today's date, or append to it if it already exists.

Each entry has five sections — fill in what is relevant, skip what is not:

- **What I worked on**
- **Decisions made**
- **What I learned**
- **Problems / friction**
- **Next step**

Keep entries brief. One or two sentences per section is enough.

---

## Docs

When you change code, update the relevant docs in the same commit.

- If you add or change a screen or flow, tick off tasks in `docs/tasks.md`
- If you change the architecture or data flow, update `docs/overview.md`
- If you make a significant decision, add an ADR to `docs/decisions.md`
