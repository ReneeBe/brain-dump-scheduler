import { useState } from 'react';
import { parseBrainDump } from '../lib/claude';
import type { ParsedTask } from '../types/task';

interface UseParseTasks {
  isLoading: boolean;
  error: string | null;
  run: (apiKey: string, text: string) => Promise<ParsedTask[] | null>;
}

export function useParseTasks(): UseParseTasks {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (apiKey: string, text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const tasks = await parseBrainDump(apiKey, text);
      return tasks;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, run };
}
