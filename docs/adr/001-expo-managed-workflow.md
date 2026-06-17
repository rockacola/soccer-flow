# ADR-001: Expo Managed Workflow

## Status

accepted

## Context

Avoids Xcode/Android Studio build complexity during early development. Expo Go enables fast iteration on device. Can eject to bare workflow later if native modules are needed.

## Decision

Use Expo managed workflow, not bare React Native.

## Consequences

Limited to Expo SDK APIs; some third-party libraries require ejecting.
