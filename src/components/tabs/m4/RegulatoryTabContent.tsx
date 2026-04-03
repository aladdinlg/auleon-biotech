'use client';

import { Badge } from '@/components/ui/Badge';
import { BilingualHeading } from '@/components/ui/BilingualHeading';
import { Card } from '@/components/ui/Card';

const OIE_REPORTING_STATUS = [
  'OIE A类病（须强制报告）',
  '发生即触发：贸易禁运（活牛/牛肉/皮革）',
  '扑杀补偿政策：欧盟成员国强制扑杀+补偿',
  '中国：2019年列入一类动物疫病，强制免疫',
];

const GLOBAL_REGISTRATION = [
  {
    type: '同源减毒苗（Neethling株）',
    status: '南非/中东/巴尔干广泛使用',
  },
  {
    type: '异源山羊痘苗（GTPV）',
    status: '中国批准，东南亚/中亚主要使用',
  },
  {
    type: '欧盟',
    status: '2018年批准Lumpyvax（MSD），首个欧盟注册LSD疫苗',
  },
  {
    type: '澳龙GTPV异源苗',
    status: '中国批准，已出口老挝（20万剂）、柬埔寨（50万剂）',
  },
];

const SEA_MARKET_REQUIREMENTS = [
  {
    market: '泰国 ACFS',
    duration: '约12-15个月',
    details: '需本地效力验证试验（泰国牛种）',
  },
  {
    market: '越南 DAH',
    duration: '约9-12个月',
    details: '接受中国GMP证明+技术资料',
  },
  {
    market: '印度尼西亚 PDSR',
    duration: '约18-24个月',
    details: '需与本地机构联合注册',
  },
  {
    market: '共同要求',
    duration: '跨市场一致',
    details: '冷链配送能力证明 + 本地储存条件验证',
  },
];

const EMERGENCY_MECHANISM = [
  'OIE紧急使用框架：疫情暴发时可绕过完整注册流程',
  '亚洲LSD应急储备建议：每国维持300-500万剂缓冲库存',
  '中国应急机制：农业农村部可发布紧急免疫令，30天内全国铺开',
  '澳龙优势：产能弹性（可在60天内扩产至500万剂/月）',
];

export function RegulatoryTabContent() {
  return (
    <div className="space-y-10">
      <section>
        <BilingualHeading
          zhText="LSD的OIE法定报告病状地位"
          enText="OIE Notifiable Disease Status of LSD"
          level="h2"
          className="mb-4"
        />
        <Card className="rounded-xl border border-rose-200 bg-rose-50/70 p-5 dark:border-rose-800 dark:bg-rose-950/30">
          <div className="mb-3 flex items-center gap-2">
            <Badge tone="danger">法定强制</Badge>
            <p className="text-sm font-semibold text-rose-800 dark:text-rose-300">疫情触发贸易与防控联动</p>
          </div>
          <div className="space-y-2">
            {OIE_REPORTING_STATUS.map((item) => (
              <p key={item} className="text-sm leading-relaxed text-gray-700 dark:text-slate-300">
                {item}
              </p>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <BilingualHeading
          zhText="LSD疫苗国际注册现状"
          enText="International Registration Status of LSD Vaccines"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {GLOBAL_REGISTRATION.map((item) => (
            <Card
              key={item.type}
              className="rounded-xl border border-teal-200 bg-teal-50/70 p-4 dark:border-teal-800 dark:bg-teal-950/30"
            >
              <div className="mb-2 flex items-center gap-2">
                <Badge className="bg-teal-600 text-white">国际进展</Badge>
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{item.type}</p>
              </div>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-slate-400">{item.status}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <BilingualHeading
          zhText="东南亚市场注册要求"
          enText="Registration Requirements in Southeast Asia"
          level="h2"
          className="mb-4"
        />
        <div className="space-y-3">
          {SEA_MARKET_REQUIREMENTS.map((item) => (
            <Card
              key={item.market}
              className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-800 dark:bg-amber-950/30"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{item.market}</p>
                <Badge tone="warning">{item.duration}</Badge>
              </div>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-slate-400">{item.details}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <BilingualHeading
          zhText="应急使用与储备机制"
          enText="Emergency Use and Stockpile Mechanism"
          level="h2"
          className="mb-4"
        />
        <Card className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-800 dark:bg-emerald-950/30">
          <div className="mb-3 flex items-center gap-2">
            <Badge tone="success">应急能力</Badge>
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">快速部署 + 产能弹性</p>
          </div>
          <div className="space-y-2">
            {EMERGENCY_MECHANISM.map((item) => (
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
