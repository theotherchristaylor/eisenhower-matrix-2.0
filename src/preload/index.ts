import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronAPI } from '../shared/types';

const electronAPI: ElectronAPI = {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  loadData: (folderPath: string) => ipcRenderer.invoke('load-data', folderPath),
  saveTasks: (folderPath: string, tasks, completedTasks) =>
    ipcRenderer.invoke('save-tasks', folderPath, tasks, completedTasks),
  saveProjects: (folderPath: string, projects) =>
    ipcRenderer.invoke('save-projects', folderPath, projects),
  getPreferences: () => ipcRenderer.invoke('get-preferences'),
  setPreferences: (prefs) => ipcRenderer.invoke('set-preferences', prefs),
  onDataReloaded: (callback) => {
    ipcRenderer.on('data-reloaded', (_, data) => callback(data));
  }
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
