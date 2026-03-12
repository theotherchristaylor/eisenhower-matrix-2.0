import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { useState } from 'react';
import type { QuadrantKey, Task } from '../../shared/types';
import { useTasks } from '../hooks/useTasks';
import Quadrant from './Quadrant';
import TaskCard from './TaskCard';

interface QuadrantGridProps {
  storagePath: string;
}

const QUADRANTS: Array<{ key: QuadrantKey; label: string }> = [
  { key: 'urgent-important', label: 'Urgent & Important' },
  { key: 'important-not-urgent', label: 'Important & Not Urgent' },
  { key: 'urgent-not-important', label: 'Urgent & Not Important' },
  { key: 'not-urgent-not-important', label: 'Not Urgent & Not Important' }
];

export default function QuadrantGrid({ storagePath }: QuadrantGridProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { tasks, moveTask, getFilteredTasks } = useTasks();

  const filteredTasks = getFilteredTasks();

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Determine target quadrant and position
    let targetQuadrant: QuadrantKey;
    let targetIndex: number;

    if (overId.startsWith('quadrant-')) {
      // Dropped on empty quadrant
      targetQuadrant = overId.replace('quadrant-', '') as QuadrantKey;
      targetIndex = 0;
    } else {
      // Dropped on another task
      const overTask = tasks.find((t) => t.id === overId);
      if (!overTask) return;

      targetQuadrant = overTask.quadrant;
      const quadrantTasks = tasks
        .filter((t) => t.quadrant === targetQuadrant)
        .sort((a, b) => a.order - b.order);
      targetIndex = quadrantTasks.findIndex((t) => t.id === overId);
    }

    // Calculate new order
    const quadrantTasks = tasks
      .filter((t) => t.quadrant === targetQuadrant)
      .sort((a, b) => a.order - b.order);

    let newOrder: number;
    if (quadrantTasks.length === 0) {
      newOrder = 1000;
    } else if (targetIndex === 0) {
      newOrder = quadrantTasks[0].order - 1000;
    } else if (targetIndex >= quadrantTasks.length) {
      newOrder = quadrantTasks[quadrantTasks.length - 1].order + 1000;
    } else {
      const prevOrder = quadrantTasks[targetIndex - 1].order;
      const nextOrder = quadrantTasks[targetIndex].order;
      newOrder = Math.floor((prevOrder + nextOrder) / 2);
    }

    moveTask(taskId, targetQuadrant, newOrder);

    // Save to disk
    const { completedTasks } = useTasks.getState();
    await window.electronAPI.saveTasks(storagePath, tasks, completedTasks);
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '16px',
        padding: '16px',
        flex: 1,
        overflow: 'hidden'
      }}>
        {QUADRANTS.map((quadrant) => {
          const quadrantTasks = filteredTasks
            .filter((t) => t.quadrant === quadrant.key)
            .sort((a, b) => a.order - b.order);

          return (
            <Quadrant
              key={quadrant.key}
              quadrantKey={quadrant.key}
              label={quadrant.label}
              tasks={quadrantTasks}
              storagePath={storagePath}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeTask && (
          <div style={{ transform: 'rotate(3deg)', opacity: 0.8 }}>
            <TaskCard task={activeTask} isDragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
