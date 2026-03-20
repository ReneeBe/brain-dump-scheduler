import type { ScheduledTask, Bucket } from '../../types/task';
import { TaskRow } from './TaskRow';

interface Props {
  tasks: ScheduledTask[];
  onReset: () => void;
}

interface BucketConfig {
  bucket: Bucket;
  label: string;
  accent: string;
  dot: string;
}

const BUCKETS: BucketConfig[] = [
  { bucket: 'today', label: 'Today', accent: 'text-violet-700', dot: 'bg-violet-500' },
  { bucket: 'this-week', label: 'This Week', accent: 'text-sky-700', dot: 'bg-sky-400' },
  { bucket: 'later', label: 'Later', accent: 'text-gray-500', dot: 'bg-gray-300' },
];

function totalMinutes(tasks: ScheduledTask[]): string {
  const mins = tasks.reduce((sum, t) => sum + t.estimatedDuration, 0);
  return mins < 60
    ? `${mins}m`
    : `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? `${mins % 60}m` : ''}`.trim();
}

export function TimelineView({ tasks, onReset }: Props) {
  return (
    <div className="flex flex-col gap-8">
      {BUCKETS.map(({ bucket, label, accent, dot }) => {
        const bucketTasks = tasks
          .filter((t) => t.bucket === bucket)
          .sort((a, b) => a.order - b.order);

        if (bucketTasks.length === 0) return null;

        return (
          <div key={bucket} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
              <h2 className={`text-sm font-bold uppercase tracking-widest ${accent}`}>
                {label}
              </h2>
              <span className="ml-auto text-xs text-gray-400">
                {bucketTasks.length} task{bucketTasks.length !== 1 ? 's' : ''} · {totalMinutes(bucketTasks)}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {bucketTasks.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </div>
          </div>
        );
      })}

      <button
        onClick={onReset}
        className="w-full py-3 rounded-xl border border-gray-200 text-gray-500 font-medium text-sm hover:bg-gray-50 transition-colors"
      >
        Start Over
      </button>
    </div>
  );
}
