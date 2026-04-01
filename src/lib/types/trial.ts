export interface TrialCase {
  id: string;
  name: string;
  type: 'RCT' | 'cohort' | 'meta-analysis' | 'registry';
  device: string;
  comparator: string;
  sampleSize: number;
  primaryEndpoint: string;
  keyResult: string;
  engineeringInsight: string;
  controversies?: string;
  relatedChapterLinks: ChapterLink[];
}

export interface ChapterLink {
  chapterId: string;
  sectionId: string;
  label: string;
}

export interface ClinicalCase {
  id: string;
  title: string;
  events: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  engineeringPrinciple?: string;
  complicationBranches?: ComplicationOption[];
}

export interface ComplicationOption {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  presentation: string;
  scientificBasis: string;
  management: string;
  relatedSectionId?: string;
}

export interface RegulatoryCase {
  id: string;
  title: string;
  pathway: string;
  summary: string;
  keyDecisions: string[];
  outcome: string;
  regulatoryBody?: 'SFDA' | 'VICH' | 'NMPA' | 'EMA';
  vichGuidelineRef?: string;
}
