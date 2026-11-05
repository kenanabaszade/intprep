import { bi as b } from "@/lib/types";
import type { TeachingSection, WorkedExample } from "./chapter-types";
export const swiftBasicsFoundation: TeachingSection[] = [
  {
    id: "what-a-program-does",
    level: "junior",
    title: b(
      "Before syntax: what does a program actually do?",
      "Sintaksisdən əvvəl: proqram əslində nə edir?",
    ),
    paragraphs: [
      b(
        "A program stores information, makes decisions and performs actions. A calculator stores numbers, decides which operation you chose and shows a result. A shopping app stores a quantity, checks whether an item is available and updates the screen. Swift is the language we use to describe these instructions precisely enough that a computer can carry them out.",
        "Proqram məlumat saxlayır, qərar verir və əməl edir. Kalkulyator rəqəmləri saxlayır, seçdiyin əməli müəyyən edir və nəticə göstərir. Alış-veriş tətbiqi miqdarı saxlayır, məhsulun olub-olmadığını yoxlayır və ekranı yeniləyir. Swift bu təlimatı kompüterin icra edə biləcəyi dəqiqliklə təsvir etdiyimiz dildir.",
      ),
      b(
        "A value is a particular piece of information, such as the number 3, the text “Hello”, or true. A name lets the program refer to a value without writing it repeatedly. An expression produces a value: adding two numbers or comparing two quantities are expressions. A statement tells the program to do something, such as declare a name, assign a new value or choose a branch. Understanding these words makes later code explainable rather than a collection of symbols to memorize.",
        "Dəyər konkret məlumatdır: 3 rəqəmi, “Salam” mətni və ya true. Ad proqramın dəyəri təkrar yazmadan istifadə etməsinə imkan verir. İfadə dəyər yaradır: iki rəqəmin cəmi və ya iki miqdarın müqayisəsi ifadədir. Təlimat ad elan etmək, yeni dəyər mənimsətmək və ya budaq seçmək kimi işi deyir. Bu sözləri anlamaq sonrakı kodu əzbər simvoldan izah olunan düşüncəyə çevirir.",
      ),
    ],
    analogy: b(
      "First say what should happen in ordinary language. Then use Swift to make every assumption precise. The code is the final description of an idea you already understand.",
      "Əvvəl adi dillə nə baş verməli olduğunu de. Sonra Swift ilə hər fərziyyəni dəqiqləşdir. Kod artıq anladığın fikrin son təsviridir.",
    ),
  },
  {
    id: "constants-and-change",
    level: "junior",
    title: b(
      "Constants and variables: decide what is allowed to change",
      "Sabit və dəyişən: nəyin dəyişə biləcəyini seç",
    ),
    paragraphs: [
      b(
        "A constant is a named binding that can receive its value once. A variable is a binding that can later receive a different value of its permitted type. Swift spells these declarations let and var. The useful question is not “which keyword is shorter?” but “should later code be allowed to replace this value?” A maximum number of attempts is usually fixed for an operation; the current attempt count changes as work proceeds.",
        "Sabit dəyərini bir dəfə ala bilən adlı binding-dir. Dəyişən sonra icazəli tipdə başqa dəyər ala bilər. Swift bunları let və var ilə elan edir. Faydalı sual “hansı keyword qısadır?” deyil, “sonrakı kod bu dəyəri əvəz edə bilməlidirmi?” sualıdır. Maksimum cəhd sayı əməliyyat üçün adətən sabitdir; cari cəhd sayı iş getdikcə dəyişir.",
      ),
      b(
        "Prefer let when reassignment is unnecessary because it removes one possible source of change from your reasoning. That is a restriction the compiler can check; a comment saying “do not change this” is not equivalent. With class references, the restriction concerns the binding, not every property of the referenced object. Keep that distinction for the value/reference lesson rather than assuming let recursively freezes an entire application.",
        "Yenidən mənimsətmə lazım deyilsə let seç: düşünməli olduğun dəyişmə mənbəyini azaldır. Bu compiler-in yoxladığı məhdudiyyətdir; “dəyişmə” şərhi eyni deyil. Class istinadında məhdudiyyət binding-ə aiddir, obyektin bütün property-sinə yox. let-in bütün tətbiqi rekursiv dondurduğunu fərz etmək əvəzinə fərqi value/reference dərsində davam etdir.",
      ),
    ],
  },
  {
    id: "types-before-inference",
    level: "junior",
    title: b(
      "Types, inference and safety are different ideas",
      "Tip, inference və təhlükəsizlik ayrı anlayışdır",
    ),
    paragraphs: [
      b(
        "A type describes which kind of value a name can hold and which operations make sense for it. Int represents integers, Double floating-point numbers, String text, and Bool a true/false answer. The compiler is the tool that checks and translates your program before you run it. A type annotation states the intended type explicitly; type inference lets the compiler work it out from the surrounding information. Inference saves repetition, not type checking.",
        "Tip adın hansı növ dəyər saxladığını və hansı əməliyyatın ona uyğun olduğunu təsvir edir. Int tam ədəd, Double kəsrli floating-point ədəd, String mətn, Bool doğru/yanlış cavabdır. Compiler proqramı işə salmazdan əvvəl yoxlayıb çevirən alətdir. Tip annotasiyası niyyəti açıq bildirir; type inference compiler-in ətraf məlumatdan tipi tapmasıdır. Inference təkrarı azaldır, tip yoxlamasını yox.",
      ),
      b(
        "If a variable is inferred as Int, assigning text later does not make it a String. Swift rejects the mismatch instead of silently changing the variable’s meaning. You sometimes annotate a type because an empty collection or a numeric literal has insufficient context, or because an API boundary should express a deliberate contract. An inferred default numeric type is a language rule, not evidence that every numeric calculation uses that type.",
        "Dəyişən Int kimi çıxarılıbsa sonra mətn mənimsətmək onu String etmir. Swift mənanı səssiz dəyişmək əvəzinə uyğunsuzluğu rədd edir. Boş kolleksiya/rəqəm literalında kontekst çatmadıqda və ya API sərhədində məqsədli müqavilə lazım olduqda tipi açıq yazırsan. Standart numeric inference qaydası hər hesablamanın həmin tiplə getdiyini sübut etmir.",
      ),
    ],
    analogy: b(
      "A type is the agreement about what a container holds. Inference reads the agreement from context; it does not remove the agreement.",
      "Tip qabın nə saxladığı barədə razılaşmadır. Inference razılaşmanı kontekstdən oxuyur; onu ləğv etmir.",
    ),
  },
  {
    id: "operators-and-decisions",
    level: "junior",
    title: b(
      "Operators: producing a value versus changing a value",
      "Operator: dəyər yaratmaq və dəyəri dəyişmək",
    ),
    paragraphs: [
      b(
        "Arithmetic operators combine values. Addition, subtraction, multiplication and division produce results; the assignment operator stores a result in a binding. Comparing two values produces a Bool. Equality comparison uses ==, while = assigns; confusing them mixes a question with a command. Integer division discards the fractional part, so the type of the operands changes what a division means. This matters before introducing financial rounding or more advanced numeric models.",
        "Arifmetik operator dəyərləri birləşdirir. Toplama, çıxma, vurma və bölmə nəticə yaradır; assignment operator nəticəni binding-də saxlayır. Müqayisə Bool yaradır. Bərabərlik == ilə soruşulur, = mənimsədir; onları qarışdırmaq sualla əmri qarışdırır. Tam ədəd bölməsi kəsr hissəsini saxlamır; operand tipi bölmənin mənasını dəyişir. Maliyyə rounding və qabaqcıl modeldən əvvəl bu fərq vacibdir.",
      ),
      b(
        "Logical operators combine conditions: && requires both to be true, || requires at least one, and ! negates a condition. && and || short-circuit, so an unnecessary right-hand condition is not evaluated. The ternary operator chooses one of two expression values from a Bool condition; it is a compact choice, not a reason to hide a complex workflow in one line. Use parentheses when they make the intended grouping clearer.",
        "Məntiqi operator şərti birləşdirir: && hər ikisinin, || ən az birinin doğru olmasını istəyir, ! şərti tərsinə çevirir. && və || short-circuit edir, lazım olmayan sağ şərt hesablanmır. Ternary Bool şərtə görə iki ifadə dəyərindən birini seçir; yığcam seçimdir, mürəkkəb workflow-u bir sətirdə gizlətmək səbəbi deyil. Niyyəti aydınlaşdırırsa mötərizə istifadə et.",
      ),
    ],
  },
  {
    id: "ranges-and-boundaries",
    level: "junior",
    title: b(
      "Ranges make boundary decisions explicit",
      "Range sərhəd qərarını açıq edir",
    ),
    paragraphs: [
      b(
        "A range describes an interval rather than one value. A closed range includes both ends; a half-open range includes the lower end and excludes the upper end. For a list of three elements, valid positions are 0, 1 and 2, so a boundary expressed as 0..<3 avoids accidentally including index 3. This is why half-open ranges appear so often in collection algorithms.",
        "Range bir dəyər deyil, intervaldır. Closed range hər iki ucu daxil edir; half-open aşağı ucu daxil, yuxarı ucu xaric edir. Üç elementli siyahının mövqeləri 0, 1, 2-dir; 0..<3 sərhədi səhvən indeks 3-ü daxil etmir. Half-open range-in kolleksiya alqoritmində çox görünməsinin səbəbi budur.",
      ),
      b(
        "Do not infer that every collection has integer indices beginning at zero. Strings use indices that respect their representation, and slices can retain the indices of their original collection. Prefer a collection’s own indices or iteration when you do not need a specific numeric interval. A range is a tool for expressing a valid boundary, not proof that an index is valid for every collection.",
        "Hər kolleksiyanın sıfırdan başlayan integer indeksə malik olduğunu çıxarma. String öz təqdimatına uyğun indeks istifadə edir, slice ilkin kolleksiya indeksini saxlaya bilər. Konkret numeric interval lazım deyilsə kolleksiyanın indices və ya iterasiyasını seç. Range düzgün sərhəd ifadə edən alətdir, hər kolleksiya üçün indeks etibarı sübutu deyil.",
      ),
    ],
  },
  {
    id: "scope-and-lifetime",
    level: "middle",
    title: b(
      "Scope tells you where a name is visible; lifetime tells you how long data exists",
      "Scope adın harada göründüyünü, lifetime datanın nə qədər yaşadığını deyir",
    ),
    paragraphs: [
      b(
        "A scope is a region of code in which a declaration can be referred to by its name. A name declared inside a conditional block is not automatically available after that block. A narrower scope reduces accidental dependencies because fewer statements can read or replace the value. Shadowing introduces another binding with the same spelling; it does not mean two variables have become the same variable.",
        "Scope elanın adı ilə müraciət olunduğu kod sahəsidir. Şərt bloku daxilində yaranan ad blokdan sonra avtomatik görünmür. Dar scope təsadüfi asılılığı azaldır: dəyəri daha az təlimat oxuyur/əvəz edir. Shadowing eyni yazılışlı başqa binding yaradır; iki dəyişənin eyniləşməsi deyil.",
      ),
      b(
        "Lifetime is about the existence of data or an object, not just name visibility. A closure can retain context after the creating function returns; a class instance can remain alive through another owner even after one local name leaves scope. Later ARC lessons explain those owners. For now, keep the two questions separate: can this line name the value, and does the underlying data still exist?",
        "Lifetime data/obyektin mövcudluğudur, tək ad görünməsi deyil. Closure yaradan funksiya bitəndən sonra kontekst saxlaya bilər; bir lokal ad scope-dan çıxsa da class başqa owner ilə yaşaya bilər. Sonrakı ARC dərsi owner-i açıqlayır. İndi iki sualı ayır: bu sətir dəyəri adı ilə görə bilir və daxili data hələ mövcuddurmu?",
      ),
    ],
  },
  {
    id: "aliases-and-returning",
    level: "middle",
    title: b(
      "typealias, Void and Never: naming a type versus promising a return",
      "typealias, Void və Never: tip adı və qayıdış vədi",
    ),
    paragraphs: [
      b(
        "A typealias gives an existing type another name. It can make a long function type or domain vocabulary easier to read, but it does not create a distinct type that the compiler will keep separate. Two aliases of Int can still be mixed as Int values. If mixing identifiers must be impossible, a new wrapper type is a different design tool, introduced in the structures lesson.",
        "typealias mövcud tipə başqa ad verir. Uzun funksiya tipini və ya domen dilini oxunaqlı edir, amma compiler-in ayrı saxlayacağı yeni tip yaratmır. Int üçün iki alias yenə Int kimi qarışa bilər. İdentifikatorları qarışdırmaq mümkünsüz olmalıdırsa yeni wrapper tip başqa alətdir və struct dərsində öyrədilir.",
      ),
      b(
        "A function is a named piece of work that can be called; returning is how it hands control and any result back to its caller. A function can return normally without a useful result; its result type is Void. Never describes a function that does not return normally at all. There is no Never value for a caller to receive. This lets control-flow checking understand that a path ending in fatalError cannot continue. It is not a shortcut for handling ordinary missing user input: expected failures need a recoverable branch or an error, not a crash.",
        "Funksiya çağırıla bilən adlı iş hissəsidir; qayıtmaq idarəni və varsa nəticəni çağırana qaytarmaqdır. Funksiya faydalı nəticəsiz normal qayıda bilər; nəticə tipi Void-dur. Never heç normal qayıtmayan funksiyanı təsvir edir. Çağıranın ala biləcəyi Never dəyəri yoxdur. Bu, control-flow yoxlamasına fatalError ilə bitən yolun davam etmədiyini anlatır. Adi user input yoxluğu üçün qısa yol deyil: gözlənən xəta crash yox, recoverable branch/error istəyir.",
      ),
    ],
  },
];
export const swiftBasicsPrimerExample: WorkedExample = {
  id: "state-and-types-primer",
  title: b(
    "Only now translate the ideas into a small Swift program",
    "İndi fikirləri kiçik Swift proqramına çevir",
  ),
  setup: b(
    "The rule is fixed, the current count changes, and the comparison produces a separate true/false value. Explain those facts before predicting the printed text.",
    "Qayda sabitdir, cari say dəyişir, müqayisə ayrıca doğru/yanlış dəyər yaradır. Çapı proqnozlaşdırmadan əvvəl bu faktı izah et.",
  ),
  code: 'let maximumAttempts: Int = 3\nvar attempts = 0\nattempts += 1\nlet canTryAgain = attempts < maximumAttempts\nlet message = canTryAgain ? "Try again" : "Stop"\nprint(attempts)\nprint(canTryAgain)\nprint(message)\nprint(Array(0..<maximumAttempts))',
  output: b("1\ntrue\nTry again\n[0, 1, 2]", "1\ntrue\nTry again\n[0, 1, 2]"),
  steps: [
    b(
      "maximumAttempts is an explicitly typed Int constant; attempts is inferred as an Int variable.",
      "maximumAttempts açıq tipli Int sabit, attempts inference olunmuş Int dəyişəndir.",
    ),
    b(
      "+= updates the variable; it does not change the maximum constant.",
      "+= dəyişəni yeniləyir, maksimum sabiti dəyişmir.",
    ),
    b(
      "The comparison produces Bool, and the ternary chooses one String value.",
      "Müqayisə Bool yaradır, ternary bir String dəyəri seçir.",
    ),
    b(
      "The half-open range includes 0, 1 and 2, excluding 3.",
      "Half-open range 0, 1, 2 daxil edir, 3-ü xaric edir.",
    ),
  ],
  takeaway: b(
    "The syntax records the reasoning we already established: allowed mutation, fixed types, a condition and an explicit boundary.",
    "Sintaksis əvvəl qurduğumuz düşüncəni yazır: icazəli mutasiya, sabit tip, şərt və açıq sərhəd.",
  ),
};
