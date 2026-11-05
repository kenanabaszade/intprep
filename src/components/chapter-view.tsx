"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Columns2,
  MessageCircle,
} from "lucide-react";
import { chapterById, chapterWordCount } from "@/content/chapters";
import { lessonById } from "@/content/lessons";
import { topicById, topics } from "@/lib/curriculum";
import { bi as b, type Localized, type Level } from "@/lib/types";
import { statusFor } from "@/lib/learning";
import { statuses } from "@/lib/i18n";
import { useAcademy } from "./provider";
import { PageHeading, Card, CodeBlock } from "./ui";
import { Quiz } from "./quiz";
import { TeachingSources } from "./teaching-sources";
import { LessonTutor } from "./lesson-tutor";
export function ChapterView({ id }: { id: string }) {
  const { state, setState, t, ready } = useAcademy();
  const chapter = chapterById[id];
  const lesson = lessonById[id];
  const topic = topicById[id];
  const [focus, setFocus] = useState<Level | "all">("all");
  const [both, setBoth] = useState(false);
  const [message, setMessage] = useState("");
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
  const next = topics[topics.findIndex((t) => t.id === id) + 1];
  function text(p: Localized) {
    return both ? (
      <div className="reading-columns">
        <div lang="en">
          <small>ENGLISH</small>
          <p>{p.en}</p>
        </div>
        <div lang="az">
          <small>AZƏRBAYCANCA</small>
          <p>{p.az}</p>
        </div>
      </div>
    ) : (
      <p>{t(p)}</p>
    );
  }
  function saveNotes(value: string) {
    setState((s) => ({
      ...s,
      progress: {
        ...s.progress,
        [id]: {
          ...s.progress[id],
          openedAt: s.progress[id]?.openedAt || Date.now(),
          notes: value,
        },
      },
    }));
  }
  const contents = [
    {
      id: "teaching-sources",
      title: b("Sources and reading", "Mənbələr və oxu"),
    },
    ...chapter.sections.map((s) => ({ id: s.id, title: s.title })),
    {
      id: "worked-examples",
      title: b("Worked Swift examples", "İşlənmiş Swift nümunələri"),
    },
    {
      id: "debug-case",
      title: b("Broken → corrected code", "Səhv → düzəldilmiş kod"),
    },
    {
      id: "interview-questions",
      title: b("Interview questions & answers", "Müsahibə sual və cavabları"),
    },
    {
      id: "practice",
      title: b("Your implementation exercise", "İmplementasiya tapşırığın"),
    },
    { id: "quiz", title: b("Understanding check", "Anlayış yoxlaması") },
    {
      id: "lesson-tutor",
      title: b("Ask about this concept", "Anlayış haqqında soruş"),
    },
  ];
  return (
    <>
      <Link href={"/curriculum#" + topic.phase.id} className="text-link mb">
        <ArrowLeft size={13} />
        {t(topic.phase.title)}
      </Link>
      <PageHeading
        eyebrow={t(b("LONG-FORM TEACHING CHAPTER", "ƏTRAFLI TƏDRİS FƏSLİ"))}
        title={t(lesson.title || topic.title)}
        description={t(
          b(
            "From the first mental model to code, production failures and interview defense. All three depths are included below.",
            "İlk düşüncə modelindən koda, production xətasına və müsahibə müdafiəsinə. Hər üç dərinlik aşağıdadır.",
          ),
        )}
        action={
          <span className="chip green">
            {t(statuses[statusFor(id, state.progress, state.attempts)])}
          </span>
        }
      />
      <div className="chapter-meta">
        <a href="#worked-examples">
          {t(
            b(
              "Understand first → examples afterward",
              "Əvvəl anla → sonra nümunələr",
            ),
          )}
        </a>
        {chapter.sources?.length && (
          <a href="#teaching-sources">
            {chapter.sources.length}{" "}
            {t(b("teaching references", "tədris istinadı"))}
          </a>
        )}
        <span>
          {chapterWordCount(id, state.locale).toLocaleString(
            state.locale === "az" ? "az-AZ" : "en-GB",
          )}{" "}
          {t(b("words of teaching", "söz tədris"))}
        </span>
        <span>
          {chapter.examples.length} {t(b("worked traces", "işlənmiş iz"))}
        </span>
        <span>
          {chapter.interviews.length}{" "}
          {t(
            b(
              "interview Q&As + follow-ups",
              "müsahibə sual-cavabı + əlavə suallar",
            ),
          )}
        </span>
        <span>
          {t(
            b(
              "1 debugging case + implementation exercise",
              "1 debugging halı + implementasiya tapşırığı",
            ),
          )}
        </span>
      </div>
      <div className="toolbar chapter-toolbar">
        <div
          className="tabs"
          style={{ marginBottom: 0 }}
          role="group"
          aria-label={t(b("Reading focus", "Oxuma fokusu"))}
        >
          {(["all", "junior", "middle", "senior"] as const).map((level) => (
            <button
              key={level}
              aria-pressed={focus === level}
              className={focus === level ? "selected" : ""}
              onClick={() => {
                setFocus(level);
                if (level !== "all")
                  document
                    .querySelector(`[data-teaching-level="${level}"]`)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {level === "all"
                ? t(b("Full lesson", "Tam dərs"))
                : level[0].toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
        <button
          className="button secondary"
          aria-pressed={both}
          onClick={() => setBoth(!both)}
        >
          <Columns2 size={14} />
          AZ + EN
        </button>
        <a className="button secondary" href="#lesson-tutor">
          <MessageCircle size={14} />
          {t(b("I have a question", "Sualım var"))}
        </a>
      </div>
      <details className="chapter-mobile-contents">
        <summary>{t(b("Open the reading map", "Oxuma xəritəsini aç"))}</summary>
        <nav aria-label={t(b("Chapter contents", "Fəsil məzmunu"))}>
          {contents.map((c) => (
            <a key={c.id} href={"#" + c.id}>
              {t(c.title)}
            </a>
          ))}
        </nav>
      </details>
      <div className="lesson-layout chapter-layout">
        <article className="lesson-main">
          <div className="chapter-start">
            <p className="small">{t(chapter.prerequisiteNote)}</p>
            <details>
              <summary>
                {t(
                  b(
                    "What you will be able to explain",
                    "Nəyi izah edə biləcəksən",
                  ),
                )}
              </summary>
              <ul className="chapter-objectives">
                {chapter.objectives.map((o, i) => (
                  <li key={i}>{t(o)}</li>
                ))}
              </ul>
            </details>
          </div>
          {chapter.sections.map((section, index) => (
            <Card
              key={section.id}
              className={
                "lesson-section teaching-section " +
                (focus === section.level ? "focused-section" : "")
              }
            >
              <section id={section.id} data-teaching-level={section.level}>
                <p className="eyebrow">
                  {section.level.toUpperCase()} ·{" "}
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2>{t(section.title)}</h2>
                {section.paragraphs.map((p, i) => (
                  <div key={i}>{text(p)}</div>
                ))}
                {section.analogy && (
                  <div className="teaching-analogy">
                    <h3>
                      {t(
                        b("Another way to picture it", "Başqa cür təsəvvür et"),
                      )}
                    </h3>
                    {text(section.analogy)}
                  </div>
                )}
              </section>
            </Card>
          ))}
          <section id="worked-examples">
            <div className="section-heading">
              <h2>
                {t(
                  b(
                    "Follow the Swift, one step at a time.",
                    "Swift-i addım-addım izlə.",
                  ),
                )}
              </h2>
            </div>
            <p className="small faint">
              {t(
                b(
                  "Code and outputs below are authored examples and predictions, not live compiler results. Pseudocode and SDK requirements are labeled.",
                  "Aşağıdakı kod və çıxış müəllifli nümunə/proqnozdur, canlı compiler nəticəsi deyil. Pseudocode və SDK tələbi etiketlənir.",
                ),
              )}
            </p>
            {chapter.examples.map((example, index) => (
              <Card key={example.id} className="lesson-section worked-example">
                <p className="eyebrow">
                  {t(b("WORKED EXAMPLE", "İŞLƏNMİŞ NÜMUNƏ"))} {index + 1}
                </p>
                <h2>{t(example.title)}</h2>
                {text(example.setup)}
                <CodeBlock code={example.code} />
                <details>
                  <summary>
                    {t(
                      b(
                        "Predict first, then reveal the result",
                        "Əvvəl proqnozlaşdır, sonra nəticəni aç",
                      ),
                    )}
                  </summary>
                  <pre className="chapter-output">{t(example.output)}</pre>
                </details>
                <h3 className="trace-heading">
                  {t(b("Execution / reasoning trace", "İcra / düşüncə izi"))}
                </h3>
                <ol className="execution-trace">
                  {example.steps.map((step, i) => (
                    <li key={i}>{text(step)}</li>
                  ))}
                </ol>
                <div className="notice">
                  <strong>
                    {t(b("The important conclusion", "Vacib nəticə"))}
                  </strong>
                  {text(example.takeaway)}
                </div>
              </Card>
            ))}
          </section>
          <Card className="lesson-section">
            <section id="debug-case">
              <p className="eyebrow">
                {t(b("DEBUGGING LAB", "SAZLAMA LABORATORİYASI"))}
              </p>
              <h2>{t(chapter.debug.title)}</h2>
              <h3>{t(b("The broken version", "Səhv versiya"))}</h3>
              <CodeBlock
                code={chapter.debug.broken}
                label={t(
                  b("Broken / illustrative code", "Səhv / illüstrativ kod"),
                )}
              />
              {text(chapter.debug.failure)}
              <details>
                <summary>
                  {t(
                    b(
                      "Show the correction and why it works",
                      "Düzəlişi və səbəbini göstər",
                    ),
                  )}
                </summary>
                <CodeBlock
                  code={chapter.debug.fixed}
                  label={t(b("Corrected approach", "Düzəldilmiş yanaşma"))}
                />
                {text(chapter.debug.why)}
                <h3>
                  {t(
                    b(
                      "What test would prove this?",
                      "Hansı test bunu sübut edər?",
                    ),
                  )}
                </h3>
                {text(chapter.debug.test)}
              </details>
            </section>
          </Card>
          <Card className="lesson-section">
            <section id="interview-questions">
              <p className="eyebrow">
                {t(b("DEFEND THE REASONING", "DÜŞÜNCƏNİ ƏSASLANDIR"))}
              </p>
              <h2>
                {t(
                  b(
                    "Interview questions with real explanations",
                    "Ətraflı izahlı müsahibə sualları",
                  ),
                )}
              </h2>
              <p>
                {t(
                  b(
                    "Answer aloud before revealing the reference. A strong answer states the mechanism, its limits and a concrete consequence—not just a definition.",
                    "Nümunəni açmazdan əvvəl səslə cavab ver. Güclü cavab tək tərif deyil, mexanizm, sərhəd və konkret nəticəni deyir.",
                  ),
                )}
              </p>
              {chapter.interviews.map((q, i) => (
                <section
                  id={"interview-" + q.id}
                  key={q.id}
                  className="deep-interview-question"
                >
                  <span className="chip warm">
                    {q.level.toUpperCase()} · Q{i + 1}
                  </span>
                  <h3>{t(q.question)}</h3>
                  <p className="small">
                    <strong>
                      {t(b("Why this is asked: ", "Niyə soruşulur: "))}
                    </strong>
                    {t(q.why)}
                  </p>
                  <label>
                    {t(
                      b(
                        "Your answer before the reference",
                        "Nümunədən əvvəl sənin cavabın",
                      ),
                    )}
                    <textarea
                      rows={3}
                      value={
                        state.privateNotes["answer:" + id + ":" + q.id] || ""
                      }
                      onChange={(e) =>
                        setState((s) => ({
                          ...s,
                          privateNotes: {
                            ...s.privateNotes,
                            ["answer:" + id + ":" + q.id]: e.target.value,
                          },
                        }))
                      }
                    />
                  </label>
                  <details>
                    <summary>
                      {t(
                        b(
                          "Show model answer, trap and follow-up",
                          "Nümunə cavab, tələ və əlavə sualı göstər",
                        ),
                      )}
                    </summary>
                    {text(q.answer)}
                    <div className="notice">
                      <strong>
                        {t(
                          b("A weak / incorrect answer", "Zəif / yanlış cavab"),
                        )}
                      </strong>
                      {text(q.wrong)}
                    </div>
                    <h4>{t(q.followup)}</h4>
                    {text(q.followupAnswer)}
                  </details>
                </section>
              ))}
            </section>
          </Card>
          <Card className="lesson-section">
            <section id="practice">
              <p className="eyebrow">
                {t(b("BUILD IT, THEN EXPLAIN IT", "QUR, SONRA İZAH ET"))}
              </p>
              <h2>
                {t(
                  b(
                    "Your implementation exercise",
                    "İmplementasiya tapşırığın",
                  ),
                )}
              </h2>
              {text(chapter.exercise.prompt)}
              <label>
                {t(b("Your reasoning and code", "Düşüncən və kodun"))}
                <textarea
                  rows={8}
                  value={state.progress[id]?.notes || ""}
                  onChange={(e) => saveNotes(e.target.value)}
                  placeholder={t(
                    b(
                      "Work through the ownership, state transitions and test assertions…",
                      "Ownership, state keçidi və test assertion-larını addım-addım yaz…",
                    ),
                  )}
                />
              </label>
              <details>
                <summary>{t(b("I need a hint", "İpucu lazımdır"))}</summary>
                <ol className="plain-list">
                  {chapter.exercise.hints.map((h, i) => (
                    <li key={i}>{t(h)}</li>
                  ))}
                </ol>
              </details>
              <details>
                <summary>
                  {t(
                    b(
                      "Compare with a reference implementation",
                      "Nümunə implementasiya ilə müqayisə et",
                    ),
                  )}
                </summary>
                <CodeBlock
                  code={chapter.exercise.solution}
                  label={t(
                    b("Reference / labeled recipe", "Nümunə / etiketli resept"),
                  )}
                />
                {text(chapter.exercise.reasoning)}
              </details>
              <h3>{t(b("Proof of understanding", "Anlayışın sübutu"))}</h3>
              <ul className="chapter-objectives">
                {chapter.exercise.checks.map((c, i) => (
                  <li key={i}>{t(c)}</li>
                ))}
              </ul>
            </section>
          </Card>
          <Card>
            <div id="quiz">
              <Quiz lesson={lesson} />
            </div>
          </Card>
          <div className="mt">
            <LessonTutor chapter={chapter} />
          </div>
          <Card className="lesson-section">
            <TeachingSources chapter={chapter} />
            <h2>
              {t(
                b(
                  "Source and accuracy boundaries",
                  "Mənbə və dəqiqlik sərhədləri",
                ),
              )}
            </h2>
            <a
              className="text-link"
              href={lesson.source}
              target="_blank"
              rel="noreferrer"
            >
              {lesson.sourceLabel} ↗
            </a>
            <p className="small mt">
              {t(
                b(
                  "These interview questions are authored practice. Banking examples are illustrative, not verified IBAM source. Language-only examples target Swift 6; Apple-framework examples require an Apple SDK. The website does not compile or execute code.",
                  "Bu müsahibə sualları müəllifli praktikadır. Bank nümunələri illüstrativdir, yoxlanmış IBAM mənbəyi deyil. Dil nümunələri Swift 6 üçündür; Apple framework Apple SDK tələb edir. Sayt kod compile/icra etmir.",
                ),
              )}
            </p>
            <details>
              <summary>
                {t(
                  b(
                    "Original syllabus items and checkpoints",
                    "Orijinal syllabus elementləri və yoxlamaları",
                  ),
                )}
              </summary>
              <ul className="inventory-list">
                {[...topic.items, ...topic.checkpoints].map((item) => (
                  <li key={item.id}>
                    {item.text}
                    {chapter.syllabusCoverage?.[item.id] && (
                      <a
                        className="text-link"
                        href={"#" + chapter.syllabusCoverage[item.id]}
                      >
                        {t(b(" · Read the explanation", " · İzahı oxu"))}
                      </a>
                    )}
                    <br />
                    <code>{item.id}</code>
                  </li>
                ))}
              </ul>
            </details>
          </Card>
          <div className="flex-between wrap">
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
                setMessage(
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
            {message}
          </p>
        </article>
        <aside className="lesson-aside">
          <Card>
            <p className="eyebrow">{t(b("READING MAP", "OXUMA XƏRİTƏSİ"))}</p>
            {contents.map((c) => (
              <a key={c.id} href={"#" + c.id}>
                {t(c.title)}
              </a>
            ))}
          </Card>
          <Card>
            <h3>{t(b("Need an earlier step?", "Əvvəlki addım lazımdır?"))}</h3>
            {lesson.prerequisites.map((p) => (
              <Link key={p} href={"/learn/" + p}>
                {t(lessonById[p]?.title || topicById[p].title)} ↗
              </Link>
            ))}
            <p className="small">
              {t(
                b(
                  "Read the whole chapter first; the level buttons focus a section without hiding the foundation.",
                  "Əvvəl bütün fəsli oxu; səviyyə düyməsi təməli gizlətmədən hissəyə yönəldir.",
                ),
              )}
            </p>
          </Card>
        </aside>
      </div>
    </>
  );
}
