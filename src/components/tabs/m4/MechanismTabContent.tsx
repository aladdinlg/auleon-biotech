'use client';

import { BilingualHeading } from '@/components/ui/BilingualHeading';

/* ─── Section 1: Infection flow ─── */
const FLOW_STEPS = [
  { icon: '🦟', label: '媒介叮咬接种', desc: '吸血昆虫（厩螫蝇/蠓）叮咬时将病毒注入皮肤' },
  { icon: '🔗', label: '病毒吸附', desc: 'P32蛋白+L1R类似蛋白与宿主细胞受体结合' },
  { icon: '🔀', label: '膜融合入胞', desc: '病毒包膜与细胞膜融合，核心蛋白质进入胞质' },
  { icon: '⚙️', label: '胞质复制', desc: '在胞质病毒工厂（Viral Factory）内完成DNA复制与装配' },
];

/* ─── Section 2: Key viral proteins ─── */
const PROTEINS = [
  {
    name: 'P32蛋白',
    orf: 'ORF074',
    color: 'teal',
    desc: '主要免疫原蛋白，为ELISA诊断靶点。间接ELISA系统灵敏度94% / 特异性96.6%，三种痘病毒均保守表达。',
  },
  {
    name: 'L1R类似蛋白',
    orf: 'ORF080',
    color: 'violet',
    desc: '含6个保守半胱氨酸残基（Cys）及豆蔻酰化位点，是中和抗体的核心靶点，介导病毒颗粒进入细胞。',
  },
  {
    name: 'IL-10同源蛋白',
    orf: 'vIL-10',
    color: 'amber',
    desc: '模拟宿主IL-10细胞因子，抑制NK细胞和T细胞激活，帮助病毒在感染早期逃避炎症清除。',
  },
];

/* ─── Section 4: Stats ─── */
const STATS = [
  {
    label: '巴尔干经验',
    value: '70–85%',
    sub: '疫苗覆盖率 → 1个月内显著压制传播',
    color: 'teal',
  },
  {
    label: '印度2022疫情',
    value: '240万头',
    sub: '感染，经济损失$22.1亿美元',
    color: 'red',
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  teal: {
    border: 'border-teal-200 dark:border-teal-800',
    bg: 'bg-teal-50 dark:bg-teal-950/30',
    text: 'text-teal-700 dark:text-teal-300',
    badge: 'bg-teal-600',
  },
  violet: {
    border: 'border-violet-200 dark:border-violet-800',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    text: 'text-violet-700 dark:text-violet-300',
    badge: 'bg-violet-600',
  },
  amber: {
    border: 'border-amber-200 dark:border-amber-800',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-300',
    badge: 'bg-amber-500',
  },
  red: {
    border: 'border-red-200 dark:border-red-800',
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-700 dark:text-red-400',
    badge: 'bg-red-600',
  },
};

export function MechanismTabContent() {
  return (
    <div className="space-y-10">

      {/* ── Section 1: Infection flow ── */}
      <section>
        <BilingualHeading
          zhText="LSDV 病毒入侵机制"
          enText="Capripoxvirus Cell Entry Mechanism"
          level="h2"
          className="mb-1"
        />
        <p className="mb-4 text-sm text-gray-500 dark:text-slate-400">
          山羊痘病毒如何感染宿主细胞
        </p>

        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-[600px] items-stretch gap-0">
            {FLOW_STEPS.map((step, idx) => (
              <div key={step.label} className="flex flex-1 items-center">
                <div className="flex-1 rounded-xl border border-teal-200 bg-teal-50 p-3 text-center dark:border-teal-800 dark:bg-teal-950/30">
                  <div className="mb-1 text-2xl">{step.icon}</div>
                  <p className="mb-1 text-xs font-bold text-teal-700 dark:text-teal-300">
                    {step.label}
                  </p>
                  <p className="text-[10px] leading-relaxed text-gray-500 dark:text-slate-400">
                    {step.desc}
                  </p>
                </div>
                {idx < FLOW_STEPS.length - 1 && (
                  <div className="flex-shrink-0 px-1 text-lg font-bold text-teal-400">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Viral proteins ── */}
      <section>
        <BilingualHeading
          zhText="关键病毒蛋白功能"
          enText="Key Viral Protein Functions"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {PROTEINS.map((p) => {
            const c = colorMap[p.color] ?? colorMap['teal']!;
            return (
              <div key={p.name} className={`rounded-xl border p-4 ${c.border} ${c.bg}`}>
                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-bold text-white ${c.badge}`}>
                    {p.name}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 dark:text-slate-500">
                    {p.orf}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-slate-400">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 3: Cross-protection info ── */}
      <section>
        <BilingualHeading
          zhText="异源疫苗交叉保护原理"
          enText="Heterologous Cross-Protection Mechanism"
          level="h2"
          className="mb-4"
        />
        <div className="rounded-xl border border-teal-200 bg-white p-5 dark:border-teal-800 dark:bg-slate-800">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex-shrink-0 rounded-full bg-teal-600 px-2 py-0.5 text-[10px] font-bold text-white">
                同源性
              </span>
              <p className="text-sm text-gray-700 dark:text-slate-300">
                LSDV / GTPV / SPPV 核苷酸同源性{' '}
                <span className="font-bold text-teal-600 dark:text-teal-400">96–97%</span>，
                P32和L1R蛋白高度保守
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex-shrink-0 rounded-full bg-teal-600 px-2 py-0.5 text-[10px] font-bold text-white">
                交叉保护
              </span>
              <p className="text-sm text-gray-700 dark:text-slate-300">
                山羊痘（GTPV）疫苗可诱导针对LSDV的{' '}
                <span className="font-bold">交叉中和抗体</span>及IFN-γ细胞免疫应答
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex-shrink-0 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                剂量调整
              </span>
              <p className="text-sm text-gray-700 dark:text-slate-300">
                牛接种需{' '}
                <span className="font-bold text-amber-600 dark:text-amber-400">3倍山羊剂量</span>
                （印度Uttarkashi株临床数据）
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex-shrink-0 rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white">
                保护效力
              </span>
              <p className="text-sm text-gray-700 dark:text-slate-300">
                约{' '}
                <span className="font-bold text-violet-600 dark:text-violet-400">70–100%</span>
                （同源苗 &gt;95%；GTPV异源保护完整；SPPV保护不足）
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Global spread stats + warning ── */}
      <section>
        <BilingualHeading
          zhText="全球传播波次 · 疫苗覆盖率数据"
          enText="Global Spread & Vaccine Coverage"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {STATS.map((s) => {
            const c = colorMap[s.color] ?? colorMap['teal']!;
            return (
              <div
                key={s.label}
                className={`rounded-xl border p-5 text-center ${c.border} ${c.bg}`}
              >
                <p className="mb-1 text-xs text-gray-500 dark:text-slate-400">{s.label}</p>
                <p className={`text-2xl font-bold ${c.text}`}>{s.value}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{s.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Amber warning */}
        <div className="mt-4 flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/30">
          <span className="mt-0.5 flex-shrink-0 text-lg">⚠️</span>
          <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-300">
            <span className="font-bold">分子监测警告：</span>
            Cluster 2.5重组株（含疫苗株序列片段）已在多个国家检出，提示LSDV存在疫苗株-野毒株重组风险，
            需持续分子流行病学监测。
          </p>
        </div>
      </section>
    </div>
  );
}
