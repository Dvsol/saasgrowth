# AGENTS — EKIS Publication

This repository is Astro + TypeScript + Tailwind on Cloudflare Workers Static Assets.

## Milestone 1 (current)
- Design tokens in `src/styles/tokens.css` — single source of truth.
- Typography: Inter locally hosted (see `public/fonts/README.md`). Type scale per spec §5.
- Layout: `container-shell`, `container-narrow`, `section`, `card`.
- Header: `src/components/layout/SiteHeader.astro` with desktop/mobile, a11y, noscript fallback.
- Shared primitives: `Button.astro`, `Card.astro`, `SectionHeading.astro`, `Container.astro`.
- No database, no CMS UI, no fabricated data.

## Rules
- Use tokens, not hardcoded colors. Verify contrast (WCAG AA).
- All tables/grids must have textual labels — colour never alone.
- Label prototype states as "Prototype — no scores yet" where data missing.
- Static output only (`output: "static"`). JS only where interaction requires it.
- Branch workflow: `main` (prod), `development` (integration), `feature/*`.
- Do not deploy to production without explicit approval.
