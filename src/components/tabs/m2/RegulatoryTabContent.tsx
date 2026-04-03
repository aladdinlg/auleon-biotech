'use client';

import { Badge } from '@/components/ui/Badge';
import { BilingualHeading } from '@/components/ui/BilingualHeading';
import { Card } from '@/components/ui/Card';

const GLOBAL_REGISTRATION = [
  {
    market: '澳大利亚',
    authority: 'APVMA批准',
    detail: '1996年首个注册（Providean Hidatil EG95）',
  },
  {
    market: '中国',
    authority: '农业部批准',
    detail: '2007年批准，澳龙生物（新兽药证书）',
  },
  {
    market: '阿根廷',
    authority: 'SENASA批准',
    detail: 'Tecnovax（2011）',
  },
  {
    market: '未注册主要市场',
    authority: '重点空白区域',
    detail: '中东（伊拉克/伊朗/土耳其）、中亚（哈萨克斯坦）',
  },
];

const KEY_TECH_REQUIREMENTS = [
  {
    title: '抗原表征',
    details: '分子量确认（~16.6 kDa）/ 纯度（>95% SDS-PAGE）/ 生物活性（ELISA结合活性）',
  },
  {
    title: '效力检验',
    details: '攻虫保护试验（绵羊模型，六钩蚴攻击）或血清学替代法（抗EG95 IgG ELISA）',
  },
  {
    title: '佐剂安全性',
    details: 'QuilA/ISCOMs的局部反应评估',
  },
  {
    title: '残留检测',
    details: '宿主菌DNA <10 ng/剂，内毒素 <5 EU/剂',
  },
];

const VICH_GUIDELINES = [
  { code: 'GL27', desc: '免疫原性评估设计' },
  { code: 'GL41', desc: '批放行检验标准' },
  { code: 'GL44', desc: '目标动物安全性（绵羊）' },
  { code: 'GL46', desc: '实验室动物与靶动物效力试验' },
];

const MIDDLE_EAST_PATHS = [
  {
    market: '伊拉克 IVA',
    duration: '约12-18个月',
    requirements: '参照欧盟注册资料，需阿拉伯语摘要',
  },
  {
    market: '沙特 SFDA',
    duration: '18-24个月',
    requirements: '需本地代理，无人畜共患风险（寄生虫疫苗审查相对宽松）',
  },
  {
    market: '土耳其 TAGEM',
    duration: '约6-12个月',
    requirements: '接受欧盟CPP',
  },
];

export function RegulatoryTabContent() {
  return (
    <div className="space-y-10">
      <section>
        <BilingualHeading
          zhText="EG95全球注册现状"
          enText="Global Registration Status of EG95"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {GLOBAL_REGISTRATION.map((item) => (
            <Card
              key={item.market}
              className="rounded-xl border border-teal-200 bg-teal-50/70 p-4 dark:border-teal-800 dark:bg-teal-950/30"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{item.market}</p>
                <Badge className="bg-teal-600 text-white">{item.authority}</Badge>
              </div>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-slate-400">{item.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <BilingualHeading
          zhText="亚单位疫苗注册关键技术要求"
          enText="Critical Technical Requirements for Subunit Vaccine Registration"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {KEY_TECH_REQUIREMENTS.map((item) => (
            <Card
              key={item.title}
              className="rounded-xl border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-800 dark:bg-violet-950/30"
            >
              <div className="mb-2 flex items-center gap-2">
                <Badge tone="warning">技术要求</Badge>
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{item.title}</p>
              </div>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-slate-400">{item.details}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <BilingualHeading
          zhText="VICH相关指南适用性"
          enText="Applicability of VICH Guidelines"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {VICH_GUIDELINES.map((item) => (
            <Card
              key={item.code}
              className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-800 dark:bg-blue-950/30"
            >
              <div className="mb-1 flex items-center gap-2">
                <Badge className="bg-blue-600 text-white">{item.code}</Badge>
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">指南重点</p>
              </div>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-slate-400">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <BilingualHeading
          zhText="中东市场注册路径"
          enText="Middle East Market Registration Pathways"
          level="h2"
          className="mb-4"
        />
        <div className="space-y-3">
          {MIDDLE_EAST_PATHS.map((item) => (
            <Card
              key={item.market}
              className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-800 dark:bg-amber-950/30"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{item.market}</p>
                <Badge tone="warning">{item.duration}</Badge>
              </div>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-slate-400">{item.requirements}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
