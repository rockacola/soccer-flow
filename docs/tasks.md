# Tasks

## Phase 1 — Project setup

- [x] Expo + TypeScript project scaffold
- [x] Directory structure (src, docs, config, journal)
- [x] TypeScript strict config
- [x] ESLint 9 + Prettier config
- [x] Type definitions (`src/types/index.ts`)
- [x] Placeholder contexts (`TeamsContext`, `MatchContext`)
- [x] Documentation (overview, getting-started, decisions)

## Phase 2 — Navigation and persistence

- [x] React Navigation bottom tabs (Teams, Matches)
- [x] `RootParamList` types for all screens
- [x] `teamsStore` wired to AsyncStorage (load on mount, persist on change)
- [x] `matchStore` wired to AsyncStorage (same pattern)
- [x] Storage key constants in `src/constants/`

## Phase 3 — Teams management

**Team list screen**

- [x] List all saved teams
- [x] Create a new team (name, colour)
- [x] Delete a team (swipe to delete)

**Team detail screen**

- [x] View player roster
- [x] Add a player (name, jersey number, position)
- [x] Edit player details
- [x] Remove a player

## Phase 4 — Match setup and live tracking

**Match setup screen**

- [ ] Select home team and away team
- [ ] Set match duration (default 2 x 40 min)
- [ ] Start match

**Live match screen**

- [ ] Running match timer (count up)
- [ ] Pause / resume timer
- [ ] Record goal (team, player, minute)
- [ ] Record substitution (player out, player in, minute)
- [ ] Record remark (free text, minute)
- [ ] Scrollable activity log (reverse chronological)
- [ ] Finish match

## Phase 5 — Match summary and polish

- [ ] Summary screen (final score, timeline, goal scorers, substitution log)
- [ ] Past matches list
- [ ] Export / share summary
- [ ] App icon and splash screen
- [ ] TestFlight build

## Phase 6 — Settings

- [ ] Settings / config screen
- [ ] Clear local data (calls AsyncStorage.clear())

## Phase 7 — Test coverage

- [ ] Unit tests (Jest) — services and utils
- [ ] Integration / component tests (Jest + React Native Testing Library) — components and store interactions, runs in JS environment without a device
- [ ] E2E tests (Detox or Maestro) — requires dev build, not Expo Go; full app on simulator or physical device
