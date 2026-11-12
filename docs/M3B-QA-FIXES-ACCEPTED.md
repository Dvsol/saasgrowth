# M3B QA Fixes — Accepted Review (2814433 → fixes)

**Date:** 2026-11-12  
**Branch:** `arena/bdd56760-saasgrowth` @ `2814433` + QA accepted fixes  
**Reviewer report:** 1 Passed section, Failed items 1–6, Warnings 1–5 as accepted.

## Priorities implemented

1. **Scorecard → product & research → product links**
   - `src/pages/scorecards/[slug].astro`: fetches `getCollection("products")`, builds `productMap`, renders `resolvedProducts` with `<a href="/products/${p.id}">{p.name}</a>` in header and table. Verified: `dist/scorecards/example-scorecard/index.html` contains `Example Product — placeholder` linked.
   - `src/pages/research/[id].astro`: fetches products, resolves `linkedProduct` via `productId`, renders linked name or fallback id. Verified: `dist/research/example-research-record/index.html` link present.

2. **Dynamic index pages**
   - `src/pages/scorecards/index.astro` and `src/pages/ai-visibility/index.astro`: now `await getCollection` and render grid of cards with `Tested: en-CA`, status chip, method. Empty-state `Card muted` preserved when `length===0`. Verified: both dist indexes list example records.

3. **Remove 28-char truncation**
   - Changed `t.slice(0,28)` → `t` with `max-w-[280px] line-clamp-2` in `ScorecardTable`. Full task strings `create a workspace and invite a teammate` etc. visible in dist.

4. **Strengthen content validation**
   - `src/content.config.ts`: `pricingCheckedAt: z.coerce.date().optional()` (was string). `scorecardResult`/`scorecardVerdict` explicit objects with `taskId/productId/outcome/evidence/note` and verdict enums. `visibilityResult` with `platformEnum`+`cellStateEnum` (`Y/N/C/U`) strict. Inspected `ScorecardTable` and `VisibilityGrid` before defining schemas — `ScoreMatrix` updated to handle new shapes (taskId/productId/outcome/evidence). Empty arrays still valid for placeholders. Tested invalid date/any would now fail at `astro sync`.

5. **Product profile status & dates**
   - Added `testStatus` to `products` schema, updated `example-product.md` with `testStatus: prototype`. `src/pages/products/[slug].astro` now passes `data.testStatus` to `ResearchHeader` (not hardcoded), `testDate=data.pricingCheckedAt`, `updatedAt=data.updatedAt`, footer `Profile last checked: new Date(...).toLocaleDateString("en-CA")`. `ProductFacts.astro` updated to accept `Date|string`.

6. **Remove 3 hints**
   - `ResearchHeader.astro`: deleted unused `statusLabel`.
   - `ResearchLayout.astro`: removed `eyebrow` prop and `Container` import. Now `0 errors 0 warnings 0 hints` on 50 files.

7. **Empty articles/videos warnings**
   - Removed `articles`/`videos` from `collections` export, left commented as reserved. `astro check/build` no longer warns `No files found matching ... in articles/videos`. No invented content.

8. **Documentation**
   - Updated `docs/M3B-RESEARCH-INFRASTRUCTURE.md` and added this `M3B-QA-FIXES-ACCEPTED.md`.

## Verification

- `npm audit` → `found 0 vulnerabilities` (527 deps)
- `npm run check` → `50 files: 0 errors, 0 warnings, 0 hints` (was 3 hints)
- `npm run build` → `17 page(s) built`, routes: `/`, `/about`, `/ai-visibility`, `/ai-visibility/example-visibility`, `/blog`, `/contact`, `/free-tools`, `/independence`, `/method`, `/products`, `/products/example-product`, `/research/example-research-record`, `/scorecards`, `/scorecards/example-scorecard`, `/videos`, `/work-with-me`, `/404.html`
- `dist/404.html 6.8K`, `output: "static"`, `wrangler 404-page` preserved, homepage 7 sections intact, design tokens unchanged.
- Placeholder protection intact: every new route still shows `Example — not a real test` / `Prototype — placeholder`, no numeric scores or fabricated mentions.

## Remaining issues / next
- No real research data yet — placeholders intentionally empty (no findings invented).
- Homepage featured tiles still use `src/lib/content` fixtures, not collections (intentional until M4).
- No deploy — static output ready for Cloudflare.

**Changed files:** `src/content.config.ts`, `src/layouts/ResearchLayout.astro`, `src/components/research/ResearchHeader.astro`, `src/components/research/ProductFacts.astro`, `src/components/research/ScoreMatrix.astro`, `src/components/scorecards/ScorecardTable.astro`, `src/pages/products/[slug].astro`, `src/pages/scorecards/[slug].astro`, `src/pages/research/[id].astro`, `src/pages/scorecards/index.astro`, `src/pages/ai-visibility/index.astro`, `src/content/products/example-product.md`, `docs/M3B-RESEARCH-INFRASTRUCTURE.md`, `docs/M3B-QA-FIXES-ACCEPTED.md`
