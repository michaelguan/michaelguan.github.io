/**
 * comments.js — Giscus 评论系统加载器（仅文章页加载，不进 shell）
 *
 * 在文章页底部动态注入 giscus iframe。脚本运行在 iframe 内部，
 * location.pathname 即文章页路径（如 /pages/life/remote-work.html），
 * 天然就是评论归组的 key（data-mapping="pathname"）。
 *
 * 主题用 preferred_color_scheme，跟随系统 —— 与站点 dark mode
 * （@media prefers-color-scheme）行为一致。站点无手动主题开关，
 * 故无需跨 iframe 同步；若日后加了手动开关，在此追加 setConfig 同步逻辑。
 *
 * 破例说明：这是 shell 之外唯一引入的第三方脚本（站点约定的受控例外）。
 * 它只在文章页加载，且加载失败不影响正文阅读。
 */

(function () {
  'use strict';

  /* ---- Giscus 配置（GitHub 侧变动时只改这里） ------------------------------
     repoId     : repo 的 GraphQL node_id（REST API 返回的 node_id 字段）
     categoryId : Discussions 分类 ID。该分类原名 General，已重命名为
                  「博客评论区」（重命名不改变 ID）。建帖按 ID 定位，
                  不依赖 giscus 的分类名缓存。 */
  var CONFIG = {
    repo: 'michaelguan/michaelguan.github.io',
    repoId: 'MDEwOlJlcG9zaXRvcnkyMzI4NDY3MA==',
    category: '博客评论区',
    categoryId: 'DIC_kwDOAWNLvs4DBCMW',
    mapping: 'pathname',
    theme: 'preferred_color_scheme',
    lang: 'zh-CN',
    loading: 'lazy'
  };

  // file:// 打开时无意义，直接跳过
  if (location.protocol !== 'http:' && location.protocol !== 'https:') return;

  var section = document.getElementById('comments');
  if (!section) return;

  var script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.setAttribute('data-repo', CONFIG.repo);
  script.setAttribute('data-repo-id', CONFIG.repoId);
  script.setAttribute('data-category', CONFIG.category);
  if (CONFIG.categoryId) {
    script.setAttribute('data-category-id', CONFIG.categoryId);
  }
  script.setAttribute('data-mapping', CONFIG.mapping);
  script.setAttribute('data-strict', '0');
  script.setAttribute('data-reactions-enabled', '1');
  script.setAttribute('data-emit-metadata', '0');
  script.setAttribute('data-input-position', 'bottom');
  script.setAttribute('data-theme', CONFIG.theme);
  script.setAttribute('data-lang', CONFIG.lang);
  script.setAttribute('data-loading', CONFIG.loading);

  // giscus client.js 通过 document.currentScript 定位注入点（动态创建的
  // script 在执行期间 currentScript 仍然有效），iframe 会插在它后面，
  // 即 #comments 区块内部。
  section.appendChild(script);
})();
