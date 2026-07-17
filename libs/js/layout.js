/**
 * layout.js — 三栏布局交互：收起/展开、抽屉、状态持久化
 */
(function () {
'use strict';

const STORAGE_KEY = 'blog-layout-state';
const DEFAULT_STATE = {
  leftCollapsed: false
};

// === State ===
const state = loadState();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return { ...DEFAULT_STATE, ...saved };
  } catch (e) {
    return { ...DEFAULT_STATE };
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

// === Layout state ===
function applyLayoutState() {
  const layout = document.querySelector('.app-layout');
  if (!layout) return;
  layout.dataset.leftCollapsed = String(state.leftCollapsed);

  document.querySelectorAll('[data-action="toggle-left-rail"]').forEach(btn => {
    btn.setAttribute('aria-pressed', String(state.leftCollapsed));
    btn.setAttribute('aria-label', state.leftCollapsed ? '展开左栏' : '收起左栏');
  });
}

function toggleLeftRail() {
  state.leftCollapsed = !state.leftCollapsed;
  applyLayoutState();
  saveState();
}

// === Mobile drawers ===
function openMobileDrawer(side) {
  document.querySelector(`.${side}-rail`)?.classList.add('is-open');
  document.querySelector('.backdrop')?.classList.add('is-active');
  document.body.style.overflow = 'hidden';
}

function closeMobileDrawer(side) {
  if (side) {
    document.querySelector(`.${side}-rail`)?.classList.remove('is-open');
  } else {
    document.querySelectorAll('.left-rail').forEach(el => el.classList.remove('is-open'));
  }
  document.querySelector('.backdrop')?.classList.remove('is-active');
  document.body.style.overflow = '';
}

function closeMobileMenu() {
  closeMobileDrawer();
}

function toggleMobileLeft() {
  const rail = document.querySelector('.left-rail');
  if (rail.classList.contains('is-open')) closeMobileDrawer('left');
  else openMobileDrawer('left');
}

// === Article search (left rail) ===
const CATEGORY_LABELS = { tech: '技术', game: '游戏', life: '生活' };

function initArticleSearch() {
  const input = document.querySelector('[data-article-search]');
  if (!input) return;
  const clearBtn = document.querySelector('[data-search-clear]');
  const emptyHint = document.querySelector('[data-search-empty]');
  if (!clearBtn || !emptyHint) return;

  // Build index: each subnav item + its owning category label
  const navItems = Array.from(document.querySelectorAll('.nav-item[data-category]'));
  const entries = [];
  navItems.forEach(nav => {
    const subnav = nav.nextElementSibling;
    if (!subnav || !subnav.classList.contains('subnav')) return;
    const category = nav.dataset.category;
    const label = CATEGORY_LABELS[category] || '';
    subnav.querySelectorAll('.subnav-item').forEach(item => {
      const text = (item.textContent || '').trim().toLowerCase();
      entries.push({ li: item.closest('li'), subnav, nav, category, label, text });
    });
  });

  // Remember each subnav's initial open state to restore on clear
  const initialOpen = new Map();
  navItems.forEach(nav => {
    const subnav = nav.nextElementSibling;
    if (subnav && subnav.classList.contains('subnav')) {
      initialOpen.set(subnav, subnav.classList.contains('is-open'));
    }
  });

  function apply(query) {
    const q = query.trim().toLowerCase();
    let anyVisible = false;
    const matchedSubnavs = new Set();

    entries.forEach(({ li, subnav, label, text }) => {
      const hit = q === '' || text.includes(q) || label.toLowerCase().includes(q);
      li.hidden = !hit;
      if (hit) {
        anyVisible = true;
        matchedSubnavs.add(subnav);
      }
    });

    // When searching, auto-expand categories that have matches
    if (q !== '') {
      navItems.forEach(nav => {
        const subnav = nav.nextElementSibling;
        if (subnav && subnav.classList.contains('subnav')) {
          const show = matchedSubnavs.has(subnav);
          subnav.classList.toggle('is-open', show);
          const expandBtn = nav.querySelector('.nav-item-expand');
          if (expandBtn) expandBtn.setAttribute('aria-expanded', String(show));
          nav.classList.toggle('is-expanded', show);
        }
      });
    } else {
      // Restore initial collapse state
      navItems.forEach(nav => {
        const subnav = nav.nextElementSibling;
        if (subnav && subnav.classList.contains('subnav')) {
          const open = initialOpen.get(subnav);
          subnav.classList.toggle('is-open', open);
          const expandBtn = nav.querySelector('.nav-item-expand');
          if (expandBtn) expandBtn.setAttribute('aria-expanded', String(open));
          nav.classList.toggle('is-expanded', open);
        }
      });
    }

    clearBtn.hidden = q === '';
    emptyHint.hidden = anyVisible || q === '';
  }

  input.addEventListener('input', () => apply(input.value));
  clearBtn.addEventListener('click', () => {
    input.value = '';
    apply('');
    input.focus();
  });
  // 清除原生 search 提交（避免页面跳转）
  input.form && input.form.addEventListener('submit', e => e.preventDefault());
}

// === Init ===
function init() {
  applyLayoutState();
  initArticleSearch();

  // 事件委托
  document.addEventListener('click', e => {
    const target = e.target.closest('[data-action]');
    if (target) {
      const action = target.dataset.action;
      switch (action) {
        case 'toggle-left-rail':
          e.preventDefault();
          if (window.innerWidth <= 768) toggleMobileLeft();
          else toggleLeftRail();
          break;
        case 'close-drawer':
          closeMobileDrawer(target.dataset.side);
          break;
      }
      return;
    }

    // Subnav expand/collapse
    const expandBtn = e.target.closest('.nav-item-expand');
    if (expandBtn) {
      e.preventDefault();
      const navItem = expandBtn.closest('.nav-item');
      const subnav = navItem.nextElementSibling;
      if (navItem && subnav && subnav.classList.contains('subnav')) {
        navItem.classList.toggle('is-expanded');
        subnav.classList.toggle('is-open');
        const expanded = subnav.classList.contains('is-open');
        expandBtn.setAttribute('aria-expanded', String(expanded));
        expandBtn.setAttribute('aria-label', expanded ? '收起子菜单' : '展开子菜单');
      }
    }
  });

  // ESC 关闭抽屉
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileDrawer();
  });

  // 暴露 API
  window.blogLayout = {
    toggleLeftRail,
    openMobileLeft: () => openMobileDrawer('left'),
    closeMobileDrawer,
    getState: () => ({ ...state })
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// 弹幕无缝循环：对每个 track 复制其内容使 translateX(-50%) 衔接
(function () {
  var tracks = document.querySelectorAll('.danmaku-track');
  tracks.forEach(function (track) {
    var items = track.querySelectorAll('.danmaku-item');
    items.forEach(function (item) {
      track.appendChild(item.cloneNode(true));
    });
  });
})();
})();
