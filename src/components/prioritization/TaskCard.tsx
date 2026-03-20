import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BucketSelector } from './BucketSelector';
import type { ScheduledTask, Bucket } from '../../types/task';
import { categoryColor, urgencyDot, formatDuration } from '../../lib/display';

interface Props {
  task: ScheduledTask;
  onBucketChange: (id: string, bucket: Bucket) => void;
  onMove?: (id: string, direction: 'up' | 'down') => void;
  isFirst?: boolean;
  isLast?: boolean;
  isDragOverlay?: boolean;
}

export function TaskCard({ task, onBucketChange, onMove, isFirst, isLast, isDragOverlay }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-2xl border border-gray-100 p-4 shadow-sm transition-shadow ${
        isDragging && !isDragOverlay ? 'opacity-40 shadow-none' : ''
      } ${isDragOverlay ? 'shadow-lg rotate-1' : ''}`}
    >
      <div className="flex gap-3">
        {/* Reorder controls */}
        <div className="flex flex-col items-center gap-1 shrink-0 mt-0.5">
          <button
            onClick={() => onMove?.(task.id, 'up')}
            disabled={isFirst}
            className="text-gray-300 hover:text-violet-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            aria-label="Move up"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="2,9 7,4 12,9" />
            </svg>
          </button>
          <button
            {...attributes}
            {...listeners}
            className="text-gray-200 hover:text-gray-400 cursor-grab active:cursor-grabbing touch-none transition-colors"
            aria-label="Drag to reorder"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <circle cx="4.5" cy="3.5" r="1.2" />
              <circle cx="9.5" cy="3.5" r="1.2" />
              <circle cx="4.5" cy="7" r="1.2" />
              <circle cx="9.5" cy="7" r="1.2" />
              <circle cx="4.5" cy="10.5" r="1.2" />
              <circle cx="9.5" cy="10.5" r="1.2" />
            </svg>
          </button>
          <button
            onClick={() => onMove?.(task.id, 'down')}
            disabled={isLast}
            className="text-gray-300 hover:text-violet-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            aria-label="Move down"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="2,5 7,10 12,5" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start gap-2">
            <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${urgencyDot(task.urgency)}`} />
            <p className="font-semibold text-gray-800 text-sm leading-snug flex-1">
              {task.title}
            </p>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-gray-500 leading-relaxed pl-4">
              {task.description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 pl-4">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColor(task.category)}`}
            >
              {task.category}
            </span>
            <span className="text-xs text-gray-400">{formatDuration(task.estimatedDuration)}</span>
            {task.suggestedTime && (
              <span className="text-xs text-gray-400">at {task.suggestedTime}</span>
            )}
          </div>

          {/* Bucket selector */}
          <div className="pl-4">
            <BucketSelector
              value={task.bucket}
              onChange={(b) => onBucketChange(task.id, b)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
