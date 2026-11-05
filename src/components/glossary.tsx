"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { useAcademy } from "./provider";
import { PageHeading, Card } from "./ui";
import { bi as b } from "@/lib/types";
const entries = [
  [
    "Value semantics",
    "Dəyər semantikası",
    "Copying produces an independent logical value. It does not promise stack allocation or deep-copying referenced objects.",
    "Kopyalama müstəqil məntiqi dəyər yaradır. Stack allocation və ya istinad edilən obyektin deep copy olunması zəmanəti deyil.",
  ],
  [
    "Reference semantics",
    "İstinad semantikası",
    "Multiple references can reach the same object, making shared mutations observable.",
    "Bir neçə istinad eyni obyektə çatır və paylaşılan mutasiyalar görünür.",
  ],
  [
    "Automatic Reference Counting",
    "Avtomatik istinad sayımı",
    "The ownership mechanism that releases class instances when strong ownership ends. It does not automatically break strong cycles.",
    "Güclü ownership bitəndə class obyektini buraxan mexanizm. Güclü dövrləri avtomatik qırmır.",
  ],
  [
    "Retain cycle",
    "Qarşılıqlı güclü istinad dövrü",
    "An ownership cycle that can keep objects alive after outside owners are released. Draw who retains whom.",
    "Xarici sahiblər buraxıldıqdan sonra obyektləri yaşada bilən ownership dövrü. Kimin kimi saxladığını çək.",
  ],
  [
    "Weak reference",
    "Zəif istinad",
    "A non-owning reference that becomes nil when its object is deallocated. It does not cancel asynchronous work.",
    "Obyektə sahib olmayan və obyekt silinəndə nil olan istinad. Async işi ləğv etmir.",
  ],
  [
    "Unowned reference",
    "Sahib olmayan istinad",
    "A non-owning reference whose validity depends on a lifetime precondition. Access after destruction traps.",
    "Etibarlılığı lifetime şərtindən asılı olan, sahib olmayan istinad. Obyekt silindikdən sonra giriş trap yaradır.",
  ],
  [
    "Copy-on-write",
    "Yazılarkən kopyalama",
    "A storage strategy that shares backing storage until a mutation needs uniqueness, while preserving value semantics.",
    "Dəyər semantikasını qoruyaraq mutasiya unikallıq tələb edənə qədər storage paylaşan strategiya.",
  ],
  [
    "Actor isolation",
    "Actor izolyasiyası",
    "An isolation boundary for state access. Suspension permits other actor work, so logical races remain possible.",
    "State girişinin izolyasiya sərhədi. Suspension başqa actor işinə imkan verir; məntiqi race hələ mümkündür.",
  ],
  [
    "Actor reentrancy",
    "Actor-a təkrar daxilolma",
    "Other work can run on an actor while an async method is suspended. Revalidate invariants after await.",
    "Async metod suspend olanda actor-da başqa iş işləyə bilər. await-dən sonra invariantı yenidən yoxla.",
  ],
  [
    "Sendable",
    "Təhlükəsiz ötürülmə müqaviləsi",
    "A type-level contract for safe transfer across concurrency boundaries. It is not equivalent to deep immutability.",
    "Concurrency sərhədləri arasında təhlükəsiz ötürülmə üçün tip müqaviləsi. Dərin dəyişməzliklə eyni deyil.",
  ],
  [
    "Structured concurrency",
    "Strukturlaşdırılmış concurrency",
    "Child-task lifetimes are bounded by their scope. Cancellation propagates but is cooperative.",
    "Child task lifetime-ı scope ilə məhduddur. Cancellation ötürülür, amma əməkdaşlıq tələb edir.",
  ],
  [
    "Suspension point",
    "Dayandırılma nöqtəsi",
    "A point where an async function may yield execution. await is not a promise of parallelism or a thread switch.",
    "Async funksiyanın icranı verə bildiyi nöqtə. await paralellik və ya thread dəyişməsi vədi deyil.",
  ],
  [
    "Dependency injection",
    "Asılılıqların xaricdən ötürülməsi",
    "Supplying collaborators from outside an object. Different from the dependency inversion principle.",
    "Obyektin əməkdaşlarını xaricdən vermək. Dependency inversion prinsipindən fərqlidir.",
  ],
  [
    "Dependency inversion",
    "Asılılıq istiqamətinin çevrilməsi",
    "Structuring code around policy-owned abstractions rather than making policy depend on infrastructure details.",
    "Qaydanı infrastruktur detallarından asılı etmək əvəzinə kodu qaydaya aid abstraksiyalar ətrafında qurmaq.",
  ],
  [
    "Composition root",
    "Qurulma nöqtəsi",
    "The boundary that chooses implementations, configures lifetimes and assembles the application graph.",
    "İmplementasiyanı seçən, lifetime-ı quran və tətbiq qrafını birləşdirən sərhəd.",
  ],
  [
    "Service locator",
    "Servis axtarıcısı",
    "A lookup mechanism used by a consumer to find dependencies, often hiding construction requirements.",
    "İstehlakçının asılılığı tapmaq üçün istifadə etdiyi, qurulma tələbini çox vaxt gizlədən mexanizm.",
  ],
  [
    "Repository",
    "Məlumat mənbəyi sərhədi",
    "A contract that may coordinate sources, cache policy or reconciliation. A type name alone does not establish those behaviors.",
    "Mənbə, cache siyasəti və ya reconciliation-u koordinasiya edə bilən müqavilə. Təkcə tip adı bu davranışları sübut etmir.",
  ],
  [
    "Idempotency",
    "İdempotentlik",
    "Repeating an operation has the same intended effect as doing it once. Backend contracts determine safe retries.",
    "Əməliyyatı təkrarlamaq bir dəfə icra ilə eyni nəzərdə tutulan təsiri verir. Təhlükəsiz retry-ni backend müqaviləsi müəyyən edir.",
  ],
  [
    "Single-flight",
    "Tək paylaşılan əməliyyat",
    "Concurrent callers join one in-flight operation, such as token refresh, with explicit waiter cancellation policy.",
    "Paralel çağıranlar gözləyənin cancellation qaydası açıq olan bir əməliyyata, məsələn token refresh-ə qoşulur.",
  ],
  [
    "Source of truth",
    "Əsas həqiqət mənbəyi",
    "The authority for a piece of state. Offline caches need explicit freshness and synchronization policy.",
    "Bir state hissəsi üçün səlahiyyətli mənbə. Oflayn cache açıq aktuallıq və sinxronizasiya qaydası tələb edir.",
  ],
  [
    "Witness table",
    "Uyğunluq cədvəli",
    "A conceptual runtime mechanism for locating protocol requirement implementations through a conformance. Exact representation is an implementation detail.",
    "Conformance vasitəsilə protocol requirement implementasiyasını tapmaq üçün konseptual runtime mexanizmi. Dəqiq quruluş implementasiya detalıdır.",
  ],
  [
    "Opaque type",
    "Gizli konkret tip",
    "some Protocol preserves a single underlying concrete type selected by the implementation.",
    "some Protocol implementasiyanın seçdiyi tək konkret tipi saxlayır.",
  ],
  [
    "Existential type",
    "Existential tip",
    "any Protocol can hold values of different conforming types. Available operations depend on the protocol and language rules.",
    "any Protocol müxtəlif uyğun tip dəyərləri saxlaya bilər. Əməliyyatlar protokol və dil qaydalarından asılıdır.",
  ],
  [
    "Provenance",
    "Mənbə mənşəyi",
    "The evidence behind a claim: source file, revision, line range, or historical report. Distinguish observed facts from inference.",
    "İddianın sübutu: mənbə faylı, revision, sətir aralığı və ya tarixi icmal. Müşahidə edilən faktı fərziyyədən ayır.",
  ],
];
export function Glossary() {
  const { t } = useAcademy();
  const [query, setQuery] = useState("");
  return (
    <>
      <PageHeading
        eyebrow="AZ ↔ EN"
        title={t(
          b(
            "Speak the same engineering language.",
            "Eyni mühəndislik dilində danış.",
          ),
        )}
        description={t(
          b(
            "Natural Azerbaijani explanations beside the terminology you need in an English-language interview.",
            "İngilisdilli müsahibə terminləri ilə yanaşı təbii Azərbaycan dilində izahlar.",
          ),
        )}
      />
      <div className="search-input mb">
        <Search size={16} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={t(b("Search glossary", "Termin axtar"))}
          placeholder={t(
            b(
              "Search a term in either language…",
              "Hər iki dildə termin axtar…",
            ),
          )}
        />
      </div>
      <div className="glossary-grid">
        {entries
          .filter((e) =>
            e.join(" ").toLowerCase().includes(query.toLowerCase()),
          )
          .map(([en, az, enText, azText]) => (
            <Card className="glossary-entry" key={en}>
              <h3>{en}</h3>
              <h4>{az}</h4>
              <p lang="en">{enText}</p>
              <p lang="az">{azText}</p>
            </Card>
          ))}
      </div>
    </>
  );
}
