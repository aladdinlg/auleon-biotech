import { cn } from '@/lib/utils';

interface BilingualHeadingProps {
  zhText: string;
  enText: string;
  level: 'h1' | 'h2' | 'h3';
  className?: string;
}

const STYLES = {
  h1: { zh: 'text-3xl font-bold text-gray-900 dark:text-slate-50', en: 'text-lg text-gray-400 dark:text-slate-500' },
  h2: { zh: 'text-2xl font-semibold text-gray-900 dark:text-slate-50', en: 'text-base text-gray-400 dark:text-slate-500' },
  h3: { zh: 'text-xl font-semibold text-gray-900 dark:text-slate-50', en: 'text-sm text-gray-400 dark:text-slate-500' },
};

export function BilingualHeading({ zhText, enText, level, className }: BilingualHeadingProps) {
  const Tag = level;
  const s = STYLES[level];
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <Tag className={s.zh}>{zhText}</Tag>
      <span className={s.en}>{enText}</span>
    </div>
  );
}
