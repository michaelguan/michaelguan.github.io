/* ==========================================================================
   pcb-game.js — PCB 连连看 UI / interaction / audio / animation
   Depends on window.PCBLogic (pcb-logic.js).
   ========================================================================== */
(function () {
  'use strict';
  const L = window.PCBLogic;
  if (!L) { console.error('PCBLogic missing'); return; }

  /* ---------- Component library (16 schematic glyphs) ---------- */
  const COMPONENTS = [
    { name: 'R',   color: '#ffb000', svg: '<path d="M16 52 H30 L38 30 L50 74 L62 30 L70 52 H84" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' },
    { name: 'C',   color: '#19e0ff', svg: '<path d="M18 50 H42 M42 26 V74 M58 26 V74 M58 50 H82" fill="none" stroke-width="7" stroke-linecap="round"/>' },
    { name: 'CE',  color: '#ff7a1a', svg: '<path d="M18 50 H42 M42 26 V74 M58 26 C74 38 74 62 58 74 M30 20 H38 M34 16 V24" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' },
    { name: 'L',   color: '#39ff14', svg: '<path d="M14 56 H24 q8 -22 16 0 q8 -22 16 0 q8 -22 16 0 q8 -22 16 0 H86" fill="none" stroke-width="7" stroke-linecap="round"/>' },
    { name: 'D',   color: '#ffe23d', svg: '<path d="M12 50 H28 M28 28 L28 72 L62 50 Z M62 26 V74 M62 50 H88" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' },
    { name: 'LED', color: '#ff3b6b', svg: '<path d="M12 50 H28 M28 28 L28 72 L62 50 Z M62 26 V74 M62 50 H88 M40 16 L30 6 M40 16 L50 6 M52 16 L42 6 M52 16 L62 6" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' },
    { name: 'Q',   color: '#2e9bff', svg: '<path d="M50 22 V78 M50 50 H20 M50 30 H80 M50 70 H80" fill="none" stroke-width="7" stroke-linecap="round"/>' },
    { name: 'Y',   color: '#b06bff', svg: '<path d="M16 50 H36 M36 28 H64 V72 H36 Z M64 50 H84 M30 36 V64 M70 36 V64" fill="none" stroke-width="7" stroke-linecap="round"/>' },
    { name: 'GND', color: '#9fb0a8', svg: '<path d="M50 18 V36 M30 38 H70 M38 50 H62 M44 62 H56" fill="none" stroke-width="7" stroke-linecap="round"/>' },
    { name: 'VCC', color: '#00ffa3', svg: '<path d="M50 52 m-13 0 a13 13 0 1 0 26 0 a13 13 0 1 0 -26 0 M50 38 V54 M42 46 H58" fill="none" stroke-width="6" stroke-linecap="round"/>' },
    { name: 'B',   color: '#c6ff00', svg: '<path d="M50 18 V40 M30 40 H70 M42 58 H58 M50 58 V82" fill="none" stroke-width="7" stroke-linecap="round"/>' },
    { name: 'SW',  color: '#00e0c0', svg: '<path d="M16 50 H44 M56 50 H84 M44 50 L70 28" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' },
    { name: 'F',   color: '#ff5a3c', svg: '<path d="M14 50 H30 M30 34 H70 V66 H30 Z M70 50 H86" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' },
    { name: 'ANT', color: '#66ccff', svg: '<path d="M50 76 V40 M50 40 L34 22 M50 40 L66 22 M40 30 q10 -10 20 0 M40 76 H60" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' },
    { name: 'SPK', color: '#ff5cf0', svg: '<path d="M34 34 H52 L68 20 V80 L52 66 H34 Z M74 38 q10 12 0 24 M80 32 q16 18 0 36" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' },
    { name: 'THM', color: '#7cffb2', svg: '<path d="M16 52 H30 L38 32 L50 72 L62 32 L70 52 H84 M30 80 L70 20" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' },
  ];
  function glow(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  const DIFFS = {
    easy:   { rows: 6, cols: 8,  palette: 12, time: 300, label: '简单' },
    medium: { rows: 7, cols: 12, palette: 14, time: 360, label: '中等' },
    hard:   { rows: 8, cols: 14, palette: 16, time: 420, label: '困难' },
  };

  /* ---------- DOM ---------- */
  const $ = (id) => document.getElementById(id);
  const board = $('board');
  const trace = $('trace');
  const toastEl = $('toast');
  const hud = { time: $('hud-time'), score: $('hud-score'), combo: $('hud-combo'), best: $('hud-best') };

  /* ---------- State ---------- */
  let S = null;
  let cellEls = {};   // "r,c" -> element

  /* ---------- Audio ---------- */
  let actx = null;
  function ensureAudio() {
    if (!actx) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { actx = null; }
    }
    if (actx && actx.state === 'suspended') actx.resume();
  }
  function tone(freq, dur, type, vol, when) {
    if (!actx || !S || !S.sound) return;
    const t0 = actx.currentTime + (when || 0);
    const osc = actx.createOscillator();
    const g = actx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.18, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(actx.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  }
  function playMatch() { tone(660, 0.12, 'triangle', 0.2, 0); tone(990, 0.14, 'triangle', 0.16, 0.06); }
  function playError() { tone(150, 0.18, 'sawtooth', 0.16, 0); }
  function playWin() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.18, i * 0.1)); }
  function playLose() { [400, 320, 240].forEach((f, i) => tone(f, 0.3, 'sawtooth', 0.16, i * 0.12)); }

  /* ---------- Helpers ---------- */
  const key = (p) => p.r + ',' + p.c;
  function fmtTime(s) {
    s = Math.max(0, s | 0);
    const m = Math.floor(s / 60), ss = s % 60;
    return (m < 10 ? '0' : '') + m + ':' + (ss < 10 ? '0' : '') + ss;
  }
  function bestKey(d) { return 'pcb-llk-best-' + d; }
  function loadBest(d) { return parseInt(localStorage.getItem(bestKey(d)) || '0', 10) || 0; }
  function saveBest(d, v) { try { localStorage.setItem(bestKey(d), String(v)); } catch (e) {} }

  let toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1600);
  }

  /* ---------- Board geometry ---------- */
  function pitch() {
    const cs = getComputedStyle(board);
    const gap = parseFloat(cs.gap) || 6;
    const tileW = (board.querySelector('.tile') || board).getBoundingClientRect().width || parseFloat(cs.getPropertyValue('--cell')) || 52;
    return { gap, tileW, p: tileW + gap };
  }
  function centerFor(r, c) {
    const { p, tileW } = pitch();
    const origin = tileW / 2;
    return { x: origin + (c - 1) * p, y: origin + (r - 1) * p };
  }

  // Scale the tile size so the whole board fits the board-wrap exactly -> no scrollbars.
  function fitBoard() {
    if (!S || !S.grid) return;
    const wrap = board.parentElement; // .board-wrap
    if (!wrap) return;
    const cs = getComputedStyle(wrap);
    const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const gap = parseFloat(cs.gap) || 6;
    const availW = wrap.clientWidth - padX;
    const availH = wrap.clientHeight - padY;
    if (availW <= 0 || availH <= 0) return;
    const cellW = (availW - (S.cols - 1) * gap) / S.cols;
    const cellH = (availH - (S.rows - 1) * gap) / S.rows;
    let cell = Math.floor(Math.min(cellW, cellH, 60)); // 60px cap on large screens
    if (cell < 16) cell = 16;                           // floor: never overflow
    board.style.setProperty('--cell', cell + 'px');
    const p = cell + gap;
    const w = S.cols * p - gap;
    const h = S.rows * p - gap;
    trace.setAttribute('width', w);
    trace.setAttribute('height', h);
    trace.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
  }

  /* ---------- Render ---------- */
  function renderBoard() {
    // keep only the trace svg, remove previous tiles
    Array.from(board.querySelectorAll('.tile, .empty')).forEach((el) => el.remove());
    cellEls = {};
    const { rows, cols } = S;
    board.style.setProperty('--cols', cols);
    board.style.setProperty('--rows', rows);
    const built = L.createBoard({ rows, cols, palette: S.palette });
    S.grid = built.grid;
    S.remaining = rows * cols;
    fitBoard(); // size tiles to fit the available area (no scrollbars)

    const frag = document.createDocumentFragment();
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        const v = S.grid[r][c];
        if (v === 0) continue;
        const comp = COMPONENTS[(v - 1) % COMPONENTS.length];
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tile';
        btn.dataset.r = r; btn.dataset.c = c;
        // explicit grid placement -> removing a tile leaves a HOLE, no reflow (traditional static board)
        btn.style.gridColumn = c;
        btn.style.gridRow = r;
        btn.setAttribute('aria-label', '元件 ' + comp.name);
        btn.style.setProperty('--tile-color', comp.color);
        btn.style.setProperty('--tile-glow', glow(comp.color, 0.5));
        btn.innerHTML = '<svg class="glyph" viewBox="0 0 100 100" aria-hidden="true">' + comp.svg + '</svg>';
        btn.addEventListener('click', () => onTileClick(r, c));
        frag.appendChild(btn);
        cellEls[key({ r, c })] = btn;
      }
    }
    board.appendChild(frag);
  }

  /* ---------- Selection / matching ---------- */
  function select(p) {
    S.selected = p;
    const el = cellEls[key(p)];
    if (el) el.classList.add('selected');
  }
  function deselect() {
    if (S.selected) {
      const el = cellEls[key(S.selected)];
      if (el) el.classList.remove('selected');
    }
    S.selected = null;
  }
  function shake(p) {
    const el = cellEls[key(p)];
    if (!el) return;
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 420);
  }

  function onTileClick(r, c) {
    if (!S || !S.started || S.paused) return;
    if (S.grid[r][c] === 0) return;
    if (S.selected && S.selected.r === r && S.selected.c === c) { deselect(); return; }
    if (!S.selected) { select({ r, c }); return; }

    const a = S.selected, b = { r, c };
    const sameType = S.grid[a.r][a.c] === S.grid[b.r][b.c];
    const path = sameType ? L.canConnect(S.grid, a, b) : null;

    if (path) {
      doMatch(a, b, path);
      deselect();
    } else {
      playError();
      shake(a); shake(b);
      S.combo = 0; updateHUD();
      deselect();
      select(b);
    }
  }

  function doMatch(a, b, path) {
    S.combo += 1;
    S.maxCombo = Math.max(S.maxCombo, S.combo);
    const gain = 100 + (S.combo - 1) * 25;
    S.score += gain;
    updateHUD();
    playMatch();
    drawTrace(path);

    const ea = cellEls[key(a)], eb = cellEls[key(b)];
    if (ea) ea.classList.add('gone');
    if (eb) eb.classList.add('gone');
    S.grid[a.r][a.c] = 0;
    S.grid[b.r][b.c] = 0;
    S.remaining -= 2;

    setTimeout(() => {
      if (ea) ea.remove();
      if (eb) eb.remove();
      delete cellEls[key(a)]; delete cellEls[key(b)];
      clearTrace();
      afterRemoval();
    }, 340);
  }

  function afterRemoval() {
    if (S.remaining <= 0) { win(); return; }
    if (!L.hasAnyMove(S.grid)) {
      toast('无可用连接 · 自动重排');
      autoShuffle();
    }
  }

  /* ---------- Trace animation ---------- */
  function drawTrace(path) {
    while (trace.firstChild) trace.removeChild(trace.firstChild);
    const pts = path.map((p) => { const c = centerFor(p.r, p.c); return c.x.toFixed(1) + ',' + c.y.toFixed(1); }).join(' ');
    const pl = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    pl.setAttribute('points', pts);
    trace.appendChild(pl);
  }
  function clearTrace() { while (trace.firstChild) trace.removeChild(trace.firstChild); }

  /* ---------- Hint / Shuffle ---------- */
  function hint() {
    if (!S || !S.started || S.paused) return;
    const h = L.findHint(S.grid);
    if (!h) { toast('无可用连接 · 自动重排'); autoShuffle(); return; }
    S.hints += 1;
    S.score = Math.max(0, S.score - 20);
    updateHUD();
    [h.a, h.b].forEach((p) => {
      const el = cellEls[key(p)];
      if (el) { el.classList.add('hint'); setTimeout(() => el.classList.remove('hint'), 2100); }
    });
  }
  function autoShuffle() {
    L.shuffleBoard(S.grid);
    rerenderKeepStats();
  }
  function manualShuffle() {
    if (!S || !S.started || S.paused) return;
    deselect();
    L.shuffleBoard(S.grid);
    rerenderKeepStats();
    toast('线路重排');
  }
  function rerenderKeepStats() {
    // rebuild tile DOM from current grid, preserving score/combo/timer
    Array.from(board.querySelectorAll('.tile, .empty')).forEach((el) => el.remove());
    cellEls = {};
    const { rows, cols } = S;
    const frag = document.createDocumentFragment();
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        const v = S.grid[r][c];
        if (v === 0) continue;
        const comp = COMPONENTS[(v - 1) % COMPONENTS.length];
        const btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'tile';
        btn.dataset.r = r; btn.dataset.c = c;
        btn.style.gridColumn = c;
        btn.style.gridRow = r;
        btn.setAttribute('aria-label', '元件 ' + comp.name);
        btn.style.setProperty('--tile-color', comp.color);
        btn.style.setProperty('--tile-glow', glow(comp.color, 0.5));
        btn.innerHTML = '<svg class="glyph" viewBox="0 0 100 100" aria-hidden="true">' + comp.svg + '</svg>';
        btn.addEventListener('click', () => onTileClick(r, c));
        frag.appendChild(btn);
        cellEls[key({ r, c })] = btn;
      }
    }
    board.appendChild(frag);
  }

  /* ---------- HUD ---------- */
  function updateHUD() {
    hud.time.textContent = fmtTime(S.timeLeft);
    hud.score.textContent = S.score;
    hud.combo.textContent = 'x' + S.combo;
    hud.best.textContent = Math.max(loadBest(S.diff), S.score);
  }

  /* ---------- Timer ---------- */
  function startTimer() {
    stopTimer();
    S.timerId = setInterval(() => {
      if (S.paused || !S.started) return;
      S.timeLeft -= 1;
      updateHUD();
      if (S.timeLeft <= 0) { S.timeLeft = 0; updateHUD(); lose(); }
    }, 1000);
  }
  function stopTimer() { if (S && S.timerId) { clearInterval(S.timerId); S.timerId = null; } }

  /* ---------- Game lifecycle ---------- */
  function startGame(diff) {
    ensureAudio();
    const cfg = DIFFS[diff];
    S = {
      diff, rows: cfg.rows, cols: cfg.cols, palette: cfg.palette,
      grid: null, remaining: 0,
      score: 0, combo: 0, maxCombo: 0, hints: 0,
      timeLeft: cfg.time, timerId: null,
      selected: null, paused: false, started: true, sound: S ? S.sound : true,
    };
    renderBoard();
    updateHUD();
    S.timeLeft = cfg.time; updateHUD();
    startTimer();
    closeAllModals();
    setDiffSeg(diff);
  }

  function win() {
    stopTimer();
    S.started = false;
    if (S.score > loadBest(S.diff)) saveBest(S.diff, S.score);
    $('win-score').textContent = S.score;
    $('win-time').textContent = fmtTime(DIFFS[S.diff].time - S.timeLeft);
    $('win-combo').textContent = 'x' + S.maxCombo;
    $('win-hints').textContent = S.hints;
    playWin();
    openModal('modal-win');
  }
  function lose() {
    stopTimer();
    S.started = false;
    if (S.score > loadBest(S.diff)) saveBest(S.diff, S.score);
    $('lose-score').textContent = S.score;
    $('lose-left').textContent = S.remaining;
    playLose();
    openModal('modal-lose');
  }

  function pauseGame() {
    if (!S || !S.started || S.paused) return;
    S.paused = true;
    openModal('modal-pause');
  }
  function resumeGame() {
    if (!S) return;
    S.paused = false;
    closeModal('modal-pause');
  }

  /* ---------- Modals ---------- */
  function openModal(id) { $(id).classList.add('open'); }
  function closeModal(id) { $(id).classList.remove('open'); }
  function closeAllModals() { ['modal-start', 'modal-pause', 'modal-win', 'modal-lose'].forEach(closeModal); }
  function setDiffSeg(diff) {
    document.querySelectorAll('#diff-seg button').forEach((b) => b.classList.toggle('active', b.dataset.diff === diff));
  }

  /* ---------- Sound toggle ---------- */
  function toggleSound() {
    if (!S) S = { sound: true };
    S.sound = !S.sound;
    const btn = $('btn-sound');
    btn.setAttribute('aria-pressed', String(S.sound));
    const on = $('sound-on');
    if (on) on.style.display = S.sound ? '' : 'none';
    if (S.sound) { ensureAudio(); tone(720, 0.08, 'triangle', 0.14); }
  }

  /* ---------- Wiring ---------- */
  function wire() {
    document.querySelectorAll('#diff-seg button').forEach((b) =>
      b.addEventListener('click', () => startGame(b.dataset.diff)));
    document.querySelectorAll('[data-start]').forEach((b) =>
      b.addEventListener('click', () => startGame(b.dataset.start)));

    $('btn-hint').addEventListener('click', hint);
    $('btn-shuffle').addEventListener('click', manualShuffle);
    $('btn-pause').addEventListener('click', pauseGame);
    $('btn-sound').addEventListener('click', toggleSound);
    $('btn-restart').addEventListener('click', () => startGame(S ? S.diff : 'easy'));
    $('btn-resume').addEventListener('click', resumeGame);
    $('btn-pause-restart').addEventListener('click', () => startGame(S ? S.diff : 'easy'));
    $('btn-win-again').addEventListener('click', () => startGame(S.diff));
    $('btn-win-menu').addEventListener('click', () => { closeModal('modal-win'); openModal('modal-start'); });
    $('btn-lose-again').addEventListener('click', () => startGame(S.diff));
    $('btn-lose-menu').addEventListener('click', () => { closeModal('modal-lose'); openModal('modal-start'); });

    document.addEventListener('keydown', (e) => {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      const k = e.key.toLowerCase();
      if (k === '1') startGame('easy');
      else if (k === '2') startGame('medium');
      else if (k === '3') startGame('hard');
      else if (k === 'h') hint();
      else if (k === 's') manualShuffle();
      else if (k === 'p') { if (S && S.paused) resumeGame(); else pauseGame(); }
      else if (k === 'm') toggleSound();
      else if (k === 'r') startGame(S ? S.diff : 'easy');
      else if (k === 'escape') { if (S && S.paused) resumeGame(); }
    });

    // resize / orientation: re-fit the board to the available area
    window.addEventListener('resize', fitBoard);
  }

  wire();
  // Auto-start at Medium difficulty for a continuous first play (skip the pick screen).
  startGame('medium');
})();
