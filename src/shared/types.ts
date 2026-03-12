// Core type definitions shared across main and renderer processes

export type QuadrantKey =
  | 'urgent-important'
  | 'important-not-urgent'
  | 'urgent-not-important'
  | 'not-urgent-not-important';

export interface Task {
  id: string; // UUID
  title: string;
  quadrant: QuadrantKey;
  project?: string; // project tag key
  due?: string; // YYYY-MM-DD
  notes?: string;
  order: number; // Manual sort order
  completed?: string; // ISO timestamp
  fromQuadrant?: QuadrantKey; // For restoration from completed
  createdAt?: string; // ISO timestamp
}

export interface Project {
  tag: string; // Unique key (lowercase-dash-case)
  label: string; // Display name
  color: string; // Hex color
}

export interface Preferences {
  storageFolderPath?: string;
  theme: 'light' | 'dark';
}

// IPC API type definitions
export interface ElectronAPI {
  // File operations
  selectFolder: () => Promise<string | null>;
  loadData: (folderPath: string) => Promise<{
    tasks: Task[];
    completedTasks: Task[];
    projects: Project[];
  }>;
  saveTasks: (folderPath: string, tasks: Task[], completedTasks: Task[]) => Promise<void>;
  saveProjects: (folderPath: string, projects: Project[]) => Promise<void>;

  // Preferences
  getPreferences: () => Promise<Preferences>;
  setPreferences: (prefs: Partial<Preferences>) => Promise<void>;

  // File watching
  onDataReloaded: (callback: (data: {
    tasks: Task[];
    completedTasks: Task[];
    projects: Project[];
  }) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
