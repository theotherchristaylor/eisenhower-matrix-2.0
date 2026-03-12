import { useEffect, useState } from 'react';
import { useTasks } from './hooks/useTasks';
import { useProjects } from './hooks/useProjects';
import { useTheme } from './hooks/useTheme';
import FolderPicker from './components/FolderPicker';
import Toolbar from './components/Toolbar';
import QuadrantGrid from './components/QuadrantGrid';
import CompletedPanel from './components/CompletedPanel';
import './styles/global.css';

export default function App() {
  const [storagePath, setStoragePath] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setTasks } = useTasks();
  const { setProjects } = useProjects();
  const { setTheme } = useTheme();

  useEffect(() => {
    async function init() {
      // Load preferences
      const prefs = await window.electronAPI.getPreferences();
      setTheme(prefs.theme);

      if (prefs.storageFolderPath) {
        setStoragePath(prefs.storageFolderPath);
        await loadData(prefs.storageFolderPath);
      }

      setIsLoading(false);
    }

    init();
  }, [setTheme]);

  useEffect(() => {
    // Listen for external file changes
    window.electronAPI.onDataReloaded((data) => {
      setTasks(data.tasks, data.completedTasks);
      setProjects(data.projects);
    });
  }, [setTasks, setProjects]);

  async function loadData(path: string) {
    try {
      const data = await window.electronAPI.loadData(path);
      setTasks(data.tasks, data.completedTasks);
      setProjects(data.projects);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }

  async function handleFolderSelected(path: string) {
    setStoragePath(path);
    await window.electronAPI.setPreferences({ storageFolderPath: path });
    await loadData(path);
  }

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}>
        Loading...
      </div>
    );
  }

  if (!storagePath) {
    return <FolderPicker onFolderSelected={handleFolderSelected} />;
  }

  return (
    <>
      <Toolbar
        showCompleted={showCompleted}
        onToggleCompleted={() => setShowCompleted(!showCompleted)}
        storagePath={storagePath}
        onChangeFolder={async () => {
          const path = await window.electronAPI.selectFolder();
          if (path) {
            handleFolderSelected(path);
          }
        }}
      />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <QuadrantGrid storagePath={storagePath} />
        {showCompleted && (
          <CompletedPanel storagePath={storagePath} />
        )}
      </div>
    </>
  );
}
