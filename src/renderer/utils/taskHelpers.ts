import { v4 as uuidv4 } from 'uuid';
import type { Task, QuadrantKey } from '../../shared/types';

export function generateTaskId(): string {
  return uuidv4();
}

export function calculateOrder(tasks: Task[], position: 'start' | 'end' | number): number {
  if (tasks.length === 0) {
    return 1000;
  }

  if (position === 'start') {
    const minOrder = Math.min(...tasks.map(t => t.order));
    return minOrder - 1000;
  }

  if (position === 'end') {
    const maxOrder = Math.max(...tasks.map(t => t.order));
    return maxOrder + 1000;
  }

  // Insert at specific index
  if (position === 0) {
    return calculateOrder(tasks, 'start');
  }

  if (position >= tasks.length) {
    return calculateOrder(tasks, 'end');
  }

  // Insert between two tasks
  const prevOrder = tasks[position - 1].order;
  const nextOrder = tasks[position].order;
  return Math.floor((prevOrder + nextOrder) / 2);
}

export function needsRebalancing(tasks: Task[]): boolean {
  if (tasks.length < 2) return false;

  const sorted = [...tasks].sort((a, b) => a.order - b.order);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].order - sorted[i - 1].order < 10) {
      return true;
    }
  }
  return false;
}

export function rebalanceOrders(tasks: Task[]): Task[] {
  const sorted = [...tasks].sort((a, b) => a.order - b.order);
  return sorted.map((task, index) => ({
    ...task,
    order: (index + 1) * 1000
  }));
}

export function createDefaultTask(quadrant: QuadrantKey, order: number): Omit<Task, 'id'> {
  return {
    title: '',
    quadrant,
    order
  };
}
