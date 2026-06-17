# ADR-006: Layered Architecture (Services + Future Repository)

## Status

accepted

## Context

Keeps screens dumb and purely presentational. Business logic in services is testable in isolation and UI-agnostic. The Repository interface pattern means swapping AsyncStorage for Supabase or Firebase requires no changes to screens or services — only a new implementation.

## Decision

Adopt a layered architecture where screens call services, services own business logic, and stores/storage handle state. A Repository layer is deferred until a second storage implementation is needed.

## Consequences

A small amount of indirection even for simple operations. Justified by the explicit goal of supporting backend integration without rewrites. Repository layer is not built until it earns its place (i.e. when a second data source appears).
