// Re-export shared types used by tab components
export type { GlossaryTerm } from '@/lib/types/glossary';
export type { MCQuestion, CaseBasedQuestion } from '@/lib/types/quiz';

export interface FormulaItem {
  latex: string;
  label?: string;
}

export interface AnalogyItem {
  text?: string;
  content?: string;
  icon?: string;
}

export interface PrincipleSection {
  id: string;
  headingZH: string;
  headingEN: string;
  content: string;
  formulas: FormulaItem[];
  analogies: AnalogyItem[];
  keyPoints: string[];
}
