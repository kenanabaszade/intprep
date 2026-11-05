import type { Attempt, Progress, State } from "./types";
export const DAY = 86_400_000;
export const initialState: State = {
  schemaVersion: 1,
  locale: "en",
  theme: "dark",
  progress: {},
  attempts: [],
  sessions: [],
  lastTopic: "topic-02",
  privateNotes: {},
};
export function statusFor(
  id: string,
  progress: Record<string, Progress>,
  attempts: Attempt[],
  now = Date.now(),
) {
  const p = progress[id];
  const evidence = attempts.filter((a) => a.topicId === id);
  const last = evidence.at(-1);
  if (!p && !evidence.length) return "not-started";
  if (last && !last.correct) return "needs-review";
  const correct = evidence.filter((a) => a.correct);
  const distinct = new Set(correct.map((a) => a.questionId));
  const formats = new Set(correct.map((a) => a.format));
  const retained = correct.some(
    (a) => a.format === "review" && a.at - (correct[0]?.at || a.at) >= 7 * DAY,
  );
  if (distinct.size >= 3 && formats.size >= 2 && retained) return "mastered";
  if (distinct.size >= 3 && formats.size >= 2) return "interview-ready";
  if (evidence.length)
    return p?.nextReview && p.nextReview <= now ? "needs-review" : "practicing";
  return "learning";
}
export function schedule(
  progress: Progress | undefined,
  correct: boolean,
  now = Date.now(),
): Progress {
  const interval = correct
    ? Math.min(60, Math.max(1, (progress?.interval || 0) * 2))
    : 1;
  return {
    ...progress,
    openedAt: progress?.openedAt || now,
    interval,
    nextReview: now + interval * DAY,
  };
}
export function addAttempt(state: State, attempt: Attempt): State {
  return {
    ...state,
    attempts: [...state.attempts, attempt],
    progress: {
      ...state.progress,
      [attempt.topicId]: schedule(
        state.progress[attempt.topicId],
        attempt.correct,
        attempt.at,
      ),
    },
  };
}
export const rubric = [
  { en: "Technical correctness", az: "Texniki düzgünlük", weight: 35 },
  { en: "Depth of understanding", az: "Anlayış dərinliyi", weight: 25 },
  { en: "Architectural reasoning", az: "Arxitektura düşüncəsi", weight: 20 },
  { en: "Production awareness", az: "İstehsal mühiti düşüncəsi", weight: 10 },
  { en: "Communication clarity", az: "İfadə aydınlığı", weight: 10 },
];
export function rubricScore(scores: number[]) {
  return Math.round(
    rubric.reduce((sum, r, i) => sum + ((scores[i] || 0) / 4) * r.weight, 0),
  );
}
export function staleOutcome(
  order: "old-first" | "new-first",
  guarded: boolean,
) {
  return order === "new-first" && !guarded ? "A" : "B";
}
export function arcCount(
  owner: boolean,
  closureStrong: boolean,
  stored: boolean,
) {
  return Number(owner) + Number(closureStrong && stored);
}
