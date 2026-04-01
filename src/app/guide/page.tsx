import Link from 'next/link';
import { BilingualHeading } from '@/components/ui/BilingualHeading';

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <BilingualHeading zhText="学习指南" enText="User Guide" level="h1" />
      <p className="mt-3 text-slate-500 dark:text-slate-400">
        本平台专为有理工科背景的商业决策者设计，帮助你在 3-4 小时内建立
        对澳龙生物核心产品的完整技术与商业认知。
      </p>

      {/* Module table */}
      <section className="mt-10">
        <BilingualHeading zhText="六个学习模块" enText="Six Learning Modules" level="h2" />
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">模块</th>
                <th className="px-4 py-3 text-left font-semibold">时长</th>
                <th className="px-4 py-3 text-left font-semibold">核心收获</th>
                <th className="px-4 py-3 text-left font-semibold">学习目的</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                {
                  href: '/bio-foundation',
                  module: 'M1 兽用生物制品基础',
                  duration: '30 分钟',
                  outcome: '疫苗分类、免疫双通路、原核 vs 真核表达系统',
                  goal: '建立底层知识框架，理解后续产品的技术逻辑'
                },
                {
                  href: '/eg95-vaccine',
                  module: 'M2 EG95亚单位疫苗',
                  duration: '35 分钟',
                  outcome: '寄生虫生命周期干预、柔性接头串联表达工程、全球竞争格局',
                  goal: '理解澳龙核心专利产品的技术壁垒与市场垄断地位'
                },
                {
                  href: '/brucellosis',
                  module: 'M3 布鲁氏菌病疫苗',
                  duration: '32 分钟',
                  outcome: 'S2/A19/Rev.1/BA0711毒株比较、DIVA技术、中东市场BCR模型',
                  goal: '掌握中东市场进入的技术与经济学论据'
                },
                {
                  href: '/capripoxvirus',
                  module: 'M4 山羊痘与LSD疫苗',
                  duration: '30 分钟',
                  outcome: '痘病毒同源性、异源免疫机制、东南亚LSD疫情扩散时间线',
                  goal: '理解出口创汇拳头产品的科学依据与渠道机会'
                },
                {
                  href: '/regulatory-ra',
                  module: 'M5 兽药注册法规',
                  duration: '35 分钟',
                  outcome: 'VICH指南体系、SFDA CTD/vNees结构、BSL-3工程要求',
                  goal: '能读懂注册文件框架，评估出海合规成本与时间线'
                },
                {
                  href: '/market-strategy',
                  module: 'M6 市场竞争格局',
                  duration: '28 分钟',
                  outcome: '全球动保市场结构、澳龙521%溢价估值逻辑、三步走出海路径',
                  goal: '形成完整的商业判断框架，支持投资与合作决策'
                },
              ].map((row) => (
                <tr key={row.href} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3">
                    <Link href={row.href} className="font-medium text-teal-600 hover:underline dark:text-teal-400">
                      {row.module}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{row.duration}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.outcome}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.goal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tab guide */}
      <section className="mt-10">
        <BilingualHeading zhText="每个模块的六个标签" enText="Six Tabs Per Module" level="h2" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { tab: '原理 Principle', desc: '工程机制叙述、LaTeX公式、直观类比' },
            { tab: '可视化 Visual', desc: '交互式D3图表或分子动画' },
            { tab: '机制 Mechanism', desc: '免疫通路或分子机制深度解析，含Mol*蛋白结构' },
            { tab: '法规 Regulatory', desc: 'VICH/CTD/SFDA注册要求与合规路径' },
            { tab: '市场 Market', desc: '流行病学数据、经济模型、竞争格局' },
            { tab: '测验 Quiz', desc: '5题MCQ验证理解，成绩自动保存' },
          ].map((item) => (
            <div key={item.tab} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <p className="font-semibold text-teal-600 dark:text-teal-400">{item.tab}</p>
              <p className="mt-1 text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended path */}
      <section className="mt-10">
        <BilingualHeading zhText="推荐学习路径" enText="Recommended Study Path" level="h2" />
        <div className="mt-4 rounded-xl bg-teal-50 p-5 dark:bg-teal-950/30">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            <strong>第一次通读（3-4小时）：</strong>
            按 M1→M2→M3→M4→M5→M6 顺序，每个模块先读「原理」标签，
            再看「可视化」，最后完成「测验」。建立完整知识链路。
          </p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            <strong>专题深入（按需）：</strong>
            准备中东市场提案前，重点复习 M3「市场」标签的BCR经济模型；
            准备SFDA注册讨论前，精读 M5「法规」标签的CTD结构导航器。
          </p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            <strong>快速复习（30分钟）：</strong>
            直接进入各模块「测验」标签，错题定位知识盲区后针对性回顾。
          </p>
        </div>
      </section>

      {/* Start button */}
      <div className="mt-10 text-center">
        <Link href="/bio-foundation"
          className="inline-block rounded-xl bg-teal-600 px-8 py-3 font-semibold text-white hover:bg-teal-500 transition-colors">
          开始学习 M1 →
        </Link>
      </div>
    </div>
  );
}
