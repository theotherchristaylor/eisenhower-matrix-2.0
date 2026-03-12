import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import ProjectsPanel from './ProjectsPanel';

interface ToolbarProps {
  showCompleted: boolean;
  onToggleCompleted: () => void;
  storagePath: string;
  onChangeFolder: () => void;
}

export default function Toolbar({
  showCompleted,
  onToggleCompleted,
  storagePath,
  onChangeFolder
}: ToolbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { projects } = useProjects();
  const { selectedProjects, setSelectedProjects } = useTasks();
  const [showProjectFilter, setShowProjectFilter] = useState(false);
  const [showProjectsPanel, setShowProjectsPanel] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowProjectFilter(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function toggleProject(tag: string) {
    if (selectedProjects.includes(tag)) {
      setSelectedProjects(selectedProjects.filter((p) => p !== tag));
    } else {
      setSelectedProjects([...selectedProjects, tag]);
    }
  }

  const filterLabel = selectedProjects.length === 0
    ? 'All Projects'
    : selectedProjects.length === 1
      ? projects.find((p) => p.tag === selectedProjects[0])?.label ?? '1 project'
      : `${selectedProjects.length} projects`;

  return (
    <>
      <div className="drag-region" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        paddingLeft: '80px',
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        minHeight: '56px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 600 }}>
            Eisenhower Matrix
          </h1>
          <div style={{
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            maxWidth: '240px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {storagePath}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Project filter */}
          <div ref={filterRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowProjectFilter((v) => !v)}
              style={{
                padding: '8px 12px',
                backgroundColor: selectedProjects.length > 0 ? 'var(--color-primary)' : 'transparent',
                color: selectedProjects.length > 0 ? 'white' : 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {filterLabel}
              <span style={{ fontSize: '10px', opacity: 0.7 }}>▼</span>
            </button>

            {showProjectFilter && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                right: 0,
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                minWidth: '180px',
                zIndex: 500,
                overflow: 'hidden'
              }}>
                <div style={{ padding: '4px 0' }}>
                  <button
                    onClick={() => setSelectedProjects([])}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      width: '100%', padding: '8px 12px', textAlign: 'left',
                      background: selectedProjects.length === 0 ? 'var(--color-surface)' : 'none',
                      border: 'none', fontSize: '14px', cursor: 'pointer',
                      color: 'var(--color-text)'
                    }}
                  >
                    <span style={{ width: '14px', fontSize: '12px', color: 'var(--color-primary)' }}>
                      {selectedProjects.length === 0 ? '✓' : ''}
                    </span>
                    All Projects
                  </button>
                  {projects.length > 0 && <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '4px 0' }} />}
                  {projects.map((project) => (
                    <button
                      key={project.tag}
                      onClick={() => toggleProject(project.tag)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        width: '100%', padding: '8px 12px', textAlign: 'left',
                        background: selectedProjects.includes(project.tag) ? 'var(--color-surface)' : 'none',
                        border: 'none', fontSize: '14px', cursor: 'pointer',
                        color: 'var(--color-text)'
                      }}
                    >
                      <span style={{ width: '14px', fontSize: '12px', color: 'var(--color-primary)' }}>
                        {selectedProjects.includes(project.tag) ? '✓' : ''}
                      </span>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: project.color, flexShrink: 0 }} />
                      {project.label}
                    </button>
                  ))}
                  {projects.length === 0 && (
                    <div style={{ padding: '8px 12px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                      No projects yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCompleted}
            style={{
              padding: '8px 16px',
              backgroundColor: showCompleted ? 'var(--color-primary)' : 'transparent',
              color: showCompleted ? 'white' : 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            {showCompleted ? 'Hide' : 'Show'} Completed
          </button>

          <button
            onClick={() => setShowProjectsPanel(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              cursor: 'pointer'
            }}
            title="Manage projects"
          >
            Projects
          </button>

          <button
            onClick={toggleTheme}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              cursor: 'pointer'
            }}
            title="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <button
            onClick={onChangeFolder}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              cursor: 'pointer'
            }}
            title="Change folder"
          >
            📁
          </button>
        </div>
      </div>

      {showProjectsPanel && (
        <ProjectsPanel
          storagePath={storagePath}
          onClose={() => setShowProjectsPanel(false)}
        />
      )}
    </>
  );
}
