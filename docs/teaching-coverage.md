# Teaching depth and content coverage

The original brief entries were not sufficient as deep teaching material. The reader now separates long-form teaching chapters from study notes and keeps all depths visible by default. Choosing Junior/Middle/Senior focuses the corresponding section without hiding prerequisite explanations.

## Long-form chapters

| Topic    | Teaching focus                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------ |
| topic-01 | Values, let/var, inference, operators, scope, Void/Never, optionals and boundary validation      |
| topic-02 | Value/reference behavior, nested references, COW, independent financial snapshots                |
| topic-04 | Capture timing, escaping lifetime, reference captures, callback contracts                        |
| topic-07 | Protocol requirements, extension dispatch, generics/opaque/existential decisions                 |
| topic-08 | ARC ownership graphs, cycles, weak/unowned, task lifetime and memory investigation               |
| topic-12 | Suspension, structured task ownership, actor reentrancy, complete latest-wins state handling     |
| topic-13 | UIKit view trees, lifecycle, events, adaptation and work ownership                               |
| topic-14 | Auto Layout relationships, intrinsic size, priorities, scroll guides and layout scheduling       |
| topic-17 | MVVM responsibilities, test seams, DI versus inversion and incremental extraction                |
| topic-25 | Transport/HTTP/schema/business outcomes, cancellation, unknown mutation results and retry safety |
| topic-33 | Declarative UI, View/body, state ownership, layout, identity and Observation                     |
| topic-34 | SwiftUI ownership, identity, Observation, bindings, lifecycle and accessibility                  |
| topic-38 | Single-flight refresh, session generation, logout races, waiter and storage policies             |

Each chapter includes connected English and Azerbaijani explanations, a prerequisite note, objectives, a worked code trace, a broken/corrected debugging case with a test strategy, implementation exercise with hints/reference reasoning, and answered interview follow-ups. There are 13 chapters, each with worked examples, a debugging case and answered interview questions. Examples are teaching code or explicitly labeled pseudocode; the website does not execute Swift.

The remaining 48 sections are still study notes. Their presence and preserved syllabus inventory are not counted as deep content. They need separate authored expansion rather than repeated generic definitions. The curriculum's “Long-form chapters only” filter displays the actual chapter set.

## Question panel

The local question panel retrieves a complete authored answer or clearly labeled relevant passage from the current chapter. It declines unrelated questions instead of inventing a response. Conversation history stays in private browser notes and survives reloads. This is retrieval of teaching content, not a local generative model.

A configured Ollama/OpenAI-compatible provider can answer open-ended follow-ups. Each request requires explicit consent and includes only the public chapter and visible tutor conversation. It excludes private reports, repository snapshots, other notes and credentials. Markdown is rendered with raw HTML disabled. Provider correctness is not guaranteed, and no request is made by the authored mode.

## Validation

Type checking, lint and production static export pass. The 23 unit/integration checks include chapter structure, distinct interview explanations, bilingual question retrieval, refusal of unrelated queries, safe history parsing and provider context boundaries. The 28 desktop/mobile browser checks cover the complete reading/quiz flow, persisted tutor history, language switching, notes/chapter distinction, Markdown rendering, explicit provider consent and private report exclusion. Provider requests use controlled mocks; no live external AI provider is claimed verified.

## Sources and theory-first ordering

The Swift Basics chapter now introduces values, names, expressions, types and mutation before code, then develops optional handling. All 18 original checklist entries link directly to explanations. UIKit, Auto Layout and SwiftUI foundations begin with the problems their frameworks solve before naming APIs. Concurrency includes the motivation for async/await, the tradeoff behind actor reentrancy, and cancellation versus task-group lifetime.

Each chapter lists source scope and verification status. Thirteen public source records were reviewed at pinned Git revisions; eight records are further-reading links. Swift Forums and live Apple framework pages were blocked by the environment proxy and are explicitly unverified. Historical objc.io articles are labeled 2013 and support conceptual reasoning rather than current API prescriptions. No popularity or forum-consensus claim is made.
