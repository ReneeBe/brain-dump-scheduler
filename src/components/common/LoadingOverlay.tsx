import { useEffect, useState } from 'react';

const MESSAGES = [
  'Reading your brain dump...',
  'Finding your tasks...',
  'Figuring out priorities...',
  'Building your schedule...',
];

export function LoadingOverlay() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="w-14 h-14 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
        <p className="text-violet-700 font-medium text-lg transition-all duration-500">
          {MESSAGES[msgIndex]}
        </p>
      </div>
    </div>
  );
}
