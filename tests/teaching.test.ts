import { describe, it, expect } from "vitest";
import { chapters, chapterById, chapterWordCount } from "@/content/chapters";
import { lessonById } from "@/content/lessons";
import {
  findTeachingAnswer,
  teachingContext,
  readTutorThread,
} from "@/lib/teaching";
import { tutorPayload } from "@/lib/providers";
describe("authored teaching chapters", () => {
  it("gives promoted core topics mechanisms, worked traces, corrected bugs and distinct interview reasoning", () => {
    const required = [
      "topic-01",
      "topic-02",
      "topic-04",
      "topic-07",
      "topic-08",
      "topic-12",
      "topic-17",
      "topic-25",
      "topic-34",
      "topic-38",
    ];
    expect(new Set(chapters.map((c) => c.topicId)).size).toBe(chapters.length);
    for (const id of required) {
      const c = chapterById[id];
      expect(c).toBeDefined();
      expect(new Set(c.sections.map((s) => s.level))).toEqual(
        new Set(["junior", "middle", "senior"]),
      );
      expect(c.examples.length).toBeGreaterThanOrEqual(1);
      for (const e of c.examples) {
        expect(e.steps.length).toBeGreaterThanOrEqual(3);
        expect(e.code).not.toBe("");
      }
      expect(c.debug.broken).not.toBe(c.debug.fixed);
      expect(c.exercise.checks.length).toBeGreaterThanOrEqual(3);
      expect(c.interviews.length).toBeGreaterThanOrEqual(2);
      for (const q of c.interviews) {
        expect(q.answer.en).not.toBe(lessonById[id].intro.en);
        expect(q.answer.az).not.toBe(lessonById[id].intro.az);
        expect(q.followupAnswer.en.trim()).not.toBe("");
      }
      expect(chapterWordCount(id, "en")).toBeGreaterThan(500);
      expect(chapterWordCount(id, "az")).toBeGreaterThan(450);
    }
  });
  it("has a concrete post-await failure/cleanup exercise rather than repeating the concurrency definition", () => {
    const c = chapterById["topic-12"];
    expect(c.exercise.solution).toContain("if mine == generation");
    expect(c.exercise.solution).toContain("catch is CancellationError");
    expect(c.debug.test.en).toContain("complete B");
    expect(c.interviews.some((q) => q.answer.en.includes("logical"))).toBe(
      true,
    );
  });
  it("retrieves exact authored questions and follow-ups in both languages and declines unrelated questions", () => {
    for (const locale of ["en", "az"] as const) {
      const c = chapterById["topic-02"];
      const q = c.interviews[1];
      const answer = findTeachingAnswer(c, q.question[locale], locale);
      expect(answer?.kind).toBe("authored");
      expect(answer?.text).toContain(q.answer[locale]);
      expect(findTeachingAnswer(c, q.followup[locale], locale)?.text).toBe(
        q.followupAnswer[locale],
      );
    }
    expect(
      findTeachingAnswer(
        chapterById["topic-02"],
        "medieval pottery kiln glaze temperatures",
        "en",
      ),
    ).toBeUndefined();
  });
  it("labels keyword retrieval as a passage, not a generated answer", () => {
    const answer = findTeachingAnswer(
      chapterById["topic-08"],
      "weak capture cancellation",
      "en",
    );
    expect(answer?.kind).toBe("passage");
    expect(answer?.anchor).toBeTruthy();
  });
  it("only constructs provider context from public authored teaching content", () => {
    const context = teachingContext(chapterById["topic-02"], "az");
    const payload = tutorPayload(
      {
        kind: "openai-compatible",
        endpoint: "https://provider.example.test/chat",
        model: "test",
      },
      "Why does copying this reference not clone it?",
      context,
      "az",
    );
    expect(JSON.stringify(payload)).toContain("natural Azerbaijani");
    expect(JSON.stringify(payload)).toContain("Account");
    expect(JSON.stringify(payload)).not.toContain("privateNotes");
    expect(JSON.stringify(payload)).not.toContain("snapshot.head");
    expect(JSON.stringify(payload)).not.toContain("/Users/");
  });
  it("recovers from corrupt thread data and preserves valid written history as inert text", () => {
    expect(readTutorThread("{broken")).toEqual([]);
    const rows = readTutorThread(
      JSON.stringify([
        { role: "assistant", text: "<script>doSomething()</script>" },
        { role: "system", text: "untrusted" },
      ]),
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].text).toContain("<script>");
  });
});
