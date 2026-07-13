# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the GitHub Pages site for `michaelguan.github.io`. A **pure static personal blog** built with vanilla HTML/CSS/JS — zero build step, zero dependencies, deployed directly to GitHub Pages.

**Tech Stack:**
- **Structure:** `index.html` (frame) + `pages/{tech,game,life}/*.html` (content loaded in an iframe)
- **Routing:** `libs/js/router.js` (~220 lines) — History API + iframe `src` switching; hash → route
- **Layout/interaction:** `libs/js/layout.js` (~175 lines) — three-column collapse, mobile drawers, danmaku loop, state persistence
- **Styling:** CSS Custom Properties (design tokens in `theme.css`) + modular CSS files in `libs/css/`
- **Deployment:** `deploy.sh` (cross-platform, Git Bash) / `run.bat` (Windows, legacy) — `git add . && commit && push`

## Layout Architecture ("The Reading Room")

`index.html` renders a persistent three-column shell that loads once and never reloads:

```
┌──────────────────────────── topbar (sticky) ────────────────────────────┐
│  brand · danmaku(scrolling mottos) · menu toggle                          │
├──────────┬────────────────────────────────────────┬──────────────────────┤
│ left-rail│            content-pane                  │   right-rail         │
│ (sticky) │  toolbar (breadcrumb, view toggle)      │   (sticky)           │
│  nav +   │  iframe[name=content-frame]            │   motto · stats ·    │
│  subnav  │                                        │   recent list        │
└──────────┴────────────────────────────────────────┴──────────────────────┘
                                footer
```

- `.app-layout` is a CSS grid with `data-left-collapsed` / `data-right-collapsed` attributes that `layout.js` toggles and persists to `localStorage` (key `blog-layout-state`).
- The `iframe[name="content-frame"]` holds the loaded content page; its `src` is swapped by the router and its `height` is auto-measured to the content's scroll height (`adjustFrameHeight` in `router.js`).
- On mobile (≤768px) the rails become fixed off-canvas drawers (`.left-rail.is-open`, `.right-rail.is-open`) over a `.backdrop`; the topbar danmaku and right-rail toggle are hidden.

## Routing Model (`libs/js/router.js`)

The same `router.js` is loaded in **both** `index.html` (parent) and each content page (child). It self-detects context via `window === window.top`:

- **Parent (`isParent`):** owns the iframe, binds `.nav-item[data-category]` and `[data-frame-link]` clicks, manages `history.pushState` / `popstate` / `hashchange`, sets active nav highlight, breadcrumb label (`[data-crumb-current]`), and article count (`[data-count]`).
- **Child:** only re-binds `.nav-item[data-category]` so category clicks inside the iframe bubble up to `window.parent.blogRouter.navigateTo(route)`.

`ROUTES` maps a short key to an iframe src path:

```js
const ROUTES = { tech: '/pages/tech/index.html', game: ..., life: ... };
```

Article links use `<a href="/pages/.../slug.html" data-frame-link target="content-frame">` — `data-frame-link` is the selector the parent binds, and `target="content-frame"` lets the browser load it into the named iframe even without JS. **Never** use `target="_top"`/`_parent` on content links — that breaks the frame.

Exposed global: `window.blogRouter = { navigateTo, getCurrentRoute, ROUTES }`.
Exposed global (from `layout.js`): `window.blogLayout = { toggleLeftRail, toggleRightRail, openMobileLeft, openMobileRight, closeMobileDrawer, getState }`.

To add a category: create `pages/<cat>/index.html`, add a `<nav>` entry + `.subnav` block in `index.html`, add the key to `ROUTES`, and update the `counts`/`labels` maps in `setActiveNav`.

## CSS Token System (`libs/css/theme.css`)

Three layers, in order:
1. **Primitive tokens** (`--color-indigo-600`, `--color-neutral-50`, …) — raw color values only.
2. **Semantic tokens** (`--surface-base`, `--text-primary`, `--accent`, `--accent-warm`, `--border-base`, spacing `--space-*`, type `--text-*`, radius, shadow, z-index, layout dims) — **components consume only these.**
3. **Dark mode** overrides the semantic layer (only) under `@media (prefers-color-scheme: dark)`. Manual override via `[data-theme="light"]` / `[data-theme="dark"]` on `:root` is also defined.

Don't hardcode hex colors in component CSS — use `var(--accent)`, `var(--surface-elevated)`, etc. Dark mode adjusts automatically as long as you stay on semantic tokens.

CSS files are linked via `<link>` in both `index.html` and content pages (HTTP/2 multiplexing makes this fine). **Never use `@import`** — it serializes requests. Content pages pull in only what they need (`reset`, `theme`, plus `category` for index pages or `article` for article pages), so the frame stays light. `index.html` links the shell styles: `theme · layout · leftnav · sidebar · main · iframe · reset`.

## Content Pages

Each page is a standalone HTML document loaded into the iframe and must link its own CSS (`reset`, `theme`, then `category` or `article`) and load `router.js` so its category links can bubble to the parent. See `pages/tech/index.html` as the template for category lists and any `pages/*/<article>.html` for article pages.

Article/category counts shown in the UI (badge counts, breadcrumb "N 篇文章", stats card, recent list) are **hand-maintained** in `index.html` and `router.js` (`counts`/`labels` maps). When you add or remove an article, update:
- The `<span class="nav-item-badge">N</span>` next to its category in the left rail
- The `counts` map inside `setActiveNav` in `router.js`
- The `.subnav` link list under the category in `index.html`
- The category index page's listing + pagination status
- The "最近" (recent) list and 文章/标签 stats in the right rail, if relevant

### Linking Rules
- **Category nav (index.html):** `<a href="#tech" class="nav-item" data-category="tech">` — router intercepts; hash drives the iframe src.
- **Category index → article:** `<a href="/pages/tech/slug.html" data-frame-link target="content-frame">`
- **External:** `<a href="https://..." target="_blank" rel="noopener noreferrer">`

## GitHub Pages Deployment

- **No Jekyll, no build.** The repo contains neither `_config.yml` nor `.nojekyll`; GitHub Pages treats the repo as a plain static file tree and serves files as-is. No Liquid templates, no `_posts/`, no plugins — every page is hand-written HTML.
- **Deployment is a git push.** No CI/CD — `git push` triggers the Pages rebuild (typically 30–60s). `deploy.sh` / `run.bat` are thin wrappers over `git add . && commit && push`.
- `imgs/` is empty; add optimized assets (WebP, <200KB) there and reference as `/imgs/filename.jpg`.

## Common Commands

### Local Development
```bash
# Simplest — any static server works; the frame + iframe need a server (file:// breaks routing)
python -m http.server 5173
# or: npx serve .
```
Open `http://localhost:5173` and click nav items to test routing. The iframe loads `pages/tech/index.html` by default and swaps on hash change.

### Deploy
```bash
# Cross-platform (Linux/macOS/WSL/Git Bash) — pass an optional commit message
./deploy.sh "your message"     # no arg → "update YYYY-MM-DD HH:MM:SS"
# Windows (legacy) — logs to github.log
run.bat
```
Both run: `git add . && git commit -m "<msg>" && git push`.

### Add New Article
1. Copy an existing `pages/<cat>/<article>.html` (article) or `pages/<cat>/index.html` (listing) as a template.
2. Create `pages/<category>/slug.html`.
3. Add the article link to the `.subnav` list under its category in `index.html` (left rail) and to the category `index.html` listing.
4. Update badge counts, the `counts` map in `router.js`, and the right-rail recent/stats cards as needed.
5. Test locally, then `./deploy.sh`.

## Conventions for This Repo

- **Zero external JS deps.** `router.js` + `layout.js` are the only JS files. No `node_modules`, no `package.json`, no build scripts.
- **CSS via `<link>`, never `@import`.**
- **Semantic + accessible HTML.** Skip link, `header[role=banner]`, `nav[role=navigation]`, `main[role=main]`, `footer[role=contentinfo]`, `time[datetime]`, `aria-current="page"` on active nav, `aria-expanded` on collapsible subnav toggles, focus-visible outlines, `prefers-reduced-motion` respected.
- **Mobile-first responsive.** Breakpoints: ≤1024px (tablet, shrinks rails) and ≤768px (single column + off-canvas drawers, danmaku hidden).
- **Images:** put in `imgs/`, reference as `/imgs/filename.jpg`, optimize (WebP, <200KB) before commit.
- **No inline styles** except `style="display:none"` toggled by JS. All styling in `libs/css/`.

## What NOT to Do

- ❌ Don't add npm/yarn/pnpm, `package.json`, or build scripts.
- ❌ Don't import React/Vue/Svelte — this is intentionally framework-free.
- ❌ Don't put large libraries in `libs/` (ECharts, sql.js, jQuery were all removed previously).
- ❌ Don't use `document.write` / `document.writeln` (a legacy `aboutme.js` did this).
- ❌ Don't hardcode colors like `#6366F1` in component CSS — use `var(--accent)` etc.
- ❌ Don't break the frame: internal links use `target="content-frame"`; external links use `target="_blank" rel="noopener noreferrer"`. Never `target="_top"`/`_parent`.
- ❌ Don't reintroduce Jekyll (no `_config.yml`, no `_posts/`, no `.nojekyll`). The site is served as a plain static file tree by GitHub Pages; templates/plugins would break the zero-build model. If the article count grows large, prefer a separate static generator (11ty/VitePress) producing static files, not Jekyll.

## Personal Data Notes

- Author: Michael Guan. Contact: `guan_tao@outlook.com`, GitHub `@michaelguan`.
