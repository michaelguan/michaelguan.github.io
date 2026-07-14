# AGENTS.md

Compact agent guide for `michaelguan.github.io`. **Read `CLAUDE.md` first** — it is the authoritative, detailed instruction file for this repo. This file only captures what an agent would likely miss or get wrong without it.

## What this repo is

Pure static personal blog on GitHub Pages. **Zero build step, zero dependencies, zero framework.** Vanilla HTML/CSS/JS. Deploy = `git push`. Never introduce npm/build/Jekyll/templates.

## The one architectural fact that breaks naively-written code

`index.html` is a persistent shell; content is loaded into `<iframe name="content-frame">`. The same `libs/js/router.js` runs in **both** parent and child, self-detecting via `window === window.top`:

- **Parent** owns the iframe, History API, hash routing, active-nav highlight, breadcrumb, article count.
- **Child** (a page inside the iframe) only re-binds `.nav-item[data-category]` so clicks bubble up via `window.parent.blogRouter.navigateTo(route)`.

If you forget the dual-context design you'll either break iframe navigation or duplicate routing logic. `layout.js` is parent-only (three-column collapse, mobile drawers, danmaku, `localStorage` persistence under key `blog-layout-state`).

## Linking rules (violating these silently breaks the frame)

- Category nav: `<a href="#tech" class="nav-item" data-category="tech">` — router intercepts, hash drives iframe src.
- Article link: `<a href="/pages/<cat>/<slug>.html" data-frame-link target="content-frame">`.
- External: `target="_blank" rel="noopener noreferrer"`.
- **Never** `target="_top"` or `target="_parent"` on internal links — that escapes the frame and reloads the shell.

## Adding an article is multi-file (counts are hand-maintained, easy to drift)

`ROUTES` and the displayed article counts/badges are **not** derived from the filesystem. When you add or remove an article you must update all of:

1. Create `pages/<cat>/slug.html` (copy an existing article as template — it must link its own CSS: `reset`, `theme`, then `article`).
2. Add the link to the `.subnav` list under its category in `index.html`.
3. Add the link to the category `index.html` listing + pagination status.
4. Update the `<span class="nav-item-badge">N</span>` next to the category in `index.html`.
5. Update the `counts` map in `setActiveNav` (`libs/js/router.js`) — format is `"N 篇文章"`.
6. Update the right-rail "最近" list and stats card in `index.html` if relevant.

To add a **new category**: also create `pages/<cat>/index.html`, add a `ROUTES` entry, and extend `validCategories` / `labels` / `counts` in `setActiveNav`.

## CSS: stay on semantic tokens or dark mode silently breaks

`libs/css/theme.css` has three layers — primitive → semantic → dark-mode overrides (under `@media (prefers-color-scheme: dark)` plus `[data-theme]` manual override). **Components must consume only semantic tokens** (`var(--accent)`, `var(--surface-base)`, `var(--border-base)`, …). Hardcoding `#6366f1` etc. in component CSS means dark mode stops working for that element.

- Link CSS via `<link>`, never `@import` (serializes requests).
- Content pages pull only what they need (`reset`, `theme`, + `category` or `article`) so the frame stays light.

## Commands

```bash
# Local dev — a server is REQUIRED (file:// breaks hash routing + iframe)
python -m http.server 5173
# then open http://localhost:5173

# Deploy (Git Bash / WSL / Linux / macOS) — optional commit message
./deploy.sh "your message"   # no arg → "update YYYY-MM-DD HH:MM:SS"
# Windows legacy (logs to github.log)
run.bat
```

Both wrappers run `git add . && git commit && git push`. Only commit/push when the user explicitly asks.

## Hard constraints (from CLAUDE.md, enforced here)

- ❌ No `package.json` / npm / yarn / pnpm / build scripts.
- ❌ No React/Vue/Svelte or any framework — the framework-free design is intentional.
- ❌ No large libs in `libs/` (jQuery/ECharts/sql.js were already removed).
- ❌ No `document.write` / `document.writeln`.
- ❌ No Jekyll (`_config.yml` / `_posts/` / `.nojekyll`) — plain static tree served as-is.
- ❌ No hardcoded hex colors in component CSS.
- ❌ No `target="_top"`/`_parent` on internal links.
- Images go in `imgs/`, referenced as `/imgs/filename.jpg`, optimized (WebP, <200KB).

## Personal data

Author: Michael Guan · `guan_tao@outlook.com` · GitHub `@michaelguan`.
