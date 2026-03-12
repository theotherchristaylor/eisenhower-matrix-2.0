import type { Task, Project, QuadrantKey } from '../shared/types';

const QUADRANT_HEADERS: Record<string, QuadrantKey> = {
  'Urgent & Important': 'urgent-important',
  'Important & Not Urgent': 'important-not-urgent',
  'Urgent & Not Important': 'urgent-not-important',
  'Not Urgent & Not Important': 'not-urgent-not-important'
};

export function parseTasksMarkdown(content: string): Task[] {
  const tasks: Task[] = [];
  const lines = content.split('\n');
  let currentQuadrant: QuadrantKey | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Check for quadrant headers
    if (trimmed.startsWith('## ')) {
      const headerText = trimmed.slice(3).trim();
      currentQuadrant = QUADRANT_HEADERS[headerText] || null;
      continue;
    }

    // Parse task line
    if (trimmed.startsWith('- [')) {
      const task = parseTaskLine(trimmed, currentQuadrant);
      if (task) {
        tasks.push(task);
      }
    }
  }

  return tasks;
}

function parseTaskLine(line: string, quadrant: QuadrantKey | null): Task | null {
  // Format: - [ ] {title} | project:{tag} | due:{YYYY-MM-DD} | notes:{text} | id:{uuid} | order:{int} | completed:{timestamp} | from-quadrant:{quadrant}
  const checkboxMatch = line.match(/^- \[([ x])\] /);
  if (!checkboxMatch) return null;

  const content = line.slice(checkboxMatch[0].length);
  const parts = content.split('|').map(p => p.trim());

  const title = parts[0];
  if (!title) return null;

  const task: Partial<Task> = {
    title,
    quadrant: quadrant || 'not-urgent-not-important'
  };

  // Parse metadata
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const colonIndex = part.indexOf(':');
    if (colonIndex === -1) continue;

    const key = part.slice(0, colonIndex).trim();
    const value = part.slice(colonIndex + 1).trim();

    switch (key) {
      case 'project':
        task.project = value;
        break;
      case 'due':
        task.due = value;
        break;
      case 'notes':
        task.notes = value;
        break;
      case 'id':
        task.id = value;
        break;
      case 'order':
        task.order = parseInt(value, 10);
        break;
      case 'completed':
        task.completed = value;
        break;
      case 'from-quadrant':
        task.fromQuadrant = value as QuadrantKey;
        break;
      case 'created':
        task.createdAt = value;
        break;
    }
  }

  // Ensure required fields
  if (!task.id || task.order === undefined) {
    return null;
  }

  return task as Task;
}

export function parseProjectsMarkdown(content: string): Project[] {
  const projects: Project[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Format: - {tag} | label:{Display Name} | color:{hex-color}
    if (trimmed.startsWith('- ')) {
      const project = parseProjectLine(trimmed);
      if (project) {
        projects.push(project);
      }
    }
  }

  return projects;
}

function parseProjectLine(line: string): Project | null {
  const content = line.slice(2); // Remove "- "
  const parts = content.split('|').map(p => p.trim());

  const tag = parts[0];
  if (!tag) return null;

  const project: Partial<Project> = { tag };

  // Parse metadata
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const colonIndex = part.indexOf(':');
    if (colonIndex === -1) continue;

    const key = part.slice(0, colonIndex).trim();
    const value = part.slice(colonIndex + 1).trim();

    switch (key) {
      case 'label':
        project.label = value;
        break;
      case 'color':
        project.color = value;
        break;
    }
  }

  // Ensure required fields
  if (!project.label || !project.color) {
    return null;
  }

  return project as Project;
}
