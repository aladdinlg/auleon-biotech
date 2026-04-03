'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Badge } from '@/components/ui/Badge';
import { BilingualHeading } from '@/components/ui/BilingualHeading';
import { Card } from '@/components/ui/Card';

const LOSS_STATS = [
  {
    title: '全球年损失',
    value: '$5.8亿美元',
    desc: '畜牧业直接损失',
    color: 'border-rose-200 bg-rose-50/70 dark:border-rose-800 dark:bg-rose-950/30',
    tone: 'danger' as const,
  },
  {
    title: '人间病例',
    value: '50万+/年',
    desc: 'WHO估计',
    color: 'border-amber-200 bg-amber-50/70 dark:border-amber-800 dark:bg-amber-950/30',
    tone: 'warning' as const,
  },
  {
    title: '中东高发区',
    value: '沙特8-15% / 伊拉克12-20%',
    desc: '绵羊与牛阳性率高',
    color: 'border-teal-200 bg-teal-50/70 dark:border-teal-800 dark:bg-teal-950/30',
    tone: 'success' as const,
  },
];

const BCR_BASE = [
  { name: '伊拉克\nRev.1', bcr: 4.25, npv: 10.6 },
  { name: '蒙古\nRev.1', bcr: 3.2, npv: 18.3 },
  { name: '波黑\n疫苗vs扑杀', bcr: 6.72, npv: null },
  { name: '哈萨克\n扑杀(失败)', bcr: -0.8, npv: -45 },
];

const BCR_DATA = BCR_BASE.map((item) => ({
  ...item,
  positive: item.bcr > 0 ? item.bcr : 0,
  negative: item.bcr < 0 ? item.bcr : 0,
}));

const GLOBAL_MARKET = [
  {
    title: '全球市场规模',
    detail: '~$2.1亿美元/年',
  },
  {
    title: '主要供应商',
    detail: 'MSD Animal Health / 中牧股份 / 澳龙生物',
  },
  {
    title: '增长驱动',
    detail: '中东/中亚净化计划，OIE路线图2030',
  },
  {
    title: '澳龙份额',
    detail: '国内约15%，出口<1%（增长空间巨大）',
  },
];

const ENTRY_STRATEGY = [
  {
    year: '2025',
    task: '沙特SFDA Rev.1注册（含人畜共患风险评估包）',
  },
  {
    year: '2026',
    task: '伊拉克/约旦政府采购招标，提供BCR证明材料',
  },
  {
    year: '2027',
    task: 'OIE/FAO联合净化项目合作，建立区域参考实验室关系',
  },
];

export function MarketTabContent() {
  return (
    <div className="space-y-10">
      <section>
        <BilingualHeading
          zhText="布病全球经济损失"
          enText="Global Economic Burden of Brucellosis"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {LOSS_STATS.map((item) => (
            <Card key={item.title} className={`rounded-xl border p-5 ${item.color}`}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{item.title}</p>
                <Badge tone={item.tone}>指标</Badge>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-slate-100">{item.value}</p>
              <p className="mt-2 text-xs text-gray-600 dark:text-slate-400">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <BilingualHeading
          zhText="BCR经济效益对比"
          enText="BCR Economic Benefit Comparison"
          level="h2"
          className="mb-4"
        />
        <Card className="rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={BCR_DATA} margin={{ top: 12, right: 12, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} width={42} />
              <Tooltip />
              <Bar dataKey="positive" stackId="bcr" fill="#0d9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="negative" stackId="bcr" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            {BCR_BASE.map((item) => (
              <div key={item.name} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-900/50">
                <p className="text-[10px] text-gray-500 dark:text-slate-400">{item.name.replace('\n', ' ')}</p>
                <p className="text-xs font-semibold text-gray-700 dark:text-slate-300">BCR {item.bcr}</p>
                <p className="text-[10px] text-gray-500 dark:text-slate-400">NPV {item.npv ?? 'N/A'}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <BilingualHeading
          zhText="全球布病疫苗市场"
          enText="Global Brucellosis Vaccine Market"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {GLOBAL_MARKET.map((item) => (
            <Card
              key={item.title}
              className="rounded-xl border border-teal-200 bg-teal-50/70 p-5 dark:border-teal-800 dark:bg-teal-950/30"
            >
              <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-slate-100">{item.title}</p>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-slate-400">{item.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <BilingualHeading
          zhText="中东布病防控市场进入策略"
          enText="Middle East Brucellosis Market Entry Strategy"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {ENTRY_STRATEGY.map((step, index) => (
            <Card
              key={step.year}
              className="rounded-xl border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-800 dark:bg-violet-950/30"
            >
              <div className="mb-2 flex items-center gap-2">
                <Badge className="bg-violet-600 text-white">Step {index + 1}</Badge>
                <p className="text-xs font-semibold text-violet-700 dark:text-violet-300">{step.year}</p>
              </div>
              <p className="text-xs leading-relaxed text-gray-700 dark:text-slate-300">{step.task}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
