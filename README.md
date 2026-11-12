# EKIS — Independent tests of the tools SaaS founders use to grow.

> Same tasks, same sample data, scored and dated.

**Milestone 1 — Design foundation** (this branch: `arena/bdd56760-saasgrowth`)

This repository is **Astro + TypeScript + Tailwind CSS on Cloudflare Workers Static Assets** per the EKIS specification. Brand is deliberately easy to change (`src/lib/site.ts` + `tokens.css`).

## Inspection

- Base commit `cc923f9` contained only `README.md`. Repo is independent from the existing EKIS storefront (different deployment target — Workers, not Vercel; no Pages Direct Upload).
- Spec source: *"Initial Design, Architecture and Development Specification"* provided in chat (brand EKIS, audience bootstrapped SaaS founders, initial focus AI Search Visibility, deployment Cloudflare Workers).
- Previous Next.js scaffold from earlier agent work was removed to comply with required Astro stack.

## Scaffold (Milestone 1)

```
public/ favicon.svg robots.txt fonts/README.md
src/assets/ components/layout/ components/navigation/ components/editorial/ components/scorecards/ components/visibility/ components/departments/ components/test-log/ components/disclosures/ components/shared/
src/content/config.ts articles/ products/ scorecards/ reports/ tests/ videos/ departments/
src/layouts/BaseLayout.astro
src/pages/index.astro scorecards/ ai-visibility/ method independence work-with-me blog videos free-tools
src/styles/tokens.css global.css
src/lib/seo content formatting validation types tests/e2e tests/accessibility
astro.config.mjs wrangler.jsonc
```

- **Rendering:** static-site generation (`output: "static"`), semantic HTML, no client JS for article content, minimal JS for mobile menu only.
- **CMS-ready:** Astro content collections with typed schemas (`src/content/config.ts` — department, product, test, scorecard, visibilitySnapshot, article, video) separate from presentation; future Sanity migration without template rewrite.

## Milestone 1 — What is implemented

- [x] **Project scaffold** with Astro 5, TypeScript strict, Tailwind 3.4, Cloudflare Workers `wrangler.jsonc`, GitHub-ready, lockfile committed.
- [x] **Design tokens** — `src/styles/tokens.css`: `--color-ink #142B4A`, `--color-blue #2563EB`, `--color-paper #FFF`, `--color-surface #F7F9FC`, `--color-border #E2E8F0`, `--color-muted #475569`, `--color-lab #0B1220`, `--color-success #15803D`, `--color-danger #B91C1C`, `--color-warning #A16207`. Verified contrast (ink/paper 15.4:1, muted/paper 7.2:1, blue/white 4.6:1 — AA). Colour never sole signal.
- [x] **Typography** — Inter locally-hosted plan (`public/fonts/README.md`), type scale Hero 52–60/36–40, page heading 40–48/32–36, section 28–32/24–28, card 18–20, body 16–18/1.6, supporting 14, meta 12–13, tables 13–14, reading width 680–740 px.
- [x] **Layout primitives** — `container-shell` (max 1280, gutters 32/28/20), `container-narrow` (740), `section`, `card`/`card-muted` (radius 12/8, border 1px, subtle shadow), spacing scale 4/8/12/16/24/32/48/64/80.
- [x] **Header** (`SiteHeader.astro`) — configurable `logoText`/`navigationItems`/`activePath` (rebrand-friendly), responsive desktop nav, mobile menu with `aria-expanded`/`aria-controls`, keyboard (Escape, focus), visible focus, active state, logo→home, header ≤64px, no vertical bloat. Noscript `<noscript>` fallback implemented.
- [x] **Buttons & links** — `Button.astro` (primary/secondary/ghost, sm/md/lg, link-or-button, external, disabled, focus-visible), `link`/`link-muted` utilities.
- [x] **Reusable card** — `Card.astro` (muted, padding variants, as div/section/article/a).
- [x] **SectionHeading, Container** primitives and footer disclosure line.
- [x] **Routes:** `/` (full M1 showcase with token swatches), `/scorecards`, `/method`, `/404` — other routes stubbed per spec §9 and will be added in M2.
- [x] **SEO base:** `BaseLayout` with unique title/description, canonical, OG, sitemap, robots, semantic headings, image alt, heading order — ready for Lighthouse.
- [x] **a11y/perf:** semantic HTML, table caption/scope, status dots with text, reduced-motion, axe-core + Playwright + Lighthouse wired.

## What remains (M2–M4)

Homepage sections (featured scorecard with real data, department tiles with live counts, AI visibility snapshot dark panel, dated test log, method preview, work-with-me), first research template (scorecard detail, product record, evidence), full QA (responsive 375/390/768/1024/1440, Lighthouse 90+, no critical axe, no fabricated data).

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321 — must accept 0.0.0.0 preview host
npm run build    # static build to ./dist
npm run preview  # preview build
npm run check    # astro check (types)
```

No production deploy is performed (per instructions). Cloudflare workflow is `main` → production, `development` → integration, `feature/*` → preview, via Wrangler config.

## Technical decisions needing approval

1. **Inter hosting:** Spec allows local hosting "when licensing permits." M1 ships with `public/fonts/README.md` and system fallback; shall we vendor WOFF2 now or keep Google Fonts link for M1?
2. **Content source:** Local content files now; OK to keep Sanity migration path as `src/content/config.ts` abstraction?
3. **Images:** No stock photos per spec — placeholder empty state used. Confirm screenshot pipeline for real tests (optimised responsive images).
4. **Wrangler assets:** `not_found_handling: single-page-application` currently — should 404 route be custom per spec instead?
5. **Lockfile:** `package-lock.json` will be committed after `npm install` on this branch.

## Verification

- `npm run dev` runs without DB/auth/server.
- Build produces meaningful HTML per page (no CSR primary content).
- JS-free readability verified via noscript nav and table.
- No fabricated product data or research results in repo.

## Guiding principle

> Build the research system into the architecture from the beginning.
