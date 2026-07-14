# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A self-contained HTML slide deck (presentation) about **OpenCode** — an open-source AI coding agent — written in Chinese (zh-CN). Despite the directory name `anthropic-financial-services`, the actual content is an OpenCode intro deck. There is no backend, no package manager, no build step, and no tests. The deck is meant to be opened directly in a browser over HTTP (iframes with `file://` may be blocked by browser security policies).

## How to run

Serve the directory over HTTP and open `index.html`:

```bash
# from the project root — pick any static server
python -m http.server 8000
# then visit http://localhost:8000/
```

Opening `index.html` via `file://` may fail to load the slide iframes depending on the browser's file-access policy — always go through a local HTTP server.

## Architecture

### Two-layer structure

- **`index.html`** — the *host shell*. It links `libs/reveal.css` + a swappable theme (`libs/simple.css` by default), `libs/tailwind.js` (Tailwind CDN runtime), and `libs/reveal.js` (Reveal.js, loaded as a classic `<script>`, not a module). On `DOMContentLoaded` it **generates all 32 slide slots at runtime** (`totalSlidesCount = 32`) as `<section><iframe class="slide-iframe" data-src="./slides/NN.html"></iframe></section>`, then initializes Reveal.js. Slides are *lazy-loaded*: an iframe's `src` is only set when Reveal navigates to that slide (`slidechanged` / `ready` events), and a CSS fade-in (`opacity 0 → .iframe-visible`) fires on `iframe.onload`. A defensive `forceShowFirstSlide` runs at 50ms/200ms to avoid a blank first frame.
- **`slides/NN.html`** (01–32) — each slide is a **standalone full-viewport HTML page** with its own `<head>`. Each slide re-includes `../libs/tailwind.js` and `../libs/style.css`. The slide body is always:
  ```html
  <div class="slide-container" id="slide-track">
    <div class="slide"> ...content... </div>
    <!-- some slides add more <div class="slide"> siblings for the flex "slide-track" horizontal scroll, but most are single-slide -->
  </div>
  ```
  There is **no per-slide JavaScript** — every slide has exactly one `<script>` tag (the Tailwind runtime). All interactivity lives in the host shell.

### Theming

Themes are swapped at runtime by changing `#theme-link`'s `href` to `./libs/{black|league|dracula|solarized|simple}.css` via `#theme-select`. Note this affects the *shell's* Reveal chrome, not the slide bodies — each slide's own `<style>` hardcodes `background-color:#f8fafc` and a `linear-gradient` `.slide` background, so slides always render light regardless of the selected Reveal theme.

### `libs/`

- `style.css` — the **Phosphor icon font**: `@font-face` for the Phosphor family plus ~2000 `.ph.ph-*:before { content: "\e..." }` glyph mappings. Icons are used via `<i class="ph ph-<name>"></i>`. Font binaries: `Phosphor.woff2/.woff/.ttf`.
- `reveal.js`, `reveal.css` — Reveal.js engine + base styles.
- `tailwind.js` — Tailwind CDN runtime (provides utility classes at runtime; there is **no Tailwind build/config** in this repo).
- `simple/black/league/dracula/solarized.css` — Reveal theme skins.

### Notable gotchas

- **The displayed counter undercounts by one:** `index.html` sets `total-index-display` to 31 while `totalSlidesCount` is 32, so the "X / 31" indicator is off by one. The deck loops (`loop: true`) and has 32 physical slides.
- **`card-gradient-border-slate`** is referenced in some slides (e.g. `05.html`) but is **not defined** in any CSS file — it currently renders as a no-op class. The defined card classes are `card-gradient-border` and `card-gradient-border-blue`, both declared per-slide inside each slide's `<head><style>`.
- **Shared slide CSS is duplicated** in every slide's `<head><style>` (`.slide`, `.slide-container`, `card-gradient-border*`, font-family, `overflow:hidden`). If you change a shared slide style, you must edit it across all 32 slides — there is no shared slide stylesheet.
- `Reveal.initialize` is called with `width:"100%" height:"100%"` and `minScale:1 maxScale:1` so the deck fills the viewport without Reveal's default scaling; layout uses `100vw`/`100vh`.
- UI chrome (prev/next buttons, the bottom-right control panel) auto-hides after 3s of mouse idle via the `.mouse-idle-hide` class, and the theme selector collapses in fullscreen via `.fullscreen-hide`.

## Working in this repo

- **To edit slide content:** modify the relevant `slides/NN.html`. Keep the `slide-container`/`.slide` wrapper and the in-`<head>` shared `<style>` block in sync with the other slides.
- **To add a slide:** create `slides/33.html` (copy an existing slide's `<head>` block verbatim) and bump `totalSlidesCount` in `index.html`; the slot generation loop handles the rest. Also update the `total-index-display` literal if you want the counter correct.
- **To add an icon:** confirm the `.ph.ph-<name>` class exists in `libs/style.css` first — the font ships a fixed glyph set.
- **No build/lint/test tooling exists** — verification is done by reloading the page in the browser and stepping through slides (arrow keys, the on-screen prev/next buttons, or the overview grid toggled by the bottom-right grid icon / ESC).
