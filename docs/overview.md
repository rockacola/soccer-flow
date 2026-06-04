# System Overview

SoccerFlow is a React Native + Expo app using TypeScript throughout. It follows a "design for tomorrow, build for today" philosophy: the UI layer is kept dumb and purely presentational so that future capabilities (cloud sync, auth, push notifications) can be added without rewriting screens.

---

## Architecture model

```
UI (Screens)
  ↓
Services  — business logic, domain rules
  ↓
Stores / Storage  — Zustand state + AsyncStorage
```

**Future** (when a backend is introduced):

```
UI → Services → Repositories → Storage / API
```

The Repository layer is not built yet. When a second storage implementation appears (Supabase, Firebase, REST API), a `Repository` interface is introduced so services never need to change — only the implementation swaps.

---

## Screen structure

```
App.tsx
  └── Navigation (React Navigation v7 bottom tabs)
        ├── Teams tab
        │     ├── TeamsListScreen
        │     └── TeamDetailScreen
        └── Matches tab
              ├── MatchesListScreen
              ├── MatchSetupScreen
              └── MatchLiveScreen
```

---

## State management

Two Zustand stores, one per domain:

| Store        | Owns                                            |
| ------------ | ----------------------------------------------- |
| `teamsStore` | Team roster, player list, CRUD operations       |
| `matchStore` | Active match, timer, activity log, past matches |

Stores hold state and expose set operations. Business logic (validation, orchestration) lives in `src/services/`, not in stores. Components subscribe to individual store slices — no re-render unless the subscribed slice changes.

Both stores persist to AsyncStorage. Local storage is the source of truth; future cloud sync is additive.

---

## Data flow

```
User action
    │
    ▼
Screen calls service
    │
    ▼
Service executes business logic
    │
    ├──▶ Zustand store update (in-memory)
    │
    └──▶ AsyncStorage.setItem (serialised JSON)
                │
                ▼
          components re-render via Zustand subscription
```

---

## Directory layout

```
src/
  config/      — env.ts and future ConfigProvider
  types/       — all TypeScript interfaces (Team, Player, Match, MatchActivity)
  stores/      — teamsStore and matchStore (Zustand, state only)
  services/    — business logic per domain (introduced per feature)
  screens/     — one folder per feature (teams/, matches/)
  components/  — shared UI components
  hooks/       — shared hooks
  utils/       — pure helper functions
  constants/   — AsyncStorage keys and app-wide constants
assets/        — images, fonts, icons
```

---

## Key design decisions

See [docs/decisions.md](decisions.md) for full ADRs.

- **Expo managed workflow** — avoids native build complexity; can eject later if needed
- **Zustand** — no providers, subscribes to slices, no re-render overhead
- **Services layer** — screens stay dumb; logic is testable in isolation
- **Repository layer (future)** — data source swappable without touching UI
- **AsyncStorage** — local source of truth; no backend required at this stage
- **NativeWind** — Tailwind utility classes for all styles
- **TypeScript strict mode** — catches nullable reads and unset state early
- **iOS-first, platform-isolated** — iOS-specific features gated behind `Platform.OS === 'ios'`; core app must run on Android without crashing
