export interface MCQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number | number[];
  explanation: string;
  relatedSectionId?: string;
}

export interface CaseBasedQuestion {
  id: string;
  caseDescription: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  relatedSectionId?: string;
}

export interface QuizState {
  answers: Record<string, number | number[] | string>;
  submitted: Record<string, boolean>;
  score: number;
  total: number;
}
