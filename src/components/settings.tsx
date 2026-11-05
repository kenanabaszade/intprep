"use client";
import { useState, type ChangeEvent } from "react";
import {
  Download,
  Upload,
  ShieldCheck,
  Trash2,
  HardDrive,
  Check,
} from "lucide-react";
import { useAcademy } from "./provider";
import { PageHeading, Card } from "./ui";
import { bi as b } from "@/lib/types";
import { parseBackup, parseSnapshot, downloadJSON } from "@/lib/storage";
import { validateEndpoint } from "@/lib/providers";
import { initialState } from "@/lib/learning";
import { extractReportQuestions } from "@/lib/private-report";
export function SettingsView() {
  const { state, setState, t, ready } = useAcademy();
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [provider, setProvider] = useState<"ollama" | "openai-compatible">(
    state.ai?.kind || "ollama",
  );
  const [endpoint, setEndpoint] = useState(
    state.ai?.endpoint || "http://localhost:11434/api/chat",
  );
  const [model, setModel] = useState(state.ai?.model || "");
  async function importFile(
    event: ChangeEvent<HTMLInputElement>,
    kind: "backup" | "snapshot" | "report",
  ) {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    try {
      if (file.size > 15_000_000)
        throw new Error(
          t(b("File exceeds 15 MB.", "Fayl 15 MB-dan böyükdür.")),
        );
      const content = await file.text();
      if (kind === "report") {
        if (content.length > 5_000_000) throw new Error("Report exceeds 5 MB.");
        setState((s) => ({ ...s, report: content }));
        setMessage(
          t(
            b(
              "Historical report imported locally. It was not uploaded or treated as current verified source.",
              "Tarixi icmal lokal gətirildi. Yüklənmədi və cari yoxlanmış mənbə sayılmadı.",
            ),
          ) +
            " " +
            extractReportQuestions(content).length +
            " " +
            t(b("questions extracted.", "sual çıxarıldı.")),
        );
      } else if (kind === "snapshot") {
        const snapshot = parseSnapshot(JSON.parse(content));
        setState((s) => ({ ...s, snapshot }));
        setMessage(
          t(
            b(
              "Read-only metadata snapshot imported. Learning progress is preserved.",
              "Read-only metadata snapshot gətirildi. Öyrənmə nəticələri qorunur.",
            ),
          ),
        );
      } else {
        const next = parseBackup(JSON.parse(content));
        if (
          !window.confirm(
            t(
              b(
                "Replace current local learning data with this validated backup? Export your current data first if needed.",
                "Cari lokal nəticələr bu yoxlanmış backup ilə əvəz edilsin? Lazımdırsa əvvəl cari nəticəni çıxar.",
              ),
            ),
          )
        )
          return;
        setState(next);
        setMessage(
          t(b("Validated backup restored.", "Yoxlanmış backup bərpa edildi.")),
        );
      }
      setError(false);
    } catch (e) {
      setError(true);
      setMessage(
        t(
          b(
            "Import rejected. Existing data was preserved. ",
            "Import rədd edildi. Mövcud məlumat qorundu. ",
          ),
        ) + (e instanceof Error ? e.message : ""),
      );
    } finally {
      input.value = "";
    }
  }
  const fileInput = (kind: "backup" | "snapshot" | "report", label: string) => (
    <label className="button secondary file-button">
      <Upload size={14} />
      {label}
      <input
        type="file"
        accept={
          kind === "report"
            ? ".txt,.md,text/plain,text/markdown"
            : ".json,application/json"
        }
        onChange={(e) => importFile(e, kind)}
      />
    </label>
  );
  return (
    <>
      <PageHeading
        eyebrow={t(b("YOUR WORKSPACE, YOUR RULES", "İŞ SAHƏN, QAYDALARIN"))}
        title={t(b("Settings & privacy", "Ayarlar və məxfilik"))}
        description={t(
          b(
            "No account required. Your progress and private evidence stay in this browser until you explicitly export them.",
            "Hesab tələb olunmur. Açıq şəkildə çıxarmayana qədər nəticələr və məxfi sübutlar bu browser-də qalır.",
          ),
        )}
      />
      <Card className="settings-section">
        <h2>{t(b("Make it yours", "Özünə uyğunlaşdır"))}</h2>
        <div className="settings-row">
          <div>
            <h3>{t(b("Learning language", "Öyrənmə dili"))}</h3>
            <p>
              {t(
                b(
                  "Authored explanations, quizzes and navigation are bilingual. Imported source quotations retain their original language.",
                  "Hazırlanmış izah, quiz və naviqasiya ikidillidir. Gətirilmiş mənbə sitatları orijinal dildə qalır.",
                ),
              )}
            </p>
          </div>
          <select
            aria-label={t(b("Learning language", "Öyrənmə dili"))}
            value={state.locale}
            onChange={(e) =>
              setState((s) => ({ ...s, locale: e.target.value as "en" | "az" }))
            }
          >
            <option value="en">English</option>
            <option value="az">Azərbaycanca</option>
          </select>
        </div>
        <div className="settings-row">
          <div>
            <h3>{t(b("Appearance", "Görünüş"))}</h3>
            <p>
              {t(
                b(
                  "Choose the contrast that helps you focus. Reduced-motion preferences are respected.",
                  "Fokusuna kömək edən görünüşü seç. Reduce Motion seçiminə hörmət olunur.",
                ),
              )}
            </p>
          </div>
          <select
            aria-label={t(b("Appearance", "Görünüş"))}
            value={state.theme}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                theme: e.target.value as "light" | "dark",
              }))
            }
          >
            <option value="dark">{t(b("Dark", "Tünd"))}</option>
            <option value="light">{t(b("Light", "Açıq"))}</option>
          </select>
        </div>
      </Card>
      <Card className="settings-section">
        <div className="flex-between">
          <h2>{t(b("Progress & portability", "Nəticələr və daşınma"))}</h2>
          <HardDrive size={19} className="muted" />
        </div>
        <p>
          {t(
            b(
              "IndexedDB persists learning data across sessions on this browser and website origin. Clearing browser data removes it. Another device or a different site URL does not automatically share your data. Keep a backup.",
              "IndexedDB nəticəni bu browser və sayt origin-i üçün sessiyalar arasında saxlayır. Browser məlumatını silmək onu silir. Başqa cihaz və ya başqa sayt URL-i avtomatik paylaşmır. Backup saxla.",
            ),
          )}
        </p>
        <div className="settings-row">
          <div>
            <h3>
              {t(b("Export learning data", "Öyrənmə nəticələrini çıxar"))}
            </h3>
            <p>
              {t(
                b(
                  "Contains progress, notes and interview answers. Private repository imports are excluded.",
                  "Nəticə, qeydlər və müsahibə cavabları daxildir. Məxfi repository import-ları daxil deyil.",
                ),
              )}
            </p>
          </div>
          <button
            className="button secondary"
            disabled={!ready}
            onClick={() => {
              const { report, snapshot, privateNotes, ...publicLearning } =
                state;
              void report;
              void snapshot;
              void privateNotes;
              downloadJSON(
                { ...publicLearning, privateNotes: {} },
                "academy-learning-backup.json",
              );
            }}
          >
            <Download size={14} />
            {t(b("Export progress", "Nəticələri çıxar"))}
          </button>
        </div>
        <div className="settings-row">
          <div>
            <h3>{t(b("Full private backup", "Tam məxfi backup"))}</h3>
            <p>
              {t(
                b(
                  "Includes imported report, snapshot and private notes. Keep this file private; do not commit it to GitHub.",
                  "İcmal, snapshot və məxfi qeydlər daxildir. Bu faylı məxfi saxla; GitHub-a commit etmə.",
                ),
              )}
            </p>
          </div>
          <button
            className="button secondary"
            disabled={!ready}
            onClick={() => downloadJSON(state, "academy-private-backup.json")}
          >
            <Download size={14} />
            {t(b("Export private backup", "Məxfi backup çıxar"))}
          </button>
        </div>
        <div className="settings-row">
          <div>
            <h3>{t(b("Restore a backup", "Backup bərpa et"))}</h3>
            <p>
              {t(
                b(
                  "Schema-validated version 1 backups only. Invalid files cannot overwrite existing data.",
                  "Yalnız schema ilə yoxlanmış versiya 1 backup. Səhv fayl mövcud məlumatı əvəz edə bilməz.",
                ),
              )}
            </p>
          </div>
          {fileInput("backup", t(b("Import backup", "Backup gətir")))}
        </div>
      </Card>
      <Card className="settings-section">
        <div className="flex-between">
          <h2>{t(b("Private IBAM evidence", "Məxfi IBAM sübutu"))}</h2>
          <ShieldCheck size={19} className="muted" />
        </div>
        <p>
          {t(
            b(
              "Files are read locally using your browser. There is no upload API. Report text is inert: embedded instructions and code are never executed. Repository imports stay out of the public website bundle.",
              "Fayllar browser tərəfindən lokal oxunur. Upload API yoxdur. İcmal passiv mətndir: daxilindəki təlimat və kod icra edilmir. Repository import-ları public sayt bundle-ına daxil deyil.",
            ),
          )}
        </p>
        <div className="settings-row">
          <div>
            <h3>{t(b("Architecture report", "Arxitektura icmalı"))}</h3>
            <p>
              {state.report
                ? t(
                    b(
                      "Imported locally · historical, not current verification",
                      "Lokal gətirilib · tarixidir, cari yoxlama deyil",
                    ),
                  )
                : t(
                    b(
                      "Import your supplied Markdown/TXT report. Preserve its source language and line references.",
                      "Təqdim etdiyin Markdown/TXT icmalı gətir. Mənbə dili və sətir istinadları qorunur.",
                    ),
                  )}
            </p>
          </div>
          {fileInput("report", t(b("Import report", "İcmal gətir")))}
        </div>
        <div className="settings-row">
          <div>
            <h3>
              {t(
                b(
                  "Read-only repository snapshot",
                  "Read-only repository snapshot",
                ),
              )}
            </h3>
            <p>
              {state.snapshot
                ? state.snapshot.repository +
                  " · " +
                  state.snapshot.head.slice(0, 10)
                : t(
                    b(
                      "Generate using scripts/index-repository.mjs on the machine that holds IBAM. No source code is included.",
                      "IBAM olan maşında scripts/index-repository.mjs ilə yarat. Mənbə kodu daxil edilmir.",
                    ),
                  )}
            </p>
          </div>
          {fileInput("snapshot", t(b("Import snapshot", "Snapshot gətir")))}
        </div>
        <div className="settings-row">
          <div>
            <h3>{t(b("Delete private imports", "Məxfi import-ları sil"))}</h3>
            <p>
              {t(
                b(
                  "Removes report, repository metadata and contribution notes. Learning progress and quiz history remain.",
                  "İcmal, repository metadata-sı və töhfə qeydlərini silir. Öyrənmə və quiz tarixçəsi qalır.",
                ),
              )}
            </p>
          </div>
          <button
            className="button secondary"
            onClick={() => {
              if (
                window.confirm(
                  t(
                    b(
                      "Delete private imports and contribution notes from this browser?",
                      "Bu browser-dən məxfi import və töhfə qeydləri silinsin?",
                    ),
                  ),
                )
              ) {
                setState((s) => ({
                  ...s,
                  report: undefined,
                  snapshot: undefined,
                  privateNotes: {},
                }));
                setMessage(
                  t(
                    b(
                      "Private imports removed. Learning progress preserved.",
                      "Məxfi import-lar silindi. Nəticələr qorundu.",
                    ),
                  ),
                );
                setError(false);
              }
            }}
          >
            <Trash2 size={14} />
            {t(b("Delete private data", "Məxfi məlumatı sil"))}
          </button>
        </div>
      </Card>
      <Card className="settings-section">
        <h2>
          {t(b("External services & execution", "Xarici servis və icra"))}
        </h2>
        <div className="notice">
          <Check size={15} style={{ display: "inline", marginRight: 7 }} />
          {t(
            b(
              "External AI is off by default. Saving a provider does not send data. Each optional interview feedback request requires explicit consent. Quizzes and self-assessed interviews need no provider.",
              "Xarici AI default olaraq bağlıdır. Provider saxlamaq data göndərmir. Hər istəyə bağlı müsahibə feedback-i açıq razılıq istəyir. Quiz və özünüqiymətləndirmə provider tələb etmir.",
            ),
          )}
        </div>
        <p>
          {t(
            b(
              "Optional Ollama or OpenAI-compatible endpoints must allow browser requests (CORS). Use your own trusted proxy for authentication; no API keys are requested or stored. Optional browser speech transcription requires a separate explicit consent because the browser vendor may process audio remotely. Swift code execution is disabled; outputs are labeled as predictions.",
              "İstəyə bağlı Ollama və ya OpenAI-compatible endpoint browser sorğusuna (CORS) icazə verməlidir. Autentifikasiya üçün öz etibarlı proxy-ni istifadə et; API açarı istənilmir və saxlanılmır. Browser vendor-u səsi uzaqdan emal edə bildiyi üçün istəyə bağlı səs transkripsiyası ayrıca açıq razılıq tələb edir. Swift kod icrası bağlıdır; nəticələr proqnoz kimi göstərilir.",
            ),
          )}
        </p>
        <div className="three-column mt">
          <label>
            {t(b("Optional provider", "İstəyə bağlı provider"))}
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as typeof provider)}
            >
              <option value="ollama">Ollama</option>
              <option value="openai-compatible">OpenAI-compatible</option>
            </select>
          </label>
          <label>
            {t(
              b("Full endpoint URL (no secrets)", "Tam endpoint URL (sirrsiz)"),
            )}
            <input
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
            />
          </label>
          <label>
            {t(b("Model name", "Model adı"))}
            <input value={model} onChange={(e) => setModel(e.target.value)} />
          </label>
        </div>
        <div className="toolbar mt">
          <button
            className="button secondary"
            disabled={!model.trim()}
            onClick={() => {
              try {
                const safe = validateEndpoint(endpoint);
                setState((s) => ({
                  ...s,
                  ai: { kind: provider, endpoint: safe, model: model.trim() },
                }));
                setMessage(
                  t(
                    b(
                      "Provider saved; no request sent. Consent is required for each use.",
                      "Provider saxlanıldı; sorğu göndərilmədi. Hər istifadə razılıq tələb edir.",
                    ),
                  ),
                );
                setError(false);
              } catch (e) {
                setError(true);
                setMessage(e instanceof Error ? e.message : "Invalid endpoint");
              }
            }}
          >
            {t(b("Save optional provider", "İstəyə bağlı provider saxla"))}
          </button>
          <button
            className="button secondary"
            onClick={() => {
              setState((s) => ({ ...s, ai: undefined }));
              setMessage(t(b("Provider disabled.", "Provider söndürüldü.")));
              setError(false);
            }}
          >
            {t(b("Disable provider", "Provider-i söndür"))}
          </button>
        </div>
        <p className="small faint">
          {state.ai
            ? state.ai.kind + " · " + state.ai.endpoint
            : t(
                b(
                  "No provider configured. No AI requests.",
                  "Provider qurulmayıb. AI sorğusu yoxdur.",
                ),
              )}
        </p>
      </Card>
      <Card className="settings-section">
        <h2>{t(b("Reset this workspace", "İş sahəsini sıfırla"))}</h2>
        <p>
          {t(
            b(
              "This removes learning progress as well as private imports from this browser. Export a backup first.",
              "Bu browser-dən həm öyrənmə nəticələrini, həm də məxfi import-ları silir. Əvvəl backup çıxar.",
            ),
          )}
        </p>
        <button
          className="button secondary"
          onClick={() => {
            if (
              window.confirm(
                t(
                  b(
                    "Delete ALL local academy data? This cannot be undone without a backup.",
                    "BÜTÜN lokal academy məlumatı silinsin? Backup olmadan geri qaytarılmır.",
                  ),
                ),
              )
            ) {
              setState({ ...initialState });
              setMessage("Reset complete / Sıfırlandı");
              setError(false);
            }
          }}
        >
          <Trash2 size={14} />
          {t(b("Reset all data", "Bütün məlumatı sıfırla"))}
        </button>
      </Card>
      {message && (
        <p role="status" className={`notice ${error ? "danger" : "success"}`}>
          {message}
        </p>
      )}
    </>
  );
}
