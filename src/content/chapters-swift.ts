import { bi as b } from "@/lib/types";
import type { Chapter } from "./chapter-types";
export const swiftChapters: Chapter[] = [
  {
    topicId: "topic-02",
    prerequisiteNote: b(
      "You only need variables, functions and basic struct/class syntax. If copying and sharing sound identical, begin with the two-box example below; you do not need to know heap allocation first.",
      "Yalnız dəyişən, funksiya və ilkin struct/class sintaksisi lazımdır. Kopyalama və paylaşma eyni görünürsə aşağıdakı iki qutu nümunəsindən başla; əvvəlcə heap allocation bilməyə ehtiyac yoxdur.",
    ),
    objectives: [
      b(
        "Predict which mutations can be seen through another variable.",
        "Hansı mutasiyanın başqa dəyişəndən görünəcəyini proqnozlaşdır.",
      ),
      b(
        "Explain COW without claiming all structs live on the stack.",
        "Bütün struct-ların stack-də olduğunu demədən COW-u izah et.",
      ),
      b(
        "Choose snapshots and shared services deliberately in a banking feature.",
        "Bank feature-ində snapshot və paylaşılan servisi məqsədli seç.",
      ),
    ],
    sections: [
      {
        id: "copy-or-share",
        title: b(
          "Start from zero: copying a fact versus sharing an object",
          "Sıfırdan başla: faktı kopyalamaq və obyekti paylaşmaq",
        ),
        level: "junior",
        paragraphs: [
          b(
            "Imagine writing your current balance on two separate pieces of paper. Changing the second paper does not change the first. That is the useful promise behind value semantics: after copying a value, changing one copy does not change the other logical value. The promise concerns observable behavior, not the exact machine instruction used to copy it.",
            "Cari balansını iki ayrı kağıza yazdığını düşün. İkinci kağızı dəyişmək birincini dəyişmir. Dəyər semantikasının faydalı vədi budur: dəyər kopyalandıqdan sonra bir kopyanın dəyişməsi digər məntiqi dəyəri dəyişmir. Vəd konkret maşın təlimatına deyil, müşahidə olunan davranışa aiddir.",
          ),
          b(
            "Now give two people a link to one live account. Both links reach the same account, so a balance change is visible through either link. A class assignment copies such a reference; it does not clone the instance. The two variables are different bindings, but they can point at the same identity. This is why “I copied the variable” does not answer whether I copied the underlying data.",
            "İndi iki nəfərə eyni canlı hesaba keçid ver. Hər iki keçid eyni hesaba çatdığı üçün balans dəyişikliyi hər ikisində görünür. Class mənimsətməsi belə istinadı kopyalayır; obyekti clone etmir. Dəyişənlər ayrı binding-dir, amma eyni identity-yə çata bilər. Buna görə “dəyişəni kopyaladım” daxili məlumatın kopyalandığını izah etmir.",
          ),
        ],
        analogy: b(
          "A printed statement is a snapshot. A second banking-app login is another window onto shared account state. Ask which model your type is intended to represent.",
          "Çap olunmuş çıxarış snapshot-dır. Bank tətbiqinə ikinci giriş paylaşılan hesaba başqa pəncərədir. Tipinin hansını modelləşdirdiyini soruş.",
        ),
      },
      {
        id: "binding-versus-object",
        title: b(
          "Why let does not mean “everything is immutable”",
          "Niyə let “hər şey dəyişməzdir” demək deyil",
        ),
        level: "junior",
        paragraphs: [
          b(
            "For a struct stored in a let binding, you cannot replace its stored properties through that binding. For a class stored in a let binding, you cannot point the binding at a different instance, but the instance may still expose mutable properties. Separate the arrow from the object at the end of the arrow. let fixes the arrow; it does not rewrite the class definition.",
            "let binding-dəki struct-ın stored property-sini həmin binding vasitəsilə dəyişə bilməzsən. let binding-dəki class üçün binding-i başqa obyektə yönəldə bilməzsən, amma obyekt mutable property aça bilər. Oxu onun sonundakı obyektdən ayır. let oxu sabit saxlayır; class tərifini yenidən yazmır.",
          ),
          b(
            "The subtle case is a struct that contains a class. Copying the struct copies its fields, including the reference field. The outer struct is a value type, yet both copies can still reach one mutable object. If the type is advertised as an independent financial snapshot, this shared mutable interior can violate the API’s intended value semantics.",
            "İncə hal daxilində class olan struct-dır. Struct kopyası bütün sahələri, o cümlədən istinad sahəsini kopyalayır. Xarici struct dəyər tipidir, amma hər iki kopya eyni mutable obyektə çata bilər. Tip müstəqil maliyyə snapshot-ı kimi təqdim edilirsə bu paylaşılan mutable daxili quruluş API-nin nəzərdə tutulan dəyər semantikasını poza bilər.",
          ),
        ],
      },
      {
        id: "cow-mechanism",
        title: b(
          "Under the hood: COW separates logical value from storage",
          "Daxildə: COW məntiqi dəyəri storage-dan ayırır",
        ),
        level: "middle",
        paragraphs: [
          b(
            "An Array copy has independent value behavior even when its implementation initially shares a buffer. Before mutating shared storage, the collection can establish unique storage and copy elements when necessary. This defers allocation until a write needs separation. Do not describe assignment as “always a deep copy” or claim every mutation always allocates: uniqueness and capacity affect the path.",
            "Array kopyası implementasiyada əvvəlcə buffer paylaşsa da müstəqil dəyər davranışına malikdir. Paylaşılan storage mutasiyasından əvvəl kolleksiya unikal storage qurub lazım gəldikdə elementləri kopyalaya bilər. Beləliklə allocation yazma ayrılma tələb edənə qədər təxirə düşür. Mənimsətməni “həmişə deep copy” və hər mutasiyanı “mütləq allocation” kimi izah etmə: unikallıq və capacity yolu dəyişir.",
          ),
          b(
            "Copying the buffer of [Account] copies Account references. It does not recursively duplicate all reachable accounts. A custom deep-copy operation needs a domain definition: should both copies retain the same account identity, share a network service, copy a transaction list, or reset an observer? There is no universal recursive copying policy that is correct for every object graph.",
            "[Account] buffer-inin kopyası Account istinadlarını kopyalayır. Çatan bütün hesabları rekursiv təkrarlamır. Custom deep copy domen tərifi istəyir: kopyalar eyni hesab kimliyini saxlasın, network servisi paylaşsın, əməliyyat siyahısını kopyalasın, yoxsa observer-i sıfırlasın? Hər object graph üçün düzgün universal rekursiv kopyalama qaydası yoxdur.",
          ),
        ],
        analogy: b(
          "COW is like giving two readers the same read-only document until one edits it. Separate the documents before that edit. This analogy explains behavior; it is not a claim about exact Swift buffer counts.",
          "COW iki oxucuya biri redaktə edənə qədər eyni yalnız oxunan sənədi verməyə bənzəyir. Redaktədən əvvəl sənədləri ayır. Bənzətmə davranışı izah edir, Swift buffer sayını dəqiq ölçmür.",
        ),
      },
      {
        id: "production-snapshots",
        title: b(
          "Production: make financial snapshots honestly independent",
          "Praktikada: maliyyə snapshot-ını həqiqətən müstəqil et",
        ),
        level: "middle",
        paragraphs: [
          b(
            "A screen can keep AccountSnapshot(id, balance, currency) as immutable value data and receive updates from an explicitly owned service. The snapshot should not hide a mutable AccountSession that changes behind the screen’s back. This separation makes before/after state assertions meaningful and reduces accidental changes to old receipts, comparison screens and cached display models.",
            "Ekran AccountSnapshot(id, balance, currency) kimi immutable dəyər saxlaya və açıq owner-i olan servisdən update ala bilər. Snapshot ekranın xəbəri olmadan dəyişən mutable AccountSession gizlətməməlidir. Bu ayrılma əvvəl/sonra state testini mənalı edir, köhnə qəbz, müqayisə ekranı və cache display modelinin təsadüfi dəyişməsini azaldır.",
          ),
          b(
            "Independence does not provide synchronization by itself. If multiple tasks access one shared var containing an Array, writes to that binding still need isolation. COW is not a lock. For money, also choose appropriate amount/currency and rounding rules; replacing a class with a struct does not make an imprecise Double calculation financially correct.",
            "Müstəqillik özlüyündə sinxronizasiya vermir. Bir neçə task Array saxlayan eyni shared var-a müraciət edirsə binding-ə yazma yenə izolyasiya istəyir. COW lock deyil. Pul üçün məbləğ/valyuta və yuvarlaqlaşdırma qaydası da seç; class-ı struct etmək qeyri-dəqiq Double hesabını maliyyə baxımından düzgün etmir.",
          ),
        ],
      },
      {
        id: "value-judgment",
        title: b(
          "Senior judgment: measure the cost, protect the contract",
          "Senior qərarı: xərci ölç, müqaviləni qoru",
        ),
        level: "senior",
        paragraphs: [
          b(
            "Choose values for independently understandable data, and references when shared identity or lifecycle coordination is part of the requirement. Do not convert a large model graph into classes merely because you fear copies. First profile allocations, mutation frequency and collection sizes under representative workloads. A shared immutable buffer may be cheaper than a hand-built synchronization strategy around reference objects.",
            "Müstəqil anlaşılan data üçün dəyər, shared identity və lifecycle koordinasiyası tələb olunanda istinad seç. Kopyadan qorxduğun üçün böyük model qrafını class etmə. Əvvəl real workload-da allocation, mutasiya tezliyi və kolleksiya ölçüsünü ölç. Paylaşılan immutable buffer reference obyektlər ətrafında əl ilə qurulan sinxronizasiyadan ucuz ola bilər.",
          ),
          b(
            "Allocation location is an implementation concern influenced by optimization and escape behavior. The interview-quality claim is “these operations preserve this observable value relationship,” not “struct means stack and class means heap.” State the language guarantee, then discuss the implementation model and the measurement that would confirm a performance hypothesis.",
            "Allocation yeri optimallaşdırma və escape davranışından asılı implementasiya məsələsidir. Güclü müsahibə iddiası “bu əməliyyatlar bu müşahidə olunan dəyər əlaqəsini qoruyur” şəklindədir; “struct stack, class heap” deyil. Əvvəl dil zəmanətini, sonra implementasiya modelini və performans fərziyyəsini yoxlayan ölçünü de.",
          ),
        ],
      },
    ],
    examples: [
      {
        id: "two-values",
        title: b(
          "Worked example 1: separate logical arrays",
          "İşlənmiş nümunə 1: ayrı məntiqi array-lar",
        ),
        setup: b(
          "Predict both arrays before looking at the trace. The program’s observable output does not require inspecting a memory address.",
          "İzaha baxmadan hər iki array-ı proqnozlaşdır. Müşahidə olunan çıxış üçün yaddaş ünvanını yoxlamağa ehtiyac yoxdur.",
        ),
        code: "var original = [10, 20]\nvar edited = original\nedited.append(30)\nprint(original)\nprint(edited)",
        output: b("[10, 20]\n[10, 20, 30]", "[10, 20]\n[10, 20, 30]"),
        steps: [
          b(
            "original receives a two-element Array value.",
            "original iki elementli Array dəyəri alır.",
          ),
          b(
            "edited receives a copy with independent logical value behavior; storage may initially be shared.",
            "edited müstəqil məntiqi davranışlı kopya alır; storage əvvəl paylaşıla bilər.",
          ),
          b(
            "append changes edited. Array preserves original’s value, separating storage if required.",
            "append edited-i dəyişir. Array lazım olduqda storage ayıraraq original dəyərini qoruyur.",
          ),
          b(
            "The two prints expose value behavior, not a measurement of how many allocations happened.",
            "İki print dəyər davranışını göstərir, allocation sayını ölçmür.",
          ),
        ],
        takeaway: b(
          "Explain the guaranteed result first. COW explains a possible efficient implementation of that result.",
          "Əvvəl zəmanətli nəticəni izah et. COW həmin nəticənin səmərəli implementasiya strategiyasını açıqlayır.",
        ),
      },
      {
        id: "nested-reference",
        title: b(
          "Worked example 2: the let struct trap",
          "İşlənmiş nümunə 2: let struct tələsi",
        ),
        setup: b(
          "The snapshots are separate struct values, but their Account field is a reference. Follow that arrow explicitly.",
          "Snapshot-lar ayrı struct dəyərləridir, amma Account sahəsi istinaddır. Həmin oxu açıq izlə.",
        ),
        code: "final class Account { var balance = 100 }\nstruct Snapshot { let account: Account }\nlet first = Snapshot(account: Account())\nlet second = first\nsecond.account.balance = 200\nprint(first.account.balance)",
        output: b("200", "200"),
        steps: [
          b(
            "One Account instance is constructed. first holds a reference to it.",
            "Bir Account obyekti yaradılır. first ona istinad saxlayır.",
          ),
          b(
            "Copying first copies the reference field into second. There is still one Account instance.",
            "first-in kopyası istinad sahəsini second-a verir. Hələ bir Account obyekti var.",
          ),
          b(
            "let prevents replacing second.account, but Account.balance remains a mutable property of the referenced object.",
            "let second.account-ı əvəz etməyə mane olur, amma Account.balance istinad edilən obyektin mutable property-si qalır.",
          ),
          b(
            "The mutation reaches the shared instance, so first observes 200 too.",
            "Mutasiya shared obyektə çatır, ona görə first də 200 görür.",
          ),
        ],
        takeaway: b(
          "An independent snapshot API should store balance as value data instead of hiding shared mutable state.",
          "Müstəqil snapshot API shared mutable state gizlətmək əvəzinə balansı dəyər data kimi saxlamalıdır.",
        ),
      },
    ],
    debug: {
      title: b(
        "Debug a receipt that changes after it was issued",
        "Verildikdən sonra dəyişən qəbzi sazla",
      ),
      broken:
        "final class MoneyBox { var amount = 100 }\nstruct Receipt { let money: MoneyBox }\nlet live = MoneyBox()\nlet receipt = Receipt(money: live)\nlive.amount = 0\nprint(receipt.money.amount)",
      failure: b(
        "The receipt now shows 0 even though it was created when the amount was 100. A reference-backed model was advertised as a historical value. This is a modeling bug, not an ARC leak.",
        "Qəbz 100 məbləğində yaransa da indi 0 göstərir. İstinadlı model tarixi dəyər kimi təqdim edilib. Bu model xətasıdır, ARC leak deyil.",
      ),
      fixed:
        "struct Receipt { let amount: Int }\nvar liveAmount = 100\nlet receipt = Receipt(amount: liveAmount)\nliveAmount = 0\nprint(receipt.amount) // 100",
      why: b(
        "The receipt captures the amount value at issuance. In a real model include currency, units and rounding policy. A live account service can remain a separately owned reference.",
        "Qəbz verilmə anındakı məbləğ dəyərini tutur. Real modelə valyuta, vahid və yuvarlaqlaşdırma siyasəti əlavə et. Canlı account servisi ayrıca owner-li istinad qala bilər.",
      ),
      test: b(
        "Create receipt at 100; change the live balance to 0; assert the receipt still reads 100. Also assert later receipts can capture the new value.",
        "100 ilə qəbz yarat, canlı balansı 0 et, qəbzin hələ 100 göstərməsini yoxla. Sonrakı qəbzin yeni dəyəri ala bilməsini də yoxla.",
      ),
    },
    interviews: [
      {
        id: "value-identity",
        level: "junior",
        question: b(
          "What is value semantics versus reference semantics?",
          "Dəyər və istinad semantikası nədir?",
        ),
        why: b(
          "The interviewer wants observable behavior, not a stack/heap slogan.",
          "Müsahibəçi stack/heap şüarı deyil, müşahidə olunan davranış istəyir.",
        ),
        answer: b(
          "With value semantics, copies behave independently when changed. With reference semantics, copied references can reach one shared identity, so mutations can be observed through either reference. I would demonstrate two Int arrays and two references to one Account, then distinguish the binding from the instance.",
          "Dəyər semantikasında kopyalar dəyişəndə müstəqil davranır. İstinad semantikasında kopyalanmış istinadlar eyni identity-yə çatır və mutasiya hər ikisində görünür. İki Int array və bir Account-a iki istinad göstərib binding-lə obyekti ayırardım.",
        ),
        wrong: b(
          "“Structs are always on the stack; classes are always on the heap” answers storage with an oversimplification instead of defining semantics.",
          "“Struct həmişə stack, class həmişə heap” semantikanı izah etmək əvəzinə storage-u həddən artıq sadələşdirir.",
        ),
        followup: b(
          "Does let make a referenced Account immutable?",
          "let istinad edilən Account-u immutable edirmi?",
        ),
        followupAnswer: b(
          "No. It prevents rebinding that reference. Mutability of the instance depends on the properties and API it exposes.",
          "Xeyr. İstinadın yenidən bağlanmasına mane olur. Obyektin dəyişməsi açdığı property və API-dən asılıdır.",
        ),
      },
      {
        id: "cow-deep",
        level: "middle",
        question: b(
          "Does Array copy-on-write deep-copy class elements?",
          "Array COW class elementləri deep-copy edirmi?",
        ),
        why: b(
          "This tests whether you can reason beyond the outer collection type.",
          "Bu, xarici kolleksiya tipindən dərinə düşünməyi yoxlayır.",
        ),
        answer: b(
          "No. Copying array storage copies element values; for class elements those values are references. Appending to the second array must not change the first array’s element sequence, but mutating a shared Account inside either array can be observed through both. If snapshots must be independent, use value elements or a deliberate domain-specific copy operation.",
          "Xeyr. Array storage kopyası element dəyərlərini kopyalayır; class elementi üçün dəyər istinaddır. İkinci array-a append birincinin element ardıcıllığını dəyişməməlidir, amma shared Account mutasiyası hər ikisində görünə bilər. Müstəqil snapshot üçün value element və ya məqsədli domen copy əməliyyatı seç.",
        ),
        wrong: b(
          "“COW makes everything inside the array independent” confuses buffer ownership with the identity of referenced elements.",
          "“COW array daxilində hər şeyi müstəqil edir” buffer ownership-i istinad olunan element identity-si ilə qarışdırır.",
        ),
        followup: b(
          "Is COW sufficient for two tasks writing the same shared array variable?",
          "İki task eyni shared array dəyişəninə yazırsa COW yetərlidirmi?",
        ),
        followupAnswer: b(
          "No. The shared mutable binding still needs a concurrency ownership policy, such as actor isolation.",
          "Xeyr. Shared mutable binding yenə concurrency ownership qaydası, məsələn actor izolyasiyası istəyir.",
        ),
      },
      {
        id: "value-design",
        level: "senior",
        question: b(
          "Would you replace a large value model with classes to avoid copies?",
          "Kopyadan qaçmaq üçün böyük value modeli class edərdinmi?",
        ),
        why: b(
          "This tests measurement, invariants and migration cost.",
          "Bu ölçü, invariant və miqrasiya xərcini yoxlayır.",
        ),
        answer: b(
          "Only after measuring a real copying/allocation problem and comparing alternatives. I would inspect mutation frequency, buffer uniqueness, hot paths and object lifetimes. Switching to references introduces shared identity and synchronization obligations and can break snapshot assumptions. I would preserve observable contracts and test old/new behavior before claiming a performance gain.",
          "Yalnız real kopyalama/allocation problemini ölçüb alternativi müqayisə etdikdən sonra. Mutasiya tezliyi, buffer unikallığı, hot path və lifetime-a baxardım. İstinada keçid shared identity və sinxronizasiya öhdəliyi yaradır, snapshot fərziyyəsini poza bilər. Performans artımı iddiasından əvvəl müqaviləni qoruyub əvvəl/sonra davranışı test edərdim.",
        ),
        wrong: b(
          "“Classes are faster” provides neither a workload nor evidence.",
          "“Class daha sürətlidir” nə workload, nə sübut verir.",
        ),
        followup: b(
          "What measurement would change your decision?",
          "Hansı ölçü qərarını dəyişər?",
        ),
        followupAnswer: b(
          "A repeatable profile showing expensive copies/allocations dominate the required workload, with an alternative that improves the measured budget without violating ownership or snapshot invariants.",
          "Lazım olan workload-da bahalı copy/allocation-un dominant olduğunu göstərən təkrarlanan profile və ownership/snapshot invariantını pozmadan büdcəni yaxşılaşdıran alternativ.",
        ),
      },
    ],
    exercise: {
      prompt: b(
        "Build an AccountSnapshot containing account ID, integer minor units and currency. Copy it, update the current account data, and prove the old snapshot stays unchanged. Explain why this is different from storing AccountSession inside the struct.",
        "Hesab ID-si, integer minor unit və valyuta saxlayan AccountSnapshot qur. Kopyala, cari məlumatı yenilə və köhnə snapshot-ın dəyişmədiyini sübut et. Struct daxilində AccountSession saxlamaqdan fərqini izah et.",
      ),
      hints: [
        b(
          "Model a recorded fact, not a live connection.",
          "Canlı əlaqəni deyil, qeydə alınan faktı modelləşdir.",
        ),
        b(
          "Keep network/session collaborators outside the snapshot.",
          "Network/session asılılıqlarını snapshot-dan kənarda saxla.",
        ),
      ],
      solution:
        'struct AccountSnapshot {\n    let id: String\n    let minorUnits: Int\n    let currency: String\n}\nlet old = AccountSnapshot(id: "A1", minorUnits: 10000, currency: "AZN")\nlet current = AccountSnapshot(id: old.id, minorUnits: 20000, currency: old.currency)\nassert(old.minorUnits == 10000)\nassert(current.minorUnits == 20000)',
      reasoning: b(
        "The old value records a fact; the current value is a replacement snapshot. No mutable Account reference is shared. Integer minor units here are an illustrative policy; a real currency model must define scale, overflow and rounding.",
        "Köhnə dəyər faktı qeyd edir; cari dəyər əvəz snapshot-dır. Mutable Account istinadı paylaşılmır. Integer minor unit burada illüstrativ siyasətdir; real valyuta modeli scale, overflow və rounding müəyyən etməlidir.",
      ),
      checks: [
        b(
          "Changing current state cannot change old snapshots.",
          "Cari state dəyişməsi köhnə snapshot-ı dəyişmir.",
        ),
        b(
          "Currency and units remain explicit.",
          "Valyuta və vahid açıq qalır.",
        ),
        b(
          "The explanation separates semantics, storage and synchronization.",
          "İzah semantika, storage və sinxronizasiyanı ayırır.",
        ),
      ],
    },
  },
  {
    topicId: "topic-08",
    prerequisiteNote: b(
      "Read value versus reference semantics first. Here, an owner means a strong reference that keeps an instance alive—not the person who wrote a class.",
      "Əvvəl dəyər/istinad semantikasını oxu. Burada owner class-ı yazan şəxs deyil, obyekti yaşadan güclü istinaddır.",
    ),
    objectives: [
      b(
        "Draw a retention graph and predict deinitialization.",
        "Retention qrafı çək və deinitialization-u proqnozlaşdır.",
      ),
      b(
        "Distinguish weak capture, task cancellation and temporary lifetime extension.",
        "Weak capture, task cancellation və müvəqqəti lifetime uzanmasını ayır.",
      ),
      b(
        "Debug memory growth using evidence instead of adding weak everywhere.",
        "Hər yerə weak əlavə etmək əvəzinə yaddaş artımını sübutla sazla.",
      ),
    ],
    sections: [
      {
        id: "arc-ownership",
        level: "junior",
        title: b("Why memory management exists", "Yaddaş idarəetməsi niyə var"),
        paragraphs: [
          b(
            "When a screen creates a ViewModel, that instance needs memory for its state. The memory cannot be reclaimed while somebody still needs the object. ARC tracks strong ownership of class instances and releases them when strong ownership ends. You usually do not manually free objects, but you still design who retains whom. Automatic counting does not mean automatic ownership design.",
            "Ekran ViewModel yaradanda state üçün yaddaş lazımdır. Obyektə hələ ehtiyac olan zaman həmin yaddaş geri alına bilməz. ARC class instansiyasının güclü ownership-ini izləyir və güclü ownership bitəndə buraxır. Obyekti adətən əl ilə free etmirsən, amma kimin kimi saxladığını yenə sən qurursan. Avtomatik sayma avtomatik ownership dizaynı deyil.",
          ),
          b(
            "Think of every strong reference as a reason the instance must remain alive. A weak reference is only a way to observe it and contributes no ownership. When the instance is deallocated, ordinary weak references become nil. A deinit print is a useful teaching observation, but real compilers can optimize reference lifetimes; avoid turning one print experiment into a universal allocation-timing rule.",
            "Hər strong istinadı obyektin yaşamasına səbəb kimi düşün. Weak yalnız müşahidə yoludur və ownership vermir. Obyekt silinəndə adi weak istinad nil olur. deinit print tədris müşahidəsidir; compiler lifetime-ı optimallaşdıra bilər. Bir print təcrübəsini universal allocation-vaxt qaydasına çevirmə.",
          ),
        ],
        analogy: b(
          "A strong reference is a ticket saying “keep this object.” Weak is the entry in an address book: it helps find the object while it exists but does not keep it alive.",
          "Strong “bu obyekti saxla” biletidir. Weak ünvan kitabçası qeydidir: obyekt varkən tapmağa kömək edir, onu yaşatmır.",
        ),
      },
      {
        id: "cycle-not-gc",
        level: "junior",
        title: b(
          "How an unreachable object can stay alive",
          "Çata bilmədiyin obyekt necə yaşaya bilər",
        ),
        paragraphs: [
          b(
            "Suppose a controller strongly owns its ViewModel. The ViewModel stores a closure, and that closure strongly captures the controller. The cycle is controller → ViewModel → closure → controller. Removing the navigation stack’s reference does not remove these internal references. ARC does not periodically trace the graph and break cycles the way a tracing garbage collector might reclaim unreachable groups.",
            "Controller ViewModel-ə strong sahibdir. ViewModel closure saxlayır və closure controller-i strong capture edir. Dövr controller → ViewModel → closure → controller olur. Navigation stack istinadını silmək daxili istinadları silmir. ARC tracing garbage collector kimi qrafı periodik axtarıb çatılmayan qrupu təmizləmir.",
          ),
          b(
            "Draw the whole graph before changing a capture. A closure passed briefly to a synchronous method often does not create a lasting cycle. A stored callback, timer, notification subscription or never-ending task has a different lifetime. Ask which object stores the closure and which event is supposed to release it.",
            "Capture dəyişməzdən əvvəl bütün qrafı çək. Qısa sinxron metoda ötürülən closure çox vaxt qalıcı dövr yaratmır. Saxlanan callback, timer, notification subscription və bitməyən task başqa lifetime-dır. Closure-u hansı obyektin saxladığını və hansı event-in buraxmalı olduğunu soruş.",
          ),
        ],
      },
      {
        id: "weak-unowned",
        level: "middle",
        title: b(
          "weak, unowned and the lifetime promise",
          "weak, unowned və lifetime vədi",
        ),
        paragraphs: [
          b(
            "Use weak when the referenced instance may disappear before the reference is used. Reading weak gives an Optional, so your code must define the absent-owner path. unowned instead expresses an assumption that the referenced object will still exist whenever accessed. A normal unowned reference traps if accessed after destruction. It is not simply a faster weak reference you choose whenever you dislike optionals.",
            "İstinad oxunmazdan əvvəl obyekt yox ola bilərsə weak seç. Weak oxumaq Optional verir; owner yoxdursa davranışı müəyyən etməlisən. unowned hər müraciətdə obyektin yaşayacağını fərz edir. Adi unowned obyekt silinəndən sonra oxunarsa trap yaradır. Optional xoşuna gəlməyəndə seçilən daha sürətli weak deyil.",
          ),
          b(
            "Inside { [weak self] in guard let self else { return }; await work() }, the guard creates a strong local self for that scope. The object can remain alive while the operation is suspended. That is often intentional temporary retention; it is not by itself proof of a permanent leak. If the operation never ends, lifetime ownership and cancellation need separate inspection.",
            "{ [weak self] in guard let self else { return }; await work() } daxilində guard həmin scope üçün güclü lokal self yaradır. Suspension zamanı obyekt yaşaya bilər. Bu çox vaxt məqsədli müvəqqəti retention-dır; özlüyündə qalıcı leak sübutu deyil. Əməliyyat bitmirsə lifetime ownership və cancellation ayrıca araşdırılmalıdır.",
          ),
        ],
        analogy: b(
          "Weak capture asks “is the owner still here when I begin?” A successful guard can then keep the owner here until the scope ends. It does not ask the network to stop.",
          "Weak capture “başlayanda owner hələ buradadırmı?” soruşur. Uğurlu guard owner-i scope bitənə qədər saxlaya bilər. Network-dən dayanmasını istəmir.",
        ),
      },
      {
        id: "task-memory",
        level: "middle",
        title: b(
          "Production ownership: cancellation is a different mechanism",
          "Praktiki ownership: cancellation başqa mexanizmdir",
        ),
        paragraphs: [
          b(
            "A task handle, the work being performed, a captured owner and the view lifecycle are four different things. Task.cancel() requests cooperative cancellation; it does not erase every captured reference immediately. [weak self] avoids a particular strong capture; it does not cancel an HTTP request, disconnect a stream or invalidate an old response. Give long-running work an explicit owner and stop condition.",
            "Task handle, görülən iş, capture edilən owner və view lifecycle ayrı anlayışlardır. Task.cancel() cooperative cancellation istəyir; bütün capture istinadını dərhal silmir. [weak self] konkret strong capture-dan qaçır; HTTP sorğunu ləğv etmir, stream ayırmır və köhnə cavabı etibarsız etmir. Uzunömürlü işə açıq owner və dayanma şərti ver.",
          ),
          b(
            "A common trap is “deinit will cancel the task,” when the task strongly retains the object whose deinit you are waiting for. The cleanup may never start if that task is effectively infinite. Consider a stop action tied to the actual feature lifetime, a separate worker with clear ownership, and cancellation handlers that terminate underlying resources. Do not prescribe one weak capture as a universal fix.",
            "Tipik tələ “deinit task-ı ləğv edəcək” deməkdir, amma task gözlənilən deinit-in obyektini strong saxlayır. Task praktik olaraq sonsuzdursa təmizlənmə başlamaya bilər. Feature lifetime-a bağlı stop action, aydın owner-li ayrıca worker və resursu dayandıran cancellation handler düşün. Tək weak capture-u universal həll sayma.",
          ),
        ],
      },
      {
        id: "memory-investigation",
        level: "senior",
        title: b(
          "Investigate growth before calling it a leak",
          "Artımı leak adlandırmadan əvvəl araşdır",
        ),
        paragraphs: [
          b(
            "Rising memory can be a bounded cache warming up, a large image decode, an unbounded history or a retain cycle. Compare repeated navigation/reload runs. In Memory Graph, find the retained instance and inspect incoming references. In Allocations, distinguish allocation rate from the set of objects that remain alive. A cache policy and an observer lifecycle bug need different fixes.",
            "Artan yaddaş dolan bounded cache, böyük şəkil decode, məhdudsuz tarixçə və ya retain cycle ola bilər. Təkrar naviqasiya/reload-u müqayisə et. Memory Graph-da qalan obyekti tap və gələn istinadları izlə. Allocations-da allocation sürətini yaşayan obyekt dəstindən ayır. Cache siyasəti və observer lifecycle xətası ayrı həll istəyir.",
          ),
          b(
            "Define evidence for the fix: dismissed screens deinitialize, owned work stops at the correct boundary, observers are removed, and retained memory reaches an acceptable steady state under the same workload. Do not claim a percentage reduction without comparable measurements. A source-level risk is not a reproduced production incident.",
            "Düzəliş sübutunu qur: bağlanan ekran silinir, sahib olunan iş düzgün sərhəddə dayanır, observer çıxarılır və eyni workload-da retained memory qəbul edilən steady state-ə çatır. Müqayisəli ölçü olmadan faiz azalması iddia etmə. Source səviyyəli risk təkrarlanmış production hadisəsi deyil.",
          ),
        ],
      },
    ],
    examples: [
      {
        id: "last-owner",
        title: b(
          "Worked example: watch the last strong owner",
          "İşlənmiş nümunə: son güclü owner-i izlə",
        ),
        setup: b(
          "The weak reference observes; it does not contribute a second owner.",
          "Weak istinad müşahidə edir, ikinci owner yaratmır.",
        ),
        code: 'final class Screen {\n    deinit { print("released") }\n}\nvar owner: Screen? = Screen()\nweak var observer = owner\nprint(observer != nil)\nowner = nil\nprint(observer == nil)',
        output: b("true\nreleased\ntrue", "true\nreleased\ntrue"),
        steps: [
          b(
            "owner holds the instance strongly; observer can see it.",
            "owner obyekti strong saxlayır; observer onu görür.",
          ),
          b(
            "owner = nil removes the remaining strong ownership in this example.",
            "owner = nil bu nümunədə son güclü ownership-i çıxarır.",
          ),
          b(
            "The instance deinitializes; the weak observer no longer yields the object.",
            "Obyekt deinitialize olur; weak observer artıq obyekti qaytarmır.",
          ),
        ],
        takeaway: b(
          "These observable results illustrate weak semantics. They do not measure hidden compiler retain/release instructions.",
          "Müşahidə edilən nəticə weak semantikasını göstərir, gizli retain/release təlimatlarını ölçmür.",
        ),
      },
      {
        id: "capture-graph",
        title: b(
          "Worked example: capture a different variable value",
          "İşlənmiş nümunə: dəyişənin dəyərini capture et",
        ),
        setup: b(
          "The capture list makes the strong back-reference explicit. Without reading the list carefully, you can miss the cycle.",
          "Capture list güclü geri istinadı açıq edir. Siyahını diqqətlə oxumasan dövrü qaçıra bilərsən.",
        ),
        code: "final class Model { var onTap: (() -> Void)? }\nvar model: Model? = Model()\nweak var observed = model\nmodel?.onTap = { [captured = model!] in\n    _ = captured.onTap\n}\nmodel = nil\nprint(observed != nil)\nobserved?.onTap = nil\nprint(observed == nil)",
        output: b("true\ntrue", "true\ntrue"),
        steps: [
          b(
            "The closure stores a strong captured reference to the instance.",
            "Closure captured ilə obyekti güclü saxlayır.",
          ),
          b(
            "The instance owns onTap, so instance → closure → instance forms a cycle.",
            "Obyekt onTap-a sahibdir; obyekt → closure → obyekt dövrü yaranır.",
          ),
          b(
            "Removing the external model binding does not break the internal cycle.",
            "Xarici model binding-i çıxarmaq daxili dövrü qırmır.",
          ),
          b(
            "Explicitly clearing onTap removes the closure owner and breaks the cycle.",
            "onTap-ı açıq təmizləmək closure owner-i çıxarır və dövrü qırır.",
          ),
        ],
        takeaway: b(
          "The force unwrap is only for this controlled demonstration after construction; it is not a recommended response to optional backend data.",
          "Force unwrap yalnız yaradılmadan sonrakı idarə olunan demo üçündür; optional backend data üçün tövsiyə deyil.",
        ),
      },
    ],
    debug: {
      title: b(
        "Fix a stored completion with a strong back-reference",
        "Güclü geri istinadlı completion-u düzəlt",
      ),
      broken:
        'final class Model {\n    var completion: (() -> Void)?\n    var title = "History"\n    func configure() {\n        completion = { print(self.title) }\n    }\n}',
      failure: b(
        "Model retains completion; completion retains Model. Dismissal can remove outside owners while this cycle survives.",
        "Model completion-u, completion Model-i saxlayır. Dismissal xarici owner-i çıxarsa da dövr qala bilər.",
      ),
      fixed:
        'final class Model {\n    var completion: (() -> Void)?\n    var title = "History"\n    func configure() {\n        completion = { [weak self] in\n            guard let self else { return }\n            print(self.title)\n        }\n    }\n}',
      why: b(
        "The stored closure no longer owns Model before invocation. The guard temporarily retains it only while executing this synchronous scope. Whether work should finish after the owner disappears is a product/lifecycle decision.",
        "Saxlanan closure çağırışdan əvvəl Model-ə sahib deyil. Guard yalnız bu sinxron scope işləyərkən müvəqqəti saxlayır. Owner yox olanda işin bitib-bitməməsi məhsul/lifecycle qərarıdır.",
      ),
      test: b(
        "Configure a model inside a local scope, observe it weakly, exit the scope and assert the weak observation becomes nil. Separately test the callback while the owner is alive.",
        "Lokal scope-da model qur, weak müşahidə et, scope-dan çıx və weak müşahidənin nil olmasını yoxla. Owner yaşayarkən callback-i ayrıca test et.",
      ),
    },
    interviews: [
      {
        id: "arc-cycle",
        level: "junior",
        question: b(
          "Why does ARC fail to release a retain cycle?",
          "ARC retain cycle-ı niyə buraxmır?",
        ),
        why: b(
          "It distinguishes reference counting from reachability-based garbage collection.",
          "İstinad sayımını reachability əsaslı garbage collection-dan ayırır.",
        ),
        answer: b(
          "ARC follows strong ownership. In a cycle, each instance still has a strong owner inside the cycle even when no outside code can reach it. One ownership edge must be removed or made non-owning according to the intended lifetime. I would draw the actual graph instead of adding weak to every reference.",
          "ARC strong ownership izləyir. Xarici kod çata bilməsə də dövrdə hər obyektin daxildə güclü owner-i qalır. Gözlənilən lifetime-a görə bir ownership oxu çıxarılmalı və ya non-owning olmalıdır. Hər istinada weak əlavə etmək əvəzinə real qrafı çəkərdim.",
        ),
        wrong: b(
          "“ARC will eventually collect unreachable cycles” assumes a tracing collector.",
          "“ARC gec-tez çatılmayan dövrü yığar” tracing collector fərz edir.",
        ),
        followup: b(
          "Is every strong closure capture a leak?",
          "Hər strong closure capture leak-dirmi?",
        ),
        followupAnswer: b(
          "No. A short-lived closure or finite task can release its captures on completion. A lasting cycle depends on who stores the closure and for how long.",
          "Xeyr. Qısa closure və ya bitən task completion-da capture-ları buraxa bilər. Qalıcı dövr closure-u kimin nə qədər saxlamasından asılıdır.",
        ),
      },
      {
        id: "weak-await",
        level: "middle",
        question: b(
          "Why can [weak self] still keep a ViewModel alive across await?",
          "[weak self] olan ViewModel await boyunca niyə yaşaya bilər?",
        ),
        why: b(
          "This tests scope lifetime, not memorization of a capture recipe.",
          "Bu capture reseptini deyil, scope lifetime-ını yoxlayır.",
        ),
        answer: b(
          "The weak capture itself does not retain self. But guard let self creates a strong local reference; that local can remain alive across the following await until its use/scope ends. This can be intentional lifetime extension. It neither cancels the operation nor proves a permanent leak. I would inspect the task’s stop condition and owner.",
          "Weak capture özü self-i saxlamır. Amma guard let self güclü lokal istinad yaradır; o sonrakı await boyunca istifadə/scope bitənə qədər qala bilər. Bu məqsədli lifetime uzanması ola bilər. Nə işi ləğv edir, nə də qalıcı leak sübut edir. Task-ın dayanma şərti və owner-inə baxardım.",
        ),
        wrong: b(
          "“Weak makes self nil during every await” ignores the promoted local reference.",
          "“Weak hər await-də self-i nil edir” gücləndirilmiş lokal istinadı nəzərə almır.",
        ),
        followup: b(
          "Why might cancellation in deinit be too late?",
          "deinit-də cancellation niyə gec ola bilər?",
        ),
        followupAnswer: b(
          "A never-ending task may retain the object whose deinit is supposed to cancel it. The feature may need an explicit stop boundary independent of deallocation.",
          "Bitməyən task onu ləğv etməli deinit-in obyektini saxlaya bilər. Feature silinmədən müstəqil açıq stop sərhədi istəyə bilər.",
        ),
      },
      {
        id: "memory-growth",
        level: "senior",
        question: b(
          "Memory rises on every reload. What do you investigate first?",
          "Hər reload-da yaddaş artır. Əvvəl nəyi araşdırırsan?",
        ),
        why: b(
          "A production answer needs evidence and competing hypotheses.",
          "Production cavabı sübut və alternativ fərziyyə istəyir.",
        ),
        answer: b(
          "I would reproduce under the same workload, inspect retained instances and incoming references, and compare allocation rate with surviving objects. Candidates include unbounded state history, subscriptions, caches, large images and cycles. I would change the cause supported by the graph/profile, then verify steady-state memory and lifecycle behavior without inventing a gain.",
          "Eyni workload-da təkrarlayar, qalan obyekt və gələn istinadı yoxlayar, allocation sürətini yaşayan obyektlə müqayisə edərdim. Məhdudsuz state tarixçəsi, subscription, cache, böyük şəkil və dövr namizəddir. Qraf/profile-ın dəstəklədiyi səbəbi dəyişib steady-state yaddaş və lifecycle-ı uydurma qazancsız yoxlayardım.",
        ),
        wrong: b(
          "“Use weak everywhere” can destroy intended lifetimes while missing the real retained collection.",
          "“Hər yerdə weak istifadə et” lazımi lifetime-ı poza və real saxlanan kolleksiyanı qaçıra bilər.",
        ),
        followup: b(
          "How do you distinguish a retained cache from a leak?",
          "Cache saxlanmasını leak-dən necə ayırırsan?",
        ),
        followupAnswer: b(
          "Check ownership intent, eviction bounds and whether growth stabilizes under repeated equivalent work. A legitimate cache has a policy and measurable limit; an accidental owner may retain obsolete screens indefinitely.",
          "Ownership məqsədi, eviction sərhədi və eyni təkrar işdə artımın sabitləşməsini yoxla. Düzgün cache-in siyasəti və ölçülən limiti var; təsadüfi owner köhnə ekranı limitsiz saxlaya bilər.",
        ),
      },
    ],
    exercise: {
      prompt: b(
        "Implement a model with a stored refresh completion that does not keep the model alive. Prove deinitialization, then explain how your design changes if refresh must finish after screen dismissal.",
        "Modeli yaşatmayan saxlanmış refresh completion yaz. Deinitialization-u sübut et, sonra ekran bağlansa da refresh bitməlidirsə dizayn fərqini izah et.",
      ),
      hints: [
        b(
          "Draw both ownership arrows before choosing weak.",
          "Weak seçməzdən əvvəl hər iki ownership oxunu çək.",
        ),
        b(
          "A long-lived operation can have a different owner from its screen.",
          "Uzunömürlü əməliyyatın sahibi ekrandan fərqli ola bilər.",
        ),
      ],
      solution:
        "final class Model {\n    var completion: (() -> Void)?\n    var refreshed = false\n    func configure() {\n        completion = { [weak self] in self?.refreshed = true }\n    }\n}\nweak var observed: Model?\ndo {\n    let model = Model()\n    observed = model\n    model.configure()\n    model.completion?()\n    assert(model.refreshed)\n}\nassert(observed == nil)",
      reasoning: b(
        "The closure uses a weak back-reference. If refresh must outlive the screen, move operation ownership to a service/workflow with a clear end condition; do not rely on the screen secretly staying alive.",
        "Closure weak geri istinad istifadə edir. Refresh ekranı ötə yaşamalıdırsa ownership-i aydın bitmə şərtli servis/workflow-a ver; ekranın gizli yaşamasına güvənmə.",
      ),
      checks: [
        b(
          "The callback changes state while the model exists.",
          "Model varkən callback state-i dəyişir.",
        ),
        b(
          "Leaving scope releases the model without manually breaking a cycle.",
          "Scope-dan çıxanda modeli əl ilə dövr qırmadan buraxır.",
        ),
        b(
          "Cancellation and observer cleanup are justified separately.",
          "Cancellation və observer təmizliyi ayrıca əsaslandırılır.",
        ),
      ],
    },
  },
  {
    topicId: "topic-12",
    prerequisiteNote: b(
      "Know functions, closures and shared references. Read each await as “the world may change before I continue,” not “start a background thread.”",
      "Funksiya, closure və shared istinadı bil. Hər await-i “davam etməzdən əvvəl dünya dəyişə bilər” kimi oxu, “background thread başlat” kimi deyil.",
    ),
    objectives: [
      b(
        "Separate concurrency, parallelism, suspension and isolation.",
        "Concurrency, paralellik, suspension və izolyasiyanı ayır.",
      ),
      b(
        "Trace ownership and cancellation across structured and unstructured tasks.",
        "Structured/unstructured task-larda ownership və cancellation-u izlə.",
      ),
      b(
        "Prevent stale UI results with an explicit operation policy.",
        "Açıq əməliyyat siyasəti ilə köhnə UI nəticəsini önlə.",
      ),
    ],
    sections: [
      {
        id: "async-why",
        level: "junior",
        title: b(
          "Why async exists: waiting without blocking the worker",
          "async niyə var: worker-i bloklamadan gözləmək",
        ),
        paragraphs: [
          b(
            "A bank screen asks for transaction history. The network may take hundreds of milliseconds, but the UI must still respond to scrolling and taps. A blocking function occupies its executing thread while waiting. An async function can suspend: it gives up execution until the result is ready. Suspension is not the same as running the function on a background thread, and await does not guarantee the function actually suspends on that call.",
            "Bank ekranı əməliyyat tarixçəsi istəyir. Network yüzlərlə millisaniyə çəkə bilər, amma UI scroll və basmaya cavab verməlidir. Blocking funksiya gözləyərkən işlədiyi thread-i tutur. Async funksiya suspend ola bilər: nəticə hazır olana qədər icranı verir. Suspension funksiyanın background thread-də işləməsi deyil və await həmin çağırışda mütləq dayanacağına zəmanət vermir.",
          ),
          b(
            "Concurrency means multiple activities can make progress during overlapping lifetimes. Parallelism means work executes simultaneously. You can have concurrent network operations without assuming one dedicated thread for each. Your design should name what may overlap and which mutable state must never be accessed unsafely.",
            "Concurrency bir neçə fəaliyyətin üst-üstə düşən lifetime-da irəliləməsidir. Paralellik eyni anda icradır. Hər sorğuya ayrıca thread fərz etmədən concurrent network əməliyyatı mümkündür. Dizayn nəyin üst-üstə düşdüyünü və hansı mutable state-in təhlükəsizsiz paylaşılmamalı olduğunu adlandırmalıdır.",
          ),
        ],
        analogy: b(
          "One waiter can take another table’s order while the kitchen prepares the first dish. That is overlapping progress; it does not require a second waiter.",
          "Mətbəx ilk yeməyi hazırlayarkən bir ofisiant başqa masanın sifarişini ala bilər. Bu üst-üstə düşən irəliləyişdir; ikinci ofisiant tələb etmir.",
        ),
      },
      {
        id: "structured-ownership",
        level: "junior",
        title: b(
          "Tasks have owners and lifetimes, not just syntax",
          "Task tək sintaksis deyil, owner və lifetime-dır",
        ),
        paragraphs: [
          b(
            "async let and task groups create structured child tasks whose lifetimes are bounded by their enclosing scope. The scope waits for its child work to finish before it exits. Cancellation propagates through these relationships, but children must cooperate. Task { } creates an unstructured task: keep a handle and define who cancels or awaits it when its work should follow a feature lifetime.",
            "async let və task group scope ilə məhdud structured child task yaradır. Scope çıxmazdan əvvəl child işin bitməsini gözləyir. Cancellation bu əlaqə ilə ötürülür, amma child əməkdaşlıq etməlidir. Task { } unstructured task yaradır: iş feature lifetime-a bağlıdırsa handle saxla, kimin ləğv və ya await etdiyini müəyyən et.",
          ),
          b(
            "Task.detached is not a general “make it faster” switch. It does not inherit actor isolation like an ordinary task created in an actor-isolated context, and transferring captured values has Sendable/isolation implications. Swift 6 strict concurrency and newer isolation defaults make language mode and compiler settings relevant; explain the assumptions instead of relying on one compiler-warning recipe.",
            "Task.detached ümumi “daha sürətli et” düyməsi deyil. Actor-isolated kontekstdə yaranan adi task kimi izolyasiyanı miras almır; capture dəyərlərinin ötürülməsində Sendable/izolyasiya nəticəsi var. Swift 6 strict concurrency və yeni isolation default-ları language mode/compiler ayarını vacib edir; tək warning resepti deyil, fərziyyəni izah et.",
          ),
        ],
      },
      {
        id: "actor-reentrancy",
        level: "middle",
        title: b(
          "Why an actor can still make a wrong business decision",
          "Actor niyə yenə səhv biznes qərarı verə bilər",
        ),
        paragraphs: [
          b(
            "Actor isolation protects access to isolated state. It does not promise that an entire async method runs without interruption. At an await, another actor operation can change state before the suspended method resumes. This is reentrancy. An operation that checked a condition before await must ask whether the condition still holds afterward.",
            "Actor izolyasiyası isolated state girişini qoruyur. Bütün async metodun fasiləsiz işləməsinə söz vermir. await-də başqa actor əməliyyatı suspend metod qayıtmazdan əvvəl state-i dəyişə bilər. Bu reentrancy-dir. await-dən əvvəl şərt yoxlayan əməliyyat sonra şərtin hələ doğru olduğunu soruşmalıdır.",
          ),
          b(
            "Search A starts, then the user types a new query and search B starts. B finishes first and displays current results. A resumes later and overwrites them. Every state write may happen safely on MainActor; the final screen is still wrong. This is a logical ordering race, not necessarily a memory data race. @MainActor cannot infer which request the product considers current.",
            "A axtarışı başlayır, istifadəçi yeni sorğu yazır və B başlayır. B əvvəl bitib cari nəticəni göstərir. A sonra qayıdıb nəticəni əvəz edir. Hər state yazması MainActor-da təhlükəsiz olsa da son ekran səhvdir. Bu məntiqi sıra race-idir, mütləq yaddaş data race-i deyil. @MainActor məhsulun hansı sorğunu cari saydığını özü bilmir.",
          ),
        ],
        analogy: b(
          "A receptionist handles one person at a time, but can pause one application while waiting for a document and handle another. One-at-a-time access does not mean the first application is still relevant when its document arrives.",
          "Qeydiyyatçı bir anda bir nəfərlə işləyir, amma sənəd gözləyən ərizəni saxlayıb başqasını qəbul edir. Tək-tək giriş ilk sənəd gələndə onun ərizəsinin hələ aktual olduğunu təmin etmir.",
        ),
      },
      {
        id: "operation-policy",
        level: "middle",
        title: b(
          "Build latest-wins rather than hoping cancellation is enough",
          "Cancellation-a ümid etmək əvəzinə latest-wins qur",
        ),
        paragraphs: [
          b(
            "Choose the product policy first. Latest-wins fits search. Ignore-duplicates can fit a delete confirmation. Serialization can fit a workflow with meaningful ordered operations. For latest-wins, increment a generation before each load, capture it locally, await work, then compare it to the current generation before applying state. Check cancellation too, and preserve cancellation identity through error mapping.",
            "Əvvəl məhsul qaydasını seç. Search üçün latest-wins uyğundur. Delete confirmation üçün təkrarı atlama, sıralı workflow üçün serial icra uyğun ola bilər. Latest-wins üçün hər load-dan əvvəl generation artır, lokal saxla, işi await et və state yazmazdan əvvəl cari generation-la müqayisə et. Cancellation-u da yoxla və error mapping-də cancellation kimliyini qoru.",
          ),
          b(
            "Cancelling obsolete work saves resources when the service cooperates. The generation guard protects visible correctness even when an old callback still arrives. A workflow ID shared by several requests may be too broad: two loads within that same workflow need their own operation identity. A cancelled mutation can also finish on the server, so client latest-wins is not a substitute for payment idempotency and reconciliation.",
            "Servis əməkdaşlıq edəndə köhnə işi ləğv etmək resurs qoruyur. Generation guard köhnə callback gəlsə də görünən düzgünlüyü qoruyur. Bir neçə sorğunun paylaşdığı workflow ID çox geniş ola bilər: eyni workflow-dakı iki load ayrıca operation identity istəyir. Ləğv olunan mutasiya serverdə bitə də bilər; client latest-wins payment idempotency və reconciliation əvəzi deyil.",
          ),
        ],
      },
      {
        id: "concurrency-judgment",
        level: "senior",
        title: b(
          "The real design is who owns the whole logical operation",
          "Əsl dizayn bütün məntiqi əməliyyatın sahibidir",
        ),
        paragraphs: [
          b(
            "Trace the operation beyond its first transport task. Authentication refresh can replace a request; retry can create another attempt; a stream wrapper may create a producer task. Cancellation is incomplete if the owner only holds the first handle. Define a logical operation whose stop policy covers its replacements and termination paths, while allowing shared work to have separate waiter semantics.",
            "Əməliyyatı ilk transport task-dan sonra da izlə. Auth refresh sorğunu əvəz edir, retry yeni cəhd yaradır, stream wrapper producer task yarada bilər. Owner yalnız ilk handle saxlayırsa cancellation natamamdır. Əvəzləmə və termination yollarını əhatə edən məntiqi əməliyyat qur, shared işin waiter semantikasını ayrıca saxla.",
          ),
          b(
            "Sendable is a contract about safe transfer across concurrency boundaries; it does not mean every reachable object is deeply immutable. @unchecked Sendable is a manual safety promise and requires inspecting mutable collaborators and synchronization. Tests should control completion order and cancellation, rather than sleeping until a race stops reproducing.",
            "Sendable concurrency sərhədindən təhlükəsiz ötürmə müqaviləsidir; bütün çatan obyektin dərin immutable olması deyil. @unchecked Sendable manual təhlükəsizlik vədidir, mutable asılılıq və sinxronizasiya yoxlaması istəyir. Test sleep ilə race gizlətməməli, completion sırası və cancellation-u idarə etməlidir.",
          ),
        ],
      },
    ],
    examples: [
      {
        id: "structured-sum",
        title: b(
          "Worked example: structured work, deterministic presentation",
          "İşlənmiş nümunə: structured iş, deterministik təqdimat",
        ),
        setup: b(
          "Tasks can finish in either order. Sorting the collected values makes the displayed result independent of that ordering.",
          "Task-lar fərqli sırada bitə bilər. Toplanan dəyəri sort etmək göstərilən nəticəni sıradan müstəqil edir.",
        ),
        code: "let values = await withTaskGroup(of: Int.self) { group in\n    group.addTask { 20 }\n    group.addTask { 10 }\n    var collected: [Int] = []\n    for await value in group { collected.append(value) }\n    return collected.sorted()\n}\nprint(values)",
        output: b(
          "[10, 20] (predicted; completion order is not promised)",
          "[10, 20] (proqnoz; tamamlanma sırası zəmanətli deyil)",
        ),
        steps: [
          b(
            "The group creates two structured child tasks.",
            "Group iki structured child task yaradır.",
          ),
          b(
            "for await receives completed values; do not assume submission order.",
            "for await bitən dəyərləri alır; göndərilmə sırasını fərz etmə.",
          ),
          b(
            "The enclosing scope cannot leave unfinished children behind.",
            "Scope bitməmiş child task-ı geridə qoya bilməz.",
          ),
          b(
            "Sorting defines a deterministic presentation policy independently of task scheduling.",
            "Sort task scheduling-dən ayrı deterministik təqdimat qaydası qurur.",
          ),
        ],
        takeaway: b(
          "Concurrency behavior and output-order policy are separate choices.",
          "Concurrency davranışı ilə çıxış sırası qaydası ayrı seçimdir.",
        ),
      },
      {
        id: "latest-wins-code",
        title: b(
          "Worked example: guard the invariant after await",
          "İşlənmiş nümunə: await-dən sonra invariantı yoxla",
        ),
        setup: b(
          "The injected loader lets a test decide when A and B finish. This is a reusable model, not a live banking request.",
          "Injection olunan loader testə A və B-nin bitmə vaxtını seçdirir. Bu təkrar istifadə olunan modeldir, canlı bank sorğusu deyil.",
        ),
        code: "@MainActor\nfinal class SearchModel {\n    private var generation = 0\n    private(set) var rows: [String] = []\n    func load(_ query: String, using fetch: (String) async throws -> [String]) async throws {\n        generation += 1\n        let mine = generation\n        let result = try await fetch(query)\n        try Task.checkCancellation()\n        guard mine == generation else { return }\n        rows = result\n    }\n}",
        output: b(
          "Example trace: start A (1), start B (2), finish B → apply; finish A → discard. No console output is produced by the type alone.",
          "Nümunə iz: A başla (1), B başla (2), B bitsin → yaz; A bitsin → at. Tək tip konsol çıxışı yaratmır.",
        ),
        steps: [
          b(
            "A captures generation 1 before suspension.",
            "A suspension-dan əvvəl generation 1 saxlayır.",
          ),
          b(
            "B enters while A is suspended and captures generation 2.",
            "A suspend ikən B daxil olub generation 2 saxlayır.",
          ),
          b(
            "B’s result passes the guard because current generation is 2.",
            "Cari generation 2 olduğu üçün B nəticəsi guard-dan keçir.",
          ),
          b(
            "A’s result is outdated even if its transport did not cancel; the guard rejects it.",
            "Transport ləğv olmasa da A köhnədir; guard onu rədd edir.",
          ),
        ],
        takeaway: b(
          "The actor protects access; your generation policy protects relevance.",
          "Actor girişi qoruyur; generation qaydan aktuallığı qoruyur.",
        ),
      },
    ],
    debug: {
      title: b(
        "Fix a data-race-free stale search",
        "Data race olmayan köhnə search-i düzəlt",
      ),
      broken:
        "@MainActor\nfinal class Search {\n    var rows: [String] = []\n    func load(using fetch: () async throws -> [String]) async throws {\n        rows = try await fetch()\n    }\n}",
      failure: b(
        "A late old response can overwrite a newer query. MainActor serializes state access but allows other actions during suspension.",
        "Gecikən köhnə cavab yeni sorğunu əvəz edir. MainActor girişi serial edir, suspension zamanı başqa action-a icazə verir.",
      ),
      fixed:
        "@MainActor\nfinal class Search {\n    private var generation = 0\n    private(set) var rows: [String] = []\n    func load(using fetch: () async throws -> [String]) async throws {\n        generation += 1\n        let mine = generation\n        let result = try await fetch()\n        try Task.checkCancellation()\n        guard mine == generation else { return }\n        rows = result\n    }\n}",
      why: b(
        "Each operation owns a distinct captured generation. The relevance decision happens after the suspension, immediately before state mutation. Error/loading paths in a complete screen need the same current-operation guard.",
        "Hər əməliyyat ayrıca captured generation saxlayır. Aktuallıq qərarı suspension-dan sonra state yazmazdan əvvəl verilir. Tam ekrandakı error/loading yolları da eyni current-operation guard istəyir.",
      ),
      test: b(
        "Start A, start B, complete B, assert B rows; complete A, assert rows are still B. Add a same-workflow-ID version and a cancellation error case. Do not use real timing sleeps.",
        "A, sonra B başlat; B-ni bitir və sətiri yoxla; A-nı bitir, yenə B qaldığını yoxla. Eyni workflow ID və cancellation xətası variantını əlavə et. Real sleep vaxtı istifadə etmə.",
      ),
    },
    interviews: [
      {
        id: "await-thread",
        level: "junior",
        question: b(
          "Does await mean run on a background thread?",
          "await background thread-də işlətməkdirmi?",
        ),
        why: b(
          "This checks the mental model before scheduler details.",
          "Scheduler detalından əvvəl düşüncə modelini yoxlayır.",
        ),
        answer: b(
          "No. await marks a potential suspension in an async operation. It does not promise a thread switch, parallel execution or that the call actually suspends. Isolation and executor rules govern where work runs. I separate waiting without blocking from moving CPU-intensive work off the UI executor.",
          "Xeyr. await async əməliyyatda mümkün suspension nöqtəsidir. Thread dəyişməsi, paralellik və ya həmin çağırışın mütləq dayanmasını vəd etmir. İcra yeri isolation/executor qaydasından asılıdır. Bloklamadan gözləməyi CPU-ağır işi UI executor-dan çıxarmaqdan ayırıram.",
        ),
        wrong: b(
          "“Add await to make expensive synchronous computation stop blocking” does not change the computation’s isolation contract.",
          "“Bahalı sinxron hesablamaya await əlavə et, bloklama bitsin” onun izolyasiya müqaviləsini dəyişmir.",
        ),
        followup: b(
          "Can async work be concurrent but not parallel?",
          "Async iş concurrent olub paralel olmaya bilərmi?",
        ),
        followupAnswer: b(
          "Yes. Overlapping lifetimes and progress do not require simultaneous CPU execution.",
          "Bəli. Üst-üstə düşən lifetime və irəliləyiş eyni anda CPU icrası tələb etmir.",
        ),
      },
      {
        id: "actor-stale",
        level: "middle",
        question: b(
          "Why can @MainActor still show an old search result?",
          "@MainActor niyə köhnə search nəticəsi göstərə bilər?",
        ),
        why: b(
          "A strong answer separates data safety from business ordering.",
          "Güclü cavab data təhlükəsizliyini biznes sırasından ayırır.",
        ),
        answer: b(
          "At await the method can suspend and another search changes the current operation. The older response may resume later. Actor isolation prevents unsynchronized access, not stale decisions. I choose latest-wins, cancel obsolete work where supported, and compare captured operation identity after await before updating success, failure or loading state.",
          "await-də metod suspend olub başqa search cari əməliyyatı dəyişə bilər. Köhnə cavab sonra qayıda bilər. Actor sinxronlaşdırılmamış girişi önləyir, köhnə qərarı deyil. Latest-wins seçir, dəstəklənirsə köhnə işi ləğv edir, uğur/xəta/loading yazmazdan əvvəl captured identity-ni await-dən sonra yoxlayıram.",
        ),
        wrong: b(
          "“Everything is on the main thread, so races are impossible” overlooks logical races.",
          "“Hər şey main thread-dədir, race mümkün deyil” məntiqi race-i qaçırır.",
        ),
        followup: b(
          "Is checking workflow ID sufficient?",
          "Workflow ID yoxlamaq kifayətdirmi?",
        ),
        followupAnswer: b(
          "Only if it uniquely represents the decision being protected. Repeated operations in one workflow may need a finer-grained generation or request ID.",
          "Yalnız qorunan qərarı unikal təmsil edirsə. Eyni workflow-da təkrar əməliyyat daha dar generation/request ID istəyə bilər.",
        ),
      },
      {
        id: "cancel-chain",
        level: "senior",
        question: b(
          "Cancellation was requested but traffic continued. What do you trace?",
          "Cancellation istənib, amma trafik davam edir. Nəyi izləyirsən?",
        ),
        why: b(
          "This tests ownership across transport replacement and abstraction boundaries.",
          "Transport əvəzlənməsi və abstraksiya sərhədində ownership-i yoxlayır.",
        ),
        answer: b(
          "I trace the entire logical request: original transport, refresh waiter, retry, replacement handle, stream producer and termination cleanup. A token owning only the first transport cannot cancel later work it never receives. I also distinguish stopping client consumption from proving the server mutation was rolled back. Shared refresh needs an explicit policy for cancellation of one waiter versus all waiters.",
          "Bütün məntiqi sorğunu izləyirəm: ilkin transport, refresh waiter, retry, əvəz handle, stream producer və termination təmizliyi. Tək ilk transport-a sahib token almadığı sonrakı işi ləğv edə bilməz. Klient oxumasını dayandırmaqla server mutasiyasının rollback sübutunu da ayırıram. Shared refresh bir waiter və bütün waiter cancellation-u üçün açıq siyasət istəyir.",
        ),
        wrong: b(
          "“Call cancel again” does not establish ownership of replacement operations.",
          "“Bir də cancel çağır” əvəz əməliyyatın ownership-ini qurmur.",
        ),
        followup: b(
          "What if the cancelled request transfers money?",
          "Ləğv olunan sorğu pul köçürürsə necə?",
        ),
        followupAnswer: b(
          "Use the backend’s idempotency and status-reconciliation contract. A cancelled client request can still have a committed server outcome.",
          "Backend idempotency və status reconciliation müqaviləsini istifadə et. Ləğv olunan klient sorğusu serverdə artıq commit edilmiş ola bilər.",
        ),
      },
    ],
    exercise: {
      prompt: b(
        "Extend SearchModel with loading and error state. Make A fail after B succeeds, and prove that A cannot replace B’s success with an error or clear B’s loading indicator early.",
        "SearchModel-ə loading/error əlavə et. B uğurundan sonra A xəta alsın və A-nın B uğurunu xəta ilə əvəz və ya B loading-ini tez təmizləyə bilmədiyini sübut et.",
      ),
      hints: [
        b(
          "Apply current-operation checks to every visible state write, not only success.",
          "Current-operation yoxlamasını tək uğura deyil, bütün görünən yazmaya tətbiq et.",
        ),
        b(
          "A defer that blindly clears loading can also be stale.",
          "Loading-i kor-koranə təmizləyən defer də köhnə ola bilər.",
        ),
      ],
      solution:
        '@MainActor\nfinal class SearchState {\n    private var generation = 0\n    private(set) var rows: [String] = []\n    private(set) var isLoading = false\n    private(set) var error: String?\n    func load(using fetch: () async throws -> [String]) async {\n        generation += 1\n        let mine = generation\n        isLoading = true; error = nil\n        defer { if mine == generation { isLoading = false } }\n        do {\n            let result = try await fetch()\n            try Task.checkCancellation()\n            guard mine == generation else { return }\n            rows = result\n        } catch is CancellationError {\n            // Cancellation is not a user-facing failure.\n        } catch {\n            guard mine == generation, !Task.isCancelled else { return }\n            self.error = "Could not load"\n        }\n    }\n}',
      reasoning: b(
        "Success, error and loading cleanup share the same generation contract. Cancellation remains distinct. A complete product must also choose whether old rows remain visible during loading and whether leaving the screen invalidates the operation.",
        "Uğur, xəta və loading təmizliyi eyni generation müqaviləsini paylaşır. Cancellation ayrıdır. Tam məhsul yüklənərkən köhnə sətirin qalmasını və ekran çıxışının əməliyyatı etibarsız edib-etmədiyini də seçməlidir.",
      ),
      checks: [
        b("B success survives A failure.", "A xətası B uğurunu pozmur."),
        b(
          "A completion cannot clear B’s in-flight loading state.",
          "A completion B-nin loading state-ini təmizləmir.",
        ),
        b(
          "Cancellation does not present a generic failure alert.",
          "Cancellation ümumi xəta alert-i göstərmir.",
        ),
      ],
    },
  },
];
