# Architecture Decisions

## ADR-001: Expo Managed Workflow

**Decision:** Use Expo managed workflow, not bare React Native.

**Reason:** Avoids Xcode/Android Studio build complexity during early development. Expo Go enables fast iteration on device. Can eject to bare workflow later if native modules are needed.

**Trade-off:** Limited to Expo SDK APIs; some third-party libraries require ejecting.

---

## ADR-002: Zustand for State Management

**Decision:** Use Zustand, not Redux, MobX, or React Context + useReducer.

**Reason:** Zustand stores are plain functions — no providers, no boilerplate, no re-render unless the subscribed slice changes. Two stores (teams, match) map cleanly to the two domains.

**Trade-off:** Slightly less familiar than Context for React-only developers; DevTools support requires the devtools middleware.

---

## ADR-003: AsyncStorage for Persistence

**Decision:** Use @react-native-async-storage/async-storage, not SQLite or a remote backend.

**Reason:** Data model is simple (teams, players, past matches). JSON serialisation is sufficient. No multi-device sync required at this stage.

**Trade-off:** No relational queries; all filtering done in memory.

---

## ADR-004: TypeScript Strict Mode

**Decision:** Enable `strict: true` in tsconfig from day one.

**Reason:** Catches type errors early, especially around nullable AsyncStorage reads and unset store state.

**Trade-off:** More upfront annotation work, but reduces runtime bugs significantly.

---

## ADR-005: NativeWind for Styling

**Decision:** Use NativeWind (Tailwind CSS v3) for all component styles, not StyleSheet.

**Reason:** Tailwind utility classes are faster to write than StyleSheet objects, easier to read inline, and enforce a consistent design system without a separate theme file. NativeWind v4 integrates cleanly with Expo managed workflow via Babel + Metro config.

**Trade-off:** Tailwind v4 is not yet supported by NativeWind v4 — pinned to Tailwind v3. Dynamic numeric values (e.g. `width: someVariable`) still require inline `style` prop.

---

## ADR-006: Layered Architecture (Services + Future Repository)

**Decision:** Adopt a layered architecture where screens call services, services own business logic, and stores/storage handle state. A Repository layer is deferred until a second storage implementation is needed.

**Reason:** Keeps screens dumb and purely presentational. Business logic in services is testable in isolation and UI-agnostic. The Repository interface pattern means swapping AsyncStorage for Supabase or Firebase requires no changes to screens or services — only a new implementation.

**Trade-off:** A small amount of indirection even for simple operations. Justified by the explicit goal of supporting backend integration without rewrites. Repository layer is not built until it earns its place (i.e. when a second data source appears).

---

## ADR-007: iOS-First, Platform Layer for iOS-Specific Polish

**Decision:** Build for iOS first. iOS-specific features (Dynamic Island, Live Activities, haptics, etc.) are added in an isolated platform layer, not woven into shared components. The core app must remain functional on Android without those extras.

**Reason:** Only an iOS device is available for testing now. React Native allows one codebase to target both platforms, so going iOS-first does not close off Android. Keeping platform-specific code isolated means Android support can be added later without untangling iOS assumptions from shared logic.

**Trade-off:** Slightly higher release complexity when Android is added (two store listings, platform-specific QA). Acceptable — this is a future problem, not a current one.

**Rule:** Any iOS-specific feature must be gated behind a platform check (`Platform.OS === 'ios'`) and must degrade gracefully on Android — the app may look plainer, but it must not crash or break.

---

## ADR-008: `uuid` Library for ID Generation

**Decision:** Use the `uuid` package (`v4()`) for all ID generation. No polyfill required.

**Reason:** `uuid` is the standard JavaScript ecosystem choice — widely recognised and not tied to any platform. React Native 0.73+ (Hermes) added native `crypto.getRandomValues()` support, which is all `uuid` v9+ needs internally. On this stack (RN 0.85.3) it works with no extra setup.

**Trade-off:** One external dependency, but it is zero-config and platform-agnostic.
