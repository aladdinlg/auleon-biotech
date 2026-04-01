"use client";

import { useEffect, useState } from "react";

import { fetchProteinMetadata } from "@/lib/api/pdb";
import type { ProteinMetadata } from "@/lib/types";

interface UseProteinDataReturn {
  data: ProteinMetadata | null;
  isLoading: boolean;
  error: string | null;
}

export function useProteinData(pdbId?: string): UseProteinDataReturn {
  const [data, setData] = useState<ProteinMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load(): Promise<void> {
      if (!pdbId) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const metadata = await fetchProteinMetadata(pdbId);

        if (!active) {
          return;
        }

        setData(metadata);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "获取蛋白质元数据失败。");
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
  }, [pdbId]);

  return { data, isLoading, error };
}
