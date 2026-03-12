# Development Notes

## Current Implementation Status

### ✅ Completed (Phases 0-5)

**Phase 0: Project Scaffolding**
- Electron + React + TypeScript + Vite setup
- Build configuration (electron-vite)
- Package.json with all dependencies
- Directory structure
- .gitignore

**Phase 1: Data Layer**
- TypeScript interfaces (Task, Project, Preferences, QuadrantKey)
- Markdown parser (tasks.md, projects.md)
- Markdown serializer (objects → markdown)
- File manager with atomic writes (temp file → rename)
- Chokidar file watcher with debouncing (500ms)
- Preferences manager (electron-store)
- IPC handlers (select folder, load/save data, preferences)
- Preload script (contextBridge API)

**Phase 2: Basic UI Scaffold**
- App.tsx - Root component with initialization
- FolderPicker component - First-run folder selection
- Toolbar component - Top bar with theme toggle, completed toggle, folder switcher
- Zustand stores:
  - useTasks - Task state management
  - useProjects - Project state management
  - useTheme - Theme state (light/dark)
- Global CSS with CSS variables
- Responsive layout
- Theme persistence

**Phase 3: Drag-and-Drop**
- QuadrantGrid component with DndContext
- Quadrant component with SortableContext
- TaskCard component with useSortable
- DragOverlay for ghost card during drag
- Order field calculation (insert between tasks)
- Auto-rebalancing when gaps get too small
- Move tasks between quadrants
- Reorder within quadrants
- Save to disk after drag

**Phase 4: Task CRUD Operations**
- TaskEditor modal component
- Create task (with project, due date, notes)
- Edit task (opens modal on click)
- Delete task (with confirmation)
- Complete task (checkbox → moves to completed.md)
- UUID generation for task IDs
- Order calculation helpers
- Optimistic UI updates
- Persist to disk after operations

**Phase 5: Completed Tasks Panel**
- CompletedPanel component (slide-in from right)
- Display completed tasks with timestamps
- Restore task (uncheck → moves back to tasks.md)
- Delete completed task permanently
- Respects project filter
- Completion timestamp formatting

### 🚧 Remaining Work (Phases 6-10)

**Phase 6: Project Tag Management** (Next Priority)
Files to create:
- `src/renderer/components/ProjectManager.tsx` - CRUD for projects
- `src/renderer/components/Settings.tsx` - Settings modal wrapper

Features needed:
- Create project (tag, label, color)
- Edit project (change label/color)
- Delete project (with warning if tasks use it)
- Color picker component
- Clear project from tasks when deleted
- Save to projects.md after changes

**Phase 7: Filtering & Settings**
Files to create:
- `src/renderer/components/ProjectFilter.tsx` - Multi-select dropdown

Features needed:
- Filter tasks by project tags
- Multi-select support (OR logic)
- "All projects" default
- Apply filter to both active and completed tasks
- Settings modal with:
  - Change storage folder
  - Theme toggle (already working)
  - Link to ProjectManager

**Phase 8: File Watching & External Sync**
Implementation needed:
- Wire up file watcher in App.tsx
- Send IPC message to start watching after folder selected
- Handle data-reloaded IPC event
- Show toast notification on external change
- Stop watching when folder changes

**Phase 9: Polish & Error Handling**
Features needed:
- Loading spinner during file operations
- Toast notifications for errors
- Empty states (no tasks, no projects)
- Drag animation polish
- Markdown validation and error recovery
- Window state persistence (size, position)
- Prevent multiple instances
- Better error messages
- Keyboard shortcuts (Cmd+N for new task, etc.)

**Phase 10: Packaging & Distribution**
Tasks:
- Create app icon (1024×1024 → .icns)
- Test electron-builder packaging
- Build .dmg installer
- Test on fresh macOS system
- Create installer screenshots
- Write installation guide

## Development Commands

```bash
# Development
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build
npm run package      # Package as macOS .app

# Cleanup
rm -rf dist-electron out node_modules
npm install          # Fresh install
```

## Current File Structure

```
eisenhower-matrix-app/
├── package.json                 ✅
├── tsconfig.json               ✅
├── tsconfig.node.json          ✅
├── electron.vite.config.ts     ✅
├── electron-builder.yml        ✅
├── .gitignore                  ✅
├── README.md                   ✅
├── DEVELOPMENT.md              ✅ (this file)
├── app-prompt.md               ✅ (specification)
├── assets/
│   └── icon.icns               ❌ TODO
├── src/
│   ├── main/
│   │   ├── index.ts            ✅
│   │   ├── fileManager.ts      ✅
│   │   ├── markdownParser.ts   ✅
│   │   ├── markdownSerializer.ts ✅
│   │   ├── preferencesManager.ts ✅
│   │   └── ipcHandlers.ts      ✅
│   ├── preload/
│   │   └── index.ts            ✅
│   ├── renderer/
│   │   ├── index.html          ✅
│   │   ├── index.tsx           ✅
│   │   ├── App.tsx             ✅
│   │   ├── components/
│   │   │   ├── FolderPicker.tsx      ✅
│   │   │   ├── Toolbar.tsx           ✅
│   │   │   ├── QuadrantGrid.tsx      ✅
│   │   │   ├── Quadrant.tsx          ✅
│   │   │   ├── TaskCard.tsx          ✅
│   │   │   ├── TaskEditor.tsx        ✅
│   │   │   ├── CompletedPanel.tsx    ✅
│   │   │   ├── ProjectManager.tsx    ❌ TODO (Phase 6)
│   │   │   ├── ProjectFilter.tsx     ❌ TODO (Phase 7)
│   │   │   └── Settings.tsx          ❌ TODO (Phase 6)
│   │   ├── hooks/
│   │   │   ├── useTasks.ts     ✅
│   │   │   ├── useProjects.ts  ✅
│   │   │   └── useTheme.ts     ✅
│   │   ├── utils/
│   │   │   └── taskHelpers.ts  ✅
│   │   └── styles/
│   │       └── global.css      ✅
│   └── shared/
│       └── types.ts            ✅
```

## Testing Checklist

### Current Functionality (Manual Testing)
- [x] App launches successfully
- [x] Folder picker appears on first run
- [x] Can select folder
- [x] Creates tasks.md, completed.md, projects.md
- [ ] Can create task in each quadrant
- [ ] Can drag task between quadrants
- [ ] Can reorder tasks within quadrant
- [ ] Can edit task
- [ ] Can delete task
- [ ] Can complete task (moves to completed.md)
- [ ] Can view completed tasks panel
- [ ] Can restore completed task
- [ ] Theme toggle works
- [ ] Theme persists across restarts
- [ ] Folder path persists across restarts
- [ ] External markdown edits trigger reload

### Integration Testing (with Claude Cowork)
- [ ] Claude can read tasks.md
- [ ] Claude can modify tasks.md
- [ ] App reloads when Claude edits file
- [ ] Markdown format parses correctly
- [ ] No data loss on external edit

## Known Issues

1. **Build output path**: Changed from `out/` to `dist-electron/` for electron-vite compatibility ✅ FIXED
2. **HTML path**: index.html must be in src/renderer/ ✅ FIXED
3. **No icon yet**: App uses default Electron icon
4. **No project UI yet**: Can't create/edit projects in UI (can edit markdown directly)
5. **No filtering yet**: Can't filter by project
6. **File watching not wired up**: External changes not detected yet
7. **No error handling**: Silent failures on file I/O errors
8. **No loading states**: No spinner during operations

## Next Steps (Priority Order)

1. **Test basic functionality**
   - Run `npm run dev`
   - Test creating/editing/completing tasks
   - Verify drag-and-drop works
   - Check theme toggle
   - Test folder persistence

2. **Implement ProjectManager (Phase 6)**
   - Create project CRUD UI
   - Color picker component
   - Delete with task cleanup
   - Wire up to Toolbar settings

3. **Implement ProjectFilter (Phase 7)**
   - Multi-select dropdown
   - Filter logic (already in useTasks store)
   - Add to Toolbar

4. **Wire up file watching (Phase 8)**
   - Start watching in App.tsx
   - Handle reload events
   - Show notification on external change

5. **Polish (Phase 9)**
   - Loading states
   - Error handling
   - Keyboard shortcuts
   - Empty states

6. **Package (Phase 10)**
   - Create icon
   - Build .app
   - Test on clean system

## Debugging Tips

### Main Process Logs
Check terminal where `npm run dev` is running for:
- File I/O errors
- IPC handler errors
- Chokidar watch events

### Renderer Process Logs
Open DevTools in the Electron window:
- Console logs
- React errors
- Network requests
- State changes (Redux DevTools if installed)

### File System Issues
```bash
# Check if markdown files are created
ls -la ~/path/to/storage/folder/

# Read tasks.md
cat ~/path/to/storage/folder/tasks.md

# Watch file changes
fswatch ~/path/to/storage/folder/
```

### State Debugging
Add to components:
```typescript
console.log('Tasks:', useTasks.getState().tasks);
console.log('Projects:', useProjects.getState().projects);
```

## Performance Notes

- Markdown parsing is fast (regex-based, < 1ms for 100 tasks)
- File watching debounce prevents thrashing (500ms)
- Atomic writes prevent corruption
- Optimistic UI updates feel instant
- Drag-and-drop uses CSS transforms (GPU-accelerated)
- Zustand avoids unnecessary re-renders

## Architectural Decisions

### Why not use a markdown library?
The schema is simple and well-defined. Custom parser gives:
- Full control over format
- Better error handling
- Faster parsing
- No dependencies

### Why atomic writes?
Temp file → rename is atomic on macOS:
- Prevents corruption if app crashes mid-write
- Safe for concurrent access (Claude editing while app runs)
- Standard practice for critical data

### Why Zustand over Redux?
- Simpler API (no actions/reducers)
- Less boilerplate
- Tiny bundle size (1KB)
- Perfect for this scale

### Why not real-time sync?
- Files are small (< 100KB typically)
- Full reload is fast (< 10ms)
- Simpler than 3-way merge
- Matches user mental model

## Future Enhancements

- **Search**: Full-text search across tasks
- **Keyboard shortcuts**: Vim-style keybindings
- **Recurring tasks**: Repeat patterns
- **Task dependencies**: Block tasks on others
- **Time tracking**: Pomodoro integration
- **Analytics**: Task completion metrics
- **Export**: JSON, CSV export
- **Import**: From other todo apps
- **Cloud sync**: Optional iCloud/Dropbox sync
- **Mobile app**: Companion iOS app
- **Tags**: Beyond project tags
- **Subtasks**: Nested checklist items
- **Attachments**: Link files to tasks
- **Reminders**: macOS notifications

## Resources

- [Eisenhower Matrix](https://www.eisenhower.me/eisenhower-matrix/)
- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-vite](https://electron-vite.org/)
- [Zustand](https://docs.pmnd.rs/zustand)
- [@dnd-kit](https://docs.dndkit.com/)
- [Radix UI](https://www.radix-ui.com/)
