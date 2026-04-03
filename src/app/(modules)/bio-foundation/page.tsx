'use client';

import { useState } from 'react';
import { PrincipleTab } from '@/components/tabs/PrincipleTab';
import { GlossaryTab } from '@/components/tabs/GlossaryTab';
import { QuizTab } from '@/components/tabs/QuizTab';
import { VisualTab } from '@/components/tabs/VisualTab';
import { MolstarViewer } from '@/components/bio/viewers/MolstarViewer';
import { cn } from '@/lib/utils';
import { RegulatoryTabContent } from '@/components/tabs/m1/RegulatoryTabContent';
import { MarketTabContent } from '@/components/tabs/m1/MarketTabContent';
import moduleData from '@/data/modules/m1-bio-foundation.json';
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

const sections = moduleData.tabs.principle.sections as PrincipleSection[];
const glossaryTerms = moduleData.tabs.glossary as GlossaryTerm[];
const mcqQuestions = moduleData.tabs.quiz.mcq as MCQuestion[];
const caseQuestions = moduleData.tabs.quiz.caseBased as CaseBasedQuestion[];

export default function BioFoundationPage() {
  const [activeTab, setActiveTab] = useState<TabId>('principle');

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Module header */}
      <div className="mb-8">
        <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
          M1 · Veterinary Biologics Foundation
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
          <VisualTab visualizationId={moduleData.visualizationId} />
        )}

        {activeTab === 'mechanism' && (
          <div className="space-y-4">
            <div>
              <h2 className="mb-1 text-xl font-semibold text-gray-900 dark:text-slate-100">
                EG95 蛋白三维结构
              </h2>
              <p className="mb-4 text-sm text-gray-500 dark:text-slate-400">
                AlphaFold 预测结构 · UniProt Q25309 · 细粒棘球绦虫 EG95 抗原
              </p>
            </div>
            <MolstarViewer
              source={{ type: 'uniprot', accession: 'Q25309' }}
              height={400}
              spin={false}
              representation="cartoon"
              className="w-full"
            />
            <div className="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-600 dark:bg-slate-800 dark:text-slate-400">
              <p className="mb-2 font-semibold text-gray-900 dark:text-slate-100">结构解析要点</p>
              <ul className="space-y-1">
                <li>• EG95 为 GPI 锚定蛋白，分子量约 15 kDa，来源于细粒棘球绦虫六钩蚴</li>
                <li>• 关键 B 细胞表位位于 aa 51–79 区段，介导保护性抗体应答</li>
                <li>• 四聚体串联结构（(GGGGS)₃ 接头）在 E. coli 中表达量从 ~5% 提升至 ~40% 总蛋白</li>
                <li>• 旋转 / 缩放：鼠标左键拖拽旋转，滚轮缩放，右键平移</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'regulatory' && (
          <RegulatoryTabContent />
        )}

        {activeTab === 'market' && (
          <MarketTabContent />
        )}

        {activeTab === 'quiz' && (
          <QuizTab
            chapterId="m1"
            mcq={mcqQuestions}
            caseBased={caseQuestions}
          />
        )}
      </div>

      {/* Glossary — always shown below tab content */}
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
