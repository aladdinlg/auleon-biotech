'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ClinicalCase, TrialCase, RegulatoryCase, ComplicationOption } from '@/lib/types/trial';
import { RegulatoryCaseCard } from '@/components/clinical/RegulatoryCase';
import { cn } from '@/lib/utils';

interface CaseStudyTabProps {
  timelines?: ClinicalCase[];
  trialCases?: TrialCase[];
  regulatoryCases?: RegulatoryCase[];
  complications?: ComplicationOption[];
}

const SEVERITY_STYLES: Record<string, { badge: string; border: string }> = {
  mild:     { badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-800' },
  moderate: { badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
  severe:   { badge: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',             border: 'border-red-200 dark:border-red-800' },
};
const SEVERITY_ZH: Record<string, string> = { mild: '轻度', moderate: '中度', severe: '重度' };

function ComplicationItem({ comp }: { comp: ComplicationOption }) {
  const [open, setOpen] = useState(false);
  // Support both JSON schemas:
  //   full: { name, severity, presentation, engineeringCause, management }
  //   slim: { title, description, management }  (S14/S15)
  const raw = comp as unknown as Record<string, string>;
  const displayName = raw.name || raw.title || '';
  const severity = (raw.severity as 'mild' | 'moderate' | 'severe') || 'moderate';
  const presentation = raw.presentation || raw.description || '';
  const engineeringCause = raw.engineeringCause || '';
  const management = raw.management || '';
  const s = SEVERITY_STYLES[severity] ?? SEVERITY_STYLES.moderate;
  return (
    <div className={cn('rounded-xl border bg-white dark:bg-slate-800', s.border)}>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <span className={cn('flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold', s.badge)}>
          {SEVERITY_ZH[severity]} {severity}
        </span>
        <span className="font-medium text-gray-900 dark:text-slate-100">{displayName}</span>
        <span className="ml-auto text-gray-400">{open ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}</span>
      </button>
      {open && (
        <div className="space-y-3 border-t border-gray-100 px-4 py-4 dark:border-slate-700 text-sm">
          {presentation && <div><p className="mb-1 text-xs font-semibold uppercase text-gray-400">临床表现</p><p className="text-gray-700 dark:text-slate-300 leading-6">{presentation}</p></div>}
          {engineeringCause && <div><p className="mb-1 text-xs font-semibold uppercase text-blue-500">工程原因分析</p><p className="text-gray-700 dark:text-slate-300 leading-6">{engineeringCause}</p></div>}
          {management && <div><p className="mb-1 text-xs font-semibold uppercase text-emerald-500">处理方案</p><p className="text-gray-700 dark:text-slate-300 leading-6">{management}</p></div>}
        </div>
      )}
    </div>
  );
}

function Section({ title, subtitle, defaultOpen = true, children }: {
  title: string; subtitle: string; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4"
      >
        <div className="text-left">
          <p className="font-semibold text-gray-900 dark:text-slate-100">{title}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">{subtitle}</p>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <div className="border-t border-gray-100 px-5 py-5 dark:border-slate-700">{children}</div>}
    </div>
  );
}

const TRIAL_TYPE_STYLES: Record<string, string> = {
  RCT: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  'meta-analysis': 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
  cohort: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  registry: 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300',
};

function TrialCard({ trial }: { trial: TrialCase }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-3 flex items-center gap-2">
        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', TRIAL_TYPE_STYLES[trial.type] || TRIAL_TYPE_STYLES.registry)}>
          {trial.type.toUpperCase()}
        </span>
        <span className="text-xs text-gray-400">n={trial.sampleSize.toLocaleString()}</span>
      </div>
      <h3 className="mb-1 text-base font-bold text-gray-900 dark:text-slate-100">{trial.name}</h3>
      <p className="mb-3 text-xs text-gray-500 dark:text-slate-400">
        {trial.device} vs {trial.comparator}
      </p>
      <div className="mb-3 rounded-lg bg-emerald-50 px-4 py-3 dark:bg-emerald-950/30">
        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">关键结果</p>
        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-slate-100">{trial.keyResult}</p>
      </div>
      <p className="mb-3 text-xs italic text-gray-500 dark:text-slate-400">
        工程启示：{trial.engineeringInsight}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-blue-600 hover:underline dark:text-blue-400"
      >
        {expanded ? '收起试验设计' : '查看试验设计'}
      </button>
      {expanded && (
        <div className="mt-3 space-y-2 border-t border-gray-100 pt-3 dark:border-slate-700 text-sm text-gray-600 dark:text-slate-400">
          <p><span className="font-medium">主要终点：</span>{trial.primaryEndpoint}</p>
          {trial.controversies && <p><span className="font-medium">争议：</span>{trial.controversies}</p>}
        </div>
      )}
    </div>
  );
}

function TimelineSection({ cases }: { cases: ClinicalCase[] }) {
  if (cases.length === 0) return <p className="text-sm text-gray-400">暂无时间线数据</p>;
  return (
    <div className="space-y-6">
      {cases.map((c) => (
        <div key={c.id}>
          <h3 className="mb-4 font-semibold text-gray-900 dark:text-slate-100">{c.title}</h3>
          <div className="relative">
            <div className="absolute left-3 top-0 h-full w-px bg-gray-200 dark:bg-slate-600" />
            <div className="space-y-4">
              {c.events.map((ev, evIdx) => {
                // Support both event schemas:
                //   full: { id, date, title, description, engineeringPrinciple }
                //   slim: { time, event, detail }  (S14/S15)
                const raw = ev as unknown as Record<string, string>;
                const evDate = raw.date || raw.time || '';
                const evTitle = raw.title || raw.event || '';
                const evDesc = raw.description || raw.detail || '';
                const evPrinciple = raw.engineeringPrinciple || '';
                return (
                  <div key={raw.id || evIdx} className="flex gap-4 pl-8">
                    <div className="absolute left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-blue-500 bg-white dark:bg-slate-900" />
                    <div className="min-w-0 flex-1 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                      <p className="text-xs text-gray-400 dark:text-slate-500">{evDate}</p>
                      <p className="mt-0.5 font-medium text-gray-900 dark:text-slate-100">{evTitle}</p>
                      <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{evDesc}</p>
                      {evPrinciple && (
                        <p className="mt-2 text-xs italic text-blue-600 dark:text-blue-400">
                          工程原理：{evPrinciple}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CaseStudyTab({ timelines = [], trialCases = [], regulatoryCases = [], complications = [] }: CaseStudyTabProps) {
  // Pure regulatory chapter (S01, S15)
  if (regulatoryCases.length > 0 && timelines.length === 0 && trialCases.length === 0) {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4 text-sm text-violet-700 dark:border-violet-800 dark:bg-violet-950/20 dark:text-violet-300">
          本章以监管案例为核心，展示真实器械审批路径与关键决策。
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {regulatoryCases.map((rc) => (
            <RegulatoryCaseCard key={rc.id} rc={rc} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {timelines.length > 0 && (
        <Section title="临床案例时间线" subtitle="Clinical Case Timeline">
          <TimelineSection cases={timelines} />
        </Section>
      )}
      {trialCases.length > 0 && (
        <Section title="里程碑临床试验" subtitle="Landmark Clinical Trials">
          <div className="grid gap-4 lg:grid-cols-2">
            {trialCases.map((t) => <TrialCard key={t.id} trial={t} />)}
          </div>
        </Section>
      )}
      {regulatoryCases.length > 0 && (
        <Section title="监管案例" subtitle="Regulatory Cases" defaultOpen={false}>
          <div className="grid gap-4 lg:grid-cols-2">
            {regulatoryCases.map((rc) => <RegulatoryCaseCard key={rc.id} rc={rc} />)}
          </div>
        </Section>
      )}
      {complications.length > 0 && (
        <Section title="并发症推演" subtitle="Complication Analysis" defaultOpen={false}>
          <div className="space-y-3">
            {complications.map((c) => <ComplicationItem key={c.id} comp={c} />)}
          </div>
        </Section>
      )}
      {timelines.length === 0 && trialCases.length === 0 && regulatoryCases.length === 0 && complications.length === 0 && (
        <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600">
          <p className="text-sm text-gray-400">案例数据开发中</p>
        </div>
      )}
    </div>
  );
}
