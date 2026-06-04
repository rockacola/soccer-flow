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

- [ ] React Navigation bottom tabs (Teams, Matches)
- [ ] `RootParamList` types for all screens
- [ ] `teamsStore` wired to AsyncStorage (load on mount, persist on change)
- [ ] `matchStore` wired to AsyncStorage (same pattern)
- [ ] Storage key constants in `src/constants/`

## Phase 3 — Teams management

**Team list screen**

- [ ] List all saved teams
- [ ] Create a new team (name, colour)
- [ ] Delete a team (swipe to delete)

**Team detail screen**

- [ ] View player roster
- [ ] Add a player (name, jersey number, position)
- [ ] Edit player details
- [ ] Remove a player

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
