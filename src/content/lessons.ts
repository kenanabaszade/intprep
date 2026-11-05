import { bi as b, type Lesson } from "@/lib/types";
import { guides } from "./guides";
const swift =
  "https://docs.swift.org/swift-book/documentation/the-swift-programming-language/";
const apple = "https://developer.apple.com/documentation/";
export const lessons: Lesson[] = [
  {
    id: "topic-01",
    minutes: 25,
    prerequisites: [],
    intro: b(
      "An Optional is an enum with two states: some value, or no value. It makes absence part of the type, so a missing account cannot accidentally behave like a real account. let prevents reassignment; it does not recursively freeze everything reachable through a reference.",
      "Optional iki vəziyyətli enum-dur: dəyər var və ya dəyər yoxdur. Yoxluq tipin bir hissəsidir; tapılmayan hesab həqiqi hesab kimi istifadə edilə bilməz. let yenidən mənimsətməni qadağan edir, amma istinadla çatan bütün obyektləri dondurmur.",
    ),
    mechanism: b(
      "Optional<Wrapped> has .none and .some(Wrapped). Use if let for a local branch, guard let when the remaining scope requires a value, ?? for a valid default, and chaining to propagate absence. Avoid inventing an account ID of 0 to hide a missing identifier. Representation optimizations are compiler details, not a promise that every Optional occupies extra memory.",
      "Optional<Wrapped> .none və .some(Wrapped) halları ilə modelləşir. Lokal budaqlanma üçün if let, sonrakı scope üçün dəyər tələb olunursa guard let, düzgün standart dəyər üçün ?? işlət. Optional chaining yoxluğu ötürür. Çatışmayan hesab ID-sini 0 ilə gizlətmə. Yaddaş optimallaşdırmaları compiler detalıdır; hər Optional mütləq əlavə yaddaş tutmur.",
    ),
    judgment: b(
      "Model absence separately from failure and loading. A nil balance could mean not fetched, inaccessible, or missing: an enum can preserve these distinct product states. At API boundaries, reject invalid mandatory fields rather than pushing crashes into UI code.",
      "Yoxluğu xəta və yüklənmədən ayır. nil balans hələ yüklənməyib, əlçatmazdır və ya yoxdur mənasını verə bilər: enum bu fərqləri saxlayır. API sərhədində məcburi sahələri yoxla; crash riskini UI-a ötürmə.",
    ),
    code: 'let accountID: Int? = nil\nlet label = accountID.map { "Account \\($0)" } ?? "No account"\nprint(label)\n\nfunc canOpen(_ id: Int?) -> Bool {\n    guard let id, id > 0 else { return false }\n    return true\n}\nprint(canOpen(accountID))',
    predicted: "No account\nfalse",
    trap: b(
      "Force-unwrapping is an assertion that a value exists. A backend response is not such a guarantee. Replace it with a validated boundary and an explicit failure path.",
      "Force unwrap dəyərin olmasına iddiadır. Backend cavabı belə zəmanət deyil. Sərhəddə yoxlama və açıq xəta yolu yarat.",
    ),
    exercise: b(
      "Design a state for a balance that is loading, loaded with Decimal, or failed. Explain why Decimal? alone loses information.",
      "Yüklənən, Decimal ilə yüklənmiş və xəta almış balans üçün state qur. Təkcə Decimal? hansı məlumatı itirir?",
    ),
    solution: b(
      "Use an enum BalanceState with loading, loaded(Decimal), and failed(BalanceError). Absence can be a separate state only if the product actually permits it.",
      "BalanceState enum-unda loading, loaded(Decimal) və failed(BalanceError) istifadə et. Məhsul tələb edirsə yoxluq ayrıca hal ola bilər.",
    ),
    question: b(
      "A missing account ID arrives from the API. What is the safest default?",
      "API-dən hesab ID-si gəlmir. Ən təhlükəsiz davranış hansıdır?",
    ),
    choices: [
      b("Force unwrap it", "Force unwrap etmək"),
      b("Use 0 everywhere", "Hər yerdə 0 işlətmək"),
      b(
        "Validate and represent missing/invalid data explicitly",
        "Yoxlamaq və çatışmayan/səhv məlumatı açıq göstərmək",
      ),
    ],
    correct: 2,
    followup: b(
      "When is a force unwrap a reasonable invariant assertion?",
      "Force unwrap nə vaxt əsaslandırılmış invariant iddiasıdır?",
    ),
    source: swift + "thebasics/",
    sourceLabel: "The Swift Programming Language · The Basics",
  },
  {
    id: "topic-02",
    title: b(
      "Value semantics & copy-on-write",
      "Dəyər semantikası və copy-on-write",
    ),
    minutes: 35,
    prerequisites: ["topic-01"],
    intro: b(
      "Copy a value and you get an independent logical value. Copy a reference and you get another way to reach the same object. Imagine copying a bank statement versus sharing a link to one live account. A struct may still contain references.",
      "Dəyəri kopyalayanda müstəqil məntiqi dəyər alırsan. İstinadı kopyalayanda eyni obyektə başqa yoldan çatırsan. Bank çıxarışını kopyalamaqla canlı hesaba keçidi paylaşmaq arasındakı fərqi düşün. Struct daxilində class istinadları ola bilər.",
    ),
    mechanism: b(
      "Array, Dictionary and Set provide value semantics and may share storage until a mutation needs uniqueness. Copy-on-write is a storage strategy, not a new ownership rule. Copying a struct containing a class copies that reference too: mutating the shared object is observable through both values. Stack versus heap is a teaching model, not a guarantee about every struct allocation.",
      "Array, Dictionary və Set dəyər semantikası verir; mutasiya zamanı unikallıq lazım olana qədər storage paylaşıla bilər. COW storage strategiyasıdır, yeni ownership qaydası deyil. Class saxlayan struct kopyalananda həmin istinad da kopyalanır: obyektin mutasiyası hər iki dəyərdə görünür. Stack/heap modeli hər struct üçün yerləşmə zəmanəti deyil.",
    ),
    judgment: b(
      "Value semantics simplify local reasoning, but large copy-on-write mutations can allocate on hot paths. Profile allocations under realistic collection sizes before replacing values with shared mutable classes. For financial state, separate immutable snapshots from live reference-owned services. Deep copying requires an explicit domain policy for referenced objects.",
      "Dəyər semantikası lokal düşünməni sadələşdirir, amma böyük COW mutasiyası tez-tez işləyən yolda allocation yarada bilər. Dəyərləri paylaşılan class-larla əvəz etməzdən əvvəl real ölçülərlə ölç. Maliyyə state-ində snapshot-ları canlı servislərdən ayır. Deep copy üçün istinad olunan obyektlərə ayrıca domen qaydası lazımdır.",
    ),
    code: "final class Account { var balance = 10 }\nstruct Snapshot { let account: Account }\nlet first = Snapshot(account: Account())\nlet second = first\nsecond.account.balance = 20\nprint(first.account.balance)\nvar a = [1, 2]\nvar c = a\nc.append(3)\nprint(a.count, c.count)",
    predicted: "20\n2 3",
    trap: b(
      "let second does not freeze second.account.balance. A struct copy is not automatically a deep copy.",
      "let second, second.account.balance dəyərini dondurmur. Struct kopyası avtomatik deep copy deyil.",
    ),
    exercise: b(
      "Change the model so copying a balance snapshot gives independent state. Which dependency should remain a class?",
      "Balans snapshot-ını müstəqil etmək üçün modeli dəyiş. Hansı asılılıq class qalmalıdır?",
    ),
    solution: b(
      "Store Decimal balance directly in a value model. Keep a network client or persistence coordinator as a reference with explicit ownership and isolation.",
      "Dəyər modelində balansı birbaşa Decimal kimi saxla. Şəbəkə klienti və persistence koordinatoru açıq ownership və izolyasiya ilə istinad ola bilər.",
    ),
    question: b(
      "Why does first.account.balance become 20?",
      "Niyə first.account.balance 20 olur?",
    ),
    choices: [
      b(
        "All structs use reference semantics",
        "Bütün struct-lar istinad semantikasındadır",
      ),
      b(
        "Both struct values contain a reference to the same Account",
        "Hər iki struct eyni Account obyektinə istinad edir",
      ),
      b(
        "let variables are mutable",
        "let dəyişənləri yenidən mənimsədilə bilər",
      ),
    ],
    correct: 1,
    followup: b(
      "How would you measure a costly COW mutation without assuming where storage lives?",
      "Storage yerini fərz etmədən bahalı COW mutasiyasını necə ölçərsən?",
    ),
    source: swift + "classesandstructures/",
    sourceLabel: "Swift · Structures and Classes",
  },
  {
    id: "topic-04",
    minutes: 35,
    prerequisites: ["topic-02"],
    intro: b(
      "A closure is behavior that can travel as a value and retain the context it needs. An escaping closure may outlive the call that received it. This is useful for callbacks and also creates lifetime obligations.",
      "Closure dəyər kimi ötürülən və lazım olan konteksti saxlayan davranışdır. Escaping closure onu qəbul edən çağırışdan uzun yaşaya bilər. Callback üçün faydalıdır, amma lifetime öhdəliyi yaradır.",
    ),
    mechanism: b(
      "A capture list is evaluated when the closure is created. A weak capture does not keep an object alive. guard let self creates a strong local reference for that scope, possibly across await. A closure capturing a variable can observe later mutations; a capture-list entry snapshots its initial value. Map transforms, compactMap removes nil results, and flatMap flattens one level.",
      "Capture list closure yarananda hesablanır. weak istinad obyekti yaşatmır. guard let self həmin scope üçün güclü lokal istinad yaradır və await zamanı da saxlaya bilər. Dəyişənin capture edilməsi sonrakı mutasiyanı görə bilər; capture-list elementi ilkin dəyəri saxlayır. map çevirir, compactMap nil-ləri çıxarır, flatMap bir səviyyə açır.",
    ),
    judgment: b(
      "Choose ownership from the graph and desired lifetime. A completion temporarily retaining its owner is not necessarily a leak. Cancellation must be modeled separately from weak capture. Prefer a clear loop when a chain creates intermediate collections or hides error handling.",
      "Ownership seçimini qraf və gözlənilən lifetime əsasında et. Completion-un sahibini müvəqqəti saxlaması mütləq leak deyil. Cancellation weak capture-dan ayrı modelləşir. Zəncir ara kolleksiyalar yaradırsa və ya xəta yolunu gizlədirsə, aydın loop seç.",
    ),
    code: "var amount = 10\nlet live = { amount }\nlet snapshot = { [amount] in amount }\namount = 20\nprint(live())\nprint(snapshot())",
    predicted: "20\n10",
    trap: b(
      "[weak self] does not cancel a Task or automatically solve every retain cycle. Trace who stores the closure and when it is released.",
      "[weak self] Task-ı ləğv etmir və bütün retain cycle-ları avtomatik həll etmir. Closure-u kimin saxladığını və nə vaxt buraxdığını izlə.",
    ),
    exercise: b(
      "Draw owner → stored closure → owner. Break the cycle while deciding what should happen after owner deallocation.",
      "owner → saxlanmış closure → owner qrafını çək. Owner silindikdən sonrakı davranışı seçərək dövrü qır.",
    ),
    solution: b(
      "Use a weak back-reference when work should be ignored after the owner is gone; additionally cancel owned work at an explicit lifecycle boundary.",
      "Owner yoxdursa işi atlamaq üçün weak geri istinad seç; sahib olunan işi ayrıca lifecycle sərhədində ləğv et.",
    ),
    question: b(
      "What does a capture-list value snapshot read after amount changes?",
      "amount dəyişəndən sonra capture-list snapshot-ı nə oxuyur?",
    ),
    choices: [
      b("The original captured value", "Əvvəl capture edilən dəyəri"),
      b("Always the newest value", "Həmişə son dəyəri"),
      b("A compile error", "Compile xətası"),
    ],
    correct: 0,
    followup: b(
      "What changes if the captured value is a class reference?",
      "Capture edilən dəyər class istinadıdırsa nə dəyişir?",
    ),
    source: swift + "closures/",
    sourceLabel: "Swift · Closures",
  },
  {
    id: "topic-07",
    minutes: 40,
    prerequisites: ["topic-06"],
    intro: b(
      "A protocol describes a capability a consumer needs. A conforming type supplies that behavior. This allows a balance screen to ask for a balance without depending on one transport implementation.",
      "Protokol istehlakçının ehtiyac duyduğu bacarığı təsvir edir. Uyğun tip həmin davranışı verir. Balans ekranı konkret transport-a bağlı olmadan balans istəyə bilir.",
    ),
    mechanism: b(
      "Requirements are dispatched using the conformance witness when accessed through an existential. A method that exists only in a protocol extension is not a requirement and can be selected statically from the available type. some preserves one hidden concrete type; any is an existential that can hold different conformers, with semantic and performance constraints.",
      "Existential vasitəsilə çağırılan requirement conformance witness üzərindən seçilir. Yalnız extension-da olan metod requirement deyil və görünən tip əsasında statik seçilə bilər. some gizli konkret tipi saxlayır; any müxtəlif uyğun tipləri saxlaya bilən existential-dır və semantik/performans məhdudiyyətləri var.",
    ),
    judgment: b(
      "Design protocols from consumer vocabulary and stable policy. A protocol returning a raw vendor response still leaks vendor coupling. Type erasure is useful at storage boundaries but can remove associated-type relationships and add indirection; do not use it reflexively.",
      "Protokolu istehlakçının dili və sabit qayda əsasında qur. Vendor cavabını birbaşa qaytaran protokol vendor asılılığını sızdırır. Type erasure saxlama sərhədində faydalıdır, amma associated-type əlaqələrini itirə və dolayı çağırış yarada bilər.",
    ),
    code: 'protocol Reporter {}\nextension Reporter { func report() -> String { "default" } }\nstruct BankReporter: Reporter {\n    func report() -> String { "bank" }\n}\nlet value: any Reporter = BankReporter()\nprint(value.report())\nprint(BankReporter().report())',
    predicted: "default\nbank",
    trap: b(
      "Adding a same-named method to the conformer does not turn an extension-only method into a protocol requirement. Declare the requirement in the protocol when polymorphic behavior is intended.",
      "Uyğun tipə eyni adlı metod əlavə etmək extension metodunu requirement etmir. Polimorfik davranış lazımdırsa requirement-i protokolda elan et.",
    ),
    exercise: b(
      "Move report() into the protocol requirements. Predict both calls again and explain witness selection.",
      "report()-u protocol requirement et. Hər iki çağırışı yenidən proqnozlaşdır və witness seçimini izah et.",
    ),
    solution: b(
      "Both return bank with this conformance: BankReporter.report witnesses the requirement. The extension supplies a default only when needed.",
      "Bu conformance ilə hər ikisi bank qaytarır: requirement-in witness-i BankReporter.report olur. Extension lazım olduqda default verir.",
    ),
    question: b(
      "The extension-only method called through any Reporter returns what?",
      "any Reporter üzərindən extension-only metod nə qaytarır?",
    ),
    choices: [
      b("bank", "bank"),
      b("default", "default"),
      b("Random output", "Təsadüfi nəticə"),
    ],
    correct: 1,
    followup: b(
      "How does subclassing complicate a default witness inherited from a superclass?",
      "Superclass-dan gələn default witness subclass zamanı nəyi çətinləşdirir?",
    ),
    source: swift + "protocols/",
    sourceLabel: "Swift · Protocols",
  },
  {
    id: "topic-08",
    minutes: 40,
    prerequisites: ["topic-02", "topic-04"],
    intro: b(
      "ARC keeps a class instance alive while strong owners need it. A weak reference observes without owning. A retain cycle happens when objects keep each other alive even after outside owners disappear. Think of two people each holding the only key to release the other.",
      "ARC güclü sahiblər ehtiyac duyduqca class obyektini yaşadır. weak istinad sahib olmadan müşahidə edir. Xarici sahiblər getsə də obyektlər bir-birini saxlayırsa retain cycle yaranır. Bir-birini azad etməyin yeganə açarını tutan iki nəfəri düşün.",
    ),
    mechanism: b(
      "Strong assignment adds ownership; releasing the last strong owner permits deinitialization. Weak references are zeroed when the object is deallocated and are commonly optional. An unowned reference expresses a lifetime assumption; accessing it after destruction traps. A stored closure can strongly capture its owner. guard let self temporarily creates a strong local owner. ARC is not a tracing garbage collector that discovers and breaks cycles.",
      "Strong mənimsətmə ownership yaradır; son güclü sahib buraxılanda deinitialization mümkündür. Obyekt silinəndə weak istinad nil olur və adətən Optional-dır. unowned lifetime fərziyyəsidir; obyekt yox olduqdan sonra müraciət trap yaradır. Saxlanmış closure sahibini güclü capture edə bilər. ARC dövrləri tapıb qıran tracing garbage collector deyil.",
    ),
    judgment: b(
      "Investigate retention paths, not only rising memory. Caches can legitimately retain objects; unbounded histories and leaked observers can grow without a simple two-object cycle. Use Memory Graph and Allocations over repeated navigation. Define task cancellation, subscription lifetime, and cache eviction independently.",
      "Təkcə artan yaddaşı deyil, saxlama yollarını araşdır. Cache obyektləri haqlı olaraq saxlayır; məhdudsuz tarixçə və observer-lər sadə ikiobyektli dövr olmadan da böyüyür. Təkrar naviqasiya zamanı Memory Graph və Allocations istifadə et. Task cancellation, subscription lifetime və cache eviction-u ayrıca müəyyən et.",
    ),
    code: 'final class Screen {\n    var action: (() -> Void)?\n    deinit { print("released") }\n}\nvar screen: Screen? = Screen()\nweak var observer = screen\nscreen?.action = { [weak screen] in\n    print(screen == nil ? "gone" : "alive")\n}\nscreen = nil\nprint(observer == nil)',
    predicted: "released\ntrue",
    trap: b(
      "Weak capture does not mean the closure disappears or asynchronous work stops. unowned is not simply a faster weak reference: it has a stronger lifetime precondition.",
      "Weak capture closure-un yox olması və ya async işin dayanması demək deyil. unowned sadəcə daha sürətli weak deyil: daha sərt lifetime şərti var.",
    ),
    exercise: b(
      "Change the example to capture the instance strongly in its stored closure. Predict deinit, then explain two ways to restore the intended lifetime.",
      "Nümunədə saxlanmış closure-a obyekti güclü capture etdir. deinit-i proqnozlaşdır və gözlənilən lifetime-ı bərpa etməyin iki yolunu izah et.",
    ),
    solution: b(
      "The owner retains its closure and the closure retains the owner. Use weak capture if appropriate, or clear the stored closure at a guaranteed end-of-operation boundary. Do not rely on deinit to break the cycle that prevents deinit.",
      "Owner closure-u, closure isə owner-i saxlayır. Uyğundursa weak capture et və ya əməliyyatın zəmanətli sonunda closure-u təmizlə. deinit-in özünə mane olan dövrü deinit-də qırmağa güvənmə.",
    ),
    question: b(
      "Which reference keeps an instance alive?",
      "Hansı istinad obyekti yaşadır?",
    ),
    choices: [
      b("weak", "weak"),
      b("unowned", "unowned"),
      b("strong", "strong"),
    ],
    correct: 2,
    followup: b(
      "Why might a completed task release an owner even if it used a strong capture?",
      "Strong capture olsa da bitmiş task niyə owner-i buraxa bilər?",
    ),
    source: swift + "automaticreferencecounting/",
    sourceLabel: "Swift · Automatic Reference Counting",
  },
  {
    id: "topic-12",
    minutes: 50,
    prerequisites: ["topic-04", "topic-08"],
    intro: b(
      "Concurrency lets multiple activities make progress; parallelism means work runs simultaneously. await marks a possible suspension, not a promise to start another thread. An actor protects isolated state from concurrent unsynchronized access.",
      "Concurrency bir neçə işin irəliləməsinə imkan verir; paralellik eyni anda icradır. await mümkün suspension nöqtəsidir, başqa thread yaratmaq vədi deyil. Actor izolyasiyalı state-i sinxronlaşdırılmamış paralel girişdən qoruyur.",
    ),
    mechanism: b(
      "When an actor method suspends, other work may enter the actor and change state. This is reentrancy: no data race is required for a stale business decision. Structured child tasks have bounded lifetimes and propagate cancellation, which remains cooperative. Task {} is unstructured; Task.detached also does not inherit actor isolation. Sendable describes safe transfer across concurrency boundaries, not deep immutability.",
      "Actor metodu suspend olanda başqa iş actor-a daxil olub state-i dəyişə bilər. Bu reentrancy-dir: köhnəlmiş qərar üçün data race lazım deyil. Structured child task-ların lifetime-ı məhduddur və cancellation ötürülür, amma əməkdaşlıq tələb edir. Task {} unstructured-dır; Task.detached actor izolyasiyasını da miras almır. Sendable təhlükəsiz ötürməni ifadə edir, dərin dəyişməzliyi deyil.",
    ),
    judgment: b(
      "Choose a latest-wins, ignore-duplicates, or serialized policy before implementing cancellation. After await, validate operation identity and cancellation before changing visible state. A shared token refresh must preserve waiter semantics: one cancelled caller should not necessarily cancel refresh needed by others. State which Swift language mode and isolation defaults your design assumes.",
      "Cancellation yazmazdan əvvəl latest-wins, təkrarları atlama və ya serial siyasətini seç. await-dən sonra görünən state-i dəyişməzdən əvvəl əməliyyat kimliyini və cancellation-u yoxla. Paylaşılan token refresh-də bir gözləyənin ləğvi başqalarının refresh-ini mütləq dayandırmamalıdır. Swift language mode və izolyasiya default-larını bildir.",
    ),
    code: "actor Balance {\n    private var value = 10\n    func add(_ delta: Int) { value += delta }\n    func read() -> Int { value }\n}\nlet balance = Balance()\nawait balance.add(5)\nprint(await balance.read())",
    predicted: "15",
    trap: b(
      "@MainActor does not enforce latest-request-wins. Neither [weak self] nor Task.cancel() proves that obsolete results cannot mutate state. Revalidate the invariant after each suspension.",
      "@MainActor latest-request-wins qaydası yaratmır. Nə [weak self], nə də Task.cancel() köhnə nəticənin state-i dəyişməyəcəyini sübut edir. Hər suspension-dan sonra invariantı yenidən yoxla.",
    ),
    exercise: b(
      "Start A, start B, complete B, then A. Add a generation number so A cannot overwrite B. Then explain why a workflow ID shared by both requests is insufficient.",
      "A-nı, sonra B-ni başlat; əvvəl B, sonra A bitsin. A-nın B-ni əvəz etməməsi üçün generation nömrəsi əlavə et. Hər ikisinin paylaşdığı workflow ID niyə kifayət deyil?",
    ),
    solution: b(
      "Increment generation before starting each operation. Capture it locally, await the service, then guard captured == current and !Task.isCancelled. Keep mutation on the appropriate actor.",
      "Hər əməliyyatdan əvvəl generation artır. Lokal saxla, servisi await et, sonra captured == current və !Task.isCancelled yoxla. Mutasiyanı uyğun actor-da et.",
    ),
    question: b(
      "Can an actor still produce stale results after await?",
      "Actor await-dən sonra köhnəlmiş nəticə yarada bilərmi?",
    ),
    choices: [
      b(
        "No, actors prevent all race conditions",
        "Xeyr, actor bütün race-ləri həll edir",
      ),
      b(
        "Yes, state can change during suspension",
        "Bəli, suspension zamanı state dəyişə bilər",
      ),
      b("Only with detached tasks", "Yalnız detached task-la"),
    ],
    correct: 1,
    followup: b(
      "Who owns a Task created inside a SwiftUI .task action, and who cancels it?",
      "SwiftUI .task action daxilində yaranan ayrıca Task-ın sahibi kimdir və onu kim ləğv edir?",
    ),
    source: swift + "concurrency/",
    sourceLabel: "Swift · Concurrency",
  },
  {
    id: "topic-17",
    minutes: 35,
    prerequisites: ["topic-07", "topic-12"],
    intro: b(
      "MVVM separates rendering from presentation decisions. The View displays state and sends intent; the ViewModel coordinates work and produces state; models represent data. The name does not prescribe a mandatory repository or use-case layer.",
      "MVVM görüntüləməni təqdimat qərarlarından ayırır. View state-i göstərir və niyyəti göndərir; ViewModel işi koordinasiya edib state yaradır; model məlumatı ifadə edir. Bu ad məcburi repository və use-case qatı tələb etmir.",
    ),
    mechanism: b(
      "Inject a service and a router instead of constructing them inside the ViewModel. Represent loading, loaded and failed outcomes explicitly. Isolate UI-owned state, cancel or invalidate obsolete requests, and test observable transitions. Bindings connect state to rendering but do not automatically enforce mutation ownership.",
      "Servis və router-i ViewModel daxilində yaratmaq əvəzinə xaricdən ötür. loading, loaded və failed hallarını açıq modelləşdir. UI state-ini izolyasiya et, köhnə sorğunu ləğv və ya etibarsız et, görünən keçidləri test et. Binding state-i görüntüyə bağlayır, amma mutasiya ownership-ini avtomatik məcbur etmir.",
    ),
    judgment: b(
      "Extract reusable business policy when it has independent reasons to change. A direct service call can be appropriate for simple orchestration; a ViewModel coordinating signing, document retrieval and several screens may need smaller workflow objects. Preserve behavior with characterization tests before migrating UIKit to SwiftUI.",
      "Müstəqil dəyişmə səbəbi olan biznes qaydasını ayır. Sadə koordinasiya üçün birbaşa servis çağırışı uyğun ola bilər; imzalama, sənəd və bir neçə ekranı idarə edən ViewModel kiçik workflow obyektləri tələb edə bilər. UIKit-dən SwiftUI-a keçməzdən əvvəl mövcud davranışı testlə sabitlə.",
    ),
    code: 'enum ScreenState {\n    case idle, loading, loaded([String]), failed(String)\n}\n@MainActor\nfinal class HistoryModel {\n    private(set) var state: ScreenState = .idle\n    func show(_ rows: [String]) { state = .loaded(rows) }\n}\nlet model = await HistoryModel()\nawait model.show(["Transfer"])\nprint("State updated")',
    predicted: "State updated",
    trap: b(
      "Moving controller code into one giant ViewModel preserves the original responsibility problem. Separate by reasons to change and test seams, not by line count.",
      "Controller kodunu bir nəhəng ViewModel-ə köçürmək məsuliyyət problemini saxlayır. Sətir sayına görə deyil, dəyişmə səbəbinə və test sərhədinə görə ayır.",
    ),
    exercise: b(
      "List the dependencies and state transitions of a paginated banking history screen. Which logic can be tested without rendering a View?",
      "Səhifələnən bank tarixçəsinin asılılıqlarını və state keçidlərini yaz. Hansı məntiq View render etmədən test olunur?",
    ),
    solution: b(
      "Inject a history-loading capability and route sink. Test idle → loading → loaded/error, next-page merging, retry and stale-response rejection. UI layout remains a separate concern.",
      "Tarixçə yükləyən bacarığı və route qəbul edən sərhədi ötür. idle → loading → loaded/error, növbəti səhifə, retry və köhnə cavabın atılmasını test et. UI layout ayrıca məsələdir.",
    ),
    question: b(
      "Does MVVM require one use case for every endpoint?",
      "MVVM hər endpoint üçün use case tələb edirmi?",
    ),
    choices: [
      b("Yes, always", "Bəli, həmişə"),
      b(
        "No; introduce policy boundaries when justified",
        "Xeyr; əsaslandırılmış qayda sərhədi olduqda əlavə et",
      ),
      b("Only if using SwiftUI", "Yalnız SwiftUI-da"),
    ],
    correct: 1,
    followup: b(
      "What concrete new requirement would justify extracting a use case?",
      "Hansı konkret tələb use case ayırmağı əsaslandırar?",
    ),
    source: apple + "swiftui/managing-model-data-in-your-app",
    sourceLabel: "Apple · Managing model data",
  },
  {
    id: "topic-20",
    minutes: 40,
    prerequisites: ["topic-17", "topic-21"],
    intro: b(
      "Clean Architecture protects business policy from UI frameworks and data-access details. The dependency rule is about source-code dependencies pointing toward stable policy, not about forcing every request through many objects.",
      "Clean Architecture biznes qaydasını UI framework və data-access detallarından qoruyur. Dependency rule kod asılılıqlarının sabit qaydaya yönəlməsidir; hər sorğunu çox sayda obyektdən keçirmək deyil.",
    ),
    mechanism: b(
      "A domain-owned repository protocol speaks in domain concepts. A data adapter maps DTOs to entities and translates infrastructure failures. Presentation calls a use case when it owns validation, sequencing or reusable policy. A protocol returning URLSession-specific types still couples its consumers to transport.",
      "Domenin sahib olduğu repository protokolu domen anlayışları ilə danışır. Data adapter DTO-nu entity-yə çevirir və infrastruktur xətasını uyğunlaşdırır. Use case validasiya, ardıcıllıq və ya təkrar istifadə olunan qayda saxlayırsa presentation onu çağırır. URLSession tipini qaytaran protokol transport asılılığını saxlayır.",
    ),
    judgment: b(
      "A boundary earns its maintenance cost by isolating actual variation. A tiny server-backed settings screen may need fewer layers; a money-transfer policy needs explicit authorization, idempotency, recoverability and audit boundaries. Architecture is evaluated by change isolation and testability, not folder names.",
      "Sərhəd real dəyişkənliyi ayırmaqla dəstəklənmə xərcini doğruldur. Sadə settings ekranı az qat tələb edə bilər; pul köçürməsi avtorizasiya, idempotency, bərpa və audit sərhədləri istəyir. Arxitekturanı qovluq adları ilə deyil, dəyişmə izolyasiyası və testability ilə qiymətləndir.",
    ),
    code: 'struct AccountID { let rawValue: String }\nstruct AccountBalance { let minorUnits: Int }\nprotocol BalanceRepository {\n    func balance(for id: AccountID) async throws -> AccountBalance\n}\nstruct ReadBalance {\n    let repository: any BalanceRepository\n    func callAsFunction(_ id: AccountID) async throws -> AccountBalance {\n        try await repository.balance(for: id)\n    }\n}\nprint("Domain contract defined")',
    predicted: "Domain contract defined",
    trap: b(
      "This sample use case is only a forwarding wrapper. It illustrates the boundary, not proof that the extra type is valuable in every screen. Add it when policy or reuse justifies it.",
      "Bu nümunə use case yalnız ötürücü wrapper-dir. Sərhədi göstərir, amma hər ekran üçün əlavə tipin faydasını sübut etmir. Qayda və ya reuse əsaslandıranda əlavə et.",
    ),
    exercise: b(
      "Add a transfer limit rule without importing UIKit or URLSession into the domain. Identify server-authoritative validation that the client cannot replace.",
      "Domenə UIKit və URLSession gətirmədən köçürmə limiti qaydası əlavə et. Klientin əvəz edə bilmədiyi server yoxlamasını müəyyən et.",
    ),
    solution: b(
      "Use domain amounts and account IDs; return domain outcomes. The server must still authorize and enforce current balance/limits atomically. Client validation improves UX but cannot establish authorization.",
      "Domen məbləği və hesab ID-si istifadə et; domen nəticələri qaytar. Server yenə avtorizasiya etməli, balans və limiti atomik yoxlamalıdır. Klient validasiyası UX verir, avtorizasiya zəmanəti deyil.",
    ),
    question: b(
      "Which dependency should a domain model generally avoid?",
      "Domen modeli ümumiyyətlə hansı asılılıqdan uzaq olmalıdır?",
    ),
    choices: [
      b("A domain identifier", "Domen identifikatoru"),
      b("A domain error", "Domen xətası"),
      b("A UIKit view controller", "UIKit view controller-i"),
    ],
    correct: 2,
    followup: b(
      "When is direct service injection a cheaper valid design?",
      "Birbaşa servis injection nə vaxt daha sadə və düzgün seçimdir?",
    ),
    source: "https://www.swift.org/documentation/api-design-guidelines/",
    sourceLabel: "Swift · API Design Guidelines (boundary vocabulary)",
  },
  {
    id: "topic-21",
    minutes: 30,
    prerequisites: ["topic-07"],
    intro: b(
      "Dependency injection means giving an object the collaborators it needs. A history screen receives a history service instead of finding one globally. The object is easier to construct and test because its requirements are visible.",
      "Dependency injection obyektə lazım olan əməkdaşları verməkdir. Tarixçə ekranı servisi qlobal axtarmır, xaricdən alır. Tələblər göründüyü üçün obyekti qurmaq və test etmək asanlaşır.",
    ),
    mechanism: b(
      "Constructor injection establishes valid state at creation. A composition root chooses implementations and lifetimes. A container can assist construction; resolve() inside behavior is service location. Scope changes identity: an event dispatcher and observer must share the same channel instance. A let dependency is not automatically thread-safe.",
      "Constructor injection yaradılarkən düzgün state qurur. Composition root implementasiyanı və lifetime-ı seçir. Container qurulmağa kömək edir; davranış daxilində resolve() service location-dır. Scope kimliyi dəyişir: event dispatcher və observer eyni kanal obyektini paylaşmalıdır. let asılılıq avtomatik thread-safe deyil.",
    ),
    judgment: b(
      "Keep global resolution near composition boundaries. Test registrations separately from behavior tests. Constructor injection can use concrete types when substitution is unnecessary; a protocol is valuable when it defines an actual capability boundary. Avoid registration order becoming hidden business behavior.",
      "Qlobal resolution-u composition sərhədinə yaxın saxla. Qeydiyyat testlərini davranış testlərindən ayır. Əvəzlənmə lazım deyilsə konkret tip injection uyğundur; real bacarıq sərhədi varsa protokol faydalıdır. Qeydiyyat sırası gizli biznes davranışına çevrilməsin.",
    ),
    code: "protocol Clock { func now() -> Int }\nstruct FixedClock: Clock { func now() -> Int { 42 } }\nstruct Receipt {\n    let clock: any Clock\n    func timestamp() -> Int { clock.now() }\n}\nprint(Receipt(clock: FixedClock()).timestamp())",
    predicted: "42",
    trap: b(
      "Using a container does not prove dependency inversion. Inspect who owns the abstraction and whether consumer vocabulary leaks infrastructure details.",
      "Container istifadə etmək dependency inversion sübutu deyil. Abstraksiyanın sahibini və istehlakçıya sızan infrastruktur detallarını yoxla.",
    ),
    exercise: b(
      "Write a test for Receipt without changing global time or global registrations. Explain why a fixed clock is a stub.",
      "Qlobal saatı və qeydiyyatı dəyişmədən Receipt testini yaz. Fixed clock niyə stub-dır?",
    ),
    solution: b(
      "Inject FixedClock and assert the timestamp. It returns controlled data rather than verifying interaction history; a spy would record calls.",
      "FixedClock ötür və timestamp-i yoxla. O idarə olunan məlumat qaytarır, çağırış tarixçəsini yoxlamır; spy çağırışları qeyd edərdi.",
    ),
    question: b(
      "Where should global resolution usually be confined?",
      "Qlobal resolution əsasən harada olmalıdır?",
    ),
    choices: [
      b("Every computed property", "Hər computed property-də"),
      b("The composition boundary", "Composition sərhədində"),
      b("Inside every model", "Hər model daxilində"),
    ],
    correct: 1,
    followup: b(
      "How can transient event stores silently break communication?",
      "Transient event store-lar əlaqəni necə səssiz poza bilər?",
    ),
    source: "https://www.swift.org/documentation/api-design-guidelines/",
    sourceLabel: "Swift · API Design Guidelines",
  },
  {
    id: "topic-22",
    minutes: 35,
    prerequisites: ["topic-20", "topic-21"],
    intro: b(
      "A module is a boundary controlling what other code can import and use. A feature interface exposes capabilities; the implementation owns internal screens, vendor adapters and details. More targets alone do not guarantee a better architecture.",
      "Modul başqa kodun nə import və istifadə edə biləcəyini idarə edən sərhəddir. Feature interfeysi bacarıqları açır; implementasiya daxili ekran, vendor adapter və detallara sahibdir. Daha çox target özlüyündə yaxşı arxitektura zəmanəti deyil.",
    ),
    mechanism: b(
      "The app composition root may know interface and implementation targets. Feature consumers should depend on small public contracts. Keep the dependency graph acyclic and place shared types with the boundary that owns their meaning. UI interfaces may legitimately mention UIKit; a domain boundary has different goals.",
      "App composition root interfeys və implementasiya target-larını tanıya bilər. Feature istehlakçıları kiçik public müqaviləyə bağlanmalıdır. Asılılıq qrafını dövrsüz saxla, paylaşılan tipi mənasının sahibinə yerləşdir. UI interfeysi UIKit-i haqlı olaraq tanıya bilər; domen sərhədinin məqsədi fərqlidir.",
    ),
    judgment: b(
      "Measure clean and incremental build costs; do not promise faster builds from a target split alone. Watch dependency fan-out, public API churn and ownership conflicts. Migrate a narrow capability from giant shared modules, then remove old consumers incrementally.",
      "Clean və incremental build vaxtını ölç; target bölünməsi ilə avtomatik sürət vəd etmə. Dependency fan-out, public API dəyişməsi və ownership konfliktlərini izlə. Böyük shared moduldan dar bacarığı ayır, köhnə istehlakçıları mərhələli köçür.",
    ),
    code: 'public struct TransferInput {\n    public let accountID: String\n    public init(accountID: String) { self.accountID = accountID }\n}\npublic protocol TransferCapability {\n    func open(_ input: TransferInput)\n}\nprint("Feature interface")',
    predicted: "Feature interface",
    trap: b(
      "Importing another feature implementation exposes internal types and can turn the graph into a cycle. A target pair is useful only when consumers respect its API boundary.",
      "Başqa feature implementasiyasını import etmək daxili tipləri açır və qrafda dövr yarada bilər. Target cütü istehlakçılar API sərhədini qoruyanda faydalıdır.",
    ),
    exercise: b(
      "Draw App → FeatureInterface and App → FeatureImplementation, with Implementation → Interface. Where should a vendor SDK dependency live?",
      "App → FeatureInterface və App → FeatureImplementation, sonra Implementation → Interface çək. Vendor SDK asılılığı harada olmalıdır?",
    ),
    solution: b(
      "Keep vendor SDK imports in the implementation/adapter target. Translate vendor results into app-owned types before crossing the interface.",
      "Vendor SDK import-larını implementasiya/adapter target-də saxla. İnterfeysdən əvvəl vendor nəticəsini tətbiqin sahib olduğu tipə çevir.",
    ),
    question: b(
      "What should consumers usually import?",
      "İstehlakçı adətən nə import etməlidir?",
    ),
    choices: [
      b("Every implementation detail", "Bütün implementasiya detalları"),
      b("The feature interface capability", "Feature interfeysinin bacarığı"),
      b("The vendor SDK globally", "Vendor SDK-nı qlobal"),
    ],
    correct: 1,
    followup: b(
      "How do you find a stable module boundary when two teams change the same types?",
      "İki komanda eyni tipləri dəyişirsə sabit modul sərhədini necə taparsan?",
    ),
    source:
      "https://docs.swift.org/package-manager/PackageDescription/PackageDescription.html",
    sourceLabel: "Swift Package Manager · PackageDescription",
  },
  {
    id: "topic-25",
    minutes: 40,
    prerequisites: ["topic-12", "topic-24"],
    intro: b(
      "URLSession performs network transfers; URLRequest describes one request. A successful HTTP transfer can still carry an application error. Networking requires explicit response validation, cancellation and decoding, not just JSON parsing.",
      "URLSession şəbəkə ötürməsini edir; URLRequest bir sorğunu təsvir edir. Uğurlu HTTP ötürməsi tətbiq xətası daşıya bilər. Şəbəkə işi tək JSON parse deyil: cavab yoxlaması, cancellation və decoding tələb edir.",
    ),
    mechanism: b(
      "Validate HTTP status before decoding the expected payload. Distinguish transport, protocol, decoding and business failures. URLSession async APIs participate in task cancellation, but custom callback bridges must own the underlying cancellable and resume continuations exactly once. Timeout and retry policies belong to the logical operation.",
      "Gözlənilən payload-u decode etməzdən əvvəl HTTP status-u yoxla. Transport, protokol, decoding və biznes xətalarını ayır. URLSession async API-ləri task cancellation-da iştirak edir; callback bridge əsas cancellable-a sahib olmalı və continuation-u dəqiq bir dəfə resume etməlidir. Timeout və retry məntiqi əməliyyata aiddir.",
    ),
    judgment: b(
      "A client timeout does not prove a server mutation failed. For transfers, coordinate idempotency keys and reconciliation with the backend. Measure latency and failure category using sanitized telemetry, never tokens or customer payloads. Retry only when semantics make repetition safe.",
      "Klient timeout-u server mutasiyasının uğursuzluğunu sübut etmir. Köçürmələrdə idempotency key və reconciliation-u backend-lə razılaşdır. Token və müştəri payload-u olmadan sanitizasiya edilmiş telemetriya ilə gecikmə və xəta növünü ölç. Yalnız təkrar semantik olaraq təhlükəsizdirsə retry et.",
    ),
    code: 'import Foundation\nlet request = URLRequest(url: URL(string: "https://example.com")!)\nprint(request.httpMethod ?? "GET")\n// Real transfers require explicit opt-in in an app.\n// let (data, response) = try await URLSession.shared.data(for: request)\n// Validate response before decoding data.',
    predicted: "GET",
    trap: b(
      "Never blindly retry a POST after timeout. The server may already have committed it. Cancellation is not rollback.",
      "Timeout-dan sonra POST-u kor-koranə retry etmə. Server onu artıq icra etmiş ola bilər. Cancellation rollback deyil.",
    ),
    exercise: b(
      "Design separate errors for no connectivity, HTTP 401, schema mismatch and transfer rejection. Which are safe to retry automatically?",
      "Şəbəkə yoxluğu, HTTP 401, schema uyğunsuzluğu və köçürmə rəddi üçün ayrı xəta qur. Hansını avtomatik retry etmək olar?",
    ),
    solution: b(
      "Use transport, unauthorized, decoding and domain-rejected categories. Safe retry depends on request idempotency and backend contract. One coordinated refresh may recover 401; do not loop indefinitely.",
      "Transport, unauthorized, decoding və domain-rejected kateqoriyaları qur. Retry sorğu idempotency-si və backend müqaviləsindən asılıdır. Bir koordinasiyalı refresh 401-i düzəldə bilər; sonsuz loop etmə.",
    ),
    question: b(
      "Does cancelling a transfer request prove the server rolled it back?",
      "Köçürmə sorğusunun ləğvi serverin rollback etdiyini sübut edirmi?",
    ),
    choices: [
      b("Yes", "Bəli"),
      b(
        "No; reconcile using the backend contract",
        "Xeyr; backend müqaviləsi ilə nəticəni uzlaşdır",
      ),
      b("Only on Wi-Fi", "Yalnız Wi-Fi-da"),
    ],
    correct: 1,
    followup: b(
      "Who owns cancellation after refresh starts a replacement transport task?",
      "Refresh əvəz transport task başladanda cancellation-a kim sahibdir?",
    ),
    source: apple + "foundation/urlsession",
    sourceLabel: "Apple · URLSession",
  },
  {
    id: "topic-34",
    minutes: 40,
    prerequisites: ["topic-17"],
    intro: b(
      "SwiftUI renders a description of UI from state. State needs a clear owner: @State stores local owned state, @Binding refers to state owned elsewhere. A view value is recreated frequently; its identity determines continuity of stored state.",
      "SwiftUI state-dən UI təsviri yaradır. State-in aydın sahibi olmalıdır: @State lokal state saxlayır, @Binding başqa yerdə sahib olunan state-ə çıxış verir. View dəyəri tez-tez yenidən yaranır; saxlanan state-in davamlılığını identity müəyyən edir.",
    ),
    mechanism: b(
      "With ObservableObject, @StateObject owns object storage for a view identity while @ObservedObject observes an externally owned object. With Observation on supported OS versions, @Observable models can be held with @State and expose bindings through @Bindable. Body evaluation does not mean all pixels redraw. Keep expensive synchronous work outside body.",
      "ObservableObject modelində @StateObject view identity üçün obyekt storage-ına sahibdir, @ObservedObject xaricdə sahib olunan obyekti izləyir. Dəstəklənən OS-lərdə Observation ilə @Observable model @State-də saxlanır, @Bindable binding verir. body hesablanması bütün piksellərin yenidən çəkilməsi deyil. Bahalı sinxron işi body-dən çıxar.",
    ),
    judgment: b(
      "Separate view identity, model lifetime and task lifetime. Using unstable list IDs may reset state and trigger unnecessary work. Make deployment-target and framework-generation assumptions explicit before migrating property wrappers. Narrow observations based on profiling rather than speculation.",
      "View identity, model lifetime və task lifetime-ı ayır. Sabit olmayan list ID-ləri state-i sıfırlayıb artıq iş yarada bilər. Property wrapper miqrasiyasından əvvəl deployment target və framework nəsli fərziyyələrini bildir. Observation-u fərziyyə deyil, profil əsasında daralt.",
    ),
    code: '// SwiftUI example; requires an Apple SDK.\nimport SwiftUI\nstruct BalanceCard: View {\n    @State private var isVisible = false\n    var body: some View {\n        Button(isVisible ? "42 AZN" : "••••") {\n            isVisible.toggle()\n        }\n    }\n}',
    predicted: "UI example — no console output; Apple SDK required.",
    trap: b(
      "Creating an externally observed model in every body evaluation can lose the intended lifetime. Do not use random UUIDs as stable identity for existing rows.",
      "Hər body hesablanmasında observed model yaratmaq lifetime-ı poza bilər. Mövcud sətirlər üçün təsadüfi UUID-ni sabit identity kimi işlətmə.",
    ),
    exercise: b(
      "A parent constructs a view with a shared model. Choose an ownership wrapper for legacy ObservableObject and explain what changes with @Observable.",
      "Parent paylaşılan model ilə view qurur. Köhnə ObservableObject üçün wrapper seç və @Observable ilə fərqi izah et.",
    ),
    solution: b(
      "Externally owned ObservableObject uses @ObservedObject. With Observation, a plain property can be tracked when accessed; use @Bindable if the view needs bindings. The owner may retain the model in @State.",
      "Xaricdə sahib olunan ObservableObject üçün @ObservedObject seç. Observation-da adi property oxunması izlənə bilər; binding lazımdırsa @Bindable istifadə et. Owner modeli @State-də saxlaya bilər.",
    ),
    question: b(
      "Which owns an ObservableObject across a view identity?",
      "View identity boyunca ObservableObject-a hansı sahibdir?",
    ),
    choices: [
      b("@StateObject", "@StateObject"),
      b("@ObservedObject always", "Həmişə @ObservedObject"),
      b("A random UUID", "Təsadüfi UUID"),
    ],
    correct: 0,
    followup: b(
      "Why can changing a view ID reset state even if the screen looks identical?",
      "Ekran eyni görünsə də view ID dəyişməsi niyə state-i sıfırlaya bilər?",
    ),
    source: apple + "swiftui/managing-model-data-in-your-app",
    sourceLabel: "Apple · Managing model data",
  },
  {
    id: "topic-38",
    minutes: 40,
    prerequisites: ["topic-12", "topic-25"],
    intro: b(
      "Authentication establishes identity; authorization decides permission. An access token is short-lived permission material; a refresh token can obtain new access. Many concurrent 401s should usually join one refresh rather than trigger many independent refreshes.",
      "Autentifikasiya kimliyi müəyyən edir; avtorizasiya icazəni həll edir. Access token qısaömürlü icazə məlumatıdır; refresh token yenisini ala bilir. Bir neçə paralel 401 adətən ayrı refresh deyil, bir paylaşılan refresh gözləməlidir.",
    ),
    mechanism: b(
      "Keep one in-flight refresh task under a serialized owner. New callers join it; completion publishes updated credentials and clears the task. Handle failure and logout explicitly. Never hold a thread-owned NSLock across await or unlock it in a callback on another thread. Do not recursively retry authorization forever.",
      "Bir serial owner daxilində tək in-flight refresh task saxla. Yeni çağıranlar ona qoşulur; bitəndə yeni credential paylaşılır və task təmizlənir. Xəta və logout-u açıq idarə et. Thread-owned NSLock-u await boyunca saxlama və başqa thread callback-ində unlock etmə. Avtorizasiyanı sonsuz təkrarlama.",
    ),
    judgment: b(
      "Define session-generation rules so refresh started before logout cannot resurrect the session. One waiter cancelling should not necessarily cancel a shared refresh. Store secrets with appropriate Keychain access controls, redact before logging, and coordinate rotation/revocation with the backend.",
      "Logout-dan əvvəl başlayan refresh sessiyanı yenidən diriltməsin deyə session generation qaydası qur. Bir gözləyənin cancellation-u paylaşılan refresh-i mütləq dayandırmamalıdır. Sirləri uyğun Keychain access control ilə saxla, log-dan əvvəl sil və rotation/revocation-u backend-lə razılaşdır.",
    ),
    code: 'enum AuthState {\n    case signedOut\n    case authenticated(sessionID: String)\n    case refreshing(sessionID: String)\n}\nlet state = AuthState.signedOut\nif case .signedOut = state { print("Login required") }',
    predicted: "Login required",
    trap: b(
      "A mutex is not an asynchronous semaphore. Releasing NSLock on a different thread violates its ownership rule; replacing it blindly does not define refresh-sharing semantics.",
      "Mutex async semaphore deyil. NSLock-u başqa thread-də açmaq ownership qaydasını pozur; onu kor-koranə əvəz etmək refresh paylaşma semantikasını müəyyən etmir.",
    ),
    exercise: b(
      "Ten requests get 401 while logout happens. Specify the number of refreshes, which callers complete, and whether old credentials may be published.",
      "Logout zamanı on sorğu 401 alır. Refresh sayını, hansı çağıranların bitəcəyini və köhnə credential-ın paylaşılıb-paylaşılmayacağını müəyyən et.",
    ),
    solution: b(
      "At most one refresh per session generation. Logout invalidates that generation; old completion must not publish a session. Waiting requests fail with a session-ended outcome, without exposing tokens.",
      "Hər session generation üçün ən çox bir refresh. Logout generation-u etibarsız edir; köhnə completion sessiya yaratmamalıdır. Gözləyənlər token göstərmədən session-ended nəticəsi alır.",
    ),
    question: b(
      "Ten simultaneous 401 responses usually need how many coordinated refreshes per session?",
      "On paralel 401 üçün sessiya başına adətən neçə koordinasiyalı refresh lazımdır?",
    ),
    choices: [
      b("Ten", "On"),
      b("One shared operation", "Bir paylaşılan əməliyyat"),
      b("Unlimited retries", "Məhdudiyyətsiz retry"),
    ],
    correct: 1,
    followup: b(
      "What happens when refresh succeeds after logout?",
      "Refresh logout-dan sonra uğurlu bitsə nə olur?",
    ),
    source: apple + "security/keychain-services",
    sourceLabel: "Apple · Keychain Services",
  },
  {
    id: "topic-40",
    minutes: 35,
    prerequisites: ["topic-21", "topic-12"],
    intro: b(
      "A useful test proves externally observable behavior and fails when that behavior breaks. A stub returns controlled data; a spy records interactions; a fake provides a working simplified implementation. Tests do not need a real backend to exercise state logic.",
      "Faydalı test xaricdən görünən davranışı sübut edir və davranış pozulanda uğursuz olur. Stub idarə olunan məlumat qaytarır; spy çağırışları qeyd edir; fake sadələşmiş işlək implementasiyadır. State məntiqi üçün həqiqi backend lazım deyil.",
    ),
    mechanism: b(
      "Control asynchronous completion order rather than sleeping. Start A, start B, complete B then A and assert current state. Test cancellation, empty success, partial failure and retry cleanup. Keep registration tests separate from injected ViewModel tests. Snapshot tests cover rendering, not authentication semantics.",
      "Async tamamlanma sırasını sleep ilə deyil, idarə edərək qur. A, sonra B başlasın; B, sonra A bitsin və cari state-i yoxla. Cancellation, boş uğur, qismən xəta və retry təmizlənməsini test et. Qeydiyyat testlərini injection olunan ViewModel testlərindən ayır. Snapshot rendering-i yoxlayır, autentifikasiya semantikasını deyil.",
    ),
    judgment: b(
      "Distinguish source presence from active execution. A disabled snapshot suite supplies no executed regression protection. Track skipped tests explicitly, avoid blindly regenerating baselines, and use a small end-to-end suite for integration boundaries that unit doubles cannot establish.",
      "Test faylının varlığını icradan ayır. Disabled snapshot suite icra olunmuş qoruma vermir. Skipped testləri ayrıca izlə, baseline-ları kor-koranə yeniləmə və unit double-ların sübut edə bilmədiyi sərhədlər üçün kiçik end-to-end suite saxla.",
    ),
    code: 'import Foundation\nfunc merged(_ old: [Int], _ new: [Int]) -> [Int] {\n    var seen = Set(old)\n    return old + new.filter { seen.insert($0).inserted }\n}\nassert(merged([1, 2], [2, 3]) == [1, 2, 3])\nprint("Deduplication assertion passed")',
    predicted: "Deduplication assertion passed",
    trap: b(
      "A passing test with no assertions or no executed cases does not validate the workflow. A fixed sleep can hide nondeterministic ordering.",
      "Assertion olmayan və ya sıfır case işlədən test workflow-u yoxlamır. Sabit sleep qeyri-deterministik sıranı gizlədə bilər.",
    ),
    exercise: b(
      "Design a delete guard test: hold completion pending, tap twice, complete with failure, then tap again. What must the spy record?",
      "Delete guard testi qur: completion-u saxla, iki dəfə bas, xəta ilə bitir, yenidən bas. Spy nə qeyd etməlidir?",
    ),
    solution: b(
      "One invocation while pending; after failure cleanup a new invocation is accepted. Assert visible behavior, not a private Boolean.",
      "Gözləyərkən bir çağırış; xəta təmizlənəndən sonra yeni çağırış qəbul olunur. Private Boolean-u deyil, görünən davranışı yoxla.",
    ),
    question: b(
      "How should you test response ordering?",
      "Cavab sırasını necə test etməlisən?",
    ),
    choices: [
      b("Sleep until it seems stable", "Sabit görünənə qədər sleep et"),
      b(
        "Control service completions explicitly",
        "Servis completion-larını açıq idarə et",
      ),
      b("Only inspect screenshots", "Yalnız screenshot-a bax"),
    ],
    correct: 1,
    followup: b(
      "Which integration behavior remains unproven when every dependency is stubbed?",
      "Bütün asılılıqlar stub olanda hansı inteqrasiya davranışı sübut olunmur?",
    ),
    source: apple + "testing",
    sourceLabel: "Apple · Swift Testing",
  },
  {
    id: "topic-50",
    minutes: 45,
    prerequisites: ["topic-20", "topic-27", "topic-38"],
    intro: b(
      "System design starts with constraints: who uses the feature, what must be correct, and what can fail. A banking history screen has different risks from a money transfer. Draw responsibilities and contracts before choosing fashionable patterns.",
      "Sistem dizaynı məhdudiyyətlə başlayır: kim istifadə edir, nə düzgün olmalıdır və nə sıradan çıxa bilər. Bank tarixçəsi ilə pul köçürməsinin riskləri fərqlidir. Dəbli pattern seçməzdən əvvəl məsuliyyət və müqavilələri çək.",
    ),
    mechanism: b(
      "Define API contracts, identity, state transitions, source of truth, caching and cancellation. Then assign UI state to presentation, business decisions to policy, and transport/storage to adapters. Specify concurrent refresh, pagination consistency, retry idempotency and observable failure states.",
      "API müqaviləsi, identity, state keçidi, source of truth, caching və cancellation-u müəyyən et. Sonra UI state-i presentation-a, biznes qərarını policy-yə, transport/storage-u adapter-ə ver. Paralel refresh, pagination ardıcıllığı, retry idempotency-si və görünən xəta hallarını yaz.",
    ),
    judgment: b(
      "Evaluate the design under failure: app termination mid-transfer, logout during refresh, stale cached balances and duplicate callbacks. Define incremental rollout and rollback boundaries. More layers can improve isolation but also increase delivery and migration cost; present alternative valid designs and the requirement that changes the choice.",
      "Dizaynı xəta altında yoxla: köçürmə zamanı tətbiqin bitməsi, refresh zamanı logout, köhnə cache balansı və təkrar callback. Mərhələli rollout və rollback sərhədi qur. Çox qat izolyasiya verə bilər, amma çatdırılma və miqrasiya xərcini artırır; alternativləri və seçimi dəyişən tələbi göstər.",
    ),
    code: 'enum TransferState {\n    case draft\n    case submitting(operationID: String)\n    case confirmed(receiptID: String)\n    case unknown(operationID: String)\n    case rejected(reason: String)\n}\nlet state = TransferState.unknown(operationID: "op-1")\nif case .unknown = state { print("Reconcile with server") }',
    predicted: "Reconcile with server",
    trap: b(
      "Treating a timeout as a rejected transfer can cause duplicate submission. Unknown outcome deserves reconciliation, not a misleading success or failure label.",
      "Timeout-u rədd edilmiş köçürmə saymaq təkrar göndəriş yarada bilər. Naməlum nəticə yalnış uğur/xəta etiketi deyil, reconciliation tələb edir.",
    ),
    exercise: b(
      "Design a secure money transfer with an idempotency key. Show where the operation ID survives an app restart.",
      "Idempotency key ilə təhlükəsiz köçürmə dizayn et. Əməliyyat ID-sinin restart-dan sonra harada qaldığını göstər.",
    ),
    solution: b(
      "Persist non-secret operation identity with a pending outcome, submit with backend-supported idempotency, and reconcile status on relaunch. Never persist credentials in plain preferences.",
      "Qeyri-məxfi əməliyyat kimliyini pending nəticə ilə saxla, backend idempotency müqaviləsi ilə göndər və restart-da status-u uzlaşdır. Credential-ı açıq preference-də saxlama.",
    ),
    question: b(
      "A transfer times out after submission. What is its outcome?",
      "Köçürmə göndərildikdən sonra timeout olur. Nəticə nədir?",
    ),
    choices: [
      b("Definitely rejected", "Mütləq rədd edildi"),
      b("Definitely successful", "Mütləq uğurludur"),
      b("Unknown until reconciled", "Uzlaşdırılana qədər naməlumdur"),
    ],
    correct: 2,
    followup: b(
      "What changes if the backend cannot support idempotency?",
      "Backend idempotency dəstəkləmirsə nə dəyişir?",
    ),
    source: apple + "foundation/urlsession",
    sourceLabel: "Apple · URLSession (transport behavior)",
  },
];
lessons.push(...guides);
export const lessonById = Object.fromEntries(
  lessons.map((l) => [l.id, l]),
) as Record<string, Lesson>;
