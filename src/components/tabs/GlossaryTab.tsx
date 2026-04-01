'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { GlossaryTerm } from '@/lib/types/chapter';
import { cn } from '@/lib/utils';

interface GlossaryTabProps {
  terms: GlossaryTerm[];
}

export function GlossaryTab({ terms }: GlossaryTabProps) {
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'alpha' | 'category'>('alpha');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    let result = terms.filter(
      (t) =>
        !q ||
        t.termEN.toLowerCase().includes(q) ||
        t.termZH.includes(q) ||
        t.definition.toLowerCase().includes(q)
    );
    if (sortBy === 'alpha') {
      result = [...result].sort((a, b) => a.termEN.localeCompare(b.termEN));
    } else {
      result = [...result].sort((a, b) =>
        (a.category || '').localeCompare(b.category || '')
      );
    }
    return result;
  }, [terms, query, sortBy]);

  const categories = useMemo(
    () => [...new Set(terms.map((t) => t.category).filter(Boolean))],
    [terms]
  );

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="搜索术语 / Search terms…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
        <div className="flex gap-2">
          {(['alpha', 'category'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                sortBy === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300'
              )}
            >
              {s === 'alpha' ? '字母排序' : '按分类'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <p className="text-xs text-gray-400 dark:text-slate-500">
        显示 {filtered.length} / {terms.length} 条术语
        {categories.length > 0 && ` · 分类：${categories.join(' · ')}`}
      </p>

      {/* Terms table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-800">
            <tr>
              {['英文术语', '中文术语', '分类', ''].map((h, i) => (
                <th key={i} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-slate-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white dark:divide-slate-700/50 dark:bg-slate-900">
            {filtered.map((term) => (
              <React.Fragment key={term.id}>
                <tr
                  onClick={() => setExpandedId(expandedId === term.id ? null : term.id)}
                  className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-slate-100">
                    {term.termEN}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-slate-300">{term.termZH}</td>
                  <td className="px-4 py-3">
                    {term.category && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-slate-700 dark:text-slate-300">
                        {term.category}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {expandedId === term.id ? '▲' : '▼'}
                  </td>
                </tr>
                {expandedId === term.id && (
                  <tr className="bg-blue-50/50 dark:bg-blue-950/10">
                    <td colSpan={4} className="px-4 py-3 text-sm leading-6 text-gray-700 dark:text-slate-300">
                      {term.definition}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-400">
            无匹配术语 · No matching terms
          </div>
        )}
      </div>
    </div>
  );
}
