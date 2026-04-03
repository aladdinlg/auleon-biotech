'use client';

import { Badge } from '@/components/ui/Badge';
import { BilingualHeading } from '@/components/ui/BilingualHeading';
import { Card } from '@/components/ui/Card';

const SPECIAL_STATUS = [
  '一类病原体：生产需BSL-3设施，独立生产线',
  '人畜共患风险：监管机构要求额外风险评估',
  'OIE规定：Rev.1疫苗国际贸易中需特别证明',
  '中国分类：农业农村部《兽用生物制品目录》一类制品',
];

const VACCINE_COMPARISON = [
  {
    vaccine: 'S19',
    animal: '牛',
    china: '批准',
    global: '广泛使用',
    diva: '❌',
  },
  {
    vaccine: 'Rev.1',
    animal: '羊/山羊',
    china: '批准',
    global: '广泛使用',
    diva: '❌',
  },
  {
    vaccine: 'RB51',
    animal: '牛',
    china: '未批准',
    global: '美国/部分国家',
    diva: '✅',
  },
];

const SAUDI_SPECIAL_REQUIREMENTS = [
  '标准流程18-24个月 + Rev.1额外3-6个月风险评估',
  '需提交：人员防护方案 + 废弃物处理规程 + 意外暴露处置SOP',
  '沙特本地流行情况：绵羊布病阳性率约8-15%，属高优先级',
  '建议策略：先注册RB51（DIVA优势）再推Rev.1',
];

const BSL3_COMPLIANCE = [
  '压差：相对走廊 -12.5 Pa',
  '防护：全身正压防护服 + PAPR',
  'VHP消毒：每批生产后气化过氧化氢空间消毒',
  '废水处理：高压蒸汽灭活（134°C/30min）后排放',
  '建设成本参考：8,000㎡设施约1.6亿元（约2万元/㎡）',
];

export function RegulatoryTabContent() {
  return (
    <div className="space-y-10">
      <section>
        <BilingualHeading
          zhText="布鲁氏菌疫苗的特殊监管地位"
          enText="Special Regulatory Status of Brucellosis Vaccines"
          level="h2"
          className="mb-4"
        />
        <Card className="rounded-xl border border-rose-200 bg-rose-50/70 p-5 dark:border-rose-800 dark:bg-rose-950/30">
          <div className="mb-3 flex items-center gap-2">
            <Badge tone="danger">高风险监管</Badge>
            <p className="text-sm font-semibold text-rose-800 dark:text-rose-300">一类病原体与人畜共患双重约束</p>
          </div>
          <div className="space-y-2">
            {SPECIAL_STATUS.map((item) => (
              <p key={item} className="text-sm leading-relaxed text-gray-700 dark:text-slate-300">
                {item}
              </p>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <BilingualHeading
          zhText="三种主要疫苗的注册状态对比"
          enText="Registration Status Comparison of Three Key Vaccines"
          level="h2"
          className="mb-4"
        />
        <Card className="overflow-hidden rounded-xl border border-gray-200 bg-white p-0 dark:border-slate-700 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-slate-300">
                    疫苗
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-slate-300">
                    适用动物
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-slate-300">
                    中国状态
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-slate-300">
                    国际状态
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-slate-300">
                    DIVA
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-slate-700 dark:bg-slate-900">
                {VACCINE_COMPARISON.map((row) => (
                  <tr key={row.vaccine} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/60">
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-slate-100">{row.vaccine}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{row.animal}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{row.china}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{row.global}</td>
                    <td className="px-4 py-3 text-lg">{row.diva}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <section>
        <BilingualHeading
          zhText="沙特SFDA布病疫苗注册特殊要求"
          enText="Saudi SFDA Special Requirements for Brucellosis Vaccines"
          level="h2"
          className="mb-4"
        />
        <div className="space-y-3">
          {SAUDI_SPECIAL_REQUIREMENTS.map((item, index) => (
            <Card
              key={item}
              className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-800 dark:bg-amber-950/30"
            >
              <div className="flex items-start gap-3">
                <Badge tone="warning" className="mt-0.5">
                  要点 {index + 1}
                </Badge>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-slate-300">{item}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <BilingualHeading
          zhText="BSL-3生产合规要点"
          enText="BSL-3 Manufacturing Compliance Essentials"
          level="h2"
          className="mb-4"
        />
        <Card className="rounded-xl border border-violet-200 bg-violet-50/70 p-5 dark:border-violet-800 dark:bg-violet-950/30">
          <div className="mb-3 flex items-center gap-2">
            <Badge className="bg-violet-600 text-white">BSL-3</Badge>
            <p className="text-sm font-semibold text-violet-800 dark:text-violet-300">设施与生物安全双重合规</p>
          </div>
          <div className="space-y-2">
            {BSL3_COMPLIANCE.map((item) => (
              <p key={item} className="text-sm leading-relaxed text-gray-700 dark:text-slate-300">
                {item}
              </p>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
