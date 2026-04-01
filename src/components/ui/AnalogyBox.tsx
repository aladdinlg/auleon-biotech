import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnalogyBoxProps {
  children: ReactNode;
  icon?: string;
  className?: string;
}

export function AnalogyBox({ children, icon = '💡', className }: AnalogyBoxProps) {
  return (
    <div
      className={cn(
        'my-4 rounded-r-lg border-l-4 border-blue-500 bg-blue-50 px-5 py-4 dark:bg-blue-950/40',
        className
      )}
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
        {icon} 直观类比 · Analogy
      </p>
      <div className="text-sm text-gray-700 dark:text-slate-300">{children}</div>
    </div>
  );
}
