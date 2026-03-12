import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export const useTheme = create<ThemeState>((set) => ({
  theme: 'light',

  setTheme: (theme) => {
    set({ theme });
    document.documentElement.setAttribute('data-theme', theme);
  },

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      return { theme: newTheme };
    })
}));
