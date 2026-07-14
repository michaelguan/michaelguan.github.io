# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

这是一个基于 Reveal.js 的 HTML 幻灯片演示项目，主题《从对话到执行：智能体应用通识》。项目为纯静态前端，无需构建工具，直接在浏览器中打开即可运行。

## Development Commands

```bash
# 启动本地服务器（推荐使用，避免 iframe 跨域问题）
python -m http.server 8000  # 或任何其他静态服务器
# 然后访问 http://localhost:8000

# Windows 上也可以直接用 Live Server / VS Code 插件等
```

- **入口文件：**`index.html`
- **幻灯片数量：**43 页，命名规则 `slides/01.html` 到 `slides/43.html`
- **推荐用浏览器直接打开 `index.html`，或者通过本地静态服务器访问**

## Architecture

### 核心结构

- **`index.html`** — 演示文稿的主入口，负责：
  - 加载 Reveal.js 引擎（`libs/reveal.js`）
  - 动态生成 43 个 `<section>` 插槽，每个插槽内嵌入一个指向 `slides/XX.html` 的 iframe
  - 懒加载机制：只有当切换到某页时才加载对应 iframe 的 `src`
  - 主题切换（simple、black、league、dracula、solarized）
  - 左右翻页按钮、右下角控制面板、全屏自动隐藏 UI

- **`slides/01.html` ~ `slides/43.html`** — 每一页幻灯片为一个独立 HTML 文件，自包含结构和样式。每个 slide 内部都引用了：
  - `../libs/tailwind.js` — Tailwind CSS
  - `../libs/style.css` — Phosphor 图标字体样式
  - 页面内部的 `<style>` 标签定义了 `.slide-container` / `.slide` / `.content-area` 等样式

### 关键协议

- **幻灯片文件名：**必须与 `index.html` 中 `totalSlidesCount` 变量同步（第 103 行），新增或删除幻灯片后需更新该计数
- **懒加载逻辑：**iframe 初始 `src` 为空，由 `data-src` 属性保存真实路径，切换时动态赋值
- **iframe 可见性：**CSS 类 `.iframe-visible` 控制淡入动画（`opacity` 从 0 → 1，带 cubic-bezier 过渡）
- **主题切换：**通过切换 `theme-link` 的 `href` 加载不同 CSS 文件，主题文件位于 `libs/` 下

### 文件结构

```
├── index.html          # 入口 + Reveal.js 初始化 + 懒加载 + 主题切换
├── slides/
│   ├── 01.html ~ 43.html   # 每页独立幻灯片
├── libs/
│   ├── reveal.js       # Reveal.js 核心
│   ├── reveal.css      # Reveal.js 基础样式
│   ├── simple.css      # 主题（极简白，默认加载）
│   ├── black.css       # 主题（科技黑）
│   ├── league.css      # 主题（金属灰）
│   ├── dracula.css     # 主题（吸血鬼）
│   ├── solarized.css   # 主题（羊皮纸）
│   ├── tailwind.js     # Tailwind CSS
│   ├── style.css       # Phosphor 图标字体 + 公用图标样式
│   └── Phosphor.*      # Phosphor 图标字体文件
```

## Common Tasks

- **新增幻灯片：**
  1. 在 `slides/` 下以 `XX.html` 格式创建文件（需连续编号）
  2. 更新 `index.html` 中 `totalSlidesCount` 的值
- **修改全局布局：**优先修改 `index.html` 中 Reveal.js 初始化配置（controls、progress、transition 等）
- **修改单页样式：**直接编辑对应 `slides/XX.html` 内的 `<style>` 标签
- **切换默认主题：**修改 `index.html` 中 `theme-link` 的 `href`
