# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the GitHub Pages site for `michaelguan.github.io`. A **pure static personal blog** built with vanilla HTML/CSS/JS — zero build step, zero dependencies, deployed directly to GitHub Pages.

**Tech Stack:**
- **Structure:** `index.html` (frame) + `pages/{tech,game,life}/*.html` (content)
- **Routing:** `libs/js/router.js` (~100 lines) — History API + iframe src switching
- **Styling:** CSS Custom Properties (design tokens) + modular CSS files in `libs/css/`
- **Deployment:** `deploy.sh` (cross-platform) / `run.bat` (Windows) — git add/commit/push

## Directory Structure

```
michaelguan.github.io/
├── index.html              # Blog frame: nav + hero + <iframe name="content-frame"> + footer
├── libs/                   # Core local assets (lightweight, no frameworks)
│   ├── css/
│   │   ├── reset.css       # Minimal normalize (~30 lines)
│   │   ├── theme.css       # Design tokens: colors, spacing, typography, dark mode
│   │   ├── nav.css         # Sticky nav, mobile hamburger menu
│   │   ├── hero.css        # Homepage hero section
│   │   └── iframe.css      # Content frame wrapper, loading spinner, error state
│   └── js/
│       └── router.js       # Hash-based routing, history.pushState, iframe load/error handling
├── pages/                  # Content pages (organized by category)
│   ├── tech/
│   │   ├── index.html      # Tech article list
│   │   ├── hello-world.html
│   │   ├── css-variables-theme.html
│   │   └── vanilla-js-router.html
│   ├── game/
│   │   ├── index.html      # Game article list
│   │   ├── elden-ring.html
│   │   └── balatro.html
│   └── life/
│       ├── index.html      # Life article list
│       ├── tokyo-trip.html
│       └── reading-2024.html
├── imgs/                   # Images (avatars, covers) — currently empty
├── favicon.ico             # Site favicon
├── _config.yml             # Jekyll config (GitHub Pages requirement, theme: cayman)
├── .gitignore              # *.log, _site/, libs/*.min.*, IDE files
├── deploy.sh               # Cross-platform deploy script (git add/commit/push)
├── run.bat                 # Windows deploy script (legacy)
└── CLAUDE.md               # This file
```

## Key Architecture Decisions

### Frame + Iframe Routing
- `index.html` loads once, stays persistent (nav, hero, footer)
- Category links (`#tech`, `#game`, `#life`) change `iframe.src` + `history.pushState`
- Browser back/forward buttons work via `popstate` listener
- Content pages use `<a target="content-frame">` to stay inside the frame
- **SEO note:** iframe content not indexed by Google directly. Add sitemap later if needed.

### CSS Token System (`libs/css/theme.css`)
Two-layer variable architecture:
```css
/* Layer 1: Primitive tokens (raw values) */
--color-blue-500: #3b82f6;
--color-gray-50: #fafafa;

/* Layer 2: Semantic aliases (what components use) */
--color-primary: var(--color-blue-600);
--color-bg: var(--color-gray-50);
--color-text: var(--color-gray-900);
```
Dark mode via `@media (prefers-color-scheme: dark)` overriding Layer 2 only.

### No Framework, No Build
- Vanilla ES6 modules not used (single `router.js` loaded via `<script>`)
- No Tailwind, Bootstrap, jQuery, React, Vue
- CSS files linked via `<link>` in each page (HTTP/2 multiplexing makes this fast enough)
- If page count grows >50, consider 11ty or Vite + SSG — not before

## Content Conventions

### Article Front Matter (in HTML comments, optional for future tooling)
```html
<!--
  title: "Article Title"
  date: "2025-01-15"
  category: "tech"        # tech | game | life
  tags: ["css", "theming"]
  description: "One-line summary for SEO/social"
-->
```

### Category Structure
| Category | Route Hash | Directory | Description |
|----------|------------|-----------|-------------|
| 技术 | `#tech` | `pages/tech/` | Backend, frontend, architecture, tools |
| 游戏 | `#game` | `pages/game/` | Reviews, design analysis, dev logs |
| 生活 | `#life` | `pages/life/` | Travel, reading, remote work, minimalism |

### Linking Rules
- **Nav links (index.html):** `<a href="#tech" data-route="tech">` — router intercepts
- **Category index → article:** `<a href="/pages/tech/hello-world.html" target="content-frame">`
- **Article → category index:** `<a href="/pages/tech/index.html" target="content-frame">`
- **Article → external:** `<a href="https://..." target="_blank" rel="noopener noreferrer">`
- **Never** use `target="_top"` or `target="_parent"` unless intentionally breaking frame

## Common Commands

### Local Development
```bash
# Option 1: Python (simplest, no install)
python -m http.server 5173

# Option 2: Jekyll (matches GitHub Pages build)
bundle exec jekyll serve --port 4000

# Option 3: Any static server (live-server, serve, nginx, etc.)
npx serve .
```
Open `http://localhost:5173` (or 4000) — the frame loads, click nav to test routing.

### Deploy
```bash
# Cross-platform (Linux/macOS/WSL/Git Bash)
./deploy.sh

# Windows (cmd/PowerShell)
run.bat
```
Both do: `git add -A && git commit -m "update YYYYMMDD HH:MM:SS" && git push origin main`

### Add New Article
1. Create `pages/{category}/slug.html` (copy an existing article as template)
2. Add link in `pages/{category}/index.html` article list
3. Test locally: `python -m http.server 5173` → navigate to category → click article
4. `./deploy.sh`

### Add New Category
1. `mkdir pages/newcat`
2. Create `pages/newcat/index.html` (copy from `tech/index.html`, update titles/links)
3. Add nav item in `index.html`: `<a href="#newcat" class="nav-link" data-route="newcat">新分类</a>`
4. Add route in `router.js` ROUTES object: `'newcat': '/pages/newcat/index.html'`
5. Deploy

## File-Specific Notes

### `index.html` (Frame)
- Contains nav, hero (shown only on first load), iframe wrapper, footer
- Loads `libs/css/*.css` and `libs/js/router.js`
- Router auto-initializes on `DOMContentLoaded`, reads `location.hash` for deep link
- Hero hidden via JS when iframe first loads (`.hero { display: none }` added dynamically)

### `libs/js/router.js`
- **ROUTES object** maps hash → iframe src path
- `navigateTo(route, {push:true})` — core function, callable from console or iframe pages via `parent.blogRouter.navigateTo('tech')`
- Handles: loading spinner, error state, active link highlighting, mobile menu close, scroll-to-top
- **Exposed global:** `window.blogRouter = { navigateTo, getCurrentRoute, ROUTES }`

### `libs/css/theme.css`
- **All design tokens here.** Don't hardcode colors/spacings in other CSS files.
- Dark mode: `@media (prefers-color-scheme: dark)` overrides semantic layer only
- Future: add `[data-theme="dark"]` selector for manual toggle

### `_config.yml`
- Minimal Jekyll config for GitHub Pages (`theme: jekyll-theme-cayman`)
- **No plugins, no collections, no custom processing** — Jekyll only used to satisfy Pages requirement
- Old `gitment` credentials removed (were exposed in repo history — rotate on GitHub if reused)

### `deploy.sh` / `run.bat`
- Identical logic: add all → commit with timestamp → push
- `deploy.sh` uses `COMMIT_MSG` var for testability
- No CI/CD — push triggers GitHub Pages rebuild automatically (~30-60s)

## Conventions for This Repo

- **Zero external JS deps.** `router.js` is the only JS file. No `node_modules`, no `package.json`.
- **CSS via `<link>`, not `@import`.** Browsers parallelize `<link>`, `@import` serializes.
- **Semantic HTML.** `header[role=banner]`, `nav[role=navigation]`, `main[role=main]`, `footer[role=contentinfo]`, `article`, `time[datetime]`, `a[target="content-frame"]`.
- **Accessibility:** skip link, ARIA labels, `aria-current="page"` on active nav, focus-visible outlines, reduced-motion media query.
- **Mobile-first responsive.** Breakpoint at 640px (nav → hamburger, hero text clamps).
- **Images:** Put in `imgs/`, reference as `/imgs/filename.jpg`. Optimize before commit (WebP, <200KB).
- **No inline styles** except `style="display:none"` toggled by JS. All styling in `libs/css/`.

## What NOT to Do

- ❌ Don't add npm/yarn/pnpm, `package.json`, build scripts
- ❌ Don't import React/Vue/Svelte — this is intentionally framework-free
- ❌ Don't put large libraries in `libs/` (ECharts, sql.js, jQuery were removed)
- ❌ Don't use `document.write` or `document.writeln` (legacy `aboutme.js` did this)
- ❌ Don't hardcode colors like `#2563eb` in component CSS — use `var(--color-primary)`
- ❌ Don't break the frame: external links must use `target="_blank" rel="noopener noreferrer"`

## Future Enhancements (When Needed)

| Feature | Approach | Effort |
|---------|----------|--------|
| Markdown → HTML | 11ty / VitePress / custom Node script | Medium |
| Full-text search | Pagefind (static, no backend) | Low |
| Comments | Giscus / Utterances (GitHub Discussions) | Low |
| RSS / Sitemap | Generate at deploy time (Node script in `deploy.sh`) | Low |
| Analytics | Plausible / Umami / GA (single `<script>` in `index.html`) | Low |
| Manual dark/light toggle | Add `theme-toggle` button + `localStorage` + `[data-theme]` | Low |
| Article pagination | Static: split index.html into `page-1.html`, `page-2.html` | Medium |

## Personal Data Notes

- Author: Michael Guan (关某)
- Birth year referenced in legacy code: 1986/1987 (removed from current blog)
- Past employer: 工商银行软件开发中心杭州研发部 (ICBC Software Dev Center Hangzhou)
- Education: 武汉理工大学 计算机科学与技术 本科
- These appear only in git history (`scripts/aboutme.js`, `scripts/lifematrix.js`) — not in current blog content