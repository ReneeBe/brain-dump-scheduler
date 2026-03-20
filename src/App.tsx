import { useState } from 'react';
import type { Phase, ParsedTask, ScheduledTask, Bucket } from './types/task';
import { BrainDumpForm } from './components/brain-dump/BrainDumpForm';
import { PrioritizationBoard } from './components/prioritization/PrioritizationBoard';
import { TimelineView } from './components/timeline/TimelineView';

function defaultBucket(task: ParsedTask): Bucket {
  if (task.urgency === 'high') return 'today';
  if (!task.suggestedDate) return 'later';
  const today = new Date().toISOString().split('T')[0];
  const taskDate = task.suggestedDate;
  if (taskDate <= today) return 'today';
  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  if (taskDate <= weekFromNow.toISOString().split('T')[0]) return 'this-week';
  return 'later';
}

const PHASE_LABELS: Record<Phase, string> = {
  dump: 'Brain Dump',
  prioritize: 'Prioritize',
  timeline: 'Schedule',
};

const PHASE_ORDER: Phase[] = ['dump', 'prioritize', 'timeline'];

export default function App() {
  const [phase, setPhase] = useState<Phase>('dump');
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);

  const handleParsed = (raw: ParsedTask[]) => {
    const scheduled: ScheduledTask[] = raw.map((t, i) => ({
      ...t,
      bucket: defaultBucket(t),
      order: i,
    }));
    setTasks(scheduled);
    setPhase('prioritize');
  };

  const handleReset = () => {
    setTasks([]);
    setPhase('dump');
  };

  const currentStep = PHASE_ORDER.indexOf(phase);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-sky-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Brain Dump Scheduler
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Get everything out of your head. We'll sort it out.
          </p>
        </div>

        {/* Phase stepper */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {PHASE_ORDER.map((p, i) => (
            <div key={p} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    p === phase
                      ? 'bg-violet-600 text-white'
                      : i < currentStep
                      ? 'bg-violet-200 text-violet-700'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-xs font-medium ${
                    p === phase ? 'text-violet-700' : 'text-gray-400'
                  }`}
                >
                  {PHASE_LABELS[p]}
                </span>
              </div>
              {i < PHASE_ORDER.length - 1 && (
                <div className="w-8 h-px bg-gray-200 mx-1" />
              )}
            </div>
          ))}
        </div>

        {/* Content card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6">
          {phase === 'dump' && <BrainDumpForm onParsed={handleParsed} />}
          {phase === 'prioritize' && (
            <PrioritizationBoard
              tasks={tasks}
              onTasksChange={setTasks}
              onBuildSchedule={() => setPhase('timeline')}
            />
          )}
          {phase === 'timeline' && (
            <TimelineView tasks={tasks} onReset={handleReset} />
          )}
        </div>
      </div>
    </div>
  );
}
