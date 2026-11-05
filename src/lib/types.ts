export type Locale = "en" | "az";
export type Localized = { en: string; az: string };
export const bi = (en: string, az: string): Localized => ({ en, az });
export type Level = "junior" | "middle" | "senior";
export type Lesson = {
  id: string;
  title?: Localized;
  minutes: number;
  prerequisites: string[];
  intro: Localized;
  mechanism: Localized;
  judgment: Localized;
  code: string;
  predicted: string;
  trap: Localized;
  exercise: Localized;
  solution: Localized;
  question: Localized;
  choices: Localized[];
  correct: number;
  followup: Localized;
  source: string;
  sourceLabel: string;
};
export type Attempt = {
  id: string;
  topicId: string;
  questionId: string;
  correct: boolean;
  at: number;
  format: "choice" | "prediction" | "review";
};
export type Progress = {
  openedAt: number;
  readAt?: number;
  notes?: string;
  nextReview?: number;
  interval?: number;
};
export type InterviewTurn = {
  questionId: string;
  question: string;
  answer: string;
  modelAnswer: string;
  followup: string;
  scores: number[];
  at: number;
};
export type InterviewSession = {
  id: string;
  mode: string;
  level: Level;
  turns: InterviewTurn[];
  startedAt: number;
  endedAt?: number;
};
export type RepoFile = {
  path: string;
  hash: string;
  lines: number;
  imports: string[];
  declarations: string[];
};
export type RepoSnapshot = {
  schemaVersion: 1;
  repository: string;
  head: string;
  generatedAt: string;
  files: RepoFile[];
  modules: { id: string; files: string[]; dependencies: string[] }[];
  contributions: {
    commit: string;
    authorName: string;
    authorEmail: string;
    subject: string;
    date: string;
    files: string[];
  }[];
  authorFilter?: string;
};
export type State = {
  schemaVersion: 1;
  locale: Locale;
  theme: "dark" | "light";
  progress: Record<string, Progress>;
  attempts: Attempt[];
  sessions: InterviewSession[];
  lastTopic: string;
  ai?: {
    kind: "ollama" | "openai-compatible";
    endpoint: string;
    model: string;
  };
  report?: string;
  snapshot?: RepoSnapshot;
  privateNotes: Record<string, string>;
  playground?: string;
};
