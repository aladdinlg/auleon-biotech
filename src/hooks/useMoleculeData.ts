"use client";

import { useEffect, useState } from "react";

import { fetchCompoundByCID, fetchCompoundByName } from "@/lib/api/pubchem";
import type { PubChemCompoundSummary } from "@/lib/types";

interface UseMoleculeDataOptions {
  cid?: number | null;
  name?: string;
}

interface UseMoleculeDataReturn {
  data: PubChemCompoundSummary | null;
  isLoading: boolean;
  error: string | null;
}

export function useMoleculeData({ cid, name }: UseMoleculeDataOptions): UseMoleculeDataReturn {
  const [data, setData] = useState<PubChemCompoundSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load(): Promise<void> {
      if (!cid && !name) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const summary = cid ? await fetchCompoundByCID(cid) : await fetchCompoundByName(name ?? "");

        if (!active) {
          return;
        }

        setData(summary);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "获取分子数据失败。");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [cid, name]);

  return { data, isLoading, error };
}
