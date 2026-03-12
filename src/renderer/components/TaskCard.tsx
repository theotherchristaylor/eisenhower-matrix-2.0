import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import type { Task } from '../../shared/types';
import { useProjects } from '../hooks/useProjects';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  onClick?: () => void;
  onComplete?: () => void;
  onDelete?: () => void;
}

export default function TaskCard({
  task,
  isDragging = false,
  onClick,
  onComplete,
  onDelete
}: TaskCardProps) {
  const { getProjectByTag } = useProjects();
  const project = task.project ? getProjectByTag(task.project) : null;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div
        style={{
          backgroundColor: 'var(--color-background)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '6px 10px',
          cursor: isDragging ? 'grabbing' : 'grab',
          boxShadow: 'var(--shadow-sm)',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <input
            type="checkbox"
            checked={!!task.completed}
            onChange={(e) => {
              e.stopPropagation();
              onComplete?.();
            }}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              marginTop: '2px',
              cursor: 'pointer',
              width: '16px',
              height: '16px'
            }}
          />

          {project && (
            <span
              style={{
                fontSize: '11px',
                padding: '1px 6px',
                backgroundColor: project.color,
                color: 'white',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                marginTop: '1px'
              }}
            >
              {project.label}
            </span>
          )}

          <div
            style={{ flex: 1, cursor: 'pointer', minWidth: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <div style={{
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: task.completed ? 'line-through' : 'none'
            }}>
              {task.title}
            </div>

            {(task.due || task.notes) && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '2px' }}>
                {task.due && (
                  <span style={{
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)'
                  }}>
                    📅 {format(new Date(task.due), 'MMM d')}
                  </span>
                )}

                {task.notes && (
                  <span style={{
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {task.notes}
                  </span>
                )}
              </div>
            )}
          </div>

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              onPointerDown={(e) => e.stopPropagation()}
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
          )}
        </div>
      </div>
    </div>
  );
}
