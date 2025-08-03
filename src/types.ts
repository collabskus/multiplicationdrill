export interface Problem {
  a: number;
  b: number;
}

export type QuizPhase = 'idle' | 'question' | 'answer';

export type DifficultyLevel = 1 | 2 | 3 | 4;

export interface DifficultyRange {
  min: number;
  max: number;
}

export interface Settings {
  questionTime: number;
  answerTime: number;
  difficulty: DifficultyLevel;
  autoUpdate: boolean;
}

export interface AppState {
  counter: number;
  seed: number;
  questionTime: number;
  answerTime: number;
  difficulty: DifficultyLevel;
  isQuizActive: boolean;
  currentPhase: QuizPhase;
  timeRemaining: number;
  autoUpdateEnabled: boolean;
  currentProblem: Problem;
}