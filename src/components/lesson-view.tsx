"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  BookOpen,
  Columns2,
  Check,
  ExternalLink,
} from "lucide-react";
import { topicById, topics } from "@/lib/curriculum";
import { lessonById } from "@/content/lessons";
import { useAcademy } from "./provider";
import { PageHeading, Card, CodeBlock, Empty } from "./ui";
import { Quiz } from "./quiz";
import { bi as b, type Level, type Localized } from "@/lib/types";
import { statuses } from "@/lib/i18n";
import { statusFor } from "@/lib/learning";
import { chapterById } from "@/content/chapters";
import { ChapterView } from "./chapter-view";
export function LessonView({ id }: { id: string }) {
  return chapterById[id] ? (
    <ChapterView key={id} id={id} />
  ) : (
    <StudyNotesView key={id} id={id} />
  );
}
const levelNames = {
  junior: b("Junior · build the foundation", "Junior · təməl qur"),
  middle: b("Middle · production reasoning", "Middle · praktiki düşüncə"),
  senior: b("Senior · engineering judgment", "Senior · mühəndislik qərarı"),
};
function StudyNotesView({ id }: { id: string }) {
  const { state, setState, t, ready } = useAcademy();
  const [level, setLevel] = useState<Level>("junior");
  const [sideBySide, setSideBySide] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [markMessage, setMarkMessage] = useState("");
  const topic = topicById[id];
  const lesson = lessonById[id];
  useEffect(() => {
    if (ready)
      setState((s) => ({
        ...s,
        lastTopic: id,
        progress: {
          ...s.progress,
          [id]: {
            ...s.progress[id],
            openedAt: s.progress[id]?.openedAt || Date.now(),
          },
        },
      }));
  }, [id, ready, setState]);
  if (!topic)
    return (
      <Empty
        title="Topic not found"
        description="Choose a topic from the curriculum."
        href="/curriculum"
        label="Curriculum"
      />
    );
  const position = topics.findIndex((x) => x.id === id);
  const next = topics[position + 1];
  function text(value: Localized) {
    return sideBySide ? (
      <div className="reading-columns">
        <div>
          <small>ENGLISH</small>
          <p>{value.en}</p>
        </div>
        <div>
          <small>AZƏRBAYCANCA</small>
          <p>{value.az}</p>
        </div>
      </div>
    ) : (
      <p>{t(value)}</p>
    );
  }
  return (
    <>
      <Link href={"/curriculum#" + topic.phase.id} className="text-link mb">
        <ArrowLeft size={13} />
        {t(topic.phase.title)}
      </Link>
      <PageHeading
        eyebrow={`${t(b("PHASE", "MƏRHƏLƏ"))} ${String(topic.phase.number).padStart(2, "0")} / ${topic.id.toUpperCase()}`}
        title={t(lesson?.title || topic.title)}
        description={
          lesson
            ? t(
                b(
                  "Study notes: this section has not yet been expanded into a long-form teaching chapter.",
                  "Öyrənmə qeydləri: bu bölmə hələ ətraflı tədris fəslinə çevrilməyib.",
                ),
              )
            : t(
                b(
                  "Original syllabus inventory. Deep explanations have not yet been authored for this section.",
                  "Orijinal syllabus siyahısı. Bu bölmənin dərin izahları hələ hazırlanmayıb.",
                ),
              )
        }
        action={
          <span className="chip green">
            {t(statuses[statusFor(id, state.progress, state.attempts)])}
          </span>
        }
      />
      <div className="notice">
        {t(
          b(
            "This entry is a brief study note. For full worked teaching, open value semantics, ARC, concurrency, closures, protocols, MVVM, networking, SwiftUI state, authentication, or optionals from the curriculum.",
            "Bu giriş qısa öyrənmə qeydidir. Tam işlənmiş tədris üçün curriculum-dan dəyər semantikası, ARC, concurrency, closure, protocol, MVVM, networking, SwiftUI state, auth və ya Optional aç.",
          ),
        )}
        <Link className="text-link" href="/curriculum">
          {t(b("Browse teaching chapters →", "Tədris fəsillərinə bax →"))}
        </Link>
      </div>
      <div className="lesson-layout">
        <div className="lesson-main">
          {lesson ? (
            <>
              <div className="toolbar">
                <div
                  className="tabs"
                  style={{ marginBottom: 0 }}
                  role="tablist"
                  aria-label={t(b("Learning depth", "Öyrənmə dərinliyi"))}
                >
                  {(["junior", "middle", "senior"] as const).map((v) => (
                    <button
                      role="tab"
                      aria-selected={level === v}
                      key={v}
                      className={level === v ? "selected" : ""}
                      onClick={() => setLevel(v)}
                    >
                      {v[0].toUpperCase() + v.slice(1)}
                    </button>
                  ))}
                </div>
                <button
                  className="button secondary"
                  aria-pressed={sideBySide}
                  onClick={() => setSideBySide(!sideBySide)}
                >
                  <Columns2 size={14} />
                  {t(b("AZ + EN", "AZ + EN"))}
                </button>
                <span className="small faint">
                  <Clock
                    size={12}
                    style={{ display: "inline", marginRight: 4 }}
                  />
                  {lesson.minutes} {t(b("min", "dəq"))}
                </span>
              </div>
              <Card className="lesson-section">
                <div id="understand">
                  <p className="eyebrow">{t(levelNames[level])}</p>
                  <h2>
                    <span className="section-number">01</span>
                    {t(
                      level === "junior"
                        ? b(
                            "Start with the mental model",
                            "Düşüncə modelindən başla",
                          )
                        : level === "middle"
                          ? b(
                              "What happens under the hood?",
                              "Daxildə nə baş verir?",
                            )
                          : b(
                              "Make the engineering decision",
                              "Mühəndislik qərarını ver",
                            ),
                    )}
                  </h2>
                  {text(
                    level === "junior"
                      ? lesson.intro
                      : level === "middle"
                        ? lesson.mechanism
                        : lesson.judgment,
                  )}
                </div>
              </Card>
              <Card className="lesson-section">
                <div id="code">
                  <h2>
                    <span className="section-number">02</span>
                    {t(
                      b(
                        "Read it. Predict it. Explain it.",
                        "Oxu. Proqnozlaşdır. İzah et.",
                      ),
                    )}
                  </h2>
                  <p className="small">
                    {t(
                      b(
                        "A teaching example. Console output is predicted, not executed by this website. Apple framework examples require an Apple SDK.",
                        "Tədris nümunəsi. Konsol nəticəsi proqnozdur; sayt kodu icra etmir. Apple framework nümunələri Apple SDK tələb edir.",
                      ),
                    )}
                  </p>
                  <CodeBlock code={lesson.code} />
                  <details>
                    <summary>
                      {t(
                        b(
                          "Reveal predicted output",
                          "Proqnozlaşdırılan nəticəni aç",
                        ),
                      )}
                    </summary>
                    <pre className="syntax-string">{lesson.predicted}</pre>
                  </details>
                  <Link href={"/playground?topic=" + id} className="text-link">
                    {t(b("Edit in the playground", "Praktikada redaktə et"))}
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </Card>
              <Card className="lesson-section">
                <div id="misconception">
                  <h2>
                    <span className="section-number">03</span>
                    {t(
                      b(
                        "The detail interviewers push on",
                        "Müsahibədə soruşulan incəlik",
                      ),
                    )}
                  </h2>
                  {text(lesson.trap)}
                  <div className="notice">
                    <strong>
                      {t(
                        b(
                          "What makes this a strong Middle-level answer?",
                          "Bu cavabı güclü Middle cavabı edən nədir?",
                        ),
                      )}
                    </strong>
                    <p style={{ marginTop: 10, fontSize: 12 }}>
                      {t(lesson.mechanism)}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="lesson-section">
                <div id="practice">
                  <h2>
                    <span className="section-number">04</span>
                    {t(b("Prove it to yourself", "Özünə sübut et"))}
                  </h2>
                  {text(lesson.exercise)}
                  <textarea
                    aria-label={t(
                      b("Your reasoning and code", "Düşüncən və kodun"),
                    )}
                    rows={5}
                    placeholder={t(
                      b(
                        "Write your reasoning, sketch the ownership, or try some Swift…",
                        "Düşüncəni yaz, ownership-i çək və ya Swift kodu sına…",
                      ),
                    )}
                    value={state.progress[id]?.notes || ""}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        progress: {
                          ...s.progress,
                          [id]: {
                            ...s.progress[id],
                            openedAt: s.progress[id]?.openedAt || Date.now(),
                            notes: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                  <button
                    className="button secondary mt"
                    onClick={() => setSolutionOpen(!solutionOpen)}
                  >
                    {t(
                      solutionOpen
                        ? b(
                            "Hide reference reasoning",
                            "Nümunə düşüncəni gizlət",
                          )
                        : b(
                            "Compare with reference reasoning",
                            "Nümunə düşüncə ilə müqayisə et",
                          ),
                    )}
                  </button>
                  {solutionOpen && (
                    <div className="notice mt">{text(lesson.solution)}</div>
                  )}
                  <details>
                    <summary>
                      {t(
                        b(
                          "Try an interviewer follow-up",
                          "Müsahibənin əlavə sualını sına",
                        ),
                      )}
                    </summary>
                    {text(lesson.followup)}
                  </details>
                </div>
              </Card>
              <Card>
                <div id="quiz">
                  <Quiz key={id} lesson={lesson} />
                </div>
              </Card>
              <Card className="lesson-section mt">
                <h2>
                  <span className="section-number">05</span>
                  {t(b("Say it in an interview", "Müsahibədə belə izah et"))}
                </h2>
                {(["junior", "middle", "senior"] as const).map((l, i) => (
                  <details key={l} open={l === "middle"}>
                    <summary>{l[0].toUpperCase() + l.slice(1)}</summary>
                    {text(
                      i === 0
                        ? lesson.intro
                        : i === 1
                          ? lesson.mechanism
                          : lesson.judgment,
                    )}
                  </details>
                ))}
                <p className="small mt">
                  <a
                    href={lesson.source}
                    target="_blank"
                    rel="noreferrer"
                    className="text-link"
                  >
                    {lesson.sourceLabel}
                    <ExternalLink size={12} />
                  </a>
                </p>
                <p className="small faint">
                  {t(
                    b(
                      "Authored practice based on the linked documentation; not a reported company interview question. Language-only examples target Swift 6 syntax. Framework availability varies by SDK.",
                      "Əlaqəli sənədlərə əsaslanan müəllifli praktika; şirkətdən bildirilən müsahibə sualı deyil. Dil nümunələri Swift 6 sintaksisinə yönəlib. Framework uyğunluğu SDK-dan asılıdır.",
                    ),
                  )}
                </p>
              </Card>
            </>
          ) : (
            <Card className="lesson-section">
              <BookOpen size={25} className="muted" />
              <h2 className="mt">
                {t(b("The complete source outline", "Tam mənbə planı"))}
              </h2>
              <p>
                {t(
                  b(
                    "Use the preserved checklist below to plan study. This inventory is not a substitute for a deep lesson, and reading it never counts as demonstrated mastery.",
                    "Aşağıdakı qorunan siyahı ilə öyrənməni planlaşdır. Siyahı dərin dərsi əvəz etmir və oxunması mənimsəmə sayılmır.",
                  ),
                )}
              </p>
              <Link href="/curriculum" className="button secondary">
                {t(b("Find an authored lesson", "Hazırlanmış dərs tap"))}
                <ArrowRight size={14} />
              </Link>
            </Card>
          )}
          <Card className="lesson-section">
            <div id="source">
              <h2>
                {t(
                  b("Your syllabus, preserved", "Syllabus-un qorunmuş forması"),
                )}
              </h2>
              <p className="small">
                {t(
                  b(
                    "Original source wording and stable identifiers. This section is a source quotation, not a translation.",
                    "Orijinal mənbə mətni və sabit identifikatorlar. Bu bölmə tərcümə deyil, mənbədən sitatdır.",
                  ),
                )}
              </p>
              <ul className="inventory-list">
                {topic.items.map((item) => (
                  <li key={item.id}>
                    {item.text}
                    <br />
                    <code>{item.id}</code>
                  </li>
                ))}
              </ul>
              {topic.checkpoints.length > 0 && (
                <details>
                  <summary>
                    {t(
                      b(
                        "Original interview checkpoints",
                        "Orijinal müsahibə yoxlamaları",
                      ),
                    )}
                  </summary>
                  <ul className="plain-list">
                    {topic.checkpoints.map((x) => (
                      <li key={x.id}>
                        {x.text}{" "}
                        <code className="source-reference">{x.id}</code>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          </Card>
          <div className="flex-between wrap mt">
            <button
              className="button secondary"
              onClick={() => {
                setState((s) => ({
                  ...s,
                  progress: {
                    ...s.progress,
                    [id]: {
                      ...s.progress[id],
                      openedAt: s.progress[id]?.openedAt || Date.now(),
                      readAt: Date.now(),
                    },
                  },
                }));
                setMarkMessage(
                  t(
                    b(
                      "Marked as read. Mastery still needs assessment evidence.",
                      "Oxunmuş qeyd edildi. Mənimsəmə üçün qiymətləndirmə sübutu lazımdır.",
                    ),
                  ),
                );
              }}
            >
              <Check size={14} />
              {t(b("Mark as read", "Oxunmuş kimi qeyd et"))}
            </button>
            {next && (
              <Link href={"/learn/" + next.id} className="text-link">
                {t(b("Next section", "Növbəti bölmə"))}
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
          <p className="inline-status mt" role="status">
            {markMessage}
          </p>
        </div>
        <aside className="lesson-aside">
          <Card>
            <p className="eyebrow">{t(b("IN THIS LESSON", "BU DƏRSDƏ"))}</p>
            {[
              ["understand", b("The mental model", "Düşüncə modeli")],
              ["code", b("Swift in practice", "Swift praktikada")],
              ["misconception", b("Interview nuance", "Müsahibə incəliyi")],
              ["practice", b("Your exercise", "Tapşırığın")],
              ["quiz", b("Understanding check", "Anlayış yoxlaması")],
              ["source", b("Original syllabus", "Orijinal syllabus")],
            ].map(([anchor, label]) => (
              <a key={anchor as string} href={"#" + anchor}>
                {t(label as Localized)}
              </a>
            ))}
          </Card>
          <Card>
            <p className="eyebrow">
              {t(b("BUILD ON THE BASICS", "TƏMƏL ÜZƏRİNDƏ QUR"))}
            </p>
            <h3>{t(b("Prerequisites", "İlkin biliklər"))}</h3>
            {lesson?.prerequisites.length ? (
              lesson.prerequisites.map((p) => (
                <Link key={p} href={"/learn/" + p}>
                  {t(lessonById[p]?.title || topicById[p]?.title || b(p, p))} ↗
                </Link>
              ))
            ) : (
              <p>
                {t(
                  b(
                    "Start here. No prior lesson required.",
                    "Buradan başla. Əvvəlki dərs tələb olunmur.",
                  ),
                )}
              </p>
            )}
          </Card>
          <Card>
            <p className="eyebrow">
              {t(b("REAL REPOSITORY CONNECTION", "HƏQİQİ REPOSITORY ƏLAQƏSİ"))}
            </p>
            <p>
              {t(
                b(
                  "IBAM-specific claims require a local snapshot. General banking examples are illustrative, not source findings.",
                  "IBAM iddiaları lokal snapshot tələb edir. Ümumi bank nümunələri illüstrasiyadır, mənbə tapıntısı deyil.",
                ),
              )}
            </p>
            <Link href="/ibam" className="button secondary">
              {t(b("Open explorer", "Araşdırıcını aç"))}
            </Link>
          </Card>
        </aside>
      </div>
    </>
  );
}
