// Phase 1: created. Phase 2: extended with live adapter implementations.

export interface PaperReference {
  id: string;                    // Semantic Scholar paperId or manual ID
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi: string;
  url?: string;
  abstract?: string;
  keyFindings?: string[];
  evidenceLevel?: EvidenceLevel;
  citationCount?: number;
  source: DataSource;
  chapterIds: string[];          // Related chapter IDs e.g. ['s06', 's08']
}

export type EvidenceLevel = 'I-A' | 'I-B' | 'II-A' | 'II-B' | 'III' | 'IV';
export type DataSource = 'manual' | 'scispace' | 'paperguide' | 'semantic-scholar' | 'pubmed' | 'notion';

export interface ResearchQuery {
  chapterId?: string;
  knowledgePointId?: string;
  keywords: string[];
  filters?: SearchFilters;
}

export interface SearchFilters {
  yearFrom?: number;
  yearTo?: number;
  studyType?: 'RCT' | 'meta-analysis' | 'cohort' | 'review' | 'case-report';
  minCitations?: number;
  fieldsOfStudy?: string[];
}

export interface ResearchAdapter {
  search(query: ResearchQuery): Promise<PaperReference[]>;
  getDetails(paperId: string): Promise<PaperReference | null>;
  getRelated(paperId: string): Promise<PaperReference[]>;
  getCitations(paperId: string): Promise<PaperReference[]>;
}
