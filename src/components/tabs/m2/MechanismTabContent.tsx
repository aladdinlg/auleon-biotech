'use client';

import { BilingualHeading } from '@/components/ui/BilingualHeading';

/* ─── Section 1: Action flow steps ─── */
const FLOW_STEPS = [
  { icon: '🥚', label: '虫卵摄入', desc: '终宿主犬排出虫卵，中间宿主（羊）经口摄入' },
  { icon: '🦠', label: '六钩蚴孵出', desc: '虫卵在肠道孵化为六钩蚴，穿透肠壁入血' },
  { icon: '🛡️', label: 'EG95抗体阻断', desc: 'IgG包被六钩蚴表面→受体阻断→入侵失败' },
  { icon: '🚫', label: '包囊无法形成', desc: '幼虫被清除，肝脏包虫囊定植链条被切断' },
];

/* ─── Section 2: Immunity mechanisms ─── */
const MECHANISMS = [
  {
    title: '中和抗体（IgG）',
    desc: '与EG95结合→阻断六钩蚴表面受体→入侵失败',
    color: 'teal',
  },
  {
    title: '调理吞噬',
    desc: '抗体包被六钩蚴→巨噬细胞识别Fc受体→吞噬清除',
    color: 'blue',
  },
  {
    title: '补体激活',
    desc: 'C3b沉积→膜攻击复合物（MAC）→幼虫裂解死亡',
    color: 'violet',
  },
  {
    title: '记忆B细胞',
    desc: '再次暴露时迅速产生高滴度IgG，免疫应答加速10倍以上',
    color: 'emerald',
  },
];

/* ─── Section 3: Key stats ─── */
const STATS = [
  { label: '保护效力', value: '95–99%', sub: '田间试验数据', color: 'teal' },
  { label: '抗体峰值', value: '第2针后4周', sub: 'IgG滴度最高点', color: 'violet' },
  { label: '保护持续', value: '>12个月', sub: '加强免疫后', color: 'amber' },
];

const colorMap: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  teal: {
    border: 'border-teal-200 dark:border-teal-800',
    bg: 'bg-teal-50 dark:bg-teal-950/30',
    text: 'text-teal-700 dark:text-teal-300',
    badge: 'bg-teal-600',
  },
  blue: {
    border: 'border-blue-200 dark:border-blue-800',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-300',
    badge: 'bg-blue-600',
  },
  violet: {
    border: 'border-violet-200 dark:border-violet-800',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    text: 'text-violet-700 dark:text-violet-300',
    badge: 'bg-violet-600',
  },
  emerald: {
    border: 'border-emerald-200 dark:border-emerald-800',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    badge: 'bg-emerald-600',
  },
  amber: {
    border: 'border-amber-200 dark:border-amber-800',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-300',
    badge: 'bg-amber-500',
  },
};

export function MechanismTabContent() {
  return (
    <div className="space-y-10">

      {/* ── Section 1: Action target flow ── */}
      <section>
        <BilingualHeading
          zhText="EG95 作用靶点"
          enText="EG95 Mechanism of Action"
          level="h2"
          className="mb-1"
        />
        <p className="mb-4 text-sm text-gray-500 dark:text-slate-400">
          EG95如何阻断寄生虫入侵
        </p>

        {/* Horizontal flow — scrollable on mobile */}
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

      {/* ── Section 2: Immunity mechanisms ── */}
      <section>
        <BilingualHeading
          zhText="保护性免疫机制"
          enText="Protective Immunity Mechanisms"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {MECHANISMS.map((m) => {
            const c = colorMap[m.color] ?? colorMap['teal']!;
            return (
              <div
                key={m.title}
                className={`rounded-xl border p-4 ${c.border} ${c.bg}`}
              >
                <p className={`mb-1 text-sm font-bold ${c.text}`}>{m.title}</p>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-slate-400">
                  {m.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 3: Key stats ── */}
      <section>
        <BilingualHeading
          zhText="关键数据卡片"
          enText="Key Efficacy Data"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-3">
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
      </section>

      {/* ── Section 4: DIVA compatibility ── */}
      <section>
        <BilingualHeading
          zhText="DIVA 兼容性说明"
          enText="DIVA Compatibility"
          level="h2"
          className="mb-4"
        />
        <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
          <span className="mt-0.5 flex-shrink-0 text-lg">✅</span>
          <div>
            <p className="mb-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              天然 DIVA 兼容
            </p>
            <p className="text-xs leading-relaxed text-gray-600 dark:text-slate-400">
              EG95为寄生虫（细粒棘球绦虫）抗原，不含细菌或病毒成分，
              不干扰布鲁氏菌病血清学检测（S19/Rev.1 RB抑制ELISA）及LSD ELISA，
              天然实现区分接种与感染动物（DIVA）。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
