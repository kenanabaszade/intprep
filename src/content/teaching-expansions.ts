import { bi as b } from "@/lib/types";
import type { Chapter, TeachingSection } from "./chapter-types";
import {
  swiftBasicsFoundation,
  swiftBasicsPrimerExample,
} from "./swift-basics-foundation";
const optionalFlow: TeachingSection = {
  id: "optional-flow-and-invariants",
  level: "middle",
  title: b(
    "Missing values and early exits: choose a meaning before syntax",
    "Yox dəyər və erkən çıxış: sintaksisdən əvvəl məna seç",
  ),
  paragraphs: [
    b(
      "When a value may be missing, first decide what that means for the operation. If a nickname is absent, a harmless display fallback may be valid. If a required account is absent, the operation may need to stop. if let handles the present-value branch locally; guard let expresses a precondition for the remaining scope and requires the failure branch to leave that scope. guard does not automatically return or recover for you: you choose the exit appropriate to the function.",
      "Dəyər yox ola bilərsə əvvəl əməliyyat üçün mənasını seç. Nickname yoxdursa zərərsiz display fallback uyğun ola bilər. Məcburi hesab yoxdursa əməliyyat dayanmalıdır. if let mövcud dəyər budağını lokal idarə edir; guard let qalan scope üçün precondition bildirir və xəta budağının scope-dan çıxmasını istəyir. guard sənin yerinə avtomatik return/recovery etmir: funksiyaya uyğun çıxışı sən seçirsən.",
    ),
    b(
      "Optional chaining continues an operation only while the required receiver exists and propagates absence otherwise. Force unwrapping asserts that a value exists and traps when the assertion is false. An implicitly unwrapped optional is still optional storage whose value can be used as though present in contexts that need it; that convenience carries the same failure risk when nil is unexpectedly reached. It fits carefully justified initialization boundaries, not a way to suppress uncertainty in arbitrary external data.",
      "Optional chaining lazım olan receiver mövcud olduqca davam edir, əks halda yoxluğu ötürür. Force unwrap dəyərin olduğunu iddia edir, səhvdirsə trap yaradır. Implicitly unwrapped optional yenə optional storage-dır; uyğun kontekstdə mövcud kimi istifadə rahatlığı verir, gözlənilməz nil zamanı eyni risk qalır. Bu, əsaslandırılmış initialization sərhədi üçündür, istənilən xarici data qeyri-müəyyənliyini gizlətmək üçün deyil.",
    ),
  ],
};
const asyncMotivation: TeachingSection = {
  id: "async-design-problem",
  level: "junior",
  title: b(
    "The design problem before the keyword: sequencing work that finishes later",
    "Keyword-dan əvvəl problem: sonra bitən işi ardıcıl qurmaq",
  ),
  paragraphs: [
    b(
      "A feature may need to load data, decode it, apply a decision and then update the interface. With callbacks, each later step must be written inside a completion or coordinated separately. Errors and early exits become harder to follow as several operations are composed. The motivation section of SE-0296 identifies these control-flow problems before introducing async/await. The feature is valuable because it lets asynchronous operations participate in readable control flow, not because typing await makes arbitrary code fast.",
      "Feature data yükləməli, decode etməli, qərar tətbiq etməli və interfeysi yeniləməli ola bilər. Callback-də hər sonrakı addım completion daxilində və ya ayrıca koordinasiya ilə yazılır. Bir neçə əməliyyat birləşəndə error/erkən çıxış çətin izlənir. SE-0296 motivasiya hissəsi async/await-dən əvvəl bu control-flow problemini qoyur. Fayda async işi oxunan axına qoşmaqdır, await yazmaqla istənilən kodu sürətləndirmək deyil.",
    ),
    b(
      "An async function and a concurrent task are different concepts. async permits suspension; a task provides an execution context and lifetime. Calling one async function after another expresses sequencing. Starting structured child tasks expresses overlap. If you cannot describe which work depends on earlier results and which can proceed independently, adding task syntax first will not clarify the design.",
      "Async funksiya ilə concurrent task fərqli anlayışdır. async suspension-a icazə verir; task execution context və lifetime verir. Async funksiyaları bir-bir çağırmaq ardıcıllıqdır. Structured child task başlatmaq üst-üstə işi ifadə edir. Hansı işin əvvəlki nəticədən asılı, hansının müstəqil olduğunu deyə bilmirsənsə əvvəl task sintaksisi əlavə etmək dizaynı aydınlaşdırmır.",
    ),
  ],
};
const actorTradeoff: TeachingSection = {
  id: "why-reentrancy-was-chosen",
  level: "senior",
  title: b(
    "Design discussion: why not lock an actor for an entire async method?",
    "Dizayn müzakirəsi: niyə actor bütün async metod boyunca kilidlənmir?",
  ),
  paragraphs: [
    b(
      "SE-0306 discusses both the benefit and the cost of reentrancy. If an actor could process nothing while awaiting another actor, mutually dependent operations could block each other and unrelated useful work could be delayed. Allowing another operation during suspension removes one source of deadlock and improves scheduling opportunities. It does not mean all possible deadlocks disappear.",
      "SE-0306 reentrancy-nin həm fayda, həm xərcini müzakirə edir. Actor başqa actor-u gözləyərkən heç nə edə bilməsə qarşılıqlı asılı əməliyyat bir-birini saxlaya və əlaqəsiz faydalı iş gecikə bilər. Suspension zamanı başqa əməliyyata icazə bir deadlock mənbəyini çıxarır və scheduling imkanı verir. Bütün mümkün deadlock-un yox olması deyil.",
    ),
    b(
      "The cost is that an invariant established before await might no longer hold afterward. An actor is not promising one unbroken transaction across suspension. That is why a strong explanation moves from “state access is isolated” to “what business condition must I re-check before committing the result?”",
      "Xərc await-dən əvvəl qurulan invariantın sonra pozula bilməsidir. Actor suspension boyunca bir kəsilməz transaction vəd etmir. Güclü izah buna görə “state girişi isolated-dır”dan “nəticəni yazmazdan əvvəl hansı biznes şərtini yenidən yoxlayıram?”a keçir.",
    ),
  ],
};
export function addTheoryFirstExpansion(c: Chapter): Chapter {
  if (c.topicId === "topic-01")
    return {
      ...c,
      prerequisiteNote: b(
        "Start here with no previous Swift knowledge. First learn what values, names, types and changes mean. The code examples come after the explanations.",
        "Əvvəlki Swift biliyi olmadan buradan başla. Əvvəl dəyər, ad, tip və dəyişmənin mənasını öyrən. Kod nümunələri izahdan sonra gəlir.",
      ),
      objectives: [
        b(
          "Explain values, let/var, types, inference and operators in plain language.",
          "Dəyər, let/var, tip, inference və operatoru sadə dillə izah et.",
        ),
        b(
          "Distinguish scope from lifetime and Void from Never.",
          "Scope-u lifetime-dan, Void-u Never-dən ayır.",
        ),
        ...c.objectives,
      ],
      sections: [
        ...swiftBasicsFoundation.slice(0, 5),
        c.sections[0],
        ...swiftBasicsFoundation.slice(5),
        optionalFlow,
        ...c.sections.slice(1),
      ],
      examples: [swiftBasicsPrimerExample, ...c.examples],
    };
  if (c.topicId === "topic-12")
    return {
      ...c,
      sections: [asyncMotivation, ...c.sections, actorTradeoff],
      interviews: [
        ...c.interviews,
        {
          id: "structured-timeout-lifetime",
          level: "senior",
          question: b(
            "A task-group timeout fired. Why might the scope still be waiting?",
            "Task-group timeout işlədi. Scope niyə hələ gözləyə bilər?",
          ),
          why: b(
            "It tests the difference between requesting cancellation and completing child tasks.",
            "Cancellation istəməklə child task-ın bitməsini ayırır.",
          ),
          answer: b(
            "A structured scope cannot simply abandon unfinished children when it exits. Cancelling the losing task is a cooperative request; if the operation does not respond or terminate, the group can still wait for it. A timeout wrapper needs an operation with suitable cancellation/termination behavior. It is not enough to race a timer and assume the resource vanished.",
            "Structured scope çıxarkən bitməmiş child-ı sadəcə tərk edə bilməz. Uduzan task-ı cancel etmək cooperative istəkdir; əməliyyat cavab vermir/bitmirsə group yenə onu gözləyə bilər. Timeout wrapper uyğun cancellation/termination davranışlı əməliyyat istəyir. Taymer yarışı qurub resurs yox oldu fərz etmək yetmir.",
          ),
          wrong: b(
            "“The first child finished, so all other work is immediately destroyed” ignores structured lifetime and cooperative cancellation.",
            "“İlk child bitdi, qalan iş dərhal məhv oldu” structured lifetime/cooperative cancellation-u görmür.",
          ),
          followup: b(
            "What would you verify in the transport or stream adapter?",
            "Transport/stream adapter-də nəyi yoxlayardın?",
          ),
          followupAnswer: b(
            "That cancellation reaches the actual operation, terminates owned producers and eventually resolves the waiting task on every completion path.",
            "Cancellation-un real əməliyyata çatmasını, owned producer-i bitirməsini və hər completion yolunda gözləyən task-ı sonlandırmasını.",
          ),
        },
      ],
    };
  return c;
}
