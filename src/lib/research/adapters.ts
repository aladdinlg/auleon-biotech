import type { ResearchAdapter, ResearchQuery, PaperReference } from './types';

// Phase 1: Static data from JSON files
export class ManualAdapter implements ResearchAdapter {
  private papers: PaperReference[];

  constructor() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      this.papers = require('@/lib/data/references.json');
    } catch {
      this.papers = [];
    }
  }

  async search(query: ResearchQuery): Promise<PaperReference[]> {
    let results = this.papers;

    if (query.chapterId) {
      results = results.filter((p) => p.chapterIds.includes(query.chapterId!));
    }

    if (query.keywords.length > 0) {
      const kw = query.keywords.map((k) => k.toLowerCase());
      results = results.filter((p) =>
        kw.some(
          (k) =>
            p.title.toLowerCase().includes(k) ||
            (p.abstract?.toLowerCase().includes(k) ?? false)
        )
      );
    }

    if (query.filters?.yearFrom) {
      results = results.filter((p) => p.year >= query.filters!.yearFrom!);
    }

    return results.slice(0, 20);
  }

  async getDetails(paperId: string): Promise<PaperReference | null> {
    return this.papers.find((p) => p.id === paperId) ?? null;
  }

  async getRelated(paperId: string): Promise<PaperReference[]> {
    const paper = this.papers.find((p) => p.id === paperId);
    if (!paper) return [];
    return this.papers
      .filter(
        (p) =>
          p.id !== paperId &&
          p.chapterIds.some((c) => paper.chapterIds.includes(c))
      )
      .slice(0, 5);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getCitations(_paperId: string): Promise<PaperReference[]> {
    return []; // Not available in manual mode
  }
}

// Phase 2 placeholders:
// export class SemanticScholarAdapter implements ResearchAdapter { ... }
// export class NotionAdapter implements ResearchAdapter { ... }
