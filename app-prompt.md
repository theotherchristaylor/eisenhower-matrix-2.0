# Eisenhower Matrix App — Product Specification

## Overview

A native macOS desktop application (Electron) for managing tasks using the Eisenhower Matrix prioritization framework. The app stores all data in a user-specified folder as markdown files, enabling integration with external tools like Claude Cowork.

---

## Platform & Distribution

- **Target platform:** macOS (Apple Silicon / M4 MacBook Air)
- **Framework:** Electron
- **Packaging:** Standalone `.app` bundle installable to `/Applications`
- **Launch behavior:** Double-click icon to open; no server, no browser, no terminal required
- **Icon:** Custom app icon (Eisenhower grid motif)

---

## Data Storage

### File Location
- On first launch, the app prompts the user to choose a folder for storing task data
- The chosen folder path is persisted in the app's local preferences
- The user can change the storage folder at any time via Settings

### File Format
- All task data is stored as **Markdown** for human readability and easy consumption by Claude / LLMs
- The storage folder contains:
  - `tasks.md` — All active tasks
  - `completed.md` — All completed tasks
  - `projects.md` — Project tag definitions

### Markdown Schema

#### `tasks.md`
```markdown
# Eisenhower Matrix Tasks

## Urgent & Important
- [ ] {task title} | project:{project-tag} | due:{YYYY-MM-DD} | notes:{text} | id:{uuid} | order:{int}
- [ ] {task title} | project:{project-tag} | due:{YYYY-MM-DD} | notes:{text} | id:{uuid} | order:{int}

## Important & Not Urgent
- [ ] ...

## Urgent & Not Important
- [ ] ...

## Not Urgent & Not Important
- [ ] ...
```

#### `completed.md`
```markdown
# Completed Tasks

- [x] {task title} | project:{project-tag} | due:{YYYY-MM-DD} | notes:{text} | id:{uuid} | completed:{ISO-timestamp} | from-quadrant:{quadrant-key}
```

- Most recently completed tasks appear at the top of the list
- `from-quadrant` preserves which quadrant the task came from, so unchecking restores it to the correct location

#### `projects.md`
```markdown
# Projects

- {project-tag} | label:{Display Name} | color:{hex-color}
```

---

## Core Features

### 1. Quadrant View (Default View)

The main interface is a 2×2 grid representing the four Eisenhower quadrants:

| | **Urgent** | **Not Urgent** |
|---|---|---|
| **Important** | Q1: Do First | Q2: Schedule |
| **Not Important** | Q3: Delegate | Q4: Eliminate |

- Each quadrant displays its tasks as a scrollable list
- Tasks show: title, project tag (color-coded chip/badge), and due date (if set)
- Quadrant headers use clear labels (e.g., "Do First — Urgent & Important")

### 2. Drag and Drop

- **Between quadrants:** Click and drag a task from one quadrant to another. The task's quadrant assignment updates immediately and the file is saved.
- **Within a quadrant:** Click and drag to reorder tasks. The manual sort order is preserved via the `order` field.
- Visual feedback during drag: ghost/shadow of the task card, drop target highlighting on the destination quadrant.

### 3. Task Management

#### Create a Task
- "Add task" button within each quadrant (places new task in that quadrant)
- Required: Title
- Optional: Project tag (dropdown of existing tags), due date (date picker), notes (text field)
- New tasks appear at the bottom of the quadrant by default

#### Edit a Task
- Click on a task to open an edit panel/modal
- All fields are editable: title, quadrant, project tag, due date, notes

#### Complete a Task
- Checkbox on each task card
- Checking it moves the task to `completed.md` with a timestamp
- The task disappears from the quadrant view (unless completed list is visible)

#### Delete a Task
- Available from the edit panel/modal
- Confirm before permanent deletion
- Deleted tasks are removed entirely (not moved to completed)

### 4. Completed Tasks Panel

- Toggle-able panel (button in toolbar: "Show/Hide Completed")
- Displays completed tasks in reverse chronological order (most recent first)
- Each completed task shows: title, project tag, completion date, original quadrant
- **Uncheck to restore:** Unchecking a completed task moves it back to its original quadrant (`from-quadrant`) at the bottom of that quadrant's list
- Filterable by project tag (same dropdown as main view)

### 5. Project Tags

#### Project Tag Management
- Accessible via Settings or a dedicated "Manage Projects" panel
- **Create:** Name + display label + color
- **Edit:** Change name, label, or color of existing tag
- **Delete:** Remove a tag; tasks with that tag lose their project assignment (tag field cleared)

#### Project Filtering
- Dropdown in the toolbar with multi-select capability
- Options: "All" (default, shows everything) + each defined project tag
- Selecting one or more tags filters all four quadrants to only show tasks matching those tags
- The completed tasks panel also respects the active project filter

### 6. Settings

- **Storage folder:** Browse to select/change the task data folder
- **Theme:** Toggle between Light Mode and Dark Mode
- **Project tag management** (or link to management panel)

---

## UI/UX Requirements

### Layout
- **Toolbar (top):** Project filter dropdown, "Show/Hide Completed" toggle, "Add Task" button, Settings gear icon, theme toggle
- **Main area:** 2×2 quadrant grid filling the window
- **Completed panel:** Slides in from the right or bottom as an overlay/sidebar when toggled on

### Visual Design
- Clean, minimal interface — no ads, no clutter
- Project tag colors appear as small colored chips/badges on task cards
- Quadrant backgrounds should be subtly differentiated (e.g., slight color tint or border) so the grid is visually clear
- Responsive to window resizing

### Theme
- **Light mode:** Light backgrounds, dark text
- **Dark mode:** Dark backgrounds, light text
- Toggle in toolbar and/or Settings
- Persist preference across sessions

### Drag and Drop UX
- Smooth, native-feeling drag interactions
- Clear visual indicators: drag handle or grab cursor on hover, highlighted drop zones, insertion line for reordering within a quadrant
- Cancel drag with Escape key

---

## Technical Notes

### Electron Architecture
- **Main process:** File system read/write operations (tasks.md, completed.md, projects.md), app preferences (storage folder path, theme preference)
- **Renderer process:** React-based UI with drag-and-drop library (e.g., `@dnd-kit/core` or `react-beautiful-dnd`)
- File watching: The app should watch the storage folder for external changes and reload data if the files are modified outside the app (supports Cowork or manual edits)

### File I/O
- Read files on app launch and when file changes are detected
- Write files on every mutation (task create, edit, delete, complete, reorder, drag between quadrants)
- Use atomic writes (write to temp file, then rename) to prevent data corruption

### Build & Package
- Use `electron-builder` or `electron-forge` to produce a signed `.app` bundle for macOS
- Target `arm64` architecture (Apple Silicon)
- Include an app icon (`.icns` format)

---

## Out of Scope (v1)

- Recurring tasks
- Notifications / reminders
- Sync across devices
- Mobile version
- Collaboration / multi-user
- Undo/redo history
- Keyboard shortcuts (can add later)
- Import/export (the markdown files *are* the export)

---

## Summary of User Workflows

1. **Launch:** Double-click app icon → quadrant view loads with all tasks
2. **Add task:** Click "+" in a quadrant → fill in title, optionally tag and date → task appears
3. **Reprioritize:** Drag task from one quadrant to another → file updates
4. **Reorder:** Drag task up/down within a quadrant → sort order saved
5. **Complete:** Check the box → task moves to completed list
6. **Restore:** Show completed panel → uncheck a task → it returns to its original quadrant
7. **Filter by project:** Select project(s) from dropdown → view narrows to matching tasks
8. **Manage projects:** Open settings → create/edit/delete project tags with colors
9. **Integration:** Point Claude Cowork at the storage folder → it reads/writes the same markdown files
