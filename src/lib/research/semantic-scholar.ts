// Phase 2 implementation — placeholder in Phase 1
import type { ResearchAdapter, ResearchQuery, PaperReference } from './types';

const SS_BASE = 'https://api.semanticscholar.org/graph/v1';

export class SemanticScholarAdapter implements ResearchAdapter {
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  async search(query: ResearchQuery): Promise<PaperReference[]> {
    const params = new URLSearchParams({
      query: query.keywords.join(' '),
      limit: '20',
      fields: 'paperId,title,authors,year,journal,abstract,citationCount,externalIds',
    });

    if (query.filters?.yearFrom) {
      params.set('year', `${query.filters.yearFrom}-`);
    }
    if (query.filters?.fieldsOfStudy) {
      params.set('fieldsOfStudy', query.filters.fieldsOfStudy.join(','));
    }

    const headers: Record<string, string> = {};
    if (this.apiKey) headers['x-api-key'] = this.apiKey;

    const res = await fetch(`${SS_BASE}/paper/search?${params}`, { headers });
    const data = await res.json();
    return (data.data ?? []).map(this.mapPaper);
  }

  async getDetails(paperId: string): Promise<PaperReference | null> {
    const fields =
      'paperId,title,authors,year,journal,abstract,citationCount,externalIds,citations,references';
    const res = await fetch(`${SS_BASE}/paper/${paperId}?fields=${fields}`);
    if (!res.ok) return null;
    return this.mapPaper(await res.json());
  }

  async getRelated(paperId: string): Promise<PaperReference[]> {
    const res = await fetch(
      `https://api.semanticscholar.org/recommendations/v1/papers/forpaper/${paperId}?limit=5&fields=paperId,title,authors,year,journal,abstract`
    );
    const data = await res.json();
    return (data.recommendedPapers ?? []).map(this.mapPaper);
  }

  async getCitations(paperId: string): Promise<PaperReference[]> {
    const res = await fetch(
      `${SS_BASE}/paper/${paperId}/citations?limit=10&fields=paperId,title,authors,year`
    );
    const data = await res.json();
    return (data.data ?? []).map((d: { citingPaper: Record<string, unknown> }) =>
      this.mapPaper(d.citingPaper)
    );
  }

  private mapPaper(raw: Record<string, unknown>): PaperReference {
    return {
      id: raw.paperId as string,
      title: raw.title as string,
      authors: ((raw.authors as Array<{ name: string }>) || []).map(
        (a) => a.name
      ),
      journal:
        ((raw.journal as { name?: string }) || {}).name || '',
      year: (raw.year as number) || 0,
      doi:
        ((raw.externalIds as { DOI?: string }) || {}).DOI || '',
      url: `https://www.semanticscholar.org/paper/${raw.paperId as string}`,
      abstract: raw.abstract as string | undefined,
      citationCount: raw.citationCount as number | undefined,
      source: 'semantic-scholar',
      chapterIds: [],
    };
  }
}
