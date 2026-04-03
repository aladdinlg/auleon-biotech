'use client';

import { Badge } from '@/components/ui/Badge';
import { BilingualHeading } from '@/components/ui/BilingualHeading';
import { Card } from '@/components/ui/Card';

const REGULATORY_FRAMEWORKS = [
  {
    region: '中国',
    items: [
      '农业农村部/中国兽药典委员会',
      '《兽药管理条例》',
    ],
  },
  {
    region: '国际',
    items: [
      'VICH协调体系（美国FDA CVM / 欧盟EMA / 日本MAFF）',
    ],
  },
  {
    region: 'OIE标准',
    items: ['《陆生动物卫生法典》疫苗质量章节'],
  },
];

const GMP_REQUIREMENTS = [
  {
    title: '厂房设施',
    tone: 'default' as const,
    details: '洁净区分级（C级灌装/D级配液），压差控制',
  },
  {
    title: '质量控制',
    tone: 'success' as const,
    details: 'IPC（过程控制）+ QC放行检验（无菌/效力/安全）',
  },
  {
    title: '文件系统',
    tone: 'warning' as const,
    details: '批记录/SOP/变更控制，数据完整性（ALCOA原则）',
  },
  {
    title: '验证体系',
    tone: 'danger' as const,
    details: '工艺验证（PPQ）/ 清洁验证 / 设备确认（IQ/OQ/PQ）',
  },
];

const BATCH_RELEASE_POINTS = [
  '中国兽用生物制品批签发：中监所（IVDC）负责',
  '每批次需提交：检验报告 + 生产记录摘要 + 样品',
  '时限：通常45个工作日内完成',
  '重要性：批签发是上市前最后一道质量门槛',
];

const EXPORT_COMPLIANCE = [
  {
    title: 'CPP（药品生产证明）',
    details: '原产国监管机构出具',
  },
  {
    title: 'GMP符合性证明',
    details: '部分国家要求境外检查',
  },
  {
    title: '标签本地化',
    details: '目标国语言 + 当地注册号',
  },
];

export function RegulatoryTabContent() {
  return (
    <div className="space-y-10">
      <section>
        <BilingualHeading
          zhText="兽用生物制品监管框架"
          enText="Veterinary Biologics Regulatory Framework"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-3 sm:grid-cols-3">
          {REGULATORY_FRAMEWORKS.map((framework) => (
            <Card
              key={framework.region}
              className="rounded-xl border border-teal-200 bg-teal-50/70 p-4 dark:border-teal-800 dark:bg-teal-950/30"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">{framework.region}</h3>
                <Badge className="bg-teal-600 text-white">监管依据</Badge>
              </div>
              <ul className="space-y-1">
                {framework.items.map((item) => (
                  <li key={item} className="text-xs leading-relaxed text-gray-600 dark:text-slate-400">
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <BilingualHeading
          zhText="GMP核心要求"
          enText="Core GMP Requirements"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {GMP_REQUIREMENTS.map((item) => (
            <Card
              key={item.title}
              className="rounded-xl border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-800 dark:bg-violet-950/30"
            >
              <div className="mb-2 flex items-center gap-2">
                <Badge tone={item.tone} className="font-semibold">
                  核心项
                </Badge>
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{item.title}</p>
              </div>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-slate-400">{item.details}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <BilingualHeading
          zhText="批签发制度"
          enText="Lot Release System"
          level="h2"
          className="mb-4"
        />
        <Card className="rounded-xl border border-amber-200 bg-amber-50/70 p-5 dark:border-amber-800 dark:bg-amber-950/30">
          <div className="mb-3 flex items-center gap-2">
            <Badge tone="warning" className="font-semibold">
              IVDC
            </Badge>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">上市前质量门槛</p>
          </div>
          <div className="space-y-2">
            {BATCH_RELEASE_POINTS.map((point) => (
              <p key={point} className="text-sm leading-relaxed text-gray-700 dark:text-slate-300">
                {point}
              </p>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <BilingualHeading
          zhText="出口合规要点"
          enText="Export Compliance Essentials"
          level="h2"
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {EXPORT_COMPLIANCE.map((item) => (
            <Card
              key={item.title}
              className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-800 dark:bg-emerald-950/30"
            >
              <div className="mb-2 flex items-center gap-2">
                <Badge tone="success">合规点</Badge>
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{item.title}</p>
              </div>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-slate-400">{item.details}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
