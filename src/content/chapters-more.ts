import { bi as b, type Localized } from "@/lib/types";
import { lessonById } from "./lessons";
import type { Chapter, InterviewQuestion } from "./chapter-types";
type Expansion = {
  id: string;
  before: Localized;
  objectives: Localized[];
  why: Localized[];
  mechanism: Localized[];
  decision: Localized[];
  analogy: Localized;
  example: Chapter["examples"][number];
  debug: Chapter["debug"];
  interviews: InterviewQuestion[];
  exercise: Chapter["exercise"];
};
function extend(e: Expansion): Chapter {
  const l = lessonById[e.id];
  return {
    topicId: e.id,
    prerequisiteNote: e.before,
    objectives: e.objectives,
    sections: [
      {
        id: "foundation",
        level: "junior",
        title: b(
          "From zero: the problem this concept solves",
          "Sıfırdan: anlayışın həll etdiyi problem",
        ),
        paragraphs: [l.intro, ...e.why],
        analogy: e.analogy,
      },
      {
        id: "mechanism",
        level: "middle",
        title: b(
          "Follow the mechanism into production",
          "Mexanizmi praktikaya qədər izlə",
        ),
        paragraphs: [l.mechanism, ...e.mechanism],
      },
      {
        id: "judgment",
        level: "senior",
        title: b(
          "Defend the boundary and its trade-offs",
          "Sərhədi və seçimlərini əsaslandır",
        ),
        paragraphs: [l.judgment, ...e.decision],
      },
    ],
    examples: [e.example],
    debug: e.debug,
    interviews: e.interviews,
    exercise: e.exercise,
  };
}
export const moreChapters: Chapter[] = [
  extend({
    id: "topic-01",
    before: b(
      "Start here if nil, Optional and guard feel like syntax to memorize. We will model a missing account before choosing an unwrapping operator.",
      "nil, Optional və guard əzbərlənən sintaksis kimi görünürsə buradan başla. Unwrap operator seçməzdən əvvəl çatışmayan hesabı modelləşdirəcəyik.",
    ),
    objectives: [
      b(
        "Represent absence without fake IDs or crashes.",
        "Saxta ID və crash olmadan yoxluğu modelləşdir.",
      ),
      b(
        "Choose binding, chaining and defaults from their meaning.",
        "Binding, chaining və default-u mənasına görə seç.",
      ),
    ],
    why: [
      b(
        "Suppose your API returns an account nickname. Some customers never set one. A plain String would force you to pretend an empty string is the same as “not provided.” Optional<String> records that the value might not exist. The compiler then requires you to handle the absence before using operations that need an actual String. This moves an important decision out of a runtime surprise and into the API contract.",
        "API hesabın nickname-ini qaytarır, amma bəzi müştəri onu təyin etməyib. Adi String boş mətnlə “verilməyib” halını eyni saymağa məcbur edə bilər. Optional<String> dəyərin olmaya biləcəyini qeyd edir. Compiler həqiqi String tələb edən əməliyyatdan əvvəl yoxluğu idarə etməyini istəyir. Beləliklə vacib qərar runtime sürprizindən API müqaviləsinə keçir.",
      ),
      b(
        'Optional is conceptually enum Optional<Wrapped> { case none; case some(Wrapped) }. .some("") is a present empty string; .none is no string. Those may look identical in a text field but can mean different things to a server, validation rule or analytics event. Decide whether the distinction matters instead of deleting it by habit.',
        'Optional konseptual olaraq enum Optional<Wrapped> { case none; case some(Wrapped) } modelidir. .some("") mövcud boş mətn, .none isə mətnin yoxluğudur. Text field-də eyni görünsə də server, validation və analytics üçün fərqli ola bilər. Vərdişlə fərqi silmək əvəzinə onun lazım olub-olmadığını seç.',
      ),
    ],
    mechanism: [
      b(
        "if let unwraps inside one branch while allowing the surrounding function to continue afterward. guard let moves the failure exit up front and makes the unwrapped value available through the remaining scope. Neither is “more safe” in isolation; choose the control flow that expresses your precondition. Optional chaining evaluates further only when the receiver exists and propagates absence.",
        "if let bir budaq daxilində unwrap edir, sonra ətraf funksiya davam edə bilər. guard let xəta çıxışını əvvələ çəkir və qalan scope-da açılmış dəyəri verir. Ayrılıqda biri “daha təhlükəsiz” deyil; precondition-u ifadə edən axını seç. Optional chaining receiver varkən davam edir və yoxluğu ötürür.",
      ),
      b(
        "The ?? operator is correct only when the fallback is a valid domain value. A display nickname can fall back to “Account.” A missing payment destination cannot safely fall back to account ID 0. Force unwrap asserts that an invariant holds; if it does not, the program traps. An API value from an unreliable boundary is not made trustworthy by adding !.",
        "?? yalnız fallback domen üçün düzgün dəyərdirsə uyğundur. Display nickname “Account” ola bilər. Çatışmayan payment destination təhlükəsiz olaraq hesab ID 0 ola bilməz. Force unwrap invariantın doğruluğunu iddia edir; pozulsa proqram trap olur. Etibarsız API sərhədindən gələn dəyər ! əlavə etməklə etibarlı olmur.",
      ),
    ],
    decision: [
      b(
        "Do not use one nil to mean idle, loading, failure and missing. Optional can encode absence, not the reason for that absence. A balance screen may need an enum with idle, loading, loaded(Amount), unavailable and failed(Error). Once invalid combinations are impossible to express, rendering and tests become easier to reason about.",
        "Bir nil-i idle, loading, failure və missing üçün işlətmə. Optional yoxluğu kodlaşdırır, səbəbini deyil. Balans ekranına idle, loading, loaded(Amount), unavailable və failed(Error) enum-u lazım ola bilər. Səhv kombinasiya ifadə edilə bilməyəndə rendering və test daha aydın olur.",
      ),
      b(
        "At module boundaries, validate required identity once and pass a non-optional validated identifier inward. This shrinks the number of places that have to guess what missing means. Keep backend authority separate: a syntactically valid ID is not proof the current customer may access it.",
        "Modul sərhədində məcburi identity-ni bir dəfə yoxla, daxilə non-optional təsdiqli identifikator ötür. Bu, missing mənasını təxmin edən yerləri azaldır. Backend səlahiyyətini ayrı saxla: sintaktik düzgün ID cari müştərinin giriş icazəsi deyil.",
      ),
    ],
    analogy: b(
      "An Optional is a sealed envelope that is either empty or contains one typed value. Opening it does not tell you why it was empty; that reason needs another model.",
      "Optional boş və ya bir tipli dəyər saxlayan möhürlü zərfdir. Açmaq onun niyə boş olduğunu demir; səbəb başqa model istəyir.",
    ),
    example: {
      id: "optional-meaning",
      title: b(
        "Trace an absent value without inventing one",
        "Yox dəyəri uydurmadan izlə",
      ),
      setup: b(
        "Compare an absent nickname, a present empty nickname and a real nickname.",
        "Yox nickname, mövcud boş nickname və həqiqi nickname-i müqayisə et.",
      ),
      code: 'let names: [String?] = [nil, "", "Salary"]\nfor name in names {\n    if let name { print("present: [\\(name)]") }\n    else { print("missing") }\n}',
      output: b(
        "missing\npresent: []\npresent: [Salary]",
        "missing\npresent: []\npresent: [Salary]",
      ),
      steps: [
        b(
          "nil enters the absence branch. No String operation runs on a nonexistent value.",
          "nil yoxluq budağına keçir. Mövcud olmayan dəyərdə String əməliyyatı işləmir.",
        ),
        b(
          "The empty string unwraps successfully because it is present.",
          "Boş String mövcud olduğu üçün uğurla açılır.",
        ),
        b(
          "Salary unwraps as an ordinary String. Presence and business validity remain different questions.",
          "Salary adi String kimi açılır. Mövcudluq və biznes etibarlılığı ayrı sualdır.",
        ),
      ],
      takeaway: b(
        "Unwrapping answers “is there a value?” Validation answers “is this value allowed?”",
        "Unwrap “dəyər varmı?”, validation “bu dəyər icazəlidirmi?” sualını həll edir.",
      ),
    },
    debug: {
      title: b(
        "A default ID silently targets the wrong account",
        "Default ID səssiz yanlış hesab seçir",
      ),
      broken:
        "func destination(_ id: Int?) -> Int { id ?? 0 }\nprint(destination(nil)) // 0, but is 0 a valid account?",
      failure: b(
        "The function converts a missing required destination into a plausible number. Later code cannot tell whether 0 was chosen or invented.",
        "Funksiya məcburi destination yoxluğunu inandırıcı rəqəmə çevirir. Sonrakı kod 0-ın seçildiyini, yoxsa uydurulduğunu ayıra bilmir.",
      ),
      fixed:
        "enum DestinationError: Error { case missing, invalid }\nfunc destination(_ id: Int?) throws -> Int {\n    guard let id else { throw DestinationError.missing }\n    guard id > 0 else { throw DestinationError.invalid }\n    return id\n}",
      why: b(
        "The positive-ID rule is illustrative and must match the backend contract. Absence and invalidity now remain explicit; neither becomes a payment destination.",
        "Müsbət ID qaydası illüstrasiyadır və backend müqaviləsinə uyğun olmalıdır. Yoxluq və etibarsızlıq açıq qalır, heç biri payment destination-a çevrilmir.",
      ),
      test: b(
        "nil throws missing, 0 throws invalid, a permitted ID returns unchanged. Test authorization at its own boundary.",
        "nil missing, 0 invalid atır, icazəli ID dəyişmədən qayıdır. Avtorizasiyanı öz sərhədində test et.",
      ),
    },
    interviews: [
      {
        id: "optional-enum",
        level: "junior",
        question: b(
          "Why does Swift use Optional rather than allowing nil everywhere?",
          "Swift niyə hər yerdə nil əvəzinə Optional istifadə edir?",
        ),
        why: b(
          "This tests absence as part of a type contract.",
          "Yoxluğun tip müqaviləsində olmasını yoxlayır.",
        ),
        answer: b(
          "A non-optional type promises a value exists. Optional explicitly weakens that promise and requires handling .none or .some before value-dependent operations. It distinguishes an absent String from a present empty String and lets APIs state which fields are mandatory.",
          "Non-optional tip dəyərin varlığına söz verir. Optional vədi açıq zəiflədir və dəyər tələb edən işdən əvvəl .none/.some idarəsi istəyir. Yox String-i boş String-dən ayırır və API-yə məcburi sahəni bildirməyə imkan verir.",
        ),
        wrong: b(
          "“Optional is just a nullable pointer” ignores its generic enum semantics and value-type payloads.",
          "“Optional sadəcə nullable pointer-dir” generic enum semantikasını və value payload-u nəzərə almır.",
        ),
        followup: b(
          "Is .some(0) the same as .none?",
          ".some(0) .none ilə eynidirmi?",
        ),
        followupAnswer: b(
          "No. One is a present integer whose value is zero; the other is the absence of an integer.",
          "Xeyr. Biri sıfır dəyərli mövcud integer, digəri integer yoxluğudur.",
        ),
      },
      {
        id: "guard-binding",
        level: "middle",
        question: b(
          "When would you use guard let instead of if let or ???",
          "guard let-i if let və ya ?? əvəzinə nə vaxt seçərdin?",
        ),
        why: b(
          "A good answer explains control flow and a valid fallback.",
          "Yaxşı cavab control flow və düzgün fallback-i izah edir.",
        ),
        answer: b(
          "I use guard let when a value is a precondition for the rest of the scope and failure should exit early. if let suits a local optional branch. ?? suits a genuinely valid fallback. I would not use a fake ID to make a mandatory account field non-optional; I would validate it at the boundary and preserve a meaningful failure.",
          "Dəyər qalan scope-un precondition-udursa və xəta erkən çıxmalıdırsa guard let seçirəm. if let lokal optional budağa uyğundur. ?? həqiqətən düzgün fallback üçündür. Məcburi hesab sahəsini non-optional etmək üçün saxta ID yox, sərhəddə validation və mənalı xəta saxlayıram.",
        ),
        wrong: b(
          "“guard is always safer” avoids explaining the business precondition.",
          "“guard həmişə təhlükəsizdir” biznes precondition-u izah etmir.",
        ),
        followup: b(
          "When is force unwrap reasonable?",
          "Force unwrap nə vaxt əsaslıdır?",
        ),
        followupAnswer: b(
          "For a deliberate, locally justified invariant where failure should be a programmer error, such as controlled test construction. Explain the proof; do not apply it casually to external data.",
          "Xəta programmer error olmalı olan lokal əsaslandırılmış invariantda, məsələn idarə olunan test qurulmasında. Sübutu de; xarici data-ya düşünmədən tətbiq etmə.",
        ),
      },
      {
        id: "optional-state",
        level: "senior",
        question: b(
          "Why can Balance? be an inadequate screen state?",
          "Balance? niyə ekran state-i üçün yetərsiz ola bilər?",
        ),
        why: b(
          "This moves from syntax to product-state modeling.",
          "Sintaksisdən məhsul state modelinə keçir.",
        ),
        answer: b(
          "nil collapses several reasons: not requested, loading, unavailable or failed. Those need different UI, recovery and telemetry. An explicit state enum preserves those meanings and can prevent contradictory flags. I would model independent loading dimensions separately rather than build an enormous enum of every combination.",
          "nil sorğulanmayıb, yüklənir, əlçatmaz və xəta səbəbini birləşdirir. Bunların UI, recovery və telemetriyası fərqlidir. Açıq enum mənanı saxlayır və zidd flag-ı önləyə bilər. Bütün kombinasiya üçün nəhəng enum əvəzinə müstəqil loading ölçüsünü ayrı qurardım.",
        ),
        wrong: b(
          "“nil always means zero balance” invents a financial fact from absence.",
          "“nil həmişə sıfır balansdır” yoxluqdan maliyyə faktı uydurur.",
        ),
        followup: b(
          "Who should own required-ID validation?",
          "Məcburi ID validation-una kim sahib olmalıdır?",
        ),
        followupAnswer: b(
          "The boundary receiving untrusted data should establish the identifier contract before passing validated values inward. Backend authorization remains separate.",
          "Etibarsız data alan sərhəd təsdiqli dəyəri daxilə ötürməzdən əvvəl identifikator müqaviləsini qurmalıdır. Backend avtorizasiyası ayrıdır.",
        ),
      },
    ],
    exercise: {
      prompt: b(
        "Model a balance screen that distinguishes idle, loading, loaded value and failure. Explain why you did not use a default balance of zero.",
        "Idle, loading, yüklənmiş dəyər və xətanı ayıran balans ekranı qur. Niyə default sıfır balans seçmədiyini izah et.",
      ),
      hints: [
        b(
          "Use associated values for the states that require data.",
          "Data tələb edən state-də associated value istifadə et.",
        ),
        b(
          "A retry action is meaningful after failure but not a substitute for a real balance.",
          "Retry xətadan sonra mənalıdır, həqiqi balansın əvəzi deyil.",
        ),
      ],
      solution:
        'enum BalanceState {\n    case idle\n    case loading\n    case loaded(minorUnits: Int, currency: String)\n    case failed(message: String)\n}\nlet state = BalanceState.loading\nswitch state {\ncase .idle: print("Not requested")\ncase .loading: print("Loading")\ncase .loaded(let amount, let currency): print(amount, currency)\ncase .failed(let message): print(message)\n}',
      reasoning: b(
        "Zero is a real balance; loading is not a balance. The enum preserves the product meaning so UI cannot silently turn a failed load into a zero-valued financial statement.",
        "Sıfır həqiqi balansdır; loading balans deyil. Enum məhsul mənasını qoruyur və uğursuz yükləməni səssiz sıfır maliyyə məlumatına çevirmir.",
      ),
      checks: [
        b(
          "Every state has intentional rendering.",
          "Hər state məqsədli göstərilir.",
        ),
        b(
          "Failure can preserve a retry path.",
          "Xəta retry yolunu saxlaya bilir.",
        ),
        b(
          "No missing value becomes a fake balance.",
          "Heç bir yox dəyər saxta balansa çevrilmir.",
        ),
      ],
    },
  }),
  extend({
    id: "topic-07",
    before: b(
      "Know struct/class and ordinary function calls. A protocol is a capability contract; an extension is a place to add implementations. Those are related but not identical.",
      "Struct/class və adi funksiya çağırışını bil. Protokol bacarıq müqaviləsi, extension implementasiya əlavə edilən yerdir. Əlaqəlidir, amma eyni deyil.",
    ),
    objectives: [
      b(
        "Predict requirement dispatch versus extension-only dispatch.",
        "Requirement və extension-only dispatch-i proqnozlaşdır.",
      ),
      b(
        "Choose some, any or generics by the type relationship you need.",
        "some, any və generic-i tələb olunan tip əlaqəsinə görə seç.",
      ),
    ],
    why: [
      b(
        "A balance screen should not need a real bank backend to test its loading behavior. Give it a BalanceReading capability and inject either the real transport adapter or a controlled stub. The protocol is useful because it defines what the consumer needs, not because a style rule says every class must have a matching protocol.",
        "Balans ekranının loading davranışını test etmək üçün həqiqi bank backend-i lazım olmamalıdır. BalanceReading bacarığı ver, real transport adapter və ya idarə olunan stub ötür. Protokol hər class-a protokol yazmaq qaydasına görə deyil, istehlakçı ehtiyacını müəyyən etdiyi üçün faydalıdır.",
      ),
      b(
        "Put behavior that must vary through abstraction into the protocol requirements. A protocol extension can supply a default for a requirement, or add an entirely new helper. The syntax looks similar, but only the first is part of the conformance contract. This distinction explains many surprising interview outputs.",
        "Abstraksiya üzərindən dəyişməli davranışı protocol requirement et. Extension requirement üçün default verə və ya tam yeni helper əlavə edə bilər. Sintaksis oxşardır, amma yalnız birinci conformance müqaviləsinin hissəsidir. Müsahibədə təəccüblü nəticələrin çoxunu bu fərq izah edir.",
      ),
    ],
    mechanism: [
      b(
        "A value used as any Reporter is viewed through the Reporter interface. A requirement has a conformance witness identifying its implementation. An extension-only method is not a requirement witness; a call can select the extension implementation based on the static interface even if the concrete type happens to have a same-named method. Declaring a method with the same spelling is not an override of that extension helper.",
        "any Reporter dəyəri Reporter interfeysi ilə görünür. Requirement-in implementasiyasını conformance witness müəyyən edir. Extension-only metod requirement witness deyil; konkret tipdə eyni adlı metod olsa da statik interfeysə görə extension seçilə bilər. Eyni adlı metod elan etmək extension helper-i override etmək deyil.",
      ),
      b(
        "some P describes one underlying concrete type selected by the implementation and hidden from the caller. It preserves concrete identity across the API’s type relationships. any P is an existential container that can hold different conforming concrete values over time. Generics express relationships chosen by the caller. Operations available through an existential depend on the requirements and Swift’s opening/associated-type rules; “any cannot use associated types” is too broad for modern Swift.",
        "some P implementasiyanın seçdiyi və çağırandan gizlənən tək konkret tipdir. API əlaqəsində konkret identity-ni saxlayır. any P zamanla fərqli uyğun konkret dəyər saxlaya bilən existential konteynerdir. Generic çağıranın seçdiyi tip əlaqəsini ifadə edir. Existential əməliyyatı requirement və Swift opening/associated-type qaydasından asılıdır; müasir Swift üçün “any associated type istifadə edə bilməz” çox geniş iddiadır.",
      ),
    ],
    decision: [
      b(
        "A useful abstraction uses vocabulary stable for its consumers. A protocol returning VendorSDK.Card everywhere still exposes vendor coupling. One production implementation can justify a protocol if it protects a module boundary or enables controlled testing. Conversely, a private stateless helper may be simpler as a concrete struct. Evaluate the reason for substitution, not the implementation count.",
        "Faydalı abstraksiya istehlakçı üçün sabit dil istifadə edir. Hər yerdə VendorSDK.Card qaytaran protokol vendor coupling saxlayır. Modul sərhədi və idarə olunan test varsa bir production implementasiya da protokolu əsaslandırır. Private stateless helper konkret struct kimi sadə ola bilər. Sayı deyil, əvəzlənmə səbəbini qiymətləndir.",
      ),
      b(
        "Do not promise dispatch speed from syntax alone. Compilers can specialize and devirtualize, while type erasure can add indirection or lose relationships. First establish correct semantics and API ownership, then profile the hot path if performance actually matters.",
        "Tək sintaksislə dispatch sürəti vəd etmə. Compiler specialize/devirtualize edə bilər, type erasure isə dolayı çağırış əlavə və əlaqə itirə bilər. Əvvəl semantika və API ownership-i qur, performans həqiqətən lazımdırsa hot path ölç.",
      ),
    ],
    analogy: b(
      "A restaurant menu is the protocol requirements. A note printed beside the menu is an extension helper. Giving the chef a same-named dish does not change what the menu contract promises.",
      "Restoran menyusu protocol requirement-dir. Menyu yanında qeyd extension helper-dir. Aşpaza eyni adlı yemək əlavə etmək menyu müqaviləsini dəyişmir.",
    ),
    example: {
      id: "witness-versus-helper",
      title: b(
        "Predict the two calls before revealing the reason",
        "Səbəbi açmadan iki çağırışı proqnozlaşdır",
      ),
      setup: b(
        "Both variables ultimately contain BankReporter. Their static views differ.",
        "Hər iki dəyişən nəticədə BankReporter saxlayır. Statik baxışları fərqlidir.",
      ),
      code: 'protocol Reporter {}\nextension Reporter { func report() -> String { "default" } }\nstruct BankReporter: Reporter {\n    func report() -> String { "bank" }\n}\nlet erased: any Reporter = BankReporter()\nprint(erased.report())\nprint(BankReporter().report())',
      output: b("default\nbank", "default\nbank"),
      steps: [
        b(
          "Reporter declares no report requirement.",
          "Reporter report requirement elan etmir.",
        ),
        b(
          "The existential call sees Reporter and its extension helper.",
          "Existential çağırış Reporter və extension helper-i görür.",
        ),
        b(
          "The concrete call sees BankReporter.report directly.",
          "Konkret çağırış BankReporter.report-u birbaşa görür.",
        ),
        b(
          "The same runtime payload therefore does not imply the same method-selection contract.",
          "Eyni runtime payload eyni metod seçimi müqaviləsi demək deyil.",
        ),
      ],
      takeaway: b(
        "To request polymorphism, declare the behavior as a requirement first.",
        "Polimorfizm istəyirsənsə davranışı əvvəl requirement et.",
      ),
    },
    debug: {
      title: b(
        "Fix an intended polymorphic report",
        "Nəzərdə tutulan polimorfik report-u düzəlt",
      ),
      broken:
        'protocol Reporter {}\nextension Reporter { func report() -> String { "default" } }\nstruct BankReporter: Reporter { func report() -> String { "bank" } }',
      failure: b(
        "A consumer accepting any Reporter cannot rely on the concrete same-named helper being selected.",
        "any Reporter alan istehlakçı konkret eyniadlı helper-in seçiləcəyinə güvənə bilməz.",
      ),
      fixed:
        'protocol Reporter { func report() -> String }\nextension Reporter { func report() -> String { "default" } }\nstruct BankReporter: Reporter { func report() -> String { "bank" } }\nlet reporter: any Reporter = BankReporter()\nprint(reporter.report()) // bank',
      why: b(
        "BankReporter.report now witnesses a declared requirement. The extension supplies a default only for conformances that do not supply their own witness. Inherited class conformances have additional subtleties; do not generalize this struct example to every subclass case.",
        "BankReporter.report indi elan edilmiş requirement-in witness-idir. Extension yalnız öz witness-i olmayan uyğunluğa default verir. Class-dan miras conformance əlavə incəlik daşıyır; bu struct nümunəsini bütün subclass-a ümumiləşdirmə.",
      ),
      test: b(
        "Pass BankReporter as any Reporter into a consumer and assert bank. Also test a conformer that intentionally uses the default.",
        "BankReporter-i any Reporter kimi istehlakçıya ver və bank yoxla. Default-u məqsədli istifadə edən conformer-i də test et.",
      ),
    },
    interviews: [
      {
        id: "protocol-purpose",
        level: "junior",
        question: b(
          "What problem does a protocol solve?",
          "Protokol hansı problemi həll edir?",
        ),
        why: b(
          "It tests whether you understand capabilities rather than keywords.",
          "Keyword deyil, bacarığı anlamağı yoxlayır.",
        ),
        answer: b(
          "It defines requirements a conforming type must fulfill so a consumer can use the capability without naming one implementation. A history ViewModel can depend on HistoryLoading and receive a real service or a stub. The contract should express the consumer’s needs and keep irrelevant implementation details outside.",
          "Uyğun tipin ödəməli requirement-lərini müəyyən edir; istehlakçı konkret implementasiya adı olmadan bacarığı istifadə edir. History ViewModel HistoryLoading alıb real servis və ya stub ilə işləyə bilər. Müqavilə istehlakçının ehtiyacını bildirməli, əlaqəsiz implementasiya detalını kənarda saxlamalıdır.",
        ),
        wrong: b(
          "“Protocols are only for mocks” misses module contracts and capability design.",
          "“Protokol yalnız mock üçündür” modul müqaviləsi və capability dizaynını qaçırır.",
        ),
        followup: b(
          "Must every concrete type have a protocol?",
          "Hər konkret tipin protokolu olmalıdırmı?",
        ),
        followupAnswer: b(
          "No. Introduce a meaningful substitution or ownership boundary, not a duplicate name for every helper.",
          "Xeyr. Hər helper-ə təkrar ad deyil, mənalı əvəzlənmə/ownership sərhədi yarat.",
        ),
      },
      {
        id: "extension-dispatch",
        level: "middle",
        question: b(
          "Why did an extension method return default through any Reporter?",
          "any Reporter üzərindən extension metodu niyə default qaytardı?",
        ),
        why: b(
          "This tests requirement dispatch and the static interface.",
          "Requirement dispatch və statik interfeysi yoxlayır.",
        ),
        answer: b(
          "Because report was not a protocol requirement. It was an extension-only helper selected through the Reporter interface. The concrete type’s same-named method did not supply a witness for a nonexistent requirement. I would declare report in the protocol if callers need polymorphic behavior, then test through the abstraction.",
          "Çünki report protocol requirement deyildi. Reporter interfeysi ilə seçilən extension-only helper idi. Konkret tipin eyniadlı metodu olmayan requirement üçün witness vermirdi. İstehlakçıya polimorfizm lazımdırsa report-u protokolda elan edib abstraksiya üzərindən test edərdim.",
        ),
        wrong: b(
          "“Swift randomly chooses static or dynamic dispatch” evades the requirement contract.",
          "“Swift təsadüfi static/dynamic seçir” requirement müqaviləsini izah etmir.",
        ),
        followup: b(
          "Does adding final fix the protocol contract?",
          "final əlavə etmək protokol müqaviləsini düzəldirmi?",
        ),
        followupAnswer: b(
          "No. final prevents class overriding; it does not add a missing protocol requirement.",
          "Xeyr. final class override-ı qadağan edir; çatışmayan requirement əlavə etmir.",
        ),
      },
      {
        id: "opaque-existential",
        level: "senior",
        question: b(
          "How do you choose generics, some and any?",
          "Generic, some və any arasında necə seçirsən?",
        ),
        why: b(
          "A strong answer discusses preserved type relationships, storage and evolution.",
          "Güclü cavab saxlanan tip əlaqəsi, storage və inkişafı izah edir.",
        ),
        answer: b(
          "Generics preserve caller-selected type relationships. An opaque result hides one implementation-selected concrete type while preserving its identity. An existential offers runtime heterogeneity at the cost of losing some concrete relationships and possibly adding indirection. I choose based on API operations and storage needs, then measure performance rather than assume one keyword is always faster.",
          "Generic çağıranın seçdiyi tip əlaqəsini saxlayır. Opaque nəticə implementasiyanın seçdiyi tək konkret tipi identity-ni saxlayaraq gizlədir. Existential runtime heterogenlik verir, amma bəzi konkret əlaqəni itirə və dolayı çağırış yarada bilər. API/storage ehtiyacına görə seçib keyword-un həmişə sürətli olduğunu fərz etmir, ölçürəm.",
        ),
        wrong: b(
          "“some is compile-time and any is always slow” is an oversimplified performance claim.",
          "“some compile-time-dır, any həmişə yavaşdır” sadələşmiş performans iddiasıdır.",
        ),
        followup: b(
          "Can a protocol still be a poor boundary?",
          "Protokol yenə pis sərhəd ola bilərmi?",
        ),
        followupAnswer: b(
          "Yes. A protocol can expose vendor models, transport errors or too many unrelated capabilities even though its syntax is abstract.",
          "Bəli. Sintaksis abstrakt olsa da vendor model, transport error və çox əlaqəsiz capability aça bilər.",
        ),
      },
    ],
    exercise: {
      prompt: b(
        "Make a ReceiptFormatting protocol with a default implementation and a bank-specific formatter. Prove that a function receiving any ReceiptFormatting calls the bank-specific requirement.",
        "Default və bank formatter-i olan ReceiptFormatting qur. any ReceiptFormatting alan funksiyanın bank-specific requirement çağırdığını sübut et.",
      ),
      hints: [
        b(
          "Declare format as a requirement, not only in an extension.",
          "format-ı tək extension deyil, requirement et.",
        ),
        b(
          "Test through the consumer type, not only the concrete formatter.",
          "Tək konkret formatter deyil, istehlakçı tipi ilə test et.",
        ),
      ],
      solution:
        'protocol ReceiptFormatting { func format(_ amount: Int) -> String }\nextension ReceiptFormatting {\n    func format(_ amount: Int) -> String { "Amount: \\(amount)" }\n}\nstruct BankFormatter: ReceiptFormatting {\n    func format(_ amount: Int) -> String { "AZN \\(amount)" }\n}\nfunc label(using formatter: any ReceiptFormatting) -> String {\n    formatter.format(42)\n}\nassert(label(using: BankFormatter()) == "AZN 42")',
      reasoning: b(
        "The consumer calls a declared requirement. BankFormatter supplies its witness, so the abstraction preserves the desired behavior. Real currency display still requires locale and scale policy.",
        "İstehlakçı elan edilmiş requirement çağırır. BankFormatter witness verir və abstraksiya gözlənilən davranışı saxlayır. Real valyuta göstərilməsi yenə locale/scale siyasəti istəyir.",
      ),
      checks: [
        b(
          "The existential consumer returns AZN 42.",
          "Existential istehlakçı AZN 42 qaytarır.",
        ),
        b(
          "Another conformer can intentionally use the default.",
          "Başqa conformer default-u məqsədli seçə bilir.",
        ),
        b(
          "You can explain why moving only the extension changes behavior.",
          "Tək extension-a köçürmənin davranışı niyə dəyişdirdiyini izah edə bilirsən.",
        ),
      ],
    },
  }),
  extend({
    id: "topic-04",
    before: b(
      "Know local variables and class references. Treat a closure as stored behavior plus the context needed to run it later.",
      "Lokal dəyişən və class istinadını bil. Closure-u davranış və sonra işləmək üçün lazım olan kontekst kimi düşün.",
    ),
    objectives: [
      b(
        "Predict live variable capture versus capture-list snapshots.",
        "Canlı dəyişən capture-u ilə capture-list snapshot-ını proqnozlaşdır.",
      ),
      b(
        "Explain escaping, strong/weak capture and task lifetime independently.",
        "Escaping, strong/weak capture və task lifetime-ını ayrı izah et.",
      ),
    ],
    why: [
      b(
        "A function can receive behavior instead of one fixed operation. Array.map receives how to transform an element; a network API receives what to do when a response arrives. A closure lets the caller express that behavior near the place where its context is known. If it needs a local variable later, it must capture access to the relevant context.",
        "Funksiya tək sabit əməliyyat əvəzinə davranış ala bilər. Array.map elementi necə çevirməyi, network API cavab gələndə nə etməyi alır. Closure çağırana davranışı kontekstin məlum olduğu yerdə yazdırır. Sonra lokal dəyişən lazımdırsa uyğun kontekstə girişi capture etməlidir.",
      ),
      b(
        "Without an explicit capture list, a closure can observe later changes to a captured variable. A capture-list expression is evaluated when the closure is created and stores the selected value. If that value is a class reference, the reference is copied, not the object graph. Capture timing and deep-copy semantics are different questions.",
        "Açıq capture list olmadan closure capture olunan dəyişənin sonrakı dəyişməsini görə bilər. Capture-list ifadəsi closure yarananda hesablanır və seçilən dəyəri saxlayır. Dəyər class istinadıdırsa istinad kopyalanır, object graph deyil. Capture vaxtı və deep-copy semantikası ayrı sualdır.",
      ),
    ],
    mechanism: [
      b(
        "A non-escaping closure cannot be stored for use after the receiving call returns. @escaping permits that longer lifetime; it does not promise the closure will run asynchronously or on a background queue. An API may call an escaping completion synchronously, more than once or never unless its contract says otherwise. Test the timing the consumer actually relies on.",
        "Non-escaping closure qəbul edən çağırış bitəndən sonra istifadə üçün saxlanıla bilməz. @escaping daha uzun lifetime-a icazə verir; async və ya background queue-da işləyəcəyini vəd etmir. Müqavilə demirsə escaping completion sinxron, bir neçə dəfə və ya heç çağırılmaya bilər. İstehlakçının güvəndiyi timing-i test et.",
      ),
      b(
        "Capture ownership follows ordinary reference rules. A stored closure strongly capturing its owner can form a cycle. [weak self] changes that one edge, while guard let self creates a temporary strong local. Neither is a cancellation policy. For value transformations, map preserves one result per element, compactMap discards nil results, and flatMap flattens one sequence level. Prefer a loop when early exit or error handling is clearer.",
        "Capture ownership adi istinad qaydasına tabedir. Owner-i strong capture edən saxlanmış closure dövr yarada bilər. [weak self] bir oxu dəyişir, guard let self müvəqqəti strong lokal yaradır. Heç biri cancellation qaydası deyil. map element başına nəticə, compactMap nil çıxarılması, flatMap bir sequence səviyyəsinin açılmasıdır. Erkən çıxış və error handling aydınlaşırsa loop seç.",
      ),
    ],
    decision: [
      b(
        "Before adding weak, identify who stores the closure and how long the behavior should survive. A finite service request retaining its coordinator until completion may be correct. A screen-owned infinite stream retaining its screen can prevent the deinit that was supposed to cancel it. Keep work ownership and callback delivery explicit in protocols.",
        "Weak əlavə etmədən closure-u kimin nə qədər saxladığını seç. Sonadək coordinator-u saxlayan sonlu servis sorğusu düzgün ola bilər. Ekrana məxsus sonsuz stream ekranı saxlayıb onu ləğv etməli deinit-ə mane ola bilər. Protokolda iş ownership və callback çatdırılmasını açıq saxla.",
      ),
      b(
        "An elegant higher-order chain can allocate intermediate collections and hide expensive repeated work. lazy may defer computation but changes evaluation timing. Measure meaningful workloads before optimizing and preserve side-effect ordering deliberately. Readability is a production property, not an excuse to ignore algorithmic cost.",
        "Gözəl higher-order zəncir ara kolleksiya yarada və təkrar bahalı işi gizlədə bilər. lazy hesablamanı gecikdirir, amma vaxtını dəyişir. Optimallaşdırmadan real workload ölç və side-effect sırasını məqsədli saxla. Oxunaqlılıq production xüsusiyyətidir, alqoritmik xərci görməmək bəhanəsi deyil.",
      ),
    ],
    analogy: b(
      "A closure is a recipe with access to ingredients. A capture list can put today’s amount into the recipe; ordinary variable capture can read tomorrow’s amount when the recipe finally runs.",
      "Closure ərzağa girişi olan reseptdir. Capture list bugünkü miqdarı reseptə qoya bilər; adi dəyişən capture-u resept işləyəndə sabahkı miqdarı oxuya bilər.",
    ),
    example: {
      id: "capture-time",
      title: b(
        "Two closures, one changed variable",
        "İki closure, bir dəyişmiş dəyişən",
      ),
      setup: b(
        "Pause after each line and say whether the closure reads a variable or a captured value.",
        "Hər sətirdən sonra closure-un dəyişəni, yoxsa tutulmuş dəyəri oxuduğunu de.",
      ),
      code: "var amount = 10\nlet live = { amount }\nlet snapshot = { [amount] in amount }\namount = 20\nprint(live())\nprint(snapshot())",
      output: b("20\n10", "20\n10"),
      steps: [
        b("amount initially stores 10.", "amount əvvəl 10 saxlayır."),
        b(
          "live captures access to the variable, so its later value matters.",
          "live dəyişənə girişi capture edir; sonrakı dəyər vacibdir.",
        ),
        b(
          "snapshot evaluates the capture-list expression now and stores 10.",
          "snapshot capture-list ifadəsini indi hesablayıb 10 saxlayır.",
        ),
        b(
          "After assignment, the calls therefore read different sources.",
          "Mənimsətmədən sonra çağırışlar fərqli mənbə oxuyur.",
        ),
      ],
      takeaway: b(
        "Creation time, invocation time and object identity must be reasoned about separately.",
        "Yaradılma vaxtı, çağırılma vaxtı və object identity ayrı düşünülməlidir.",
      ),
    },
    debug: {
      title: b(
        "A “snapshot” closure still sees a changing object",
        "“Snapshot” closure yenə dəyişən obyekt görür",
      ),
      broken:
        "final class Box { var amount = 10 }\nlet box = Box()\nlet snapshot = { [box] in box.amount }\nbox.amount = 20\nprint(snapshot()) // 20",
      failure: b(
        "The capture list saved the reference to Box, not an independent copy of amount. It is a snapshot of the reference value.",
        "Capture list Box istinadını saxladı, amount-un müstəqil kopyasını deyil. Bu istinad dəyərinin snapshot-ıdır.",
      ),
      fixed:
        "final class Box { var amount = 10 }\nlet box = Box()\nlet snapshot = { [amount = box.amount] in amount }\nbox.amount = 20\nprint(snapshot()) // 10",
      why: b(
        "The capture-list expression now reads the Int property during closure creation and stores that value. If the intended behavior is live state, the original code may be correct; name the desired contract first.",
        "Capture-list ifadəsi indi closure yarananda Int property-ni oxuyub həmin dəyəri saxlayır. İstənən davranış canlı state-dirsə ilkin kod düzgün ola bilər; əvvəl müqaviləni adlandır.",
      ),
      test: b(
        "Create closure at 10, mutate the object to 20, then call the closure and assert the contract’s intended value.",
        "Closure-u 10-da yarat, obyekti 20 et, sonra çağır və müqavilənin nəzərdə tutduğu dəyəri yoxla.",
      ),
    },
    interviews: [
      {
        id: "escaping-contract",
        level: "junior",
        question: b(
          "What does @escaping actually permit?",
          "@escaping konkret nəyə icazə verir?",
        ),
        why: b(
          "This separates lifetime from scheduling.",
          "Lifetime-ı scheduling-dən ayırır.",
        ),
        answer: b(
          "It permits the closure to outlive the function call that receives it, for example by being stored as a callback. It does not guarantee asynchronous execution or a particular queue. The API contract must describe invocation count, timing and executor when consumers depend on them.",
          "Closure-un onu qəbul edən funksiya çağırışından uzun yaşamasına, məsələn callback kimi saxlanmasına icazə verir. Async icra və konkret queue zəmanəti deyil. İstehlakçı güvənirsə müqavilə çağırış sayı, vaxtı və executor-u deməlidir.",
        ),
        wrong: b(
          "“Escaping means background” confuses two independent properties.",
          "“Escaping background deməkdir” iki ayrı xüsusiyyəti qarışdırır.",
        ),
        followup: b(
          "Can an escaping closure run synchronously?",
          "Escaping closure sinxron işləyə bilərmi?",
        ),
        followupAnswer: b(
          "Yes. Permission to escape does not require escaping on every call.",
          "Bəli. Escape icazəsi hər çağırışda escape məcbur etmir.",
        ),
      },
      {
        id: "capture-values",
        level: "middle",
        question: b(
          "What changes when [box] becomes [amount = box.amount]?",
          "[box] yerinə [amount = box.amount] gələndə nə dəyişir?",
        ),
        why: b(
          "It tests capture evaluation and nested reference semantics.",
          "Capture hesablanması və daxili istinad semantikasını yoxlayır.",
        ),
        answer: b(
          "The first captures a reference value and later reads the shared object’s property. The second evaluates the property during closure creation and captures an Int value. Mutating Box afterward is visible to the first closure but not the second. Neither result can be inferred from the phrase “capture list makes a copy” without naming what was copied.",
          "Birinci istinad dəyərini saxlayır, sonra shared object property-sini oxuyur. İkinci property-ni closure yarananda hesablayıb Int dəyəri capture edir. Sonrakı Box mutasiyası birincidə görünür, ikincidə deyil. Nəyin kopyalandığını demədən “capture list copy edir” ifadəsi nəticəni müəyyən etmir.",
        ),
        wrong: b(
          "“All capture lists make deep copies” is false for references.",
          "“Bütün capture list-lər deep copy edir” istinad üçün səhvdir.",
        ),
        followup: b(
          "Does weak capture stop the network operation?",
          "Weak capture network əməliyyatını dayandırırmı?",
        ),
        followupAnswer: b(
          "No. It changes ownership of the captured object. Cancellation and transport cleanup require their own lifecycle contract.",
          "Xeyr. Capture olunan obyektin ownership-ini dəyişir. Cancellation və transport təmizliyi ayrıca lifecycle müqaviləsi istəyir.",
        ),
      },
      {
        id: "closure-design",
        level: "senior",
        question: b(
          "How would you design a callback API for testable UI code?",
          "Test edilən UI kodu üçün callback API-ni necə qurardın?",
        ),
        why: b(
          "It tests lifecycle and contract design rather than syntax.",
          "Sintaksis deyil, lifecycle/müqavilə dizaynını yoxlayır.",
        ),
        answer: b(
          "Specify whether completion is once or repeated, its delivery isolation, cancellation handle and ownership lifetime. Keep result and cancellation outcomes distinguishable. Tests should exercise synchronous completion, delayed completion, failure and cancellation so construction and handler-attachment assumptions are visible.",
          "Completion-un tək/təkrar olması, çatdırılma izolyasiyası, cancellation handle və ownership lifetime-ını bildirərdim. Result və cancellation ayrılmalıdır. Test sinxron completion, gecikmiş completion, xəta və cancellation ilə qurulma/handler qoşulma fərziyyəsini göstərməlidir.",
        ),
        wrong: b(
          "“Just mark it @escaping” leaves the behavior the consumer actually needs unspecified.",
          "“Sadəcə @escaping et” istehlakçının lazım bildiyi davranışı müəyyən etmir.",
        ),
        followup: b(
          "When might a regular loop be better than map/filter/reduce?",
          "Adi loop map/filter/reduce-dan nə vaxt yaxşıdır?",
        ),
        followupAnswer: b(
          "When early exit, mutation, error handling or avoiding repeated intermediate work is clearer and better justified. Measure performance claims rather than infer them from style.",
          "Erkən çıxış, mutasiya, error handling və təkrar ara işi önləmək daha aydın və əsaslıdırsa. Performans iddiasını stildən çıxarma, ölç.",
        ),
      },
    ],
    exercise: {
      prompt: b(
        "Create live and snapshot callbacks for a mutable account title. Test both after the title changes and explain which you would use for a historical receipt.",
        "Mutable hesab başlığı üçün live və snapshot callback yarat. Başlıq dəyişəndən sonra hər ikisini test et və tarixi qəbz üçün seçimini izah et.",
      ),
      hints: [
        b(
          "Capture the title value, not only the account reference.",
          "Tək account istinadını deyil, title dəyərini capture et.",
        ),
        b(
          "A historical receipt should not silently become a live view.",
          "Tarixi qəbz səssiz canlı görünüşə çevrilməməlidir.",
        ),
      ],
      solution:
        'final class Account { var title = "Salary" }\nlet account = Account()\nlet live = { account.title }\nlet receiptTitle = { [title = account.title] in title }\naccount.title = "Savings"\nassert(live() == "Savings")\nassert(receiptTitle() == "Salary")',
      reasoning: b(
        "The receipt callback stores the title value at creation. The live callback intentionally follows the account reference. Both are useful when their API names and lifetime contracts match the requirement.",
        "Receipt callback yaradılma anının title dəyərini saxlayır. Live callback məqsədli olaraq account istinadını izləyir. API adı və lifetime müqaviləsi tələbə uyğun olsa hər ikisi faydalıdır.",
      ),
      checks: [
        b(
          "Live callback sees the new title.",
          "Live callback yeni başlığı görür.",
        ),
        b(
          "Historical callback preserves the old title.",
          "Tarixi callback köhnə başlığı saxlayır.",
        ),
        b(
          "You can explain any retained object rather than assume all captures leak.",
          "Bütün capture-u leak saymaq əvəzinə saxlanan obyekti izah edə bilirsən.",
        ),
      ],
    },
  }),
  extend({
    id: "topic-17",
    before: b(
      "Read async state and dependency injection basics. We will design one bank-history screen by assigning responsibilities before naming extra layers.",
      "Async state və DI əsaslarını oxu. Əlavə qat adlandırmazdan əvvəl bir bank tarixçəsi ekranında məsuliyyəti böləcəyik.",
    ),
    objectives: [
      b(
        "Trace intent → loading → result → state → rendering.",
        "Niyyət → loading → nəticə → state → rendering izlə.",
      ),
      b(
        "Defend a direct service or extracted policy with concrete reasons.",
        "Birbaşa servis və ya ayrılmış qaydanı konkret səbəblə əsaslandır.",
      ),
    ],
    why: [
      b(
        "A view controller that renders rows, builds requests, interprets business errors, chooses routes and coordinates signing has several independent reasons to change. MVVM gives presentation decisions a place separate from rendering, but moving all those methods into a ViewModel does not remove the responsibility problem. The benefit comes from clear inputs, owned state and replaceable collaborators.",
        "Sətir göstərən, request quran, biznes xətası şərh edən, route seçən və imzalama idarə edən controller bir neçə səbəblə dəyişir. MVVM presentation qərarını rendering-dən ayırır, amma hamısını ViewModel-ə köçürmək məsuliyyət problemini silmir. Fayda aydın input, sahib olunan state və əvəz edilən asılılıqdan gəlir.",
      ),
      b(
        "For a transaction screen, the View renders state and sends refresh intent. The ViewModel decides when to load and which result remains relevant. A service performs transport. A mapper prepares display values. A router executes navigation. These are responsibilities, not mandatory classes: start small and extract when behavior has an independent reason to change.",
        "Əməliyyat ekranında View state göstərib refresh niyyəti göndərir. ViewModel nə vaxt yükləməyi və hansı nəticənin aktual olduğunu seçir. Servis transport edir. Mapper display dəyəri hazırlayır. Router naviqasiyanı icra edir. Bunlar məsuliyyətdir, məcburi class deyil: kiçik başla, davranış müstəqil dəyişirsə ayır.",
      ),
    ],
    mechanism: [
      b(
        "Inject collaborators in the initializer. A controlled loader lets tests finish requests in any order, fail them or simulate an empty response without a backend. A router spy records navigation instead of showing screens. Keep durable loading/content/error state separate from one-time presentation commands, and specify whether effects can be emitted before a host attaches its handler.",
        "Asılılığı initializer-də ötür. İdarə olunan loader testə backend olmadan istənən sırada bitirmə, xəta və boş cavab qurmağa imkan verir. Router spy ekran açmaq əvəzinə naviqasiyanı qeyd edir. Qalıcı loading/content/error state-i birdəfəlik əmrdən ayır, host handler qoşmazdan əvvəl effect ola biləcəyini bildir.",
      ),
      b(
        "A direct ViewModel-to-service call can be a valid boundary when it only orchestrates a straightforward request. Extract a use case for reusable validation, multi-step business policy or a transport-independent operation shared by presentations. Extract a repository when it owns cache/source selection or reconciliation. Adding forwarding layers does not establish these benefits automatically.",
        "Sadə sorğunu koordinasiya edən ViewModel-servis əlaqəsi düzgün sərhəd ola bilər. Reuse validation, çoxaddımlı biznes qaydası və ya presentation-ların paylaşdığı transport-müstəqil əməliyyat üçün use case ayır. Cache/mənbə seçimi/reconciliation sahibidirsə repository ayır. Tək forwarding qat əlavə etmək faydanı avtomatik vermir.",
      ),
    ],
    decision: [
      b(
        "Dependency injection is how collaborators arrive; dependency inversion is who owns the contract and which code depends on which. A builder may use a DI container to assemble explicit dependencies, while a ViewModel calling a global resolve() hides requirements. Keep lookup near the composition root and test registration separately.",
        "DI əməkdaşın necə gəlməsidir; dependency inversion müqavilənin sahibi və kod asılılığının istiqamətidir. Builder container ilə açıq asılılıq qura bilər, amma ViewModel-də global resolve() tələbi gizlədir. Axtarışı composition root yanında saxla və qeydiyyatı ayrıca test et.",
      ),
      b(
        "When a legacy screen mixes mapping, contracts, biometrics and routing, first characterize its visible behavior. Extract deterministic mapping before replacing its UI, navigation and state framework together. A small tested step has a clearer rollback boundary than a diagram-driven rewrite. No claim about actual IBAM implementation follows from this generic design example.",
        "Legacy ekran mapping, contract, biometrika və routing qarışdırırsa əvvəl görünən davranışı testlə qur. UI, naviqasiya və state framework-ü birlikdə dəyişmədən deterministik mapping ayır. Kiçik testli addım qraf əsaslı rewrite-dan aydın rollback sərhədi verir. Bu ümumi nümunə real IBAM implementasiyası iddiası deyil.",
      ),
    ],
    analogy: b(
      "A screen is a team: the view presents, the ViewModel coordinates, and adapters speak to external systems. Hiring more people who merely forward messages does not improve ownership.",
      "Ekran komandadır: View təqdim edir, ViewModel koordinasiya edir, adapter xarici sistemlə danışır. Yalnız mesaj ötürən əlavə işçi ownership-i yaxşılaşdırmır.",
    ),
    example: {
      id: "injected-history",
      title: b(
        "A ViewModel you can test without a backend",
        "Backend olmadan test etdiyin ViewModel",
      ),
      setup: b(
        "The loader returns controlled data. The model does not construct or globally locate a client.",
        "Loader idarə olunan data qaytarır. Model klienti yaratmır və qlobal axtarmır.",
      ),
      code: '@MainActor\nfinal class HistoryModel {\n    enum State { case idle, loading, loaded([String]), failed }\n    private(set) var state: State = .idle\n    private let loadRows: () async throws -> [String]\n    init(loadRows: @escaping () async throws -> [String]) { self.loadRows = loadRows }\n    func refresh() async {\n        state = .loading\n        do { state = .loaded(try await loadRows()) }\n        catch { state = .failed }\n    }\n}\n// Construct on MainActor, inject { ["Transfer"] }, await refresh(), inspect state.',
      output: b(
        'No automatic output. Expected transition: idle → loading → loaded(["Transfer"]). This baseline does not yet implement overlapping-refresh or cancellation policy.',
        'Avtomatik çıxış yoxdur. Gözlənilən keçid: idle → loading → loaded(["Transfer"]). Bu təməl hələ paralel refresh/cancellation qaydası qurmur.',
      ),
      steps: [
        b(
          "Construction makes dependencies visible and starts no request.",
          "Qurulma asılılığı göstərir, sorğu başlatmır.",
        ),
        b(
          "refresh emits loading before awaiting the injected behavior.",
          "refresh injection davranışını gözləməzdən əvvəl loading edir.",
        ),
        b(
          "Success/failure becomes explicit state that rendering can inspect.",
          "Uğur/xəta rendering-in görə bildiyi açıq state olur.",
        ),
        b(
          "Production adds generation checks, cancellation and partial-result policy where required.",
          "Production ehtiyaca görə generation, cancellation və qismən nəticə qaydası əlavə edir.",
        ),
      ],
      takeaway: b(
        "Testability comes from controlled behavior and observable outcomes, not the MVVM label.",
        "Testability MVVM adından deyil, idarə olunan davranış və görünən nəticədən gəlir.",
      ),
    },
    debug: {
      title: b(
        "Hidden construction makes a test depend on globals",
        "Gizli qurulma testi qlobal state-dən asılı edir",
      ),
      broken:
        "final class Model {\n    let service = GlobalRegistry.resolveHistoryService()\n}\n// Illustrative anti-pattern: construction requires a prepared global registry.",
      failure: b(
        "A test cannot see the dependency in the initializer. Registration order and shared mutable containers can leak between parallel tests. The illustrative GlobalRegistry is not a shipped implementation.",
        "Test initializer-də asılılığı görmür. Qeydiyyat sırası və shared mutable container paralel testə sızır. İllüstrativ GlobalRegistry real təqdim olunan implementasiya deyil.",
      ),
      fixed:
        "protocol HistoryReading { func rows() async throws -> [String] }\nfinal class Model {\n    let service: any HistoryReading\n    init(service: any HistoryReading) { self.service = service }\n}",
      why: b(
        "The composition boundary chooses a service; behavior tests supply controlled doubles directly. This does not require deleting the application container everywhere.",
        "Composition sərhədi servis seçir; davranış testi idarə olunan double-ı birbaşa verir. Bunun üçün bütün tətbiq container-ini silmək lazım deyil.",
      ),
      test: b(
        "Construct two models with independent fakes and run tests concurrently without modifying global registrations. Assert states and route requests, not private implementation flags.",
        "İki modeli müstəqil fake-lə qur və qlobal qeydiyyatı dəyişmədən paralel test et. Private flag deyil, state və route istəyini yoxla.",
      ),
    },
    interviews: [
      {
        id: "mvvm-roles",
        level: "junior",
        question: b(
          "What belongs in View, ViewModel and Model?",
          "View, ViewModel və Model-də nə olmalıdır?",
        ),
        why: b(
          "This checks responsibility rather than folder names.",
          "Qovluq adı deyil, məsuliyyəti yoxlayır.",
        ),
        answer: b(
          "The View renders and forwards intent, the ViewModel owns presentation state and coordinates work, and models express relevant data. Service and route boundaries keep external operations replaceable. Local purely visual state can stay in the View; not every animation offset belongs in a ViewModel.",
          "View göstərir və niyyəti ötürür, ViewModel presentation state-ə sahib olub işi koordinasiya edir, model data ifadə edir. Servis/route sərhədi xarici işi əvəzlənən saxlayır. Sırf lokal vizual state View-da qala bilər; hər animasiya offset-i ViewModel deyil.",
        ),
        wrong: b(
          "“Put everything except UI into ViewModel” creates another massive owner.",
          "“UI xaric hamısını ViewModel-ə qoy” başqa nəhəng owner yaradır.",
        ),
        followup: b(
          "Does MVVM require a repository?",
          "MVVM repository tələb edirmi?",
        ),
        followupAnswer: b(
          "No. Add one when it owns meaningful source policy or a boundary needed by the feature.",
          "Xeyr. Mənalı mənbə siyasəti və ya feature sərhədinə sahibdirsə əlavə et.",
        ),
      },
      {
        id: "mvvm-policy",
        level: "middle",
        question: b(
          "When should business logic leave the ViewModel?",
          "Biznes məntiqi ViewModel-dən nə vaxt çıxmalıdır?",
        ),
        why: b(
          "It tests why an abstraction exists.",
          "Abstraksiyanın niyə var olduğunu yoxlayır.",
        ),
        answer: b(
          "When policy has independent change reasons, reuse across screens or multi-step decisions worth testing without presentation. Display formatting can be a mapper; signing orchestration can be a workflow. A use case that only forwards one service call may add wiring without changing ownership. I would identify a specific responsibility and preserve existing state and routes through tests.",
          "Qaydanın müstəqil dəyişmə səbəbi, ekranlararası reuse və ya presentation-sız test ediləsi çoxaddımlı qərarı varsa. Display format mapper, imzalama workflow ola bilər. Tək servis ötürən use case ownership dəyişmədən wiring artıra bilər. Konkret məsuliyyət seçib state/route-u testlə qoruyardım.",
        ),
        wrong: b(
          "“Always add one use case per endpoint” ignores requirement-driven trade-offs.",
          "“Hər endpoint-ə use case” tələb əsaslı seçimi nəzərə almır.",
        ),
        followup: b(
          "Is a protocol automatically domain-independent?",
          "Protokol avtomatik domen-müstəqildirmi?",
        ),
        followupAnswer: b(
          "No. A protocol can still expose DTOs, vendor models and transport errors. Inspect its vocabulary and owner.",
          "Xeyr. DTO, vendor modeli və transport xətası aça bilər. Dilinə və sahibinə bax.",
        ),
      },
      {
        id: "mvvm-migration",
        level: "senior",
        question: b(
          "How do you reduce a legacy ViewModel safely?",
          "Legacy ViewModel-i necə təhlükəsiz kiçildirsən?",
        ),
        why: b(
          "This tests migration sequencing and regression evidence.",
          "Miqrasiya ardıcıllığı və regression sübutunu yoxlayır.",
        ),
        answer: b(
          "First characterize state transitions, navigation and failure behavior. Extract pure mapping with fixtures while keeping the controller and route contract stable. Then isolate independent document/signing policy if justified. I would avoid combining a SwiftUI rewrite, new store and backend changes in the same step; rollback and review become much harder.",
          "Əvvəl state keçidi, naviqasiya və xəta davranışını testlə quraram. Controller/route müqaviləsini saxlayıb fixture ilə pure mapping ayıraram. Sonra əsaslıdırsa sənəd/imzalama siyasətini ayıraram. Eyni addımda SwiftUI rewrite, yeni store və backend dəyişməsini birləşdirməzdim; rollback/review çətinləşir.",
        ),
        wrong: b(
          "“Rewrite it all in a newer framework” is not a responsibility analysis.",
          "“Hamısını yeni framework-də yaz” məsuliyyət analizi deyil.",
        ),
        followup: b(
          "What test shows the extraction preserved behavior?",
          "Extraction-un davranışı qoruduğunu hansı test göstərir?",
        ),
        followupAnswer: b(
          "The same controlled inputs produce the same sections/state, routes and failure recovery before and after extraction.",
          "Eyni idarə olunan input əvvəl/sonra eyni section/state, route və xəta bərpası verir.",
        ),
      },
    ],
    exercise: {
      prompt: b(
        "Add a controllable failing loader to HistoryModel. State what happens for empty success, failure, cancellation and a second refresh. Which guarantees does the baseline not provide?",
        "HistoryModel-ə idarə olunan failing loader əlavə et. Boş uğur, xəta, cancellation və ikinci refresh-i izah et. Təməl hansı zəmanəti vermir?",
      ),
      hints: [
        b(
          "Separate an empty array from a thrown failure.",
          "Boş array-ı thrown failure-dan ayır.",
        ),
        b(
          "Look for the absent operation-identity check.",
          "Çatışmayan operation identity yoxlamasını tap.",
        ),
      ],
      solution:
        "enum FixtureError: Error { case unavailable }\nlet emptyLoader: () async throws -> [String] = { [] }\nlet failedLoader: () async throws -> [String] = { throw FixtureError.unavailable }\n// On MainActor construct separate HistoryModel instances with these loaders.\n// Await refresh and assert .loaded([]) versus .failed.\n// Add latest-wins/cancellation policy before asserting overlapping loads are safe.",
      reasoning: b(
        "The injection seam enables these tests; it does not automatically solve their production semantics. Add cancellation handling and operation identity with the concurrency chapter’s pattern when requirements demand it.",
        "Injection sərhədi testə imkan verir; production semantikasını avtomatik həll etmir. Tələb edəndə concurrency dərsinin cancellation və identity qaydasını əlavə et.",
      ),
      checks: [
        b(
          "Empty success remains a success state.",
          "Boş uğur uğur state-i qalır.",
        ),
        b(
          "Failure is explicit rather than fake empty data.",
          "Xəta saxta boş data deyil, açıqdır.",
        ),
        b(
          "Overlapping-load assumptions are called out and tested.",
          "Paralel load fərziyyəsi açıq qeyd/test olunur.",
        ),
      ],
    },
  }),
  extend({
    id: "topic-25",
    before: b(
      "Know throwing functions, Codable and await. A successful network transfer is not the same as a successful banking operation.",
      "Throwing funksiya, Codable və await bil. Uğurlu network ötürməsi uğurlu bank əməliyyatı ilə eyni deyil.",
    ),
    objectives: [
      b(
        "Separate transport, HTTP, decoding and business outcomes.",
        "Transport, HTTP, decoding və biznes nəticəsini ayır.",
      ),
      b(
        "Explain timeout, cancellation and safe retries without inventing a server result.",
        "Server nəticəsi uydurmadan timeout, cancellation və təhlükəsiz retry-ni izah et.",
      ),
    ],
    why: [
      b(
        "A feature needs a contract stronger than “I got some bytes.” The device can be offline, TLS can fail, the server can return 401, a successful status can contain unexpected JSON, or the server can reject a transfer for a business reason. Collapsing every case to an empty array or generic error loses the recovery decision the screen needs.",
        "Feature “bir az byte aldım”dan güclü müqavilə istəyir. Cihaz oflayn ola, TLS pozula, server 401 verə, uğurlu status gözlənilməz JSON daşıya və ya köçürmə biznes səbəbi ilə rədd oluna bilər. Hamısını boş array/ümumi error etmək ekranın bərpa qərarını itirir.",
      ),
      b(
        "URLRequest describes intent: URL, method, headers and body. URLSession performs transport and returns data plus response metadata. Validation decides whether the HTTP response matches the endpoint contract; decoding constructs a model; domain interpretation decides whether the business operation succeeded. Keep those checkpoints visible in code and tests.",
        "URLRequest niyyəti təsvir edir: URL, metod, header və body. URLSession transport edir, data və response metadata qaytarır. Validation HTTP cavabın endpoint müqaviləsinə uyğunluğunu, decoding modeli, domen şərhi biznes uğurunu müəyyən edir. Bu mərhələləri kod/test-də görünən saxla.",
      ),
    ],
    mechanism: [
      b(
        "Validate status before decoding the expected success payload. 204 can be success without a body; 401 may need one coordinated refresh; 403 is not automatically solved by endless refreshing. Different endpoints may decode the root JSON, an optional data envelope, or a required payload. A missing envelope field is not the same as an empty successful collection.",
        "Uğurlu payload decode etmədən status yoxla. 204 body-siz uğur ola bilər; 401 bir koordinasiyalı refresh istəyə bilər; 403 sonsuz refresh ilə avtomatik düzəlmir. Endpoint root JSON, optional data envelope və ya məcburi payload decode edə bilər. Envelope sahəsinin yoxluğu uğurlu boş kolleksiya deyil.",
      ),
      b(
        "Cancellation must remain recognizable. A custom callback bridge should resume its continuation exactly once and own the underlying cancellable, including replacements after refresh or retry. A generic Error → failed mapping can accidentally turn ordinary cancellation into a user-facing failure. Protocols should state callback isolation rather than relying on today’s implementation dispatching to main.",
        "Cancellation tanınan qalmalıdır. Custom callback bridge continuation-u dəqiq bir dəfə resume etməli, refresh/retry əvəzləmələri daxil əsas cancellable-a sahib olmalıdır. Ümumi Error → failed mapping adi cancellation-u istifadəçi xətasına çevirə bilər. Protokol bugünkü main dispatch-ə güvənmək əvəzinə callback izolyasiyasını bildirməlidir.",
      ),
    ],
    decision: [
      b(
        "A timeout after submitting a transfer means the client does not know the result. It does not prove the server rejected or rolled back the transfer. Automatic retry is safe only under a compatible operation contract: idempotency key, bounded retry and status reconciliation where required. A cancelled client task can still leave a committed server mutation.",
        "Köçürmə göndərildikdən sonrakı timeout klientin nəticəni bilməməsidir. Serverin rədd/rollback etdiyini sübut etmir. Avtomatik retry yalnız uyğun müqavilə ilə təhlükəsizdir: idempotency key, məhdud retry və lazım olduqda status reconciliation. Client task cancellation olsa da server mutasiyası commit edilə bilər.",
      ),
      b(
        "Centralize transport mechanics without forcing every feature into the same response shape. Use sanitized operation category, status and timings for diagnosis; never tokens, full card details or customer payloads. Tests with a stub prove client behavior, while backend contract tests establish the real protocol. Report those forms of evidence separately.",
        "Bütün feature-i eyni cavab formasına məcbur etmədən transport mexanikasını mərkəzləşdir. Diagnostic üçün sanitizasiya edilmiş operation category, status və timing istifadə et; token, tam kart və müştəri payload-u yox. Stub test client davranışını, backend contract test real protokolu sübut edir. Bu sübutları ayrı bildir.",
      ),
    ],
    analogy: b(
      "Receiving a sealed letter proves delivery, not that the letter contains the document you requested or approves your payment. Check delivery, envelope, content and decision separately.",
      "Möhürlü məktub almaq çatdırılmanı sübut edir, istənən sənədi və ödəniş təsdiqini deyil. Çatdırılma, zərf, məzmun və qərarı ayrı yoxla.",
    ),
    example: {
      id: "response-contract",
      title: b(
        "Follow validation before decoding",
        "Decoding-dən əvvəl validation-u izlə",
      ),
      setup: b(
        "This function makes a real request only if a caller explicitly invokes it. The website does not run it. Foundation networking requires the appropriate platform module.",
        "Funksiya yalnız çağıran açıq işlətsə real sorğu edər. Sayt onu icra etmir. Foundation networking uyğun platforma modulu tələb edir.",
      ),
      code: "import Foundation\n#if canImport(FoundationNetworking)\nimport FoundationNetworking\n#endif\nstruct Account: Decodable { let id: String }\nenum APIError: Error { case invalidResponse, status(Int) }\nfunc fetchAccount(_ url: URL) async throws -> Account {\n    let (data, response) = try await URLSession.shared.data(from: url)\n    guard let http = response as? HTTPURLResponse else { throw APIError.invalidResponse }\n    guard http.statusCode == 200 else { throw APIError.status(http.statusCode) }\n    return try JSONDecoder().decode(Account.self, from: data)\n}",
      output: b(
        "No request or console output until explicitly called. Contract: transport → HTTP 200 validation → required Account decoding.",
        "Açıq çağırılana qədər sorğu/konsol çıxışı yoxdur. Müqavilə: transport → HTTP 200 yoxlaması → məcburi Account decoding.",
      ),
      steps: [
        b(
          "Transport can throw before an HTTP response exists.",
          "HTTP cavab yaranmazdan əvvəl transport throw edə bilər.",
        ),
        b(
          "A non-200 response follows endpoint-specific error policy rather than success decoding.",
          "200 olmayan cavab success decoding deyil, endpoint error qaydasına gedir.",
        ),
        b(
          "Valid HTTP status still does not guarantee schema-compatible JSON.",
          "Düzgün HTTP status schema uyğun JSON zəmanəti deyil.",
        ),
        b(
          "A decoded ID still needs any domain validation and server authorization the feature requires.",
          "Decode edilmiş ID yenə tələb olunan domain validation/server avtorizasiyasını istəyir.",
        ),
      ],
      takeaway: b(
        "Each boundary answers a different correctness question.",
        "Hər sərhəd ayrı düzgünlük sualını həll edir.",
      ),
    },
    debug: {
      title: b(
        "A failed history load looks like no transactions",
        "Uğursuz tarixçə əməliyyat yoxdur kimi görünür",
      ),
      broken:
        "func visibleRows(load: () async throws -> [String]) async -> [String] {\n    (try? await load()) ?? []\n}",
      failure: b(
        "Offline, unauthorized, invalid JSON and successful empty history all become []. The view cannot choose the correct recovery.",
        "Oflayn, unauthorized, səhv JSON və uğurlu boş tarixçə hamısı [] olur. View düzgün recovery seçə bilmir.",
      ),
      fixed:
        "enum HistoryResult { case loaded([String]), cancelled, failed(Error) }\nfunc visibleRows(load: () async throws -> [String]) async -> HistoryResult {\n    do { return .loaded(try await load()) }\n    catch is CancellationError { return .cancelled }\n    catch { return .failed(error) }\n}",
      why: b(
        "The result preserves useful distinctions. Concrete URLSession cancellation errors may need endpoint/adapter-specific mapping in addition to CancellationError; test the actual transport contract.",
        "Nəticə faydalı fərqi saxlayır. Konkret URLSession cancellation xətası CancellationError-dan əlavə adapter mapping istəyə bilər; real transport müqaviləsini test et.",
      ),
      test: b(
        "Use an empty successful loader, a failing loader and a cancellation fixture. Assert different outcomes and appropriate UI recovery.",
        "Boş uğurlu loader, failing loader və cancellation fixture istifadə et. Ayrı nəticə və uyğun UI recovery yoxla.",
      ),
    },
    interviews: [
      {
        id: "http-vs-business",
        level: "junior",
        question: b(
          "Is HTTP 200 enough to treat a response as a valid account?",
          "HTTP 200 cavabı düzgün hesab saymağa yetirmi?",
        ),
        why: b(
          "It tests the distinction between transport and application contracts.",
          "Transport və tətbiq müqaviləsini ayırır.",
        ),
        answer: b(
          "No. Validate the expected response kind, decode the required schema and enforce any domain validity rules. A backend may also report business outcomes inside a successful HTTP response. The endpoint contract decides what success means.",
          "Xeyr. Gözlənən cavab növü, məcburi schema decoding və domain validasiya lazımdır. Backend uğurlu HTTP daxilində biznes nəticəsi də verə bilər. Uğurun mənasını endpoint müqaviləsi seçir.",
        ),
        wrong: b(
          "“200 means JSONDecoder cannot fail” confuses protocol success with payload validity.",
          "“200 olduqda JSONDecoder uğursuz ola bilməz” protokol uğurunu payload etibarı ilə qarışdırır.",
        ),
        followup: b("What about 204?", "204 necə?"),
        followupAnswer: b(
          "An endpoint may validly succeed with no response body. Do not decode a required JSON object unless that endpoint promises one.",
          "Endpoint body-siz düzgün uğur verə bilər. Müqavilə vəd etmirsə məcburi JSON obyekt decode etmə.",
        ),
      },
      {
        id: "timeout-mutation",
        level: "middle",
        question: b(
          "Would you automatically retry a timed-out transfer?",
          "Timeout olan köçürməni avtomatik retry edərdinmi?",
        ),
        why: b(
          "A bank app must reason about unknown outcomes.",
          "Bank app naməlum nəticə haqqında düşünməlidir.",
        ),
        answer: b(
          "Only with a backend-supported safe repetition contract. The server may already have committed the transfer even though the response never arrived. I would preserve operation identity, use idempotency where supported, bound retry and reconcile status. Client cancellation is not rollback.",
          "Yalnız backend təhlükəsiz təkrar müqaviləsi varsa. Cavab gəlməsə də server köçürməni commit etmiş ola bilər. Operation identity saxlayar, dəstəklənirsə idempotency istifadə edər, retry-ni məhdudlaşdırıb status uzlaşdırardım. Client cancellation rollback deyil.",
        ),
        wrong: b(
          "“Timeout means the payment failed, so retry POST” can duplicate a mutation.",
          "“Timeout payment uğursuzdur, POST retry et” mutasiyanı təkrarlaya bilər.",
        ),
        followup: b(
          "Where should the operation ID survive restart?",
          "Operation ID restart-dan sonra harada qalmalıdır?",
        ),
        followupAnswer: b(
          "In appropriate durable non-secret pending-operation storage, linked to server reconciliation. Credentials need separate secure storage.",
          "Server reconciliation-a bağlı uyğun qalıcı qeyri-məxfi pending-operation storage-da. Credential ayrıca secure storage istəyir.",
        ),
      },
      {
        id: "network-cancel",
        level: "senior",
        question: b(
          "How do you preserve cancellation across refresh and retry?",
          "Refresh/retry boyunca cancellation-u necə qoruyursan?",
        ),
        why: b(
          "This tests the lifetime of a logical operation.",
          "Məntiqi əməliyyat lifetime-ını yoxlayır.",
        ),
        answer: b(
          "Own the logical request rather than one initial transport handle. Track replacement attempts, define waiter semantics for shared refresh, and ensure termination stops owned resources. Preserve cancellation through error conversion and distinguish stopping local work from remote mutation status. Controlled timing tests should cover cancellation before handle installation, during refresh and during retry.",
          "Tək ilkin transport handle deyil, məntiqi sorğuya sahib ol. Əvəz cəhdləri izlə, shared refresh waiter semantikasını seç, termination-un resursu dayandırmasını təmin et. Error conversion-da cancellation-u qoru, lokal dayanmanı remote mutation status-dan ayır. Test handle qoşulmazdan əvvəl, refresh və retry zamanı cancellation-u əhatə etməlidir.",
        ),
        wrong: b(
          "“Store the first task and cancel it” misses replacement work.",
          "“İlk task-ı saxla və cancel et” əvəz işi qaçırır.",
        ),
        followup: b(
          "Which telemetry is safe?",
          "Hansı telemetriya təhlükəsizdir?",
        ),
        followupAnswer: b(
          "Minimized sanitized status, duration, operation type and carefully scoped correlation metadata. Remove credential/customer values before they reach a sink.",
          "Minimal sanitizasiya edilmiş status, müddət, operation növü və dar correlation metadata. Credential/müştəri dəyərini sink-ə çatmamış çıxar.",
        ),
      },
    ],
    exercise: {
      prompt: b(
        "Write tests that distinguish success([]), HTTP unauthorized, decoding failure and cancellation. Explain which test requires a transport adapter and which can use an injected closure.",
        "success([]), HTTP unauthorized, decoding failure və cancellation-u ayıran test qur. Hansı testə transport adapter, hansına injection closure yetdiyini izah et.",
      ),
      hints: [
        b(
          "Unit tests can exercise result mapping without a network.",
          "Unit test şəbəkəsiz result mapping yoxlayır.",
        ),
        b(
          "Protocol correctness needs controlled HTTP responses and real decoder behavior.",
          "Protokol düzgünlüyü idarə olunan HTTP cavab və real decoder istəyir.",
        ),
      ],
      solution:
        "enum FixtureError: Error { case unauthorized, decoding }\nlet empty: () async throws -> [String] = { [] }\nlet unauthorized: () async throws -> [String] = { throw FixtureError.unauthorized }\nlet invalidPayload: () async throws -> [String] = { throw FixtureError.decoding }\nlet cancelled: () async throws -> [String] = { throw CancellationError() }\n// Inject each into visibleRows and assert its specific HistoryResult.\n// Separately stub HTTP at URLProtocol/adapter level to verify status and JSON mapping.",
      reasoning: b(
        "The closure fixtures prove consumer behavior, not that the real URLSession adapter maps each network outcome correctly. Keep the two evidence levels separate.",
        "Closure fixture istehlakçı davranışını sübut edir, real URLSession adapter-in bütün nəticəni düzgün mapping etdiyini deyil. İki sübut səviyyəsini ayır.",
      ),
      checks: [
        b(
          "No failure becomes an empty success.",
          "Heç bir xəta boş uğura çevrilmir.",
        ),
        b(
          "Cancellation has an intentional UI path.",
          "Cancellation məqsədli UI yolu daşıyır.",
        ),
        b(
          "Retry safety is tied to backend semantics.",
          "Retry təhlükəsizliyi backend semantikasına bağlıdır.",
        ),
      ],
    },
  }),
  extend({
    id: "topic-34",
    before: b(
      "Know property wrappers at a basic level. Separate a View value from the persistent storage SwiftUI associates with its identity.",
      "Property wrapper-ın ilkin mənasını bil. View dəyərini SwiftUI-ın identity-yə bağladığı qalıcı storage-dan ayır.",
    ),
    objectives: [
      b(
        "Choose an owner for state instead of guessing wrappers.",
        "Wrapper təxmin etmək əvəzinə state owner-i seç.",
      ),
      b(
        "Explain identity, observation and task lifetime separately.",
        "Identity, observation və task lifetime-ını ayrı izah et.",
      ),
    ],
    why: [
      b(
        "A SwiftUI View is a description computed from inputs. The framework can recreate that description repeatedly. Yet a toggle should not forget whether it is on whenever body is evaluated. State storage is therefore associated with the view’s identity rather than merely the lifetime of one temporary struct value. This is the first distinction to understand before choosing property wrappers.",
        "SwiftUI View girişdən hesablanan təsvirdir. Framework təsviri təkrar yarada bilər. Amma body hesablananda toggle on vəziyyətini unutmamalıdır. Buna görə state storage bir müvəqqəti struct lifetime-ına deyil, view identity-sinə bağlanır. Wrapper seçməzdən əvvəl ilk fərq budur.",
      ),
      b(
        "Ask two questions: who creates and owns the data, and which views need to observe or edit it? @State fits locally owned state, @Binding exposes a connection to state owned elsewhere. With the older ObservableObject system, @StateObject establishes object ownership for a view identity, while @ObservedObject observes an object supplied by another owner.",
        "İki sual ver: datanı kim yaradır/sahiblənir və hansı view müşahidə/redaktə edir? @State lokal owner state üçündür, @Binding başqa owner-in state-inə əlaqə verir. Köhnə ObservableObject sistemində @StateObject view identity üçün obyekt ownership-i qurur, @ObservedObject başqa owner-dən gələn obyekti izləyir.",
      ),
    ],
    mechanism: [
      b(
        "With Observation on supported OS versions, an @Observable model can be retained in @State, and @Bindable provides bindings where needed. Access tracking and the older objectWillChange model have different behavior. Do not perform a blanket wrapper replacement without checking deployment target, object lifetime and the exact dependencies each body reads.",
        "Dəstəklənən OS-lərdə Observation ilə @Observable model @State-də saxlanır, lazım olduqda @Bindable binding verir. Access tracking və köhnə objectWillChange fərqli davranır. Deployment target, object lifetime və body-nin oxuduğu asılılığı yoxlamadan wrapper-ları ümumi əvəz etmə.",
      ),
      b(
        "Stable identity matters in lists. Assigning a fresh UUID every time a model is mapped can make an old row look like a new row, resetting local state and disrupting transitions. Separately, .task(id:) restarts associated work when its ID changes, but a Task created inside that action is unstructured and needs its own ownership policy. Neither property wrapper choice nor @MainActor alone prevents stale responses.",
        "List-də sabit identity vacibdir. Hər mapping-də yeni UUID köhnə sətiri yeni kimi göstərib lokal state/transition-u poza bilər. Ayrı olaraq .task(id:) ID dəyişəndə bağlı işi yenidən başlayır, amma action daxilində Task unstructured-dır və öz ownership qaydası istəyir. Nə wrapper seçimi, nə tək @MainActor köhnə cavabı önləyir.",
      ),
    ],
    decision: [
      b(
        "Keep one source of truth. Copying an externally supplied model into local state can create two owners that disagree. Derive display values where possible instead of maintaining duplicate synchronized state. Profile broad invalidation before adding clever equality workarounds; repeated body evaluation is not itself proof that the entire screen redraws.",
        "Tək source of truth saxla. Xarici modeli lokal state-ə kopyalamaq razılaşmayan iki owner yarada bilər. İmkan varsa duplicate sinxron state əvəzinə display dəyərini derive et. Equality workaround-dan əvvəl geniş invalidation ölç; təkrar body hesablanması bütün ekran redraw sübutu deyil.",
      ),
      b(
        "For UIKit-hosted SwiftUI, explicitly identify the host, model and router owners. A migration should preserve navigation and side-effect attachment timing. Test identity changes, disappearance and reappearance, not just a screenshot of the happy path.",
        "UIKit host etdiyi SwiftUI-da host/model/router owner-i açıq seç. Migration naviqasiya və effect handler qoşulma vaxtını qorumalıdır. Tək happy-path screenshot deyil, identity dəyişikliyi, disappearance və reappearance test et.",
      ),
    ],
    analogy: b(
      "A View value is the current drawing instruction. Identity is the labeled drawer in which SwiftUI keeps state between drawings. Changing the drawer’s label can select different storage.",
      "View dəyəri cari çəkmə təlimatıdır. Identity SwiftUI-ın çəkilişlər arasında state saxladığı etiketli siyirmədir. Etiketi dəyişmək başqa storage seçə bilər.",
    ),
    example: {
      id: "state-binding",
      title: b(
        "One owner, a child that edits through a binding",
        "Bir owner, binding ilə redaktə edən child",
      ),
      setup: b(
        "Apple SDK required. The child does not create a second Bool copy to synchronize.",
        "Apple SDK tələb olunur. Child sinxronlaşdırmaq üçün ikinci Bool kopyası yaratmır.",
      ),
      code: 'import SwiftUI\nstruct PrivacyScreen: View {\n    @State private var visible = false\n    var body: some View { RevealToggle(visible: $visible) }\n}\nstruct RevealToggle: View {\n    @Binding var visible: Bool\n    var body: some View { Toggle("Show balance", isOn: $visible) }\n}',
      output: b(
        "UI example: changing the child Toggle updates the parent-owned visible state. No console output; not executed by this site.",
        "UI nümunəsi: child Toggle dəyişəndə parent-owned visible yenilənir. Konsol çıxışı yoxdur; sayt icra etmir.",
      ),
      steps: [
        b(
          "PrivacyScreen owns visible for its identity.",
          "PrivacyScreen öz identity-si üçün visible-a sahibdir.",
        ),
        b(
          "$visible supplies a binding rather than an independently owned Bool.",
          "$visible müstəqil Bool deyil, binding verir.",
        ),
        b(
          "The child writes through that connection to the source of truth.",
          "Child həmin əlaqə ilə source of truth-a yazır.",
        ),
      ],
      takeaway: b(
        "A binding is a way to read/write another owner’s state, not a new owner.",
        "Binding başqa owner-in state-ni oxuma/yazma yoludur, yeni owner deyil.",
      ),
    },
    debug: {
      title: b(
        "A row forgets its expanded state after every refresh",
        "Sətir hər refresh-də expanded state-i unudur",
      ),
      broken:
        "struct RowModel: Identifiable {\n    let id = UUID()\n    let serverID: String\n}\n// Rebuilding every row generates new identities, even for unchanged server records.",
      failure: b(
        "The UI sees new identities for the same records and can discard the state associated with the old rows.",
        "UI eyni record üçün yeni identity görür və köhnə sətirin state-ini ata bilər.",
      ),
      fixed:
        "struct RowModel: Identifiable {\n    let serverID: String\n    var id: String { serverID }\n}\n// Use this only when serverID is valid, unique and stable in the list scope.",
      why: b(
        "Identity follows the domain record, not the act of mapping it. Validate missing/duplicate IDs rather than assigning the same fake fallback to several rows.",
        "Identity mapping anını deyil, domen record-unu izləyir. Bir neçə sətirə eyni saxta fallback vermək əvəzinə missing/duplicate ID yoxla.",
      ),
      test: b(
        "Expand a row, refresh unchanged data and assert state is preserved. Then deliberately change identity and verify the reset is expected.",
        "Sətiri aç, eyni datanı refresh et və state-in qalmasını yoxla. Sonra identity-ni məqsədli dəyişib reset-in gözləndiyini yoxla.",
      ),
    },
    interviews: [
      {
        id: "stateobject-owner",
        level: "middle",
        question: b(
          "@StateObject versus @ObservedObject: how do you choose?",
          "@StateObject və @ObservedObject: necə seçirsən?",
        ),
        why: b(
          "The answer must identify the owner and framework generation.",
          "Cavab owner və framework nəslini müəyyən etməlidir.",
        ),
        answer: b(
          "For ObservableObject, @StateObject owns object storage associated with the view identity, while @ObservedObject observes an externally owned object. With Observation I reconsider the model and bindings rather than mechanically replacing wrappers. I identify who creates the object, who retains it and when identity changes should reset it.",
          "ObservableObject üçün @StateObject view identity-yə bağlı object storage owner-idir, @ObservedObject xarici owner-in obyektini izləyir. Observation-da wrapper-ı mexaniki əvəz etmək əvəzinə model/binding-ə yenidən baxıram. Obyekti kimin yaratdığı, saxladığı və hansı identity dəyişikliyinin reset etməli olduğunu seçirəm.",
        ),
        wrong: b(
          "“StateObject is always better because it keeps things alive” ignores intentionally external ownership.",
          "“StateObject yaşadır deyə həmişə yaxşıdır” məqsədli xarici ownership-i qaçırır.",
        ),
        followup: b(
          "Does a body evaluation mean the model should be recreated?",
          "Body hesablanması modelin yenidən yaranmasıdırmı?",
        ),
        followupAnswer: b(
          "No. Storage continuity depends on identity and ownership. Recreating temporary view descriptions is normal.",
          "Xeyr. Storage davamlılığı identity/ownership-dən asılıdır. Müvəqqəti view təsviri normal yenidən yaranır.",
        ),
      },
      {
        id: "swiftui-stale",
        level: "senior",
        question: b(
          "Why can .task and a ViewModel’s Task have different lifetimes?",
          " .task və ViewModel-in Task-ı niyə fərqli lifetime daşıyır?",
        ),
        why: b(
          "It tests the boundary between a view modifier and independently started work.",
          "View modifier və müstəqil iş sərhədini yoxlayır.",
        ),
        answer: b(
          "The modifier associates its task with view lifecycle/identity. A method it calls may launch a separate unstructured Task and return, leaving that work owned elsewhere. I trace creation, handle storage, cancellation and result relevance rather than assume view disappearance cancels every nested operation.",
          "Modifier task-ını view lifecycle/identity ilə bağlayır. Çağırdığı metod ayrıca unstructured Task yaradıb qayıda bilər və iş başqa owner-də qalar. View çıxışının bütün işi ləğv etdiyini fərz etmək əvəzinə yaradılma, handle, cancellation və nəticə aktuallığını izləyirəm.",
        ),
        wrong: b(
          "“Anything started inside .task is structured automatically” confuses lexical nesting with task relationships.",
          "“.task daxilində başlayan hər şey avtomatik structured-dır” leksik iç-içəliyi task əlaqəsi ilə qarışdırır.",
        ),
        followup: b(
          "What still protects correctness if cancellation is delayed?",
          "Cancellation gecikirsə düzgünlüyü nə qoruyur?",
        ),
        followupAnswer: b(
          "A current-operation identity check before visible state mutation, including failure and cleanup paths.",
          "Xəta/təmizləmə daxil görünən state yazmasından əvvəl cari operation identity yoxlaması.",
        ),
      },
    ],
    exercise: {
      prompt: b(
        "Build a parent-owned privacy toggle and explain how its identity affects state retention. Add an accessibility requirement so a masked balance is not read aloud.",
        "Parent-owned privacy toggle qur və identity-nin state saxlanmasına təsirini izah et. Gizli balansın səslə oxunmaması üçün accessibility tələbi əlavə et.",
      ),
      hints: [
        b(
          "A child should receive @Binding for editing the parent’s Bool.",
          "Child parent Bool-u redaktə üçün @Binding almalıdır.",
        ),
        b(
          "Visual masking and accessibility masking must agree.",
          "Vizual və accessibility gizlətməsi eyni state-ə uymalıdır.",
        ),
      ],
      solution:
        '// Apple SDK required.\nimport SwiftUI\nstruct BalancePrivacy: View {\n    @State private var visible = false\n    var body: some View {\n        VStack {\n            Text(visible ? "42 AZN" : "••••")\n                .accessibilityLabel(visible ? "42 AZN" : "Balance hidden")\n            Toggle("Show balance", isOn: $visible)\n        }\n    }\n}',
      reasoning: b(
        "The same state governs visible text and accessible output. Production must localize both labels and use locale-aware money formatting; the string amount is a focused teaching simplification.",
        "Eyni state görünən mətn və accessible çıxışı idarə edir. Production label-ları lokallaşdırmalı və locale-aware pul formatı istifadə etməlidir; string məbləğ fokuslu tədris sadələşdirməsidir.",
      ),
      checks: [
        b(
          "Hidden amount is not exposed through VoiceOver.",
          "Gizli məbləğ VoiceOver ilə açılmır.",
        ),
        b(
          "Changing child input updates the real owner.",
          "Child input real owner-i yeniləyir.",
        ),
        b(
          "Identity resets are intentional and tested.",
          "Identity reset-i məqsədli və testlidir.",
        ),
      ],
    },
  }),
  extend({
    id: "topic-38",
    before: b(
      "Read actor reentrancy, HTTP status and Keychain basics. Authentication is a session lifecycle, not a token string in preferences.",
      "Actor reentrancy, HTTP status və Keychain əsaslarını oxu. Autentifikasiya preference-də token string deyil, session lifecycle-dır.",
    ),
    objectives: [
      b(
        "Design one refresh shared by concurrent callers.",
        "Paralel çağıranların paylaşdığı bir refresh qur.",
      ),
      b(
        "Prevent an old refresh from resurrecting a logged-out session.",
        "Köhnə refresh-in logout sessiyasını diriltməsinə mane ol.",
      ),
    ],
    why: [
      b(
        "An access token can expire while ten feature requests are in flight. If each 401 independently refreshes, requests race, credentials can rotate unexpectedly and failures multiply. Single-flight refresh means callers join one in-progress operation for the relevant session instead of each creating a refresh. The shared work needs an owner, an end condition and a rule for waiting callers.",
        "On feature sorğusu işləyərkən access token bitə bilər. Hər 401 ayrı refresh etsə sorğular yarışır, credential gözlənilmədən rotate olur və xəta çoxalır. Single-flight refresh uyğun sessiya üçün çağıranların bir gedən işə qoşulmasıdır. Shared iş owner, bitmə şərti və gözləyənlər üçün qayda istəyir.",
      ),
      b(
        "Authentication establishes identity; authorization decides whether that identity can perform an action. Local biometric success does not authorize a transfer on the backend. Token storage, token refresh, session generation and financial authorization are connected boundaries, not one interchangeable security check.",
        "Autentifikasiya kimliyi, avtorizasiya həmin kimliyin əməliyyat icazəsini müəyyən edir. Lokal biometrik uğur backend köçürməsini avtorizasiya etmir. Token storage, refresh, session generation və maliyyə avtorizasiyası bağlı sərhəddir, bir-birini əvəz edən yoxlama deyil.",
      ),
    ],
    mechanism: [
      b(
        "An actor can serialize access to refresh state. Before creating work, check for an existing task and join it; otherwise install a task before suspending so reentrant callers can find it. Clear the in-flight entry on success/failure only if it still belongs to that operation. An actor does not remove the need to reason about what changes while awaiting.",
        "Actor refresh state girişini serial edə bilər. İş yaratmazdan əvvəl mövcud task-a bax və qoşul; yoxdursa suspend etmədən task-ı yerləşdir ki reentrant çağıran tapsın. Success/failure-də yalnız hələ o əməliyyata aiddirsə in-flight qeydini təmizlə. Actor await zamanı dəyişikliyi düşünmək ehtiyacını silmir.",
      ),
      b(
        "Logout invalidates session identity or generation. A refresh that started under the old generation must not publish new credentials when it returns. Likewise, one cancelled waiter may not be allowed to cancel refresh needed by others. Keep bounded retry, session-ended outcomes and secure storage failure explicit. Do not hold a thread-owned NSLock across an async request and unlock it on another callback thread.",
        "Logout session identity/generation-u etibarsız edir. Köhnə generation-da başlayan refresh qayıdanda yeni credential paylaşmamalıdır. Eyni qaydada bir waiter cancellation-u başqalarının ehtiyac duyduğu refresh-i ləğv etməyə bilər. Məhdud retry, session-ended və secure storage failure açıq qalsın. Thread-owned NSLock-u async sorğu boyunca saxlayıb başqa callback thread-də açma.",
      ),
    ],
    decision: [
      b(
        "A minimal shared-task example is not a complete production auth subsystem. Add session invalidation, operation identity, waiter cancellation, credential rotation and retry limits before claiming reliability. Test logout during refresh with controlled completion rather than real sleeps. Never include access/refresh token values in telemetry or snapshots.",
        "Minimal shared-task nümunəsi tam production auth sistemi deyil. Etibarlılıq iddiasından əvvəl session invalidation, operation identity, waiter cancellation, credential rotation və retry limiti əlavə et. Refresh zamanı logout-u real sleep deyil, idarə olunan completion ilə test et. Token dəyərini telemetriya/snapshot-a daxil etmə.",
      ),
      b(
        "Choose Keychain accessibility and protection based on locked-device/background requirements, not whichever option suppresses an error. A temporarily locked item is different from a missing item; erasing a valid session on every storage error can make recovery worse. Coordinate revocation and idempotency with the backend.",
        "Keychain accessibility/protection-u xətanı gizlədən seçimlə deyil, locked-device/background tələbi ilə seç. Müvəqqəti kilidli item missing-dən fərqlidir; hər storage xətasında etibarlı sessiyanı silmək bərpanı pisləşdirir. Revocation və idempotency-ni backend-lə razılaşdır.",
      ),
    ],
    analogy: b(
      "One expired-session announcement should lead callers to one renewal desk. Closing the account invalidates the old renewal ticket, even if the desk later finishes processing it.",
      "Sessiya bitəndə çağıranlar bir yeniləmə masasına getməlidir. Hesabı bağlamaq köhnə yeniləmə biletini etibarsız edir, masa sonra işi bitsə də.",
    ),
    example: {
      id: "shared-refresh-task",
      title: b(
        "A focused shared-task pattern, with explicit limits",
        "Açıq məhdudiyyətli fokuslu shared-task nümunəsi",
      ),
      setup: b(
        "The generic String is a teaching stand-in for a result; never print a real token. This fragment illustrates sharing, not the full logout/waiter policy.",
        "String nəticə üçün tədris əvəzidir; real token çap etmə. Fraqment paylaşmanı göstərir, tam logout/waiter qaydasını deyil.",
      ),
      code: "actor RefreshCoordinator {\n    private var inFlight: Task<String, Error>?\n    func refresh(using operation: @escaping @Sendable () async throws -> String) async throws -> String {\n        if let inFlight { return try await inFlight.value }\n        let task = Task { try await operation() }\n        inFlight = task\n        defer { inFlight = nil }\n        return try await task.value\n    }\n}",
      output: b(
        "No console output. While the installed task is pending, reentrant callers join its value. Session invalidation and waiter cancellation still need their own contract.",
        "Konsol çıxışı yoxdur. Yerləşdirilmiş task gözləyərkən reentrant çağıran onun value-sinə qoşulur. Session invalidation və waiter cancellation ayrıca müqavilə istəyir.",
      ),
      steps: [
        b(
          "The first caller installs a task before awaiting its result.",
          "İlk çağıran nəticəni await etmədən task yerləşdirir.",
        ),
        b(
          "While it is suspended, another caller sees inFlight and joins.",
          "O suspend ikən başqa çağıran inFlight görüb qoşulur.",
        ),
        b(
          "The creating call clears the slot when its scope finishes.",
          "Yaradan çağırış scope bitəndə slot-u təmizləyir.",
        ),
        b(
          "Adding logout/replacement changes the invariant, so unconditional cleanup may need operation-ID protection.",
          "Logout/əvəzləmə invariantı dəyişir; şərtsiz təmizlənmə operation-ID yoxlaması istəyə bilər.",
        ),
      ],
      takeaway: b(
        "A small example can teach one invariant without pretending to be production-complete.",
        "Kiçik nümunə production-complete iddiası olmadan bir invariant öyrədə bilər.",
      ),
    },
    debug: {
      title: b(
        "A refresh completes after logout",
        "Refresh logout-dan sonra bitir",
      ),
      broken:
        "// Pseudocode: no session identity is captured.\nlet newCredential = try await refresh()\ncurrentSession = .signedIn(newCredential)",
      failure: b(
        "Logout during await can be undone by the old completion. Actor isolation alone does not establish which session the result belongs to.",
        "await zamanı logout köhnə completion ilə geri çevrilir. Tək actor izolyasiyası nəticənin hansı sessiyaya aid olduğunu qurmur.",
      ),
      fixed:
        "// Pseudocode: integrate into the serialized session owner.\nlet mine = sessionGeneration\nlet newCredential = try await refresh()\nguard mine == sessionGeneration, sessionIsActive else {\n    throw SessionEnded()\n}\ncurrentSession = .signedIn(newCredential)\n// Logout marks inactive and increments generation before old work resumes.",
      why: b(
        "The post-await check validates the session that started the work. This is pseudocode because credential publication, storage and waiter policy depend on the application contract.",
        "await-dən sonrakı yoxlama işi başlayan sessiyanı doğrulayır. Credential paylaşılması, storage və waiter siyasəti tətbiqdən asılı olduğu üçün bu pseudocode-dur.",
      ),
      test: b(
        "Suspend refresh, logout, finish refresh, assert the session remains signed out and old waiters receive a session-ended outcome.",
        "Refresh-i suspend et, logout et, refresh-i bitir, sessiyanın signed-out və köhnə waiter nəticəsinin session-ended qaldığını yoxla.",
      ),
    },
    interviews: [
      {
        id: "auth-single-flight",
        level: "middle",
        question: b(
          "How do you handle ten simultaneous 401 responses?",
          "On eyni vaxtlı 401-i necə idarə edirsən?",
        ),
        why: b(
          "It tests sharing, retry bounds and session ownership.",
          "Paylaşma, retry sərhədi və session ownership-i yoxlayır.",
        ),
        answer: b(
          "Join one in-flight refresh per valid session generation, then retry eligible logical requests with updated credentials under a bounded policy. If refresh fails, resolve waiters consistently and transition the session appropriately. Avoid one refresh per request and avoid infinite retry loops. Cancellation of one waiter must follow an explicit sharing policy.",
          "Etibarlı session generation başına bir in-flight refresh-ə qoşulub uyğun məntiqi sorğunu yeni credential ilə məhdud qaydada təkrarlayıram. Refresh uğursuzdursa waiter-ları ardıcıl həll edib session-u uyğun dəyişirəm. Sorğu başına refresh və sonsuz retry etmirəm. Bir waiter cancellation-u açıq paylaşma siyasətinə tabedir.",
        ),
        wrong: b(
          "“Put a lock around the whole network request” does not define async ownership or waiters.",
          "“Bütün sorğunu lock-a al” async ownership və waiter-i müəyyən etmir.",
        ),
        followup: b(
          "Should one caller cancelling cancel the shared refresh?",
          "Bir çağıranın cancellation-u shared refresh-i ləğv etməlidirmi?",
        ),
        followupAnswer: b(
          "Not automatically. Other callers may still need it. Define whether the shared operation continues, whether all waiters are gone, and how each waiter gets cancellation.",
          "Avtomatik yox. Başqalarının ehtiyacı qala bilər. Shared işin davamı, bütün waiter-ın gedib-getməməsi və hər waiter cancellation-u açıq müəyyən et.",
        ),
      },
      {
        id: "auth-logout",
        level: "senior",
        question: b(
          "What must remain true when logout races with token refresh?",
          "Logout refresh-lə yarışanda hansı invariant qalmalıdır?",
        ),
        why: b(
          "A strong answer protects session generation, not just token freshness.",
          "Güclü cavab tək token aktuallığını deyil, session generation-u qoruyur.",
        ),
        answer: b(
          "No work from an invalidated session may restore authentication or publish credentials into a new session. Capture session identity/generation and revalidate after suspension, including cleanup and retry paths. Coordinate secure-storage writes and backend revocation, and test old completions after both logout and a subsequent login.",
          "Etibarsız sessiyanın işi auth-u qaytara və yeni sessiyaya credential paylaşa bilməz. Identity/generation capture edib suspension-dan sonra cleanup/retry daxil yenidən yoxla. Secure-storage yazmasını və backend revocation-u koordinasiya et; logout və sonrakı login-dən sonra köhnə completion-u test et.",
        ),
        wrong: b(
          "“The latest refresh result always wins” can resurrect or corrupt a different session.",
          "“Son refresh nəticəsi həmişə qalibdir” başqa sessiyanı dirildə/poza bilər.",
        ),
        followup: b(
          "Is @unchecked Sendable enough for the service?",
          "Servis üçün @unchecked Sendable yetərlidirmi?",
        ),
        followupAnswer: b(
          "It is a manual safety assertion, not synchronization. Inspect mutable state, collaborators, callback isolation and the operation invariants.",
          "Manual safety iddiasıdır, sinxronizasiya deyil. Mutable state, asılılıq, callback izolyasiyası və operation invariantını yoxla.",
        ),
      },
    ],
    exercise: {
      prompt: b(
        "Write the state-transition test for refresh success arriving after logout and after a new login. Which identity must the old completion compare?",
        "Logout və yeni login-dən sonra gələn refresh uğuru üçün state-transition test yaz. Köhnə completion hansı identity-ni müqayisə etməlidir?",
      ),
      hints: [
        b(
          "An active Boolean alone cannot distinguish the old and new logged-in sessions.",
          "Tək active Boolean köhnə və yeni logged-in sessiyanı ayırmır.",
        ),
        b(
          "Give each session generation an identity that changes at invalidation.",
          "Hər session generation-a invalidation-da dəyişən identity ver.",
        ),
      ],
      solution:
        "// Deterministic test recipe, not executable production code:\n// 1. Login session A with generation 1.\n// 2. Start refresh A; hold its completion.\n// 3. Logout: mark inactive, invalidate generation 1.\n// 4. Login session B under a new generation.\n// 5. Complete refresh A.\n// 6. Assert session B credentials and state are unchanged.\n// 7. Assert old waiters finish with session-ended, not B credentials.",
      reasoning: b(
        "A Boolean might be true again after new login. Comparing only that flag accepts the old result. Session identity/generation identifies which lifecycle the operation belongs to.",
        "Yeni login-dən sonra Boolean yenə true ola bilər. Tək flag köhnə nəticəni qəbul edir. Session identity/generation əməliyyatın hansı lifecycle-a aid olduğunu müəyyən edir.",
      ),
      checks: [
        b(
          "Old refresh never restores logged-out session A.",
          "Köhnə refresh logout olmuş A-nı diriltmir.",
        ),
        b(
          "Old refresh never overwrites new session B.",
          "Köhnə refresh yeni B-ni əvəz etmir.",
        ),
        b(
          "No real token value appears in the test log.",
          "Test log-da real token yoxdur.",
        ),
      ],
    },
  }),
];
