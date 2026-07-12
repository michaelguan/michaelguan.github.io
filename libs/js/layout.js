/**
 * layout.js — 三栏布局交互：收起/展开、抽屉、状态持久化
 */
(function () {
'use strict';

const STORAGE_KEY = 'blog-layout-state';
const DEFAULT_STATE = {
  leftCollapsed: false,
  rightCollapsed: false
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
  layout.dataset.rightCollapsed = String(state.rightCollapsed);

  document.querySelectorAll('[data-action="toggle-left-rail"]').forEach(btn => {
    btn.setAttribute('aria-pressed', String(state.leftCollapsed));
    btn.setAttribute('aria-label', state.leftCollapsed ? '展开左栏' : '收起左栏');
  });
  document.querySelectorAll('[data-action="toggle-right-rail"]').forEach(btn => {
    btn.setAttribute('aria-pressed', String(state.rightCollapsed));
    btn.setAttribute('aria-label', state.rightCollapsed ? '展开右栏' : '收起右栏');
  });
}

function toggleLeftRail() {
  state.leftCollapsed = !state.leftCollapsed;
  applyLayoutState();
  saveState();
}

function toggleRightRail() {
  state.rightCollapsed = !state.rightCollapsed;
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
    document.querySelectorAll('.left-rail, .right-rail').forEach(el => el.classList.remove('is-open'));
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

function toggleMobileRight() {
  const rail = document.querySelector('.right-rail');
  if (rail.classList.contains('is-open')) closeMobileDrawer('right');
  else openMobileDrawer('right');
}

function openSearch() {
  alert('搜索功能开发中');
}

// === Init ===
function init() {
  applyLayoutState();

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
        case 'toggle-right-rail':
          e.preventDefault();
          if (window.innerWidth <= 768) toggleMobileRight();
          else toggleRightRail();
          break;
        case 'open-search':
          openSearch();
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
    toggleRightRail,
    openMobileLeft: () => openMobileDrawer('left'),
    openMobileRight: () => openMobileDrawer('right'),
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
