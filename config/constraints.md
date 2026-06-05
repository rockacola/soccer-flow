# Technical Constraints

## Architecture (rules for now)

All data flow must follow this pattern:

```
UI (Screens)
  ↓
Services  (business logic)
  ↓
Stores / Storage  (state + persistence)
```

Rules:

- Screens may render UI, handle user input, and call services
- Screens must NOT access storage directly, call APIs directly, or contain business logic
- Business logic lives in `src/services/` — one service per domain
- Services throw typed errors; UI catches and displays them
- No silent failures

## Architecture (guidance for future design)

When a backend is introduced, a Repository layer sits between Services and Storage:

```
UI → Services → Repositories → Storage / API
```

Repository interfaces abstract the data source so the UI never knows whether data comes from AsyncStorage, Supabase, or a REST API. Introduce this layer when a second storage implementation appears — not before.

---

## React Native

- Target iOS first (iPhone, iPad via supportsTabletMode)
- Expo managed workflow — avoid bare workflow unless required
- No native modules that require `expo eject`
- Test on physical device via Expo Go during development
- iOS-specific features (Dynamic Island, Live Activities, etc.) must be gated behind `Platform.OS === 'ios'` — core app must not crash on Android

## TypeScript

- `strict: true` in tsconfig — no escape hatches
- No `any` types; use `unknown` + type narrowing where needed
- All store state and action types must be explicitly typed
- Prefer type aliases over interfaces for union/intersection types

## State Management

- Zustand for shared/global state (`src/stores/`) — one store per domain
- `useState` for component-local state only
- Stores hold state and expose set operations; business logic belongs in services
- Store state must be serialisable to JSON for AsyncStorage

## Styling

- `StyleSheet.create` for all component styles
- Inline `style` props permitted for dynamic values
- NativeWind is not used — see ADR-005

## Configuration

- All environment variables centralised in `src/config/env.ts` — never import `process.env` directly elsewhere
- Feature flags and remote config flow through a `ConfigProvider` when introduced — no hardcoded `if (true)` toggles (future)

## Persistence

- AsyncStorage for all local data — local storage is the source of truth
- All reads/writes wrapped in try-catch
- Storage keys defined as constants in `src/constants/`
- Future cloud sync is additive — it must not require rewriting the UI layer

## Navigation

- React Navigation v7 with bottom tabs
- No deep linking required at this stage
- Screen names typed via `RootParamList`

## Performance

- React.memo for list item components
- useMemo/useCallback where renders are measurably expensive
- No premature optimisation — profile before optimising
