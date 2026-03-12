import Store from 'electron-store';
import type { Preferences } from '../shared/types';

interface StoreSchema {
  storageFolderPath?: string;
  theme: 'light' | 'dark';
}

const store = new Store<StoreSchema>({
  defaults: {
    theme: 'light'
  }
});

export function getPreferences(): Preferences {
  return {
    storageFolderPath: store.get('storageFolderPath'),
    theme: store.get('theme', 'light')
  };
}

export function setPreferences(prefs: Partial<Preferences>): void {
  if (prefs.storageFolderPath !== undefined) {
    store.set('storageFolderPath', prefs.storageFolderPath);
  }
  if (prefs.theme !== undefined) {
    store.set('theme', prefs.theme);
  }
}
