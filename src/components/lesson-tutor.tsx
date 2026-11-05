"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Send, BookOpen, ExternalLink } from "lucide-react";
import type { Chapter } from "@/content/chapter-types";
import {
  findTeachingAnswer,
  readTutorThread,
  teachingContext,
  type TutorMessage,
} from "@/lib/teaching";
import { requestTutorAnswer } from "@/lib/providers";
import { bi as b } from "@/lib/types";
import { useAcademy } from "./provider";
import { Card } from "./ui";
export function LessonTutor({ chapter }: { chapter: Chapter }) {
  const { state, setState, t, ready } = useAcademy();
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const key = "lesson-tutor:" + chapter.topicId;
  const messages = readTutorThread(state.privateNotes[key]);
  function append(items: TutorMessage[]) {
    setState((s) => ({
      ...s,
      privateNotes: {
        ...s.privateNotes,
        [key]: JSON.stringify(
          [...readTutorThread(s.privateNotes[key]), ...items].slice(-40),
        ),
      },
    }));
  }
  function localAsk(value = question) {
    if (!value.trim() || busy) return;
    const answer = findTeachingAnswer(chapter, value, state.locale);
    append([
      { role: "user", text: value },
      {
        role: "assistant",
        text:
          answer?.text ||
          t(
            b(
              "I do not have an authored answer matching that question in this chapter. Try one of the specific questions below, revisit the explanation, or explicitly request a configured AI provider. I will not invent an answer and label it as verified teaching.",
              "Bu sualla uyğun gələn müəllifli cavab bu fəsildə yoxdur. Aşağıdakı konkret sualları sına, izaha qayıt və ya qurulmuş AI provider-dən açıq cavab istə. Uydurma cavabı yoxlanmış tədris kimi göstərməyəcəyəm.",
            ),
          ),
        kind: answer?.kind || "unavailable",
        anchor: answer?.anchor,
      },
    ]);
    setQuestion("");
    setNotice("");
  }
  async function providerAsk() {
    if (!state.ai || !question.trim() || busy) return;
    const q = question.trim();
    if (
      !window.confirm(
        t(
          b(
            "Send this question, the visible tutor conversation and public lesson content to ",
            "Bu sual, görünən tutor söhbəti və public dərs məzmununu göndər: ",
          ),
        ) +
          state.ai.endpoint +
          t(
            b(
              "? Private report, repository snapshot and other notes are excluded. Do not include secrets or confidential source in this conversation.",
              "? Məxfi icmal, repository snapshot və digər qeydlər göndərilmir. Söhbətə sirr və məxfi kod daxil etmə.",
            ),
          ),
      )
    )
      return;
    setBusy(true);
    try {
      const answer = await requestTutorAnswer(
        state.ai,
        q,
        teachingContext(chapter, state.locale),
        state.locale,
        messages,
      );
      append([
        { role: "user", text: q },
        { role: "assistant", text: answer, kind: "provider" },
      ]);
      setQuestion("");
      setNotice("");
    } catch {
      setNotice(
        t(
          b(
            "The provider could not answer. Your question is preserved; authored chapter answers still work without an API.",
            "Provider cavab verə bilmədi. Sualın saxlanıldı; müəllifli fəsil cavabları API-sız işləyir.",
          ),
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Card className="lesson-section tutor-panel">
      <div id="lesson-tutor">
        <p className="eyebrow">
          <MessageCircle
            size={13}
            style={{ display: "inline", marginRight: 8 }}
          />
          {t(b("ASK ABOUT THIS CONCEPT", "BU ANLAYIŞ HAQQINDA SORUŞ"))}
        </p>
        <h2>
          {t(
            b(
              "Stay with the part you don’t understand.",
              "Anlamadığın hissənin üzərində dayan.",
            ),
          )}
        </h2>
        <p>
          {t(
            b(
              "Start with an authored question or find a relevant passage in this chapter. This local mode retrieves written teaching; it is not a generative chatbot. A configured AI provider can answer open-ended follow-ups only after your explicit consent.",
              "Müəllifli sualdan başla və ya bu fəsildə uyğun hissə tap. Lokal rejim yazılmış tədrisi tapır; generativ chatbot deyil. Qurulmuş AI provider yalnız açıq razılığından sonra sərbəst əlavə sualı cavablandıra bilər.",
            ),
          )}
        </p>
        <div className="tutor-suggestions">
          {[
            ...chapter.interviews.slice(0, 3).map((q) => q.question),
            chapter.sections[0].title,
          ].map((q, i) => (
            <button
              key={i}
              className="button secondary"
              disabled={!ready || busy}
              onClick={() => localAsk(t(q))}
            >
              {t(q)}
            </button>
          ))}
        </div>
        {messages.length > 0 && (
          <div
            className="tutor-thread"
            aria-label={t(b("Lesson conversation", "Dərs söhbəti"))}
          >
            {messages.map((message, i) => (
              <div key={i} className={"tutor-message " + message.role}>
                <span className="chip">
                  {message.role === "user"
                    ? t(b("Your question", "Sənin sualın"))
                    : message.kind === "provider"
                      ? t(
                          b(
                            "AI provider · check its reasoning",
                            "AI provider · düşüncəsini yoxla",
                          ),
                        )
                      : message.kind === "passage"
                        ? t(
                            b(
                              "Relevant passage · not a generated answer",
                              "Uyğun mətn · generativ cavab deyil",
                            ),
                          )
                        : t(
                            b(
                              "Authored chapter answer",
                              "Müəllifli fəsil cavabı",
                            ),
                          )}
                </span>
                <div className="tutor-answer">
                  <ReactMarkdown
                    skipHtml
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ children, href }) => (
                        <a href={href} target="_blank" rel="noreferrer">
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                </div>
                {message.anchor && (
                  <a className="text-link" href={"#" + message.anchor}>
                    <BookOpen size={12} />
                    {t(b("Read in context", "Kontekstdə oxu"))}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            localAsk();
          }}
        >
          <label htmlFor={"tutor-question-" + chapter.topicId}>
            {t(
              b("What would you like explained?", "Nəyin izahını istəyirsən?"),
            )}
          </label>
          <textarea
            id={"tutor-question-" + chapter.topicId}
            rows={3}
            value={question}
            maxLength={10000}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t(
              b(
                "For example: why can a let struct still expose changing class state?",
                "Məsələn: let struct daxilindəki class state-i niyə yenə dəyişir?",
              ),
            )}
          />
          <div className="toolbar mt">
            <button
              className="button primary"
              disabled={!ready || !question.trim() || busy}
            >
              <Send size={13} />
              {t(b("Find an authored explanation", "Müəllifli izah tap"))}
            </button>
            {state.ai ? (
              <button
                type="button"
                className="button secondary"
                disabled={!ready || !question.trim() || busy}
                onClick={providerAsk}
              >
                <ExternalLink size={13} />
                {t(
                  busy
                    ? b("Asking provider…", "Provider-dən soruşulur…")
                    : b("Ask configured AI", "Qurulmuş AI-dan soruş"),
                )}
              </button>
            ) : (
              <Link href="/settings" className="text-link">
                {t(b("Optional AI setup", "İstəyə bağlı AI ayarı"))}
              </Link>
            )}
          </div>
        </form>
        {notice && (
          <p role="status" className="notice danger">
            {notice}
          </p>
        )}
        <p className="small faint">
          {t(
            b(
              "The conversation is stored locally with your private notes. No provider request happens when you use authored explanations.",
              "Söhbət məxfi qeydlərinlə lokal saxlanır. Müəllifli izahı istifadə edəndə provider sorğusu edilmir.",
            ),
          )}
        </p>
      </div>
    </Card>
  );
}
