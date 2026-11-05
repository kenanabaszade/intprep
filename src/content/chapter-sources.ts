import records from "./teaching-sources.json";
import type { Chapter, TeachingSource } from "./chapter-types";
export const teachingSources = records as TeachingSource[];
const byId = Object.fromEntries(teachingSources.map((s) => [s.id, s]));
const bindings: Record<string, string[]> = {
  "topic-01": ["swift-basics", "swift-operators", "never-se0102"],
  "topic-02": ["swift-values"],
  "topic-04": ["swift-closures"],
  "topic-07": ["swift-protocols"],
  "topic-08": ["swift-arc"],
  "topic-25": ["apple-urlsession"],
  "topic-12": [
    "async-se0296",
    "tasks-se0304",
    "actors-se0306",
    "forums-actors",
  ],
  "topic-13": ["apple-controller", "objc-controller"],
  "topic-14": ["apple-layout", "objc-layout"],
  "topic-17": ["objc-controller"],
  "topic-33": [
    "apple-swiftui",
    "apple-state",
    "observation-se0395",
    "forums-observation",
  ],
  "topic-34": ["apple-state", "observation-se0395"],
  "topic-38": ["actors-se0306", "apple-keychain"],
};
export function attachTeachingSources(c: Chapter): Chapter {
  const sources = (bindings[c.topicId] || []).map((id) => byId[id]);
  if (sources.some((s) => !s)) throw new Error("Unknown teaching source");
  return {
    ...c,
    sources,
    syllabusCoverage:
      c.topicId === "topic-01"
        ? {
            "syllabus-L0003": "constants-and-change",
            "syllabus-L0004": "types-before-inference",
            "syllabus-L0005": "types-before-inference",
            "syllabus-L0006": "constants-and-change",
            "syllabus-L0007": "scope-and-lifetime",
            "syllabus-L0008": "operators-and-decisions",
            "syllabus-L0009": "operators-and-decisions",
            "syllabus-L0010": "ranges-and-boundaries",
            "syllabus-L0011": "mechanism",
            "syllabus-L0012": "operators-and-decisions",
            "syllabus-L0013": "foundation",
            "syllabus-L0014": "optional-flow-and-invariants",
            "syllabus-L0015": "optional-flow-and-invariants",
            "syllabus-L0016": "optional-flow-and-invariants",
            "syllabus-L0017": "optional-flow-and-invariants",
            "syllabus-L0018": "optional-flow-and-invariants",
            "syllabus-L0019": "aliases-and-returning",
            "syllabus-L0020": "aliases-and-returning",
          }
        : undefined,
  };
}
