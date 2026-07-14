# Slide Template Reference for Agents

## Files involved
- All slides live at: C:\Users\guan_\Desktop\anthropic-financial-services\slides\NN.html
- Reference completed slides: slides/01.html, slides/02.html, slides/04.html (read these first to see the established style)
- Reveal.js loads them via iframe in index.html; total = 46 slides
- Do NOT touch index.html, libs/, or slides outside your assigned range.

## Mandatory <head> block (copy EXACTLY, only change the <title> NN)
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anthropics Financial Services - 第 NN 页</title>
    <link rel="stylesheet" href="../libs/style.css">
    <style>
        body { font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif; -webkit-font-smoothing: antialiased; background-color: #f8fafc; overflow: hidden; }
        .slide-container { width: 100vw; height: 100vh; display: flex; transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1); }
        .slide { width: 100vw; height: 100vh; flex-shrink: 0; display: flex; flex-direction: column; justify-content: center; padding: 3rem 6rem; box-sizing: border-box; background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%); }
        select { appearance: none; -webkit-appearance: none; -moz-appearance: none; background: transparent; border: none; outline: none; text-align: center; cursor: pointer; }
        .card-gradient-border { position: relative; background-color: #ffffff; border: 1px solid #f1f5f9 !important; box-shadow: 0 10px 40px -10px rgba(15, 23, 42, 0.06), 0 4px 10px -2px rgba(15, 23, 42, 0.02) !important; }
        .card-gradient-border-blue { position: relative; background-color: #f0f9ff; border: 1px solid #e0f2fe !important; box-shadow: 0 10px 40px -10px rgba(56, 189, 248, 0.1), 0 4px 10px -2px rgba(56, 189, 248, 0.03) !important; }
    </style>
    <link rel="stylesheet" href="../libs/tailwind.css">
</head>
```
Body wrapper (always):
```html
<body>
    <div class="slide-container" id="slide-track">
        <div class="slide">
            <!-- H2 heading -->
            <h2 class="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                <i class="ph ph-<icon> text-<color>-600"></i> <标题>
            </h2>
            <div class="w-16 h-1 bg-blue-500 rounded-full mb-8"></div>
            <!-- content here -->
        </div>
    </div>
</body>
</html>
```
NOTE: slide 01 uses a DARK background (`background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`) and centered hero layout — only the cover is dark.

## Design system (stick to these — reuse, do not invent new colors)
- Primary text: text-slate-800 / text-slate-900 ; secondary: text-slate-500/600 ; muted: text-slate-400
- Accent blue: blue-500/600 (primary), icon containers bg-blue-100
- Accent emerald-500 (success/positive), amber-500 (data/warning), purple-500 (deployment), cyan-500 (fund-admin), rose-500 (compliance), slate (neutral cards)
- Cards: bg-white rounded-xl/2xl card-gradient-border ; blue accent card: bg-blue-50 card-gradient-border-blue
- Left-accent cards: add `border-l-4 border-l-<color>-500`
- Top-accent cards: add `border-t-4 border-t-<color>-500`
- Bottom action banner: `bg-gradient-to-r from-blue-500 to-emerald-500 p-5/6 rounded-xl text-white` with centered <p> text-base/lg font-bold
- Icons: Phosphor via `<i class="ph ph-<name>"></i>`. Valid icon names (use only these — from libs/style.css):
  ph-star, ph-git-fork, ph-users, ph-briefcase, ph-chart-line, ph-vault, ph-wallet, ph-currency-circle-dollar,
  ph-identification-card, ph-quotes, ph-check, ph-code, ph-books, ph-git-branch, ph-lightning, ph-plugs,
  ph-shield-check, ph-info, ph-squares-four, ph-stack, ph-robot, ph-puzzle-piece, ph-cloud,
  ph-presentation, ph-list-bullets, ph-terminal-window, ph-magnifying-glass, ph-calculator, ph-chart-bar,
  ph-chart-pie, ph-coin, ph-bank, ph-coin-vertical, ph-coins, ph-trend-up, ph-trend-down, ph-tray,
  ph-file-text, ph-file-arrow-down, ph-floppy-disk, ph-database, ph-balloon (avoid), ph-rocket,
  ph-arrow-right, ph-arrow-right, ph-key, ph-lock-key, ph-lock-key-open, ph-shield, ph-globe, ph-globe-simple,
  ph-buildings, ph-checks, ph-check-circle, ph-x-circle, ph-scales, ph-graph, ph-target, ph-flag,
  ph-warning, ph-seal-check, ph-flag-banner, ph-crown, ph-medal, ph-trophy, ph-bell-ringing,
  ph-newspaper, ph-newspaper-clipping, ph-google-logo, ph-microsoft-excel-logo, ph-microsoft-powerpoint-logo,
  ph-microsoft-teams-logo, ph-microsoft-word-logo, ph-envelope, ph-envelope-open, ph-chat-circle-dots,
  ph-grab, ph-hand, ph-handshake, ph-funnel, ph-funnel-simple, ph-list-checks, ph-clipboard-text, ph-clipboard,
  ph-stamp, ph-signature, ph-seal-percent, ph-currency-dollar, ph-cny (avoid), ph-coins, ph-money,
  ph-scale, ph-scales, ph-bank, ph-building-office, ph-buildings, ph-storefront, ph-chart-line-up,
  ph-chart-line-down, ph-chart-bar, ph-chart-pie, ph-calendar-check, ph-calendar, ph-clock, ph-timer, ph-hourglass,
  ph-pencil, ph-pen, ph-note-pencil, ph-notebook, ph-notepad, ph-files, ph-folder, ph-folder-open,
  ph-folders, ph-floppy-disk, ph-cloud-arrow-up, ph-cloud-arrow-down, ph-cloud-check, ph-database,
  ph-fingerprint, ph-keyhole, ph-gear, ph-gear-six, ph-gauge, ph-ruler, ph-ruler-simple,
  ph-microscope, ph-magnifying-glass-plus, ph-magnifying-glass-minus, ph-eye, ph-scan, ph-camera,
  ph-tree-structure, ph-tree, ph-network, ph-flow-arrow, ph-arrows-clockwise,
  ph-circle-check, ph-check-fat, ph-x, ph-prohibit, ph-warning, ph-warning-circle, ph-info,
  ph-lightning, ph-sparkle, ph-fire, ph-flame, ph-star, ph-heart, ph-crown, ph-medal, ph-trophy,
  ph-download, ph-upload-simple, ph-push-pin, ph-push-pin-simple, ph-trash, ph-trash-simple,
  ph-arrows-left-right, ph-arrows-merge, ph-globe-hemisphere-west, ph-globe-hemisphere-east
  — if unsure whether a name exists, prefer one from this list. NEVER use an unverified name.
- Font sizing: h2=3xl ; subheadings=lg(base/lg) ; body=sm/xs ; small captions=xs ; large hero numbers=3xl..6xl
- Pills/badges: `text-xs text-<color>-700 bg-<color>-100 px-2 py-0.5 rounded-full font-bold` or `bg-<color>-50 px-3 py-1 rounded-full`

## Information density rules
- Each slide must look FULL but not overflowing — 4 to 8 distinct info points per page.
- Use grids (grid-cols-2 / 3 / 4) and small cards to pack density.
- Prefer short text-snippets in <ul>/<li> with checkmark icons, plus a one-line caption.
- Avoid empty whitespace; avoid giant single blocks of prose.
- Keep within 100vh — content must not require scrolling (body has overflow:hidden). If a slide is content-heavy, shrink text to xs and use tighter spacing.

## Content source
The content is about the anthropics/financial-services repo. Authoritative facts (TODO: the spawning agent must embed exact content per slide):
- Repo: github.com/anthropics/financial-services — 33K stars, 4.9K forks, Apache-2.0, Python
- 10 named agents, 117+ skills, 11 MCP connectors, 9 vertical plugins, 4 deployment modes
- MCP providers & endpoints (exact): Daloopa https://mcp.daloopa.com/server/mcp ; Morningstar https://mcp.morningstar.com/mcp ; S&P Global https://kfinance.kensho.com/integrations/mcp ; FactSet https://mcp.factset.com/mcp ; Moody's https://api.moodys.com/genai-ready-data/m1/mcp ; LSEG https://api.analytics.lseg.com/lfa/mcp ; PitchBook https://premium.mcp.pitchbook.com/mcp ; Chronograph https://ai.chronograph.pe/mcp ; MT Newswires https://vast-mcp.blueskyapi.com/mtnewswires ; Aiera https://mcp-pub.aiera.com ; Box https://mcp.box.com ; Egnyte https://mcp-server.egnyte.com/mcp
- Agents: Pitch Agent (投行 pitch deck end to end) ; Meeting Prep Agent (会前简报) ; Market Researcher (行业研究) ; Earnings Reviewer (业绩会→模型更新→晨会笔记) ; Model Builder (DCF/LBO/3-statement/comps) ; Valuation Reviewer (GP材料→估值→LP报告) ; GL Reconciler (断差→根因→审批，3 subagents critic/reader/resolver) ; Month-End Closer (月结：accruals/roll-forward/variance) ; Statement Auditor (审计LP材料) ; KYC Screener (解析→规则引擎→缺口)
- Vertical plugins: financial-analysis (13 skills, core, all MCP connectors) ; investment-banking (9) ; equity-research (9) ; private-equity (10) ; wealth-management (6) ; fund-admin (6) ; operations (2). Partner: lseg (8), spglobal (3).

## Verification before finishing
- File saved as slides/NN.html with NN zero-padded to 2 digits.
- <title> updated to "Anthropics Financial Services - 第 NN 页".
- Only uses Phosphor icon names from the list above.
- Content fits in a single viewport (no scroll), looks visually dense and balanced.
