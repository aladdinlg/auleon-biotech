'use client';

import { BilingualHeading } from '@/components/ui/BilingualHeading';

/* ─── Section 1: Evasion steps ─── */
const EVASION_STEPS = [
  {
    step: 1,
    title: '光滑型LPS外膜',
    desc: '屏蔽PAMP识别，逃避TLR4激活——细菌表面光滑结构使固有免疫难以识别',
    color: 'red',
  },
  {
    step: 2,
    title: 'T4SS分泌效应蛋白',
    desc: 'BtpA/BtpB通过IV型分泌系统注入，抑制宿主TLR信号通路下游NF-κB激活',
    color: 'orange',
  },
  {
    step: 3,
    title: 'VceC效应蛋白',
    desc: '靶向IRF3转录因子，抑制I型干扰素（IFN-β）产生，削弱抗病毒/抗菌状态',
    color: 'orange',
  },
  {
    step: 4,
    title: '布鲁氏菌含空泡（BCV）',
    desc: '改变吞噬体膜脂质组成，阻止溶酶体融合，在胞内安全繁殖形成慢性感染',
    color: 'red',
  },
];

/* ─── Section 2: Comparison table rows ─── */
const COMPARISON_ROWS = [
  { evasion: 'LPS屏蔽', counter: 'RB51粗糙型疫苗暴露内膜抗原' },
  { evasion: 'T4SS干扰', counter: '减毒株T4SS功能受损，注射效应蛋白减少' },
  { evasion: 'IRF3抑制', counter: '减毒后IFN-β通路部分恢复，激活天然免疫' },
  { evasion: 'BCV存活', counter: '细胞免疫(CD4+/CD8+ CTL)识别并清除感染细胞' },
];

/* ─── Section 3: Vaccine mechanism cards ─── */
const VACCINES = [
  {
    name: 'S19',
    full: 'Brucella abortus S19',
    color: 'blue',
    points: [
      '光滑型菌株，强体液免疫（高IgG滴度）',
      '人畜共患风险（S19可引起人类布病）',
      'DIVA不兼容（产生抗LPS抗体，无法区分接种与感染）',
      '主要用于牛，妊娠期使用需谨慎',
    ],
  },
  {
    name: 'Rev.1',
    full: 'B. melitensis Rev.1',
    color: 'violet',
    points: [
      '结膜接种方式，绵羊/山羊首选疫苗',
      '人畜共患风险较高（Rev.1对人有致病性）',
      'DIVA不兼容，产生抗LPS抗体',
      '妊娠期接种风险：文献荟萃分析p>0.05（操作规程是关键）',
    ],
  },
  {
    name: 'RB51',
    full: 'B. abortus RB51',
    color: 'emerald',
    points: [
      '粗糙型菌株，DIVA天然兼容',
      '细胞免疫为主（CD4+/CD8+ T细胞激活）',
      '不产生抗LPS抗体，可与感染血清学检测区分',
      '对牛效力稳定，对绵羊/山羊保护相对较弱',
    ],
  },
];

/* ─── Section 4: BCR stats ─── */
const BCR_STATS = [
  {
    label: '伊拉克BCR',
    value: '4.25',
    sub: '每投入1元回报4.25元（20年模型）',
    color: 'teal',
  },
  {
    label: '蒙古DALYs',
    value: '49,027',
    sub: '20年疫苗项目可避免的伤残调整生命年',
    color: 'amber',
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string }> = {
  red: {
    border: 'border-red-200 dark:border-red-800',
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-700 dark:text-red-400',
  },
  orange: {
    border: 'border-orange-200 dark:border-orange-800',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    text: 'text-orange-700 dark:text-orange-400',
  },
  blue: {
    border: 'border-blue-200 dark:border-blue-800',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-300',
  },
  violet: {
    border: 'border-violet-200 dark:border-violet-800',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    text: 'text-violet-700 dark:text-violet-300',
  },
  emerald: {
    border: 'border-emerald-200 dark:border-emerald-800',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
  teal: {
    border: 'border-teal-200 dark:border-teal-800',
    bg: 'bg-teal-50 dark:bg-teal-950/30',
    text: 'text-teal-700 dark:text-teal-300',
  },
  amber: {
    border: 'border-amber-200 dark:border-amber-800',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-300',
  },
};

export function MechanismTabContent() {
  return (
    <div className="space-y-10">

      {/* ── Section 1: Evasion stepper ── */}
      <section>
        <BilingualHeading
          zhText="布鲁氏菌免疫逃逸机制"
          enText="Brucella Immune Evasion Mechanisms"
          level="h2"
          className="mb-1"
        />
        <p className="mb-4 text-sm text-gray-500 dark:text-slate-400">
          布鲁氏菌如何逃避宿主免疫
        </p>

        <div className="relative pl-7">
          {/* Vertical line */}
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-red-200 dark:bg-red-900" />
          <div className="space-y-4">
            {EVASION_STEPS.map((s) => {
              const c = colorMap[s.color] ?? colorMap['red']!;
              return (
                <div key={s.step} className="relative">
                  <div
                    className={`absolute -left-7 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${
                      s.color === 'red' ? 'bg-red-600' : 'bg-orange-500'
                    }`}
                  >
                    {s.step}
                  </div>
                  <div className={`rounded-xl border p-4 ${c.border} ${c.bg}`}>
                    <p className={`mb-1 text-sm font-bold ${c.text}`}>{s.title}</p>
                    <p className="text-xs leading-relaxed text-gray-600 dark:text-slate-400">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 2: Comparison table ── */}
      <section>
        <BilingualHeading
          zhText="疫苗对抗逃逸的策略"
          enText="Vaccine Counter-Strategies"
          level="h2"
          className="mb-4"
        />
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-slate-400">
                  逃逸机制
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-slate-400">
                  疫苗对策
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white dark:divide-slate-700/50 dark:bg-slate-900">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.evasion} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">
                    {row.evasion}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-slate-300">
                    {row.counter}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Section 3: Vaccine cards ── */}
      <section>
        <BilingualHeading
          zhText="三种主要疫苗的机制对比"
          enText="Mechanism Comparison: S19 / Rev.1 / RB51"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {VACCINES.map((v) => {
            const c = colorMap[v.color] ?? colorMap['blue']!;
            return (
              <div key={v.name} className={`rounded-xl border p-4 ${c.border} ${c.bg}`}>
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-bold text-white ${
                      v.color === 'blue'
                        ? 'bg-blue-600'
                        : v.color === 'violet'
                          ? 'bg-violet-600'
                          : 'bg-emerald-600'
                    }`}
                  >
                    {v.name}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 italic">
                    {v.full}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {v.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current opacity-50" />
                      <span className="text-[11px] leading-relaxed text-gray-600 dark:text-slate-400">
                        {pt}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 4: BCR stats ── */}
      <section>
        <BilingualHeading
          zhText="BCR 经济数据快览"
          enText="Cost-Benefit Quick Reference"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {BCR_STATS.map((s) => {
            const c = colorMap[s.color] ?? colorMap['teal']!;
            return (
              <div
                key={s.label}
                className={`rounded-xl border p-5 text-center ${c.border} ${c.bg}`}
              >
                <p className="mb-1 text-xs text-gray-500 dark:text-slate-400">{s.label}</p>
                <p className={`text-3xl font-bold ${c.text}`}>{s.value}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{s.sub}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
