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

## ADR-005: StyleSheet for Styling (NativeWind deferred)

**Decision:** Use React Native's built-in `StyleSheet` for all component styles. NativeWind is not used.

**Reason:** NativeWind v4 introduced a hard dependency on `react-native-css-interop` which has peer dependency conflicts with the current React Native version. Resolving it required `--legacy-peer-deps` throughout, making the project uninstallable with a plain `npm install`. StyleSheet is the zero-dependency standard and works everywhere without configuration.

**Trade-off:** More verbose than Tailwind utility classes. NativeWind can be re-evaluated once it has stable SDK 56 support and clean peer dependencies.

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

## ADR-008: `expo-crypto` for ID Generation

**Decision:** Use `expo-crypto`'s `randomUUID()` via a thin `src/utils/id.ts` wrapper (`generateId()`).

**Reason:** Two attempts preceded this decision. First, `uuid` v14 was used but it references `import.meta` internally, which Metro's web bundler does not support (blank screen on web). Second, `crypto.randomUUID()` was called directly, but `crypto` is not a reliable global in Hermes on Expo Go — it caused a runtime crash on device. `expo-crypto` is Expo's own cryptography module, is bundled into Expo Go, works on web, and abstracts over whatever the platform provides. The `generateId()` wrapper means all future call sites are unaffected if the implementation changes again.

**Trade-off:** One Expo SDK dependency, but it is a first-party package with no native build step required in managed workflow.
