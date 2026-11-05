"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ShieldCheck,
  GitBranch,
  FileCode2,
  ArrowRight,
  Upload,
  Search,
  AlertCircle,
} from "lucide-react";
import { useAcademy } from "./provider";
import { PageHeading, Card, Empty } from "./ui";
import { bi as b } from "@/lib/types";
import { extractReportQuestions, sourceReferences } from "@/lib/private-report";
const Graph = dynamic(() => import("./graph").then((m) => m.Graph), {
  ssr: false,
});
export function PrivateExplorer({
  view = "overview",
}: {
  view?: "overview" | "modules" | "flows";
}) {
  const { state, t } = useAcademy();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const [flow, setFlow] = useState("property");
  const snapshot = state.snapshot;
  const questions = useMemo(
    () => extractReportQuestions(state.report || ""),
    [state.report],
  );
  const refs = useMemo(
    () => sourceReferences(state.report || ""),
    [state.report],
  );
  const flows = {
    property: b("Property search", "Əmlak axtarışı"),
    masterpass: b("Masterpass", "Masterpass"),
    deposit: b("Deposit details & signing", "Əmanət detalları və imzalama"),
  };
  const traces = {
    property: [
      "User intent",
      "Search initiation",
      "Workflow identity",
      "Stream consumer",
      "Response mapping",
      "Observable state",
      "UI rendering",
    ],
    masterpass: [
      "Wallet entry",
      "Account status",
      "SDK adapter / backend",
      "Card mapping",
      "State update",
      "Verification route",
    ],
    deposit: [
      "UIKit lifecycle",
      "Legacy ViewModel",
      "Network callback",
      "Display mapping",
      "Document / biometric workflow",
      "State rendering",
    ],
  };
  const active = snapshot?.modules.find((m) => m.id === selected);
  const selectedFile = snapshot?.files.find((f) => f.path === selected);
  const visibleFiles =
    snapshot?.files
      .filter((f) => f.path.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 100) || [];
  const graphNodes = (snapshot?.modules.slice(0, 80) || []).map((m) => ({
    id: m.id,
    label: m.id,
    description: `${m.files.length} files`,
  }));
  const graphIds = new Set(graphNodes.map((n) => n.id));
  const edges = (snapshot?.modules || []).flatMap((m) =>
    m.dependencies
      .filter((d) => graphIds.has(d) && graphIds.has(m.id))
      .map((d) => ({ source: m.id, target: d })),
  );
  return (
    <>
      <PageHeading
        eyebrow={t(
          b("PRIVATE REPOSITORY INTELLIGENCE", "MƏXFİ REPOSITORY ARAŞDIRMASI"),
        )}
        title={t(
          b("Read the architecture that exists.", "Mövcud arxitekturanı oxu."),
        )}
        description={t(
          b(
            "Read-only snapshots. Explicit provenance. No private source uploaded, and no team work silently attributed to you.",
            "Read-only snapshot-lar. Açıq mənbə mənşəyi. Məxfi kod yüklənmir və komanda işi səssizcə sənə aid edilmir.",
          ),
        )}
        action={
          <Link href="/settings" className="button secondary">
            <Upload size={14} />
            {t(b("Connect local evidence", "Lokal sübut qoş"))}
          </Link>
        }
      />
      <div className="notice">
        <ShieldCheck size={15} style={{ display: "inline", marginRight: 8 }} />
        {t(
          b(
            "This cloud workspace cannot access the IBAM checkout on your computer. The site has no filesystem-reading endpoint. Import a locally generated metadata snapshot; the indexer never writes to the source repository.",
            "Bu cloud iş sahəsi kompüterindəki IBAM checkout-a çata bilmir. Saytda filesystem oxuyan endpoint yoxdur. Lokal yaradılmış metadata snapshot gətir; indexer mənbə repository-yə yazmır.",
          ),
        )}
      </div>
      <div className="tabs">
        <Link
          href="/ibam"
          className={`button ${view === "overview" ? "primary" : "secondary"}`}
        >
          {t(b("Evidence overview", "Sübut icmalı"))}
        </Link>
        <Link
          href="/ibam/modules"
          className={`button ${view === "modules" ? "primary" : "secondary"}`}
        >
          {t(b("Module graph", "Modul qrafı"))}
        </Link>
        <Link
          href="/ibam/flows"
          className={`button ${view === "flows" ? "primary" : "secondary"}`}
        >
          {t(b("Feature traces", "Feature axınları"))}
        </Link>
      </div>
      <div className="three-column mb">
        <Card className="stat-card">
          <div className="stat-label">
            <span>{t(b("Current snapshot", "Cari snapshot"))}</span>
            <GitBranch size={16} />
          </div>
          <strong style={{ fontSize: 20 }}>
            {snapshot
              ? snapshot.head.slice(0, 10)
              : t(b("Not connected", "Qoşulmayıb"))}
          </strong>
          <small>
            {snapshot
              ? snapshot.repository
              : t(b("No live claims verified", "Canlı iddia yoxlanılmayıb"))}
          </small>
        </Card>
        <Card className="stat-card">
          <div className="stat-label">
            {t(b("Historical review", "Tarixi icmal"))}
          </div>
          <strong style={{ fontSize: 20 }}>
            {state.report
              ? t(b("Imported locally", "Lokal gətirilib"))
              : t(b("Not imported", "Gətirilməyib"))}
          </strong>
          <small>
            {questions.length}{" "}
            {t(b("deduplicated questions", "təkrarsız sual"))}
          </small>
        </Card>
        <Card className="stat-card">
          <div className="stat-label">
            {t(b("Source references", "Mənbə istinadları"))}
          </div>
          <strong>{refs.length}</strong>
          <small>
            {t(
              b(
                "Historical paths, pending current validation",
                "Tarixi yollar, cari yoxlama gözləyir",
              ),
            )}
          </small>
        </Card>
      </div>
      {view === "modules" ? (
        snapshot ? (
          <>
            <p className="small muted">
              {t(
                b(
                  "Edges are observed Swift import relationships between indexed directory groups. They are not a complete resolved Tuist/SPM target graph. Up to 80 groups are shown; the full snapshot remains available locally.",
                  "Oxlar indekslənmiş qovluq qrupları arasındakı Swift import əlaqələridir. Tam həll edilmiş Tuist/SPM target qrafı deyil. Ən çox 80 qrup göstərilir; tam snapshot lokal qalır.",
                ),
              )}
            </p>
            <Graph nodes={graphNodes} edges={edges} onSelect={setSelected} />
            <label className="mt">
              {t(b("Inspect a group", "Qrupu araşdır"))}
              <select
                value={active?.id || ""}
                onChange={(e) => setSelected(e.target.value)}
              >
                <option value="">—</option>
                {snapshot.modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id}
                  </option>
                ))}
              </select>
            </label>
            {active && (
              <Card className="padded mt">
                <h2>{active.id}</h2>
                <p className="small">
                  {t(b("Imports: ", "Import-lar: "))}
                  {active.dependencies.join(", ") || "—"}
                </p>
                <div className="source-files">
                  {active.files.map((f) => (
                    <button key={f} onClick={() => setSelected(f)}>
                      {f}
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <Empty
              title={t(
                b(
                  "A graph needs repository evidence.",
                  "Qraf repository sübutu tələb edir.",
                ),
              )}
              description={t(
                b(
                  "No fabricated modules or dependencies are shown. Generate a read-only index on the machine that holds IBAM, then import it in Settings.",
                  "Uydurma modul və asılılıq göstərilmir. IBAM olan maşında read-only indeks yarat və Settings-dən gətir.",
                ),
              )}
              href="/settings"
              label={t(b("Import a snapshot", "Snapshot gətir"))}
            />
          </Card>
        )
      ) : view === "flows" ? (
        <>
          <div className="tabs">
            {Object.entries(flows).map(([id, label]) => (
              <button
                key={id}
                className={id === flow ? "selected" : ""}
                onClick={() => setFlow(id)}
              >
                {t(label)}
              </button>
            ))}
          </div>
          <div className="notice">
            <AlertCircle
              size={14}
              style={{ display: "inline", marginRight: 8 }}
            />
            {t(
              b(
                "This is a generic study trace for the named feature category. It is not current IBAM source evidence. Import your report to read historical findings, and verify paths against a snapshot before defending a claim.",
                "Bu feature kateqoriyası üçün ümumi tədris axınıdır, cari IBAM mənbə sübutu deyil. Tarixi tapıntı üçün icmalı gətir, iddianı müdafiə etməzdən əvvəl yolu snapshot ilə yoxla.",
              ),
            )}
          </div>
          <Graph
            nodes={traces[flow as keyof typeof traces].map((label, i) => ({
              id: String(i),
              label,
              description: "",
            }))}
            edges={traces[flow as keyof typeof traces]
              .slice(1)
              .map((_, i) => ({ source: String(i), target: String(i + 1) }))}
            onSelect={setSelected}
          />
          {state.report && (
            <Card className="padded mt">
              <h3>
                {t(
                  b("Historical source references", "Tarixi mənbə istinadları"),
                )}
              </h3>
              <p className="small">
                {t(
                  b(
                    "Path existence supports a reference only; it does not validate every claim in the review.",
                    "Yolun mövcudluğu yalnız istinadı dəstəkləyir; icmaldakı hər iddianı doğrulamır.",
                  ),
                )}
              </p>
              <div className="source-files">
                {refs
                  .filter((r) =>
                    r.path
                      .toLowerCase()
                      .includes(
                        flow === "property"
                          ? "property"
                          : flow === "masterpass"
                            ? "masterpass"
                            : "deposit",
                      ),
                  )
                  .map((ref) => {
                    const f = snapshot?.files.find((f) => f.path === ref.path);
                    return (
                      <div className="source-detail" key={ref.path + ref.line}>
                        {ref.path}:{ref.line}
                        <br />
                        <span className="chip">
                          {t(
                            f && ref.line <= f.lines
                              ? b(
                                  "Path + line exist in snapshot; claim unverified",
                                  "Snapshot-da yol və sətir var; iddia yoxlanılmayıb",
                                )
                              : b(
                                  "Historical review only · not currently verified",
                                  "Yalnız tarixi icmal · cari yoxlama yoxdur",
                                ),
                          )}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </Card>
          )}
        </>
      ) : (
        <>
          <div className="two-column">
            <Card className="padded">
              <FileCode2 className="muted" size={23} />
              <h2 className="mt">
                {t(b("Read-only local index", "Yalnız oxunan lokal indeks"))}
              </h2>
              <p>
                {t(
                  b(
                    "Run the bundled indexer on your own machine with an explicit repository path and an output path outside that repository. Only Swift metadata and commit attribution are included; no source text or secrets are exported.",
                    "Indexer-i öz maşınında açıq repository yolu və onun xaricində output yolu ilə başlat. Yalnız Swift metadata-sı və commit müəllifliyi daxil edilir; mənbə mətni və sirr çıxarılmır.",
                  ),
                )}
              </p>
              <pre className="notice">
                node scripts/index-repository.mjs \ --root
                /absolute/path/ibam-ios-app \ --out
                /outside/repo/ibam-index.json
              </pre>
              <Link href="/settings" className="text-link">
                {t(b("Import privately", "Məxfi gətir"))}
                <ArrowRight size={13} />
              </Link>
            </Card>
            <Card className="padded">
              <ShieldCheck size={23} className="muted" />
              <h2 className="mt">
                {t(
                  b(
                    "Know what is actually known.",
                    "Nəyin məlum olduğunu bil.",
                  ),
                )}
              </h2>
              <ul className="plain-list">
                {[
                  b(
                    "Current snapshot: observed imports, declarations, file hashes and commit metadata.",
                    "Cari snapshot: müşahidə edilmiş import, deklarasiya, fayl hash-i və commit metadata-sı.",
                  ),
                  b(
                    "Historical review: supplied analysis, not revalidated against current code.",
                    "Tarixi icmal: təqdim olunmuş analiz; cari kodla təkrar yoxlanılmayıb.",
                  ),
                  b(
                    "Inference: proposed rationale or risk, not a measured production outcome.",
                    "Fərziyyə: ehtimal olunan səbəb və ya risk; ölçülmüş istehsal nəticəsi deyil.",
                  ),
                  b(
                    "Authorship: exact Git identity must be selected before personal attribution.",
                    "Müəlliflik: şəxsi töhfədən əvvəl dəqiq Git kimliyi seçilməlidir.",
                  ),
                ].map((p, i) => (
                  <li key={i}>{t(p)}</li>
                ))}
              </ul>
            </Card>
          </div>
          {snapshot && (
            <Card className="padded mt">
              <div className="flex-between mb">
                <h2 style={{ margin: 0 }}>
                  {t(b("Indexed files", "İndekslənmiş fayllar"))}
                </h2>
                <span className="chip">{snapshot.files.length}</span>
              </div>
              <div className="search-input mb">
                <Search size={15} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label={t(
                    b("Filter indexed paths", "İndekslənmiş yolları filtrlə"),
                  )}
                  placeholder={t(b("Filter paths…", "Yolları filtrlə…"))}
                />
              </div>
              <div className="source-files">
                {visibleFiles.map((f) => (
                  <button key={f.path} onClick={() => setSelected(f.path)}>
                    {f.path}
                  </button>
                ))}
              </div>
              <p className="small faint">
                {t(
                  b(
                    "Showing at most 100 matches. File contents are not included.",
                    "Ən çox 100 uyğunluq göstərilir. Fayl məzmunu daxil deyil.",
                  ),
                )}
              </p>
            </Card>
          )}
          {state.report && (
            <Card className="padded mt">
              <h2>
                {t(
                  b(
                    "Your imported historical review",
                    "Gətirilən tarixi icmalın",
                  ),
                )}
              </h2>
              <p className="small">
                {t(
                  b(
                    "Rendered as inert text. Comments and document instructions are never executed. All findings remain historical until independently verified. Original report language is preserved.",
                    "Passiv mətn kimi göstərilir. Şərh və sənəd təlimatı icra edilmir. Müstəqil yoxlamaya qədər tapıntılar tarixi sayılır. İcmalın orijinal dili saxlanılır.",
                  ),
                )}
              </p>
              <div className="report-content">
                <pre>{state.report}</pre>
              </div>
            </Card>
          )}
        </>
      )}
      {selectedFile && (
        <Card className="padded mt">
          <h3>{selectedFile.path}</h3>
          <p className="source-reference">
            SHA-256: {selectedFile.hash}
            <br />
            {t(b("Lines: ", "Sətir: "))}
            {selectedFile.lines}
            <br />
            {t(b("Declarations: ", "Deklarasiyalar: "))}
            {selectedFile.declarations.join(", ")}
          </p>
          <p className="small faint">
            {t(
              b(
                "Observed source metadata at snapshot HEAD; no source content was uploaded.",
                "Snapshot HEAD-də müşahidə edilmiş metadata; mənbə məzmunu yüklənməyib.",
              ),
            )}
          </p>
        </Card>
      )}
    </>
  );
}
export function MyWork() {
  const { state, setState, t } = useAcademy();
  const [identity, setIdentity] = useState(
    state.privateNotes.confirmedAuthor || "",
  );
  const snapshot = state.snapshot;
  const identities = Array.from(
    new Set(snapshot?.contributions.map((c) => c.authorEmail) || []),
  );
  const commits =
    snapshot?.contributions.filter((c) => c.authorEmail === identity) || [];
  const tickets = ["DCT-61134", "DCT-61135", "ABBUISlider", "ABBUIBadge"];
  return (
    <>
      <PageHeading
        eyebrow={t(b("OWN YOUR STORY, WITH EVIDENCE", "HEKAYƏNİ SÜBUTLA QUR"))}
        title={t(b("Your engineering contributions", "Mühəndislik töhfələrin"))}
        description={t(
          b(
            "A ticket is a starting point, not proof of authorship. Select an exact Git identity and inspect the evidence before building your interview story.",
            "Ticket başlanğıcdır, müəlliflik sübutu deyil. Dəqiq Git kimliyi seç və müsahibə hekayəsindən əvvəl sübutu yoxla.",
          ),
        )}
      />
      {!snapshot ? (
        <Card>
          <Empty
            title={t(
              b(
                "Bring the history. Keep it private.",
                "Tarixçəni gətir. Məxfi saxla.",
              ),
            )}
            description={t(
              b(
                "The IBAM checkout is not available here. Import a local read-only snapshot with Git metadata to begin attribution. No contribution is currently verified.",
                "IBAM checkout burada yoxdur. Müəllifliyi araşdırmaq üçün Git metadata-lı read-only snapshot gətir. Hələ heç bir şəxsi töhfə yoxlanılmayıb.",
              ),
            )}
            href="/settings"
            label={t(b("Connect a snapshot", "Snapshot qoş"))}
          />
        </Card>
      ) : (
        <>
          <label className="mb">
            {t(
              b(
                "Confirm your exact Git author email",
                "Dəqiq Git author email-ini təsdiqlə",
              ),
            )}
            <select
              value={identity}
              onChange={(e) => {
                setIdentity(e.target.value);
                setState((s) => ({
                  ...s,
                  privateNotes: {
                    ...s.privateNotes,
                    confirmedAuthor: e.target.value,
                  },
                }));
              }}
            >
              <option value="">
                {t(
                  b(
                    "Select an identity — no automatic attribution",
                    "Kimlik seç — avtomatik aid etmə yoxdur",
                  ),
                )}
              </option>
              {identities.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>
          </label>
          {!identity ? (
            <div className="notice">
              {t(
                b(
                  "No identity selected. Commits are not attributed to you.",
                  "Kimlik seçilməyib. Commit-lər sənə aid edilmir.",
                ),
              )}
            </div>
          ) : (
            <>
              <p className="notice">
                {commits.length}{" "}
                {t(
                  b(
                    "exact author matches in the exported history. Merge commits are excluded by the indexer; author metadata alone is not proof that every change is solely yours.",
                    "çıxarılan tarixçədə dəqiq author uyğunluğu. Merge commit-lər indexer-də çıxarılır; author metadata-sı hər dəyişikliyin yalnız sənə aid olduğunu sübut etmir.",
                  ),
                )}
              </p>
              {commits.map((c) => (
                <Card key={c.commit} className="padded mb">
                  <span className="chip">{c.commit.slice(0, 10)}</span>
                  <h3 className="mt">{c.subject}</h3>
                  <p className="source-reference">
                    {c.authorName} &lt;{c.authorEmail}&gt; · {c.date}
                  </p>
                  <details>
                    <summary>
                      {t(b("Changed files", "Dəyişən fayllar"))}
                    </summary>
                    <pre>{c.files.join("\n")}</pre>
                  </details>
                </Card>
              ))}
            </>
          )}
        </>
      )}
      <Card className="padded mt">
        <h2>
          {t(b("Contribution research checklist", "Töhfə araşdırma siyahısı"))}
        </h2>
        <p>
          {t(
            b(
              "These identifiers came from your requested scope. They are search seeds and carry no verified personal ownership.",
              "Bu identifikatorlar istədiyin əhatədən gəlir. Axtarış başlanğıcıdır; şəxsi ownership sübutu deyil.",
            ),
          )}
        </p>
        <div className="toolbar">
          {tickets.map((ticket) => (
            <span key={ticket} className="chip warm">
              {ticket} · {t(b("unverified", "yoxlanılmayıb"))}
            </span>
          ))}
        </div>
        <h3>
          {t(
            b(
              "Build an evidence-based STAR narrative",
              "Sübuta əsaslanan STAR hekayəsi qur",
            ),
          )}
        </h3>
        <textarea
          rows={8}
          aria-label={t(b("Contribution narrative", "Töhfə hekayəsi"))}
          placeholder={t(
            b(
              "Situation: what was broken?\nTask: what was your responsibility?\nAction: exact commits, decisions, tests and trade-offs.\nResult: measured outcome, or clearly stated qualitative value.\nFollow-up: what would you improve?",
              "Situation: hansı problem var idi?\nTask: sənin məsuliyyətin nə idi?\nAction: dəqiq commit-lər, qərarlar, testlər və seçimlər.\nResult: ölçülmüş nəticə və ya açıq keyfiyyət dəyəri.\nFollow-up: nəyi təkmilləşdirərdin?",
            ),
          )}
          value={state.privateNotes["star"] || ""}
          onChange={(e) =>
            setState((s) => ({
              ...s,
              privateNotes: { ...s.privateNotes, star: e.target.value },
            }))
          }
        />
      </Card>
    </>
  );
}
