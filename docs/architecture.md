# iOS Engineering Academy architecture

## Inputs and evidence

The supplied syllabus is authoritative for coverage. `docs/syllabus.txt` preserves it verbatim; `src/content/curriculum.json` retains every nonempty line, heading, subtopic, checkpoint and project requirement with stable source-line identifiers and a source checksum. The coverage matrix maps all 61 sections in 17 phases, including 977 original subtopics. Each section has an authored bilingual focused case lesson; this is distinct from exhaustive textbook coverage of every individual bullet.

The supplied architecture report contains multiple overlapping drafts and sensitive local banking source references. It is deliberately excluded from Git and the public static bundle. Import it through Settings for browser-only historical study. Its own “confirmed” wording is historical-review evidence, not current verification. No actual IBAM checkout exists in this cloud task. A checkout on another machine is not automatically accessible here.

## Runtime and persistence

Next.js App Router exports static pages for free GitHub Pages hosting. Strict TypeScript, React, Tailwind, Lucide, Motion, React Flow, Mermaid, locally served lazy Monaco, Recharts, Zod and IndexedDB implement the application. IndexedDB replaces server SQLite in this static deployment: progress, attempts, review scheduling, interview sessions, drafts and private evidence stay on the device. JSON backup import/export provides schema validation and rejects unsupported versions. No account, backend or paid API is required.

Static content and private evidence have separate data flows. The public bundle has general educational banking examples; it has no uploaded IBAM report, source index, user author identity or proprietary source. Private import is a browser File API operation, not an upload endpoint. Report text is rendered inertly; source comments/documents are never executed.

An optional local Node indexer reads explicit allowlisted checkout roots, skips symlinks, exports metadata rather than source, and refuses output inside the input checkout or overwriting existing output. Git runs without optional locks and performs no fetch, reset or mutation. Dependency edges are heuristic Swift imports between directory groups, not a resolved Tuist/SPM graph. Commit author matching is exact and requires explicit identity selection; merge commits are excluded. A path/line match does not automatically verify an architectural claim.

## Learning semantics

Junior explains the mental model. Middle explains implementation and production behavior. Senior considers system-wide trade-offs and migration. Each focused lesson has code, predicted output, misconception, practical exercise, reference reasoning, documentation anchor and assessment. The complete source inventory stays separate, in original English. Source quotations and privately imported reports retain original language; authored explanations and navigation are bilingual.

Reading is never mastery. Three distinct correct question identities across multiple formats establish practice readiness, not a probability of interview success. Mastery additionally requires delayed correct review at least seven days after the first correct attempt. Incorrect answers schedule next-day review; successful intervals double to a 60-day cap. Interview grading is an explicit weighted self-assessment with model reasoning, not pretend expert automatic scoring. Optional AI feedback supports Ollama and OpenAI-compatible endpoints, requires per-request informed consent, and is disabled for private repository modes. No keys are stored.

## Delivery milestones

1. Source inventory and coverage matrix.
2. Application shell, AZ/EN, themes, all routes and persistent schema.
3. Focused bilingual case lessons for all sections; quizzes, exercises and review.
4. ARC, COW, stale-response and complexity visualizations, interactive architecture choices.
5. Private report ingestion, provenance, read-only local metadata indexer and exact attribution.
6. Eight interview modes, session history, optional consent-based provider adapters.
7. Type checks, lint, meaningful unit/integration tests, desktop/mobile browser and accessibility checks, static production export.
8. GitHub push and Pages deployment workflow, with live verification subject to hosting permissions and network access.

## Explicit capability limits

The website does not execute Swift. Console outputs are authored predictions; Apple framework examples require Apple SDKs. This Linux machine has no Swift compiler. Visual labs are illustrative models, not real ARC counters or benchmarks. Current IBAM verification and personal contribution attribution require a snapshot from the machine holding the checkout. Optional external AI/speech providers are not claimed to be configured or live-tested without an endpoint/consent. No question is claimed to be a real company interview unless evidence establishes it.
