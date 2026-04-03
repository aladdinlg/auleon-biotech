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

const GLOBAL_MARKET_DATA = [
  { year: '2023', value: 60.7 },
  { year: '2024', value: 67.4 },
  { year: '2025', value: 74.8 },
  { year: '2026', value: 83.0 },
  { year: '2027', value: 92.1 },
  { year: '2028', value: 102.2 },
  { year: '2029', value: 113.5 },
  { year: '2030', value: 125.8 },
];

const SEGMENT_CARDS = [
  { name: '伴侣动物疫苗', value: '$28.4B (47%)', note: '增速最快', tone: 'success' as const },
  { name: '反刍动物疫苗', value: '$19.1B (31%)', note: 'CAGR 6.6-7.9%', tone: 'default' as const },
  { name: '猪用疫苗', value: '$8.4B (14%)', note: '稳定增长', tone: 'warning' as const },
  { name: '禽用疫苗', value: '$4.8B (8%)', note: '受禽流感影响波动', tone: 'danger' as const },
];

const CHINA_STATS = [
  {
    title: '中国兽用生物制品市场',
    value: '~¥180亿（2023）',
    desc: '区域需求与政策支持同步增长',
    color: 'border-teal-200 bg-teal-50/70 dark:border-teal-800 dark:bg-teal-950/30',
  },
  {
    title: '批签发制度',
    value: '每批次强制检验',
    desc: '中监所（IVDC）负责批签发管理',
    color: 'border-amber-200 bg-amber-50/70 dark:border-amber-800 dark:bg-amber-950/30',
  },
  {
    title: '国产化率',
    value: '>85%',
    desc: '政策支持国产替代与自主供应链',
    color: 'border-violet-200 bg-violet-50/70 dark:border-violet-800 dark:bg-violet-950/30',
  },
];

const PLATFORM_TREND = [
  { name: 'mRNA疫苗', value: 42 },
  { name: '亚单位疫苗', value: 35 },
  { name: '病毒载体', value: 28 },
  { name: '灭活疫苗', value: 15 },
  { name: '减毒活苗', value: 8 },
];

export function MarketTabContent() {
  return (
    <div className="space-y-10">
      <section>
        <BilingualHeading
          zhText="全球兽用生物制品市场规模"
          enText="Global Veterinary Biologics Market Size"
          level="h2"
          className="mb-2"
        />
        <div className="mb-4 flex items-center gap-2">
          <Badge className="bg-teal-600 text-white">CAGR 11%</Badge>
          <p className="text-xs text-gray-500 dark:text-slate-400">单位：十亿美元</p>
        </div>
        <Card className="rounded-xl border border-teal-200 bg-white p-4 dark:border-teal-800 dark:bg-slate-800">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={GLOBAL_MARKET_DATA} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="m1GlobalTeal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} width={52} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#0d9488"
                strokeWidth={2.5}
                fill="url(#m1GlobalTeal)"
                dot={{ fill: '#0d9488', r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </section>

      <section>
        <BilingualHeading
          zhText="细分市场结构"
          enText="Segment Structure"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {SEGMENT_CARDS.map((item) => (
            <Card
              key={item.name}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{item.name}</p>
                <Badge tone={item.tone}>{item.value}</Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-400">{item.note}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <BilingualHeading
          zhText="中国市场特征"
          enText="China Market Characteristics"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {CHINA_STATS.map((stat) => (
            <Card key={stat.title} className={`rounded-xl border p-5 ${stat.color}`}>
              <p className="mb-1 text-xs text-gray-500 dark:text-slate-400">{stat.title}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-slate-100">{stat.value}</p>
              <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-slate-400">{stat.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <BilingualHeading
          zhText="技术平台投资趋势"
          enText="Technology Platform Investment Trend"
          level="h2"
          className="mb-2"
        />
        <p className="mb-4 text-xs text-gray-500 dark:text-slate-400">研发管线占比增速(%/年)</p>
        <Card className="rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={PLATFORM_TREND} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="#0d9488" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </section>
    </div>
  );
}
