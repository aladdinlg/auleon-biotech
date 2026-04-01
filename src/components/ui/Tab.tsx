import { cn } from '@/lib/utils';

interface TabProps {
  id: string;
  labelZH: string;
  labelEN: string;
  icon?: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

export function Tab({ id, labelZH, labelEN, icon, isActive, onClick }: TabProps) {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tab-panel-${id}`}
      onClick={() => onClick(id)}
      className={cn(
        'relative flex flex-shrink-0 items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        isActive
          ? 'text-blue-600 dark:text-blue-400'
          : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200'
      )}
    >
      {icon && <span aria-hidden>{icon}</span>}
      <span className="whitespace-nowrap">{labelZH}</span>
      <span className="hidden whitespace-nowrap text-xs text-gray-400 sm:inline dark:text-slate-500">{labelEN}</span>
    </button>
  );
}
