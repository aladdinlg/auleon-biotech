'use client';

import { BilingualHeading } from '@/components/ui/BilingualHeading';

/* ─── Section 1: VICH Guidelines ─── */
const VICH_GUIDELINES = [
  {
    gl: 'GL1',
    name: '兽药稳定性测试',
    desc: '规定兽药制剂的稳定性研究方案、储存条件和保质期承诺要求。',
  },
  {
    gl: 'GL2',
    name: '分析方法验证（准确性）',
    desc: '分析方法准确性验证标准，要求回收率测定在100%±2%范围内。',
  },
  {
    gl: 'GL3',
    name: '分析方法验证（精密度、检测限）',
    desc: '规定重复性（RSD≤2%）、中间精密度和检测/定量限的计算方法。',
  },
  {
    gl: 'GL4',
    name: '兽药杂质指导原则',
    desc: '有机杂质鉴定阈值（≥0.1%）和总杂质限度（≤1.0%）的控制规范。',
  },
  {
    gl: 'GL27',
    name: '兽用生物制品免疫原性测试',
    desc: '靶动物攻毒试验设计、血清学终点及保护率统计学要求。',
  },
  {
    gl: 'GL41',
    name: '兽用生物制品批次放行',
    desc: '每批产品出厂前的质控检测项目清单（效力、无菌、安全性）。',
  },
  {
    gl: 'GL50/GL59',
    name: '兽用生物制品安全性',
    desc: '单次/重复给药靶动物安全性试验设计，涵盖繁殖安全性评估。',
  },
];

/* ─── Section 2: CTD Modules ─── */
const CTD_MODULES = [
  {
    part: 'Part 1',
    name: '行政管理资料',
    docs: '申请表、授权书、CPP证明',
    time: '2月',
    color: 'violet',
    bottleneck: false,
  },
  {
    part: 'Part 2',
    name: '化学制造与质控 CMC',
    docs: '原材料标准、工艺验证、GL1/GL2/GL3',
    time: '12月',
    color: 'teal',
    bottleneck: true,
  },
  {
    part: 'Part 3',
    name: '安全性研究',
    docs: '靶动物安全 TAS (GL41)、实验室动物毒理',
    time: '6月',
    color: 'violet',
    bottleneck: false,
  },
  {
    part: 'Part 4',
    name: '有效性研究',
    docs: '靶动物有效性、田间试验、保护率数据',
    time: '8月',
    color: 'violet',
    bottleneck: false,
  },
  {
    part: 'Part 5',
    name: '文献综述',
    docs: '已发表研究、专利状态、全球注册历史',
    time: '3月',
    color: 'violet',
    bottleneck: false,
  },
];

/* ─── Section 3: SFDA Steps ─── */
const SFDA_STEPS = [
  {
    step: '月1-2',
    title: '企业资质预审',
    desc: 'SFDA账号注册、GMP证书公证',
  },
  {
    step: '月3-6',
    title: '技术文件提交',
    desc: 'CTD格式、阿拉伯语摘要、本地代理协议',
  },
  {
    step: '月7-12',
    title: '技术审评',
    desc: 'SFDA审评委员会、可能要求补充资料',
  },
  {
    step: '月13-18',
    title: '现场核查',
    desc: '生产基地GMP核查（可接受第三方报告）',
  },
  {
    step: '月19-24',
    title: '批准与上市',
    desc: '颁发注册证、确定本地分销商',
  },
];

/* ─── Section 4: BSL-3 Checklist ─── */
const BSL3_ITEMS = [
  { ok: true, text: '负压维持：-12.5 Pa（相对走廊）' },
  { ok: true, text: '双HEPA过滤排风系统' },
  { ok: true, text: '气化过氧化氢（VHP）消毒系统' },
  { ok: true, text: '生物识别门禁（双人原则）' },
  { ok: true, text: '独立污水处理系统' },
  { ok: false, text: '布鲁氏菌为一类病原体 → 必须独立生产线，不可与其他产品共线' },
  { ok: false, text: 'P3设施建设成本：¥1.6亿（8,000㎡标准）' },
];

export function RegulatoryTabContent() {
  return (
    <div className="space-y-10">

      {/* ── Section 1: VICH ── */}
      <section>
        <BilingualHeading
          zhText="VICH 国际协调框架"
          enText="VICH International Harmonisation Guidelines"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {VICH_GUIDELINES.map((g) => (
            <div
              key={g.gl}
              className="rounded-xl border border-teal-200 bg-teal-50/60 p-4 dark:border-teal-800 dark:bg-teal-950/30"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-md bg-teal-600 px-2 py-0.5 text-xs font-bold text-white">
                  {g.gl}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                  {g.name}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-slate-400">
                {g.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 2: CTD Modules ── */}
      <section>
        <BilingualHeading
          zhText="CTD 五大模块结构"
          enText="Common Technical Document — 5-Part Structure"
          level="h2"
          className="mb-4"
        />
        <div className="relative pl-6">
          {/* Vertical line */}
          <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-violet-200 dark:bg-violet-800" />

          <div className="space-y-4">
            {CTD_MODULES.map((m, idx) => (
              <div key={m.part} className="relative">
                {/* Timeline dot */}
                <div
                  className={`absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                    m.bottleneck ? 'bg-amber-500' : 'bg-violet-600'
                  }`}
                >
                  {idx + 1}
                </div>

                <div
                  className={`rounded-xl border p-4 ${
                    m.bottleneck
                      ? 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30'
                      : 'border-violet-200 bg-violet-50/60 dark:border-violet-800 dark:bg-violet-950/20'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span
                          className={`rounded-md px-2 py-0.5 text-xs font-bold text-white ${
                            m.bottleneck ? 'bg-amber-500' : 'bg-violet-600'
                          }`}
                        >
                          {m.part}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                          {m.name}
                        </span>
                        {m.bottleneck && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                            主要瓶颈
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-slate-400">{m.docs}</p>
                    </div>
                    <div className="flex-shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-1 dark:border-slate-600 dark:bg-slate-800">
                      <p className="text-xs font-medium text-gray-500 dark:text-slate-400">
                        预计准备
                      </p>
                      <p
                        className={`text-sm font-bold ${
                          m.bottleneck
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-violet-600 dark:text-violet-400'
                        }`}
                      >
                        {m.time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: SFDA Timeline ── */}
      <section>
        <BilingualHeading
          zhText="沙特 SFDA 兽药注册路径"
          enText="Saudi SFDA Veterinary Drug Registration Pathway"
          level="h2"
          className="mb-4"
        />

        {/* Horizontal stepper — scrollable on mobile */}
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-[700px] gap-0">
            {SFDA_STEPS.map((s, idx) => (
              <div key={s.step} className="relative flex-1">
                {/* Connector line */}
                {idx < SFDA_STEPS.length - 1 && (
                  <div className="absolute right-0 top-5 z-0 h-0.5 w-1/2 translate-x-full bg-teal-300 dark:bg-teal-700" />
                )}
                {idx > 0 && (
                  <div className="absolute left-0 top-5 z-0 h-0.5 w-1/2 -translate-x-full bg-teal-300 dark:bg-teal-700" />
                )}

                <div className="flex flex-col items-center px-2 text-center">
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white shadow">
                    {idx + 1}
                  </div>
                  <div className="mt-2 rounded-lg border border-teal-200 bg-teal-50 p-3 dark:border-teal-800 dark:bg-teal-950/30">
                    <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wide text-teal-600 dark:text-teal-400">
                      {s.step}
                    </p>
                    <p className="mb-1 text-xs font-semibold text-gray-900 dark:text-slate-100">
                      {s.title}
                    </p>
                    <p className="text-[10px] leading-relaxed text-gray-500 dark:text-slate-400">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total timeline badge */}
        <div className="mt-3 flex items-center gap-3">
          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
            总时间轴：18-24个月
          </span>
        </div>

        {/* Amber warning */}
        <div className="mt-4 flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/30">
          <span className="mt-0.5 text-lg">⚠️</span>
          <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-300">
            <span className="font-bold">特别注意：</span>
            布鲁氏菌 Rev.1 疫苗在沙特需额外提交人畜共患病风险评估报告，审评时间延长3-6个月
          </p>
        </div>
      </section>

      {/* ── Section 4: BSL-3 Checklist ── */}
      <section>
        <BilingualHeading
          zhText="BSL-3 实验室合规要求"
          enText="BSL-3 Laboratory Compliance Requirements"
          level="h2"
          className="mb-4"
        />
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <div className="space-y-3">
            {BSL3_ITEMS.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 text-base">
                  {item.ok ? '✅' : '⚠️'}
                </span>
                <p
                  className={`text-sm leading-relaxed ${
                    item.ok
                      ? 'text-gray-700 dark:text-slate-300'
                      : 'font-medium text-amber-700 dark:text-amber-400'
                  }`}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
