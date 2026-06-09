# Tasks

## Part 1 — Project setup

- [x] Expo + TypeScript project scaffold
- [x] Directory structure (src, docs, config, journal)
- [x] TypeScript strict config
- [x] ESLint 9 + Prettier config
- [x] Type definitions (`src/types/index.ts`)
- [x] Zustand stores (`teamsStore`, `matchStore`) as state foundation
- [x] Documentation (overview, getting-started, decisions)

## Part 2 — Navigation and persistence

- [x] React Navigation bottom tabs (Teams, Matches)
- [x] `RootParamList` types for all screens
- [x] `teamsStore` wired to AsyncStorage (load on mount, persist on change)
- [x] `matchStore` wired to AsyncStorage (same pattern)
- [x] Storage key constants in `src/constants/`

## Part 3 — Teams management

**Team list screen**

- [x] List all saved teams
- [x] Create a new team (name, colour)
- [x] Delete a team (swipe to delete)

**Team detail screen**

- [x] View player roster
- [x] Add a player (name, jersey number, position)
- [x] Edit player details
- [x] Remove a player

## Part 4 — Match setup and live tracking

**Match setup screen**

- [x] Select home team; enter opponent name
- [x] Set match duration (default 2 x 40 min)
- [x] Start match

**Live match screen**

- [x] Running match timer (count up)
- [x] Timer adjustment modal
- [x] Record goal (team, player)
- [x] Record substitution (player out, player in)
- [x] Record remark (free text)
- [x] Scrollable activity log (reverse chronological)
- [x] Finish match

## Part 5 — Match summary, testing setup and recording

- [x] Match detail screen (final score, segment-grouped activity timeline)
- [x] Past matches list
- [x] Unit tests — services and utils
- [x] Maestro setup and `create_team` video recording

## Part 6 — UI redesign and feature review

- [ ] Audit and simplify existing features (e.g. team colour)
- [ ] Onboarding / empty states — guide first-time user to create a team and start a match
- [ ] Redesign screens with a primitive, functional UI — no decorative polish
- [ ] Reconsider NativeWind adoption
- [ ] Define which style affordances (swipe gestures, transitions) are deferred add-ons

## Part 7 — Developer tooling

- [ ] Introduce Storybook for screen-level evaluation with mock data (screen level, not component level)
- [ ] Sample data seeder — populate app with realistic fixture data for manual and automated testing
- [ ] Accessibility labels across all interactive elements

## Part 8 — Testing

- [ ] More Maestro video recordings — snapshot current screens and flows
- [ ] Maestro E2E flows (no recording) — common user scenarios

## Part 9 — Feature flags and config

- [ ] Feature flag setup — side-load behaviour without an app store update
- [ ] Remote config infrastructure (professional setup; allows content/behaviour changes without a release)

## Part 10 — Feature enhancements

- [ ] Remark field on goal and substitution activities
- [ ] Live match recovery — handle app kill during an active match (persist or detect and recover orphaned state)
- [ ] Edit past match (segment timestamps, activities)
- [ ] Past matches list — sort by date; filter by team
- [ ] Export past match (capability first; format and layout TBD)

## Part 11 — Architecture

- [ ] Soft delete on `Team` and `Player` (`deletedAt?: number`) — preserves references in past matches when a team or player is deleted
- [ ] Relational data model (replace current flat object store; does not scale)
- [ ] React error boundary at navigator level — graceful crash recovery instead of full app failure

## Part 12 — Polish and release

**Settings screen**

- [ ] Display current app version
- [ ] Toggle sample data (populate or remove fixture records)
- [ ] Full data reset (flush all local storage)

**Release**

- [ ] App icon and splash screen
- [ ] App Store metadata and privacy policy
- [ ] TestFlight build

## Part 13 — CI/CD pipeline

- [ ] GitHub Actions workflow — run Jest on every push and PR
- [ ] EAS build triggered from CI (production and preview channels)

## Part 14 — Statistics

- [ ] Player statistics — goals scored and appearances across matches
- [ ] Team statistics — win / loss / draw record
