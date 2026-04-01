"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useLearningProgress } from "@/hooks/useLearningProgress";

interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface ChapterQuizProps {
  chapterId: string;
  questions: QuizQuestion[];
}

export function ChapterQuiz({ chapterId, questions }: ChapterQuizProps): React.JSX.Element {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const { setQuizScore, markSectionComplete } = useLearningProgress();

  const score = questions.reduce((total, question) => {
    return total + (answers[question.id] === question.answer ? 1 : 0);
  }, 0);

  function handleSubmit(): void {
    setSubmitted(true);
    setQuizScore(chapterId, score, questions.length);
    markSectionComplete(chapterId, "quiz");
  }

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <Card key={question.id}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">第 {index + 1} 题</p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">{question.prompt}</h3>
            </div>
            {submitted ? (
              <Badge
                className={
                  answers[question.id] === question.answer
                    ? "bg-emerald-400/15 text-emerald-300"
                    : "bg-rose-400/15 text-rose-300"
                }
              >
                {answers[question.id] === question.answer ? "答对" : "需复习"}
              </Badge>
            ) : null}
          </div>
          <div className="mt-5 grid gap-3">
            {question.options.map((option, optionIndex) => (
              <button
                key={option}
                type="button"
                aria-pressed={answers[question.id] === optionIndex}
                disabled={submitted}
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  answers[question.id] === optionIndex
                    ? "border-emerald-400/40 bg-emerald-400/10 text-foreground"
                    : "border-border/70 bg-muted/50 text-muted-foreground hover:border-border hover:bg-muted"
                } disabled:cursor-not-allowed disabled:opacity-70`}
                onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
              >
                {option}
              </button>
            ))}
          </div>
          {submitted ? <p className="mt-4 text-sm leading-7 text-muted-foreground">{question.explanation}</p> : null}
        </Card>
      ))}

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">提交测验</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              已完成 {Object.keys(answers).length} / {questions.length} 题
              {submitted ? ` · 当前得分 ${score}/${questions.length}` : ""}
            </p>
          </div>
          <Button onClick={handleSubmit}>计算得分并记录进度</Button>
        </div>
      </Card>
    </div>
  );
}
