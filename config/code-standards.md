# Code Standards

## Naming

- Components: PascalCase (`TeamCard`, `MatchTimer`)
- Functions and variables: camelCase (`handlePress`, `teamName`)
- Types and interfaces: PascalCase (`Team`, `MatchActivity`)
- Constants: SCREAMING_SNAKE_CASE (`STORAGE_KEY_TEAMS`)
- Files: PascalCase for components, camelCase for utilities

## File Structure

- One component per file
- Styles use `StyleSheet.create` — one `styles` object per file, defined at the bottom
- Types live in `src/types/index.ts` unless they are only used in one file
- Stores live in `src/stores/` — one file per domain

## Components

- Functional components only
- Props typed inline or as a named `Props` type at the top of the file
- No default export for non-component files (named exports only)
- Default export for screen and component files

## Comments

- No comments that describe what the code does
- Comments only for non-obvious constraints or workarounds
- No TODO comments left in merged code

## Error Handling

- AsyncStorage operations: always try-catch
- Unknown errors: log to console.error in development only
- Never swallow errors silently
