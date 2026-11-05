"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ExternalLink, ArrowRight } from "lucide-react";
import { useAcademy } from "./provider";
import { PageHeading, Card, CodeBlock } from "./ui";
import sourceVerification from "@/content/source-verification.json";
import { lessons } from "@/content/lessons";
import { topicById } from "@/lib/curriculum";
import { extractReportQuestions } from "@/lib/private-report";
import { bi as b } from "@/lib/types";
export function Questions() {
  const { state, t } = useAcademy();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const [level, setLevel] = useState("middle");
  const historical = useMemo(
    () => extractReportQuestions(state.report || ""),
    [state.report],
  );
  const authored = lessons.flatMap((l) => [
    {
      id: l.id + "-concept",
      topicId: l.id,
      type: "concept",
      question: l.question,
      answer: l.mechanism,
      followup: l.followup,
      source: l.source,
      sourceLabel: l.sourceLabel,
      trap: l.trap,
    },
    {
      id: l.id + "-exercise",
      topicId: l.id,
      type: "exercise",
      question: l.exercise,
      answer: l.solution,
      followup: l.followup,
      source: l.source,
      sourceLabel: l.sourceLabel,
      trap: l.trap,
    },
  ]);
  const filtered = authored.filter(
    (q) =>
      (kind === "all" || kind === "practice") &&
      [
        t(q.question),
        topicById[q.topicId].title.en,
        topicById[q.topicId].title.az,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        eyebrow={t(b("PRACTICE WITH PROVENANCE", "MƏNBƏYİ BƏLLİ PRAKTİKA"))}
        title={t(
          b("Questions worth thinking through.", "Düşünməyə dəyən suallar."),
        )}
        description={t(
          b(
            "Generated practice is labeled. Documentation links explain the underlying concepts; they are not claims of real company interviews.",
            "Müəllifli praktika etiketlənir. Sənəd keçidləri əsas anlayışı izah edir; şirkət müsahibəsi iddiası deyil.",
          ),
        )}
      />
      <div className="toolbar">
        <div className="search-input">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              b("Find a question or topic…", "Sual və ya mövzu tap…"),
            )}
            aria-label={t(b("Search questions", "Sualları axtar"))}
          />
        </div>
        <select
          aria-label={t(b("Question source", "Sual mənbəyi"))}
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          <option value="all">{t(b("All sources", "Bütün mənbələr"))}</option>
          <option value="practice">
            {t(b("Authored practice", "Müəllifli praktika"))}
          </option>
          <option value="historical">
            {t(b("Private historical review", "Məxfi tarixi icmal"))}
          </option>
        </select>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          aria-label={t(b("Model answer depth", "Nümunə cavab dərinliyi"))}
        >
          {["junior", "middle", "senior"].map((l) => (
            <option key={l} value={l}>
              {l[0].toUpperCase() + l.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <p className="small faint mb">
        {filtered.length +
          (kind !== "practice"
            ? historical.filter((q) =>
                q.question.toLowerCase().includes(query.toLowerCase()),
              ).length
            : 0)}{" "}
        {t(b("matching questions", "uyğun sual"))} ·{" "}
        {t(
          b(
            "No “frequently asked” statistics are invented. Source dates are unknown unless stated.",
            "“Tez-tez soruşulur” statistikası uydurulmur. Göstərilməyibsə mənbə tarixi məlum deyil.",
          ),
        )}
      </p>
      <div className="two-column">
        {filtered.map((q) => (
          <Card className="question-card" key={q.id}>
            <div className="question-meta">
              <span className="chip green">
                {t(b("Authored practice", "Müəllifli praktika"))}
              </span>
              <span className="chip">
                {t(
                  q.type === "concept"
                    ? b("Concept check", "Anlayış yoxlaması")
                    : b("Practical exercise", "Praktiki tapşırıq"),
                )}
              </span>
              <span className="chip">{level}</span>
            </div>
            <span className="small faint">{t(topicById[q.topicId].title)}</span>
            <h3>{t(q.question)}</h3>
            {q.type === "concept" && (
              <>
                <CodeBlock
                  code={lessons.find((l) => l.id === q.topicId)!.code}
                />
                <ul className="plain-list">
                  {lessons
                    .find((l) => l.id === q.topicId)!
                    .choices.map((choice, i) => (
                      <li key={i}>{t(choice)}</li>
                    ))}
                </ul>
              </>
            )}
            <details>
              <summary>
                {t(b("Model answer & follow-up", "Nümunə cavab və əlavə sual"))}
              </summary>
              <p>
                {level === "junior"
                  ? t(lessons.find((l) => l.id === q.topicId)!.intro)
                  : level === "senior"
                    ? t(lessons.find((l) => l.id === q.topicId)!.judgment)
                    : t(q.answer)}
              </p>
              <p>
                <strong>
                  {t(b("Common misconception: ", "Yayılmış yanlış anlayış: "))}
                </strong>
                {t(q.trap)}
              </p>
              <p>
                <strong>{t(b("Follow-up: ", "Əlavə sual: "))}</strong>
                {t(q.followup)}
              </p>
            </details>
            <a
              href={q.source}
              target="_blank"
              rel="noreferrer"
              className="question-source"
            >
              {q.sourceLabel}{" "}
              <ExternalLink size={10} style={{ display: "inline" }} />
            </a>
            <p className="source-reference">
              {sourceVerification.some((s) => s.url === q.source)
                ? t(
                    b(
                      "Official Swift source reviewed · 5 Nov 2026 · public URL not live-checked",
                      "Rəsmi Swift mənbəsi oxunub · 5 noyabr 2026 · public URL canlı yoxlanılmayıb",
                    ),
                  )
                : t(
                    b(
                      "Document link · live verification pending",
                      "Sənəd keçidi · canlı yoxlama gözlənilir",
                    ),
                  )}
            </p>
            <Link href={"/learn/" + q.topicId} className="text-link">
              {t(b("Build the understanding", "Anlayışı qur"))}
              <ArrowRight size={12} />
            </Link>
          </Card>
        ))}
        {kind !== "practice" &&
          historical
            .filter((q) =>
              q.question.toLowerCase().includes(query.toLowerCase()),
            )
            .map((q) => (
              <Card className="question-card" key={q.id}>
                <span className="chip warm">
                  {t(
                    b(
                      "Private historical review · unverified current code",
                      "Məxfi tarixi icmal · cari kod yoxlanılmayıb",
                    ),
                  )}
                </span>
                <h3>{q.question}</h3>
                <details>
                  <summary>
                    {t(b("Original report answer", "Orijinal icmal cavabı"))}
                  </summary>
                  <p>{q.answer}</p>
                  <p>{q.followup}</p>
                </details>
                <p className="source-reference">
                  {q.id} ·{" "}
                  {t(
                    b(
                      "Original report language retained",
                      "İcmalın orijinal dili saxlanılır",
                    ),
                  )}
                </p>
              </Card>
            ))}
      </div>
      {!filtered.length && !historical.length && (
        <p className="notice">
          {t(
            b(
              "No matching questions. Import your private report for Chapter Lead questions, or clear the filters.",
              "Uyğun sual yoxdur. Chapter Lead sualları üçün məxfi icmalı gətir və ya filtri təmizlə.",
            ),
          )}
        </p>
      )}
    </>
  );
}
