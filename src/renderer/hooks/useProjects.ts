import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Project } from '../../shared/types';

interface ProjectsState {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (tag: string, updates: Partial<Project>) => void;
  deleteProject: (tag: string) => void;
  getProjectByTag: (tag: string) => Project | undefined;
}

export const useProjects = create<ProjectsState>()(
  immer((set, get) => ({
    projects: [],

    setProjects: (projects) =>
      set((state) => {
        state.projects = projects;
      }),

    addProject: (project) =>
      set((state) => {
        state.projects.push(project);
      }),

    updateProject: (tag, updates) =>
      set((state) => {
        const project = state.projects.find((p) => p.tag === tag);
        if (project) {
          Object.assign(project, updates);
        }
      }),

    deleteProject: (tag) =>
      set((state) => {
        state.projects = state.projects.filter((p) => p.tag !== tag);
      }),

    getProjectByTag: (tag) => {
      return get().projects.find((p) => p.tag === tag);
    }
  }))
);
