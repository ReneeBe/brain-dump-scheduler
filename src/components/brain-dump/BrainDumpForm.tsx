import { useState } from 'react';
import { useSessionKey } from '../../hooks/useSessionKey';
import { useParseTasks } from '../../hooks/useParseTasks';
import { LoadingOverlay } from '../common/LoadingOverlay';
import type { ParsedTask } from '../../types/task';

interface Props {
  onParsed: (tasks: ParsedTask[]) => void;
}

export function BrainDumpForm({ onParsed }: Props) {
  const [apiKey, setApiKey] = useSessionKey();
  const [text, setText] = useState('');
  const { isLoading, error, run } = useParseTasks();

  const hasMagicLink = !!window.magiclink?.hasToken;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!hasMagicLink && !apiKey.trim()) || !text.trim()) return;
    const tasks = await run(apiKey.trim(), text.trim());
    if (tasks) onParsed(tasks);
  };

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* API Key / Demo banner */}
        {hasMagicLink ? (
          <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Demo mode active</p>
            <p className="mt-0.5 text-xs text-gray-400">You have 5 uses — no API key needed.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">
              Claude API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent placeholder:text-gray-300"
            />
            <p className="text-xs text-gray-400">
              Stored in session only — cleared when you close the tab.
            </p>
          </div>
        )}

        {/* Brain Dump */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-600">
            What's on your mind?
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Just write everything. Don't filter it.\n\nExample: "Need to finish the report by Thursday, call mom, pick up dry cleaning, the gym thing I keep putting off, prep for Monday's standup, also need to fix that bug in prod..."`}
            required
            rows={10}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent placeholder:text-gray-300 resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || (!hasMagicLink && !apiKey.trim()) || !text.trim()}
          className="w-full py-3 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Parse My Brain Dump →
        </button>
      </form>
    </>
  );
}
