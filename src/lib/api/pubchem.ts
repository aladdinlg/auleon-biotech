import { wait } from "@/lib/utils";
import type { PubChemCompoundSummary } from "@/lib/types";

interface PubChemNameLookupResponse {
  IdentifierList?: {
    CID?: number[];
  };
}

interface PubChemPropertyResponse {
  PropertyTable?: {
    Properties?: Array<{
      CID: number;
      Title?: string;
      MolecularFormula?: string;
      MolecularWeight?: string;
      IUPACName?: string;
    }>;
  };
}

async function fetchPubChemJson<T>(url: string): Promise<T> {
  await wait(200);
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: 86400,
    },
  });

  if (!response.ok) {
    throw new Error(`PubChem 请求失败：${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

async function fetchPubChemText(url: string): Promise<string> {
  await wait(200);
  const response = await fetch(url, {
    headers: {
      Accept: "text/plain",
    },
    next: {
      revalidate: 86400,
    },
  });

  if (!response.ok) {
    throw new Error(`PubChem 结构文件请求失败：${response.status} ${response.statusText}`);
  }

  return response.text();
}

function normalizePropertyResponse(
  payload: PubChemPropertyResponse,
  fallbackTitle: string,
): PubChemCompoundSummary {
  const property = payload.PropertyTable?.Properties?.[0];

  if (!property?.CID || !property.MolecularFormula || !property.MolecularWeight) {
    throw new Error("PubChem 属性返回不完整。");
  }

  return {
    cid: property.CID,
    title: property.Title ?? fallbackTitle,
    formula: property.MolecularFormula,
    molecularWeight: Number.parseFloat(property.MolecularWeight),
    iupacName: property.IUPACName ?? fallbackTitle,
  };
}

async function fetchCidByName(name: string): Promise<number> {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(
    name,
  )}/cids/JSON`;
  const payload = await fetchPubChemJson<PubChemNameLookupResponse>(url);
  const cid = payload.IdentifierList?.CID?.[0];

  if (!cid) {
    throw new Error(`未找到化合物：${name}`);
  }

  return cid;
}

export async function fetchCompoundByName(name: string): Promise<PubChemCompoundSummary> {
  const cid = await fetchCidByName(name);

  return fetchCompoundByCID(cid, name);
}

export async function fetchCompoundByCID(
  cid: number,
  fallbackTitle = "PubChem Compound",
): Promise<PubChemCompoundSummary> {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/Title,MolecularFormula,MolecularWeight,IUPACName/JSON`;
  const payload = await fetchPubChemJson<PubChemPropertyResponse>(url);

  return normalizePropertyResponse(payload, fallbackTitle);
}

export async function fetchCompound3DSDF(name: string): Promise<string> {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(
    name,
  )}/SDF?record_type=3d`;

  return fetchPubChemText(url);
}

export async function fetchCompound3DSDFByCID(cid: number): Promise<string> {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF?record_type=3d`;

  return fetchPubChemText(url);
}
