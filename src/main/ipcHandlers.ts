import { ipcMain, dialog, BrowserWindow } from 'electron';
import type { Task, Project } from '../shared/types';
import { loadData, saveTasks, saveProjects, watchFiles, stopWatching } from './fileManager';
import { getPreferences, setPreferences } from './preferencesManager';

export function registerIpcHandlers(): void {
  // Folder selection
  ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory'],
      title: 'Select Task Storage Folder',
      buttonLabel: 'Select Folder'
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    return result.filePaths[0];
  });

  // Load data
  ipcMain.handle('load-data', async (_, folderPath: string) => {
    return await loadData(folderPath);
  });

  // Save tasks
  ipcMain.handle('save-tasks', async (_, folderPath: string, tasks: Task[], completedTasks: Task[]) => {
    await saveTasks(folderPath, tasks, completedTasks);
  });

  // Save projects
  ipcMain.handle('save-projects', async (_, folderPath: string, projects: Project[]) => {
    await saveProjects(folderPath, projects);
  });

  // Preferences
  ipcMain.handle('get-preferences', async () => {
    return getPreferences();
  });

  ipcMain.handle('set-preferences', async (_, prefs) => {
    setPreferences(prefs);
  });

  // File watching
  ipcMain.on('start-watching', (event, folderPath: string) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return;

    watchFiles(folderPath, (data) => {
      window.webContents.send('data-reloaded', data);
    });
  });

  ipcMain.on('stop-watching', () => {
    stopWatching();
  });
}
