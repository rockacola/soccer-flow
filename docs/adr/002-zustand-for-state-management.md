# ADR-002: Zustand for State Management

## Status

accepted

## Context

Zustand stores are plain functions — no providers, no boilerplate, no re-render unless the subscribed slice changes. Two stores (teams, match) map cleanly to the two domains.

## Decision

Use Zustand, not Redux, MobX, or React Context + useReducer.

## Consequences

Slightly less familiar than Context for React-only developers; DevTools support requires the devtools middleware.
