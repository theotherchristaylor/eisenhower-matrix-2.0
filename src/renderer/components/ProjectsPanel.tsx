import { useState } from 'react';
import type { Project } from '../../shared/types';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';

interface ProjectsPanelProps {
  storagePath: string;
  onClose: () => void;
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'
];

function labelToTag(label: string): string {
  return label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const inputStyle = {
  width: '100%',
  padding: '7px 10px',
  fontSize: '14px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--color-background)',
  color: 'var(--color-text)',
  boxSizing: 'border-box' as const
};

export default function ProjectsPanel({ storagePath, onClose }: ProjectsPanelProps) {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const { clearProjectTag } = useTasks();

  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editColor, setEditColor] = useState('');

  const [newLabel, setNewLabel] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);

  async function saveProjects() {
    const { projects: all } = useProjects.getState();
    await window.electronAPI.saveProjects(storagePath, all);
  }

  async function saveTasks() {
    const { tasks, completedTasks } = useTasks.getState();
    await window.electronAPI.saveTasks(storagePath, tasks, completedTasks);
  }

  async function handleAdd() {
    const label = newLabel.trim();
    if (!label) return;
    const tag = labelToTag(label);
    if (projects.some((p) => p.tag === tag)) return;
    addProject({ tag, label, color: newColor });
    await saveProjects();
    setNewLabel('');
    setNewColor(PRESET_COLORS[0]);
  }

  function startEdit(project: Project) {
    setEditingTag(project.tag);
    setEditLabel(project.label);
    setEditColor(project.color);
  }

  async function handleSaveEdit(tag: string) {
    if (!editLabel.trim()) return;
    updateProject(tag, { label: editLabel.trim(), color: editColor });
    await saveProjects();
    setEditingTag(null);
  }

  async function handleDelete(tag: string) {
    const { tasks, completedTasks } = useTasks.getState();
    const affected = [...tasks, ...completedTasks].filter((t) => t.project === tag).length;
    const msg = affected > 0
      ? `Delete this project? ${affected} task(s) will lose their project tag.`
      : 'Delete this project?';
    if (!confirm(msg)) return;
    clearProjectTag(tag);
    deleteProject(tag);
    await saveProjects();
    await saveTasks();
  }

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--color-background)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          width: '480px',
          maxWidth: '90vw',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Manage Projects</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
          >
            ×
          </button>
        </div>

        {/* Project list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {projects.length === 0 && (
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px', textAlign: 'center', padding: '16px 0' }}>
              No projects yet
            </div>
          )}
          {projects.map((project) =>
            editingTag === project.tag ? (
              <div key={project.tag} style={{
                border: '1px solid var(--color-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <input
                  type="text"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  autoFocus
                  style={inputStyle}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="color"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    style={{ width: '40px', height: '32px', padding: '2px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setEditColor(c)}
                        style={{
                          width: '20px', height: '20px', borderRadius: '50%',
                          backgroundColor: c, border: editColor === c ? '2px solid var(--color-text)' : '2px solid transparent',
                          cursor: 'pointer', padding: 0
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setEditingTag(null)}
                    style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'transparent', color: 'var(--color-text)', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveEdit(project.tag)}
                    disabled={!editLabel.trim()}
                    style={{ padding: '6px 12px', fontSize: '13px', border: 'none', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-primary)', color: 'white', cursor: 'pointer' }}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div key={project.tag} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface)'
              }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: project.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{project.label}</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginLeft: '8px' }}>{project.tag}</span>
                </div>
                <button
                  onClick={() => startEdit(project)}
                  style={{ padding: '4px 8px', fontSize: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'transparent', color: 'var(--color-text)', cursor: 'pointer' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.tag)}
                  style={{ padding: '4px 8px', fontSize: '12px', border: 'none', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>
            )
          )}
        </div>

        {/* Add new project */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Add Project</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
              placeholder="Project name"
              style={inputStyle}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                style={{ width: '40px', height: '32px', padding: '2px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewColor(c)}
                    style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      backgroundColor: c, border: newColor === c ? '2px solid var(--color-text)' : '2px solid transparent',
                      cursor: 'pointer', padding: 0
                    }}
                  />
                ))}
              </div>
              <button
                onClick={handleAdd}
                disabled={!newLabel.trim()}
                style={{
                  padding: '6px 16px', fontSize: '13px', border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: newLabel.trim() ? 'var(--color-primary)' : 'var(--color-border)',
                  color: 'white', cursor: newLabel.trim() ? 'pointer' : 'not-allowed',
                  whiteSpace: 'nowrap'
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
