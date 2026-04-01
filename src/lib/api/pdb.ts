import type { PdbSearchResult, ProteinMetadata } from "@/lib/types";

interface RcsbEntryPayload {
  entry?: {
    id?: string;
  };
  struct?: {
    title?: string;
  };
  exptl?: Array<{
    method?: string;
  }>;
  rcsb_accession_info?: {
    initial_release_date?: string;
  };
  struct_keywords?: {
    text?: string;
  };
  rcsb_entry_info?: {
    molecular_weight?: number;
    resolution_combined?: number[];
  };
}

interface RcsbSearchPayload {
  result_set?: Array<{
    identifier: string;
    score: number;
  }>;
}

async function fetchRcsbJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    next: {
      revalidate: 86400,
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`RCSB 请求失败：${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export async function fetchProteinMetadata(pdbId: string): Promise<ProteinMetadata> {
  const normalizedId = pdbId.toUpperCase();
  const payload = await fetchRcsbJson<RcsbEntryPayload>(
    `https://data.rcsb.org/rest/v1/core/entry/${normalizedId}`,
  );

  return {
    pdbId: payload.entry?.id ?? normalizedId,
    title: payload.struct?.title ?? "Unknown Protein",
    experimentalMethod: payload.exptl?.[0]?.method ?? "Unknown",
    resolution: payload.rcsb_entry_info?.resolution_combined?.[0] ?? null,
    releaseDate: payload.rcsb_accession_info?.initial_release_date ?? null,
    keywords: payload.struct_keywords?.text ?? "",
    molecularWeight: payload.rcsb_entry_info?.molecular_weight ?? null,
  };
}

export function getProteinStructureUrl(pdbId: string): string {
  return `https://files.rcsb.org/download/${pdbId.toUpperCase()}.cif`;
}

export async function searchProteinByName(query: string): Promise<PdbSearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  const payload = {
    query: {
      type: "terminal",
      service: "text",
      parameters: {
        attribute: "struct.title",
        operator: "contains_phrase",
        value: query,
      },
    },
    request_options: {
      return_all_hits: false,
      pager: {
        start: 0,
        rows: 8,
      },
    },
    return_type: "entry",
  };

  const url = `https://search.rcsb.org/rcsbsearch/v2/query?json=${encodeURIComponent(
    JSON.stringify(payload),
  )}`;
  const response = await fetchRcsbJson<RcsbSearchPayload>(url);

  return (response.result_set ?? []).map((result) => ({
    pdbId: result.identifier,
    score: result.score,
  }));
}
