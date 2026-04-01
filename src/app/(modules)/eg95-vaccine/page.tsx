import { ModulePage } from '@/components/modules/ModulePage';
import { MolstarViewer } from '@/components/bio/viewers/MolstarViewer';
import moduleData from '@/data/modules/m2-eg95-vaccine.json';

const mechanismContent = (
  <div className="space-y-4">
    <div>
      <h2 className="mb-1 text-xl font-semibold text-gray-900 dark:text-slate-100">
        EG95 蛋白 AlphaFold 结构
      </h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-slate-400">
        UniProt Q25309 · FnIII 结构域 · aa 51-79 核心保护表位
      </p>
    </div>
    <MolstarViewer
      source={{ type: 'uniprot', accession: 'Q25309' }}
      height={380}
      spin={false}
      representation="cartoon"
      className="w-full"
    />
    <div className="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-600 dark:bg-slate-800 dark:text-slate-400">
      <p className="mb-2 font-semibold text-gray-900 dark:text-slate-100">抗原-抗体相互作用要点</p>
      <ul className="space-y-1">
        <li>• 核心表位 aa 51-79：暴露于 FnIII 结构域表面环，IgG CDR3 直接接触</li>
        <li>• 四聚体多价效应：4 个 EG95 单元提供多位点 B 细胞受体交联，诱导亲合力成熟</li>
        <li>• 保护机制：IgG 包被六钩蚴 → 补体调理 → 巨噬细胞吞噬 → 阻断肝脏定植</li>
      </ul>
    </div>
  </div>
);

export default function EG95VaccinePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ModulePage moduleData={moduleData as any} mechanismContent={mechanismContent} />;
}
