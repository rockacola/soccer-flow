# SoccerFlow

A React Native app for coaches to track soccer matches live.

During a match, coaches log goals, substitutions, and remarks with the current minute. After the final whistle the app shows a full timeline and match summary. Between matches, coaches manage team rosters and player details.

**Status:** Core app complete (teams, matches, live tracking). Actively improving UI and testing.

---

## Tech stack

| Layer       | Tool                              |
| ----------- | --------------------------------- |
| Runtime     | React Native + Expo (managed)     |
| Language    | TypeScript (strict mode)          |
| Styling     | React Native StyleSheet           |
| State       | Zustand                           |
| Persistence | AsyncStorage (local, no backend)  |
| Navigation  | React Navigation v7 (bottom tabs) |
| Node        | 24                                |

---

## How this repo is organised

```
src/
  App.tsx       — root component and navigation shell
  types/        — all TypeScript interfaces in one place
  stores/       — Zustand stores (teamsStore, matchStore)
  services/     — business logic per domain
  screens/      — one folder per tab (teams/, matches/)
  components/   — shared UI components
  utils/        — pure helper functions
  constants/    — storage keys and app-wide constants
docs/
  architecture/ — system overview and data flow
  adr/          — architecture decision records
  onboarding/   — dev setup guide
.ai/            — AI assistant context, standards, tasks, and journal
```

---

## Documentation

| File                                                                     | What's in it                                           |
| ------------------------------------------------------------------------ | ------------------------------------------------------ |
| [docs/architecture/overview.md](docs/architecture/overview.md)           | Architecture, data flow, key design decisions          |
| [docs/onboarding/getting-started.md](docs/onboarding/getting-started.md) | Dev environment setup and running the app              |
| [docs/adr/](docs/adr/)                                                   | Architecture decision records (ADR-001 – ADR-009)      |
| [.ai/tasks/active/](.ai/tasks/active/)                                   | Active and upcoming work items                         |
| [.ai/journal/](.ai/journal/)                                             | Dated session notes — what was built, what was decided |

---

## Roadmap

See [.ai/tasks/active/](.ai/tasks/active/) for active work items.

- [x] Project setup, navigation, and persistence
- [x] Teams management (roster, player CRUD)
- [x] Match setup and live tracking (timer, goals, subs, remarks)
- [x] Match summary and past matches list
- [x] Onboarding, sample data, and Maestro test recordings
- [ ] UI redesign, Storybook, E2E flows
- [ ] Feature enhancements, architecture improvements, CI/CD
