# SoccerFlow

A React Native app for coaches to track soccer matches live.

During a match, coaches log goals, substitutions, and remarks with the current minute. After the final whistle the app shows a full timeline and match summary. Between matches, coaches manage team rosters and player details.

**Status:** Phase 1 complete (project setup). Actively building Phase 2 (navigation + state).

---

## Tech stack

| Layer       | Tool                              |
| ----------- | --------------------------------- |
| Runtime     | React Native + Expo (managed)     |
| Language    | TypeScript (strict mode)          |
| Styling     | NativeWind (Tailwind CSS v3)      |
| State       | Zustand                           |
| Persistence | AsyncStorage (local, no backend)  |
| Navigation  | React Navigation v7 (bottom tabs) |
| Node        | 24                                |

---

## How this repo is organised

```
src/
  App.tsx       — root component and navigation shell
  global.css    — Tailwind base styles
  types/        — all TypeScript interfaces in one place
  stores/       — Zustand stores (teamsStore, matchStore)
  screens/      — one folder per tab (teams/, matches/)
  components/   — shared UI components
  constants/    — storage keys and app-wide constants
docs/           — architecture, setup guide, task list
config/         — Claude Code / AI assistant instructions
journal/        — dated session notes and architecture decisions
```

---

## Documentation

| File | What's in it |
| ---- | ------------ |
| [docs/overview.md](docs/overview.md) | Architecture, data flow, key design decisions |
| [docs/getting-started.md](docs/getting-started.md) | Dev environment setup and running the app |
| [docs/tasks.md](docs/tasks.md) | Full task checklist — what's done, what's next |
| [docs/decisions.md](docs/decisions.md) | Architecture decisions with rationale (ADRs) |
| [journal/](journal/) | Dated session notes — what was built, what was decided |
| [config/](config/) | Claude Code instructions, constraints, and code standards |

---

## Roadmap

See [docs/tasks.md](docs/tasks.md) for the full task checklist.

- [x] Phase 1 — Project setup, structure, and tooling
- [ ] Phase 2 — Navigation, Zustand stores, and AsyncStorage persistence
- [ ] Phase 3 — Teams management (roster, player CRUD)
- [ ] Phase 4 — Match setup and live tracking (timer, activities)
- [ ] Phase 5 — Match summary and polish
