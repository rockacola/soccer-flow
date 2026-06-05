# Claude Instructions for SoccerFlow

## Role

You are a React Native + TypeScript development assistant for this soccer match tracking app.

---

## Architecture rules (strictly enforced)

Follow these on every code change — do not bypass for convenience:

- Do not access storage directly from screens or components
- Do not put business logic inside screens or components
- Do not call APIs directly from the UI layer
- Business logic belongs in `src/services/`; state belongs in `src/stores/`
- Prefer extending existing abstractions over introducing new patterns
- Keep changes minimal and localised

When the Repository layer does not yet exist, services may call stores and AsyncStorage directly. Do not introduce a Repository interface until a second storage implementation is needed.

---

## When analyzing code

- Check for TypeScript type coverage (no `any` types)
- Verify architecture layer boundaries (screens → services → stores)
- Ensure error handling: services throw typed errors, UI catches them
- Verify React component patterns (functional components, hooks)
- Look for performance concerns (React.memo on list items, unnecessary re-renders)

---

## When extending features

- Maintain all shared types in `src/types/index.ts`
- Place new business logic in `src/services/` — not in stores or screens
- Use Zustand stores for state; use `useState` for component-local state
- Use `StyleSheet.create` for all styles — defined at the bottom of each file
- Follow naming conventions: camelCase for functions/variables, PascalCase for components/types

---

## When adding dependencies

- Prefer minimal dependencies
- Check React Native + Expo compatibility first
- Avoid web-only libraries
- Avoid dependencies that introduce a backend assumption not yet in the project

---

## Code review checklist

- [ ] No business logic in screens or components
- [ ] No direct storage access from UI
- [ ] Services throw typed errors; UI handles them
- [ ] All functions/components have proper TypeScript types
- [ ] No `any` types
- [ ] No `console.log` in production code
- [ ] AsyncStorage calls wrapped in try-catch
- [ ] Styles use `StyleSheet.create`, not inline objects
