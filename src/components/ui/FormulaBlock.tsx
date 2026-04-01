import katex from 'katex';
import { cn } from '@/lib/utils';

interface FormulaBlockProps {
  latex: string;
  label?: string;
  className?: string;
}

export function FormulaBlock({ latex, label, className }: FormulaBlockProps) {
  let html = '';
  try {
    html = katex.renderToString(latex, {
      displayMode: true,
      throwOnError: false,
    });
  } catch {
    html = `<span class="text-red-500">Formula error: ${latex}</span>`;
  }

  return (
    <div className={cn('my-4 rounded-lg bg-gray-50 px-6 py-4 dark:bg-slate-900', className)}>
      <div
        className="overflow-x-auto text-center"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {label && (
        <p className="mt-2 text-center text-xs text-gray-500 dark:text-slate-400">{label}</p>
      )}
    </div>
  );
}
