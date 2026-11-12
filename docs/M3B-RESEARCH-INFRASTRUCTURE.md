# M3B — Research Infrastructure (placeholder, no fabricated findings)

**Branch:** `arena/bdd56760-saasgrowth@6c76e5b` + M3B (4 deliverables)  
**Static:** Astro `output: static` + Cloudflare `assets ./dist 404-page` preserved. No DB/auth/CMS/API.

## Deliverables

### 1. Standardised research record template
- **Layout:** `src/layouts/ResearchLayout.astro` wraps `BaseLayout` + `SiteHeader/Footer`.
- **Header:** `src/components/research/ResearchHeader.astro` — eyebrow, title, `Tested:` / `Updated:` (ISO → en-CA), `methodologyVersion` chip, `testStatus` chip (`prototype` → “Prototype — not a real test”), `methodology` + `disclosure` + explicit note “Dates, methodology, evidence, scores and limitations are explicit. No finding is fabricated.”
- **Shared blocks:** `EvidenceList.astro` (links or “Example — not a real test” placeholder), `LimitationsNotice.astro`, `PlaceholderBanner.astro` (`border-warning #FFFBEB` “Example — not a real test”), `ScoreMatrix.astro` for scorecards.
- **Example:** `src/content/tests/example-research-record.md` → `/research/example-research-record` (prototype, 2026-11-12, environment/settings explicit, evidence [], findings “Placeholder”).

### 2. Product profile schema
- **Schema:** `src/content.config.ts:products` — `id, slug, name, website (z.url), category, description, targetAudience, pricing, pricingCheckedAt (explicit string), productStatus, disclosure, limitations, updatedAt (coerce.date)`.
- **Facts component:** `src/components/research/ProductFacts.astro` — table Website/Category/For/Pricing/Pricing checked/Status/Updated with links, disclosure, limitations.
- **Page:** `src/pages/products/[slug].astro` (getCollection → static paths) + `src/pages/products/index.astro` listing.
- **Example:** `src/content/products/example-product.md` → `/products/example-product` — placeholder product, pricingCheckedAt 2026-11-12, disclosure “Placeholder only — no test has been run”.

### 3. Scorecard detail page template
- **Schema:** `scorecards` — `title, department, productIds, taskDefinitions, results, verdicts, methodology, methodologyVersion, testDate, updatedAt, testStatus (prototype/planned/in_progress/completed), disclosure, limitations, evidence`.
- **Page:** `src/pages/scorecards/[slug].astro` — reuses `ResearchHeader` + `ScoreMatrix` + `ScorecardTable` (prototype shows `— / Pending`, `Tested: —`) + `EvidenceList` + `LimitationsNotice`.
- **Example:** `src/content/scorecards/example-scorecard.md` → `/scorecards/example-scorecard` — 3 placeholder tasks, results [], prototype, testDate 2026-11-12, methodology v0.2 placeholder, no fabricated scores.

### 4. AI visibility report template
- **Schema:** `visibilitySnapshots` — `testedBrand, category, prompts[], platforms[chatgpt,perplexity,gemini], runsPerPrompt, results[], testDate, methodologyVersion, testStatus, limitations, evidence, disclosure`.
- **Page:** `src/pages/ai-visibility/[slug].astro` — `ResearchHeader` + `VisibilityGrid` (6 prompts → 12-prompt template, Y/N/C/U with `Research coming soon` when empty, `Mention ≠ citation`) + methodology card + `LimitationsNotice` + `EvidenceList`.
- **Example:** `src/content/visibilitySnapshots/example-visibility.md` → `/ai-visibility/example-visibility` — 6 placeholder prompts, results [], prototype, methodology v0.2 placeholder, no mentions fabricated.

## Content handling
All 4 example records are `testStatus: prototype` with `PlaceholderBanner` and `Example — not a real test.` copy. Dates (`testDate`, `pricingCheckedAt`, `updatedAt`) are explicit (2026-11-12) or `—`. `audit 0 vulns`, `check 0 errors`, `build 17 pages` (12 existing + 3 new detail + products index + research). Homepage 7 sections intact. Design tokens (`tokens.css`, `global.css` container-shell 1280) unchanged.

## Files created/modified
- Modified: `src/content.config.ts` (added `glob` loaders, explicit schemas)
- Created: `src/layouts/ResearchLayout.astro`, `src/components/research/*` (6), `src/content/{departments,products,tests,scorecards,visibilitySnapshots}/example-*.md` (5), `src/pages/{products/[slug].astro,products/index.astro,scorecards/[slug].astro,ai-visibility/[slug].astro,research/[id].astro}`
- Build: `17 page(s) built` — no deploy.

## Next
No production deploy. Awaiting M3B QA.
