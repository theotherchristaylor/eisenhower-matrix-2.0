# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- macOS

## Launch the App (3 steps)

### 1. Install Dependencies
```bash
cd eisenhower-matrix-app
npm install
```

### 2. Start Development Mode
```bash
npm run dev
```

This will:
- Build the Electron app
- Start the Vite dev server
- Launch the Electron window

### 3. First Run
When the app launches:
1. Click "Select Folder" to choose where to store your tasks
2. The app will create three markdown files:
   - `tasks.md` - Your active tasks
   - `completed.md` - Completed tasks
   - `projects.md` - Project definitions

## Using the App

### Creating Tasks
1. Click the "+ Add" button in any quadrant
2. Fill in the task details:
   - **Title** (required)
   - **Project** (optional)
   - **Due Date** (optional)
   - **Notes** (optional)
3. Click "Save"

### Moving Tasks
- **Drag tasks** between quadrants to change priority
- **Drag within** a quadrant to reorder

### Editing Tasks
- **Click on a task card** to open the editor
- Make changes and click "Save"

### Completing Tasks
- **Check the checkbox** on a task card
- Task moves to completed.md
- View completed tasks by clicking "Show Completed" in toolbar

### Restoring Tasks
1. Open completed panel ("Show Completed")
2. **Uncheck a completed task**
3. Task returns to its original quadrant

### Theme
- Click the **🌙/☀️ button** in toolbar to toggle light/dark theme

### Changing Folder
- Click the **📁 button** in toolbar to select a different storage folder

## Keyboard Shortcuts
*Coming in Phase 9*

## Markdown Format

Your tasks are stored as plain markdown. Here's what `tasks.md` looks like:

```markdown
# Tasks

## Urgent & Important
- [ ] Fix login bug | project:backend | due:2026-03-15 | notes:Users can't login | id:abc-123 | order:1000

## Important & Not Urgent
- [ ] Write documentation | project:docs | id:def-456 | order:2000

## Urgent & Not Important
_No tasks_

## Not Urgent & Not Important
_No tasks_
```

## Integration with Claude Cowork

Since everything is markdown, Claude can directly edit your tasks:

```
You: Claude, add "Write unit tests" to my Eisenhower Matrix in the Important & Not Urgent quadrant

Claude: [reads tasks.md, adds the task, saves]
```

The app will automatically detect the change and reload!

## Troubleshooting

### App won't start
```bash
# Clean build and try again
rm -rf dist-electron node_modules
npm install
npm run dev
```

### Can't see my tasks
- Make sure you selected the correct folder
- Check that tasks.md exists in that folder
- Check the terminal for error messages

### Drag and drop not working
- Make sure you're clicking and holding on the task card
- Try refreshing (Cmd+R in the app window)

### Theme not persisting
- Preferences are stored in: `~/Library/Application Support/eisenhower-matrix-app/`
- Try clearing: `rm -rf ~/Library/Application\ Support/eisenhower-matrix-app/`

## Development Commands

```bash
# Development mode (hot reload)
npm run dev

# Build for production
npm run build

# Package as macOS app
npm run package
```

## What's Implemented

✅ **Working Features:**
- Four-quadrant Eisenhower Matrix
- Drag-and-drop tasks
- Create/edit/delete tasks
- Complete/restore tasks
- Project tags with colors
- Due dates
- Task notes
- Light/dark theme
- Markdown file storage
- First-run setup

🚧 **Coming Soon:**
- Project management UI
- Filter by project
- Settings panel
- Keyboard shortcuts
- Search

## Next Steps

After testing the basic functionality:
1. Try creating tasks in all four quadrants
2. Test drag-and-drop
3. Try the completed panel
4. Test theme toggle
5. Try editing tasks
6. Test external editing (edit tasks.md in VS Code while app is running)

## Support

Check `DEVELOPMENT.md` for detailed technical information.
Check `README.md` for full documentation.

---

**Enjoy organizing your tasks with the Eisenhower Matrix! 🎯**
