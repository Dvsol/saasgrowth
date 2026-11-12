# M3A Final QA & Merge Authorisation — Report

**Source:** `arena/m3a-astro-security-7x@48088d6` → **Target:** `arena/bdd56760-saasgrowth` (M2 checkpoint `93728d3` preserved)  
**Date:** 2026-11-12  
**Branch for verification:** `arena/m3a-astro-security-7x` (checked out, not yet merged — awaiting approval per gate)  
**No production deploy, no M3B, no unrelated upgrades, no Tailwind migration.**

---

## 1. Browser QA — 5 viewport widths (real-browser)

**Required widths:** 375px, 390px, 768px, 1024px, 1440px

**Attempted real-browser tooling:**
- `npx playwright install chromium` / `firefox` / `chrome --with-deps` — all fail with `Client network socket disconnected before secure TLS connection was established` to `cdn.playwright.dev`, `playwright.download.prss.microsoft.com`, `edgedl.me.gvt1.com`, `googlechromelabs.github.io`.
- `sudo apt-get install chromium/libnspr4/libnss3` — `deb.debian.org` (`151.101.*` Fastly) `Connection failed` / `Empty reply` (outbound allowlist is only `github.com, codeload.github.com, api.github.com, registry.npmjs.org, pypi.org, files.pythonhosted.org`).
- Fallback `@sparticuz/chromium@153.0.0` via `registry.npmjs.org` succeeded (binary extracted to `/tmp/chromium` 200 MB) but **missing system libs** (`libnspr4.so, libnss3.so, libnssutil3.so`) — same `deb.debian.org` block prevents apt install; `ldd /tmp/chromium` shows `not found`.
- No system `chromium`, `google-chrome`, `file` binary available.

**Result: QA GATE BLOCKED by sandbox egress policy — not code.** No screenshots captured. Per instructions *“If any QA gate fails, stop and report before merging”* — **merge NOT executed**.

**Fallback manual inspection (current M3A preview not started, but M3A build is byte-identical UI to M2 which was live on `0.0.0.0:4321`):**
- `curl http://127.0.0.1:4321` (M2) + `dist/index.html` inspection shows 9 `<section>` (hero + 6 dept grid + visibility dark panel + test-log + method + work-with-me + disclosures), `tables:2` with `overflow-x-auto:3`, grids `lg:grid-cols-[1.05fr_0.95fr]` (hero), `sm:grid-cols-2 lg:grid-cols-3` (departments), `md:grid-cols-3` (method), `md:grid-cols-[1.2fr_1fr_0.9fr]` (footer).
- `container-shell` = `min(100% - 2*var(--gutter), 1280)` with `--gutter-mobile 20 / tablet 28 / desktop 32` + `--content-max 1280` → fluid at 375/390, 2-col at 768, 3-col at 1024, centered at 1440 — no `min-width` overflow risk.
- Header: `mobile-toggle h-11 w-11 lg:hidden aria-expanded aria-controls="mobile-nav"` + `hidden lg:flex` desktop nav + `noscript` fallback + `Escape` JS — present.
- **Must not be reported as completed browser QA** — requires off-sandbox run:

```bash
git checkout arena/m3a-astro-security-7x
npm ci --legacy-peer-deps
npm run dev -- --host 0.0.0.0 --port 4321
npx playwright install chromium  # outside sandbox
node qa-5view.cjs  # capture 375,390,768,1024,1440
```

**Findings to verify when browser available:** horizontal overflow, header/mobile nav toggle, hero vs featured scorecard at `lg:`, department grid 1→2→3 col, AI visibility dark panel + empty-state legend `Y/N/C/U`, tables `overflow-x-auto` + `—/Pending` empty states, method 3-col, footer 1→3 col, buttons/links focus states.

---

## 2. Clean-install verification (M3A branch)

**1. `npm ci --legacy-peer-deps`** (original `npm ci` fails with `ERESOLVE @astrojs/tailwind peer astro ^3||4||5 vs astro@7.3.8` — documented, `--legacy-peer-deps` is expected workaround):
```
added 442 packages, audited 443 packages in 10s
130 packages are looking for funding
found 0 vulnerabilities
```

**2. `npm audit --json`** → `/tmp/clean-audit-final.json`:
```json
{"vulnerabilities":{"info":0,"low":0,"moderate":0,"high":0,"critical":0,"total":0}}
```
Previous M2 was `35` (1 critical AVIF 9.8, 12 high, 20 moderate, 2 low). **Now 0 — confirmed.**

**3. `npm run check`:**
```
[content] Synced content
[types] Generated 567ms
[check] Getting diagnostics...
Result (38 files):
- 0 errors
- 0 warnings
- 0 hints
```
(M2 had deprecated-`z` hints; fixed via `astro/zod` + `z.url()`).

**4. `npm run build`:**
```
[build] output: static
[build] 12 page(s) built in 1.37s
Complete!
```

**5. Routes + `dist/404.html`:**
```
dist/404.html
dist/index.html (27K)
dist/about/index.html
dist/ai-visibility/index.html
dist/blog/index.html
dist/contact/index.html
dist/free-tools/index.html
dist/independence/index.html
dist/method/index.html
dist/scorecards/index.html
dist/videos/index.html
dist/work-with-me/index.html
```
All 12 expected + `dist/404.html` present. `wrangler.jsonc` `not_found_handling: 404-page` preserved.

Outputs saved: `/tmp/clean-audit-final.json`, `/tmp/check-output.txt`, `/tmp/build-output.txt`.

---

## 3. Branch diff (preserved M2 checkpoint)

```
origin/arena/bdd56760-saasgrowth 93728d3 → origin/arena/m3a-astro-security-7x 48088d6
 docs/M3A-security-compatibility-report.md |   201 +
 package-lock.json                         | 12256 ++++++------
 package.json                              |     4 +-
 src/content.config.ts                     |     8 +-
```

No homepage/component/token changes — M2's 7 sections identical.

---

## 4. Outstanding risks

- **No merge performed** — awaiting real-browser screenshot approval.
- **Peer warning not suppressed** (`npm warn ERESOLVE overriding peer astro@7.3.8 found @astrojs/tailwind 6.0.2 peer ^3||4||5`) — documented in M3A report, not hidden; build still passes.
- **Node version:** M3A uses `astro@7.3.8` (`engines >=22.12.0` OK on `22.22.3`); `7.4.11` (latest) needs `>=22.23.4` — document for future CI bump.
- **No M3B, no deploy** — as required.

---

## 5. Merge authorisation — pending

**Result:** Clean-install gates **PASS** (0 vulns, type-check/build/routes/404 OK). **Browser QA gate FAIL** due to sandbox network — **merge withheld**.

**Next:** Run 5-width screenshots on unrestricted host, attach to this report, then merge:

```bash
git checkout arena/bdd56760-saasgrowth
git merge --no-ff origin/arena/m3a-astro-security-7x -m "Merge M3A security: Astro 5.18.2→7.3.8, lighthouse 13.6.0, 35→0 vulns (48088d6)"
git log --oneline -4  # verify 93728d3 still in history
```

M2 checkpoint `93728d3` will remain reachable (`git show 93728d3`) after merge — not rewritten.
