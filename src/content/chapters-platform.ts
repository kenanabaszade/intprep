import { bi as b } from "@/lib/types";
import type { Chapter } from "./chapter-types";
export const platformChapters: Chapter[] = [
  {
    topicId: "topic-13",
    prerequisiteNote: b(
      "Know Swift classes, properties and functions. Start by separating what an interface is from how a framework draws it; no previous UIKit API knowledge is assumed.",
      "Swift class, property və funksiyanı bil. İnterfeysin nə olduğu ilə framework-ün onu necə göstərdiyini ayırmaqdan başla; əvvəlki UIKit API biliyi tələb olunmur.",
    ),
    objectives: [
      b(
        "Explain how a UIKit screen is assembled before writing one.",
        "UIKit ekranını yazmazdan əvvəl necə qurulduğunu izah et.",
      ),
      b(
        "Separate view loading, appearance, layout and event handling.",
        "View loading, görünmə, layout və event handling-i ayır.",
      ),
      b(
        "Choose lifecycle boundaries without duplicating work or leaking ownership.",
        "İşi təkrarlamadan və ownership-i sızdırmadan lifecycle sərhədi seç.",
      ),
    ],
    sections: [
      {
        id: "uikit-what-is-ui",
        level: "junior",
        title: b(
          "What is UIKit, and what problem does a UI framework solve?",
          "UIKit nədir və UI framework hansı problemi həll edir?",
        ),
        paragraphs: [
          b(
            "An interface is the part of the application a person can see and interact with: text, buttons, lists, fields and navigation. Displaying a button is only part of the job. The application also needs to find where a touch landed, react to keyboard input, adapt to screen sizes, expose meaning to VoiceOver and coordinate transitions. A UI framework supplies reusable objects and lifecycle rules for these tasks so each application does not rebuild them from raw pixels.",
            "İnterfeys tətbiqin insanın gördüyü və işlədiyi hissəsidir: mətn, düymə, siyahı, field və naviqasiya. Düyməni göstərmək işin bir hissəsidir. Tətbiq toxunuşun yerini tapmalı, klaviaturaya reaksiya verməli, ekran ölçüsünə uyğunlaşmalı, VoiceOver-a məna ötürməli və keçidi idarə etməlidir. UI framework bu işlər üçün təkrar istifadə olunan obyekt və lifecycle qaydası verir ki hər app hər şeyi pikseldən qurmasın.",
          ),
          b(
            "UIKit is Apple’s object-based interface framework. You create and configure objects representing views and controllers, then update them as application state changes. This is commonly called imperative UI: your code tells existing UI objects what to change. That does not mean every drawing operation is immediate, or that the controller should own all business logic. UIKit schedules rendering and provides boundaries; your architecture still decides responsibilities.",
            "UIKit Apple-ın obyekt əsaslı interfeys framework-üdür. View/controller obyektini yaradıb konfiqurasiya edir, tətbiq state-i dəyişəndə yeniləyirsən. Buna adətən imperative UI deyilir: kod mövcud UI obyektinə nəyi dəyişməyi bildirir. Hər çəkmə əməli dərhal olmur və controller bütün biznesə sahib olmalı deyil. UIKit rendering-i planlayır və sərhəd verir; arxitektura yenə məsuliyyəti seçir.",
          ),
        ],
        analogy: b(
          "UIKit supplies the stage, reusable props and event machinery. Your screen coordinates how those pieces express the current application state.",
          "UIKit səhnə, təkrar istifadə olunan element və event mexanizmini verir. Ekranın onların cari app state-ini necə ifadə etdiyini koordinasiya edir.",
        ),
      },
      {
        id: "uikit-view-tree",
        level: "junior",
        title: b(
          "UIView and the hierarchy: a screen is a tree",
          "UIView və hierarchy: ekran bir ağacdır",
        ),
        paragraphs: [
          b(
            "A UIView represents a region of the interface. It has geometry, visual properties and relationships to a parent and children. A label and a button are specialized views. A controller’s root view can contain a stack, which contains labels and buttons. This parent/child structure is the view hierarchy. It affects coordinates, clipping, visibility, layout and the route used to find a touch target.",
            "UIView interfeysin bir sahəsini təmsil edir. Geometry, vizual property və parent/child əlaqələri var. Label və button xüsusi view-lardır. Controller-in root view-u stack, stack isə label/button saxlaya bilər. Bu parent/child quruluş view hierarchy-dir. Koordinat, clipping, görünmə, layout və toxunuş hədəfini tapmağa təsir edir.",
          ),
          b(
            "A view’s frame describes its rectangle in its superview’s coordinates; bounds describes its own coordinate space. They are related but not interchangeable, especially when transforms or scrolling are involved. A UIWindow hosts a view hierarchy for a scene. UIApplication is the process-level application object; UIScene represents a UI session. A modern application can have more than one scene, so “the app is active” and “this screen’s scene is active” are not always the same lifecycle question.",
            "Frame view-un superview koordinatındakı düzbucağını, bounds öz koordinat sahəsini ifadə edir. Xüsusən transform/scroll olduqda əlaqəli, amma əvəzolunan deyil. UIWindow scene üçün view hierarchy host edir. UIApplication process səviyyəli tətbiq obyektidir; UIScene UI sessiyasıdır. Müasir app-də bir neçə scene ola bilər; “app aktivdir” və “bu ekranın scene-i aktivdir” həmişə eyni lifecycle sualı deyil.",
          ),
        ],
      },
      {
        id: "uikit-controller-lifecycle",
        level: "junior",
        title: b(
          "What a view controller owns, and why callbacks exist",
          "View controller nəyə sahibdir və callback niyə var",
        ),
        paragraphs: [
          b(
            "A UIViewController manages a view hierarchy and participates in presentation, containment and lifecycle coordination. UIKit may need to load its view before that view is visible. loadView is the creation/loading boundary for the root hierarchy; viewDidLoad is the place for setup after that loading completes. “Loaded” means the hierarchy exists, not that the user can currently see it.",
            "UIViewController view hierarchy-ni idarə edir və presentation, containment, lifecycle koordinasiyasında iştirak edir. UIKit view görünməzdən əvvəl onu yükləyə bilər. loadView root hierarchy yaradılma/yüklənmə sərhədidir; viewDidLoad yükləmədən sonrakı qurulma yeridir. “Yüklənib” hierarchy-nin mövcudluğudur, istifadəçinin onu indi görməsi deyil.",
          ),
          b(
            "Appearance callbacks describe becoming visible or disappearing: viewWillAppear precedes appearance, viewDidAppear follows it, and viewWillDisappear precedes disappearance and viewDidDisappear follows it. Transitions can be cancelled; do not assume one universal callback sequence for every presentation context. They can repeat when navigating away and back. Layout callbacks such as viewDidLayoutSubviews can run many times because size, constraints or content change. Therefore setup, activation and layout are different responsibilities. A request started blindly from every layout pass can duplicate work.",
            "Görünmə callback-i görünmə/itməni bildirir: viewWillAppear görünmədən əvvəl, viewDidAppear sonra gəlir, viewWillDisappear çıxışdan əvvəl, viewDidDisappear sonra gəlir. Keçid ləğv oluna bilər; hər presentation konteksti üçün universal callback ardıcıllığı fərz etmə. Gedib qayıdanda təkrarlana bilər. viewDidLayoutSubviews kimi layout callback ölçü, constraint və content dəyişdikcə çox işləyə bilər. Ona görə setup, aktivləşmə və layout ayrı məsuliyyətdir. Hər layout-da kor sorğu işi təkrarlayır.",
          ),
        ],
      },
      {
        id: "uikit-events",
        level: "middle",
        title: b(
          "How a touch becomes an action",
          "Toxunuş necə action-a çevrilir",
        ),
        paragraphs: [
          b(
            "Hit testing asks which eligible view in the hierarchy should receive a touch at a location. Visibility, interaction settings, containment and geometry all matter; a view can be visible yet fail to receive touches for several reasons. The responder chain is a different mechanism: responders can pass handling along a chain when appropriate. Finding the initial target and deciding who can handle an event are related but separate questions.",
            "Hit testing hierarchy-də nöqtədəki toxunuşu hansı uyğun view-un alacağını soruşur. Görünmə, interaction ayarı, containment və geometry vacibdir; view görünsə də müxtəlif səbəblə touch almaya bilər. Responder chain ayrı mexanizmdir: responder uyğun olduqda handling-i zəncirdə ötürür. İlk hədəfi tapmaqla event-i kimin idarə etməsi bağlı, amma ayrı sualdır.",
          ),
          b(
            "Target-action connects a control event, such as a button press, to behavior. Delegation lets another object answer questions or receive events through a contract. Gesture recognizers interpret touch sequences into actions such as tap or pan. Choose the mechanism matching the interaction; none of them grants permission to perform an expensive synchronous operation on the UI thread.",
            "Target-action button basılması kimi control event-i davranışa bağlayır. Delegation başqa obyektə müqavilə ilə sual cavablamaq/event almaq imkanı verir. Gesture recognizer touch ardıcıllığını tap/pan kimi action-a çevirir. Qarşılıqlı əlaqəyə uyğun mexanizm seç; heç biri UI thread-də bahalı sinxron işə icazə səbəbi deyil.",
          ),
        ],
      },
      {
        id: "uikit-scroll-adaptation",
        level: "middle",
        title: b(
          "Scrolling, keyboards and safe areas are layout requirements",
          "Scroll, klaviatura və safe area layout tələbidir",
        ),
        paragraphs: [
          b(
            "A scroll view has a viewport and content that may extend beyond it. Scrolling changes which part of that content is visible; it does not make missing layout information appear. Keyboard presentation can reduce usable space, especially in forms. The feature must keep relevant controls reachable and account for safe areas instead of hard-coding one device’s top and bottom offsets.",
            "Scroll view görünən sahə və ondan böyük ola bilən content saxlayır. Scroll content-in görünən hissəsini dəyişir; çatışmayan layout məlumatını yaratmır. Xüsusən formda klaviatura faydalı sahəni azaldır. Feature uyğun control-u əlçatan saxlamalı, bir cihazın üst/alt offset-ini hard-code etmək əvəzinə safe area nəzərə almalıdır.",
          ),
          b(
            "Trait information describes aspects of the current environment that can affect presentation, while semantic system colors support appearances such as Dark Mode. Dynamic Type means the person can request different text sizes; fixed-height labels can become unusable even when they look correct on your phone. Accessibility also requires meaningful labels, actions and focus behavior. These are functional requirements of the screen, not a final decorative pass.",
            "Trait məlumatı mühitin təqdimata təsir edən tərəfini bildirir, semantik system rəngləri Dark Mode kimi görünüşü dəstəkləyir. Dynamic Type insanın başqa mətn ölçüsü istəməsidir; telefonda düzgün görünən sabit hündür label yararsız ola bilər. Accessibility mənalı label/action/focus da istəyir. Bunlar ekranın funksional tələbidir, sonda dekorativ keçid deyil.",
          ),
        ],
      },
      {
        id: "uikit-production-ownership",
        level: "senior",
        title: b(
          "Use lifecycle as a contract, not as a dumping ground",
          "Lifecycle-ı yığılma yeri deyil, müqavilə kimi istifadə et",
        ),
        paragraphs: [
          b(
            "Choose when work begins, when existing data is fresh enough and which owner stops obsolete work. A screen reappearing is not automatically a reason to reload everything; a hidden screen is not necessarily deallocated. Keep construction side effects, request replacement, navigation and subscription cleanup explicit so tests can exercise them without reproducing every UI transition.",
            "İşin başlama vaxtını, mövcud datanın yetərincə aktuallığını və köhnə işi kimin dayandırdığını seç. Ekranın qayıtması hər şeyi yeniləməyə avtomatik səbəb deyil; gizli ekran mütləq silinmir. Qurulma side effect-i, request əvəzlənməsi, navigation və subscription cleanup açıq olsun ki test hər UI keçidini təkrarlamadan yoxlasın.",
          ),
          b(
            "The historical objc.io discussion of lighter view controllers recommends separating responsibilities such as data-source behavior and model policy. The enduring lesson is change isolation and testability, not copying its old Objective-C syntax or treating one 2013 architecture as mandatory today. Apple’s current framework documentation remains the reference for API contracts; the archive is explicitly historical background.",
            "Tarixi objc.io lighter view controller yazısı data-source davranışı və model qaydası kimi məsuliyyəti ayırmağı müzakirə edir. Qalıcı dərs köhnə Objective-C sintaksisini kopyalamaq və ya 2013 arxitekturasını məcburi saymaq deyil, dəyişmə izolyasiyası və testability-dir. Cari API müqaviləsində Apple sənədi əsas istinaddır; arxiv açıq şəkildə tarixi kontekstdir.",
          ),
        ],
      },
    ],
    examples: [
      {
        id: "uikit-first-screen",
        title: b(
          "Apply the model: configure a small screen once its view loads",
          "Modeli tətbiq et: view yüklənəndən sonra kiçik ekran qur",
        ),
        setup: b(
          "Apple SDK required. We now use a controller for setup and a label view for presentation. The first code follows the conceptual explanation above.",
          "Apple SDK tələb olunur. İndi setup üçün controller, təqdimat üçün label istifadə edirik. İlk kod yuxarıdakı konseptual izahdan sonra gəlir.",
        ),
        code: 'import UIKit\nfinal class WelcomeController: UIViewController {\n    override func viewDidLoad() {\n        super.viewDidLoad()\n        view.backgroundColor = .systemBackground\n        let label = UILabel()\n        label.text = "Welcome"\n        label.font = .preferredFont(forTextStyle: .title1)\n        label.adjustsFontForContentSizeCategory = true\n        label.translatesAutoresizingMaskIntoConstraints = false\n        view.addSubview(label)\n        NSLayoutConstraint.activate([\n            label.leadingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.leadingAnchor, constant: 20),\n            label.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -20),\n            label.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 24)\n        ])\n    }\n}',
        output: b(
          "UI example: a semantic-background screen with a Dynamic Type title aligned to its safe area. No console output; this website does not run an Apple SDK.",
          "UI nümunəsi: semantik fonlu, safe area-ya bağlanan Dynamic Type başlıq. Konsol çıxışı yoxdur; sayt Apple SDK icra etmir.",
        ),
        steps: [
          b(
            "UIKit has loaded the root view before this setup callback runs.",
            "Setup callback-dən əvvəl UIKit root view-u yükləyib.",
          ),
          b(
            "The label joins the hierarchy as a child of the controller’s view.",
            "Label controller view-unun child-ı kimi hierarchy-yə qoşulur.",
          ),
          b(
            "Constraints express relationships rather than one fixed phone’s frame.",
            "Constraint bir telefonun sabit frame-i deyil, əlaqə ifadə edir.",
          ),
          b(
            "Appearance and layout can happen later or repeat without rebuilding this label in every callback.",
            "Görünmə/layout sonra ola və ya hər callback-də label-i yenidən qurmadan təkrarlana bilər.",
          ),
        ],
        takeaway: b(
          "The code assigns responsibilities we already understood: setup, hierarchy, adaptive sizing and layout.",
          "Kod əvvəl anladığımız məsuliyyəti bölür: setup, hierarchy, adaptiv ölçü və layout.",
        ),
      },
    ],
    debug: {
      title: b(
        "A layout callback accidentally creates duplicate UI",
        "Layout callback səhvən təkrar UI yaradır",
      ),
      broken:
        "override func viewDidLayoutSubviews() {\n    super.viewDidLayoutSubviews()\n    view.addSubview(UILabel())\n    // Every layout pass adds another label.\n}",
      failure: b(
        "Layout is repeatable. This code treats repeated layout as one-time construction, growing the hierarchy and potentially repeating expensive work.",
        "Layout təkrarlanır. Kod təkrarlanan layout-u birdəfəlik qurulma sayıb hierarchy-ni böyüdür və bahalı işi təkrarlaya bilər.",
      ),
      fixed:
        "private let titleLabel = UILabel()\noverride func viewDidLoad() {\n    super.viewDidLoad()\n    view.addSubview(titleLabel)\n    // Configure constraints once; update content through explicit rendering.\n}",
      why: b(
        "Construction has a clear boundary. Dynamic layout decisions may still belong in layout callbacks, but adding the same logical control repeatedly does not.",
        "Qurulmanın aydın sərhədi var. Dinamik layout qərarı callback-də qala bilər, eyni məntiqi control-u təkrar əlavə etmək yox.",
      ),
      test: b(
        "Trigger several layout passes and assert the number of logical controls stays constant. Test content updates separately from hierarchy construction.",
        "Bir neçə layout keçidi başlat, məntiqi control sayının sabit qalmasını yoxla. Content update-i hierarchy qurulmasından ayrı test et.",
      ),
    },
    interviews: [
      {
        id: "loaded-visible",
        level: "junior",
        question: b(
          "What is the difference between viewDidLoad and viewWillAppear?",
          "viewDidLoad və viewWillAppear fərqi nədir?",
        ),
        why: b(
          "It tests loading versus visibility and repeated activation.",
          "Yüklənmə, görünmə və təkrar aktivləşməni yoxlayır.",
        ),
        answer: b(
          "viewDidLoad follows loading of the controller’s view hierarchy and suits setup associated with that load. viewWillAppear participates in an appearance transition and can run again when the screen returns. I choose reloading based on freshness and lifecycle policy, not because an appearance callback exists.",
          "viewDidLoad controller hierarchy-si yüklənəndən sonra gəlir və həmin yükləmənin setup-ına uyğundur. viewWillAppear görünmə keçidindədir və ekran qayıdanda yenə işləyə bilər. Refresh-i callback var deyə deyil, aktuallıq/lifecycle siyasətinə görə seçirəm.",
        ),
        wrong: b(
          "“viewDidLoad runs every time the user sees the screen” confuses loading with appearance.",
          "“İstifadəçi hər görəndə viewDidLoad işləyir” loading-i appearance-la qarışdırır.",
        ),
        followup: b(
          "Should a layout callback start a network request?",
          "Layout callback network sorğusu başlatmalıdırmı?",
        ),
        followupAnswer: b(
          "Not as an unguarded side effect of layout. It may run many times; define an intentional activation or data-loading action.",
          "Layout-un qorunmayan side effect-i kimi yox. Çox işləyə bilər; məqsədli activation/data-loading action qur.",
        ),
      },
      {
        id: "hit-responder",
        level: "middle",
        question: b(
          "How do hit testing and the responder chain differ?",
          "Hit testing və responder chain necə fərqlənir?",
        ),
        why: b(
          "It tests event routing rather than a memorized list of UIKit classes.",
          "UIKit class siyahısını deyil, event yönləndirməsini yoxlayır.",
        ),
        answer: b(
          "Hit testing identifies the eligible view for a touch location in the hierarchy. The responder chain provides a route through responders for event/action handling. A debugging investigation checks interaction flags, geometry and overlay views before assuming the action connection is broken.",
          "Hit testing hierarchy-də touch nöqtəsi üçün uyğun view seçir. Responder chain event/action handling üçün responder yolu verir. Sazlamada action əlaqəsini pozulmuş saymazdan əvvəl interaction flag, geometry və overlay view yoxlanır.",
        ),
        wrong: b(
          "“Visible means tappable” ignores eligibility and hierarchy.",
          "“Görünürsə basılır” uyğunluq və hierarchy-ni nəzərə almır.",
        ),
        followup: b(
          "Why might a transparent overlay matter?",
          "Şəffaf overlay niyə vacib ola bilər?",
        ),
        followupAnswer: b(
          "Visual transparency alone does not define the interaction contract. Inspect whether the overlay participates in hit testing and intercepts the intended touch.",
          "Tək vizual şəffaflıq interaction müqaviləsi deyil. Overlay-in hit testing-də iştirak edib toxunuşu kəsdiyini yoxla.",
        ),
      },
      {
        id: "uikit-own-work",
        level: "senior",
        question: b(
          "How do you keep a controller small without hiding all behavior elsewhere?",
          "Bütün davranışı başqa yerdə gizlətmədən controller-i necə kiçik saxlayırsan?",
        ),
        why: b(
          "It tests responsibility, test seams and observable behavior.",
          "Məsuliyyət, test sərhədi və müşahidə olunan davranışı yoxlayır.",
        ),
        answer: b(
          "Separate responsibilities that vary independently, such as data preparation, transport and routing, while keeping lifecycle coordination explicit. Test state-to-view mapping and activation policy. Extracting methods into another huge owner or silently starting work during construction does not solve the original change and timing risks.",
          "Data preparation, transport və routing kimi müstəqil dəyişən məsuliyyəti ayır, lifecycle koordinasiyasını açıq saxla. State-view mapping və activation qaydasını test et. Metodu başqa nəhəng owner-ə köçürmək və ya construction-da gizli iş başlatmaq ilkin dəyişmə/timing riskini həll etmir.",
        ),
        wrong: b(
          "“Move every method to ViewModel” does not identify who owns each invariant.",
          "“Hər metodu ViewModel-ə köçür” invariant sahibini müəyyən etmir.",
        ),
        followup: b(
          "What would you test before a SwiftUI migration?",
          "SwiftUI migration-dan əvvəl nəyi test edərdin?",
        ),
        followupAnswer: b(
          "State transitions, navigation inputs, failure recovery, task lifetime and accessibility semantics. Preserve these before changing rendering technology.",
          "State keçidi, navigation input, failure recovery, task lifetime və accessibility semantikası. Rendering texnologiyasını dəyişmədən əvvəl bunları qoru.",
        ),
      },
    ],
    exercise: {
      prompt: b(
        "Describe a keyboard-aware profile form before coding it. Assign ownership of setup, local field state, validation, submit work, navigation and VoiceOver labels.",
        "Koddan əvvəl klaviaturaya uyğun profil formunu təsvir et. Setup, lokal field state, validation, submit işi, navigation və VoiceOver label sahibini seç.",
      ),
      hints: [
        b(
          "A lifecycle callback is a timing signal, not a business-policy layer.",
          "Lifecycle callback timing siqnalıdır, biznes siyasəti qatı deyil.",
        ),
        b(
          "The form must remain usable at large text sizes and with the keyboard visible.",
          "Forma böyük mətn və görünən klaviatura ilə işlək qalmalıdır.",
        ),
      ],
      solution:
        "// Design recipe before implementation:\n// Controller: assembles hierarchy and coordinates lifecycle.\n// View/form state: current field values and focus.\n// Validation capability: explicit reusable rules where justified.\n// Submission owner: cancellable operation and visible loading/error state.\n// Router: typed success/cancel destinations.\n// Layout: reachable scroll content, safe area and keyboard policy.\n// Accessibility: meaningful labels, order and error announcements.",
      reasoning: b(
        "The design starts from user behavior and boundaries. The implementation may use a ViewModel or a smaller direct design depending on complexity; the responsibilities do not disappear when a pattern is chosen.",
        "Dizayn user davranışı və sərhəddən başlayır. Mürəkkəbliyə görə ViewModel və ya daha kiçik birbaşa dizayn seçilə bilər; pattern seçiləndə məsuliyyət yox olmur.",
      ),
      checks: [
        b(
          "Repeated appearance/layout does not duplicate the hierarchy or submissions.",
          "Təkrar görünmə/layout hierarchy və submit-i təkrarlamır.",
        ),
        b(
          "Keyboard and large text do not make submit unreachable.",
          "Klaviatura/böyük mətn submit-i əlçatmaz etmir.",
        ),
        b(
          "Failure and accessibility behavior can be tested independently.",
          "Failure/accessibility ayrıca test edilə bilir.",
        ),
      ],
    },
  },
  {
    topicId: "topic-14",
    prerequisiteNote: b(
      "Read the UIKit view hierarchy first. Auto Layout is easier when you can already describe the relationships a layout should preserve in ordinary language.",
      "Əvvəl UIKit view hierarchy-ni oxu. Layout-un saxlamalı olduğu əlaqəni adi dillə deyə biləndə Auto Layout asanlaşır.",
    ),
    objectives: [
      b(
        "Explain constraints, intrinsic size and priorities before using anchors.",
        "Anchor işlətməzdən əvvəl constraint, intrinsic ölçü və priority-ni izah et.",
      ),
      b(
        "Distinguish ambiguous, unsatisfiable and visually wrong but valid layouts.",
        "Ambiguous, unsatisfiable və düzgün həll olunan, amma vizual səhv layout-u ayır.",
      ),
      b(
        "Reason about scrolling and layout timing without trial-and-error constants.",
        "Təsadüfi constant sınağı olmadan scroll/layout timing-i anla.",
      ),
    ],
    sections: [
      {
        id: "layout-why-relations",
        level: "junior",
        title: b(
          "Why relationships are more useful than one phone’s coordinates",
          "Əlaqə niyə bir telefonun koordinatından faydalıdır",
        ),
        paragraphs: [
          b(
            "Imagine placing a title at a fixed horizontal position with a fixed width. It can look correct on one phone and fail when the screen gets narrower, the language becomes longer or the person chooses larger text. The requirement is usually relational: keep the title inside readable margins, allow it to grow vertically and keep the button below it. Auto Layout describes those relationships as constraints and solves for geometry.",
            "Başlığı sabit horizontal mövqe və width-də yerləşdirdiyini düşün. Bir telefonda düzgün, ekran daralanda, tərcümə uzananda və ya mətn böyüyəndə səhv ola bilər. Tələb adətən əlaqədir: başlıq oxunan margin-də qalsın, şaquli böyüsün, düymə altında olsun. Auto Layout bu əlaqəni constraint kimi yazır və geometry həll edir.",
          ),
          b(
            "A constraint can express equality or inequality between dimensions and positions, with a multiplier, constant and priority where appropriate. It is not merely a pixel instruction. You still must define enough independent information to determine a view’s position and size. The solver cannot infer the product requirement you forgot to express.",
            "Constraint mövqe/ölçü arasında bərabərlik və ya bərabərsizlik ifadə edir; uyğun multiplier, constant və priority var. Sadəcə pixel təlimatı deyil. Mövqe/ölçünü müəyyən edəcək qədər müstəqil məlumatı yenə verməlisən. Solver ifadə etmədiyin məhsul tələbini özü bilmir.",
          ),
        ],
        analogy: b(
          "Instead of saying “the shelf begins at coordinate 120,” say “keep the shelf twenty units from both walls.” The second statement can remain useful when the room changes size.",
          "“Rəf 120 koordinatından başlasın” əvəzinə “hər iki divardan iyirmi vahid aralı qalsın” de. Otağın ölçüsü dəyişsə də ikinci tələb faydalı qala bilər.",
        ),
      },
      {
        id: "layout-intrinsic",
        level: "junior",
        title: b(
          "Intrinsic content size is a preference supplied by content",
          "Intrinsic content size məzmunun verdiyi ölçü üstünlüyüdür",
        ),
        paragraphs: [
          b(
            "Some views know a natural size from their content. A label’s text and font suggest a size; a plain UIView usually has no content-driven size of its own. Intrinsic content size contributes information to the layout system, but it is not a command that the view can never grow or shrink. Other relationships and priorities can require a different result.",
            "Bəzi view məzmunundan təbii ölçü bilir. Label-in mətn/font-u ölçü təklif edir; adi UIView adətən öz content-driven ölçüsünü bilmir. Intrinsic content size layout-a məlumat verir, amma view heç böyüyüb-kiçilə bilməz əmri deyil. Başqa əlaqə/priority fərqli nəticə tələb edə bilər.",
          ),
          b(
            "Content hugging resists growing beyond the intrinsic size; compression resistance resists becoming smaller. They answer opposite questions. If an amount label and description share a narrow row, stronger compression resistance can protect the amount from truncating before an optional description. If the layout must support very large text, changing the arrangement may be better than endlessly raising priorities.",
            "Content hugging intrinsic ölçüdən böyüməyə, compression resistance kiçilməyə müqavimətdir. Əks sualı cavablayırlar. Məbləğ və təsvir dar sətirdədirsə güclü compression resistance məbləği optional təsvirdən əvvəl kəsilməkdən qoruya bilər. Çox böyük mətn lazımdırsa priority-ni sonsuz artırmaqdan çox düzülüşü dəyişmək yaxşı ola bilər.",
          ),
        ],
      },
      {
        id: "layout-priority-failure",
        level: "middle",
        title: b(
          "Priorities explain which wish can yield",
          "Priority hansı istəyin güzəşt etdiyini göstərir",
        ),
        paragraphs: [
          b(
            "Required constraints are hard requirements. Optional priorities express which preferences may yield when all wishes cannot be satisfied. Raising every priority to required can make a layout contradictory. Lowering random priorities until warnings disappear can produce a mathematically valid layout that violates the design. Name the intended fallback first, then assign priority to encode it.",
            "Required constraint sərt tələbdir. Optional priority bütün istək ödənməyəndə hansının güzəşt edə biləcəyini bildirir. Hamısını required etmək ziddiyyət yarada bilər. Warning getsin deyə təsadüfi azaltmaq riyazi düzgün, dizayn baxımından səhv nəticə verə bilər. Əvvəl fallback-i adlandır, sonra priority ilə ifadə et.",
          ),
          b(
            "An ambiguous layout has more than one permitted solution because information is missing. An unsatisfiable layout contains incompatible requirements. A third category is logically wrong layout: the constraints have a unique valid solution, but you described the wrong relationships. The debugging approach differs: add missing information, remove/adjust conflicts, or correct the requirement itself.",
            "Ambiguous layout-da məlumat çatmadığı üçün birdən çox həll var. Unsatisfiable layout-da tələblər ziddir. Üçüncü hal məntiqi səhv layout-dur: unikal düzgün həll var, amma səhv əlaqə yazmısan. Sazlama fərqlidir: məlumat əlavə et, konflikti düzəlt və ya tələbin özünü dəyiş.",
          ),
        ],
      },
      {
        id: "layout-scroll-guides",
        level: "middle",
        title: b(
          "A scroll view needs a defined content extent",
          "Scroll view müəyyən content ölçüsü istəyir",
        ),
        paragraphs: [
          b(
            "A scroll view shows a viewport onto content. The frame layout guide describes the viewport; the content layout guide describes the scrollable content area. For a vertically scrolling form, you commonly define the content’s width relative to the viewport and an unbroken vertical chain from the top to the bottom of content. Without that chain, the system may not know how tall the content should be.",
            "Scroll view content-in görünən pəncərəsidir. Frame layout guide viewport-u, content layout guide scroll olunan sahəni təsvir edir. Şaquli formda adətən content width viewport-a bağlanır, content-in üstündən altına kəsilməz şaquli əlaqə qurulur. O əlaqə yoxdursa sistem content hündürlüyünü bilməyə bilər.",
          ),
          b(
            "A stack view arranges its children according to its configuration; it is not a substitute for giving the containing scroll view the needed boundaries. Self-sizing cells similarly require coherent constraints and content. Keyboard changes, safe areas and content insets affect usability and must follow a deliberate policy instead of a fixed height copied from a screenshot.",
            "Stack view child-ları konfiqurasiyasına görə düzür; ətraf scroll view-a sərhəd verməyin əvəzi deyil. Self-sizing cell də uyğun constraint/content istəyir. Keyboard, safe area və content inset usability-yə təsir edir, screenshot-dan sabit height kopyası deyil, məqsədli qayda istəyir.",
          ),
        ],
      },
      {
        id: "layout-pass-timing",
        level: "senior",
        title: b(
          "Layout requests are not all immediate drawing operations",
          "Layout istəklərinin hamısı dərhal çəkmə deyil",
        ),
        paragraphs: [
          b(
            "Changing content or constraints can schedule future layout work. setNeedsLayout marks the view as needing layout; layoutIfNeeded performs pending layout in the relevant subtree before continuing. Drawing/display is a related but separate concern. If the next step relies on current geometry, understand which subtree needs updating rather than calling layout methods repeatedly everywhere.",
            "Content/constraint dəyişməsi gələcək layout işini planlaya bilər. setNeedsLayout view-u layout ehtiyacı kimi işarələyir; layoutIfNeeded davam etmədən uyğun subtree-də pending layout edir. Drawing/display bağlı, amma ayrı məsələdir. Növbəti addım cari geometry istəyirsə hər yerdə təkrar çağırmaq əvəzinə hansı subtree-ni yeniləməli olduğunu anla.",
          ),
          b(
            "The objc.io archive explains the distinction between constraint updates, layout and display, but its 2013 Objective-C/Xcode examples are historical. Use the conceptual separation, then check modern Apple APIs and OS assumptions. Profile repeated layout work under realistic content sizes before claiming that one constraint strategy is faster.",
            "objc.io arxivi constraint update, layout və display fərqini izah edir, amma 2013 Objective-C/Xcode nümunələri tarixidir. Konseptual fərqi götür, sonra müasir Apple API/OS fərziyyəsini yoxla. Bir strategiyanın sürətli olduğunu demədən real content ölçüsündə təkrar layout işini ölç.",
          ),
        ],
      },
    ],
    examples: [
      {
        id: "layout-relational-label",
        title: b(
          "Encode the relationships we just described",
          "İndi təsvir etdiyimiz əlaqələri kodlaşdır",
        ),
        setup: b(
          "Apple SDK required. The title may use multiple lines; its edges follow the safe area rather than a fixed screen width.",
          "Apple SDK tələb olunur. Başlıq bir neçə sətir ola bilər; kənarları sabit ekran width deyil, safe area izləyir.",
        ),
        code: 'import UIKit\nlet container = UIView()\nlet title = UILabel()\ntitle.text = "A title that can grow with larger text"\ntitle.numberOfLines = 0\ntitle.font = .preferredFont(forTextStyle: .title2)\ntitle.adjustsFontForContentSizeCategory = true\ntitle.translatesAutoresizingMaskIntoConstraints = false\ncontainer.addSubview(title)\nNSLayoutConstraint.activate([\n    title.leadingAnchor.constraint(equalTo: container.safeAreaLayoutGuide.leadingAnchor, constant: 20),\n    title.trailingAnchor.constraint(equalTo: container.safeAreaLayoutGuide.trailingAnchor, constant: -20),\n    title.topAnchor.constraint(equalTo: container.safeAreaLayoutGuide.topAnchor, constant: 20)\n])\n// A real parent supplies container geometry. Title height follows its content.',
        output: b(
          "No console output. Once the container has geometry, the label width follows the available safe-area width; text and font contribute the height.",
          "Konsol çıxışı yoxdur. Container geometry alanda label width safe-area width-ini izləyir; mətn/font hündürlüyə məlumat verir.",
        ),
        steps: [
          b(
            "The parent must establish the container’s geometry.",
            "Parent container geometry-sini qurmalıdır.",
          ),
          b(
            "Disabling autoresizing-mask translation avoids unwanted generated constraints for this programmatic view.",
            "Autoresizing-mask translation söndürülərək bu programmatic view üçün istənməyən generated constraint önlənir.",
          ),
          b(
            "Leading/trailing relationships determine available width, which influences multiline text height.",
            "Leading/trailing əlaqəsi mövcud width-i, o isə çoxsətirli mətn hündürlüyünü müəyyənləşdirməyə kömək edir.",
          ),
          b(
            "We did not force the title to one screenshot’s height.",
            "Başlığı bir screenshot hündürlüyünə məcbur etmədik.",
          ),
        ],
        takeaway: b(
          "Constraints express requirements; content supplies some of the remaining size information.",
          "Constraint tələb ifadə edir; qalan ölçü məlumatının bir hissəsini content verir.",
        ),
      },
    ],
    debug: {
      title: b("Two incompatible required widths", "İki zidd required width"),
      broken:
        "NSLayoutConstraint.activate([\n    title.widthAnchor.constraint(equalToConstant: 100),\n    title.widthAnchor.constraint(equalToConstant: 200)\n])",
      failure: b(
        "The same width cannot be both 100 and 200 at the same time. This is a conflicting system, not missing information.",
        "Eyni width eyni vaxtda həm 100, həm 200 ola bilməz. Bu çatışmayan məlumat deyil, konfliktli sistemdir.",
      ),
      fixed:
        "let preferred = title.widthAnchor.constraint(equalToConstant: 200)\npreferred.priority = .defaultHigh\nNSLayoutConstraint.activate([\n    title.widthAnchor.constraint(lessThanOrEqualToConstant: 240),\n    preferred\n])\n// The complete parent layout must still supply the other needed relationships.",
      why: b(
        "This expresses a preferred width with a maximum, rather than two contradictory equalities. It is only appropriate if that fallback matches the product requirement; the rest of the layout still needs a complete solution.",
        "İki zidd bərabərlik əvəzinə maksimumla üstün width ifadə edir. Yalnız fallback məhsula uyğundursa düzgündür; qalan layout yenə tam həll istəyir.",
      ),
      test: b(
        "Test narrow and wide containers, long translations and large text. Confirm both absence of conflicts and the intended visible fallback.",
        "Dar/geniş container, uzun tərcümə və böyük mətn test et. Həm konflikt yoxluğunu, həm məqsədli fallback-i yoxla.",
      ),
    },
    interviews: [
      {
        id: "hugging-compression",
        level: "junior",
        question: b(
          "Hugging versus compression resistance: what is each resisting?",
          "Hugging və compression resistance nəyə müqavimət göstərir?",
        ),
        why: b(
          "It checks a usable mental model instead of memorized priority numbers.",
          "Əzbər priority rəqəmi deyil, işlək düşüncə modeli yoxlayır.",
        ),
        answer: b(
          "Hugging resists growing beyond intrinsic content size; compression resistance resists shrinking below it. They are preferences that participate in the constraint system. For a narrow row I decide which content may grow or truncate, then encode that choice with priorities and an accessible fallback layout.",
          "Hugging intrinsic ölçüdən böyüməyə, compression resistance aşağı düşməyə müqavimətdir. Constraint sistemində iştirak edən üstünlüklərdir. Dar sətirdə hansı content böyüyə/kəsilə bilər seçib priority və accessible fallback ilə yazıram.",
        ),
        wrong: b(
          "“Higher hugging prevents text truncation” confuses resistance to expansion with resistance to compression.",
          "“Yüksək hugging mətn kəsilməsini önləyir” böyüməyə və sıxılmaya müqaviməti qarışdırır.",
        ),
        followup: b(
          "Does every UIView have an intrinsic width?",
          "Hər UIView intrinsic width bilirmi?",
        ),
        followupAnswer: b(
          "No. A plain container may need explicit relationships to determine its size.",
          "Xeyr. Adi container ölçü üçün açıq əlaqə istəyə bilər.",
        ),
      },
      {
        id: "layout-debug-types",
        level: "middle",
        question: b(
          "How do you distinguish ambiguous and unsatisfiable layouts?",
          "Ambiguous və unsatisfiable layout-u necə ayırırsan?",
        ),
        why: b(
          "It tests whether you diagnose the constraint system before changing priorities.",
          "Priority dəyişmədən constraint sistemini analiz etməyi yoxlayır.",
        ),
        answer: b(
          "Ambiguity means multiple solutions remain; conflict means required relationships cannot all be satisfied. I inspect missing position/size information for the first and contradictory constraints for the second. I also check a third possibility: a uniquely solved layout that simply describes the wrong design.",
          "Ambiguous çox həllin qalmasıdır; conflict bütün required əlaqənin ödənə bilməməsidir. Birincidə çatmayan mövqe/ölçüyə, ikincidə zidd constraint-ə baxıram. Üçüncü ehtimalı da yoxlayıram: unikal həll var, amma səhv dizayn təsvir edilib.",
        ),
        wrong: b(
          "“Just lower a priority until warnings stop” can hide a product error.",
          "“Warning dayanana qədər priority azalt” məhsul xətasını gizlədə bilər.",
        ),
        followup: b(
          "Why can a scroll view fail to scroll?",
          "Scroll view niyə scroll etməyə bilər?",
        ),
        followupAnswer: b(
          "The content may not exceed the viewport, interaction may be configured differently, or content extent may be under-specified. Inspect the intended content/frame-guide relationships rather than assume one universal fix.",
          "Content viewport-dan böyük olmaya, interaction fərqli qurula və ya content extent natamam ola bilər. Universal həll fərz etmək əvəzinə content/frame-guide əlaqəsini yoxla.",
        ),
      },
    ],
    exercise: {
      prompt: b(
        "Design a title-and-button form that remains usable with long Azerbaijani text and accessibility sizes. State the relationships first; then choose constraints and fallback priorities.",
        "Uzun Azərbaycan mətni və accessibility ölçüsü ilə işləyən title/button formu qur. Əvvəl əlaqəni de, sonra constraint/fallback priority seç.",
      ),
      hints: [
        b(
          "Describe which view may grow vertically.",
          "Hansı view-un şaquli böyüməsini təsvir et.",
        ),
        b(
          "The scroll content needs a complete chain to its bottom.",
          "Scroll content altına qədər tam əlaqə istəyir.",
        ),
      ],
      solution:
        "// Relationship recipe before code:\n// Title leading/trailing follow readable margins.\n// Title may wrap and grow vertically.\n// Button follows title with intentional spacing.\n// Button remains reachable when keyboard reduces available space.\n// Scroll content is tied from top through every element to bottom.\n// At extreme text sizes, rearrange instead of hiding essential content.",
      reasoning: b(
        "The relationships define what a valid layout must preserve. Numeric constraints are the implementation of those requirements, not the starting point.",
        "Əlaqə düzgün layout-un nəyi qorumalı olduğunu müəyyən edir. Numeric constraint bu tələbin implementasiyasıdır, başlanğıcı deyil.",
      ),
      checks: [
        b("Long text remains readable.", "Uzun mətn oxunur."),
        b(
          "The submit control stays reachable.",
          "Submit control əlçatan qalır.",
        ),
        b(
          "Conflicts and unintended truncation are both checked.",
          "Həm konflikt, həm istənməyən kəsilmə yoxlanır.",
        ),
      ],
    },
  },
  {
    topicId: "topic-33",
    prerequisiteNote: b(
      "Know Swift structs, properties, closures and the idea of a protocol. You do not need to know UIKit first. Begin with the relationship between changing data and what a person sees.",
      "Swift struct, property, closure və protokol fikrini bil. Əvvəl UIKit bilmək lazım deyil. Dəyişən data ilə insanın gördüyü arasındakı əlaqədən başla.",
    ),
    objectives: [
      b(
        "Explain declarative UI before memorizing property wrappers.",
        "Property wrapper əzbərləmədən declarative UI-ı izah et.",
      ),
      b(
        "Trace an action from state change to a new view description.",
        "Action-u state dəyişməsindən yeni view təsvirinə qədər izlə.",
      ),
      b(
        "Separate identity, ownership, observation and rendering.",
        "Identity, ownership, observation və rendering-i ayır.",
      ),
    ],
    sections: [
      {
        id: "swiftui-problem-first",
        level: "junior",
        title: b(
          "The problem: keeping the interface consistent with changing data",
          "Problem: interfeysi dəyişən data ilə uyğun saxlamaq",
        ),
        paragraphs: [
          b(
            "Consider a screen with a count and an Increment button. When the number changes, the text must change too. In a larger application, loading, errors, selection and navigation also affect what is visible. If each event manually updates several UI objects, it is easy to forget one update and leave the screen inconsistent. The central question is how to describe the interface that corresponds to the current data.",
            "Say və Artır düyməsi olan ekranı düşün. Rəqəm dəyişəndə mətn də dəyişməlidir. Böyük app-də loading, xəta, seçim və navigation da görünüşə təsir edir. Hər event bir neçə UI obyektini əl ilə yeniləsə birini unutmaq və ekranı zidd saxlamaq asandır. Əsas sual cari data-ya uyğun interfeysi necə təsvir etməkdir.",
          ),
          b(
            "SwiftUI uses a declarative approach: describe what the interface should be for its inputs, rather than maintaining every rendered object yourself. A state change can invalidate a relevant description, and the framework evaluates the needed view logic and reconciles the result with the interface. This is a conceptual model, not a promise about one exact internal rendering algorithm or a full redraw after every change.",
            "SwiftUI declarative yanaşır: hər rendered obyekti özün idarə etmək əvəzinə giriş üçün interfeysin necə olmasını təsvir et. State dəyişikliyi uyğun təsviri invalidate edə, framework lazım olan view məntiqini hesablayıb nəticəni interfeyslə uzlaşdıra bilər. Bu konseptual modeldir, bir konkret daxili rendering alqoritmi və hər dəyişikliyə tam redraw vədi deyil.",
          ),
        ],
        analogy: b(
          "A recipe describes the meal you want from the current ingredients. You change the ingredients/state, then obtain the appropriate description again; you do not manually move every pixel.",
          "Resept cari ərzaqdan istədiyin yeməyi təsvir edir. Ərzaq/state dəyişir, uyğun təsvir yenidən alınır; hər pikseli əl ilə daşımırsan.",
        ),
      },
      {
        id: "swiftui-view-body",
        level: "junior",
        title: b(
          "View and body: a value describing an interface",
          "View və body: interfeysi təsvir edən dəyər",
        ),
        paragraphs: [
          b(
            "A type conforming to View supplies a body describing other views. Your views are commonly structs, so think of them as descriptions computed from inputs rather than permanent screen objects. A body is a computed property and can be evaluated repeatedly. Constructing a new view value is not the same as discarding every piece of state or rebuilding every visible platform object.",
            "View protokoluna uyğun tip başqa view-ları təsvir edən body verir. View-lar çox vaxt struct olur; onları daimi ekran obyekti deyil, girişdən hesablanan təsvir kimi düşün. body computed property-dir və təkrar hesablana bilər. Yeni view dəyəri yaratmaq bütün state-i atmaq və bütün görünən platform obyektini yenidən qurmaq deyil.",
          ),
          b(
            "Composition means constructing a larger interface from smaller views. A row can describe an icon and text; a screen can compose many rows and a toolbar. Extract a component when it gives a meaningful responsibility or reusable contract, not only to reduce a line count. Keep expensive work and unintended side effects out of body: the framework controls when description is reevaluated.",
            "Composition kiçik view-dan böyük interfeys qurmaqdır. Row ikon/mətn, screen çox row və toolbar birləşdirə bilər. Komponenti tək sətir azaltmaq üçün deyil, mənalı məsuliyyət/reuse müqaviləsi üçün ayır. Bahalı iş və istənməyən side effect body-də olmasın: framework təsvirin nə vaxt yenidən hesablandığını idarə edir.",
          ),
        ],
      },
      {
        id: "swiftui-state-events",
        level: "junior",
        title: b(
          "State is data the interface depends on",
          "State interfeysin asılı olduğu datadır",
        ),
        paragraphs: [
          b(
            "State is the data that can change while the feature is used: a count, selection, input text or loading outcome. The interface reads that state to decide what to show. A user action changes state, and observation connects relevant changes to view updates. The important starting point is ownership: who is responsible for this data, and which views need to read or edit it?",
            "State feature istifadə edilərkən dəyişən datadır: say, seçim, input mətn və ya loading nəticəsi. İnterfeys nə göstərməyi state-dən oxuyur. User action state-i dəyişir, observation uyğun dəyişikliyi view update-ə bağlayır. Vacib başlanğıc ownership-dir: data üçün kim məsuldur, hansı view oxuyur/redaktə edir?",
          ),
          b(
            "@State stores locally owned state associated with a view’s identity. @Binding connects a child to state owned elsewhere rather than creating a second source of truth. Observable reference models need a lifetime/ownership choice too; the next state-management chapter explains ObservableObject and Observation alternatives. A plain property or arbitrary global mutation is not automatically a tracked input just because a view reads it.",
            "@State view identity-sinə bağlı lokal owner state saxlayır. @Binding ikinci source of truth yaratmadan child-ı başqa owner-in state-inə bağlayır. Observable reference model də lifetime/ownership seçimi istəyir; növbəti state dərsi ObservableObject/Observation alternativini izah edir. View oxuyur deyə adi property və ya istənilən global mutasiya avtomatik tracked input olmur.",
          ),
        ],
      },
      {
        id: "swiftui-layout-modifiers",
        level: "middle",
        title: b(
          "Layout and modifiers describe relationships, not a canvas of fixed pixels",
          "Layout və modifier sabit pixel canvas deyil, əlaqə təsvir edir",
        ),
        paragraphs: [
          b(
            "Containers such as VStack, HStack and ZStack express vertical, horizontal and layered composition. A modifier returns a modified view description; it does not simply edit an existing mutable screen object. Modifier order can affect layout and appearance because each stage wraps a description. Predict the hierarchy of those transformations rather than assuming all modifier orders are interchangeable.",
            "VStack, HStack, ZStack kimi container şaquli, horizontal və qatlı composition bildirir. Modifier dəyişmiş view təsviri qaytarır; sadəcə mövcud mutable ekran obyektini redaktə etmir. Hər mərhələ təsviri əhatə etdiyi üçün modifier sırası layout/görünüşə təsir edə bilər. Bütün sıranı eyni saymaq əvəzinə çevrilmə hierarchy-sini düşün.",
          ),
          b(
            "A ScrollView presents scrollable content; a lazy stack defers some child construction, but neither promises zero rendering or layout cost. A List adds list-specific behavior. Choose based on semantics, interaction and measured workload. Keep text adaptive, avoid fixed dimensions that assume one language, and test Dynamic Type instead of treating the initial preview as proof of usability.",
            "ScrollView scroll olunan content verir; lazy stack child qurulmasının bir hissəsini gecikdirir, amma heç biri sıfır render/layout xərci vəd etmir. List siyahıya aid davranış əlavə edir. Semantika, interaction və ölçülmüş workload-a görə seç. Mətni adaptiv saxla, bir dil fərz edən sabit ölçüdən qaç, ilk preview-u usability sübutu saymadan Dynamic Type test et.",
          ),
        ],
      },
      {
        id: "swiftui-identity-dataflow",
        level: "middle",
        title: b(
          "Identity and data flow explain surprising updates",
          "Identity və data flow təəccüblü update-i izah edir",
        ),
        paragraphs: [
          b(
            "Identity is how the framework relates a view description to the corresponding element over time. ForEach needs stable, unique identities in its data scope. A fresh UUID on every refresh can make an old row look like a new element and reset state associated with the old identity. Conditional branches can also affect structure and continuity. The state-owner chapter examines those effects in detail.",
            "Identity framework-ün view təsvirini zamanla uyğun elementlə əlaqələndirməsidir. ForEach data scope-da sabit unikal identity istəyir. Hər refresh-də yeni UUID köhnə row-u yeni saydırıb əvvəlki identity state-ini sıfırlaya bilər. Conditional branch da struktur/davamlılığa təsir edir. State-owner dərsi bunu ətraflı açır.",
          ),
          b(
            "Environment values pass context down a view tree, such as appearance or locale. Preference mechanisms let descendants communicate certain information toward ancestors. These tools have direction and scope; they are not a reason to hide every dependency in global-looking access. When a view changes unexpectedly, trace the input it reads, the owner that changes it and the identity preserving its storage.",
            "Environment value görünüş/locale kimi konteksti tree boyu aşağı verir. Preference mexanizmi child-dan ancestor-a müəyyən məlumat ötürür. Alətin istiqaməti və scope-u var; hər asılılığı global görünən access-də gizlətmək səbəbi deyil. View gözlənilmədən dəyişirsə oxuduğu input, onu dəyişən owner və storage-ı saxlayan identity-ni izlə.",
          ),
        ],
      },
      {
        id: "swiftui-observation-rationale",
        level: "senior",
        title: b(
          "Why Observation evolved: relevance of changes matters",
          "Observation niyə inkişaf etdi: dəyişikliyin uyğunluğu vacibdir",
        ),
        paragraphs: [
          b(
            "Swift Evolution’s Observation proposal explains limitations of earlier observation systems and the desire to track relevant property access. A view often cares about a subset of a model, not every mutation in the entire object graph. This motivation helps explain why ownership and dependency tracking belong in performance reasoning; it does not prove that a particular screen is slow or prescribe a blanket migration.",
            "Swift Evolution Observation təklifi əvvəlki müşahidə sisteminin məhdudiyyətini və uyğun property access izləmə istəyini açıqlayır. View çox vaxt bütün object graph mutasiyasını deyil, modelin bir hissəsini istəyir. Bu səbəb ownership/dependency tracking-in performans düşüncəsində yerini izah edir; konkret ekranın yavaşlığını sübut və ümumi migration məcbur etmir.",
          ),
          b(
            "Accessibility must express the interface’s meaning, not just its shape. An icon-only control needs a meaningful label; combined content may need useful grouping; hidden financial information should not remain readable through accessibility output. Combine source-based framework understanding with user-centered testing, and distinguish real measurements from an illustrative diagram of updates.",
            "Accessibility interfeysin tək formasını deyil, mənasını ifadə etməlidir. Tək ikon control mənalı label, birləşmiş content faydalı grouping istəyə bilər; gizli maliyyə data-sı accessibility çıxışında oxunmamalıdır. Mənbə əsaslı framework anlayışını user testi ilə birləşdir, real ölçünü illüstrativ update diaqramından ayır.",
          ),
        ],
      },
    ],
    examples: [
      {
        id: "swiftui-first-counter",
        title: b(
          "After the explanation: make a count visible",
          "İzahdan sonra: sayı görünən et",
        ),
        setup: b(
          "Apple SDK required. We already know the owner, state, event and description; the code now names them.",
          "Apple SDK tələb olunur. Owner, state, event və təsviri artıq bilirik; kod indi onları adlandırır.",
        ),
        code: 'import SwiftUI\nstruct CounterScreen: View {\n    @State private var count = 0\n    var body: some View {\n        VStack(spacing: 16) {\n            Text("Count: \\(count)")\n            Button("Increment") { count += 1 }\n        }\n        .padding()\n    }\n}',
        output: b(
          "UI behavior: the initial text describes count 0. Each button action increments state; the UI can then reflect the new count. No console output or runtime execution is performed here.",
          "UI davranışı: ilkin mətn count 0 ifadə edir. Hər button action state artırır, UI yeni sayı göstərə bilir. Burada konsol çıxışı/runtime icrası yoxdur.",
        ),
        steps: [
          b(
            "CounterScreen owns count through @State for its view identity.",
            "CounterScreen öz view identity-si üçün @State ilə count-a sahibdir.",
          ),
          b(
            "body reads count while describing a Text and Button inside a vertical container.",
            "body şaquli container daxilində Text/Button təsvir edərkən count oxuyur.",
          ),
          b(
            "The button action changes count rather than finding and manually updating a label.",
            "Button action label tapıb əl ilə dəyişmək əvəzinə count-u dəyişir.",
          ),
          b(
            "Relevant observation/state machinery makes a new description reflect the new data. Do not infer a full-screen redraw from that statement.",
            "Uyğun observation/state mexanizmi yeni təsviri yeni data ilə uyğunlaşdırır. Bundan bütün ekran redraw nəticəsi çıxarma.",
          ),
        ],
        takeaway: b(
          "Declarative UI is a relationship between state and description, not the absence of events or mutation.",
          "Declarative UI event/mutasiyanın yoxluğu deyil, state və təsvir əlaqəsidir.",
        ),
      },
    ],
    debug: {
      title: b(
        "A view’s ordinary stored variable is not @State storage",
        "View-un adi stored dəyişəni @State storage deyil",
      ),
      broken:
        'struct CounterScreen: View {\n    var count = 0\n    var body: some View {\n        Button("Increment") { count += 1 }\n    }\n}',
      failure: b(
        "The closure cannot mutate an ordinary stored property through immutable self in this view description. More generally, an arbitrary property is not automatically persistent tracked UI state.",
        "Closure bu view təsvirində immutable self üzərindən adi stored property-ni dəyişə bilmir. Ümumiyyətlə istənilən property avtomatik qalıcı tracked UI state deyil.",
      ),
      fixed:
        'struct CounterScreen: View {\n    @State private var count = 0\n    var body: some View {\n        Button("Count: \\(count)") { count += 1 }\n    }\n}',
      why: b(
        "@State associates owned storage with identity and exposes the supported state access used by the action. It is not a command to make every property global or to move all model data into a view.",
        "@State owner storage-ı identity-yə bağlayır və action üçün dəstəklənən state access verir. Hər property-ni global etmək və bütün model datasını view-a köçürmək əmri deyil.",
      ),
      test: b(
        "Increment, trigger ordinary view updates and verify the count persists while identity is stable. Deliberately replace identity and verify any reset matches the intended design.",
        "Artır, adi view update yarat və identity sabitkən count-un qaldığını yoxla. Identity-ni məqsədli əvəz edib reset-in dizayna uyğunluğunu yoxla.",
      ),
    },
    interviews: [
      {
        id: "declarative-meaning",
        level: "junior",
        question: b(
          "What does declarative UI mean in SwiftUI?",
          "SwiftUI-da declarative UI nə deməkdir?",
        ),
        why: b(
          "It checks understanding before memorized wrapper names.",
          "Wrapper adından əvvəl anlayışı yoxlayır.",
        ),
        answer: b(
          "I describe the interface corresponding to the current inputs/state. Actions change state, and the framework manages the relevant update process. I still design ownership, identity and side effects; declarative does not mean no mutation or that every body evaluation redraws the whole screen.",
          "Cari input/state-ə uyğun interfeysi təsvir edirəm. Action state dəyişir, framework uyğun update-i idarə edir. Ownership, identity və side effect-i yenə mən qururam; declarative mutasiya yoxdur və ya hər body bütün ekranı çəkir demək deyil.",
        ),
        wrong: b(
          "“SwiftUI automatically handles every state problem” ignores the application’s ownership decisions.",
          "“SwiftUI bütün state problemini avtomatik həll edir” app ownership qərarını görmür.",
        ),
        followup: b(
          "Why keep side effects out of body?",
          "Side effect body-də niyə olmamalıdır?",
        ),
        followupAnswer: b(
          "The framework controls repeated evaluation. Unintended work in a description can repeat independently of an intentional user action.",
          "Təkrar hesablamanı framework idarə edir. Təsvir daxilində istənməyən iş məqsədli user action-dan ayrı təkrarlana bilər.",
        ),
      },
      {
        id: "swiftui-identity-foundation",
        level: "middle",
        question: b(
          "Why can state reset when rows receive fresh UUIDs?",
          "Row-lar yeni UUID alanda state niyə sıfırlana bilər?",
        ),
        why: b(
          "It tests identity versus visual similarity.",
          "Identity ilə vizual oxşarlığı ayırır.",
        ),
        answer: b(
          "State continuity depends on the identity the framework associates with an element, not only similar text. New IDs can represent replacement rows, so previous local storage need not carry over. Use valid stable domain identity in the list scope and test duplicates or missing IDs explicitly.",
          "State davamlılığı tək oxşar mətn deyil, framework-ün elementə bağladığı identity-dən asılıdır. Yeni ID əvəz row kimi görünə, əvvəlki lokal storage daşınmaya bilər. List scope-da düzgün sabit domen identity seç, duplicate/missing ID-ni açıq test et.",
        ),
        wrong: b(
          "“The labels look the same, so the views are the same identity” mistakes appearance for lifecycle.",
          "“Label eyni görünür, deməli identity eynidir” görünüşü lifecycle sayır.",
        ),
        followup: b(
          "Does using .id with a random value fix updates?",
          "Random .id update-i düzəldirmi?",
        ),
        followupAnswer: b(
          "It can force replacement rather than solve the underlying dependency/ownership problem. Understand the intended lifetime before changing identity.",
          "Əsas dependency/ownership problemini həll etmək əvəzinə replacement məcbur edə bilər. Identity dəyişməzdən əvvəl lifetime-ı anla.",
        ),
      },
      {
        id: "observation-choice",
        level: "senior",
        question: b(
          "What should drive migration from ObservableObject to Observation?",
          "ObservableObject-dan Observation-a keçidi nə yönəltməlidir?",
        ),
        why: b(
          "It tests framework-generation constraints and evidence.",
          "Framework nəsli məhdudiyyəti və sübutu yoxlayır.",
        ),
        answer: b(
          "Deployment targets, ownership/lifetime behavior, dependency tracking needs and measured maintenance/performance problems. The proposal explains motivation, but does not prove every existing screen needs migration. Preserve behavior through state, identity and lifecycle tests rather than mechanically swapping annotations.",
          "Deployment target, ownership/lifetime davranışı, dependency tracking ehtiyacı və ölçülmüş maintenance/performans problemi. Təklif səbəbi izah edir, hər ekrana migration lazım olduğunu sübut etmir. Annotation-u mexaniki əvəz etmək deyil, state/identity/lifecycle testi ilə davranışı qoru.",
        ),
        wrong: b(
          "“Newer means universally faster” is not measurement.",
          "“Yenidir, həmişə sürətlidir” ölçü deyil.",
        ),
        followup: b(
          "What is the role of an environment value?",
          "Environment value-nun rolu nədir?",
        ),
        followupAnswer: b(
          "To pass scoped context down the view tree. It should not become an excuse to hide every behavior-bearing dependency.",
          "Scope-lu konteksti tree boyu aşağı vermək. Bütün davranış asılılığını gizlətmək bəhanəsi olmamalıdır.",
        ),
      },
    ],
    exercise: {
      prompt: b(
        "Describe a favorites screen in words before writing code: the source of truth, an item identity, a toggle action, empty content and accessibility labels. Then build a minimal view.",
        "Koddan əvvəl favorites ekranını sözlə təsvir et: source of truth, item identity, toggle action, boş content və accessibility label. Sonra minimal view qur.",
      ),
      hints: [
        b(
          "Start with data and actions, not property-wrapper guessing.",
          "Wrapper təxminindən deyil, data/action-dan başla.",
        ),
        b(
          "An empty list is a real state deserving an intentional description.",
          "Boş siyahı məqsədli təsvir istəyən real state-dir.",
        ),
      ],
      solution:
        '// Apple SDK required.\nimport SwiftUI\nstruct FavoriteToggle: View {\n    @State private var isFavorite = false\n    var body: some View {\n        Button(isFavorite ? "Remove favorite" : "Add favorite") {\n            isFavorite.toggle()\n        }\n        .accessibilityValue(isFavorite ? "Favorite" : "Not favorite")\n    }\n}\n// For a real list, move shared item state to its actual owner\n// and pass stable item IDs and bindings/actions to rows.',
      reasoning: b(
        "This local example has one owner and one action. A real favorites collection has a broader source of truth, so do not duplicate that state privately in every row and hope it remains synchronized.",
        "Lokal nümunədə bir owner/action var. Real favorites kolleksiyasının daha geniş source of truth-u var; onu hər row-da duplicate private state edib sinxron qalmasına ümid etmə.",
      ),
      checks: [
        b(
          "The action changes the owned state.",
          "Action owner state-i dəyişir.",
        ),
        b(
          "The description and accessible meaning reflect the same state.",
          "Təsvir/accessibility eyni state-i bildirir.",
        ),
        b(
          "Stable identity and shared ownership are defined before a list is added.",
          "List əlavə etməzdən əvvəl sabit identity/shared ownership müəyyən edilib.",
        ),
      ],
    },
  },
];
