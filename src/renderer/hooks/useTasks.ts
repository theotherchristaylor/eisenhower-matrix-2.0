import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Task, QuadrantKey } from '../../shared/types';
import { rebalanceOrders, needsRebalancing } from '../utils/taskHelpers';

interface TasksState {
  tasks: Task[];
  completedTasks: Task[];
  selectedProjects: string[];
  setTasks: (tasks: Task[], completedTasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  restoreTask: (id: string) => void;
  moveTask: (id: string, toQuadrant: QuadrantKey, newOrder: number) => void;
  setSelectedProjects: (projects: string[]) => void;
  clearProjectTag: (tag: string) => void;
  getFilteredTasks: () => Task[];
  getFilteredCompletedTasks: () => Task[];
}

export const useTasks = create<TasksState>()(
  immer((set, get) => ({
    tasks: [],
    completedTasks: [],
    selectedProjects: [],

    setTasks: (tasks, completedTasks) =>
      set((state) => {
        state.tasks = tasks;
        state.completedTasks = completedTasks;
      }),

    addTask: (task) =>
      set((state) => {
        state.tasks.push(task);
      }),

    updateTask: (id, updates) =>
      set((state) => {
        const task = state.tasks.find((t) => t.id === id);
        if (task) {
          Object.assign(task, updates);
        }
      }),

    deleteTask: (id) =>
      set((state) => {
        state.tasks = state.tasks.filter((t) => t.id !== id);
        state.completedTasks = state.completedTasks.filter((t) => t.id !== id);
      }),

    completeTask: (id) =>
      set((state) => {
        const taskIndex = state.tasks.findIndex((t) => t.id === id);
        if (taskIndex !== -1) {
          const task = state.tasks[taskIndex];
          task.completed = new Date().toISOString();
          task.fromQuadrant = task.quadrant;
          state.completedTasks.unshift(task);
          state.tasks.splice(taskIndex, 1);
        }
      }),

    restoreTask: (id) =>
      set((state) => {
        const taskIndex = state.completedTasks.findIndex((t) => t.id === id);
        if (taskIndex !== -1) {
          const task = state.completedTasks[taskIndex];
          delete task.completed;
          if (task.fromQuadrant) {
            task.quadrant = task.fromQuadrant;
            delete task.fromQuadrant;
          }
          // Add to end of quadrant
          const quadrantTasks = state.tasks.filter((t) => t.quadrant === task.quadrant);
          const maxOrder = quadrantTasks.length > 0
            ? Math.max(...quadrantTasks.map((t) => t.order))
            : 0;
          task.order = maxOrder + 1000;
          state.tasks.push(task);
          state.completedTasks.splice(taskIndex, 1);
        }
      }),

    moveTask: (id, toQuadrant, newOrder) =>
      set((state) => {
        const task = state.tasks.find((t) => t.id === id);
        if (task) {
          task.quadrant = toQuadrant;
          task.order = newOrder;

          // Check if rebalancing is needed
          const quadrantTasks = state.tasks.filter((t) => t.quadrant === toQuadrant);
          if (needsRebalancing(quadrantTasks)) {
            const rebalanced = rebalanceOrders(quadrantTasks);
            for (const rebalancedTask of rebalanced) {
              const t = state.tasks.find((t) => t.id === rebalancedTask.id);
              if (t) {
                t.order = rebalancedTask.order;
              }
            }
          }
        }
      }),

    setSelectedProjects: (projects) =>
      set((state) => {
        state.selectedProjects = projects;
      }),

    clearProjectTag: (tag) =>
      set((state) => {
        for (const task of state.tasks) {
          if (task.project === tag) delete task.project;
        }
        for (const task of state.completedTasks) {
          if (task.project === tag) delete task.project;
        }
        state.selectedProjects = state.selectedProjects.filter((p) => p !== tag);
      }),

    getFilteredTasks: () => {
      const { tasks, selectedProjects } = get();
      if (selectedProjects.length === 0) {
        return tasks;
      }
      return tasks.filter((task) =>
        task.project && selectedProjects.includes(task.project)
      );
    },

    getFilteredCompletedTasks: () => {
      const { completedTasks, selectedProjects } = get();
      if (selectedProjects.length === 0) {
        return completedTasks;
      }
      return completedTasks.filter((task) =>
        task.project && selectedProjects.includes(task.project)
      );
    }
  }))
);
