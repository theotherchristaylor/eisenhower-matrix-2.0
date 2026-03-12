import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { QuadrantKey, Task } from '../../shared/types';
import TaskCard from './TaskCard';
import { useTasks } from '../hooks/useTasks';
import { generateTaskId, calculateOrder } from '../utils/taskHelpers';
import { useState } from 'react';
import TaskEditor from './TaskEditor';

interface QuadrantProps {
  quadrantKey: QuadrantKey;
  label: string;
  tasks: Task[];
  storagePath: string;
}

const QUADRANT_STYLES: Record<QuadrantKey, { bg: string; border: string }> = {
  'urgent-important': { bg: 'var(--color-q1)', border: 'var(--color-q1-border)' },
  'important-not-urgent': { bg: 'var(--color-q2)', border: 'var(--color-q2-border)' },
  'urgent-not-important': { bg: 'var(--color-q3)', border: 'var(--color-q3-border)' },
  'not-urgent-not-important': { bg: 'var(--color-q4)', border: 'var(--color-q4-border)' }
};

export default function Quadrant({ quadrantKey, label, tasks, storagePath }: QuadrantProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { addTask, updateTask, deleteTask, completeTask } = useTasks();
  const { setNodeRef, isOver } = useDroppable({
    id: `quadrant-${quadrantKey}`
  });

  const style = QUADRANT_STYLES[quadrantKey];

  async function handleCreateTask(taskData: Partial<Task>) {
    const order = calculateOrder(tasks, 'end');
    const newTask: Task = {
      id: generateTaskId(),
      title: taskData.title || '',
      quadrant: quadrantKey,
      order,
      project: taskData.project,
      due: taskData.due,
      notes: taskData.notes,
      createdAt: new Date().toISOString()
    };

    addTask(newTask);
    setShowEditor(false);

    // Save to disk
    const { tasks: allTasks, completedTasks } = useTasks.getState();
    await window.electronAPI.saveTasks(storagePath, allTasks, completedTasks);
  }

  async function handleUpdateTask(id: string, updates: Partial<Task>) {
    updateTask(id, updates);
    setEditingTask(null);
    setShowEditor(false);

    const { tasks: allTasks, completedTasks } = useTasks.getState();
    await window.electronAPI.saveTasks(storagePath, allTasks, completedTasks);
  }

  async function handleDeleteTask(id: string) {
    if (confirm('Delete this task?')) {
      deleteTask(id);
      const { tasks: allTasks, completedTasks } = useTasks.getState();
      await window.electronAPI.saveTasks(storagePath, allTasks, completedTasks);
    }
  }

  async function handleCompleteTask(id: string) {
    completeTask(id);
    const { tasks: allTasks, completedTasks } = useTasks.getState();
    await window.electronAPI.saveTasks(storagePath, allTasks, completedTasks);
  }

  function handleTaskClick(task: Task) {
    setEditingTask(task);
    setShowEditor(true);
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={{
          backgroundColor: style.bg,
          border: `2px solid ${isOver ? 'var(--color-primary)' : style.border}`,
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'border-color 0.2s'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600 }}>
            {label}
          </h2>
          <button
            onClick={() => setShowEditor(true)}
            style={{
              padding: '4px 12px',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            + Add
          </button>
        </div>

        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            {tasks.length === 0 ? (
              <div style={{
                color: 'var(--color-text-secondary)',
                fontSize: '14px',
                textAlign: 'center',
                marginTop: '24px'
              }}>
                No tasks
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => handleTaskClick(task)}
                  onComplete={() => handleCompleteTask(task.id)}
                  onDelete={() => handleDeleteTask(task.id)}
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>

      {showEditor && (
        <TaskEditor
          task={editingTask || undefined}
          onSave={(data) => {
            if (editingTask) {
              handleUpdateTask(editingTask.id, data);
            } else {
              handleCreateTask(data);
            }
          }}
          onCancel={() => {
            setShowEditor(false);
            setEditingTask(null);
          }}
        />
      )}
    </>
  );
}
