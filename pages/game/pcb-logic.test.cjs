// pcb-logic.test.cjs — Contract tests for pcb-logic.js (CommonJS)
// Run with: node pcb-logic.test.cjs   (from pages/game/)
const assert = require('assert');
const PCB = require('./pcb-logic.js');

function blankGrid(R, C) {
  return Array.from({ length: R + 2 }, () => Array(C + 2).fill(0));
}

let passed = 0;
function ok(name, cond) {
  assert.ok(cond, 'FAILED: ' + name);
  passed++;
  console.log('  ✓ ' + name);
}

// --- canConnect: straight (0-turn) ---
(() => {
  const R = 4, C = 6, g = blankGrid(R, C);
  g[1][1] = 1; g[1][5] = 1;
  const p = PCB.canConnect(g, { r: 1, c: 1 }, { r: 1, c: 5 });
  ok('straight connect returns path', Array.isArray(p) && p.length >= 2);
  ok('straight path endpoints correct',
    p[0].r === 1 && p[0].c === 1 && p[p.length - 1].r === 1 && p[p.length - 1].c === 5);
  ok('straight path <=2 turns (<=4 pts)', p.length <= 4);
})();

// --- canConnect: L (1-turn) ---
(() => {
  const R = 4, C = 6, g = blankGrid(R, C);
  g[1][1] = 1; g[3][3] = 1;
  const p = PCB.canConnect(g, { r: 1, c: 1 }, { r: 3, c: 3 });
  ok('L (1-turn) connect returns path', Array.isArray(p) && p.length >= 3);
  ok('L path endpoints correct',
    p[0].r === 1 && p[0].c === 1 && p[p.length - 1].r === 3 && p[p.length - 1].c === 3);
  ok('L path <=2 turns', p.length <= 4);
})();

// --- canConnect: Z (2-turn) with 1-turn corners blocked ---
(() => {
  const R = 4, C = 6, g = blankGrid(R, C);
  g[1][1] = 1; g[3][5] = 1;
  g[1][5] = 9; g[3][1] = 9; // block the two 1-turn corner candidates
  const p = PCB.canConnect(g, { r: 1, c: 1 }, { r: 3, c: 5 });
  ok('Z (2-turn) connect returns path', Array.isArray(p) && p.length >= 4);
  ok('Z path <=2 turns', p.length <= 4);
})();

// --- canConnect: different types -> null ---
(() => {
  const R = 4, C = 6, g = blankGrid(R, C);
  g[1][1] = 1; g[1][5] = 2;
  ok('different types -> null', PCB.canConnect(g, { r: 1, c: 1 }, { r: 1, c: 5 }) === null);
})();

// --- canConnect: empty cell -> null ---
(() => {
  const R = 4, C = 6, g = blankGrid(R, C);
  g[1][1] = 1;
  ok('empty cell -> null', PCB.canConnect(g, { r: 1, c: 1 }, { r: 2, c: 2 }) === null);
})();

// --- createBoard invariants ---
for (const cfg of [
  { rows: 6, cols: 8, palette: 12 },
  { rows: 7, cols: 12, palette: 14 },
  { rows: 8, cols: 14, palette: 16 },
]) {
  const b = PCB.createBoard(cfg);
  let filled = 0; const counts = {};
  for (let r = 1; r <= b.rows; r++) for (let c = 1; c <= b.cols; c++) {
    const v = b.grid[r][c];
    if (v !== 0) { filled++; counts[v] = (counts[v] || 0) + 1; }
  }
  ok(`createBoard(${cfg.rows}x${cfg.cols}) all internal cells filled`, filled === cfg.rows * cfg.cols);
  ok(`createBoard(${cfg.rows}x${cfg.cols}) even count per type`,
    Object.values(counts).every(n => n % 2 === 0));
  ok(`createBoard(${cfg.rows}x${cfg.cols}) has a move`, PCB.hasAnyMove(b.grid) === true);
}

// --- shuffle: preserves multiset + yields a move ---
(() => {
  const b = PCB.createBoard({ rows: 6, cols: 8, palette: 12 });
  const before = JSON.stringify(b.grid.flat().filter(v => v !== 0).sort());
  PCB.shuffleBoard(b.grid);
  const after = JSON.stringify(b.grid.flat().filter(v => v !== 0).sort());
  ok('shuffle preserves multiset', before === after);
  ok('shuffle yields a move', PCB.hasAnyMove(b.grid) === true);
})();

// --- solvability: greedy solver with shuffle always clears the board ---
function removePair(grid, a, bb) { grid[a.r][a.c] = 0; grid[bb.r][bb.c] = 0; }
function isEmpty(b) {
  for (let r = 1; r <= b.rows; r++) for (let c = 1; c <= b.cols; c++)
    if (b.grid[r][c] !== 0) return false;
  return true;
}
function solve(cfg) {
  const b = PCB.createBoard(cfg);
  let guard = cfg.rows * cfg.cols * 60;
  while (guard-- > 0) {
    const hint = PCB.findHint(b.grid);
    if (!hint) {
      PCB.shuffleBoard(b.grid);
      const h2 = PCB.findHint(b.grid);
      if (!h2) return false;
      removePair(b.grid, h2.a, h2.b);
    } else {
      removePair(b.grid, hint.a, hint.b);
    }
    if (isEmpty(b)) return true;
  }
  return false;
}
for (const cfg of [
  { rows: 6, cols: 8, palette: 12 },
  { rows: 7, cols: 12, palette: 14 },
  { rows: 8, cols: 14, palette: 16 },
]) {
  let allClear = true;
  for (let t = 0; t < 25; t++) { if (!solve(cfg)) { allClear = false; break; } }
  ok(`board ${cfg.rows}x${cfg.cols} always solvable (25 trials)`, allClear);
}

console.log(`\nALL ${passed} ASSERTIONS PASSED`);
