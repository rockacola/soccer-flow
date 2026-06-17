# ADR-009: Replace Gesture-Based Destructive Actions with Explicit Buttons

## Status

accepted

## Context

Gesture affordances are not discoverable, not testable by Maestro automation, and not portable across platforms. The baseline UI should work with zero gesture knowledge. Swipe-to-delete and slide-to-confirm are additive affordances — they can be layered back in later via feature flags, gated by platform or user preference.

## Decision

Remove swipe-to-delete (list rows) and slide-to-finish (live match) affordances. Replace with always-visible explicit buttons and `Alert.alert()` confirmation.

## Consequences

Slightly more taps for power users who would have used the gesture. Accepted — the goal is incremental affordance, not maximum gesture coverage from day one. Slide-to-finish in `MatchLiveScreen` was a deliberate high-friction guard against accidentally ending a match; worth reconsidering once feature flags are in place (part-09) so it can be offered as an opt-in or platform-specific enhancement.
