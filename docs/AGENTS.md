# AGENTS.md — Auleon BioVet Learning Platform
# 重庆澳龙生物制品有限公司：兽用免疫学知识学习平台

## Project Overview
A bilingual (zh-CN / en) interactive learning platform covering the molecular
biology, vaccine engineering, regulatory affairs, and commercial strategy of
Chongqing Auleon Biologicals Co., Ltd. Target learner: engineering-background
professional seeking deep technical and commercial understanding of veterinary
biologics for business development purposes.

Six learning modules, each with 6 interactive tabs (Principle, Visual,
Mechanism, Regulatory, Market, Quiz). Total estimated routes: 20.

---

## Tech Stack (STRICT — do not substitute)
- Framework: Next.js 15 (App Router, NOT Pages Router)
- Bundler: Webpack (NOT Turbopack — use --webpack flag)
- Styling: Tailwind CSS 4
- Language: TypeScript strict mode (no `any`)
- 3D Molecular: @e-infra/react-molstar-wrapper (from bio-foundation)
  - Must use dynamic import + { ssr: false }
  - Must import style: "@e-infra/react-molstar-wrapper/style.css"
- 3D Animation: @react-three/fiber + @react-three/drei (from bio-foundation)
  - All R3F components: "use client" + dynamic import
- 2D Charts/Diagrams: D3.js v7 (from med-device-foundation)
- Map: Mapbox GL JS (new dependency for LSD spread map)
- Animation: Framer Motion v11
- Theme: next-themes
- Icons: lucide-react
- Deployment: Vercel (independent repo, NOT part of med-device-foundation)

## Package.json Scripts (CRITICAL)
{
  "scripts": {
    "dev": "next dev --webpack -p 3003",
    "build": "next build --webpack",
    "start": "next start",
    "lint": "next lint"
  }
}

---

## Project Structure

src/
├── app/
│   ├── layout.tsx                     # Root layout
│   ├── page.tsx                       # Home: 6 module entry cards
│   ├── globals.css
│   └── (modules)/
│       ├── bio-foundation/page.tsx    # M1: 兽用生物制品基础
│       ├── eg95-vaccine/page.tsx      # M2: EG95 亚单位疫苗
│       ├── brucellosis/page.tsx       # M3: 布鲁氏菌病疫苗
│       ├── capripoxvirus/page.tsx     # M4: 山羊痘/LSD 疫苗
│       ├── regulatory-ra/page.tsx     # M5: 兽药注册法规 (RA)
│       └── market-strategy/page.tsx  # M6: 市场竞争格局
│
├── components/
│   ├── ui/                            # COPIED from med-device-foundation
│   │   ├── TabGroup.tsx
│   │   ├── BilingualHeading.tsx
│   │   ├── FormulaBlock.tsx           # KaTeX for biochemistry formulas
│   │   ├── AnalogyBox.tsx
│   │   ├── Card.tsx
│   │   └── ThemeToggle.tsx
│   │
│   ├── bio/                           # COPIED from bio-foundation
│   │   ├── viewers/
│   │   │   ├── MolstarViewer.tsx      # Mol* protein structure viewer
│   │   │   └── MoleculeCard.tsx       # Molecule info + 3D viewer
│   │   └── animations/
│   │       ├── ProteinFolding.tsx     # Adapted: EG95 antigen folding
│   │       └── EnzymeBinding.tsx     # Adapted: antigen-antibody binding
│   │
│   └── visualizations/               # NEW — Auleon-specific
│       ├── EG95LifeCycle.tsx          # Parasite life cycle (D3 force graph)
│       ├── LinkerDesign.tsx           # Flexible linker tandem animation
│       ├── BrucellaEvasion.tsx        # Intracellular immune evasion (R3F)
│       ├── StrainComparison.tsx       # S2/A19/Rev.1/BA0711 radar chart (D3)
│       ├── BCRModel.tsx               # Iraq CBA model: BCR/NPV/IRR (D3)
│       ├── CapripoxPhylogeny.tsx      # LSDV/GTPV/SPPV phylogenetic tree (D3)
│       ├── LSDSpreadMap.tsx           # Global LSD spread 2012→2024 (Mapbox)
│       ├── CTDNavigator.tsx           # SFDA vNees/CTD structure navigator
│       ├── VICHMatrix.tsx             # VICH guidelines compliance matrix
│       └── DCFModel.tsx               # Auleon valuation DCF model (D3)
│
├── data/
│   └── modules/
│       ├── m1-bio-foundation.json
│       ├── m2-eg95-vaccine.json
│       ├── m3-brucellosis.json
│       ├── m4-capripoxvirus.json
│       ├── m5-regulatory-ra.json
│       └── m6-market-strategy.json
│
└── lib/
    ├── api/
    │   ├── pdb.ts                     # COPIED from bio-foundation
    │   └── pubchem.ts                 # COPIED from bio-foundation
    ├── types/
    │   ├── module.ts                  # Module, Tab, Section types
    │   ├── vaccine.ts                 # Vaccine strain, efficacy data types
    │   └── market.ts                  # Market, distributor, regulatory types
    └── utils/
        └── cn.ts                      # COPIED from either project

---

## Tab Structure (6 tabs per module)

| Tab # | Name         | Content Focus                              |
|-------|--------------|--------------------------------------------|
| 1     | 原理 Principle | Molecular/engineering mechanism narrative  |
| 2     | 可视化 Visual  | Interactive D3/R3F/Molstar visualization   |
| 3     | 机制 Mechanism | Immune pathway / reaction mechanism detail |
| 4     | 法规 Regulatory| Registration pathway, VICH, CTD format     |
| 5     | 市场 Market    | Epidemiology, economics, competitor data   |
| 6     | 测验 Quiz      | MCQ + case-based questions                 |

---

## Module Content Map

### M1: 兽用生物制品基础 (Veterinary Biologics Foundation)
Route: /bio-foundation

**Principle Tab:**
- 疫苗分类体系：活疫苗 vs 灭活疫苗 vs 亚单位疫苗 vs 基因工程疫苗的本质差异
- 免疫应答双通路：体液免疫(B细胞→抗体)与细胞免疫(T细胞→CTL)的协同
- 原核表达系统(E.coli)与真核表达系统(CHO细胞)的热力学成本对比
- Key formula: 抗原亲和力成熟 Kd = k_off / k_on

**Visual Tab:** (D3 animated comparison)
- 左列：活疫苗免疫应答动力学曲线
- 中列：灭活疫苗抗体滴度曲线
- 右列：亚单位疫苗+佐剂增强曲线
- 时间轴滑块，显示初次免疫→加强免疫→保护期

**Mechanism Tab:**
- GPI锚定蛋白的膜拓扑结构
- 纤连蛋白III型结构域的细胞粘附机制
- 佐剂(ISA71/ISA206)的PAMP激活通路

**Regulatory Tab:**
- 中国兽药GMP证书结构
- VICH框架总览图（GL1-GL59 分类）
- 中国NMPA vs SFDA vs EMA CVMP 监管体系对比

**Market Tab:**
- 全球兽药市场规模: $60.7B (2023) → $125.8B (2030)
- 反刍动物疫苗细分市场: $3.19B → $4.4B (CAGR 6.6-7.9%)
- 澳龙生物的市场定位矩阵

**Quiz:** 5 MCQ on vaccine classification + 1 case (given product description,
determine appropriate vaccine type and expression system)

---

### M2: EG95亚单位疫苗 (EG95 Subunit Vaccine)
Route: /eg95-vaccine

**Principle Tab:**
- 细粒棘球绦虫4节点生命周期（犬→虫卵→六钩蚴→包虫囊→犬的闭环）
- EG95抗原分子特征：16.6kDa GPI锚定蛋白，纤连蛋白III型结构域
- 三个核心B细胞表位区间：11-29aa, 51-79aa, 100-110aa（文献实证数据）
- 关键工程创新：pET28b/BL21(DE3) + (GGGGS)n 柔性接头 + 四聚体串联表达
- 全菌体灭活(Bacterin)新工艺 vs 传统色谱纯化工艺的成本工程对比
- Key formula: 串联表达增益 = 40% of total cell protein (vs ~5% monomer)

**Visual Tab: EG95LifeCycle.tsx** (D3 force-directed graph)
- 节点：终宿主(犬)、虫卵、六钩蚴、肠道粘膜、门静脉、肝脏包虫囊
- 动画：寄生虫沿箭头逐节点传播
- 点击"注射疫苗"按钮：在六钩蚴节点出现抗体屏障（红色阻断线）
- 右侧面板：当前节点的分子机制说明

**Mechanism Tab: LinkerDesign.tsx** (Framer Motion)
- 左侧：单体EG95蛋白（小→免疫原性弱→半衰期短）
- 右侧：(GGGGS)2-EG95-EG95-EG95-EG95 串联结构
- 动画展示：甘氨酸旋转自由度 vs 丝氨酸水合外壳
- B细胞受体与多价抗原交叉交联（亲和力成熟效应）

**Regulatory Tab:**
- 澳龙CN108066755B专利核心权利要求解析
- 国家一类新兽药注册路径（GMP → 临床试验 → 注册批文）
- SFDA Part 2/Module 3 CMC文件要求（细胞库、发酵流程、纯化回收率）
- VICH GL3/GL4 稳定性数据要求（加速稳定性 + 实时稳定性）

**Market Tab:**
- 全球CE疾病负担: 207,368新发病例/年, 122,457 DALYs (GBD 2019)
- 100+流行国家地理分布热力图（中亚/中东/南美/非洲）
- 竞品对比：澳龙(中国) vs Tecnovax(阿根廷) vs WHO项目疫苗
- 中国强制免疫采购政策带来的收入底座分析
- 亨通股份收购估值：NAV 1.21亿 → DCF 7.52亿 → 521%溢价逻辑

**Quiz:** 
- 5 MCQ (EG95结构、六钩蚴干预靶点、柔性接头功能)
- 1 Case: 给定一个重组蛋白疫苗生产成本过高的场景，分析是否适合转用
  Bacterin工艺，列举决策标准

---

### M3: 布鲁氏菌病疫苗 (Brucellosis Vaccine Series)
Route: /brucellosis

**Principle Tab:**
- 布鲁氏菌兼性胞内寄生机制：逃避吞噬体-溶酶体融合，维持胞内生存
- IRF3基因多态性与巨噬细胞清除效率的分子关联
- 活减毒疫苗设计逻辑：毒力衰减 vs 免疫记忆保留的平衡点
- 妊娠期流产风险：27篇文献荟萃分析揭示的关键变量（物种、剂量、途径）
- Key insight: 疫苗类型本身与流产AE无统计学关联(p>0.05)，操作规程才是关键

**Visual Tab: StrainComparison.tsx** (D3 radar chart)
- 六维雷达图：宿主特异性/残留毒力/妊娠安全性/DIVA能力/抗药性风险/保护效力
- 四个毒株(S2/A19/Rev.1/BA0711)各一条线，颜色区分
- 点击毒株名称高亮对应线条，右侧显示关键数据卡片

**Mechanism Tab: BrucellaEvasion.tsx** (R3F animation)
- 3D场景：巨噬细胞横截面（溶酶体、线粒体、吞噬体可见）
- 动画：布鲁氏菌被吞噬→通常路径（吞噬体→溶酶体→消化）
- 切换"布鲁氏菌逃逸模式"：IV型分泌系统注入效应蛋白→
  吞噬体膜成分改变→溶酶体融合被阻断→细菌在吞噬体内繁殖
- ROS/IL-12/IL-18信号被抑制的可视化
- 对比：S2接种后抗体调理→更有效的溶酶体融合

**Regulatory Tab:**
- 中国P3实验室的BSL-3工程要求（负压梯度/双HEPA/互锁气闸）
- 澳龙独立布病生产线的合规意义（一类高致病性病原微生物）
- SFDA Part 3/Module 4 安全性数据包（靶动物安全性/人员暴露风险）
- VICH GL41 减毒活疫苗靶动物安全性评价（孕期安全性边界数据要求）
- 新型BA0711 + ddPCR三重探针DIVA方法（FAM/HEX/ROX，LOD: 2.54-3.11拷贝/反应）

**Market Tab: BCRModel.tsx** (D3 interactive)
- 伊拉克Dohuk省案例模型（10,000次蒙特卡洛模拟结果）
- 交互滑块：调整贴现率(6%)、血清阳性率初始值(9.22%)、干预年限(20年)
- 实时更新：BCR(4.25) / NPV($10.56M) / IRR(91.38%)
- 中东布病流行图：沙特/伊拉克/伊朗血清阳性率数据

**Quiz:**
- 5 MCQ (S2 vs Rev.1适用场景、DIVA原理、妊娠安全性变量)
- 1 Case: 某中东国家农业部询价，描述其羊群基本情况，
  推荐S2还是Rev.1，并说明注册策略

---

### M4: 山羊痘与LSD异源免疫 (Capripoxvirus & LSD Cross-Protection)
Route: /capripoxvirus

**Principle Tab:**
- 痘病毒科羊痘病毒属：LSDV/GTPV/SPPV的96-97%核苷酸同源性
- P32蛋白(ORF074)与L1R类似物(ORF060)的跨物种保守性
- 异源免疫机制：共同抗原决定簇→交叉中和抗体→IFNγ细胞应答
- 关键数据：山羊痘疫苗(GTPV)提供完全保护，绵羊痘疫苗(SPPV)保护不足
- 剂量换算：牛体重远超山羊→推荐接种量=山羊剂量×3（印度Uttarkashi株临床数据）
- Key insight: 泰国BSTS模型显示大规模接种后新发病例降幅达78-119%

**Visual Tab: LSDSpreadMap.tsx** (Mapbox GL JS)
- 全球地图底图（暗色主题）
- 时间轴滑块：2012→2015→2019→2020→2021→2024
- 热力图层：每年新增疫区国家高亮（非洲→中东→巴尔干→高加索→南亚→东南亚）
- 点击国家：弹出卡片（首次确诊年份/经济损失/疫苗政策）
- 覆盖层：澳龙山羊痘疫苗出口路线（中国→老挝2021/柬埔寨2022）

**Mechanism Tab: CapripoxPhylogeny.tsx** (D3 radial tree)
- 放射状系统发育树：痘病毒科→羊痘病毒属→LSDV/GTPV/SPPV分支
- 节点展开：每个病毒的关键保守蛋白(P32/L1R)标注
- 点击P32节点：展示间接ELISA系统（敏感性94%/特异性96.6%）的技术框架
- 基因组共线性可视化：三种病毒的核心基因排列对比

**Regulatory Tab:**
- 各国LSD紧急使用授权(EUA)机制对比（泰国/印尼/越南）
- 山羊痘疫苗以"LSD预防"标签注册的监管挑战（需要额外效力数据）
- 泰国DLD/印尼BBPMSOH/越南DAH的进口许可证申请流程
- 本土大型进口商清单（PT. Swadesi/SHS International/Olmix Asialand等）

**Market Tab:**
- 东南亚LSD经济损失数据（越南/泰国/印尼牛群受损）
- 竞品分析：AVAC LSD LIVE（越南本土）vs Neethling株（南非）vs 澳龙山羊痘
- 渠道商矩阵：越南(AVAC/Olmix) / 印尼(BBPMSOH→进口商) / 泰国(DLD/Union Castap)
- 从外援出口向商业销售转型的路径图

**Quiz:**
- 5 MCQ (痘病毒同源性数据、剂量换算逻辑、EUA机制)
- 1 Case: 印尼爆发LSD，农业部询问是否采购山羊痘疫苗，
  分析法规可行性和注册路径

---

### M5: 兽药注册法规 (Regulatory Affairs / RA)
Route: /regulatory-ra

**Principle Tab:**
- VICH指南体系概览（GL1-GL59，分析/稳定性/安全性/效力/联苗5大类）
- CTD/vNees五大模块逻辑框架
- 中国GMP证书+CPP自由销售证明的国际法律效力
- eCTD格式化的工作量评估（实验室数据重构成本）

**Visual Tab: CTDNavigator.tsx** (D3 interactive tree)
- SFDA vNees四大Part的交互式结构导航器
- 展开每个Part的子模块（对应上文技术报告中的详细内容）
- 点击节点：右侧显示该模块的典型文档列表和澳龙现有数据状态评估
  （绿色=数据完备/黄色=需补充/红色=缺失）
- 底部：关键路径图（从现有数据到完成SFDA申报的预估工期）

**Mechanism Tab: VICHMatrix.tsx** (D3 heatmap)
- 行：VICH关键指南（GL1,GL2,GL3,GL4,GL27,GL41,GL50,GL59）
- 列：澳龙三大产品（EG95/S2-A19/山羊痘）
- 每格颜色：绿=已满足/黄=部分满足/红=需要额外研究
- 点击每格：显示具体的合规要求和数据缺口说明

**Regulatory Tab:**
- P3实验室国际认证路径（WHO标准/ISO 35001/CDC-NIH BMBL）
- 澳龙自建P3设施现状分析（1,600万美元级投入的壁垒）
- 第三方PIC/S认证飞检流程

**Market Tab:**
- 目标市场监管难度矩阵（东南亚5国 vs 中东3国）
- 注册时间轴对比（快速通道 vs 全面新药申请）
- RA团队建设成本估算（内部 vs 外包CRO）

**Quiz:**
- 5 MCQ (VICH指南编号与内容、CTD模块结构、DIVA要求)
- 1 Case: 给定一款减毒活疫苗的现有中国注册档案，
  评估哪些数据可以直接用于SFDA申报，哪些需要重新生成

---

### M6: 市场竞争格局 (Market Strategy)
Route: /market-strategy

**Principle Tab:**
- 全球动保市场集中度（前10巨头占71%市场份额）
- 跨国巨头战略盲区：资本逐利性→宠物赛道→反刍动物被边缘化
- 澳龙的错位竞争逻辑：低成本原核表达→下沉市场定价权→政府采购垄断

**Visual Tab: DCFModel.tsx** (D3 interactive)
- 亨通股份收购案的DCF拆解可视化
- 输入滑块：WACC(估算值)、终端增长率、三年利润承诺
- 输出：waterfall图（账面净资产→DCF增值→最终估值→40%对价）
- 敏感性分析表：WACC+1%时估值变化幅度

**Mechanism Tab:**
- B2G采购机制（政府强制免疫→单一来源招标→定价权）
- B2B大型牧场客户的采购决策树
- 出海三步走战略的风险-收益矩阵

**Regulatory Tab:**
- 一带一路援助出口→商业注册转化的法律框架
- 国际组织对接：WHO NTD项目/世界银行/盖茨基金会
- 在沙特/印尼设立Fill-and-Finish分装厂的可行性分析

**Market Tab:**
- 三大目标战区竞争格局：中东/东南亚/中亚非洲
- 渠道商绑定策略（皇室背景财阀 vs 本土动保巨头）
- 未来3年营收情景预测（乐观/基准/悲观）

**Quiz:**
- 5 MCQ (竞争格局、出海路径、DCF逻辑)
- 1 Case: 某东南亚国家政府招标LSD疫苗，
  制定竞标策略（产品定位/注册方案/渠道合作/价格策略）

---

## Design System
- Primary color: Teal-600 (#0D9488) — 区别于 med-device (Blue) 和 bio-foundation (Purple)
- Accent: Emerald-500 for efficacy data, Amber-500 for risk/warning
- Background: Dark default (科学/医疗美学), supports light mode
- Font: Inter (next/font/google)
- Tab active: border-b-2 border-teal-600 + font-semibold

---

## Build Constraints
- npm run build MUST produce zero errors
- All 6 module routes MUST return HTTP 200
- No `use client` unless browser API required
- Mapbox token stored in .env.local as NEXT_PUBLIC_MAPBOX_TOKEN
- All external API calls (PDB, PubChem) have error handling + loading states
- Console: zero errors in production

---

## Files to COPY from bio-foundation (after audit completes)
- src/components/bio/viewers/MolstarViewer.tsx
- src/components/bio/viewers/MoleculeCard.tsx
- src/components/bio/animations/ProteinFolding.tsx → adapt for EG95
- src/components/bio/animations/EnzymeBinding.tsx → adapt for antigen-antibody
- src/hooks/useMoleculeData.ts
- src/lib/api/pdb.ts
- src/lib/api/pubchem.ts

## Files to COPY from med-device-foundation (after audit completes)
- src/components/ui/TabGroup.tsx
- src/components/ui/BilingualHeading.tsx
- src/components/ui/FormulaBlock.tsx
- src/components/ui/AnalogyBox.tsx
- src/components/ui/Card.tsx
- src/components/ui/ThemeToggle.tsx
- src/lib/utils/cn.ts

## Files requiring MAPBOX setup (new dependency)
- npm install mapbox-gl @types/mapbox-gl
- Add to next.config.ts: transpilePackages: ['mapbox-gl']
- LSDSpreadMap.tsx uses NEXT_PUBLIC_MAPBOX_TOKEN env var

---

## Execution Order
1. Stage A: Copy shared components from bio-foundation + med-device-foundation
2. Stage B: Initialize project with npx create-next-app@latest --webpack --typescript --tailwind --app
3. Stage C: Build root layout + Navigation + ThemeToggle + TabGroup
4. Stage D: Build M1 (bio-foundation module) as full template with all 6 tabs
5. Stage E: Build M2-M6 following M1 pattern, module-specific content
6. Stage F: Build all 10 visualization components (low→medium→high complexity)
   Low: StrainComparison (D3 radar), VICHMatrix (D3 heatmap), BCRModel (D3)
   Medium: EG95LifeCycle (D3 force), CapripoxPhylogeny (D3), CTDNavigator (D3)
   High: BrucellaEvasion (R3F), LinkerDesign (Framer Motion), LSDSpreadMap (Mapbox), DCFModel (D3)
7. Stage G: npm run build, verify zero errors, deploy to Vercel
