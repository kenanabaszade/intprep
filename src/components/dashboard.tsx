"use client";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Clock,
  Target,
  Flame,
  GitBranch,
  Layers,
  CheckCircle2,
  Terminal,
  ChevronRight,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useAcademy } from "./provider";
import { PageHeading, Card, ProgressBar } from "./ui";
import { phases, topics, topicById, totalItems } from "@/lib/curriculum";
import { lessons, lessonById } from "@/content/lessons";
import { statusFor } from "@/lib/learning";
import { bi as b } from "@/lib/types";
export function Dashboard() {
  const { state, t } = useAcademy();
  const reduce = useReducedMotion();
  const [now] = useNow();
  const current = lessonById[state.lastTopic] ? state.lastTopic : "topic-02";
  const lesson = lessonById[current];
  const topic = topicById[current];
  const read = Object.values(state.progress).filter((p) => p.readAt).length;
  const mastered = topics.filter(
    (x) => statusFor(x.id, state.progress, state.attempts) === "mastered",
  ).length;
  const due = Object.entries(state.progress).filter(
    ([, p]) => p.nextReview && p.nextReview <= now,
  );
  const activeDays = new Set(
    state.attempts.map((a) => new Date(a.at).toDateString()),
  ).size;
  return (
    <>
      <PageHeading
        eyebrow={t(b("YOUR ENGINEERING JOURNEY", "MÜHƏNDİSLİK YOLUN"))}
        title={t(
          b("A little deeper, every day.", "Hər gün bir az daha dərinə."),
        )}
        description={t(
          b(
            "From understanding the concept to defending the decision. This is your space to grow.",
            "Anlayışı öyrənməkdən qərarını əsaslandırmağa. Bura sənin inkişaf sahəndir.",
          ),
        )}
        action={
          <Link className="button secondary" href="/interview">
            <Target size={15} />
            {t(b("Practice an interview", "Müsahibə məşqi"))}
            <ArrowUpRight size={14} />
          </Link>
        }
      />
      <motion.section
        initial={reduce ? false : { y: 12 }}
        animate={{ y: 0 }}
        className="learning-hero"
      >
        <div className="hero-content">
          <div className="hero-kicker">
            <span className="pulse-dot" />
            {t(
              b(
                "PICK UP WHERE CURIOSITY LEFT OFF",
                "MARAĞININ QALDIĞI YERDƏN DAVAM ET",
              ),
            )}
          </div>
          <div className="hero-tags">
            <span>SWIFT INTERNALS</span>
            <span>{t(b("Middle track", "Middle istiqaməti"))}</span>
          </div>
          <h2>{t(lesson.title || topic.title)}</h2>
          <p>
            {current === "topic-02"
              ? t(
                  b(
                    "Why copying a value isn’t always copying its data. Build a mental model you can actually use.",
                    "Dəyəri kopyalamaq niyə həmişə məlumatı kopyalamaq deyil? Praktikada işləyən düşüncə modeli qur.",
                  ),
                )
              : t(lesson.intro)}
          </p>
          <div className="hero-meta">
            <span>
              <Clock size={14} />
              {lesson.minutes} {t(b("min", "dəq"))}
            </span>
            <span>
              <Layers size={14} />
              {t(b("3 learning depths", "3 öyrənmə dərinliyi"))}
            </span>
          </div>
          <Link className="button primary" href={"/learn/" + current}>
            {t(b("Continue learning", "Öyrənməyə davam et"))}
            <ArrowRight size={16} />
          </Link>
        </div>
        <div
          className="hero-diagram"
          aria-label={t(
            b(
              "Illustrative copy-on-write diagram",
              "İllüstrativ copy-on-write diaqramı",
            ),
          )}
        >
          <div className="diagram-grid" />
          <div className="diagram-title">
            <span className="local-dot" />
            COPY-ON-WRITE<span>01 / 04</span>
          </div>
          <svg
            viewBox="0 0 430 260"
            role="img"
            aria-label="Two array values share one storage until mutation"
          >
            <defs>
              <pattern
                id="grid"
                width="22"
                height="22"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r=".7" fill="currentColor" opacity=".2" />
              </pattern>
            </defs>
            <rect width="430" height="260" fill="url(#grid)" />
            <path
              d="M125 83 H195 Q215 83 215 103 V125 H260 M125 185 H195 Q215 185 215 165 V145 H260"
              fill="none"
              stroke="#68837a"
              strokeWidth="1.5"
              strokeDasharray="5 5"
            />
            <g fill="#19221f" stroke="#4c675b">
              <rect x="32" y="59" width="100" height="47" rx="8" />
              <rect x="32" y="162" width="100" height="47" rx="8" />
            </g>
            <g fill="#cbd7cf" fontSize="13" fontFamily="monospace">
              <text x="50" y="87">
                array a
              </text>
              <text x="50" y="190">
                array b
              </text>
            </g>
            <rect
              x="262"
              y="100"
              width="125"
              height="70"
              rx="9"
              fill="#26352d"
              stroke="#91b49b"
            />
            <text
              x="282"
              y="128"
              fill="#aacaaf"
              fontSize="11"
              fontFamily="monospace"
            >
              SHARED BUFFER
            </text>
            <text
              x="281"
              y="152"
              fill="#e4ede5"
              fontSize="17"
              fontFamily="monospace"
            >
              [ 1, 2, 3 ]
            </text>
            <circle cx="215" cy="135" r="4" fill="#c3a382" />
          </svg>
          <div className="diagram-code">
            <span className="syntax-keyword">var</span> b = a{" "}
            <span className="syntax-comment">{"// share until mutation"}</span>
          </div>
          <Link href="/visualizations" className="diagram-explore">
            {t(b("Make it move", "Modeli hərəkətə gətir"))}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </motion.section>
      <div className="stats-grid">
        {[
          {
            icon: BookOpen,
            label: b("Curriculum explored", "Öyrənilən tədris planı"),
            value: `${read} / ${topics.length}`,
            sub: b(
              "Sections read, not mastered",
              "Oxunan bölmələr, mənimsənilən deyil",
            ),
          },
          {
            icon: CheckCircle2,
            label: b("Demonstrated mastery", "Sübut edilmiş mənimsəmə"),
            value: String(mastered),
            sub: b(
              "Multiple questions + delayed review",
              "Bir neçə sual + gecikmiş təkrar",
            ),
          },
          {
            icon: Target,
            label: b("Reviews due", "Gözləyən təkrarlar"),
            value: String(due.length),
            sub: b(
              "A little retrieval goes a long way",
              "Xatırlama praktikası biliyi möhkəmləndirir",
            ),
          },
          {
            icon: Flame,
            label: b("Practice days", "Praktika günləri"),
            value: String(activeDays),
            sub: b(
              "Based on your actual attempts",
              "Həqiqi cəhdlərinə əsaslanır",
            ),
          },
        ].map((s, i) => (
          <Card key={i} className="stat-card">
            <div className="stat-label">
              <span>{t(s.label)}</span>
              <s.icon size={16} />
            </div>
            <strong>{s.value}</strong>
            <small>{t(s.sub)}</small>
          </Card>
        ))}
      </div>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t(b("THE BIG PICTURE", "ÜMUMİ MƏNZƏRƏ"))}</p>
          <h2>{t(b("Your learning path", "Öyrənmə yolun"))}</h2>
        </div>
        <Link href="/curriculum" className="text-link">
          {t(b("Explore all 17 phases", "Bütün 17 mərhələni aç"))}
          <ArrowRight size={14} />
        </Link>
      </div>
      <div className="path-grid">
        {phases.slice(0, 4).map((phase, i) => (
          <Link
            key={phase.id}
            href={"/curriculum#" + phase.id}
            className="path-card"
          >
            <div className="path-top">
              <span className="phase-number">0{phase.number}</span>
              <span className="chip">
                {phase.topics.length} {t(b("sections", "bölmə"))}
              </span>
            </div>
            <h3>{t(phase.title)}</h3>
            <p>
              {t(
                b(
                  [
                    "Build your language instincts.",
                    "Understand ownership and abstraction.",
                    "Go beyond the surface of Swift.",
                    "Create interfaces that feel native.",
                  ][i],
                  [
                    "Dil haqqında düzgün düşüncə qur.",
                    "Ownership və abstraksiyanı anla.",
                    "Swift-in görünən səthindən dərinə keç.",
                    "Platformaya uyğun interfeys qur.",
                  ][i],
                ),
              )}
            </p>
            <ProgressBar
              label={t(b("Sections explored", "Baxılan bölmələr"))}
              value={
                (phase.topics.filter((x) => state.progress[x.id]?.readAt)
                  .length /
                  phase.topics.length) *
                100
              }
            />
            <div className="path-bottom">
              {t(b("Explore phase", "Mərhələni aç"))}
              <ChevronRight size={14} />
            </div>
          </Link>
        ))}
      </div>
      <div className="dashboard-bottom">
        <Card className="focus-card">
          <div className="section-heading compact">
            <h2>{t(b("Worth your attention", "Diqqətinə dəyər"))}</h2>
            <span className="chip">
              {t(b("CURATED FOR MIDDLE", "MIDDLE ÜÇÜN"))}
            </span>
          </div>
          {[
            [
              "topic-08",
              "01",
              b(
                "Follow the ownership, find the leak.",
                "Ownership-i izlə, leak-i tap.",
              ),
              "ARC · MEMORY",
            ],
            [
              "topic-12",
              "02",
              b(
                "An actor can still get the wrong answer.",
                "Actor da yanlış nəticə ala bilər.",
              ),
              "CONCURRENCY",
            ],
            [
              "topic-20",
              "03",
              b(
                "Every layer should earn its place.",
                "Hər qat yerini doğrultmalıdır.",
              ),
              "ARCHITECTURE",
            ],
          ].map(([id, num, title, tag]) => (
            <Link
              key={id as string}
              href={"/learn/" + id}
              className="focus-row"
            >
              <span className="focus-index">{num as string}</span>
              <div>
                <small>{tag as string}</small>
                <h3>{t(title as { en: string; az: string })}</h3>
              </div>
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </Card>
        <Card className="interview-card">
          <span className="card-icon">
            <Terminal size={20} />
          </span>
          <p className="eyebrow">
            {t(
              b(
                "UNDERSTAND IT. THEN EXPLAIN IT.",
                "ƏVVƏL ANLA. SONRA İZAH ET.",
              ),
            )}
          </p>
          <h2>
            {t(
              b("The interview is a conversation.", "Müsahibə bir söhbətdir."),
            )}
          </h2>
          <p>
            {t(
              b(
                "Practice one question at a time. Challenge your assumptions, explain your trade-offs, and find the gaps before your interviewer does.",
                "Hər dəfə bir sual məşq et. Fərziyyələrini yoxla, seçimlərini əsaslandır və müsahibədən əvvəl boşluqları tap.",
              ),
            )}
          </p>
          <Link className="button secondary" href="/interview">
            {t(b("Enter interview studio", "Müsahibə studiyasına keç"))}
            <ArrowRight size={15} />
          </Link>
        </Card>
      </div>
      <div className="source-banner">
        <GitBranch size={18} />
        <div>
          <strong>
            {t(
              b(
                "Your real work belongs in the story.",
                "Həqiqi işin hekayənin bir hissəsidir.",
              ),
            )}
          </strong>
          <span>
            {state.snapshot
              ? t(
                  b(
                    "Local repository snapshot connected. Review evidence before attribution.",
                    "Lokal repository snapshot qoşulub. Müəlliflikdən əvvəl sübutu yoxla.",
                  ),
                )
              : t(
                  b(
                    "Connect a read-only repository snapshot to explore your architecture privately.",
                    "Arxitekturanı məxfi araşdırmaq üçün read-only repository snapshot qoş.",
                  ),
                )}
          </span>
        </div>
        <Link href="/ibam" className="text-link">
          {t(b("Explore IBAM", "IBAM-ı araşdır"))}
          <ArrowUpRight size={14} />
        </Link>
      </div>
      <p className="coverage-footnote">
        {phases.length} {t(b("phases", "mərhələ"))} · {totalItems}{" "}
        {t(
          b(
            "original syllabus items preserved",
            "orijinal syllabus elementi qorunub",
          ),
        )}{" "}
        · {lessons.length}{" "}
        {t(b("authored bilingual lessons", "müəllifli ikidilli dərs"))}
      </p>
    </>
  );
}
import { useState } from "react";
function useNow() {
  return useState(() => Date.now());
}
