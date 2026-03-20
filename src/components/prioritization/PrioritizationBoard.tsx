import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import type { ScheduledTask, Bucket } from '../../types/task';

interface Props {
  tasks: ScheduledTask[];
  onTasksChange: (tasks: ScheduledTask[]) => void;
  onBuildSchedule: () => void;
}

export function PrioritizationBoard({ tasks, onTasksChange, onBuildSchedule }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(tasks, oldIndex, newIndex).map((t, i) => ({
      ...t,
      order: i,
    }));
    onTasksChange(reordered);
  };

  const handleBucketChange = (id: string, bucket: Bucket) => {
    onTasksChange(tasks.map((t) => (t.id === id ? { ...t, bucket } : t)));
  };

  const handleMove = (id: string, direction: 'up' | 'down') => {
    const index = tasks.findIndex((t) => t.id === id);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= tasks.length) return;
    const reordered = arrayMove(tasks, index, swapIndex).map((t, i) => ({ ...t, order: i }));
    onTasksChange(reordered);
  };

  const activeTask = tasks.find((t) => t.id === activeId);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Use ↑↓ buttons or drag to reorder. Assign each task a time bucket.
        </p>
        <span className="text-sm text-gray-400">{tasks.length} tasks</span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3">
            {tasks.map((task, i) => (
              <TaskCard
                key={task.id}
                task={task}
                onBucketChange={handleBucketChange}
                onMove={handleMove}
                isFirst={i === 0}
                isLast={i === tasks.length - 1}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeTask && (
            <TaskCard
              task={activeTask}
              onBucketChange={() => {}}
              isDragOverlay
            />
          )}
        </DragOverlay>
      </DndContext>

      <button
        onClick={onBuildSchedule}
        className="w-full py-3 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 active:scale-[0.99] transition-all mt-2"
      >
        Build My Schedule →
      </button>
    </div>
  );
}
