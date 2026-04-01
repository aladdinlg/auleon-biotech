import { ModulePage } from '@/components/modules/ModulePage';
import moduleData from '@/data/modules/m6-market-strategy.json';

const marketContent = (
  <div className="space-y-6">
    <div>
      <h2 className="mb-1 text-xl font-semibold text-gray-900 dark:text-slate-100">
        澳龙生物估值案例分析
      </h2>
      <p className="text-sm text-gray-500 dark:text-slate-400">
        Auleon Valuation Case · 恒通股份收购结构 · NAV vs DCF 溢价模型
      </p>
    </div>

    <div className="grid gap-4 sm:grid-cols-3">
      {[
        { label: 'NAV 净资产价值', value: '¥121M', sub: '账面资产基础估值', color: 'gray' },
        { label: 'DCF 现金流估值', value: '¥752M', sub: '3年利润承诺折现', color: 'blue' },
        { label: '溢价率', value: '521%', sub: 'DCF vs NAV 溢价倍数', color: 'teal' },
      ].map((card) => (
        <div
          key={card.label}
          className={`rounded-xl border p-5 text-center ${
            card.color === 'gray' ? 'border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-800' :
            card.color === 'blue' ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30' :
            'border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/30'
          }`}
        >
          <p className="mb-1 text-xs text-gray-500 dark:text-slate-400">{card.label}</p>
          <p className={`text-2xl font-bold ${
            card.color === 'gray' ? 'text-gray-700 dark:text-gray-300' :
            card.color === 'blue' ? 'text-blue-700 dark:text-blue-300' :
            'text-teal-700 dark:text-teal-300'
          }`}>{card.value}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{card.sub}</p>
        </div>
      ))}
    </div>

    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-slate-100">3年利润承诺结构</p>
      <div className="space-y-3">
        {[
          { year: '2022', profit: '¥60M', note: '首年承诺，对赌协议基准期' },
          { year: '2023', profit: '¥85M', note: '中期增长目标' },
          { year: '2024', profit: '¥110M', note: '三年累计 ¥255M 承诺' },
        ].map((row) => (
          <div key={row.year} className="flex items-center gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0 dark:border-slate-700">
            <div className="w-16 flex-shrink-0 text-center">
              <p className="text-sm font-bold text-teal-600 dark:text-teal-400">{row.year}</p>
            </div>
            <div className="w-20 flex-shrink-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{row.profit}</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">{row.note}</p>
          </div>
        ))}
        <div className="mt-2 rounded-lg bg-teal-50 px-4 py-2 dark:bg-teal-950/30">
          <p className="text-sm font-bold text-teal-700 dark:text-teal-300">总承诺 ¥255M · IRR 测算基础</p>
        </div>
      </div>
    </div>
  </div>
);

const regulatoryContent = (
  <div className="space-y-6">
    <div>
      <h2 className="mb-1 text-xl font-semibold text-gray-900 dark:text-slate-100">
        G2G援助出口 → 商业注册过渡策略
      </h2>
      <p className="text-sm text-gray-500 dark:text-slate-400">
        Government-to-Government Aid Export → Commercial Registration Transition
      </p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      {[
        {
          phase: '第一阶段 G2G援助',
          title: '政府援助出口',
          desc: '通过农业部援助渠道进入目标国，免注册审批，快速建立市场认知度。典型案例：老挝（20万剂）、柬埔寨（50万剂）LSD援助项目。',
          color: 'blue',
          icon: '🤝',
        },
        {
          phase: '第二阶段 EUA过渡',
          title: '紧急使用授权',
          desc: '利用G2G积累的安全性/效力数据向当地监管机构申请EUA，典型周期6-12个月。已完成：泰国DLD、印尼BBPMSOH、越南DAH。',
          color: 'amber',
          icon: '📋',
        },
        {
          phase: '第三阶段 正式注册',
          title: '完整商业注册',
          desc: '基于EUA数据包提交完整CTD申请，获取商业销售许可。沙特/伊拉克为优先市场，预计2025-2027年完成。',
          color: 'teal',
          icon: '✅',
        },
        {
          phase: '策略亮点',
          title: 'Fill-and-Finish本地化',
          desc: '在沙特/印尼设立Fill-and-Finish工厂，规避进口关税（20-35%），满足本地化生产要求，同时保留中国原液生产的成本优势。',
          color: 'violet',
          icon: '🏭',
        },
      ].map((item) => (
        <div
          key={item.phase}
          className={`rounded-xl border p-4 ${
            item.color === 'blue' ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30' :
            item.color === 'amber' ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30' :
            item.color === 'teal' ? 'border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/30' :
            'border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/30'
          }`}
        >
          <p className={`mb-1 text-xs font-bold uppercase tracking-wide ${
            item.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
            item.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
            item.color === 'teal' ? 'text-teal-600 dark:text-teal-400' :
            'text-violet-600 dark:text-violet-400'
          }`}>{item.icon} {item.phase}</p>
          <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-slate-100">{item.title}</p>
          <p className="text-xs leading-5 text-gray-600 dark:text-slate-400">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export default function MarketStrategyPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ModulePage moduleData={moduleData as any} marketContent={marketContent} regulatoryContent={regulatoryContent} />;
}
