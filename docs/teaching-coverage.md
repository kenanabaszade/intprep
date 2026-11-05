# Teaching depth and content coverage

The original brief entries were not sufficient as deep teaching material. The reader now separates long-form teaching chapters from study notes and keeps all depths visible by default. Choosing Junior/Middle/Senior focuses the corresponding section without hiding prerequisite explanations.

## Long-form chapters

| Topic    | Teaching focus                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------ |
| topic-01 | Optional absence versus validity, safe boundary validation, explicit screen states               |
| topic-02 | Value/reference behavior, nested references, COW, independent financial snapshots                |
| topic-04 | Capture timing, escaping lifetime, reference captures, callback contracts                        |
| topic-07 | Protocol requirements, extension dispatch, generics/opaque/existential decisions                 |
| topic-08 | ARC ownership graphs, cycles, weak/unowned, task lifetime and memory investigation               |
| topic-12 | Suspension, structured task ownership, actor reentrancy, complete latest-wins state handling     |
| topic-17 | MVVM responsibilities, test seams, DI versus inversion and incremental extraction                |
| topic-25 | Transport/HTTP/schema/business outcomes, cancellation, unknown mutation results and retry safety |
| topic-34 | SwiftUI ownership, identity, Observation, bindings, lifecycle and accessibility                  |
| topic-38 | Single-flight refresh, session generation, logout races, waiter and storage policies             |

Each chapter includes connected English and Azerbaijani explanations, a prerequisite note, objectives, a worked code trace, a broken/corrected debugging case with a test strategy, implementation exercise with hints/reference reasoning, and answered interview follow-ups. There are 13 worked traces, 10 debugging cases, and 28 detailed interview questions with 28 answered follow-ups across these chapters. Examples are teaching code or explicitly labeled pseudocode; the website does not execute Swift.

The remaining 51 sections are still study notes. Their presence and preserved syllabus inventory are not counted as deep content. They need separate authored expansion rather than repeated generic definitions. The curriculum's “Long-form chapters only” filter displays the actual chapter set.

## Question panel

The local question panel retrieves a complete authored answer or clearly labeled relevant passage from the current chapter. It declines unrelated questions instead of inventing a response. Conversation history stays in private browser notes and survives reloads. This is retrieval of teaching content, not a local generative model.

A configured Ollama/OpenAI-compatible provider can answer open-ended follow-ups. Each request requires explicit consent and includes only the public chapter and visible tutor conversation. It excludes private reports, repository snapshots, other notes and credentials. Markdown is rendered with raw HTML disabled. Provider correctness is not guaranteed, and no request is made by the authored mode.

## Validation

Type checking, lint and production static export pass. The 17 unit/integration checks include chapter structure, distinct interview explanations, bilingual question retrieval, refusal of unrelated queries, safe history parsing and provider context boundaries. The 24 desktop/mobile browser checks cover the complete reading/quiz flow, persisted tutor history, language switching, notes/chapter distinction, Markdown rendering, explicit provider consent and private report exclusion. Provider requests use controlled mocks; no live external AI provider is claimed verified.
