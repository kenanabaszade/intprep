import { swiftChapters } from "./chapters-swift";
import { moreChapters } from "./chapters-more";
export type {
  Chapter,
  InterviewQuestion,
  WorkedExample,
  TeachingSection,
} from "./chapter-types";
export const chapters = [...swiftChapters, ...moreChapters];
export const chapterById = Object.fromEntries(
  chapters.map((c) => [c.topicId, c]),
);
export function chapterWordCount(topicId: string, locale: "en" | "az") {
  const c = chapterById[topicId];
  if (!c) return 0;
  return [
    c.prerequisiteNote[locale],
    ...c.objectives.map((x) => x[locale]),
    ...c.sections.flatMap((s) => [
      s.title[locale],
      ...s.paragraphs.map((p) => p[locale]),
      s.analogy?.[locale] || "",
    ]),
    ...c.examples.flatMap((e) => [
      e.setup[locale],
      ...e.steps.map((s) => s[locale]),
      e.takeaway[locale],
    ]),
    c.debug.failure[locale],
    c.debug.why[locale],
    ...c.interviews.flatMap((q) => [
      q.question[locale],
      q.answer[locale],
      q.wrong[locale],
      q.followup[locale],
      q.followupAnswer[locale],
    ]),
    c.exercise.prompt[locale],
    c.exercise.reasoning[locale],
  ]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
}
