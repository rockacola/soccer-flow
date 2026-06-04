# Get Started

SoccerFlow is a React Native + Expo app. It runs on device via Expo Go during development — no Xcode or Android Studio required.

---

## Prerequisites

| Tool    | Version | How to get it                 |
| ------- | ------- | ----------------------------- |
| Node.js | 24+     | nodejs.org or version manager |
| Expo Go | latest  | App Store                     |

---

## One-time setup

```bash
npm install
```

---

## Day-to-day

Start the dev server:

```bash
npm start
```

Open Expo Go on your iPhone and scan the QR code in the terminal.

---

## Available commands

| Command             | What it does                     |
| ------------------- | -------------------------------- |
| `npm start`         | Start the Expo dev server        |
| `npm run ios`       | Start with iOS simulator         |
| `npm run android`   | Start with Android emulator      |
| `npm run check`     | Format + lint:fix + typecheck    |
| `npm run format`    | Prettier-format all source files |
| `npm run lint:fix`  | ESLint fix all source files      |
| `npm run typecheck` | TypeScript type check (no emit)  |

---

## IDE setup

- VSCode with the ESLint and Prettier extensions
- Enable **Format on Save** (`editor.formatOnSave: true`)
- TypeScript version: use workspace version

---

## Further reading

- [docs/overview.md](overview.md) — architecture and data flow
- [docs/tasks.md](tasks.md) — what's built and what's next
- [docs/decisions.md](decisions.md) — architecture decisions with rationale
