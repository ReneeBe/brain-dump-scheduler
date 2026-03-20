import type { ScheduledTask } from '../../types/task';
import { categoryColor, urgencyBorder, formatDuration } from '../../lib/display';

interface Props {
  task: ScheduledTask;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function TaskRow({ task }: Props) {
  return (
    <div
      className={`flex items-start gap-4 px-4 py-3.5 bg-white rounded-xl border-l-4 border border-gray-100 ${urgencyBorder(task.urgency)}`}
    >
      <div className="flex flex-col flex-1 min-w-0 gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-gray-800 text-sm">{task.title}</p>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColor(task.category)}`}>
            {task.category}
          </span>
        </div>
        {task.description && (
          <p className="text-xs text-gray-500 leading-relaxed">{task.description}</p>
        )}
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-gray-400">{formatDuration(task.estimatedDuration)}</span>
          {task.suggestedTime && (
            <span className="text-xs text-gray-400">at {formatTime(task.suggestedTime)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
