"use client";

import { useCallback, useEffect, useState } from "react";

import { CHAPTERS, INITIAL_PROGRESS_STATE, LEARNING_PROGRESS_KEY } from "@/lib/constants";
import type { LearningProgressState } from "@/lib/types";

function readProgress(): LearningProgressState {
  if (typeof window === "undefined") {
    return INITIAL_PROGRESS_STATE;
  }

  const stored = window.localStorage.getItem(LEARNING_PROGRESS_KEY);

  if (!stored) {
    return INITIAL_PROGRESS_STATE;
  }

  try {
    const parsed = JSON.parse(stored) as LearningProgressState;
    return parsed.chapters ? parsed : INITIAL_PROGRESS_STATE;
  } catch {
    return INITIAL_PROGRESS_STATE;
  }
}

interface UseLearningProgressReturn {
  hydrated: boolean;
  progress: LearningProgressState;
  markSectionComplete: (chapterId: string, sectionId: string) => void;
  setQuizScore: (chapterId: string, score: number, total: number) => void;
  getChapterProgress: (chapterId: string) => number;
  overallProgress: number;
}

export function useLearningProgress(): UseLearningProgressReturn {
  const [progress, setProgress] = useState<LearningProgressState>(INITIAL_PROGRESS_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setProgress(readProgress());
      setHydrated(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(LEARNING_PROGRESS_KEY, JSON.stringify(progress));
  }, [hydrated, progress]);

  const markSectionComplete = useCallback(function markSectionComplete(chapterId: string, sectionId: string): void {
    setProgress((current) => {
      const chapter = current.chapters[chapterId] ?? {
        completedSections: [],
        quizBestScore: 0,
        quizTotal: 0,
        lastVisitedAt: null,
      };

      const completedSections = chapter.completedSections.includes(sectionId)
        ? chapter.completedSections
        : [...chapter.completedSections, sectionId];

      return {
        chapters: {
          ...current.chapters,
          [chapterId]: {
            ...chapter,
            completedSections,
            lastVisitedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const setQuizScore = useCallback(function setQuizScore(chapterId: string, score: number, total: number): void {
    setProgress((current) => {
      const chapter = current.chapters[chapterId] ?? {
        completedSections: [],
        quizBestScore: 0,
        quizTotal: total,
        lastVisitedAt: null,
      };

      return {
        chapters: {
          ...current.chapters,
          [chapterId]: {
            ...chapter,
            quizBestScore: Math.max(chapter.quizBestScore, score),
            quizTotal: total,
            lastVisitedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const getChapterProgress = useCallback(function getChapterProgress(chapterId: string): number {
    const chapterDefinition = CHAPTERS.find((chapter) => chapter.id === chapterId);

    if (!chapterDefinition) {
      return 0;
    }

    const chapter = progress.chapters[chapterId];

    if (!chapter) {
      return 0;
    }

    const sectionRatio = chapter.completedSections.length / chapterDefinition.totalSections;
    const quizRatio =
      chapter.quizTotal > 0 ? chapter.quizBestScore / chapter.quizTotal : chapter.completedSections.length > 0 ? 0.25 : 0;

    return Math.min(100, (sectionRatio * 0.75 + quizRatio * 0.25) * 100);
  }, [progress]);

  const overallProgress =
    CHAPTERS.reduce((total, chapter) => total + getChapterProgress(chapter.id), 0) / CHAPTERS.length;

  return {
    hydrated,
    progress,
    markSectionComplete,
    setQuizScore,
    getChapterProgress,
    overallProgress,
  };
}
