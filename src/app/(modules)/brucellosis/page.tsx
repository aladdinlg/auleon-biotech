import { ModulePage } from '@/components/modules/ModulePage';
import moduleData from '@/data/modules/m3-brucellosis.json';
import { MechanismTabContent } from '@/components/tabs/m3/MechanismTabContent';
import { RegulatoryTabContent } from '@/components/tabs/m3/RegulatoryTabContent';

const marketContent = (
  <div className="space-y-6">
    <div>
      <h2 className="mb-1 text-xl font-semibold text-gray-900 dark:text-slate-100">
        伊拉克布鲁氏菌病疫苗项目成本收益分析
      </h2>
      <p className="text-sm text-gray-500 dark:text-slate-400">
        Iraq Cost-Benefit Analysis · 20年持续免疫计划经济学评估
      </p>
    </div>

    <div className="grid gap-4 sm:grid-cols-3">
      {[
        { label: '收益成本比 BCR', value: '4.25', sub: '每投入1元产出4.25元收益', color: 'teal' },
        { label: '净现值 NPV', value: '$10.56M', sub: '20年期折现净收益', color: 'blue' },
        { label: '内部收益率 IRR', value: '91.38%', sub: '投资回报效率极高', color: 'emerald' },
      ].map((card) => (
        <div
          key={card.label}
          className={`rounded-xl border p-5 text-center ${
            card.color === 'teal' ? 'border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/30' :
            card.color === 'blue' ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30' :
            'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30'
          }`}
        >
          <p className="mb-1 text-xs text-gray-500 dark:text-slate-400">{card.label}</p>
          <p className={`text-2xl font-bold ${
            card.color === 'teal' ? 'text-teal-700 dark:text-teal-300' :
            card.color === 'blue' ? 'text-blue-700 dark:text-blue-300' :
            'text-emerald-700 dark:text-emerald-300'
          }`}>{card.value}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{card.sub}</p>
        </div>
      ))}
    </div>

    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-slate-100">流行率下降轨迹 (20年)</p>
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-red-600">9.22%</p>
          <p className="text-xs text-gray-400">基线血清流行率</p>
        </div>
        <div className="flex-1 text-center text-2xl text-gray-300">→</div>
        <div className="text-center">
          <p className="text-3xl font-bold text-emerald-600">0.73%</p>
          <p className="text-xs text-gray-400">20年后预测值</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-500 dark:text-slate-400">
        绝对下降 8.49 百分点 · 相对下降 92.1% · 接近消除阈值（&lt;1%）
      </p>
    </div>
  </div>
);

export default function BrucellosiPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ModulePage moduleData={moduleData as any} mechanismContent={<MechanismTabContent />} regulatoryContent={<RegulatoryTabContent />} marketContent={marketContent} />;
}
