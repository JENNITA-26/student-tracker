import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading tasks…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
