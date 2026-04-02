import { ModulePage } from '@/components/modules/ModulePage';
import moduleData from '@/data/modules/m5-regulatory-ra.json';
import { RegulatoryTabContent } from '@/components/tabs/m5/RegulatoryTabContent';

const marketContent = (
  <div className="space-y-6">
    <div>
      <h2 className="mb-1 text-xl font-semibold text-gray-900 dark:text-slate-100">
        注册时间线矩阵 — 6个目标国
      </h2>
      <p className="text-sm text-gray-500 dark:text-slate-400">
        Registration Timeline Matrix · 澳龙EG95出口战略时间规划
      </p>
    </div>
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700">
      <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-700">
        <thead className="bg-gray-50 dark:bg-slate-800">
          <tr>
            {['目标国', '监管体系', '预计时间', '注册类型', '优先级'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-slate-400">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white dark:divide-slate-700/50 dark:bg-slate-900">
          {[
            { country: '沙特 Saudi Arabia', system: 'SFDA / MoE', time: '18-24个月', type: '完整注册', priority: '高' },
            { country: '印度尼西亚', system: 'BBPMSOH', time: '12-18个月', type: 'EUA转正式', priority: '高' },
            { country: '伊拉克 Iraq', system: 'MoA-VPD', time: '24-36个月', type: '完整注册', priority: '中' },
            { country: '巴基斯坦', system: 'DVMC', time: '18-24个月', type: '完整注册', priority: '中' },
            { country: '肯尼亚 Kenya', system: 'KEPHIS/DVS', time: '24-30个月', type: '完整注册', priority: '中' },
            { country: '中亚（哈萨克）', system: 'KAZVET', time: '12-18个月', type: '互认注册', priority: '高' },
          ].map((row) => (
            <tr key={row.country} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-slate-100">{row.country}</td>
              <td className="px-4 py-3 text-xs text-gray-600 dark:text-slate-400">{row.system}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-400">{row.time}</td>
              <td className="px-4 py-3 text-xs text-gray-600 dark:text-slate-400">{row.type}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs ${
                  row.priority === '高' ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' :
                  'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                }`}>{row.priority}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function RegulatoryRAPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ModulePage moduleData={moduleData as any} regulatoryContent={<RegulatoryTabContent />} marketContent={marketContent} />;
}
