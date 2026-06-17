# ADR-003: AsyncStorage for Persistence

## Status

accepted

## Context

Data model is simple (teams, players, past matches). JSON serialisation is sufficient. No multi-device sync required at this stage.

## Decision

Use @react-native-async-storage/async-storage, not SQLite or a remote backend.

## Consequences

No relational queries; all filtering done in memory.
