# ADR-005: StyleSheet for Styling (NativeWind deferred)

## Status

accepted

## Context

NativeWind v4 introduced a hard dependency on `react-native-css-interop` which has peer dependency conflicts with the current React Native version. Resolving it required `--legacy-peer-deps` throughout, making the project uninstallable with a plain `npm install`. StyleSheet is the zero-dependency standard and works everywhere without configuration.

## Decision

Use React Native's built-in `StyleSheet` for all component styles. NativeWind is not used.

## Consequences

More verbose than Tailwind utility classes. NativeWind can be re-evaluated once it has stable SDK 56 support and clean peer dependencies.
