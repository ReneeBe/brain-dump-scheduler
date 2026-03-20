import type { Urgency } from '../types/task';

export function urgencyDot(urgency: Urgency): string {
  switch (urgency) {
    case 'high': return 'bg-red-400';
    case 'medium': return 'bg-amber-400';
    case 'low': return 'bg-gray-300';
  }
}

export function urgencyBorder(urgency: Urgency): string {
  switch (urgency) {
    case 'high': return 'border-l-red-400';
    case 'medium': return 'border-l-amber-400';
    case 'low': return 'border-l-gray-200';
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  work: 'bg-blue-100 text-blue-700',
  personal: 'bg-purple-100 text-purple-700',
  health: 'bg-green-100 text-green-700',
  finance: 'bg-emerald-100 text-emerald-700',
  learning: 'bg-indigo-100 text-indigo-700',
  errands: 'bg-orange-100 text-orange-700',
  social: 'bg-pink-100 text-pink-700',
  home: 'bg-yellow-100 text-yellow-700',
  creative: 'bg-fuchsia-100 text-fuchsia-700',
};

export function categoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? 'bg-gray-100 text-gray-600';
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
