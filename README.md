# Eisenhower Matrix for macOS

A clean, fast, native macOS app for prioritizing tasks using the Eisenhower Matrix. No subscriptions, no accounts, no cloud — just a simple app that helps you focus on what actually matters.

![Eisenhower Matrix App](assets/icon.icns)

---

## What is the Eisenhower Matrix?

The Eisenhower Matrix (also called the Urgent-Important Matrix) is a productivity framework that divides your tasks into four quadrants:

| | **Urgent** | **Not Urgent** |
|---|---|---|
| **Important** | **Do First** — crises, deadlines | **Schedule** — growth, planning |
| **Not Important** | **Delegate** — interruptions | **Eliminate** — busywork |

Most to-do apps treat all tasks equally. This one doesn't.

---

## Download & Install

1. Go to the [Releases](../../releases) page and download the latest `.dmg`
2. Open the DMG and drag **Eisenhower Matrix** to your Applications folder
3. Launch it from Launchpad or Spotlight

> **First launch:** macOS may show a security warning since the app isn't notarized. Right-click the app → **Open** → **Open** to bypass it. You only need to do this once.

---

## Features

- **Four-quadrant layout** — your tasks always in context, never in a flat list
- **Drag and drop** — move tasks between quadrants or reorder within them
- **Project tags** — color-coded labels to group tasks by project or area of life
- **Project filtering** — focus on one project at a time across all quadrants
- **Completed tasks panel** — review what you've done; restore tasks if needed
- **Dark and light mode** — follows your preference
- **Stores data as plain Markdown** — your tasks live in readable `.md` files you own
- **Watches for external changes** — edit your task files in another app and the UI updates automatically
- **No internet required** — fully offline, always

---

## Your data

Tasks are saved as plain Markdown files in a folder you choose:

```
tasks.md       — active tasks, organized by quadrant
completed.md   — completed tasks with timestamps
projects.md    — your project tag definitions
```

You own your data. Back it up with Time Machine, sync it with iCloud or Dropbox, put it in a git repo, or read it with any text editor. Because it's Markdown, AI tools like Claude can also read and write your tasks directly.

---

## Build from source

If you'd prefer to build it yourself:

```bash
git clone https://github.com/theotherchristaylor/eisenhower-matrix-2.0.git
cd eisenhower-matrix-2.0/eisenhower-matrix-app
npm install
npm run package
```

The app will be built to `dist/Eisenhower Matrix-*.dmg`.

**Requirements:** Node.js 18+, macOS (Apple Silicon)

---

## Contributing

Issues and pull requests are welcome. This is a small personal project — keep contributions focused and practical.

---

## License

MIT — free to use, modify, and distribute.
