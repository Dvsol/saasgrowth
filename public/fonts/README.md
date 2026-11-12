# Fonts — Inter

Per spec, use locally hosted Inter when licensing permits.

Download Inter from https://github.com/rsms/inter/releases and place:

- `Inter-Regular.woff2` (400)
- `Inter-Medium.woff2` (500)
- `Inter-SemiBold.woff2` (600)
- `Inter-Bold.woff2` (700)

Current M1 scaffold uses system fallback + Google Fonts fallback via `<link>` for preview,
and will be swapped to local files once licensed copies are added. The `@font-face`
declarations in `src/styles/global.css` will point to `/fonts/Inter-*.woff2`.

To keep the initial build dependency-free, M1 loads Inter via `link` preload and falls back
to system-ui. No layout shift occurs because metrics are matched.

See `src/layouts/BaseLayout.astro` for the preload.
