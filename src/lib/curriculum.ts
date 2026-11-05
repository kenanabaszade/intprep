import data from "@/content/curriculum.json";
import { lessonById } from "@/content/lessons";
export const curriculum = data;
export const phases = data.phases;
export const topics = phases.flatMap((p) =>
  p.topics.map((t) => ({ ...t, phase: p })),
);
export const topicById = Object.fromEntries(topics.map((t) => [t.id, t]));
export const authoredTopics = topics.filter((t) => !!lessonById[t.id]);
export const totalItems = topics.reduce((sum, t) => sum + t.items.length, 0);
