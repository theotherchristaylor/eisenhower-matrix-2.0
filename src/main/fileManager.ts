import { promises as fs } from 'fs';
import { join } from 'path';
import chokidar from 'chokidar';
import type { Task, Project } from '../shared/types';
import { parseTasksMarkdown, parseProjectsMarkdown } from './markdownParser';
import { serializeTasksMarkdown, serializeProjectsMarkdown } from './markdownSerializer';

let watcher: chokidar.FSWatcher | null = null;
let reloadCallback: ((data: { tasks: Task[]; completedTasks: Task[]; projects: Project[] }) => void) | null = null;

// Debounce timer for file changes
let debounceTimer: NodeJS.Timeout | null = null;
const DEBOUNCE_DELAY = 500;

export async function loadData(folderPath: string): Promise<{
  tasks: Task[];
  completedTasks: Task[];
  projects: Project[];
}> {
  const tasksPath = join(folderPath, 'tasks.md');
  const completedPath = join(folderPath, 'completed.md');
  const projectsPath = join(folderPath, 'projects.md');

  let tasks: Task[] = [];
  let completedTasks: Task[] = [];
  let projects: Project[] = [];

  try {
    const tasksContent = await fs.readFile(tasksPath, 'utf-8');
    tasks = parseTasksMarkdown(tasksContent);
  } catch (error) {
    // File doesn't exist yet, start with empty array
    console.log('tasks.md not found, starting fresh');
  }

  try {
    const completedContent = await fs.readFile(completedPath, 'utf-8');
    completedTasks = parseTasksMarkdown(completedContent);
  } catch (error) {
    console.log('completed.md not found, starting fresh');
  }

  try {
    const projectsContent = await fs.readFile(projectsPath, 'utf-8');
    projects = parseProjectsMarkdown(projectsContent);
  } catch (error) {
    console.log('projects.md not found, starting fresh');
  }

  return { tasks, completedTasks, projects };
}

export async function saveTasks(
  folderPath: string,
  tasks: Task[],
  completedTasks: Task[]
): Promise<void> {
  const tasksPath = join(folderPath, 'tasks.md');
  const completedPath = join(folderPath, 'completed.md');

  const tasksContent = serializeTasksMarkdown(tasks);
  const completedContent = serializeTasksMarkdown(completedTasks);

  // Atomic write: write to temp file, then rename
  await atomicWrite(tasksPath, tasksContent);
  await atomicWrite(completedPath, completedContent);
}

export async function saveProjects(folderPath: string, projects: Project[]): Promise<void> {
  const projectsPath = join(folderPath, 'projects.md');
  const content = serializeProjectsMarkdown(projects);
  await atomicWrite(projectsPath, content);
}

async function atomicWrite(filePath: string, content: string): Promise<void> {
  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(tempPath, content, 'utf-8');
  await fs.rename(tempPath, filePath);
}

export function watchFiles(
  folderPath: string,
  callback: (data: { tasks: Task[]; completedTasks: Task[]; projects: Project[] }) => void
): void {
  // Stop existing watcher if any
  if (watcher) {
    watcher.close();
  }

  reloadCallback = callback;

  const tasksPath = join(folderPath, 'tasks.md');
  const completedPath = join(folderPath, 'completed.md');
  const projectsPath = join(folderPath, 'projects.md');

  watcher = chokidar.watch([tasksPath, completedPath, projectsPath], {
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 50
    }
  });

  watcher.on('change', async () => {
    // Debounce rapid changes
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(async () => {
      try {
        const data = await loadData(folderPath);
        reloadCallback?.(data);
      } catch (error) {
        console.error('Error reloading data:', error);
      }
    }, DEBOUNCE_DELAY);
  });
}

export function stopWatching(): void {
  if (watcher) {
    watcher.close();
    watcher = null;
  }
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  reloadCallback = null;
}
