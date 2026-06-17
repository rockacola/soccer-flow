# ADR-004: TypeScript Strict Mode

## Status

accepted

## Context

Catches type errors early, especially around nullable AsyncStorage reads and unset store state.

## Decision

Enable `strict: true` in tsconfig from day one.

## Consequences

More upfront annotation work, but reduces runtime bugs significantly.
