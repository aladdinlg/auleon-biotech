export interface ChapterDefinition {
  id: string;
  order: number;
  href: string;
  title: string;
  titleEn: string;
  description: string;
  duration: string;
  icon: string;
  available: boolean;
  totalSections: number;
}

export interface MoleculeRecord {
  id: string;
  name: string;
  nameCn: string;
  formula: string;
  molecularWeight: number;
  pubchemCID: number | null;
  category: "amino_acid" | "nucleotide" | "sugar" | "lipid" | "compound";
  description: string;
  drugRelevance: string;
  imageUrl: string;
  uniProtId?: string;
  pdbId?: string;
}

export interface AminoAcidRecord {
  threeLetterCode: string;
  oneLetterCode: string;
  name: string;
  nameCn: string;
  sideChainType: "nonpolar" | "polar" | "positive" | "negative";
  sideChainTypeCn: string;
  molecularWeight: number;
  pubchemCID: number;
  pKa: string;
  description: string;
  funFact: string;
}

export interface CodonRecord {
  codon: string;
  aminoAcid: string;
  aminoAcidCn: string;
  threeLetterCode: string;
  oneLetterCode: string;
  isStart: boolean;
  isStop: boolean;
}

export interface DrugTargetRecord {
  drugName: string;
  drugNameCn: string;
  targetName: string;
  targetNameCn: string;
  pdbId: string;
  pubchemCID: number | null;
  mechanism: string;
  diseaseArea: string;
}

export interface LearningChapterState {
  completedSections: string[];
  quizBestScore: number;
  quizTotal: number;
  lastVisitedAt: string | null;
}

export interface LearningProgressState {
  chapters: Record<string, LearningChapterState>;
}

export interface PubChemCompoundSummary {
  cid: number;
  title: string;
  formula: string;
  molecularWeight: number;
  iupacName: string;
}

export interface PdbSearchResult {
  pdbId: string;
  score: number;
}

export interface ProteinMetadata {
  pdbId: string;
  title: string;
  experimentalMethod: string;
  resolution: number | null;
  releaseDate: string | null;
  keywords: string;
  molecularWeight: number | null;
}

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
