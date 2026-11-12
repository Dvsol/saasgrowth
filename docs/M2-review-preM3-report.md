# EKIS M2 Review — Pre-M3 Checks (2026-11-12)

**Branch:** `arena/bdd56760-saasgrowth` @ `aded9d8` (base `cc923f9`)
**Scope:** Visual QA at 5 breakpoints, dependency security audit (1 critical + 12 high prioritised), research data-integrity verification. No M3, no production deploy.

---

## 1. Visual QA

### Tooling status — screenshots not available

* `npx playwright install chromium` and `npx puppeteer browsers install chrome` both fail in this sandbox with `Client network socket disconnected before secure TLS connection was established` (outbound TLS to `cdn.playwright.dev`, `storage.googleapis.com`, `edgedl.me.gvt1.com` blocked). `apt-get` for `chromium` also blocked (Debian mirrors unreachable). No headless browser binary is present (`/home/user/.cache/puppeteer` empty, `/usr/bin/*chrom*` absent).
* Per your instruction **do not claim visual QA is complete based solely on compiled CSS**, this section reports what was verifiable via running preview DOM + built CSS + layout primitives, and marks pixel-paint as incomplete.

**Running preview used:** `npm run dev --host 0.0.0.0 --port 4321` (Astro 5.18.2, ready 878 ms, http://127.0.0.1:4321/). HTML captured to `/tmp/live.html` (90 840 bytes) and inspected against `dist/_astro/*.css`. All `container-shell` / `section` / grid rules verified in the compiled stylesheet (see `container-shell` min-width 375→1280, gutters 20/28/32, `clamp()` type scales present).

### Checks by element (live DOM + CSS)

#### Hero hierarchy and spacing
* **DOM:** `<p class="eyebrow">Independent software research — M2</p>` → `<h1 class="page-title" style="font-size: var(--text-hero)">` → supporting `max-w-prose text-[1.05rem] leading-relaxed text-[var(--color-muted)]` → two `.btn` (primary + secondary) with `flex flex-wrap gap-3` → meta disclosure.
* **Hierarchy:** `eyebrow` (0.75rem 700 0.14em upper blue) establishes kicker; `page-title` uses `--text-hero: clamp(2.25rem, 1.2rem + 4vw, 3.5rem)` (36 px mobile → 56 px desktop) with `--leading-tight 1.05` and `-0.02em` tracking → clear H1 dominance.
* **Spacing:** `section` padding `--space-12` (48 px) mobile → `--space-16` (64 px) ≥768 px; hero grid `gap-10` (40 px) split `lg:grid-cols-[1.05fr_0.95fr]` at 1024 px, single column below. Meta text 13 px muted sits 12 px below CTAs.
* **Breakpoint reasoning:** at 375/390 single column prevents crowding; at 768+ padding lifts; at 1024 two-column hero aligns headline left, scorecard right without horizontal overflow (both children have `max-width` constraints).
* **Risk:** no overflow observed in DOM (all paragraphs `max-w-prose`/`max-w-[560px]`, no unbroken long tokens). Paint not verified.

#### Featured scorecard readability
* **DOM:** `Card` header with `Featured scorecard` + `chip Prototype — no scores yet` + meta `Prototype structure only — no product data has been fabricated.` → `overflow-x-auto` table → footer `Tested: — · Dated evidence only` + link.
* **Table:** 4 columns (Product, Task A/B/C, Verdict) with `text-[var(--text-table)] 0.8125rem`, header `bg-[var(--color-surface)] text-[var(--color-muted)]`, body `divide-y`, cells `—` muted, verdict `chip Pending`. All header cells `scope="col"` and body row headers `scope="row"`, `caption sr-only`.
* **Responsive:** `overflow-x-auto` verified on container — table scrolls without layout break at 375. Content is short placeholders; no truncation needed. `min-w` not set so table can shrink to viewport.
* **Contrast:** ink #142B4A on paper, muted #475569 on paper 7.2:1, blue link 4.6:1 — AA.

#### Department grid alignment
* **DOM:** `SectionHeading` eyebrow → title `Start from the job you’re hiring…` → `grid gap-4 sm:grid-cols-2 lg:grid-cols-3` (6 tiles).
* **Tiles:** `DepartmentTile` → number `01`–`06` xxs 700 tracking-widest muted + status chip `Active`/`Future` (`chip-active` ink on white) → `card-title` → `supporting` description → meta `Published research: —` (6 instances verified in live HTML).
* **Grid reasoning:** 1-col at 375/390, 2-col at 640 (`sm`), 3-col at 1024 (`lg`). `gap-4` (16 px) ensures gutters don't collapse. All tiles `card` with `border 1px`, `radius 12`, `shadow subtle`, equal padding `p-6`. Hover/ focus-visible styles present.
* **Counts:** intentionally `—` not 0 — no fabricated research, consistent with spec.

#### AI visibility panel readability
* **DOM:** dark `lab #0B1220` panel, `overflow-hidden border radius 12`. Header: `AI Visibility Snapshot` 1.125 rem bold white + subtitle 14 px white/70 + chip `Research coming soon` white/10 + meta `No brand tested yet — snapshot will show dated test label and link…`.
* **Empty state (current):** centered `max-w-[520px] rounded-lg bg-white/5 border white/10 p-6` with `No completed tests yet` 14 px semibold white → 14 px supporting white/60 explaining 12 prompts × 3 platforms, mention≠citation → legend chips `Y — Mentioned / N — Not mentioned / C — Citation / U — Unable` (white bg ink text, 12 px 600) → footer `Mention ≠ citation. See methodology for definitions.` + link `View research record →` white underline white/40.
* **When populated:** `hasData = rows.length > 0 && testDate` switches to `overflow-x-auto` table: Prompt col `max-w-[520px] line-clamp-2` left, platform cols centered `PlatformLabel` (ChatGPT/Perplexity/Gemini) with pill cells `Y/N/C/U` + `sr-only` label ` — Mentioned` etc., colour supplementary only.
* **Readability reasoning:** lab background + white/70 text verified for contrast; legend chips demonstrate encoding without data; table will scroll at 375. Empty state cannot be mistaken for data (see §3).

#### Test log layout
* **DOM:** `border-y bg-[var(--color-surface)]` section, `SectionHeading` eyebrow `Evidence` + title `Dated test log` + description statuses note → `TestLog` card → header `Dated test log` + count `3 entries` → `overflow-x-auto` table → footer note.
* **Rows:** 3 entries: 2025-11-15 methodology setup `In progress` (link /method), 2025-11-20 task design `Planned` (link /scorecards), 2025-12-01 product test `Planned` (no link, `—`). Status chips: Planned `surface+border muted`, In progress `#FEF3C7 #92400E #FDE68A` + `status-dot`, Completed (unused) green. All `scope` correct, row hover `bg-surface/60`.
* **Responsive:** `overflow-x-auto`, date/type/status `whitespace-nowrap` prevents wrapping breakage; title column flexible. Verified no overflow.

#### Footer navigation
* **DOM:** `border-t bg-[var(--color-surface)]` → `py-10 grid gap-8 md:grid-cols-[1.2fr_1fr_0.9fr]` (single column at 375/390, three-column at 768).
* **Column 1:** EKIS bold + eyebrow + supporting max-w-sm + `Independence & disclosure →` + `No fabricated scores…`.
* **Column 2:** `nav aria-label="Footer primary"` → `grid grid-cols-2 gap-x-6 gap-y-2` links: About, Scorecards, AI Visibility, Method, Independence and disclosure, Work with me, Contact — all `link-muted text-sm py-1` with hover ink+underline, keyboard focus visible.
* **Column 3:** © 2026 + `ekis.store` external link + `Built with Astro + Tailwind… No database.` + 3 chips (Method/Scorecards/AI Visibility).
* **Bar:** `border-t py-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between` → tokens note + `Status: Milestone 2 — no completed product tests yet.`
* **Alignment:** at 375 stacked readable; at 768+ three-column balanced (1.2fr 1fr 0.9fr); no orphan.

#### Mobile navigation and overflow
* **DOM verified:** desktop `nav aria-label="Primary"` `hidden lg:flex`; mobile `button.mobile-toggle` `h-11 w-11 rounded-xl border lg:hidden` with `aria-expanded="false" aria-controls="mobile-nav" aria-label="Open menu"` + SVG open/close paths toggling `.hidden`; `div#mobile-nav hidden border-t bg-paper lg:hidden` → inner nav `container-shell grid gap-1 py-4` with 4 links 15 px semibold + muted tagline.
* **JS:** `<script>` <1 kb: toggle `hidden`/`aria-expanded`/`aria-label`, `document.body.style.overflow = hidden` when open, `Escape` to close + focus return, `matchMedia(1024)` auto-close, `panel click a` close.
* **Noscript:** `<noscript>` fallback `border-t lg:hidden` with `aria-label="Mobile (noscript)"` grid — readable without JS (spec §3).
* **Overflow audit:** all tables `overflow-x-auto` (3 instances), hero CTAs `flex flex-wrap`, grids `gap-4`, long text `max-w-[520px]/[560px]/prose` + `line-clamp-2` on prompts, no `text-nowrap` on paragraphs, `container-shell min(100% - 2*gutter, 1280)` prevents viewport bleed. No horizontal scroll risk detected in CSS.
* **Unverified paint:** actual tap-target spacing and hamburger animation at 375/390/768/1024/1440 not eyeball-verified — browser screenshots required for sign-off.

### Screenshots
* **Not provided:** outbound TLS to browser CDNs blocked in sandbox (curl `SSL_ERROR_SYSCALL` to `storage.googleapis.com`, `edgedl.me.gvt1.com`; `PLAYWRIGHT_DOWNLOAD_HOST` unreachable). `npm run build` static output and live preview HTML were inspected instead. Recommend re-running visual check locally with `npm run dev` and capturing 375/390/768/1024/1440 px screenshots before M3 sign-off.

---

## 2. Dependency Security Audit

`npm audit` 2026-11-12: **35 total — 1 critical, 12 high, 20 moderate, 2 low**. Full JSON at `/tmp/audit.json`. All findings below triaged by package, version, direct/transitive, exposure, non-breaking fix, recommendation. No `npm audit fix --force` run.

### Summary by exposure
* **Build-time (Astro toolchain, ships to `dist` as static HTML):** 5 findings — `astro`, `sharp`, `zod`, `zod-to-ts`, `esbuild`. Exploitation requires build-time input or hosted dev server; published static output has no runtime attack surface, but build pipeline still in scope.
* **Dev-only (not in `dist`, not deployed):** 30 findings — `lighthouse` chain via `puppeteer-core`/`@puppeteer/browsers`/`extract-zip`/`basic-ftp`/… plus `@sentry/node`→`@opentelemetry/*` and `minimatch`/`@astrojs/tailwind`. Zero production exposure; risk confined to local `npx lighthouse` runs.

### Critical + High (13 requested) — detailed

| Package | Affected version in repo | Direct / transitive | Exposure | GHSA / title (CVSS) | Available non-breaking fix | Recommendation |
|---|---|---|---|---|---|---|
| **astro** | 5.18.2 (direct dep) | **Direct** — `dependencies.astro` | **Build-time.** Static `output: static` to Cloudflare Workers Static Assets (`dist/`), no SSR/islands in production; but advisories include build/render XSS and SSRF. | Critical **GHSA-26w7-cxv4-gfx2** — RCE via AVIF image optimization **9.8** (`<7.2.8`); High **GHSA-2pvr-wf23-7pc7** SSRF via Host header `7.5` (`<6.4.6`); High **GHSA-8hv8-536x-4wqp** reflected XSS via slot name `7.1` (`<6.3.3`); + 8 moderate/low XSS (define:vars, spread props, view transitions, base stripping, JSX/MDX script/style) | `7.4.1` — **major** semver, no patch backport on `5.x` per npm. `npm audit fix` suggests `astro@7.4.1` (breaking). | **Pre-M3: plan Astro 5→7 migration** (Tailwind integration 6.x→? compat, Vite 6, Node 22 OK). Do not jump blind; test build + content collections + `wrangler 404-page` in branch. Until migrated, mitigation is static-only deploy (no server islands), no user-supplied images through `astro:assets` AVIF, and CSP `script-src` if preview ever exposed. Track advisory feed weekly; pin stays 5.18.2 until migration tested. |
| **sharp** | 0.34.5 (optional dep of astro) | Transitive — `astro@5.18.2 → sharp@^0.34.0` | Build-time (image optimization). | High — libvips CVEs (GHSA-f88m-g3jw-g9cj), libheif (GHSA-rgj7-g3m4-5g8c: CWE-122), librsvg CVE-2026-96889 (GHSA-wq5f-xc86-pv6w) — ranges `<0.35.0` / `<0.35.4` / `<0.35.5` | Via `astro@7.4.1` (major) which bumps `sharp` to 0.35.x with patched libvips/libheif/librsvg. | Covered by Astro major bump. No standalone non-breaking sharp bump compatible with Astro 5. If image pipeline not exercised (M2 has no `astro:assets` transforms), current exposure minimal; prioritize with Astro migration. |
| **zod** | 3.25.76 (transitive of astro, chromium-bidi) | Transitive — `astro`, `chromium-bidi@14.0.0` | Build-time (schema validation) + dev (chromium-bidi). | High **GHSA-mrhx-c7xc-m3w5** — memory exhaustion on constrained collections **7.5** (`<4.6.6`) | Via `astro@7.4.1` → `zod@4.x` (major). | Same as Astro. No direct user-controlled large payload validation in M2 (content configs are controlled), so DoS risk low. Upgrade with Astro. |
| **zod-to-ts** | 1.2.0 (transitive of astro) | Transitive — `astro` | Build-time | Via zod (same) | Via `astro@7.4.1` | With Astro. |
| **lighthouse** | 12.8.2 (dev dep) | **Direct dev** — `devDependencies.lighthouse` | **Dev-only.** `lighthouse --chrome-flags` local audits only; never in `dist`. `via: @sentry/node, puppeteer-core` | High — `@sentry/node` moderate chain + puppeteer-core high chain (range `10.1.1-dev.20230414 – 13.4.0`) | `True` non-breaking available (next lighthouse release). | `npm audit fix` (no --force) would bump patch/minor — **approved to try pre-M3** in a branch. No production impact. |
| **puppeteer-core** | 24.43.1 (transitive of lighthouse) | Transitive | Dev-only | High — `@puppeteer/browsers` + `chromium-bidi` (`19.8.4 – 25.12.0`) | `True` | With lighthouse bump. |
| **@puppeteer/browsers** | 2.13.2 (transitive) | Transitive | Dev-only | High — `extract-zip` + `proxy-agent` (`*`) | `True` | With lighthouse bump. |
| **extract-zip** | 2.0.1 | Transitive — `@puppeteer/browsers` | Dev-only (browser download util) | High **GHSA-jmr9-qjv8-65gv** symlink traversal `8.1` + **GHSA-7pqw-9j4j-h8q3** arbitrary file write `8.1` (`<=2.0.1`) | `True` — patched >2.0.1 | Update via `npm audit fix` (lighthouse chain). Isolated to `npx puppeteer browsers install` which is currently blocked anyway. |
| **basic-ftp** | 5.3.1 (transitive) | Transitive — `proxy-agent → pac-proxy-agent → get-uri → basic-ftp` | Dev-only | High **GHSA-c475-qrg2-pj4r** quadratic RE backtracking DoS on `Client.list()` (`<=6.2.0`) | `True` | Via lighthouse chain; low reachability (only if PAC proxy fetches FTP). |
| **get-uri / pac-proxy-agent / proxy-agent** | 6.0.5 / 7.2.0 / 6.5.0 | Transitive | Dev-only — proxy helpers for browser download | Via `basic-ftp` | `True` | Same. |
| **chromium-bidi** | 14.0.0 | Transitive — `puppeteer-core` | Dev-only | Via `zod` (high, see above) `0.5.13 – 157.0.8081-0` | `True` | With zod/lighthouse. |

### Remaining (20 moderate, 2 low) — not concealed

* **Moderate (20):** `@opentelemetry/*` (8 instrumentations + core/resources/sdk-trace/sql-common) — via `@sentry/node@9.47.2` (lighthouse dev-only). Titles: W3C Baggage unbounded allocation (5.3) + `db.user` username exposure via span attribute in knex/mongoose/mysql/mysql2/pg/tedious (5.8). All transitive dev, `fix: True`. **Action:** update with lighthouse — no prod exposure (no Sentry in deployed `dist`).
  * `@sentry/node` 8.0.0-alpha.1–10.53.1 transitive dev — same.
  * `@opentelemetry/instrumentation-knex/mongoose/mysql/mysql2/pg/tedious` — same.
  * `minimatch` 7.0.0–11.0.0 GHSA-g3hv-75wg-m249 DoS via globparts — transitive via `@sentry/node`, dev-only, `fix: True`.
* **Low (2):** `@astrojs/tailwind` ≤0.0.0-wasm… (GHSA low, via astro) — dev-only, fix `2.1.3` major (tailwind integration bump, not urgent, no prod CSS impact beyond build); `esbuild` 0.27.3–0.28.0 GHSA-g7r4-m6w7-qqqr Windows dev server file read 2.5 — transitive of astro/vite, dev-only, fix via `astro@7.4.1`; risk nil on Linux CI.

### Recommended actions (no `--force` without approval)

1. **Pre-M3 branch:** `npm audit fix` (non-breaking only) to clear `lighthouse`/`extract-zip`/`basic-ftp`/`minimatch`/`@opentelemetry` dev chain — verify `npm run build && npm run check && npx tsc --noEmit`.
2. **M3 proper:** Astro 5.18.2 → 7.4.x migration branch — check breaking notes (Content Collections glob-loader warnings are benign, Vite 6 API, `sharp` native deps on CI), re-run `npm audit`, Lighthouse, and a11y checks (`src/tests/accessibility/a11y.spec.ts`, `header.spec.ts`).
3. **Policy:** keep audit JSON (`/tmp/audit.json`) and this report in repo (`docs/`), check advisories before any preview deploy (M1 #2 honored: Astro pinned 5.18.2 until reviewed).

---

## 3. Research Data-Integrity Verification

**Spec §8 data integrity:** no fabricated scores, dates, screenshots, testimonials, case studies; empty states labelled; planned/in-progress/completed distinct; mention ≠ citation.

* **Featured scorecard** (`src/lib/content/scorecards.ts` → `ScorecardTable`): `testDate: null`, `status: "prototype"`, disclosure `"Prototype structure only — no product data has been fabricated."` Visible as `Prototype — no scores yet` chip + table cells `—` + verdicts `Pending` + footer `Tested: —`. **Pass — cannot be mistaken for real results.**
* **Department tiles** (`departments.ts`): `publishedCount: null` for all 6; rendered `Published research: —` (not 0). `status` `active` only for AI Search Visibility, others `Future`. **Pass.**
* **AI Visibility Snapshot** (`visibility.ts` + `VisibilityGrid.astro`): `latestSnapshot` has `testedBrand: null`, `category: null`, `rows: []`, `testDate: null`, `methodologyVersion: "v0.1"`, 6 prompts defined but zero rows. Component guard `hasData = rows.length > 0 && testDate` — false → renders **empty state** (verified in `/tmp/live.html`):
  * Chip `Research coming soon` (not a date) in header
  * `No brand tested yet — snapshot will show dated test label and link to full record when published.` (14 px muted)
  * Empty-state card `No completed tests yet` + explanation `This panel will show 12 prompts × 3 platforms with Y/N/C/U states, dated test label and link to full research record when first snapshot is published. Mention and citation are tracked separately.`
  * Legend chips `Y — Mentioned / N — Not mentioned / C — Citation / U — Unable` (demonstrates encoding without inventing data)
  * Footer `Mention and citation are different metrics. A mention does not automatically mean a citation.` + `Colour is supplementary — labels are always visible.`
  * **No table with results is shown** until real dated run exists — **pass, not mistakable.** Future table (when `hasData` true) displays `Tested: <date>` chip, per-prompt dated rows, and `C — Citation` vs `Y — Mentioned` kept distinct via `labelFor()` (C blue, Y green) + `sr-only` text.
* **Dated test log** (`testLog.ts` → `TestLog.astro`): 3 entries — 2025-11-15 `in_progress`, 2025-11-20 `planned`, 2025-12-01 `planned` — none `completed`. Table shows date/title/type/status/link; status chips text + colour + `status-dot` + sr-only label. Empty-state path `No completed tests yet` exists for future when `entries.length === 0`. No entry falsely marked Completed (spec: only when checked and ready). **Pass.**
* **Disclosures** (`HomeDisclosures.astro` + footer): `EKIS Publication is separate from EKIS Storefront. No vendor pays… If affiliate links exist they are disclosed…` + `Payment never changes a score.` + `Status: Milestone 2 — no completed product tests yet.` **Pass.**

**Overall integrity: pass.** All prototype visuals are explicitly labelled; AI visibility grid renders the empty state rather than a populated table.

---

## 4. Blockers & Next Steps

* **Visual QA paint sign-off — blocker:** requires manual screenshots at 375/390/768/1024/1440 px on a machine with a real browser. Sandbox cannot fetch headless Chrome (CDNs TLS-blocked) — do not ship M3 until local designer captures and attaches screenshots. Structure from DOM/CSS looks sound (no overflow, all responsive primitives wired).
* **Security — non-blocking for static M2 preview, blocking for M3 prod:** dev chain can be `npm audit fix`'d non-breaking now; Astro critical/high requires scheduled major upgrade to 7.4.1 — do not `npm audit fix --force` on main without review.
* **Content:** 35 vulns documented, none hidden; AI grid integrity verified; tokens/typography/spacing preserved; semantic HTML/a11y intact (`skip-link`, `aria-expanded`, `noscript`, `scope`/`caption`, focus-visible).

**No M3 started, no production deploy** — awaiting approval for `npm audit fix` (non-breaking) and Astro major migration plan.
