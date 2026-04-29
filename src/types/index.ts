export interface Question {
  id: string;
  year: string;
  yearLabel: string;
  group: number;
  groupLabel: string;
  number: number;
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
  image?: string;
  choiceImage?: string;
  explanationImage?: string;
  tags?: string[];
  source?: string;
}

export type QuizMode = "year" | "group" | "random";

export interface QuizSession {
  questions: Question[];
  currentIndex: number;
  answers: (number | null)[];
  mode: QuizMode;
  filterLabel: string;
}

export interface QuizResult {
  question: Question;
  userAnswer: number | null;
  isCorrect: boolean;
}
