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
  Cell,
  ReferenceLine,
} from 'recharts';
import { FormulaBlock } from '@/components/ui/FormulaBlock';
import { BilingualHeading } from '@/components/ui/BilingualHeading';

/* ─── Data ─── */
const MARKET_DATA = [
  { year: 2023, value: 60.7 },
  { year: 2024, value: 65.2 },
  { year: 2025, value: 70.1 },
  { year: 2026, value: 75.4 },
  { year: 2027, value: 81.2 },
  { year: 2028, value: 87.5 },
  { year: 2029, value: 106.2 },
  { year: 2030, value: 125.8 },
];

const COMPANY_DATA = [
  { company: 'Zoetis', revenue: 8.5, color: '#0d9488' },
  { company: 'MSD Animal Health', revenue: 6.0, color: '#0891b2' },
  { company: 'Boehringer Ingelheim', revenue: 5.8, color: '#7c3aed' },
  { company: 'Elanco', revenue: 4.4, color: '#d97706' },
  { company: 'Ceva', revenue: 1.8, color: '#059669' },
  { company: 'Virbac', revenue: 1.5, color: '#dc2626' },
  { company: '申联生物', revenue: 0.35, color: '#6b7280' },
  { company: '澳龙生物', revenue: 0.02, color: '#f59e0b' },
];

const PHASES = [
  {
    period: '2024–2025',
    name: '法规合规期',
    color: 'violet',
    items: [
      '完成VICH GL体系文件建设',
      '获取中国GMP证书国际互认',
      '沙特SFDA注册申请提交',
      '目标市场: 沙特、科威特、伊拉克',
    ],
  },
  {
    period: '2026–2027',
    name: '渠道建设期',
    color: 'teal',
    items: [
      '中东核心分销商锁定（目标3-5家）',
      '东南亚注册（泰国ACFS、越南DAH）',
      '首批LSD疫苗出口（估算20万剂/年）',
      'WHO/FAO国际采购资质申请',
    ],
  },
  {
    period: '2028–2030',
    name: '规模扩张期',
    color: 'emerald',
    items: [
      'WHO PQ认证（预认证）',
      '联合国采购项目投标',
      '本地化分装合作（降低关税壁垒）',
      '目标收入: ¥5亿（国际业务占比30%）',
    ],
  },
];

/* ─── Custom Tooltip ─── */
interface TooltipPayloadEntry {
  value: number;
  name?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string | number;
}

function AreaTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-teal-200 bg-white px-3 py-2 shadow-lg dark:border-teal-700 dark:bg-slate-800">
      <p className="text-xs font-bold text-teal-600 dark:text-teal-400">{label}年</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
        ${payload[0].value}B
      </p>
    </div>
  );
}

function BarTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg dark:border-slate-600 dark:bg-slate-800">
      <p className="text-xs font-bold text-gray-600 dark:text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
        ${payload[0].value}B 年收入
      </p>
    </div>
  );
}

/* ─── TAM/SAM/SOM SVG ─── */
function TamSamSomChart() {
  const cx = 220;
  const cy = 220;
  const r1 = 190; // TAM
  const r2 = 130; // SAM
  const r3 = 60;  // SOM

  return (
    <svg viewBox="0 0 440 440" className="mx-auto max-w-sm w-full">
      {/* TAM */}
      <circle cx={cx} cy={cy} r={r1} fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
      {/* SAM */}
      <circle cx={cx} cy={cy} r={r2} fill="rgba(13,148,136,0.15)" stroke="#0d9488" strokeWidth="2" />
      {/* SOM */}
      <circle cx={cx} cy={cy} r={r3} fill="rgba(13,148,136,0.55)" stroke="#0d9488" strokeWidth="2.5" />

      {/* Labels with connectors */}
      {/* TAM label — top right */}
      <line x1={cx + r1 * 0.72} y1={cy - r1 * 0.72} x2={cx + 215} y2={cy - 140} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,2" />
      <text x={cx + 218} y={cy - 150} className="fill-gray-500 dark:fill-slate-400" fontSize="11" fontWeight="600">TAM</text>
      <text x={cx + 218} y={cy - 136} className="fill-gray-500 dark:fill-slate-400" fontSize="10">$125.8B</text>
      <text x={cx + 218} y={cy - 122} className="fill-gray-400 dark:fill-slate-500" fontSize="9">全球动保市场</text>

      {/* SAM label — right */}
      <line x1={cx + r2 * 0.78} y1={cy - r2 * 0.3} x2={cx + 215} y2={cy + 10} stroke="#0d9488" strokeWidth="1" strokeDasharray="4,2" />
      <text x={cx + 218} y={cy} className="fill-teal-600 dark:fill-teal-400" fontSize="11" fontWeight="600">SAM</text>
      <text x={cx + 218} y={cy + 14} className="fill-teal-600 dark:fill-teal-400" fontSize="10">$4.4B</text>
      <text x={cx + 218} y={cy + 28} className="fill-teal-500 dark:fill-teal-500" fontSize="9">中东+东南亚</text>
      <text x={cx + 218} y={cy + 40} className="fill-teal-500 dark:fill-teal-500" fontSize="9">反刍动物疫苗</text>

      {/* SOM label — bottom right */}
      <line x1={cx + r3 * 0.7} y1={cy + r3 * 0.7} x2={cx + 215} y2={cy + 120} stroke="#0d9488" strokeWidth="1" strokeDasharray="4,2" />
      <text x={cx + 218} y={cy + 112} className="fill-teal-700 dark:fill-teal-300" fontSize="11" fontWeight="700">SOM</text>
      <text x={cx + 218} y={cy + 126} className="fill-teal-700 dark:fill-teal-300" fontSize="10">$0.22B</text>
      <text x={cx + 218} y={cy + 140} className="fill-teal-600 dark:fill-teal-400" fontSize="9">澳龙5年目标</text>

      {/* Center label */}
      <text x={cx} y={cy - 8} textAnchor="middle" className="fill-white" fontSize="10" fontWeight="700">澳龙</text>
      <text x={cx} y={cy + 6} textAnchor="middle" className="fill-white" fontSize="9">SOM</text>
    </svg>
  );
}

/* ─── Main Export ─── */
export function MarketTabContent() {
  return (
    <div className="space-y-12">

      {/* ── Component 1: Global Market Area Chart ── */}
      <section>
        <BilingualHeading
          zhText="全球动保市场规模"
          enText="Global Animal Health Market Size"
          level="h2"
          className="mb-1"
        />
        <p className="mb-4 text-sm text-gray-500 dark:text-slate-400">
          CAGR 11.0%（2023-2030）
        </p>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={MARKET_DATA} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
                tickFormatter={(v: number) => `$${v}B`}
                width={52}
              />
              <Tooltip content={<AreaTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#0d9488"
                strokeWidth={2.5}
                fill="url(#tealGradient)"
                dot={{ fill: '#0d9488', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#0d9488' }}
              />
              <ReferenceLine
                x={2030}
                stroke="#0d9488"
                strokeDasharray="4 2"
                label={{ value: '$125.8B', position: 'top', fontSize: 10, fill: '#0d9488' }}
              />
            </AreaChart>
          </ResponsiveContainer>

          <p className="mt-3 text-center text-xs text-gray-500 dark:text-slate-400">
            反刍动物疫苗子市场: $3.19B (2025) → $4.4-7.0B (2030)，CAGR 6.6-7.9%
          </p>
        </div>
      </section>

      {/* ── Component 2: Competitor Bar Chart ── */}
      <section>
        <BilingualHeading
          zhText="头部企业市场份额"
          enText="Leading Companies by Revenue"
          level="h2"
          className="mb-4"
        />
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={COMPANY_DATA}
              layout="vertical"
              margin={{ top: 8, right: 80, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
                tickFormatter={(v: number) => `$${v}B`}
              />
              <YAxis
                type="category"
                dataKey="company"
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
                width={110}
              />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                {COMPANY_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-1 text-center text-xs text-amber-600 dark:text-amber-400 font-medium">
            ↑ 澳龙生物（$0.02B）— 增长空间巨大
          </p>
        </div>
      </section>

      {/* ── Component 3: Valuation Cards ── */}
      <section>
        <BilingualHeading
          zhText="澳龙估值分析"
          enText="Auleon Valuation Analysis"
          level="h2"
          className="mb-4"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Card A — NAV */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center dark:border-emerald-800 dark:bg-emerald-950/30">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              NAV 资产净值
            </p>
            <p className="my-2 text-3xl font-bold text-emerald-700 dark:text-emerald-300">
              ¥1.21亿
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400">账面价值基准</p>
          </div>

          {/* Card B — DCF (highlighted) */}
          <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-5 text-center shadow-md dark:border-amber-600 dark:bg-amber-950/40">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
              DCF 估值
            </p>
            <p className="my-2 text-4xl font-bold text-amber-700 dark:text-amber-300">
              ¥7.52亿
            </p>
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">521% 溢价</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
              溢价来源 = 未来现金流折现
            </p>
          </div>

          {/* Card C — 恒通 */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-center dark:border-blue-800 dark:bg-blue-950/30">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              恒通股权收购
            </p>
            <p className="my-2 text-3xl font-bold text-blue-700 dark:text-blue-300">
              ¥6.85亿
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400">40%股权 = ¥2.74亿</p>
            <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
              业绩对赌：¥8000-9000万/年 × 3年
            </p>
          </div>
        </div>

        {/* KaTeX Formula */}
        <FormulaBlock
          latex="\text{DCF溢价} = \frac{\sum_{t=1}^{10} \frac{CF_t}{(1+r)^t}}{NAV} - 1 = 521\%"
          label="DCF 溢价计算公式 — 10年现金流折现 vs 账面净资产"
          className="mt-4"
        />
      </section>

      {/* ── Component 4: Roadmap Stepper ── */}
      <section>
        <BilingualHeading
          zhText="出海三阶段路线图"
          enText="Overseas Expansion — 3-Phase Roadmap"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {PHASES.map((phase) => {
            const colorMap: Record<string, { border: string; bg: string; badge: string; period: string; dot: string }> = {
              violet: {
                border: 'border-violet-300 dark:border-violet-700',
                bg: 'bg-violet-50 dark:bg-violet-950/30',
                badge: 'bg-violet-600',
                period: 'text-violet-600 dark:text-violet-400',
                dot: 'bg-violet-500',
              },
              teal: {
                border: 'border-teal-300 dark:border-teal-700',
                bg: 'bg-teal-50 dark:bg-teal-950/30',
                badge: 'bg-teal-600',
                period: 'text-teal-600 dark:text-teal-400',
                dot: 'bg-teal-500',
              },
              emerald: {
                border: 'border-emerald-300 dark:border-emerald-700',
                bg: 'bg-emerald-50 dark:bg-emerald-950/30',
                badge: 'bg-emerald-600',
                period: 'text-emerald-600 dark:text-emerald-400',
                dot: 'bg-emerald-500',
              },
            };
            const colors = colorMap[phase.color] ?? colorMap['teal']!;

            return (
              <div
                key={phase.period}
                className={`rounded-xl border p-4 ${colors.border} ${colors.bg}`}
              >
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-bold text-white ${colors.badge}`}
                  >
                    {phase.period}
                  </span>
                </div>
                <p className={`mb-3 text-sm font-bold ${colors.period}`}>{phase.name}</p>
                <ul className="space-y-2">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${colors.dot}`} />
                      <span className="text-xs leading-relaxed text-gray-700 dark:text-slate-300">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Component 5: TAM/SAM/SOM ── */}
      <section>
        <BilingualHeading
          zhText="TAM / SAM / SOM 市场层级"
          enText="Total / Serviceable / Obtainable Market"
          level="h2"
          className="mb-4"
        />
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <TamSamSomChart />
          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
            <div>
              <span className="inline-block h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-500 mr-1 align-middle" />
              <span className="text-gray-600 dark:text-slate-400 font-semibold">TAM</span>
              <p className="text-gray-500 dark:text-slate-500 mt-0.5">$125.8B 全球</p>
            </div>
            <div>
              <span className="inline-block h-3 w-3 rounded-full bg-teal-400 opacity-60 mr-1 align-middle" />
              <span className="text-teal-600 dark:text-teal-400 font-semibold">SAM</span>
              <p className="text-gray-500 dark:text-slate-500 mt-0.5">$4.4B 中东+东南亚</p>
            </div>
            <div>
              <span className="inline-block h-3 w-3 rounded-full bg-teal-600 mr-1 align-middle" />
              <span className="text-teal-700 dark:text-teal-300 font-semibold">SOM</span>
              <p className="text-gray-500 dark:text-slate-500 mt-0.5">$0.22B 澳龙目标</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
