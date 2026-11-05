"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, RotateCcw, Play, ShieldCheck } from "lucide-react";
import { useAcademy } from "./provider";
import { PageHeading, Card } from "./ui";
import { bi as b } from "@/lib/types";
import { arcCount, staleOutcome } from "@/lib/learning";
const Graph = dynamic(() => import("./graph").then((m) => m.Graph), {
  ssr: false,
  loading: () => <p className="notice">Loading graph…</p>,
});
const ComplexityChart = dynamic(
  () => import("./charts").then((m) => m.ComplexityChart),
  { ssr: false },
);
export function VisualLabs() {
  const { t } = useAcademy();
  const [tab, setTab] = useState("memory");
  return (
    <>
      <PageHeading
        eyebrow={t(b("MAKE THE INVISIBLE VISIBLE", "GÖRÜNMƏYƏNİ GÖRÜNƏN ET"))}
        title={t(
          b(
            "A mental model you can move.",
            "Hərəkət etdirə bildiyin düşüncə modeli.",
          ),
        )}
        description={t(
          b(
            "Change one assumption. Watch what follows. Every animation is an illustrative model, not a Swift runtime measurement.",
            "Bir fərziyyəni dəyiş. Nəticəsini izlə. Hər animasiya illüstrativ modeldir, Swift runtime ölçməsi deyil.",
          ),
        )}
      />
      <div className="tabs">
        {[
          ["memory", b("Memory & ARC", "Yaddaş və ARC")],
          ["cow", b("Copy-on-write", "Copy-on-write")],
          ["concurrency", b("Concurrency", "Concurrency")],
          ["performance", b("Complexity", "Mürəkkəblik")],
          ["architecture", b("Architecture", "Arxitektura")],
        ].map(([id, label]) => (
          <button
            key={id as string}
            onClick={() => setTab(id as string)}
            className={tab === id ? "selected" : ""}
          >
            {t(label as { en: string; az: string })}
          </button>
        ))}
      </div>
      {tab === "memory" ? (
        <MemoryLab />
      ) : tab === "cow" ? (
        <CowLab />
      ) : tab === "concurrency" ? (
        <ConcurrencyLab />
      ) : tab === "performance" ? (
        <PerformanceLab />
      ) : (
        <ArchitectureLab embedded />
      )}
    </>
  );
}
export function MemoryLab() {
  const { t } = useAcademy();
  const [owner, setOwner] = useState(true);
  const [stored, setStored] = useState(false);
  const [strong, setStrong] = useState(true);
  const count = arcCount(owner, strong, stored);
  const alive = count > 0;
  return (
    <div className="two-column">
      <Card className="padded">
        <div className="lab-legend">
          <span>
            {t(b("CONCEPTUAL OWNERSHIP GRAPH", "KONSEPTUAL OWNERSHIP QRAFI"))}
          </span>
          <span>ARC / 01</span>
        </div>
        <div className="lab-scene lab-scene-grid">
          <div className="lab-row">
            <div className="lab-object" style={{ opacity: owner ? 1 : 0.4 }}>
              <strong>Owner</strong>
              <small>
                {t(
                  owner
                    ? b("strong → screen", "strong → ekran")
                    : b("released", "buraxılıb"),
                )}
              </small>
            </div>
            <span className="lab-arrow">{owner ? "→" : "×"}</span>
            <div className="lab-object" style={{ opacity: alive ? 1 : 0.35 }}>
              <strong>Screen</strong>
              <small>
                {t(alive ? b("alive", "yaşayır") : b("deallocated", "silinib"))}
              </small>
            </div>
          </div>
          <div className="lab-log">
            {stored
              ? `Screen → closure ${strong ? "→ strong Screen ↺" : "⇢ weak Screen"}`
              : "Screen.action = nil"}
            <br />
            {t(b("Strong owners: ", "Güclü sahiblər: "))}
            {count}
            {!alive && (
              <>
                <br />
                deinit → weak = nil
              </>
            )}
          </div>
        </div>
        <div className="lab-controls">
          <button
            className="button secondary"
            disabled={!owner}
            onClick={() => setStored(true)}
          >
            {t(b("Store closure", "Closure saxla"))}
          </button>
          <button
            className="button primary"
            disabled={!owner}
            onClick={() => setOwner(false)}
          >
            {t(b("Release outside owner", "Xarici owner-i burax"))}
          </button>
          <button
            className="button secondary"
            onClick={() => {
              setOwner(true);
              setStored(false);
              setStrong(true);
            }}
          >
            <RotateCcw size={13} />
            {t(b("Reset", "Sıfırla"))}
          </button>
        </div>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={!strong}
            onChange={(e) => setStrong(!e.target.checked)}
          />
          {t(
            b(
              "Use a weak closure capture",
              "Closure-da weak capture istifadə et",
            ),
          )}
        </label>
      </Card>
      <Card className="padded">
        <p className="eyebrow">
          {t(b("FOLLOW THE RETENTION PATH", "SAXLAMA YOLUNU İZLƏ"))}
        </p>
        <h2>
          {t(
            !owner && alive
              ? b("The cycle keeps it alive.", "Dövr obyekti yaşadır.")
              : !alive
                ? b("No strong owners remain.", "Güclü sahib qalmayıb.")
                : b("Who keeps the screen alive?", "Ekranı kim yaşadır?"),
          )}
        </h2>
        <p>
          {t(
            !owner && alive
              ? b(
                  "The screen stores a closure; the closure strongly captures the screen. Removing the outside reference cannot break this internal cycle. Use the weak toggle to break the back-reference.",
                  "Ekran closure-u saxlayır, closure da ekranı güclü capture edir. Xarici istinadı buraxmaq daxili dövrü qırmır. Geri istinadı qırmaq üçün weak seç.",
                )
              : !alive
                ? b(
                    "The last strong owner was released. In this simplified graph the screen deinitializes and weak observers become nil. Weak observers do not own the object.",
                    "Son güclü sahib buraxıldı. Bu sadə qrafda ekran deinitialize olur və weak müşahidəçilər nil olur. Weak müşahidəçi obyektə sahib deyil.",
                  )
                : b(
                    "First store a closure, then release the outside owner. Compare strong and weak capture. The counts model this graph only; real ARC optimizations are not measured here.",
                    "Əvvəl closure saxla, sonra xarici owner-i burax. Strong və weak capture-u müqayisə et. Say yalnız bu qrafın modelidir; real ARC optimallaşdırmaları ölçülmür.",
                  ),
          )}
        </p>
        <div className="notice">
          {t(
            b(
              "unowned is deliberately not a “safe weak” toggle. Reading an unowned reference after destruction traps. Ownership and task cancellation are separate decisions.",
              "unowned “təhlükəsiz weak” seçimi deyil. Obyekt silindikdən sonra unowned oxumaq trap yaradır. Ownership və task cancellation ayrı qərarlardır.",
            ),
          )}
        </div>
        <Link className="text-link" href="/learn/topic-08">
          {t(b("Study ARC in depth", "ARC-ı dərindən öyrən"))}
          <ArrowRight size={14} />
        </Link>
      </Card>
    </div>
  );
}
function CowLab() {
  const { t } = useAcademy();
  const [copied, setCopied] = useState(false);
  const [mutated, setMutated] = useState(false);
  return (
    <div className="two-column">
      <Card className="padded">
        <div className="lab-scene lab-scene-grid">
          <div className="lab-legend">
            <span>COPY-ON-WRITE</span>
            <span>{t(b("Illustrative storage", "İllüstrativ storage"))}</span>
          </div>
          <div className="lab-row">
            <div className="lab-object">
              <strong>a</strong>
              <small>[1, 2]</small>
            </div>
            <span className="lab-arrow">→</span>
            <div className="lab-object">
              <strong>Buffer 1</strong>
              <small>[1, 2]</small>
            </div>
          </div>
          {copied && (
            <div className="lab-row" style={{ minHeight: 100 }}>
              <div className="lab-object">
                <strong>b</strong>
                <small>{mutated ? "[1, 2, 3]" : "[1, 2]"}</small>
              </div>
              <span className="lab-arrow">→</span>
              <div className="lab-object">
                <strong>{mutated ? "Buffer 2" : "Buffer 1"}</strong>
                <small>
                  {t(
                    mutated
                      ? b("independent storage", "müstəqil storage")
                      : b("shared storage", "paylaşılan storage"),
                  )}
                </small>
              </div>
            </div>
          )}
        </div>
        <div className="lab-controls">
          <button
            disabled={copied}
            className="button secondary"
            onClick={() => setCopied(true)}
          >
            var b = a
          </button>
          <button
            disabled={!copied || mutated}
            className="button primary"
            onClick={() => setMutated(true)}
          >
            b.append(3)
          </button>
          <button
            className="button secondary"
            onClick={() => {
              setCopied(false);
              setMutated(false);
            }}
          >
            <RotateCcw size={13} />
            {t(b("Reset", "Sıfırla"))}
          </button>
        </div>
      </Card>
      <Card className="padded">
        <h2>
          {t(
            b(
              "Independent values. Shared until mutation.",
              "Müstəqil dəyərlər. Mutasiyaya qədər paylaşma.",
            ),
          )}
        </h2>
        <p>
          {t(
            b(
              "Copying the Array gives independent logical values. Storage can initially be shared; mutation separates storage when uniqueness requires it. This teaching model does not expose actual buffer addresses or count allocations.",
              "Array kopyası müstəqil məntiqi dəyərlər verir. Storage əvvəl paylaşıla bilər; mutasiya unikallıq tələb edəndə storage ayrılır. Bu tədris modeli həqiqi buffer ünvanı və allocation sayı göstərmir.",
            ),
          )}
        </p>
        <div className="notice">
          {t(
            b(
              "If the array contains class instances, copying its storage does not deep-copy those objects. Both arrays can still reference the same objects.",
              "Array class obyektləri saxlayırsa storage kopyası obyektləri deep-copy etmir. Hər iki array eyni obyektlərə istinad edə bilər.",
            ),
          )}
        </div>
        <Link href="/learn/topic-02" className="text-link">
          {t(b("Study value semantics", "Dəyər semantikasını öyrən"))}
          <ArrowRight size={14} />
        </Link>
      </Card>
    </div>
  );
}
function ConcurrencyLab() {
  const { t } = useAcademy();
  const [order, setOrder] = useState<"old-first" | "new-first">("new-first");
  const [guarded, setGuarded] = useState(false);
  const [ran, setRan] = useState(false);
  const outcome = staleOutcome(order, guarded);
  return (
    <div className="two-column">
      <Card className="padded">
        <div className="lab-scene lab-scene-grid">
          <div className="lab-legend">
            <span>ACTOR REENTRANCY</span>
            <span>
              {t(
                b(
                  "Completion-order simulation",
                  "Tamamlanma sırası simulyasiyası",
                ),
              )}
            </span>
          </div>
          <div className="timeline">
            <div className="timeline-lane">
              <span>A · old</span>
              <div className="timeline-track old">
                <span style={{ width: order === "new-first" ? "92%" : "43%" }}>
                  await service(A)
                </span>
              </div>
            </div>
            <div className="timeline-lane">
              <span>B · new</span>
              <div className="timeline-track">
                <span
                  style={{
                    left: "20%",
                    width: order === "new-first" ? "40%" : "72%",
                  }}
                >
                  await service(B)
                </span>
              </div>
            </div>
          </div>
          {ran && (
            <div className="lab-result" role="status">
              <span>{t(b("Visible result", "Görünən nəticə"))}</span>
              <strong>
                {outcome}{" "}
                {outcome === "A"
                  ? t(b("· stale", "· köhnə"))
                  : t(b("· current", "· cari"))}
              </strong>
            </div>
          )}
          <div className="lab-log mt">
            {guarded
              ? "guard capturedGeneration == generation else { return }"
              : "@MainActor // isolation alone is not latest-wins"}
          </div>
        </div>
        <label className="space mt">
          {t(b("Completion order", "Tamamlanma sırası"))}
          <select
            value={order}
            onChange={(e) => {
              setOrder(e.target.value as typeof order);
              setRan(false);
            }}
          >
            <option value="new-first">B → A</option>
            <option value="old-first">A → B</option>
          </select>
        </label>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={guarded}
            onChange={(e) => {
              setGuarded(e.target.checked);
              setRan(false);
            }}
          />
          {t(
            b(
              "Check generation after await",
              "await-dən sonra generation yoxla",
            ),
          )}
        </label>
        <button className="button primary mt" onClick={() => setRan(true)}>
          <Play size={13} />
          {t(b("Run the scenario", "Ssenarini başlat"))}
        </button>
      </Card>
      <Card className="padded">
        <h2>
          {t(
            b(
              "No data race. Still the wrong answer.",
              "Data race yoxdur. Cavab yenə yanlışdır.",
            ),
          )}
        </h2>
        <p>
          {t(
            b(
              "Both requests execute under the same actor. At await, other work can enter and change the current query. If A finishes after B, A can overwrite the newer result without ever accessing memory concurrently.",
              "Hər iki sorğu eyni actor altındadır. await zamanı başqa iş daxil olub cari sorğunu dəyişə bilər. A, B-dən sonra bitsə, yaddaşa eyni anda giriş olmadan da daha yeni nəticəni əvəz edə bilər.",
            ),
          )}
        </p>
        <p>
          {t(
            b(
              "Cancellation reduces wasted work; operation identity decides whether a result is still relevant. Choose an explicit product policy: latest-wins, ignore duplicate taps, or serialize operations.",
              "Cancellation artıq işi azaldır; əməliyyat kimliyi nəticənin hələ aktual olduğunu müəyyən edir. Məhsul siyasətini açıq seç: latest-wins, təkrar basmanı atlama və ya serial icra.",
            ),
          )}
        </p>
        <Link className="text-link" href="/learn/topic-12">
          {t(b("Study concurrency ownership", "Concurrency ownership-i öyrən"))}
          <ArrowRight size={14} />
        </Link>
      </Card>
    </div>
  );
}
function PerformanceLab() {
  const { t } = useAcademy();
  const [n, setN] = useState(100);
  return (
    <Card className="padded">
      <p className="eyebrow">
        {t(
          b(
            "THEORETICAL GROWTH, NOT BENCHMARKS",
            "NƏZƏRİ ARTIM, BENCHMARK DEYİL",
          ),
        )}
      </p>
      <h2>
        {t(
          b(
            "The shape of the work matters.",
            "İşin artım forması əhəmiyyətlidir.",
          ),
        )}
      </h2>
      <p>
        {t(
          b(
            "Illustrative operation counts for idealized algorithms. Dictionary lookup is expected O(1), not a universal worst-case guarantee. These curves are not measured Swift timings.",
            "İdeallaşdırılmış alqoritmlər üçün illüstrativ əməliyyat sayı. Dictionary lookup expected O(1)-dir, universal worst-case zəmanəti deyil. Əyrilər ölçülmüş Swift vaxtları deyil.",
          ),
        )}
      </p>
      <label>
        {t(b("Input size", "Giriş ölçüsü"))}: {n}
        <input
          type="range"
          min={10}
          max={1000}
          step={10}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
        />
      </label>
      <ComplexityChart n={n} />
      <div className="three-column mt">
        {[
          ["O(1)", 1],
          ["O(n)", n],
          ["O(n²)", n * n],
        ].map(([label, value]) => (
          <div key={label} className="notice">
            <strong>{label}</strong>
            <p>
              {Number(value).toLocaleString()}{" "}
              {t(b("model operations", "model əməliyyatı"))}
            </p>
          </div>
        ))}
      </div>
      <p className="small faint">
        {t(
          b(
            "Measure real main-thread work with Instruments; asymptotic analysis does not include rendering, allocation or cache effects.",
            "Həqiqi main-thread işini Instruments ilə ölç; asimptotik analiz rendering, allocation və cache effektlərini daxil etmir.",
          ),
        )}
      </p>
    </Card>
  );
}
const scenarios = [
  b("Transaction history with pagination", "Səhifələnən əməliyyat tarixçəsi"),
  b("Secure money transfer", "Təhlükəsiz pul köçürməsi"),
  b("Concurrent token refresh", "Paralel token refresh"),
  b("Offline transaction caching", "Oflayn əməliyyat cache-i"),
  b("Deep-link routing", "Deep-link yönləndirilməsi"),
  b("Image-heavy feed", "Şəkil əsaslı lent"),
  b("Account dashboard", "Hesab dashboard-u"),
  b("Deposit management", "Əmanətin idarə edilməsi"),
  b("Modular banking app", "Modullu bank tətbiqi"),
];
export function ArchitectureLab({ embedded = false }: { embedded?: boolean }) {
  const { t, state, setState } = useAcademy();
  const [scenario, setScenario] = useState(0);
  const [repository, setRepository] = useState(true);
  const [useCase, setUseCase] = useState(false);
  const [selected, setSelected] = useState("view");
  const [showFeedback, setShowFeedback] = useState(false);
  const [diagram, setDiagram] = useState(false);
  const descriptions = {
    view: b(
      "Renders state and emits intent. Own local visual state, not transport.",
      "State-i göstərir və niyyət göndərir. Lokal vizual state-ə sahibdir, transport-a deyil.",
    ),
    vm: b(
      "Owns presentation state, starts or awaits work, validates operation identity and requests navigation.",
      "Presentation state-ə sahibdir, işi başladır və ya gözləyir, əməliyyat kimliyini yoxlayır və naviqasiya istəyir.",
    ),
    policy: b(
      "Owns reusable business policy and multi-step decisions. A forwarding wrapper alone adds little value.",
      "Təkrar istifadə olunan biznes qaydasına və çoxaddımlı qərara sahibdir. Sadəcə forwarding wrapper az fayda verir.",
    ),
    repository: b(
      "Coordinates sources, cache freshness and reconciliation behind a consumer-oriented contract.",
      "İstehlakçı yönümlü müqavilə arxasında mənbə, cache aktuallığı və reconciliation-u idarə edir.",
    ),
    network: b(
      "Performs transport, validates responses and maps infrastructure failures. Avoid leaking vendor models.",
      "Transport-u edir, cavabı yoxlayır və infrastruktur xətasını uyğunlaşdırır. Vendor modelini sızdırma.",
    ),
    router: b(
      "Executes typed routes and respects host-owned navigation lifetimes.",
      "Typed route-ları icra edir və host naviqasiyasının lifetime-ına əməl edir.",
    ),
  };
  const nodes = [
    { id: "view", label: "View", description: t(descriptions.view) },
    { id: "vm", label: "ViewModel", description: t(descriptions.vm) },
    ...(useCase
      ? [
          {
            id: "policy",
            label: "UseCase",
            description: t(descriptions.policy),
          },
        ]
      : []),
    ...(repository
      ? [
          {
            id: "repository",
            label: "Repository",
            description: t(descriptions.repository),
          },
        ]
      : []),
    {
      id: "network",
      label: "Network adapter",
      description: t(descriptions.network),
    },
    { id: "router", label: "Router", description: t(descriptions.router) },
  ];
  const chain = [
    "view",
    "vm",
    ...(useCase ? ["policy"] : []),
    ...(repository ? ["repository"] : []),
    "network",
  ];
  const edges = chain
    .slice(1)
    .map((target, i) => ({ source: chain[i], target }))
    .concat({ source: "vm", target: "router" });
  const noteKey = "design-" + scenario;
  return (
    <>
      {!embedded && (
        <PageHeading
          eyebrow={t(b("DECISIONS, NOT DOGMA", "QƏRARLAR, DOQMA DEYİL"))}
          title={t(
            b("Architecture decision lab", "Arxitektura qərar laboratoriyası"),
          )}
          description={t(
            b(
              "Choose boundaries. Explain the trade-offs. A diagram is only useful when you can defend its arrows.",
              "Sərhədləri seç. Seçimlərini əsaslandır. Qrafın oxlarını izah edə bilirsənsə faydalıdır.",
            ),
          )}
        />
      )}
      <div className="toolbar">
        <label style={{ minWidth: 260 }}>
          {t(b("Scenario", "Ssenari"))}
          <select
            value={scenario}
            onChange={(e) => {
              setScenario(Number(e.target.value));
              setShowFeedback(false);
            }}
          >
            {scenarios.map((s, i) => (
              <option key={i} value={i}>
                {t(s)}
              </option>
            ))}
          </select>
        </label>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={repository}
            onChange={(e) => setRepository(e.target.checked)}
          />
          {t(b("Repository boundary", "Repository sərhədi"))}
        </label>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={useCase}
            onChange={(e) => setUseCase(e.target.checked)}
          />
          {t(b("Use-case policy", "Use-case qaydası"))}
        </label>
      </div>
      <div className="two-column">
        <div>
          <Graph nodes={nodes} edges={edges} onSelect={setSelected} />
          <label className="mt">
            {t(
              b(
                "Inspect a component (keyboard alternative)",
                "Komponenti araşdır (klaviatura alternativi)",
              ),
            )}
            <select
              value={nodes.some((n) => n.id === selected) ? selected : "vm"}
              onChange={(e) => setSelected(e.target.value)}
            >
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
          </label>
          <div className="notice mt">
            <strong>
              {nodes.find((n) => n.id === selected)?.label || "ViewModel"}
            </strong>
            <p className="small" style={{ marginTop: 8 }}>
              {nodes.find((n) => n.id === selected)?.description ||
                t(descriptions.vm)}
            </p>
          </div>
          <button
            className="button secondary"
            onClick={() => setDiagram(!diagram)}
          >
            {t(b("View sequence diagram", "Ardıcıllıq diaqramını göstər"))}
          </button>
          {diagram && <MermaidDiagram />}
        </div>
        <Card className="padded">
          <p className="eyebrow">
            {t(b("DEFEND YOUR DESIGN", "DİZAYNINI ƏSASLANDIR"))}
          </p>
          <h2>{t(scenarios[scenario])}</h2>
          <ul className="plain-list">
            {[
              b(
                "Who owns state, navigation and task cancellation?",
                "State, naviqasiya və task cancellation-un sahibi kimdir?",
              ),
              b(
                "What is the source of truth when offline?",
                "Oflayn olduqda source of truth nədir?",
              ),
              b(
                "What happens after an out-of-order response or logout?",
                "Sırasız cavab və ya logout-dan sonra nə olur?",
              ),
              b(
                "Which boundary owns policy rather than forwarding?",
                "Hansı sərhəd ötürməyə deyil, qaydaya sahibdir?",
              ),
              b(
                "What test would fail if this decision were wrong?",
                "Bu qərar səhv olsa hansı test uğursuz olar?",
              ),
            ].map((q, i) => (
              <li key={i}>{t(q)}</li>
            ))}
          </ul>
          <textarea
            rows={6}
            aria-label={t(
              b("Architecture justification", "Arxitektura əsaslandırması"),
            )}
            value={state.privateNotes[noteKey] || ""}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                privateNotes: { ...s.privateNotes, [noteKey]: e.target.value },
              }))
            }
            placeholder={t(
              b(
                "Explain responsibilities, failure behavior and alternatives…",
                "Məsuliyyətləri, xəta davranışını və alternativləri izah et…",
              ),
            )}
          />
          <button
            className="button primary mt"
            onClick={() => setShowFeedback(true)}
          >
            <ShieldCheck size={14} />
            {t(b("Review the trade-offs", "Seçimləri nəzərdən keçir"))}
          </button>
          {showFeedback && (
            <div className="notice mt" role="status">
              <p>
                {t(
                  repository
                    ? b(
                        "Repository selected: explain cache freshness and reconciliation. If it only forwards one request, a directly injected service can be simpler.",
                        "Repository seçilib: cache aktuallığını və reconciliation-u izah et. Bir sorğunu ötürürsə birbaşa servis daha sadə ola bilər.",
                      )
                    : b(
                        "Direct service path: lower ceremony, but presentation now needs explicit handling of transport-shaped models and caching policy.",
                        "Birbaşa servis yolu: az əlavə kod, amma presentation transport modelini və cache qaydasını açıq idarə etməlidir.",
                      ),
                )}
              </p>
              <p>
                {t(
                  useCase
                    ? b(
                        "Use case selected: identify independent business rules. Keep it domain-oriented and test multi-step failures.",
                        "Use case seçilib: müstəqil biznes qaydasını müəyyən et. Domen dilini saxla və çoxaddımlı xətanı test et.",
                      )
                    : b(
                        "No use case: valid for straightforward orchestration. Extract policy if it becomes shared or hard to test in presentation.",
                        "Use case yoxdur: sadə koordinasiya üçün uyğundur. Qayda paylaşılanda və ya presentation-da test çətinləşəndə ayır.",
                      ),
                )}
              </p>
              <p className="small">
                {t(
                  b(
                    "This is a design checklist, not automated correctness scoring. More layers do not imply a better answer.",
                    "Bu dizayn yoxlama siyahısıdır, avtomatik düzgünlük qiyməti deyil. Çox qat daha yaxşı cavab demək deyil.",
                  ),
                )}
              </p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
function MermaidDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useAcademy();
  const [error, setError] = useState(false);
  useEffect(() => {
    let cancelled = false;
    import("mermaid")
      .then(async ({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "dark",
        });
        const { svg } = await mermaid.render(
          "sequence-" + crypto.randomUUID().replaceAll("-", ""),
          "sequenceDiagram\nparticipant V as View\nparticipant VM as ViewModel\nparticipant S as Service\nV->>VM: intent\nVM->>S: await load(operationID)\nS-->>VM: response\nNote over VM: Check current operation ID\nVM-->>V: new state",
        );
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      })
      .catch(() => setError(true));
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <div className="notice mt" ref={ref}>
      {error
        ? t(
            b(
              "Diagram could not load. Read the equivalent View → ViewModel → Service → identity check → State flow.",
              "Diaqram yüklənmədi. Ekvivalent axın: View → ViewModel → Service → identity yoxlaması → State.",
            ),
          )
        : t(b("Rendering diagram…", "Diaqram hazırlanır…"))}
    </div>
  );
}
