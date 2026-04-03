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

const ECONOMIC_BURDEN = [
  {
    title: '全球年病例',
    value: '207,368例（GBD 2019）',
    tone: 'warning' as const,
    color: 'border-amber-200 bg-amber-50/70 dark:border-amber-800 dark:bg-amber-950/30',
  },
  {
    title: 'DALYs',
    value: '122,457/年',
    tone: 'danger' as const,
    color: 'border-rose-200 bg-rose-50/70 dark:border-rose-800 dark:bg-rose-950/30',
  },
  {
    title: '畜牧业损失',
    value: '$3亿美元/年',
    tone: 'success' as const,
    color: 'border-teal-200 bg-teal-50/70 dark:border-teal-800 dark:bg-teal-950/30',
  },
];

const TARGET_MARKET_DATA = [
  { name: '中国新疆', sheep: 3200, value: 9.6 },
  { name: '中亚', sheep: 8500, value: 25.5 },
  { name: '中东', sheep: 12000, value: 36.0 },
  { name: '南美', sheep: 9500, value: 28.5 },
  { name: '东非', sheep: 7000, value: 21.0 },
];

const COMPETITION = [
  {
    name: '澳龙EG95（中国2007）',
    points: ['中国市场领先', '出口认证进行中', '产能约500万剂/年'],
    color: 'border-teal-200 bg-teal-50/70 dark:border-teal-800 dark:bg-teal-950/30',
    tone: 'success' as const,
  },
  {
    name: 'Tecnovax（阿根廷2011）',
    points: ['南美市场', 'WHO-PAHO合作', '价格约$2.5/剂'],
    color: 'border-violet-200 bg-violet-50/70 dark:border-violet-800 dark:bg-violet-950/30',
    tone: 'default' as const,
  },
];

const ROADMAP = [
  {
    period: '2024-2025',
    title: '中东注册与示范',
    details: '中东注册（伊拉克IVA/沙特SFDA），FAO合作试点',
  },
  {
    period: '2026-2027',
    title: '中亚规模化推广',
    details: '中亚规模化推广（哈萨克斯坦/吉尔吉斯斯坦），WHO预认证申请',
  },
  {
    period: '2028-2030',
    title: '全球供应商定位',
    details: '目标销量500万剂/年，收入¥1.5亿',
  },
];

export function MarketTabContent() {
  return (
    <div className="space-y-10">
      <section>
        <BilingualHeading
          zhText="包虫病全球经济负担"
          enText="Global Economic Burden of Cystic Echinococcosis"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {ECONOMIC_BURDEN.map((item) => (
            <Card key={item.title} className={`rounded-xl border p-5 ${item.color}`}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{item.title}</p>
                <Badge tone={item.tone}>关键指标</Badge>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-slate-100">{item.value}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <BilingualHeading
          zhText="目标市场规模估算"
          enText="Estimated Target Market Size"
          level="h2"
          className="mb-2"
        />
        <p className="mb-4 text-xs text-gray-500 dark:text-slate-400">
          万只易感羊群（sheep）与潜在市场规模（百万美元，按$3/剂×2剂）
        </p>
        <Card className="rounded-xl border border-teal-200 bg-white p-4 dark:border-teal-800 dark:bg-slate-800">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={TARGET_MARKET_DATA} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} width={42} />
              <Tooltip />
              <Bar dataKey="value" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 grid gap-2 sm:grid-cols-5">
            {TARGET_MARKET_DATA.map((item) => (
              <div key={item.name} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-900/50">
                <p className="text-[10px] text-gray-500 dark:text-slate-400">{item.name}</p>
                <p className="text-xs font-semibold text-gray-700 dark:text-slate-300">羊群 {item.sheep}万只</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <BilingualHeading
          zhText="竞争格局"
          enText="Competitive Landscape"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {COMPETITION.map((item) => (
            <Card key={item.name} className={`rounded-xl border p-5 ${item.color}`}>
              <div className="mb-3 flex items-center gap-2">
                <Badge tone={item.tone}>核心玩家</Badge>
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{item.name}</p>
              </div>
              <div className="space-y-1.5">
                {item.points.map((point) => (
                  <p key={point} className="text-xs leading-relaxed text-gray-600 dark:text-slate-400">
                    {point}
                  </p>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <BilingualHeading
          zhText="澳龙EG95 5年商业化路径"
          enText="Auleon EG95 5-Year Commercialization Path"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {ROADMAP.map((item, index) => (
            <Card
              key={item.period}
              className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-800 dark:bg-amber-950/30"
            >
              <div className="mb-2 flex items-center gap-2">
                <Badge tone="warning">阶段 {index + 1}</Badge>
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">{item.period}</p>
              </div>
              <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-slate-100">{item.title}</p>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-slate-400">{item.details}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
