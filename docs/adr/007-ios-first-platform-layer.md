# ADR-007: iOS-First, Platform Layer for iOS-Specific Polish

## Status

accepted

## Context

Only an iOS device is available for testing now. React Native allows one codebase to target both platforms, so going iOS-first does not close off Android. Keeping platform-specific code isolated means Android support can be added later without untangling iOS assumptions from shared logic.

## Decision

Build for iOS first. iOS-specific features (Dynamic Island, Live Activities, haptics, etc.) are added in an isolated platform layer, not woven into shared components. The core app must remain functional on Android without those extras. Any iOS-specific feature must be gated behind `Platform.OS === 'ios'` and must degrade gracefully on Android.

## Consequences

Slightly higher release complexity when Android is added (two store listings, platform-specific QA). Acceptable — this is a future problem, not a current one.
