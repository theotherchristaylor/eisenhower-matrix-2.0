import { useState, useEffect } from 'react';
import type { Task } from '../../shared/types';
import { useProjects } from '../hooks/useProjects';

interface TaskEditorProps {
  task?: Task;
  onSave: (data: Partial<Task>) => void;
  onCancel: () => void;
}

export default function TaskEditor({ task, onSave, onCancel }: TaskEditorProps) {
  const { projects } = useProjects();
  const [title, setTitle] = useState(task?.title || '');
  const [project, setProject] = useState(task?.project || '');
  const [due, setDue] = useState(task?.due || '');
  const [notes, setNotes] = useState(task?.notes || '');

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onCancel();
      }
    }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      project: project || undefined,
      due: due || undefined,
      notes: notes.trim() || undefined
    });
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: 'var(--color-background)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          width: '500px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>
          {task ? 'Edit Task' : 'New Task'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '6px'
            }}>
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              autoFocus
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text)'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '6px'
            }}>
              Project
            </label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text)'
              }}
            >
              <option value="">None</option>
              {projects.map((p) => (
                <option key={p.tag} value={p.tag}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '6px'
            }}>
              Due Date
            </label>
            <input
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text)'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '6px'
            }}>
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              rows={4}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text)',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'transparent',
                color: 'var(--color-text)',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: title.trim() ? 'var(--color-primary)' : 'var(--color-border)',
                color: 'white',
                cursor: title.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
