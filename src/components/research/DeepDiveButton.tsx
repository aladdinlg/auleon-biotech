'use client';

import { useState } from 'react';
import { ManualAdapter } from '@/lib/research/adapters';
import type { PaperReference } from '@/lib/research/types';

interface Props {
  chapterId: string;
  keywords: string[];
  label?: string;
}

export function DeepDiveButton({ chapterId, keywords, label = '深入研究' }: Props) {
  const [papers, setPapers] = useState<PaperReference[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!open && papers.length === 0) {
      setLoading(true);
      const adapter = new ManualAdapter();
      const results = await adapter.search({ chapterId, keywords });
      setPapers(results);
      setLoading(false);
    }
    setOpen(!open);
  };

  return (
    <div className="inline-block">
      <button
        onClick={handleClick}
        className="flex items-center gap-1 text-sm text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
      >
        📚 {label}
      </button>
      {open && (
        <div className="mt-2 rounded-lg bg-slate-50 p-4 text-sm dark:bg-slate-800">
          <h4 className="mb-2 font-semibold text-gray-900 dark:text-slate-100">
            相关文献 Related Papers
          </h4>
          {loading && <p className="text-gray-400">Loading…</p>}
          {!loading && papers.length === 0 && (
            <p className="text-gray-400">No papers found.</p>
          )}
          <ul className="space-y-2">
            {papers.map((p) => (
              <li key={p.id}>
                <a
                  href={p.url || `https://doi.org/${p.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {p.title}
                </a>
                <span className="ml-2 text-gray-500">({p.year})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
