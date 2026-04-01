import { cn } from '@/lib/utils';
import type { RegulatoryCase } from '@/lib/types/trial';

interface RegulatoryCaseProps {
  rc: RegulatoryCase;
}

export function RegulatoryCaseCard({ rc }: RegulatoryCaseProps) {
  return (
    <div className="rounded-xl border border-violet-200 bg-white p-5 shadow-sm dark:border-violet-800 dark:bg-slate-800">
      {/* Header */}
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 flex-shrink-0 rounded-lg bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900 dark:text-violet-300">
          {rc.pathway}
        </span>
      </div>
      <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-slate-100">{rc.title}</h3>

      {/* Summary */}
      <p className="mb-4 text-sm leading-6 text-gray-600 dark:text-slate-400">{rc.summary}</p>

      {/* Key decisions */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">
          关键决策要点
        </p>
        <ul className="space-y-1.5">
          {rc.keyDecisions.map((d, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-slate-300">
              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-violet-500" />
              {d}
            </li>
          ))}
        </ul>
      </div>

      {/* Outcome */}
      <div className={cn('rounded-lg bg-violet-50 p-3 text-sm dark:bg-violet-950/30')}>
        <p className="mb-1 text-xs font-semibold uppercase text-violet-600 dark:text-violet-400">监管结果</p>
        <p className="leading-6 text-gray-700 dark:text-slate-300">{rc.outcome}</p>
      </div>
    </div>
  );
}
