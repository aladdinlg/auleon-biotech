'use client';

import { useState } from 'react';
import { PrincipleTab } from '@/components/tabs/PrincipleTab';
import { GlossaryTab } from '@/components/tabs/GlossaryTab';
import { QuizTab } from '@/components/tabs/QuizTab';
import { VisualTab } from '@/components/tabs/VisualTab';
import { MolstarViewer } from '@/components/bio/viewers/MolstarViewer';
import { cn } from '@/lib/utils';
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
          <div className="space-y-6">
            <div>
              <h2 className="mb-1 text-xl font-semibold text-gray-900 dark:text-slate-100">
                VICH 框架概览
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                兽药国际协调委员会 (VICH) 技术指南体系 · 兽用生物制品注册核心法规
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  code: 'VICH GL1',
                  title: '效力检验验证',
                  desc: '规定疫苗批次效力试验设计、统计方法及最低保护阈值要求',
                  color: 'blue',
                },
                {
                  code: 'VICH GL2',
                  title: '安全性研究',
                  desc: '目标动物、实验室动物及环境安全性评估，含过量接种试验',
                  color: 'green',
                },
                {
                  code: 'VICH GL8',
                  title: '稳定性研究',
                  desc: '货架期验证、加速老化试验、实时稳定性数据要求',
                  color: 'amber',
                },
                {
                  code: 'VICH GL44',
                  title: '免疫学研究',
                  desc: '血清学终点、免疫持续期、母源抗体干扰评估',
                  color: 'violet',
                },
              ].map((item) => (
                <div
                  key={item.code}
                  className={cn(
                    'rounded-xl border p-4',
                    item.color === 'blue' && 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30',
                    item.color === 'green' && 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30',
                    item.color === 'amber' && 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30',
                    item.color === 'violet' && 'border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/30',
                  )}
                >
                  <p className={cn(
                    'mb-1 text-xs font-bold uppercase tracking-wide',
                    item.color === 'blue' && 'text-blue-600 dark:text-blue-400',
                    item.color === 'green' && 'text-green-600 dark:text-green-400',
                    item.color === 'amber' && 'text-amber-600 dark:text-amber-400',
                    item.color === 'violet' && 'text-violet-600 dark:text-violet-400',
                  )}>
                    {item.code}
                  </p>
                  <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-slate-100">
                    {item.title}
                  </p>
                  <p className="text-xs leading-5 text-gray-600 dark:text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-600 dark:bg-slate-800 dark:text-slate-400">
              <p className="mb-2 font-semibold text-gray-900 dark:text-slate-100">
                中国注册路径 · NMPA 兽药注册
              </p>
              <p>
                澳龙 EG95 疫苗须依据《兽药注册办法》（2020 修订版）申报，
                核心材料包括：CMC（化学、制造和控制）资料、GLP 安全性研究报告、
                GCP 田间效力试验、及与 VICH 指南对应的质量标准草案。
                临床试验须在 CNKI 认证的 GCP 基地完成，绵羊自然感染模型攻毒保护率 ≥ 90% 为核准门槛。
              </p>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-1 text-xl font-semibold text-gray-900 dark:text-slate-100">
                全球兽药市场格局
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                反刍动物疫苗市场规模与增长预测 · 数据来源：Mordor Intelligence 2024
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: '2025 市场规模',
                  value: '~$31.9B',
                  sub: '全球兽药市场总量',
                  color: 'teal',
                },
                {
                  label: 'CAGR 2025–2030',
                  value: '6.6–7.9%',
                  sub: '反刍动物疫苗年复合增长率',
                  color: 'blue',
                },
                {
                  label: '2030 预测规模',
                  value: '$44–70B',
                  sub: '亚太/东南亚是最快增速引擎',
                  color: 'violet',
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className={cn(
                    'rounded-xl border p-5 text-center',
                    card.color === 'teal' && 'border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/30',
                    card.color === 'blue' && 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30',
                    card.color === 'violet' && 'border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/30',
                  )}
                >
                  <p className="mb-1 text-xs text-gray-500 dark:text-slate-400">{card.label}</p>
                  <p className={cn(
                    'text-2xl font-bold',
                    card.color === 'teal' && 'text-teal-700 dark:text-teal-300',
                    card.color === 'blue' && 'text-blue-700 dark:text-blue-300',
                    card.color === 'violet' && 'text-violet-700 dark:text-violet-300',
                  )}>
                    {card.value}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{card.sub}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-slate-100">
                竞争格局快照
              </p>
              <div className="space-y-3">
                {[
                  { company: 'Zoetis', share: '22%', note: '全球最大兽药企业，口蹄疫 + 猪蓝耳疫苗领导者' },
                  { company: 'Boehringer Ingelheim', share: '16%', note: '猪疫苗强势，并购 Merial 后规模扩张' },
                  { company: 'Merck AH (MSD)', share: '14%', note: '反刍动物 BVD、布鲁氏菌疫苗核心供应商' },
                  { company: '中牧股份 / 普莱柯', share: '国内 Top5', note: '中国市场主导，政府采购渠道优势' },
                  { company: 'Auleon Biologicals（澳龙）', share: '新进入者', note: 'EG95 棘球蚴疫苗 — 全球唯一已商业化产品' },
                ].map((row) => (
                  <div key={row.company} className="flex items-start gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0 dark:border-slate-700">
                    <div className="w-40 flex-shrink-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{row.company}</p>
                      <p className="text-xs text-teal-600 dark:text-teal-400">{row.share}</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600 dark:text-slate-400">{row.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
