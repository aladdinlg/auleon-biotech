'use client';

import { useState } from 'react';
import { PrincipleTab } from '@/components/tabs/PrincipleTab';
import { GlossaryTab } from '@/components/tabs/GlossaryTab';
import { QuizTab } from '@/components/tabs/QuizTab';
import { cn } from '@/lib/utils';
import type { PrincipleSection } from '@/lib/types/chapter';
import type { GlossaryTerm } from '@/lib/types/glossary';
import type { MCQuestion, CaseBasedQuestion } from '@/lib/types/quiz';

const TABS = [
  { id: 'principle', labelZH: '原理', labelEN: 'Principle' },
  { id: 'visual', labelZH: '可视化', labelEN: 'Visual' },
  { id: 'mechanism', labelZH: '机制', labelEN: 'Mechanism' },
  { id: 'regulatory', labelZH: '法规', labelEN: 'Regulatory' },
  { id: 'market', labelZH: '市场', labelEN: 'Market' },
  { id: 'quiz', labelZH: '测验', labelEN: 'Quiz' },
] as const;

type TabId = (typeof TABS)[number]['id'];

/** Convert letter-based correctAnswer ("A"/"B"/"C"/"D") to 0-based correctIndex */
function normalizeQuestions(rawMcq: Array<Record<string, unknown>>): MCQuestion[] {
  return rawMcq.map((q) => {
    const correctIndex =
      typeof q.correctIndex === 'number'
        ? q.correctIndex
        : typeof q.correctAnswer === 'string'
          ? q.correctAnswer.charCodeAt(0) - 65
          : 0;
    return {
      id: String(q.id ?? ''),
      question: String(q.question ?? ''),
      options: Array.isArray(q.options) ? q.options.map(String) : [],
      correctIndex,
      explanation: String(q.explanation ?? ''),
    } satisfies MCQuestion;
  });
}

/** Add id field to glossary terms if missing */
function normalizeGlossary(raw: Array<Record<string, unknown>>): GlossaryTerm[] {
  return raw.map((t, i) => ({
    id: String(t.id ?? `g${i + 1}`),
    termEN: String(t.termEN ?? ''),
    termZH: String(t.termZH ?? ''),
    definition: String(t.definition ?? ''),
    category: t.category ? String(t.category) : undefined,
  }));
}

interface ModuleData {
  id: string;
  titleZH: string;
  titleEN: string;
  visualizationId: string;
  tabs: {
    principle: { sections: PrincipleSection[] };
    glossary: Array<Record<string, unknown>>;
    quiz: {
      mcq: Array<Record<string, unknown>>;
      caseBased?: CaseBasedQuestion[];
    };
  };
}

interface ModulePageProps {
  moduleData: ModuleData;
  /** Optional: content to render in Tab 3 (Mechanism). Default: placeholder. */
  mechanismContent?: React.ReactNode;
  /** Optional: content to render in Tab 4 (Regulatory). Default: placeholder. */
  regulatoryContent?: React.ReactNode;
  /** Optional: content to render in Tab 5 (Market). Default: placeholder. */
  marketContent?: React.ReactNode;
}

export function ModulePage({
  moduleData,
  mechanismContent,
  regulatoryContent,
  marketContent,
}: ModulePageProps) {
  const [activeTab, setActiveTab] = useState<TabId>('principle');

  const sections = moduleData.tabs.principle.sections;
  const glossaryTerms = normalizeGlossary(moduleData.tabs.glossary);
  const mcqQuestions = normalizeQuestions(moduleData.tabs.quiz.mcq);
  const caseQuestions: CaseBasedQuestion[] = moduleData.tabs.quiz.caseBased ?? [];

  const moduleNum = moduleData.id.replace('m', 'M');

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Module header */}
      <div className="mb-8">
        <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
          {moduleNum} · {moduleData.titleEN}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
          {moduleData.titleZH}
        </h1>
        <p className="mt-1 text-base text-gray-500 dark:text-slate-400">
          {moduleData.titleEN}
        </p>
      </div>

      {/* Tab bar */}
      <div className="mb-8 flex gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1 dark:bg-slate-800">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200'
            )}
          >
            <span className="mr-1">{tab.labelZH}</span>
            <span className="text-xs opacity-60">{tab.labelEN}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'principle' && (
          <PrincipleTab sections={sections} />
        )}

        {activeTab === 'visual' && (
          <div className="flex h-96 items-center justify-center rounded-xl border-2 border-dashed border-teal-300 bg-teal-50/30 dark:border-teal-700 dark:bg-teal-950/20">
            <div className="text-center">
              <p className="text-2xl">🔬</p>
              <p className="mt-2 text-sm font-medium text-teal-700 dark:text-teal-400">
                Visualization component — built in Stage F
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Visualization ID: {moduleData.visualizationId}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'mechanism' && (
          mechanismContent ?? (
            <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600">
              <p className="text-sm text-gray-400">机制可视化 — 开发中</p>
            </div>
          )
        )}

        {activeTab === 'regulatory' && (
          regulatoryContent ?? (
            <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-violet-300 bg-violet-50/30 dark:border-violet-700 dark:bg-violet-950/20">
              <div className="text-center">
                <p className="text-lg">📋</p>
                <p className="mt-2 text-sm text-violet-600 dark:text-violet-400">法规内容 — 本模块专项内容</p>
              </div>
            </div>
          )
        )}

        {activeTab === 'market' && (
          marketContent ?? (
            <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/30 dark:border-blue-700 dark:bg-blue-950/20">
              <div className="text-center">
                <p className="text-lg">📊</p>
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">市场数据 — 本模块专项内容</p>
              </div>
            </div>
          )
        )}

        {activeTab === 'quiz' && (
          <QuizTab
            chapterId={moduleData.id}
            mcq={mcqQuestions}
            caseBased={caseQuestions}
          />
        )}
      </div>

      {/* Glossary — shown below principle tab */}
      {activeTab === 'principle' && (
        <div className="mt-16">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-slate-100">
            术语表 Glossary
          </h2>
          <GlossaryTab terms={glossaryTerms} />
        </div>
      )}
    </div>
  );
}
