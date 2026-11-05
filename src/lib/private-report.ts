export type HistoricalQuestion = {
  id: string;
  line: number;
  question: string;
  context: string;
  answer: string;
  followup: string;
  raw: string;
};
export function extractReportQuestions(report: string): HistoricalQuestion[] {
  const lines = report.split("\n");
  const out: HistoricalQuestion[] = [];
  let current: HistoricalQuestion | undefined;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^#{2,6}\s+Q\d+\.\s+(.+)/);
    if (match) {
      if (current) out.push(current);
      current = {
        id: "report-L" + (i + 1),
        line: i + 1,
        question: match[1],
        context: "",
        answer: "",
        followup: "",
        raw: "",
      };
    } else if (current && /^#{1,3}\s/.test(line)) {
      out.push(current);
      current = undefined;
    } else if (current) {
      current.raw += line + "\n";
      const m = line.match(
        /^\*\*(Context|Middle answer|Follow-up):\*\*\s*(.*)/,
      );
      if (m) {
        const key =
          m[1] === "Context"
            ? "context"
            : m[1] === "Middle answer"
              ? "answer"
              : "followup";
        current[key] = m[2];
      }
    }
  }
  if (current) out.push(current);
  // Later complete drafts supersede exact duplicate question headings; source line stays attached.
  return Array.from(
    new Map(
      out.map((q) => [q.question.toLowerCase().replace(/[^a-z0-9]/g, ""), q]),
    ).values(),
  );
}
export function sourceReferences(report: string) {
  const regex = /ibam-ios-app\/ibam-ios-app\/([^\n)]+?):(\d+)\)/g;
  const refs = [];
  for (const match of report.matchAll(regex)) {
    refs.push({ path: match[1].replaceAll("\\", ""), line: Number(match[2]) });
  }
  return Array.from(
    new Map(refs.map((r) => [`${r.path}:${r.line}`, r])).values(),
  );
}
