import { ModulePage } from '@/components/modules/ModulePage';
import moduleData from '@/data/modules/m4-capripoxvirus.json';
import { MechanismTabContent } from '@/components/tabs/m4/MechanismTabContent';

const regulatoryContent = (
  <div className="space-y-6">
    <div>
      <h2 className="mb-1 text-xl font-semibold text-gray-900 dark:text-slate-100">
        紧急使用授权 — 各国监管路径
      </h2>
      <p className="text-sm text-gray-500 dark:text-slate-400">
        EUA Mechanisms by Country · LSD疫苗紧急注册与分销矩阵
      </p>
    </div>

    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700">
      <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-700">
        <thead className="bg-gray-50 dark:bg-slate-800">
          <tr>
            {['国家', '监管机构', 'EUA状态', '分销商'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-slate-400">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white dark:divide-slate-700/50 dark:bg-slate-900">
          {[
            { country: '泰国 Thailand', body: 'DLD', status: '已授权 EUA', dist: 'SHS / Olmix Asialand' },
            { country: '印度尼西亚', body: 'BBPMSOH', status: '已授权 EUA', dist: 'PT. Swadesi' },
            { country: '越南 Vietnam', body: 'DAH', status: '已授权 EUA', dist: 'Union Castap' },
            { country: '老挝 Laos', body: 'DAH', status: '出口授权 2021', dist: '200,000 剂' },
            { country: '柬埔寨 Cambodia', body: 'DAH', status: '出口授权 2022', dist: '500,000 剂' },
          ].map((row) => (
            <tr key={row.country} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-slate-100">{row.country}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-400">{row.body}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-950/40 dark:text-green-400">{row.status}</span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-400">{row.dist}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="rounded-xl bg-orange-50 p-4 text-sm leading-6 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300">
      <p className="mb-2 font-semibold">剂量注意事项</p>
      <p>牛（LSD目标）接种剂量 = 山羊剂量 × 3（Uttarkashi India试验数据）。
      GTPV疫苗对LSD提供完整跨保护；SPPV保护不足，不推荐替代使用。
      泰国BSTS模型显示大规模接种后病例下降78-119%。</p>
    </div>
  </div>
);

export default function CapripoxvirusPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ModulePage moduleData={moduleData as any} mechanismContent={<MechanismTabContent />} regulatoryContent={regulatoryContent} />;
}
