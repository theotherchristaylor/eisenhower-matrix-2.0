import type { Task, Project, QuadrantKey } from '../shared/types';

const QUADRANT_LABELS: Record<QuadrantKey, string> = {
  'urgent-important': 'Urgent & Important',
  'important-not-urgent': 'Important & Not Urgent',
  'urgent-not-important': 'Urgent & Not Important',
  'not-urgent-not-important': 'Not Urgent & Not Important'
};

export function serializeTasksMarkdown(tasks: Task[]): string {
  // Group tasks by quadrant
  const tasksByQuadrant: Record<QuadrantKey, Task[]> = {
    'urgent-important': [],
    'important-not-urgent': [],
    'urgent-not-important': [],
    'not-urgent-not-important': []
  };

  for (const task of tasks) {
    tasksByQuadrant[task.quadrant].push(task);
  }

  // Sort tasks within each quadrant by order
  for (const quadrant in tasksByQuadrant) {
    tasksByQuadrant[quadrant as QuadrantKey].sort((a, b) => a.order - b.order);
  }

  // Build markdown
  const lines: string[] = ['# Tasks', ''];

  const quadrantOrder: QuadrantKey[] = [
    'urgent-important',
    'important-not-urgent',
    'urgent-not-important',
    'not-urgent-not-important'
  ];

  for (const quadrant of quadrantOrder) {
    const tasks = tasksByQuadrant[quadrant];
    lines.push(`## ${QUADRANT_LABELS[quadrant]}`, '');

    if (tasks.length === 0) {
      lines.push('_No tasks_', '');
    } else {
      for (const task of tasks) {
        lines.push(serializeTask(task));
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

function serializeTask(task: Task): string {
  const checkbox = task.completed ? '[x]' : '[ ]';
  const parts = [task.title];

  if (task.project) {
    parts.push(`project:${task.project}`);
  }
  if (task.due) {
    parts.push(`due:${task.due}`);
  }
  if (task.notes) {
    parts.push(`notes:${task.notes}`);
  }
  parts.push(`id:${task.id}`);
  parts.push(`order:${task.order}`);

  if (task.completed) {
    parts.push(`completed:${task.completed}`);
  }
  if (task.fromQuadrant) {
    parts.push(`from-quadrant:${task.fromQuadrant}`);
  }
  if (task.createdAt) {
    parts.push(`created:${task.createdAt}`);
  }

  return `- ${checkbox} ${parts.join(' | ')}`;
}

export function serializeProjectsMarkdown(projects: Project[]): string {
  const lines: string[] = ['# Projects', ''];

  if (projects.length === 0) {
    lines.push('_No projects_');
  } else {
    for (const project of projects) {
      lines.push(serializeProject(project));
    }
  }

  return lines.join('\n');
}

function serializeProject(project: Project): string {
  return `- ${project.tag} | label:${project.label} | color:${project.color}`;
}
