import { describe, it, expect } from "vitest";
import { chapters, chapterById } from "@/content/chapters";
import { teachingSources } from "@/content/chapter-sources";
import { topicById } from "@/lib/curriculum";
import { findTeachingAnswer, teachingContext } from "@/lib/teaching";
describe("concept-first sourced teaching", () => {
  it("teaches all original Swift Basics inventory entries instead of substituting an optional-only case", () => {
    const c = chapterById["topic-01"];
    expect(Object.keys(c.syllabusCoverage || {}).sort()).toEqual(
      topicById["topic-01"].items.map((i) => i.id).sort(),
    );
    const ids = new Set(c.sections.map((s) => s.id));
    for (const anchor of Object.values(c.syllabusCoverage || {}))
      expect(ids.has(anchor)).toBe(true);
    expect(c.sections[0].id).toBe("what-a-program-does");
    expect(
      c.sections
        .find((s) => s.id === "types-before-inference")
        ?.paragraphs.map((p) => p.en)
        .join(" "),
    ).toContain("Inference saves repetition, not type checking");
    expect(
      c.sections
        .find((s) => s.id === "aliases-and-returning")
        ?.paragraphs.map((p) => p.en)
        .join(" "),
    ).toContain("Void");
    expect(
      c.sections
        .find((s) => s.id === "optional-flow-and-invariants")
        ?.paragraphs.map((p) => p.en)
        .join(" "),
    ).toContain("implicitly unwrapped optional");
  });
  it("provides prerequisite explanations for UIKit, layout and SwiftUI before worked examples", () => {
    for (const id of ["topic-13", "topic-14", "topic-33"]) {
      const c = chapterById[id];
      expect(c).toBeDefined();
      expect(c.sections.length).toBeGreaterThanOrEqual(5);
      for (const s of c.sections) {
        expect(s.paragraphs.length).toBeGreaterThanOrEqual(2);
        expect(
          s.paragraphs.every((p) => p.en.length > 80 && p.az.length > 80),
        ).toBe(true);
      }
      expect(c.examples.length).toBeGreaterThan(0);
      expect(c.sources?.some((s) => s.role === "official-framework")).toBe(
        true,
      );
    }
  });
  it("distinguishes reviewed public source revisions from unverified forum and documentation links", () => {
    expect(new Set(teachingSources.map((s) => s.id)).size).toBe(
      teachingSources.length,
    );
    for (const s of teachingSources) {
      expect(new URL(s.url).protocol).toBe("https:");
      if (s.status === "reviewed-source") {
        expect(s.revision).toMatch(/^[a-f0-9]{40}$/);
        expect(s.accessedAt).toBeTruthy();
      } else {
        expect(s.revision).toBeNull();
        expect(s.accessedAt).toBeNull();
      }
      if (s.role === "community-discussion") {
        expect(s.status).toBe("reference-link");
        expect(s.qualification.en).toContain("not");
      }
    }
    expect(
      teachingSources.find((s) => s.id === "objc-layout")?.publishedYear,
    ).toBe(2013);
  });
  it("can retrieve the theory for beginner terms instead of requiring code questions", () => {
    for (const locale of ["en", "az"] as const) {
      const c = chapterById["topic-01"];
      const theory = c.sections.find((s) => s.id === "types-before-inference")!;
      const answer = findTeachingAnswer(c, theory.title[locale], locale);
      expect(answer?.text).toContain(theory.paragraphs[0][locale]);
      expect(answer?.kind).toBe("authored");
    }
  });
  it("passes source review qualifications into optional tutor context without private state", () => {
    const context = teachingContext(chapterById["topic-33"], "en");
    expect(context.sources.some((s) => s.status === "reference-link")).toBe(
      true,
    );
    expect(context.sources.some((s) => s.status === "reviewed-source")).toBe(
      true,
    );
    expect(JSON.stringify(context)).not.toContain("privateNotes");
  });
  it("does not accidentally escape Swift interpolation into a literal backslash in code examples", () => {
    for (const c of chapters) {
      for (const code of [
        ...c.examples.map((e) => e.code),
        c.debug.fixed,
        c.exercise.solution,
      ])
        expect(code).not.toMatch(/\\\\\(/);
    }
  });
});
