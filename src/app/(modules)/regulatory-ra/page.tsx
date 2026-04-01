import { ModulePage } from '@/components/modules/ModulePage';
import moduleData from '@/data/modules/m5-regulatory-ra.json';

const regulatoryContent = (
  <div className="space-y-6">
    <div>
      <h2 className="mb-1 text-xl font-semibold text-gray-900 dark:text-slate-100">
        SFDA vNees 四部制结构
      </h2>
      <p className="text-sm text-gray-500 dark:text-slate-400">
        中国兽药注册申报体系 · CTD 格式对应关系
      </p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      {[
        { part: 'Part 1', title: '行政管理资料', desc: '申请表、企业资质、GMP证书、授权书', color: 'blue' },
        { part: 'Part 2', title: 'CMC 化学制造与控制', desc: '原材料、工艺验证、批次记录、分析方法学验证（VICH GL1/GL2）', color: 'teal' },
        { part: 'Part 3', title: '安全性研究', desc: '目标动物安全性（VICH GL41）、实验室动物毒理、环境风险评估', color: 'amber' },
        { part: 'Part 4', title: '效力研究', desc: '田间试验设计（VICH GL1）、攻毒保护试验、血清学终点、免疫持续期（VICH GL44）', color: 'violet' },
      ].map((item) => (
        <div
          key={item.part}
          className={`rounded-xl border p-4 ${
            item.color === 'blue' ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30' :
            item.color === 'teal' ? 'border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/30' :
            item.color === 'amber' ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30' :
            'border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/30'
          }`}
        >
          <p className={`mb-1 text-xs font-bold uppercase tracking-wide ${
            item.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
            item.color === 'teal' ? 'text-teal-600 dark:text-teal-400' :
            item.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
            'text-violet-600 dark:text-violet-400'
          }`}>{item.part}</p>
          <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-slate-100">{item.title}</p>
          <p className="text-xs leading-5 text-gray-600 dark:text-slate-400">{item.desc}</p>
        </div>
      ))}
    </div>

    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-slate-100">BSL-3 设施工程要求</p>
      <div className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
        <div className="flex items-start gap-2">
          <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-violet-500" />
          <span>负压梯度：三级负压级联（走廊→缓冲区→核心区），压差≥25 Pa</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-violet-500" />
          <span>双HEPA过滤：送排风均需，排风HEPA每年检漏验证，效率≥99.97%</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-violet-500" />
          <span>生物特征门禁：双人互锁系统（两人同行制），关键区域指纹+刷卡双因素认证</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-violet-500" />
          <span>成本基准：¥160M / 8,000m²（益邦生物，青岛，2022年竣工）</span>
        </div>
      </div>
    </div>
  </div>
);

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
  return <ModulePage moduleData={moduleData as any} regulatoryContent={regulatoryContent} marketContent={marketContent} />;
}
