# iOS Engineering Academy

A bilingual English/Azerbaijani, local-first iOS learning workspace. Built with Next.js App Router and exported as a static site so hosting requires no paid server or database.

## Develop

Use the existing checkout; do not create another Git worktree for a cloud task.

Requires Node 24 (tested with 24.22.1) and npm. Chromium is optional for browser tests.

```sh
npm ci
npm run dev
```

The development server binds to `127.0.0.1:3000`. `predev` prepares locally hosted Monaco assets; they are lazy-loaded only when requested. No private repository is read automatically.

```sh
npm run typecheck
npm run lint
npm test
NEXT_PUBLIC_BASE_PATH=/intprep npm run build
```

`out/` contains the deployable static website. For a root-domain deployment omit `NEXT_PUBLIC_BASE_PATH`. The committed lockfile makes installation repeatable.

## GitHub Pages deployment

The repository must have **Settings → Pages → Build and deployment → Source → GitHub Actions** enabled by an authorized repository owner. GitHub’s default workflow token cannot enable Pages on a repository by itself. The committed workflow verifies, builds and deploys on pushes to `main`, or through **Actions → Verify and deploy academy → Run workflow**. Pages availability for private repositories depends on the GitHub plan; the application itself does not require making private data public.

The intended address after successful deployment is `https://kenanabaszade.github.io/intprep/`. This is a deployment target, not evidence that hosting has already been activated. Never mark deployment successful until the workflow and public response have been verified.

## Browser tests

Build first, then serve the export at the same base path. In the cloud task the static server uses a directory containing an `intprep` link to `out/`:

```sh
NEXT_PUBLIC_BASE_PATH=/intprep npm run build
# Serve a parent directory containing intprep/ (the exported out/ files).
NEXT_PUBLIC_BASE_PATH=/intprep npm run test:e2e
```

Tests default to `http://127.0.0.1:4173`, with Chromium at `/usr/bin/chromium`. Override `PLAYWRIGHT_BASE_URL` and `PLAYWRIGHT_CHROMIUM_PATH` as needed. Desktop and mobile journeys cover learning, language switching, persistence, private imports, interview history, visual labs, locally served editor/diagrams and consent-based optional provider requests.

## Content and scope

- 17 imported phases, 61 original sections and 977 subtopics, with every source line preserved and checksummed.
- 61 authored bilingual focused case lessons with three learning depths, Swift examples, exercises, misconceptions, quizzes and documentation links.
- The full original inventory is retained separately. A focused case lesson does not imply an exhaustive deep textbook chapter for every individual subtopic.
- ARC, copy-on-write, actor reentrancy/stale-result, complexity and architecture visual labs are illustrative models, not measured Swift runtime behavior.
- Swift code is editable but not executed. Framework examples require an Apple SDK. Predictions are explicitly labeled.
- Interview scores are transparent weighted self-assessments, not expert automatic grades. Reading never implies mastery.

See [architecture](docs/architecture.md), [coverage matrix](docs/coverage.md) and [research provenance](docs/research.md).

## Private IBAM data

The supplied banking architecture review is not committed or embedded in the public site. The cloud machine has no mounted `ibam-ios-app` checkout from the user’s computer. **Never modify or push that repository.**

On the machine holding IBAM, optionally run:

```sh
node scripts/index-repository.mjs \
  --root /absolute/path/to/ibam-ios-app \
  --out /outside/the/repository/ibam-index.json
```

The output parent directory must already exist; the output file must not exist. The indexer reads Swift metadata and non-merge Git author history without exporting source content. It skips symlinks, never fetches, refuses writing inside the input checkout, and checks Git status before/after. Directory-group import edges are heuristic and not a resolved Tuist/SPM graph. Keep the output private.

Import the report or snapshot through **Settings & privacy**. It stays in browser IndexedDB, not a server. Historical findings remain historical. File/line existence does not establish every architectural claim. Contributions require explicitly selecting an exact author email; merge messages and ticket IDs do not establish individual ownership.

## Storage and optional providers

Progress, notes, interview sessions and private imports persist in IndexedDB for this browser and website origin. They are not automatically synchronized to another device or domain. Export backups through Settings; use a full private backup only in a trusted location. Imports validate schema version and reject corrupt or future data without overwriting the current state.

External AI is disabled by default. Optional Ollama/OpenAI-compatible endpoints require CORS support and explicit consent on each feedback request. The request contains only the displayed public practice question and written answer. Private report/project-defense modes cannot call the provider. No credentials are stored; use a trusted local/authenticated proxy if necessary. Browser voice input requests separate consent and may use the browser vendor’s speech service; it does not assess pronunciation.
