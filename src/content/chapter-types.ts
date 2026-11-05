import type { Localized, Level } from "@/lib/types";
export type TeachingSection = {
  id: string;
  title: Localized;
  level: Level;
  paragraphs: Localized[];
  analogy?: Localized;
};
export type WorkedExample = {
  id: string;
  title: Localized;
  setup: Localized;
  code: string;
  output: Localized;
  steps: Localized[];
  takeaway: Localized;
};
export type InterviewQuestion = {
  id: string;
  level: Level;
  question: Localized;
  why: Localized;
  answer: Localized;
  wrong: Localized;
  followup: Localized;
  followupAnswer: Localized;
};
export type DebugCase = {
  title: Localized;
  broken: string;
  failure: Localized;
  fixed: string;
  why: Localized;
  test: Localized;
};
export type Chapter = {
  sources?: TeachingSource[];
  syllabusCoverage?: Record<string, string>;
  topicId: string;
  objectives: Localized[];
  sections: TeachingSection[];
  examples: WorkedExample[];
  debug: DebugCase;
  interviews: InterviewQuestion[];
  exercise: {
    prompt: Localized;
    hints: Localized[];
    solution: string;
    reasoning: Localized;
    checks: Localized[];
  };
  prerequisiteNote: Localized;
};

export type TeachingSource = {
  id: string;
  title: string;
  url: string;
  role:
    | "official-language"
    | "official-design"
    | "official-framework"
    | "historical-community"
    | "community-discussion";
  status: "reviewed-source" | "reference-link";
  revision: string | null;
  accessedAt: string | null;
  publishedYear: number | null;
  supports: Localized;
  qualification: Localized;
};
