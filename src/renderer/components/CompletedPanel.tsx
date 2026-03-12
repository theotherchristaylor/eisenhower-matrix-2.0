import { format } from 'date-fns';
import type { Task } from '../../shared/types';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';

interface CompletedPanelProps {
  storagePath: string;
}

export default function CompletedPanel({ storagePath }: CompletedPanelProps) {
  const { restoreTask, deleteTask, getFilteredCompletedTasks } = useTasks();
  const { getProjectByTag } = useProjects();

  const completedTasks = getFilteredCompletedTasks();

  async function handleRestore(id: string) {
    restoreTask(id);
    const { tasks, completedTasks } = useTasks.getState();
    await window.electronAPI.saveTasks(storagePath, tasks, completedTasks);
  }

  async function handleDelete(id: string) {
    if (confirm('Permanently delete this task?')) {
      deleteTask(id);
      const { tasks, completedTasks } = useTasks.getState();
      await window.electronAPI.saveTasks(storagePath, tasks, completedTasks);
    }
  }

  return (
    <div style={{
      width: '350px',
      backgroundColor: 'var(--color-surface)',
      borderLeft: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600 }}>
          Completed Tasks
        </h2>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {completedTasks.length === 0 ? (
          <div style={{
            color: 'var(--color-text-secondary)',
            fontSize: '14px',
            textAlign: 'center',
            marginTop: '24px'
          }}>
            No completed tasks
          </div>
        ) : (
          completedTasks.map((task) => {
            const project = task.project ? getProjectByTag(task.project) : null;

            return (
              <div
                key={task.id}
                style={{
                  backgroundColor: 'var(--color-background)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start'
                }}>
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => handleRestore(task.id)}
                    style={{
                      marginTop: '2px',
                      cursor: 'pointer',
                      width: '16px',
                      height: '16px'
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      marginBottom: '4px',
                      textDecoration: 'line-through',
                      color: 'var(--color-text-secondary)'
                    }}>
                      {task.title}
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap',
                      alignItems: 'center'
                    }}>
                      {project && (
                        <span style={{
                          fontSize: '12px',
                          padding: '2px 8px',
                          backgroundColor: project.color,
                          color: 'white',
                          borderRadius: '4px'
                        }}>
                          {project.label}
                        </span>
                      )}

                      {task.completed && (
                        <span style={{
                          fontSize: '12px',
                          color: 'var(--color-text-secondary)'
                        }}>
                          ✓ {format(new Date(task.completed), 'MMM d, h:mm a')}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(task.id)}
                    style={{
                      padding: '4px',
                      fontSize: '12px',
                      color: 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none'
                    }}
                    title="Delete task"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
