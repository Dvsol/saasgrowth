# M3A Security & Compatibility Report — EKIS Publication

**Branch:** `arena/m3a-astro-security-7x` (from `arena/bdd56760-saasgrowth` @ `93728d3`)
**Date:** 2026-11-12
**Astro upgrade:** `5.18.2` → `7.3.8` (critical AVIF RCE patched, latest `7.4.11` requires Node `>=22.23.4`)
**No production deploy. No M3B templates yet.**

---

## 1. Astro upgrade — investigation

**Advisory:** GHSA-26w7-cxv4-gfx2 — Astro `< 7.2.8` AVIF image optimization RCE `CVSS 9.8`; confirmed `5.18.2` vulnerable.

**Current patched release check (2026-11-12):**
- `npm view astro dist-tags.latest` → `7.4.11`
- `npm view astro versions` last entries: `7.2.8` (first patched), `7.3.8`, `7.4.11` (latest)
- Task explicitly said *do not target 7.4.1 without checking current* — checked; `7.4.11` is latest.

**Node constraint investigated:**
- Local Node `v22.22.3` / npm `10.9.8`
- `astro@7.4.11` `engines.node` = `>=22.23.4` → build fails (`Node.js v22.22.3 is not supported`)
- `astro@7.3.8` `engines.node` = `>=22.12.0` → passes; `astro@7.2.8` same.
- Since `7.3.8` is `>= 7.2.8` and shares same security patches (`7.3.8` includes all fixes through `7.2.8` + additional hardening) and runs on available Node, **selected `7.3.8` as current compatible patched release**. Documented here for M3A; if CI upgrades Node to `22.23.4+`, `7.4.11` is drop-in (`npm install --save-exact astro@7.4.11`).

**Compatibility matrix verified:**

| Package | Before | After | Compatible? | Notes |
|---|---|---|---|---|
| `astro` | `5.18.2` | `7.3.8` | ✅ | `output: static`, `site`, `trailingSlash`, `server.host/allowedHosts` all still valid (tested `build`/`dev`). `zod` now `4.6.7` via `astro@7.3.8`, vite `8.3.1` (was `6.4.6`), all content schemas migrated (`astro/zod`). |
| `@astrojs/tailwind` | `6.0.2` | `6.0.2` | ⚠️ peer warning | `peer astro ^3 \|\| ^4 \|\| ^5` — newest `6.0.2` still advertises 5 max. `npm install` warns `ERESOLVE overriding peer / invalid: ^3..5 from node_modules/@astrojs/tailwind`. **Integration still works** — build/dev produce correct Tailwind output (verified `dist/_astro/site.*.css` contains tokens). Documented as known peer mismatch; upstream `@astrojs/tailwind` needs release for Astro 7. Workaround: installs use `--legacy-peer-deps`; no functional break. Alternative (future) is Vite `@tailwindcss/vite` plugin, not adopted to keep scope minimal. |
| `tailwindcss` | `3.4.19` | `3.4.19` | ✅ | No change; `3.4.x` fully compatible with Vite 8. Not upgraded unnecessarily per task. |
| `typescript` | `5.8.3` | `5.8.3` | ✅ | `@astrojs/check@0.9.4` peer `typescript ^5.0.0 \|\| ^6.0.0` — compatible with Astro 7. |
| `zod` content schemas | `astro:content` `z` (`zod 3.25.76`) + `z.string().url()` | `astro/zod` `z` (`zod 4.6.7`) | ✅ | Migrated `src/content.config.ts`: `import { defineCollection } from "astro:content"; import { z } from "astro/zod";` and `z.string().url() → z.url()`. `astro check` now `0 errors 0 warnings 0 hints` (was deprecated-hint warnings). Zod 4 stores `_zod` marker, content-layer `superRefine` check passes; build synced content with no errors. |
| `sharp` (Astro optional) | `0.34.5` | `0.35.5` | ✅ | Pulled via `astro@7.3.8` bump; patched libvips/libheif/librsvg CVEs. |
| `vite` | `6.4.6` (via astro 5) | `8.3.1` (via astro 7.3.8) | ✅ | No custom Vite plugins; `astro.config.mjs` `vite.server.host/allowedHosts` still honored. |
| `@astrojs/check` | `0.9.4` | `0.9.4` | ✅ | Works with Astro 7.3.8; check passes. Latest `0.9.12` available but not upgraded unnecessarily. |
| `Wrangler / CF Static Assets` | — | — | ✅ | `wrangler.jsonc` `assets.directory ./dist` + `not_found_handling: "404-page"` validated (`dist/404.html` present, 12 routes static). No wrangler upgrade needed (`4.160.1` current). |

**Unrelated packages not upgraded:** `@axe-core/playwright`, `@playwright/test`, `tailwindcss`, `typescript` kept as-is.

---

## 2. Fresh npm audit — full JSON inspected

**Before (Astro 5.18.2, lighthouse 12.8.2):** `/tmp/pre-audit.json`
```
35 total — 1 critical (astro AVIF 9.8), 12 high, 20 moderate, 2 low
```
Critical/high included `astro` (AVIF RCE 9.8 + SSRF 7.5 + XSS 7.1 + 5 moderate XSS), `sharp` (libvips/libheif/librsvg), `zod`/`zod-to-ts` (7.5 mem exhaustion), `chromium-bidi` (via zod), `lighthouse`→`puppeteer-core`→`@puppeteer/browsers/extract-zip` (path traversal 8.1), `basic-ftp`/`get-uri`/`pac-proxy-agent`/`proxy-agent` (RE DoS + traversal), all transitive of `lighthouse 12.8.2` dev chain + `@sentry/node`→`@opentelemetry/*`.

**Intermediate (Astro 7.3.8, lighthouse 12.8.2):** `/tmp/post-fix2.json`
```
30 total — 0 critical, 10 high, 20 moderate, 0 low
```
Remaining 30: all `lighthouse` dev-chain + `chromium-bidi zod` high; `astro`/`sharp`/`esbuild` critical/high fixed by Astro bump.

**Non-breaking fixes attempted:**
- `npm audit fix` without flag: **ERESOLVE** due to `@astrojs/tailwind 6.0.2` peer pinning Astro 5.
- `npm audit fix --legacy-peer-deps`: still 30 — non-breaking patches not enough; `lighthouse@12.8.2` line holds vulnerable `@sentry/node 9.47.2` + `puppeteer-core 24.43.1`.

**Targeted remediation (allowed by task — dev deps non-breaking):**
- `npm install --save-dev --legacy-peer-deps lighthouse@13.6.0` (latest `13.6.0`, dist-tags `latest`): pulls `puppeteer-core 25.17.0` → `chromium-bidi 157.x` → `zod 4.6.7` deduped, patched `extract-zip`/`basic-ftp`/`minimatch`/`@opentelemetry`.

**After (Astro 7.3.8 + lighthouse 13.6.0):** `/tmp/final-audit.json`
```
0 total — 0 critical, 0 high, 0 moderate, 0 low
```
`npm audit` exit 0 with no vulnerabilities reported.

No `npm audit fix --force` run at any stage.

### Remaining vulnerabilities — none

All critical/high and all dev-chain moderate/low cleared via patched Astro + bumped lighthouse. No deferrals required.

| Package | Severity | Exposure | Fix | Reason to defer |
|---|---|---|---|---|
| — | — | — | — | None; all 35 fixed. |

Only **known non-vulnerability warning remains:** `EBADENGINE` / `ERESOLVE overriding peer` for `astro@7.3.8` vs `@astrojs/tailwind@6.0.2` peer `^3||4||5` (see compatibility table). Not a security finding; tracked for upstream fix.

---

## 3. Regression checks

### Install
```
npm install --save-exact astro@7.3.8   # 8 packages added, peer warn expected
npm install --save-dev --legacy-peer-deps lighthouse@13.6.0  # 27 added, 136 removed
npm audit  # 0 vulnerabilities
```

### Type-check
```
npm run check                       # 0 errors 0 warnings 0 hints
npm run check -- --minimumSeverity error  # Result (38 files): - 0 errors
```
Content config migration quieted former `z is deprecated` hints (`z.url()`).

### Build
```
npm run build  # 12 page(s) built in 1.42s  Complete!
```
**12 static routes verified** in `dist/`:
- `/` (`index.html`)
- `/404.html`
- `/about/index.html`
- `/ai-visibility/index.html`
- `/blog/index.html`
- `/contact/index.html`
- `/free-tools/index.html`
- `/independence/index.html`
- `/method/index.html`
- `/scorecards/index.html`
- `/videos/index.html`
- `/work-with-me/index.html`

All present and non-empty; `dist/_astro/site.*.css` retains tokens (`--color-ink #142B4A` etc).

### Custom 404 behaviour
- `wrangler.jsonc` unchanged: `"not_found_handling": "404-page"` (M2 `single-page-application` → `404-page` confirmed).
- `dist/404.html` exists with correct `<title>Page not found — EKIS</title>` and canonical `https://ekis.example.com/404/`.
- Local preview of missing path returns 404 page (Astro dev serves `src/pages/404.astro`).

### Homepage 7 sections
Verified in `dist/index.html` (live preview also curl’d):
- Hero + **Featured scorecard** (`Prototype — no scores yet`, `Tested: —`)
- **Browse by job** — 6 department tiles (`Published research: —` ×6)
- **AI Visibility Snapshot** lab panel — `Research coming soon` + `No completed tests yet` empty state + `Y/N/C/U` legend + `Mention ≠ citation`
- **Dated test log** — 3 rows `Planned/In progress` (none `Completed`), chips `Planned`/`In progress`
- **How we test** method preview (3 pillars)
- **Work with me teaser** + docs link
- **Complete footer** (`Independence and funding`, 3-col grid, no fabricated data)

Strings `grep -o` confirmed all 7 in built HTML.

### Local dev
```
npm run dev --host 0.0.0.0 --port 4321  # astro v7.3.8 ready in 974 ms
curl http://127.0.0.1:4321/  # returns heading "Independent tests of the tools SaaS founders use to grow"
```
Tested on both `4321` and `4322` ports; `allowedHosts: true` + `host: 0.0.0.0` still required and present.

### Wrangler
- `wrangler.jsonc` validated: `name ekis-publication`, `compatibility_date 2025-11-01`, `assets.directory ./dist`, `not_found_handling 404-page`
- `npx wrangler --version` `4.160.1`
- `output: static` in `astro.config.mjs` + Wrangler static assets — no worker code; no regression.

No production deploy performed.

---

## 4. Versions

**Previous → New:**

| Dependency | Previous | New | Notes |
|---|---|---|---|
| `astro` | `5.18.2` | `7.3.8` (exact) | Patched 7.2.8+; 7.4.11 deferred due Node `>=22.23.4` requirement |
| `lighthouse` | `12.4.0` (pkg) / `12.8.2` (resolved) | `13.6.0` | Remediates 20 moderate + 10 high dev chain |
| `sharp` | `0.34.5` (optional via astro) | `0.35.5` | Via astro bump, fixes libvips CVE-2026-* |
| `zod` | `3.25.76` (standalone) / `4.6.7` not yet | `4.6.7` (astro) + `3.25.76→4.6.7` deduped via `chromium-bidi 157` | Mem-exhaustion 7.5 fixed |
| `vite` | `6.4.6` | `8.3.1` | Via astro |
| `@astrojs/tailwind` | `6.0.2` | `6.0.2` (unchanged) | Peer warning documented |
| `tailwindcss` | `3.4.19` | `3.4.19` | — |
| `typescript` | `5.8.3` | `5.8.3` | — |
| `@astrojs/check` | `0.9.4` | `0.9.4` | — |

---

## 5. Vulnerability summary

| Metric | Before | Intermediate (Astro only) | Final (Astro + Lighthouse) |
|---|---|---|---|
| **Critical** | 1 (astro AVIF RCE 9.8) | 0 | **0** |
| **High** | 12 | 10 | **0** |
| **Moderate** | 20 | 20 | **0** |
| **Low** | 2 | 0 | **0** |
| **Total** | 35 | 30 | **0** |

**Remaining exposures: none.** No high/critical/mod deferred; no `force` used.

---

## 6. Integration changes

- `package.json`: `astro: 7.3.8` (exact), `lighthouse: 13.6.0` — dev dep bump only for security; no unrelated upgrades.
- `src/content.config.ts`: `import { z } from "astro/zod"` (was `astro:content`) + `z.string().url() → z.url()` — required for Astro 7 / zod v4, eliminates `astro check` deprecation hints.
- `package-lock.json` updated; `.npmrc` not added (legacy-peer-deps only needed for install containing `@astrojs/tailwind` peer mismatch — documented, no config change to keep installs strict by default).

No Tailwind config, Wrangler, or homepage component changes; all M2 sections preserved.

---

## 7. Commit & branch

- **Branch:** `arena/m3a-astro-security-7x` (split from `arena/bdd56760-saasgrowth@93728d3`, parent M2 checkpoint untouched)
- **Commit to push:** pending `docs(M3A)` + code changes — see `git log` on branch
- **Build:** `npm run check` 0/0/0, `npm run build` 12 pages, `npm audit` 0 vulns, `dev` verified, `404-page` verified

**Do not begin M3B** until this report is reviewed.
