/**
 * router.js — Three-column layout router
 * Parent (index.html): manages iframe switching
 * Child pages: trigger parent.blogRouter.navigateTo()
 */

(function () {
  'use strict';

  const ROUTES = {
    home: '/pages/home/index.html',
    tech: '/pages/tech/index.html',
    game: '/pages/game/index.html',
    life: '/pages/life/index.html'
  };

  // 空 hash / 未识别 hash → 默认 home
  const DEFAULT_ROUTE = 'home';

  // === Detect environment ===
  const isParent = window === window.top;

  // === Parent-only DOM ===
  let frame, container, navItems, moreLinks;

  if (isParent) {
    container = document.querySelector('.content-frame-container');
    frame = document.querySelector('.content-frame');
    navItems = document.querySelectorAll('.nav-item[data-category]');
    moreLinks = document.querySelectorAll('[data-frame-link]');
  }

  // === State ===
  let currentRoute = 'home';
  let isFirstLoad = true;

  // === Helpers ===
  function getRouteFromHash() {
    const hash = window.location.hash.slice(1);
    return ROUTES.hasOwnProperty(hash) ? hash : DEFAULT_ROUTE;
  }

  function getSrcForRoute(route) {
    return ROUTES[route] || ROUTES[DEFAULT_ROUTE];
  }

  function setActiveNav(route) {
    if (!isParent) return;
    const validCategories = ['home', 'tech', 'game', 'life'];
    if (!validCategories.includes(route)) return;
    navItems.forEach(item => {
      const isActive = item.dataset.category === route;
      if (isActive) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
    const crumbCurrent = document.querySelector('[data-crumb-current]');
    if (crumbCurrent) {
      const labels = { home: '首页', tech: '技术', game: '游戏', life: '生活' };
      crumbCurrent.textContent = labels[route] || '首页';
    }
    const count = document.querySelector('[data-count]');
    if (count) {
      const counts = { home: '7 篇文章', tech: '3 篇文章', game: '2 篇文章', life: '2 篇文章' };
      count.textContent = counts[route] || '';
    }
  }

  // === Loading states ===
  function setLoading() {
    if (!isParent || !container) return;
    container.classList.remove('is-loaded', 'has-error');
  }
  function setLoaded() {
    if (!isParent || !container) return;
    requestAnimationFrame(() => {
      container.classList.add('is-loaded');
      container.classList.remove('has-error');
      if (frame) frame.classList.remove('is-loading');

      if (isFirstLoad) {
        isFirstLoad = false;
      }
    });
  }
  function setError() {
    if (!isParent || !container) return;
    container.classList.remove('is-loaded');
    container.classList.add('has-error');
    if (frame) frame.classList.remove('is-loading');
  }

  // === Core navigation ===
  function navigate(route, pushState) {
    if (!ROUTES.hasOwnProperty(route)) return;
    const src = getSrcForRoute(route);

    setLoading();
    if (frame && isParent) frame.src = src;

    currentRoute = route;
    setActiveNav(route);

    if (pushState !== false) {
      const newHash = '#' + route;
      history.pushState({ route }, '', newHash);
    }

    // 关闭移动端抽屉
    if (isParent && window.blogLayout) {
      window.blogLayout.closeMobileDrawer();
    }
  }

  // === Iframe events (parent only) ===
  let resizeObserver = null;

  function adjustFrameHeight() {
    if (!isParent || !frame) return;
    try {
      const doc = frame.contentDocument;
      if (!doc || !doc.documentElement) return;
      const rawHeight = Math.max(
        doc.documentElement.scrollHeight || 0,
        doc.body ? doc.body.scrollHeight : 0
      );
      // 移动端高度测量安全余量（iOS Safari scrollHeight 经常偏低）
      const isMobile = window.innerWidth <= 768;
      const safetyMargin = isMobile ? 240 : 80;
      const height = Math.ceil(rawHeight + safetyMargin);
      if (height > 0) frame.style.height = height + 'px';
    } catch (e) {
      // 跨域或不可读：回退到固定最小高度
      frame.style.height = '70vh';
    }
  }

  function onFrameLoad() {
    if (!isParent) return;
    try {
      const doc = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
      if (doc && doc.readyState === 'complete') {
        setLoaded();
        adjustFrameHeight();
        // 内容渲染后再次测量（字体/图片加载完成后高度会变）
        requestAnimationFrame(adjustFrameHeight);
        // 移动端：延迟二次校准（iOS Safari 字体/图片加载慢，初始测量易偏低）
        if (window.innerWidth <= 768) {
          setTimeout(adjustFrameHeight, 600);
          setTimeout(adjustFrameHeight, 1500);
        }
        if (doc.defaultView && 'ResizeObserver' in doc.defaultView) {
          if (resizeObserver) resizeObserver.disconnect();
          resizeObserver = new doc.defaultView.ResizeObserver(() => adjustFrameHeight());
          resizeObserver.observe(doc.documentElement);
          if (doc.body) resizeObserver.observe(doc.body);
        }
      }
    } catch (e) {}
  }

  function onFrameError() {
    if (!isParent) return;
    setError();
  }

  // === Bind nav clicks (shared) ===
  function bindNavLinks(links) {
    links.forEach(link => {
      link.addEventListener('click', function (e) {
        const route = this.dataset.category || this.dataset.route;
        if (!route || !ROUTES.hasOwnProperty(route)) return;
        e.preventDefault();
        if (isParent) {
          navigate(route);
        } else {
          // Child page: ask parent to navigate
          if (window.parent && window.parent.blogRouter) {
            window.parent.blogRouter.navigateTo(route);
          } else {
            window.top.location.hash = route;
          }
        }
      });
    });
  }

  // === Init ===
  function init() {
    // Parent: bind everything that targets the frame
    if (isParent) {
      bindNavLinks(navItems);
      bindNavLinks(moreLinks);

      window.addEventListener('hashchange', () => {
        navigate(getRouteFromHash(), false);
      });
      window.addEventListener('popstate', e => {
        const route = e.state?.route || getRouteFromHash();
        navigate(route, false);
      });

      if (frame) {
        frame.addEventListener('load', onFrameLoad);
        frame.addEventListener('error', onFrameError);
      }

      // Initial: read hash and load
      navigate(getRouteFromHash(), false);
    } else {
      // Child: bind any navlinks present so clicks bubble to parent
      const childLinks = document.querySelectorAll('.nav-item[data-category]');
      bindNavLinks(childLinks);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.blogRouter = {
    navigateTo: navigate,
    getCurrentRoute: () => currentRoute,
    ROUTES
  };
})();