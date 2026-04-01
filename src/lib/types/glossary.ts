export interface GlossaryTerm {
  id: string;
  termEN: string;
  termZH: string;
  definition: string;
  category?: string;
  relatedChapterIds?: string[];
}
