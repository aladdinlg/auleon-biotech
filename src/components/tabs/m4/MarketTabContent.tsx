'use client';

import {
  AreaChart,
  Area,
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

const LOSS_DATA = [
  {
    title: '亚洲直接损失',
    value: '$14.6亿美元/年',
    tone: 'danger' as const,
    color: 'border-rose-200 bg-rose-50/70 dark:border-rose-800 dark:bg-rose-950/30',
  },
  {
    title: '含间接损失',
    value: '$55.1亿美元/年',
    tone: 'warning' as const,
    color: 'border-amber-200 bg-amber-50/70 dark:border-amber-800 dark:bg-amber-950/30',
  },
  {
    title: '印度2022单次疫情',
    value: '$22.1亿美元',
    tone: 'success' as const,
    color: 'border-teal-200 bg-teal-50/70 dark:border-teal-800 dark:bg-teal-950/30',
  },
];

const DEMAND_DATA = [
  { name: '东南亚', doses: 8500, market: 25.5 },
  { name: '南亚', doses: 12000, market: 36.0 },
  { name: '中东', doses: 6500, market: 19.5 },
  { name: '中亚', doses: 4000, market: 12.0 },
  { name: '东非', doses: 9000, market: 27.0 },
];

const COMPETITORS = [
  {
    name: 'MSD Lumpyvax',
    detail: '欧盟批准，同源Neethling株，价格约$0.8/剂',
    color: 'border-sky-200 bg-sky-50/70 dark:border-sky-800 dark:bg-sky-950/30',
  },
  {
    name: 'Bioveta（捷克）',
    detail: '欧盟+中东，产能200万剂/月',
    color: 'border-violet-200 bg-violet-50/70 dark:border-violet-800 dark:bg-violet-950/30',
  },
  {
    name: '澳龙GTPV异源苗',
    detail: '中国批准，东南亚出口，$0.3/剂，产能弹性强',
    color: 'border-teal-200 bg-teal-50/70 dark:border-teal-800 dark:bg-teal-950/30',
  },
  {
    name: 'VSVRI（南非）',
    detail: '非洲市场主导，Onderstepoort株',
    color: 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-800 dark:bg-emerald-950/30',
  },
];

const EXPORT_GROWTH = [
  { year: '2021', actual: 20 },
  { year: '2022', actual: 50 },
  { year: '2023', actual: 120 },
  { year: '2024', actual: 280 },
  { year: '2025', projected: 500 },
  { year: '2026', projected: 800 },
  { year: '2027', projected: 1200 },
];

export function MarketTabContent() {
  return (
    <div className="space-y-10">
      <section>
        <BilingualHeading
          zhText="LSD全球经济损失数据"
          enText="Global Economic Losses from LSD"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {LOSS_DATA.map((item) => (
            <Card key={item.title} className={`rounded-xl border p-5 ${item.color}`}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{item.title}</p>
                <Badge tone={item.tone}>损失</Badge>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-slate-100">{item.value}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <BilingualHeading
          zhText="疫苗需求量估算"
          enText="Estimated Vaccine Demand"
          level="h2"
          className="mb-2"
        />
        <p className="mb-4 text-xs text-gray-500 dark:text-slate-400">doses: 万剂/年需求, market: 百万美元市场规模</p>
        <Card className="rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={DEMAND_DATA} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} width={42} />
              <Tooltip />
              <Bar dataKey="market" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 grid gap-2 sm:grid-cols-5">
            {DEMAND_DATA.map((item) => (
              <div key={item.name} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-900/50">
                <p className="text-[10px] text-gray-500 dark:text-slate-400">{item.name}</p>
                <p className="text-xs font-semibold text-gray-700 dark:text-slate-300">需求 {item.doses}万剂</p>
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
          {COMPETITORS.map((item) => (
            <Card key={item.name} className={`rounded-xl border p-5 ${item.color}`}>
              <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-slate-100">{item.name}</p>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-slate-400">{item.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <BilingualHeading
          zhText="澳龙LSD出口增长路径"
          enText="Auleon LSD Export Growth Path"
          level="h2"
          className="mb-2"
        />
        <div className="mb-4 flex items-center gap-2">
          <Badge className="bg-teal-600 text-white">2021-2024 实际</Badge>
          <Badge className="bg-violet-600 text-white">2025-2027 预测</Badge>
          <p className="text-xs text-gray-500 dark:text-slate-400">单位：万剂</p>
        </div>
        <Card className="rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={EXPORT_GROWTH} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="m4Actual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.04} />
                </linearGradient>
                <linearGradient id="m4Projected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} width={42} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#0d9488"
                strokeWidth={2.5}
                fill="url(#m4Actual)"
                dot={{ fill: '#0d9488', r: 3 }}
                connectNulls={false}
              />
              <Area
                type="monotone"
                dataKey="projected"
                stroke="#7c3aed"
                strokeWidth={2.5}
                fill="url(#m4Projected)"
                dot={{ fill: '#7c3aed', r: 3 }}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </section>
    </div>
  );
}
