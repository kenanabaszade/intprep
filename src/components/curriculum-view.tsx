"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Download } from "lucide-react";
import { phases, topics, totalItems } from "@/lib/curriculum";
import { chapters, chapterById } from "@/content/chapters";
import { lessonById } from "@/content/lessons";
import { useAcademy } from "./provider";
import { PageHeading, Card } from "./ui";
import { statuses } from "@/lib/i18n";
import { statusFor } from "@/lib/learning";
import { bi as b } from "@/lib/types";
import { downloadJSON } from "@/lib/storage";
export function CurriculumView() {
  const { state, t } = useAcademy();
  const [search, setSearch] = useState("");
  const [onlyAuthored, setOnlyAuthored] = useState(false);
  const query = search.toLocaleLowerCase();
  return (
    <>
      <PageHeading
        eyebrow={t(b("THE COMPLETE MAP", "TAM XƏRİTƏ"))}
        title={t(
          b(
            "A path from fundamentals to judgment.",
            "Əsaslardan mühəndislik qərarlarına.",
          ),
        )}
        description={t(
          b(
            "Every phase of your original syllabus. Explore the inventory, study authored lessons, and prove what you understand.",
            "Orijinal syllabus-un bütün mərhələləri. Siyahını araşdır, hazırlanmış dərsləri öyrən və anlayışını sübut et.",
          ),
        )}
        action={
          <button
            className="button secondary"
            onClick={() => downloadJSON(phases, "curriculum-coverage.json")}
          >
            <Download size={14} />
            {t(b("Export coverage", "Əhatəni çıxar"))}
          </button>
        }
      />
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-label">{t(b("Phases", "Mərhələlər"))}</div>
          <strong>{phases.length}</strong>
        </Card>
        <Card className="stat-card">
          <div className="stat-label">
            {t(b("Original sections", "Orijinal bölmələr"))}
          </div>
          <strong>{topics.length}</strong>
        </Card>
        <Card className="stat-card">
          <div className="stat-label">
            {t(b("Preserved subtopics", "Qorunan alt mövzular"))}
          </div>
          <strong>{totalItems}</strong>
        </Card>
        <Card className="stat-card">
          <div className="stat-label">
            {t(b("Long-form teaching chapters", "Ətraflı tədris fəsilləri"))}
          </div>
          <strong>{chapters.length}</strong>
        </Card>
      </div>
      <div className="toolbar">
        <div className="search-input">
          <Search size={16} />
          <input
            aria-label={t(b("Search syllabus", "Syllabus-da axtar"))}
            placeholder={t(
              b(
                "Search topics, subtopics, or concepts…",
                "Mövzu, alt mövzu və ya anlayış axtar…",
              ),
            )}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={onlyAuthored}
            onChange={(e) => setOnlyAuthored(e.target.checked)}
          />
          {t(b("Long-form chapters only", "Yalnız ətraflı fəsillər"))}
        </label>
      </div>
      <p className="notice">
        {t(
          b(
            "Full chapters include worked traces, debugging, implementation practice and explained interview answers. Brief entries are labeled Study notes. The original syllabus remains an exact English source quotation; importing it does not mean every subtopic has a complete chapter.",
            "Tam fəsil işlənmiş iz, debugging, implementasiya praktikası və izahlı müsahibə cavabı verir. Qısa giriş Öyrənmə qeydi adlanır. Orijinal syllabus ingiliscə dəqiq mənbə sitatıdır; import hər alt mövzunun tam fəsli olduğu demək deyil.",
          ),
        )}
      </p>
      {phases.map((phase) => {
        const filtered = phase.topics.filter(
          (topic) =>
            (!onlyAuthored || chapterById[topic.id]) &&
            (!query ||
              [
                topic.title.en,
                topic.title.az,
                ...topic.items.map((x) => x.text),
                ...topic.checkpoints.map((x) => x.text),
              ]
                .join(" ")
                .toLocaleLowerCase()
                .includes(query)),
        );
        if (!filtered.length) return null;
        return (
          <Card className="phase-section" key={phase.id}>
            <div className="phase-header" id={phase.id}>
              <span className="phase-number">
                {String(phase.number).padStart(2, "0")}
              </span>
              <div>
                <h2>{t(phase.title)}</h2>
                <small>
                  {phase.topics.length} {t(b("sections", "bölmə"))} ·{" "}
                  {phase.topics.reduce((s, x) => s + x.items.length, 0)}{" "}
                  {t(b("subtopics", "alt mövzu"))}
                </small>
              </div>
              <span className="chip">{phase.id}</span>
            </div>
            {filtered.map((topic) => (
              <Link
                key={topic.id}
                href={"/learn/" + topic.id}
                className="topic-row"
              >
                <span className="topic-index">
                  {topic.sourceKey.replace("extra-", "")}
                </span>
                <div>
                  <h3>{t(lessonById[topic.id]?.title || topic.title)}</h3>
                  <p>
                    {topic.items.length}{" "}
                    {t(b("source items", "mənbə elementi"))} ·{" "}
                    {topic.checkpoints.length}{" "}
                    {t(b("checkpoints", "yoxlama nöqtəsi"))}
                    {lessonById[topic.id] &&
                      ` · ${lessonById[topic.id].minutes} ${t(b("min", "dəq"))}`}
                  </p>
                </div>
                <div className="topic-actions">
                  <span className="chip">
                    {t(
                      statuses[
                        statusFor(topic.id, state.progress, state.attempts)
                      ],
                    )}
                  </span>
                  <span
                    className={`chip ${chapterById[topic.id] ? "green" : ""}`}
                  >
                    {t(
                      chapterById[topic.id]
                        ? b("Full chapter", "Tam fəsil")
                        : b("Study notes", "Öyrənmə qeydləri"),
                    )}
                  </span>
                  <ChevronRight size={15} />
                </div>
              </Link>
            ))}
          </Card>
        );
      })}
      {!topics.some(
        (topic) =>
          (!onlyAuthored || chapterById[topic.id]) &&
          [topic.title.en, topic.title.az, ...topic.items.map((x) => x.text)]
            .join(" ")
            .toLocaleLowerCase()
            .includes(query),
      ) && (
        <p className="notice">
          {t(
            b(
              "No matches. Try a broader term or clear the filter.",
              "Nəticə yoxdur. Daha geniş söz axtar və ya filtri təmizlə.",
            ),
          )}
        </p>
      )}
    </>
  );
}
