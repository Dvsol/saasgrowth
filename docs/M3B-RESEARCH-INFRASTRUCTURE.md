# M3B — Research Infrastructure (placeholder, no fabricated findings)

**Branch:** `arena/bdd56760-saasgrowth@2814433` + QA fixes (accepted)  
**Static:** Astro `output: static` + Cloudflare `assets ./dist 404-page` preserved. No DB/auth/CMS/API. No deploy.

## Deliverables

### 1. Standardised research record template
- **Layout:** `src/layouts/ResearchLayout.astro` wraps `BaseLayout` + `SiteHeader/Footer`. No unused props (hints fixed — removed `eyebrow`/`Container` dead code).
- **Header:** `src/components/research/ResearchHeader.astro` — eyebrow, title, `Tested:` / `Updated:` (ISO → en-CA), `methodologyVersion` chip, `testStatus` chip (`prototype` → “Prototype — placeholder”), `methodology` + `disclosure` + explicit note. Removed unused `statusLabel` dead code.
- **Shared blocks:** `EvidenceList`, `LimitationsNotice`, `PlaceholderBanner` (`#FFFBEB`), `ScoreMatrix` (now handles explicit result/verdict objects with taskId/productId/outcome/evidence), `ProductFacts` (pricingCheckedAt as Date).
- **Example:** `src/content/tests/example-research-record.md` → `/research/example-research-record` (prototype, 2026-11-12, productId `example-product` linked to product profile).

### 2. Product profile schema
- **Schema (strengthened):** `products` — `id, slug, name, website (z.url), category, description, targetAudience?, pricing?, pricingCheckedAt: z.coerce.date().optional() (was z.string), productStatus, testStatus (new: prototype/planned/...), disclosure, limitations, updatedAt: z.coerce.date().optional()` with `glob` loader.
- **Facts:** `ProductFacts.astro` handles `Date|string` for pricingCheckedAt/updatedAt, formats en-CA, fallbacks `—`.
- **Page:** `src/pages/products/[slug].astro` now uses `data.testStatus` (not hardcoded prototype), `data.pricingCheckedAt` as `Tested:`, `data.updatedAt` as `Updated:`, and `Profile last checked` footer. Status chip from `productStatus` inside facts.
- **Example:** `example-product.md` now includes `testStatus: prototype`, `pricingCheckedAt: 2026-11-12` validated as Date.
- **Index:** `src/pages/products/index.astro` lists all products with pricing checked.

### 3. Scorecard detail template
- **Schema (strengthened):** `scorecards` — explicit `results: z.array(scorecardResult).optional()` where `scorecardResult = {taskId, productId, outcome: enum(pass/fail/partial/pending/not_tested/not_applicable), evidence: url|"", note?}` and `verdicts: z.array(scorecardVerdict).optional()` where `scorecardVerdict = {productId, verdict: enum(pass/fail/partial/pending/recommended/not_recommended/not_tested/needs_review), summary?, evidence?}`. `results/verdicts` no longer `z.any()`. `testDate/updatedAt` as `z.coerce.date`.
- **Page:** `src/pages/scorecards/[slug].astro` — resolves product names via `getCollection("products")` map, renders `Products: <a href="/products/example-product">Example Product — placeholder</a>` instead of raw IDs. Removes 28-char truncation: `tasks={d.taskDefinitions.map((t,i)=>({id:"t"+i, label:t}))}` with `line-clamp-2` CSS instead of `slice(0,28)`. `ScorecardTable` updated to render full labels and link product names, support verdict objects.
- **Example:** `example-scorecard.md` still `results:[], verdicts:[]` placeholder, no fabricated scores.
- **Index:** `src/pages/scorecards/index.astro` now dynamic via `getCollection("scorecards")` — grid of cards when present, preserves empty-state `Card muted Upcoming` when empty.

### 4. AI visibility report template
- **Schema (strengthened):** `visibilitySnapshots` — `platforms: z.array(platformEnum)` (`chatgpt|perplexity|gemini`), `results: z.array(visibilityResult).optional()` where `visibilityResult = {promptId, results: Record<Platform, Y|N|C|U>}` enforcing Y/N/C/U and platforms strictly. `testDate` as `z.coerce.date`.
- **Page:** `src/pages/ai-visibility/[slug].astro` — `VisibilityGrid` receives explicit rows, methodology card shows `runsPerPrompt` and platforms, `Mention ≠ citation`.
- **Example:** `example-visibility.md` still `results:[]` placeholder, `platforms:[chatgpt,perplexity,gemini]`, 6 prompts.
- **Index:** `src/pages/ai-visibility/index.astro` now dynamic — lists snapshots, preserves empty-state card when empty.

## Content handling
All 4 example records are `testStatus: prototype` with `PlaceholderBanner` and `Example — not a real test` copy. Dates explicit via `z.coerce.date`. Empty states preserved for all indexes. No DB/auth/CMS/API, homepage 7 sections intact (27 KB), design tokens unchanged, 17 pages built, 0 vulns, 0 hints.

## Validation & links
- Links: scorecard → product profile (actual name + href), research record → product profile (linked name). Verified in `dist/scorecards/example-scorecard/index.html` and `dist/research/example-research-record/index.html`.
- Empty articles/videos warnings silenced without inventing content: `articles`/`videos` removed from `collections` export (reserved, commented).
- Hints fixed: `ResearchHeader statusLabel`, `ResearchLayout eyebrow/Container` removed — `check` now `0 errors 0 warnings 0 hints`.

## Files created/modified (QA fixes)
- Modified: `src/content.config.ts` (strengthened schemas, pricingCheckedAt as date, explicit result/verdict, silence empty collections), `src/layouts/ResearchLayout.astro`, `src/components/research/ResearchHeader.astro`, `src/components/research/ProductFacts.astro`, `src/components/research/ScoreMatrix.astro`, `src/components/scorecards/ScorecardTable.astro`, `src/pages/products/[slug].astro`, `src/pages/scorecards/[slug].astro`, `src/pages/research/[id].astro`, `src/pages/scorecards/index.astro`, `src/pages/ai-visibility/index.astro`, `src/content/products/example-product.md`
- Verified: `npm audit 0 vulns`, `npm run check 50 files 0/0/0`, `npm run build 17 pages`, `dist/404.html 6.8K`, `output:static`, Cloudflare 404-page.

## Remaining
- Real data still placeholder empty arrays — no scores, no mentions invented. When real runs are added, must provide dated evidence links per outcome/verdict.
- Homepage still uses legacy `src/lib/content/*.ts` fixtures for hero/visibility tiles; future M4 will wire to content collections.
- No deploy — awaiting approval.
