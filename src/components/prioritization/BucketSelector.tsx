import type { Bucket } from '../../types/task';

interface Props {
  value: Bucket;
  onChange: (bucket: Bucket) => void;
}

const OPTIONS: { value: Bucket; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'this-week', label: 'This Week' },
  { value: 'later', label: 'Later' },
];

export function BucketSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-1.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
            value === opt.value
              ? opt.value === 'today'
                ? 'bg-violet-600 text-white'
                : opt.value === 'this-week'
                ? 'bg-sky-500 text-white'
                : 'bg-gray-400 text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
