# ADR-008: expo-crypto for ID Generation

## Status

accepted

## Context

Two attempts preceded this decision. First, `uuid` v14 was used but it references `import.meta` internally, which Metro's web bundler does not support (blank screen on web). Second, `crypto.randomUUID()` was called directly, but `crypto` is not a reliable global in Hermes on Expo Go — it caused a runtime crash on device. `expo-crypto` is Expo's own cryptography module, is bundled into Expo Go, works on web, and abstracts over whatever the platform provides. The `generateId()` wrapper means all future call sites are unaffected if the implementation changes again.

## Decision

Use `expo-crypto`'s `randomUUID()` via a thin `src/utils/id.ts` wrapper (`generateId()`).

## Consequences

One Expo SDK dependency, but it is a first-party package with no native build step required in managed workflow.
