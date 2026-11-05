import type { Chapter } from "@/content/chapter-types";
import type { Locale } from "./types";
export type TutorMessage = {
  role: "user" | "assistant";
  text: string;
  kind?: "authored" | "passage" | "provider" | "unavailable";
  anchor?: string;
};
export function readTutorThread(raw: string | undefined): TutorMessage[] {
  try {
    const value = JSON.parse(raw || "[]");
    if (!Array.isArray(value)) return [];
    return value
      .filter(
        (m) =>
          m &&
          ["user", "assistant"].includes(m.role) &&
          typeof m.text === "string" &&
          m.text.length <= 100000 &&
          (!m.anchor || typeof m.anchor === "string"),
      )
      .slice(-40);
  } catch {
    return [];
  }
}
export function teachingContext(chapter: Chapter, locale: Locale) {
  return {
    topicId: chapter.topicId,
    language: locale,
    sections: chapter.sections.map((s) => ({
      title: s.title[locale],
      paragraphs: s.paragraphs.map((p) => p[locale]),
    })),
    examples: chapter.examples.map((e) => ({
      title: e.title[locale],
      code: e.code,
      trace: e.steps.map((p) => p[locale]),
      takeaway: e.takeaway[locale],
    })),
    debug: {
      broken: chapter.debug.broken,
      explanation: chapter.debug.failure[locale],
      fixed: chapter.debug.fixed,
      why: chapter.debug.why[locale],
    },
    interviews: chapter.interviews.map((q) => ({
      question: q.question[locale],
      answer: q.answer[locale],
      followup: q.followup[locale],
      followupAnswer: q.followupAnswer[locale],
    })),
  };
}
const stop = new Set(
  "what why how does do is are the a an i to of in it this that explain can me my about please nə niyə necə bu bir və üçün izah et edir mən mənə".split(
    " ",
  ),
);
function words(s: string) {
  return [
    ...new Set(s.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) || []),
  ].filter((w) => w.length >= 3 && !stop.has(w));
}
export function findTeachingAnswer(
  chapter: Chapter,
  question: string,
  locale: Locale,
): { text: string; anchor: string; kind: "authored" | "passage" } | undefined {
  const exact = chapter.interviews.find(
    (q) =>
      q.question[locale].toLocaleLowerCase() ===
        question.trim().toLocaleLowerCase() ||
      q.followup[locale].toLocaleLowerCase() ===
        question.trim().toLocaleLowerCase(),
  );
  if (exact)
    return {
      text:
        question.trim().toLocaleLowerCase() ===
        exact.followup[locale].toLocaleLowerCase()
          ? exact.followupAnswer[locale]
          : exact.answer[locale] +
            "\n\n" +
            exact.followup[locale] +
            "\n" +
            exact.followupAnswer[locale],
      anchor: "interview-" + exact.id,
      kind: "authored",
    };
  const section = chapter.sections.find(
    (s) =>
      s.title[locale].toLocaleLowerCase() ===
      question.trim().toLocaleLowerCase(),
  );
  if (section)
    return {
      text: [
        ...section.paragraphs.map((p) => p[locale]),
        section.analogy?.[locale],
      ]
        .filter(Boolean)
        .join("\n\n"),
      anchor: section.id,
      kind: "authored",
    };
  const terms = words(question);
  if (!terms.length) return;
  const candidates = [
    ...chapter.sections.map((s) => ({
      anchor: s.id,
      text: s.paragraphs.map((p) => p[locale]).join("\n\n"),
    })),
    ...chapter.interviews.map((q) => ({
      anchor: "interview-" + q.id,
      text:
        q.question[locale] +
        "\n\n" +
        q.answer[locale] +
        "\n\n" +
        q.followupAnswer[locale],
    })),
  ];
  const ranked = candidates
    .map((c) => {
      const haystack = new Set(words(c.text));
      return { ...c, hits: terms.filter((w) => haystack.has(w)).length };
    })
    .sort((a, b) => b.hits - a.hits);
  const first = ranked[0];
  if (
    !first ||
    first.hits < Math.min(2, terms.length) ||
    first.hits / terms.length < 0.35
  )
    return;
  return { text: first.text, anchor: first.anchor, kind: "passage" };
}
