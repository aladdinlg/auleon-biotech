import type { ChapterDefinition, LearningProgressState, PubChemCompoundSummary } from "@/lib/types";

export const LEARNING_PROGRESS_KEY = "auleon_biotech_progress";

export const CHAPTERS: ChapterDefinition[] = [
  {
    id: "m1",
    order: 1,
    href: "/bio-foundation",
    title: "兽用生物制品基础",
    titleEn: "Veterinary Biologics Foundation",
    description: "疫苗分类体系、免疫应答双通路、原核与真核表达系统对比。",
    duration: "30 分钟",
    icon: "hexagon",
    available: true,
    totalSections: 6,
  },
  {
    id: "m2",
    order: 2,
    href: "/eg95-vaccine",
    title: "EG95亚单位疫苗",
    titleEn: "EG95 Subunit Vaccine",
    description: "细粒棘球绦虫生命周期、EG95抗原工程、串联表达技术。",
    duration: "35 分钟",
    icon: "helix",
    available: true,
    totalSections: 6,
  },
  {
    id: "m3",
    order: 3,
    href: "/brucellosis",
    title: "布鲁氏菌病疫苗",
    titleEn: "Brucellosis Vaccine Series",
    description: "胞内菌免疫逃逸机制、S2/A19/Rev.1/BA0711毒株比较、DIVA技术。",
    duration: "32 分钟",
    icon: "protein",
    available: true,
    totalSections: 6,
  },
  {
    id: "m4",
    order: 4,
    href: "/capripoxvirus",
    title: "山羊痘与LSD疫苗",
    titleEn: "Capripoxvirus & LSD Cross-Protection",
    description: "羊痘病毒同源性、异源免疫保护机制、全球LSD疫情扩散。",
    duration: "30 分钟",
    icon: "spark",
    available: true,
    totalSections: 6,
  },
  {
    id: "m5",
    order: 5,
    href: "/regulatory-ra",
    title: "兽药注册法规",
    titleEn: "Regulatory Affairs / RA",
    description: "VICH指南体系、CTD/vNees结构、SFDA注册路径、BSL-3要求。",
    duration: "35 分钟",
    icon: "target",
    available: true,
    totalSections: 6,
  },
  {
    id: "m6",
    order: 6,
    href: "/market-strategy",
    title: "市场竞争格局",
    titleEn: "Market Strategy",
    description: "全球动保市场格局、澳龙错位竞争逻辑、出海战略与DCF估值。",
    duration: "28 分钟",
    icon: "hexagon",
    available: true,
    totalSections: 6,
  },
];

export const INITIAL_PROGRESS_STATE: LearningProgressState = {
  chapters: {},
};

export const MOLECULE_OF_THE_DAY_FALLBACKS: PubChemCompoundSummary[] = [
  {
    cid: 2244,
    title: "Aspirin",
    formula: "C9H8O4",
    molecularWeight: 180.16,
    iupacName: "2-acetyloxybenzoic acid",
  },
  {
    cid: 2519,
    title: "Caffeine",
    formula: "C8H10N4O2",
    molecularWeight: 194.19,
    iupacName: "1,3,7-trimethylpurine-2,6-dione",
  },
  {
    cid: 5793,
    title: "D-Glucose",
    formula: "C6H12O6",
    molecularWeight: 180.16,
    iupacName: "(3R,4S,5S,6R)-6-(hydroxymethyl)oxane-2,3,4,5-tetrol",
  },
];
