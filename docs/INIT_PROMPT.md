You are initializing the auleon-biotech project from scratch.
Read docs/AGENTS.md completely before writing any code.

A component reuse audit has been completed. Before initializing the Next.js
project, execute Stage A first: copy the following files from the two source
projects into the new project structure.

═══════════════════════════════════════════════════════════
STAGE A: Copy shared components (before project init)
═══════════════════════════════════════════════════════════

Create directory: ~/Projects/auleon-biotech/
Then copy these files:

FROM ~/Projects/bio-foundation/src/ → TO ~/Projects/auleon-biotech/src/

GREEN (copy as-is, zero modification):
  components/ui/Badge.tsx
  components/ui/Button.tsx
  components/ui/Card.tsx                    → use as default Card
  components/ui/ProgressBar.tsx
  components/bio/ui/ConceptCard.tsx
  components/bio/ui/ChapterSectionNav.tsx
  components/bio/viewers/MolstarViewer.tsx
  components/bio/viewers/CompareViewer.tsx
  components/bio/viewers/MoleculeCard.tsx
  components/MolstarErrorSuppressor.tsx
  components/bio/animations/PlaybackControls.tsx
  components/bio/animations/SecondaryStructure.tsx
  hooks/useMoleculeData.ts
  hooks/useProteinData.ts
  lib/api/pdb.ts
  lib/api/pubchem.ts

YELLOW (copy then apply modifications listed below):
  components/bio/animations/EnzymeBinding.tsx
  components/bio/animations/DNAHelix.tsx
  components/bio/animations/TranscriptionScene.tsx
  components/bio/animations/TranslationScene.tsx
  components/bio/interactive/ChapterQuiz.tsx
  components/bio/interactive/KineticsChart.tsx
  hooks/useLearningProgress.ts
  components/layout/Sidebar.tsx
  components/layout/ThemeProvider.tsx
  components/layout/ThemeToggle.tsx
  components/dashboard/DashboardClient.tsx
  lib/utils.ts
  lib/types.ts
  lib/constants.ts

FROM ~/Projects/med-device-foundation/src/ → TO ~/Projects/auleon-biotech/src/

GREEN (copy as-is):
  components/ui/AnalogyBox.tsx
  components/ui/BilingualHeading.tsx
  components/ui/FormulaBlock.tsx
  components/ui/Tab.tsx
  components/ui/TabGroup.tsx
  components/research/DeepDiveButton.tsx
  lib/research/types.ts
  lib/research/adapters.ts
  lib/research/semantic-scholar.ts
  lib/types/quiz.ts
  lib/types/glossary.ts

YELLOW (copy then modify):
  components/tabs/GlossaryTab.tsx
  components/tabs/PrincipleTab.tsx
  components/tabs/VisualTab.tsx
  components/tabs/CaseStudyTab.tsx
  components/tabs/QuizTab.tsx
  lib/types/trial.ts
  components/visualizations/S10_PCRAnimation.tsx

CONFLICT RESOLUTION:
  - Use BF's Card.tsx (design-token approach, dark-mode-first)
  - Use BF's ThemeToggle.tsx (no lucide-react dependency)
  - Use BF's lib/utils.ts (includes cn + formatPercent + wait)
  - All MDF components using '@/lib/utils/cn' → update import to '@/lib/utils'

YELLOW MODIFICATIONS to apply immediately after copying:

1. lib/constants.ts (from BF):
   Replace CHAPTERS array with auleon-biotech 6 modules:
   [
     { id: 'm1', slug: 'bio-foundation', titleZH: '兽用生物制品基础',
       titleEN: 'Veterinary Biologics Foundation', color: 'teal' },
     { id: 'm2', slug: 'eg95-vaccine', titleZH: 'EG95亚单位疫苗',
       titleEN: 'EG95 Subunit Vaccine', color: 'emerald' },
     { id: 'm3', slug: 'brucellosis', titleZH: '布鲁氏菌病疫苗',
       titleEN: 'Brucellosis Vaccine Series', color: 'amber' },
     { id: 'm4', slug: 'capripoxvirus', titleZH: '山羊痘与LSD疫苗',
       titleEN: 'Capripoxvirus & LSD Cross-Protection', color: 'orange' },
     { id: 'm5', slug: 'regulatory-ra', titleZH: '兽药注册法规',
       titleEN: 'Regulatory Affairs / RA', color: 'violet' },
     { id: 'm6', slug: 'market-strategy', titleZH: '市场竞争格局',
       titleEN: 'Market Strategy', color: 'sky' }
   ]
   Change LEARNING_PROGRESS_KEY to 'auleon_biotech_progress'

2. lib/types.ts (from BF):
   Keep all existing types. ADD at the end:
   export interface VaccineAntigenMeta {
     antigenName: string;
     molecularWeight_kDa: number;
     expressionSystem: 'prokaryotic' | 'eukaryotic' | 'whole_organism';
     pdbId?: string;
     uniprotAccession?: string;
     pubchemCid?: number;
     epitopeRegions?: Array<{ start: number; end: number; type: 'B-cell' | 'T-cell' }>;
   }
   export interface RegulatoryDossierEntry {
     module: 'Part1' | 'Part2' | 'Part3' | 'Part4';
     section: string;
     title: string;
     status: 'complete' | 'partial' | 'missing';
     vichGuideline?: string;
     notes?: string;
   }

3. hooks/useLearningProgress.ts (from BF):
   Update LEARNING_PROGRESS_KEY import to use auleon-biotech constants.ts
   (The key string 'auleon_biotech_progress' defined in step 1)

4. components/layout/Sidebar.tsx (from BF):
   - Replace "Bio Foundation" branding with "澳龙生物 · 知识图谱"
   - Update CHAPTERS import to auleon-biotech constants
   - Change color theme: bio-foundation uses purple/indigo → replace with teal-600

5. components/dashboard/DashboardClient.tsx (from BF):
   - Replace hero headline with: "兽用免疫学知识图谱" / "Veterinary Immunology Knowledge Graph"
   - Replace MoleculeOfDayCard slot with a placeholder div
     (VaccineOfDayCard will be built as a new component in Stage B)
   - Update CHAPTERS import

6. components/tabs/QuizTab.tsx (from MDF):
   - Change localStorage key from 'med_device_quiz_*' to 'auleon_quiz_*'
   - Remove any import of MDF-specific chapter types
   - Keep quiz engine logic intact

7. components/tabs/VisualTab.tsx (from MDF):
   - Update visualization registry object keys to auleon-biotech viz IDs:
     'm1-vaccine-types', 'm2-eg95-lifecycle', 'm2-linker-design',
     'm3-strain-comparison', 'm3-brucella-evasion', 'm3-bcr-model',
     'm4-capripox-phylogeny', 'm4-lsd-spread', 'm5-ctd-navigator',
     'm5-vich-matrix', 'm6-dcf-model'
   - Component imports will be placeholders (null) until Stage F builds them

8. components/bio/animations/EnzymeBinding.tsx (from BF):
   - Add new mode: 'antigen-antibody'
   - In this mode: rename enzyme body label → "EG95 抗原 Antigen"
   - Rename substrate label → "IgG Fab 片段"
   - Change active site label → "抗原决定簇 Epitope (aa 51-79)"
   - Change substrate color to blue (#3b82f6) to represent antibody
   - Add 3 CDR contact dashes (H-bond markers already exist in component)
   - Keep existing 'lock-key' and 'induced-fit' modes untouched

9. components/visualizations/S10_PCRAnimation.tsx (from MDF):
   - Rename file to VaccinePCRQC.tsx
   - Update step labels from generic PCR to vaccine QC context:
     "变性 Denaturation (95°C)" / "退火 Annealing — EG95引物" /
     "延伸 Extension — 扩增抗原基因片段"
   - Update title to "疫苗批次PCR质控 / Vaccine Batch PCR QC"
   - Keep all animation logic unchanged

10. lib/types/trial.ts (from MDF):
    - Add field to RegulatoryCase: regulatoryBody?: 'SFDA' | 'VICH' | 'NMPA' | 'EMA'
    - Add field: vichGuidelineRef?: string  (e.g. "GL41")
    - Rename field engineeringCause → scientificBasis

═══════════════════════════════════════════════════════════
STAGE B: Initialize Next.js project
═══════════════════════════════════════════════════════════

Run in ~/Projects/auleon-biotech/:

  npx create-next-app@latest . \
    --typescript --tailwind --app --src-dir \
    --no-turbopack --import-alias "@/*" \
    --skip-install

Then update package.json dependencies to exactly:

{
  "name": "auleon-biotech",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --webpack -p 3003",
    "build": "next build --webpack",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@e-infra/react-molstar-wrapper": "^0.0.10",
    "d3": "^7.9.0",
    "framer-motion": "^12.34.3",
    "katex": "^0.16.38",
    "molstar": "^5.6.1",
    "next": "16.1.6",
    "next-themes": "^0.4.6",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "recharts": "^3.7.0",
    "tailwind-merge": "^3.5.0"
  },
  "devDependencies": {
    "@types/d3": "^7.4.3",
    "@types/katex": "^0.16.8",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "autoprefixer": "^10.4.27",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.19",
    "typescript": "^5"
  }
}

NOTE: Do NOT add @react-three/fiber, @react-three/drei, or three.
All 3D is handled by Mol* (MolstarViewer). All animations are SVG-based.
NOTE: Do NOT add mapbox-gl. The LSD spread map will use D3 with a
topojson world map (free, no API token required).

Run: npm install

═══════════════════════════════════════════════════════════
STAGE C: Configure project infrastructure
═══════════════════════════════════════════════════════════

1. Update next.config.ts:
import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
  transpilePackages: ['@e-infra/react-molstar-wrapper'],
  experimental: {
    optimizePackageImports: ['d3', 'framer-motion'],
  },
};
export default nextConfig;

2. Update tailwind.config.ts — add teal as primary:
   Extend colors:
     primary: { DEFAULT: '#0d9488', dark: '#14b8a6' }  // teal-600/teal-500
     vaccine: { DEFAULT: '#10b981' }  // emerald-500
     warning: { DEFAULT: '#f59e0b' }  // amber-500
     regulatory: { DEFAULT: '#7c3aed' }  // violet-600

3. Update src/app/globals.css:
   Add CSS variables:
   :root {
     --color-primary: #0d9488;
     --color-bg: #ffffff;
     --color-bg-secondary: #f8fafc;
     --color-text: #0f172a;
     --color-border: #e2e8f0;
   }
   .dark {
     --color-primary: #14b8a6;
     --color-bg: #0f172a;
     --color-bg-secondary: #1e293b;
     --color-text: #f1f5f9;
     --color-border: #334155;
   }
   body { background: var(--color-bg); color: var(--color-text); }

4. Create src/app/layout.tsx:
   - Wrap with ThemeProvider (from copied BF component)
   - Include MolstarErrorSuppressor
   - Include Sidebar (from copied + adapted BF component)
   - Import @e-infra/react-molstar-wrapper/style.css
   - suppressHydrationWarning on <html>
   - Inter font via next/font/google

5. Create empty directory structure:
   src/app/(modules)/bio-foundation/
   src/app/(modules)/eg95-vaccine/
   src/app/(modules)/brucellosis/
   src/app/(modules)/capripoxvirus/
   src/app/(modules)/regulatory-ra/
   src/app/(modules)/market-strategy/
   src/components/visualizations/  (empty, for Stage F)
   src/data/modules/               (empty, for Stage D content JSONs)

6. Run: npm run build
   Expected: 0 errors, home page route only.
   Fix any TypeScript errors from copied files before proceeding.

═══════════════════════════════════════════════════════════
STAGE D: Build M1 as full template module
═══════════════════════════════════════════════════════════

Create src/data/modules/m1-bio-foundation.json with full content:

{
  "id": "m1",
  "slug": "bio-foundation",
  "titleZH": "兽用生物制品基础",
  "titleEN": "Veterinary Biologics Foundation",
  "color": "teal",
  "visualizationId": "m1-vaccine-types",
  "tabs": {
    "principle": {
      "sections": [
        {
          "id": "m1-1",
          "headingZH": "疫苗分类体系",
          "headingEN": "Vaccine Classification System",
          "content": "兽用生物制品按抗原呈递方式分为四大类：...",
          "keyPoints": [
            "活疫苗（Live Attenuated）：毒力减弱但保留完整抗原结构，诱导体液+细胞双通路免疫",
            "灭活疫苗（Inactivated）：化学/热处理灭活，安全性高但免疫原性弱，通常需要佐剂",
            "亚单位疫苗（Subunit）：仅含保护性抗原蛋白，需精确表位映射，EG95即属此类",
            "基因工程疫苗：利用重组DNA技术在异源系统（如E.coli）中表达目标抗原"
          ],
          "formulas": [
            {
              "latex": "K_D = \\frac{k_{off}}{k_{on}}",
              "label": "抗原-抗体结合解离常数 Kd，单位 mol/L，值越小亲和力越强"
            },
            {
              "latex": "\\text{VE} = 1 - \\frac{\\text{Attack Rate (Vaccinated)}}{\\text{Attack Rate (Unvaccinated)}}",
              "label": "疫苗效力 Vaccine Efficacy — 临床评估核心指标"
            }
          ],
          "analogies": [
            {
              "icon": "🔑",
              "content": "亚单位疫苗如同给免疫系统展示一把钥匙的局部形状（抗原表位），而非整把钥匙（完整病原体）。锁（B细胞受体）识别形状后产生能匹配的抗体，之后遇到真实的完整钥匙时，抗体能精准封锁其功能域。"
            }
          ]
        },
        {
          "id": "m1-2",
          "headingZH": "原核 vs 真核表达系统",
          "headingEN": "Prokaryotic vs Eukaryotic Expression Systems",
          "content": "重组蛋白疫苗的工业化生产面临表达系统的核心抉择...",
          "keyPoints": [
            "E. coli (原核)：产量高（每升发酵液可达克级），成本低，但无糖基化修饰，蛋白可能形成包涵体（inclusion body）",
            "CHO细胞 (真核)：糖基化修饰完整，折叠更接近天然构象，但成本高出10-100倍，培养周期长",
            "澳龙EG95技术突破：通过柔性接头串联表达（(GGGGS)n linker + 四聚体）在E.coli中实现40%总蛋白表达量，远超单体的5%",
            "全菌体灭活（Bacterin）新工艺：省去色谱纯化步骤，98%保护率与纯化蛋白疫苗相当"
          ],
          "formulas": [
            {
              "latex": "\\text{Expression Gain} = \\frac{\\text{Tandem Multimer Output}}{\\text{Monomer Output}} \\approx \\frac{40\\%}{5\\%} = 8\\times",
              "label": "澳龙四聚体串联表达增益估算（基于文献数据）"
            }
          ]
        },
        {
          "id": "m1-3",
          "headingZH": "免疫应答双通路",
          "headingEN": "Dual-Pathway Immune Response",
          "content": "疫苗保护效力来自体液免疫与细胞免疫的协同激活...",
          "keyPoints": [
            "体液免疫：B细胞识别抗原→浆细胞产生特异性IgG/IgA→抗体中和病原体或调理吞噬",
            "细胞免疫：CD4+ T辅助细胞→激活B细胞和CD8+ CTL→杀伤感染细胞",
            "亲和力成熟（Avidity Maturation）：多价抗原结构与B细胞受体的多位点交叉交联，显著增强免疫记忆强度",
            "对布鲁氏菌：体液免疫不足，因其为胞内菌；细胞免疫（IFNγ、CTL）对清除关键"
          ]
        }
      ]
    },
    "glossary": [
      { "termEN": "Subunit Vaccine", "termZH": "亚单位疫苗",
        "definition": "仅含病原体保护性抗原蛋白组分的疫苗，不含完整病原体，安全性高" },
      { "termEN": "Adjuvant", "termZH": "佐剂",
        "definition": "增强疫苗免疫原性的非特异性免疫促进剂，如ISA71、Montanide" },
      { "termEN": "Epitope", "termZH": "表位/抗原决定簇",
        "definition": "抗原分子上被B细胞或T细胞受体识别的特异性结构区域" },
      { "termEN": "Vaccine Efficacy (VE)", "termZH": "疫苗效力",
        "definition": "接种疫苗后降低感染/发病风险的百分比，VE=1-(攻毒率接种组/攻毒率对照组)" },
      { "termEN": "Prokaryotic Expression", "termZH": "原核表达",
        "definition": "利用细菌（如E.coli BL21）生产重组蛋白，成本低、产量高，但缺乏糖基化修饰" },
      { "termEN": "Inclusion Body", "termZH": "包涵体",
        "definition": "原核表达中蛋白质错误折叠聚集形成的不溶性颗粒，需变性复性处理" },
      { "termEN": "GPI-anchored Protein", "termZH": "GPI锚定蛋白",
        "definition": "通过糖基磷脂酰肌醇（GPI）锚定在细胞膜表面的蛋白质，EG95即属此类" },
      { "termEN": "Avidity", "termZH": "亲合力",
        "definition": "抗体与多价抗原多位点结合的总体结合强度，区别于单价亲和力（affinity）" }
    ],
    "quiz": {
      "mcq": [
        {
          "id": "m1-q1",
          "question": "EG95疫苗属于以下哪种疫苗类型？",
          "options": [
            "A. 活减毒疫苗（Live Attenuated）",
            "B. 灭活全菌疫苗（Inactivated Whole Organism）",
            "C. 基因工程亚单位疫苗（Recombinant Subunit）",
            "D. 类毒素疫苗（Toxoid）"
          ],
          "correctAnswer": "C",
          "explanation": "EG95是通过重组DNA技术，将细粒棘球绦虫的EG95基因克隆到pET28b载体并在E.coli中表达的亚单位蛋白疫苗，属于基因工程亚单位疫苗。"
        },
        {
          "id": "m1-q2",
          "question": "与CHO细胞（真核）表达系统相比，E.coli（原核）表达系统的主要优势是？",
          "options": [
            "A. 糖基化修饰更完整，蛋白构象更接近天然状态",
            "B. 生产成本显著更低，单位体积产量更高",
            "C. 不会形成包涵体，下游纯化更简单",
            "D. 可分泌蛋白到培养基，减少细胞破碎步骤"
          ],
          "correctAnswer": "B",
          "explanation": "原核表达（E.coli）的核心优势是低成本和高产量。每升发酵液可达克级蛋白产量，成本比CHO系统低10-100倍。缺点是无糖基化修饰且可能形成包涵体。"
        },
        {
          "id": "m1-q3",
          "question": "布鲁氏菌病活疫苗（如S2株）为何比单纯的蛋白亚单位疫苗对该病有更好的保护效果？",
          "options": [
            "A. 活疫苗抗体滴度更高，体液免疫更强",
            "B. 布鲁氏菌为胞内菌，活疫苗能诱导细胞免疫（CTL/IFNγ）清除胞内细菌",
            "C. 活疫苗接种途径（口服）更方便，依从性更高",
            "D. 亚单位疫苗无法通过现行GMP认证"
          ],
          "correctAnswer": "B",
          "explanation": "布鲁氏菌是兼性胞内寄生菌，能逃逸到细胞内增殖。单纯体液免疫（抗体）无法清除胞内细菌。活减毒疫苗能激活CD4+/CD8+ T细胞和IFNγ通路，诱导杀伤感染细胞的细胞免疫，这是其保护的核心机制。"
        },
        {
          "id": "m1-q4",
          "question": "澳龙EG95疫苗采用四聚体串联表达配合(GGGGS)n柔性接头的核心工程目的是？",
          "options": [
            "A. 防止蛋白质降解，延长半衰期",
            "B. 提高大肠杆菌中蛋白表达量并增强多价抗原的亲合力效应",
            "C. 使蛋白质能够分泌到培养基中",
            "D. 添加糖基化修饰位点以增强免疫原性"
          ],
          "correctAnswer": "B",
          "explanation": "(GGGGS)n柔性接头提供空间自由度防止域间折叠干扰，四聚体串联使E.coli表达量从~5%提升至~40%总蛋白。多价结构还能与B细胞受体多位点交叉交联，诱发更强的亲合力效应和免疫记忆。"
        },
        {
          "id": "m1-q5",
          "question": "全球兽药市场反刍动物疫苗的复合年增长率（CAGR）预测区间为？",
          "options": [
            "A. 2.1% - 3.5%",
            "B. 6.6% - 7.9%",
            "C. 12% - 15%",
            "D. 18% - 22%"
          ],
          "correctAnswer": "B",
          "explanation": "根据Mordor Intelligence等机构预测，全球反刍动物疫苗市场CAGR为6.6%-7.9%，预计从2025年的~31.9亿美元增长至2030年的44-70亿美元区间，亚太/东南亚是增速最快的引擎。"
        }
      ]
    }
  }
}

Create src/app/(modules)/bio-foundation/page.tsx implementing:
- All 6 tabs using the copied tab components
- Import data from m1-bio-foundation.json
- Tab 2 (Visual) renders a placeholder (text: "M1 Visualization — To be built in Stage F")
- Tab 3 (Mechanism) renders MolstarViewer with EG95 AlphaFold:
  source={{ type: "uniprot", accession: "Q25309" }}
  Add caption: "AlphaFold2预测结构 — EG95抗原 UniProt Q25309（无实验PDB结构）"
- Tab 4 (Regulatory) renders a static content section with VICH framework overview
- Tab 5 (Market) renders market size data cards (static from JSON)
- Tab 6 (Quiz) uses ChapterQuiz with m1 MCQ data

Run: npm run build
Expected: 0 errors. Fix any issues before Stage E.

═══════════════════════════════════════════════════════════
STAGE E: Build M2-M6 following M1 pattern
═══════════════════════════════════════════════════════════

Create data JSON files and page.tsx for each remaining module.
Follow the exact same 6-tab structure as M1.
For each module's Tab 2 (Visual): render a placeholder div with the
visualization ID and a note "Visualization component — built in Stage F".

Key content requirements per module:

M2 (eg95-vaccine):
- Principle: 5-node life cycle (egg→oncosphere→hydatid cyst→adult worm→egg),
  EG95 molecular structure (16.6kDa, FnIII domain), 3 B-cell epitopes
  (aa 11-29, 51-79, 100-110), pET28b expression, Bacterin alternative
- Mechanism Tab: render MolstarViewer (UniProt Q25309) + EnzymeBinding
  component in 'antigen-antibody' mode (the modified version from Stage A)
- Quiz: 5 MCQ on EG95 biology, expression engineering, global CE burden

M3 (brucellosis):
- Principle: intracellular survival mechanism, S2/A19/Rev.1/BA0711 comparison,
  pregnancy safety meta-analysis (27 papers, key variable = dose/route not strain),
  IRF3 genetic polymorphism, ddPCR DIVA (LOD 2.54-3.11 copies/reaction)
- Market Tab: Iraq CBA model (BCR=4.25, NPV=$10.56M, IRR=91.38%)
- Quiz: 5 MCQ on strain selection, DIVA, intracellular mechanism

M4 (capripoxvirus):
- Principle: LSDV/GTPV/SPPV 96-97% nucleotide homology, P32/L1R conservation,
  goatpox>sheeppox cross-protection, dose=3× goat dose for cattle (Uttarkashi)
  Thailand BSTS model: 78-119% case reduction post-vaccination
- Regulatory Tab: EUA mechanisms by country (Thailand DLD/Indonesia BBPMSOH/
  Vietnam DAH), distributor matrix (PT.Swadesi/SHS/Olmix Asialand/Union Castap)
- Quiz: 5 MCQ on capripox phylogeny, dosing, cross-protection evidence

M5 (regulatory-ra):
- Principle: VICH GL1/GL2/GL3/GL4/GL27/GL41/GL50/GL59 overview
- Regulatory Tab: SFDA vNees 4-part structure (Part1=Admin/Part2=CMC/
  Part3=Safety/Part4=Efficacy), BSL-3 engineering requirements
  (negative pressure cascade, double HEPA, biometric interlock),
  P3 facility cost benchmark: ¥160M for 8,000m² (Yibang Bio, Qingdao)
- Market Tab: registration timeline matrix (6 target countries)
- Quiz: 5 MCQ on VICH guidelines, CTD format, BSL-3 requirements

M6 (market-strategy):
- Principle: global animal health market $60.7B(2023)→$125.8B(2030),
  top 10 MNCs = 71% share, strategic blind spots in small ruminant diseases
- Market Tab: Auleon valuation case (NAV ¥121M → DCF ¥752M → 521% premium,
  3yr profit commitment ¥255M), Hengtong acquisition structure
- Regulatory Tab: G2G aid export → commercial registration transition,
  Fill-and-Finish strategy for Saudi/Indonesia
- Quiz: 5 MCQ on competitive landscape, DCF logic, market entry strategy

Run: npm run build
Expected: 0 errors, 8 routes (home + 6 modules + layout).

═══════════════════════════════════════════════════════════
STAGE F: Build visualization components
═══════════════════════════════════════════════════════════

Build in complexity order. Each component uses dynamic import + ssr:false.
After each component, update VisualTab registry and run npm run build.

LOW COMPLEXITY (D3 data viz):

1. StrainComparison.tsx (M3)
   D3 radar chart, 6 dimensions, 4 strains (S2/A19/Rev.1/BA0711)
   Seed data based on audit report / AGENTS.md content
   Click strain label → highlight that strain's radar polygon

2. VICHMatrix.tsx (M5)
   D3 heatmap: rows=8 VICH guidelines, cols=3 Auleon products
   Cell color: green=met/yellow=partial/red=missing
   Click cell → right panel shows specific requirement + data gap

3. BCRModel.tsx (M3)
   D3 bar/line chart showing Iraq CBA model outputs
   Static display of: BCR=4.25, NPV=$10.56M, IRR=91.38%
   Seroprevalence decay curve over 20 years (9.22%→0.73%)

MEDIUM COMPLEXITY (D3 + Framer Motion):

4. EG95LifeCycle.tsx (M2)
   D3 force-directed graph OR sequential SVG step-through
   5 nodes: Dog (終宿主) → Egg (虫卵) → Oncosphere (六钩蚴) →
   Larval Cyst (包虫囊 in sheep/human) → back to Dog
   PlaybackControls reused from BF
   "Deploy Vaccine" button: red blocking animation on oncosphere→tissue edge

5. CapripoxPhylogeny.tsx (M4)
   D3 radial tree: Poxviridae→Capripoxvirus→LSDV/GTPV/SPPV
   Click P32 node → side panel shows ELISA sensitivity/specificity data
   Click L1R node → shows structural conservation note

6. CTDNavigator.tsx (M5)
   D3 collapsible tree: 4 Parts → sub-sections
   Each leaf node: color-coded status (green/yellow/red) for Auleon data gaps
   Follows SFDA vNees structure from AGENTS.md

7. LSDSpreadMap.tsx (M4)
   D3 world map using topojson (NOT Mapbox — no API key needed)
   Use: https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json
   Time slider 2012→2024 showing affected countries highlighted
   Click country → tooltip with first detection year + policy response

HIGH COMPLEXITY (R3F adapted animations):

8. BrucellaEvasion.tsx (M3)
   Based on EnzymeBinding.tsx adapted pattern (SVG, NOT R3F)
   4-phase animation: 
   Phase 0: Brucella (rod shape) + macrophage outline
   Phase 1: phagocytosis (Brucella inside vacuole)
   Phase 2: T4SS injection → vacuole membrane modification (color change)
   Phase 3: replication niche established (bacteria multiplying in BCV)
   PlaybackControls reused; label each phase clearly
   Separate "Normal pathway" toggle showing lysosome fusion for comparison

9. LinkerDesign.tsx (M2)
   Framer Motion animation
   Left panel: single EG95 monomer (small circle, dim)
   Right panel: 4× tandem repeat connected by (GGGGS)2 linkers
   Animation: B-cell receptor (Y-shape) approaching multi-site antigen →
   crosslinking animation → "亲和力成熟 Avidity ↑" indicator
   Side-by-side: monomer vs tetramer antibody titer bar chart

10. DCFModel.tsx (M6)
    D3 waterfall chart: 
    Bar 1: NAV ¥121M (gray)
    Bar 2: +DCF increment ¥631M (teal, rising)
    Bar 3: Total ¥752M (teal)
    Bar 4: 40% deal price ¥274M (amber)
    Below: 3-year profit commitment timeline
    ¥80M(2026) / ¥85M(2027) / ¥90M(2028) → total ¥255M
    Comparison: 2024 actual profit ¥19.57M → 2025 (8mo) ¥64.84M projection

═══════════════════════════════════════════════════════════
STAGE G: Final integration, home page, deploy
═══════════════════════════════════════════════════════════

1. Build src/app/page.tsx (home dashboard):
   - Adapt DashboardClient from BF (already modified in Stage A)
   - Replace MoleculeOfDayCard with VaccineOfDayCard:
     Show today's featured content: rotate through EG95/Brucella/Capripox
     Display: vaccine name, type badge, key efficacy stat, link to module
   - 6 module cards in 2×3 grid with teal color scheme
   - Progress bar showing overall learning completion

2. Run final: npm run build
   Expected: 0 errors, 8+ routes

3. Deploy to Vercel:
   npx vercel --prod --yes

4. Git commit:
   git add -A
   git commit -m "feat: auleon-biotech v1.0 — 6 modules, 10 visualizations, Mol* protein viewer"
   git remote add origin https://github.com/aladdinlg/auleon-biotech.git
   git push origin main

FINAL VERIFICATION CHECKLIST:
□ All 6 module routes return 200
□ MolstarViewer loads EG95 AlphaFold structure (UniProt Q25309)
□ All 10 visualization components render without console errors
□ Dark mode toggle works across all pages
□ Quiz engine saves/loads from localStorage correctly
□ Build: 0 errors, 0 warnings
□ Mobile responsive: sidebar collapses on <768px
