'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { MCQuestion, CaseBasedQuestion } from '@/lib/types/quiz';
import { cn } from '@/lib/utils';

interface QuizTabProps {
  chapterId: string;
  mcq: MCQuestion[];
  caseBased: CaseBasedQuestion[];
}

const STORAGE_KEY = (chapterId: string) => `auleon_quiz_${chapterId}`;

interface QuizRecord {
  mcqAnswers: Record<string, number>;
  mcqSubmitted: Record<string, boolean>;
  cbAnswers: Record<string, string>;
  cbSubmitted: Record<string, boolean>;
}

function loadRecord(chapterId: string): QuizRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(chapterId));
    return raw ? JSON.parse(raw) : { mcqAnswers: {}, mcqSubmitted: {}, cbAnswers: {}, cbSubmitted: {} };
  } catch {
    return { mcqAnswers: {}, mcqSubmitted: {}, cbAnswers: {}, cbSubmitted: {} };
  }
}

export function QuizTab({ chapterId, mcq, caseBased }: QuizTabProps) {
  const [record, setRecord] = useState<QuizRecord>({
    mcqAnswers: {}, mcqSubmitted: {}, cbAnswers: {}, cbSubmitted: {},
  });
  const [mounted, setMounted] = useState(false);
  const [expandedCB, setExpandedCB] = useState<string | null>(null);

  useEffect(() => {
    setRecord(loadRecord(chapterId));
    setMounted(true);
  }, [chapterId]);

  function saveRecord(next: QuizRecord) {
    setRecord(next);
    try { localStorage.setItem(STORAGE_KEY(chapterId), JSON.stringify(next)); } catch {}
  }

  function selectMCQ(qId: string, idx: number) {
    if (record.mcqSubmitted[qId]) return;
    saveRecord({ ...record, mcqAnswers: { ...record.mcqAnswers, [qId]: idx } });
  }

  function submitMCQ(qId: string) {
    if (record.mcqAnswers[qId] === undefined) return;
    saveRecord({ ...record, mcqSubmitted: { ...record.mcqSubmitted, [qId]: true } });
  }

  function submitCB(qId: string, answer: string) {
    saveRecord({ ...record, cbAnswers: { ...record.cbAnswers, [qId]: answer }, cbSubmitted: { ...record.cbSubmitted, [qId]: true } });
  }

  const mcqCorrect = mcq.filter((q) => {
    if (!record.mcqSubmitted[q.id]) return false;
    const correct = typeof q.correctIndex === 'number' ? q.correctIndex : (Array.isArray(q.correctIndex) ? q.correctIndex[0] : 0);
    return record.mcqAnswers[q.id] === correct;
  }).length;

  const mcqDone = Object.values(record.mcqSubmitted).filter(Boolean).length;

  if (!mounted) return <div className="h-64 animate-pulse rounded-xl bg-gray-100 dark:bg-slate-800" />;

  return (
    <div className="space-y-10">
      {/* Score summary */}
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 dark:from-blue-950/40 dark:to-indigo-950/40">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-slate-300">多选题进度</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {mcqCorrect} <span className="text-base font-normal text-gray-400">/ {mcq.length} 正确</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-slate-400">已作答 {mcqDone}/{mcq.length}</p>
          {mcqDone > 0 && (
            <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              {Math.round((mcqCorrect / mcqDone) * 100)}% 正确率
            </p>
          )}
        </div>
      </div>

      {/* MCQ */}
      <section>
        <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-slate-100">
          单选题 Multiple Choice
        </h2>
        <div className="space-y-6">
          {mcq.map((q, qi) => {
            const submitted = record.mcqSubmitted[q.id];
            const selected = record.mcqAnswers[q.id];
            const correct = typeof q.correctIndex === 'number' ? q.correctIndex : (Array.isArray(q.correctIndex) ? q.correctIndex[0] : 0);
            return (
              <div key={q.id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
                <p className="mb-4 text-sm font-medium text-gray-900 dark:text-slate-100">
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {qi + 1}
                  </span>
                  {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, idx) => {
                    const isSelected = selected === idx;
                    const isCorrect = idx === correct;
                    let style = 'border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600';
                    if (submitted) {
                      if (isCorrect) style = 'border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/40';
                      else if (isSelected) style = 'border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-950/40';
                      else style = 'border-gray-200 bg-gray-50 opacity-60 dark:border-slate-600 dark:bg-slate-700';
                    } else if (isSelected) {
                      style = 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/40';
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => selectMCQ(q.id, idx)}
                        disabled={submitted}
                        className={cn('flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors', style)}
                      >
                        <span className="mt-0.5 flex-shrink-0">
                          {submitted && isCorrect && <CheckCircle size={16} className="text-emerald-500" />}
                          {submitted && isSelected && !isCorrect && <XCircle size={16} className="text-red-500" />}
                          {(!submitted || (!isCorrect && !isSelected)) && (
                            <span className={cn('inline-flex h-4 w-4 items-center justify-center rounded-full border text-xs',
                              isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-400 text-gray-400'
                            )}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                          )}
                        </span>
                        <span className="text-gray-700 dark:text-slate-300">{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {!submitted ? (
                  <button
                    onClick={() => submitMCQ(q.id)}
                    disabled={selected === undefined}
                    className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40"
                  >
                    提交答案
                  </button>
                ) : (
                  <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm dark:bg-slate-900">
                    <p className="mb-1 font-medium text-gray-700 dark:text-slate-300">解析：</p>
                    <p className="leading-6 text-gray-600 dark:text-slate-400">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Case-based */}
      {caseBased.length > 0 && (
        <section>
          <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-slate-100">
            案例分析题 Case Analysis
          </h2>
          <div className="space-y-6">
            {caseBased.map((q) => {
              const submitted = record.cbSubmitted[q.id];
              const selected = record.cbAnswers[q.id];
              const isExpanded = expandedCB === q.id || submitted;
              return (
                <div key={q.id} className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-900 dark:bg-amber-950/20">
                  {/* Case description */}
                  <div className="mb-4 rounded-lg bg-white p-4 text-sm leading-7 text-gray-700 dark:bg-slate-800 dark:text-slate-300">
                    <p className="mb-2 text-xs font-semibold uppercase text-amber-600 dark:text-amber-400">病例 / Case</p>
                    <p className="whitespace-pre-line">{q.caseDescription}</p>
                  </div>
                  <p className="mb-4 font-medium text-gray-900 dark:text-slate-100">{q.question}</p>
                  {/* Options */}
                  {q.options && (
                    <div className="mb-4 space-y-2">
                      {q.options.map((opt, idx) => {
                        const letter = String.fromCharCode(65 + idx);
                        const isSelected = selected === letter;
                        const isCorrect = q.correctAnswer === letter;
                        let style = 'border-gray-200 bg-white hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700';
                        if (submitted) {
                          if (isCorrect) style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
                          else if (isSelected) style = 'border-red-400 bg-red-50 dark:bg-red-950/40';
                          else style = 'border-gray-200 bg-white opacity-50 dark:border-slate-600 dark:bg-slate-700';
                        } else if (isSelected) {
                          style = 'border-blue-500 bg-blue-50 dark:bg-blue-950/40';
                        }
                        return (
                          <button
                            key={letter}
                            disabled={submitted}
                            onClick={() => !submitted && saveRecord({ ...record, cbAnswers: { ...record.cbAnswers, [q.id]: letter } })}
                            className={cn('flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors', style)}
                          >
                            <span className="font-mono text-xs text-gray-500">{letter}.</span>
                            <span className="text-gray-700 dark:text-slate-300">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {!submitted ? (
                    <button
                      onClick={() => submitCB(q.id, selected || '')}
                      disabled={!selected}
                      className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-40"
                    >
                      提交分析
                    </button>
                  ) : (
                    <button
                      onClick={() => setExpandedCB(expandedCB === q.id ? null : q.id)}
                      className="flex items-center gap-1 text-sm text-amber-700 dark:text-amber-400"
                    >
                      参考解析 {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  )}
                  {submitted && isExpanded && (
                    <div className="mt-4 rounded-lg bg-white p-4 text-sm dark:bg-slate-800">
                      <p className="mb-2 text-xs font-semibold uppercase text-amber-600 dark:text-amber-400">参考解析</p>
                      <p className="whitespace-pre-line leading-7 text-gray-700 dark:text-slate-300">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
