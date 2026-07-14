/* ==========================================================================
   pcb-logic.js — Pure game logic for PCB 连连看 (Lianliankan)
   No DOM access. Works in Node (CommonJS) and browser (window.PCBLogic).
   Grid convention: padded (rows+2) x (cols+2). Value 0 = empty.
   Border ring (index 0 / rows+1 / cols+1) is always 0 so paths may route
   around the outside edge. Internal play cells: 1..rows, 1..cols.
   ========================================================================== */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.PCBLogic = api;
})(typeof self !== 'undefined' ? self : this, function () {

  const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // up, down, left, right

  function shuffleArr(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  // BFS over (r, c, dir, turns). Returns simplified turning-point path or null.
  function canConnect(grid, a, b) {
    if (!a || !b) return null;
    if (a.r === b.r && a.c === b.c) return null;
    const va = grid[a.r][a.c];
    const vb = grid[b.r][b.c];
    if (va === 0 || vb === 0 || va !== vb) return null;

    const R = grid.length, C = grid[0].length;
    const isEndpoint = (r, c) => (r === a.r && c === a.c) || (r === b.r && c === b.c);
    const passable = (r, c) => {
      if (r < 0 || c < 0 || r >= R || c >= C) return false;
      if (grid[r][c] === 0) return true;
      return isEndpoint(r, c);
    };

    const visited = new Map(); // key "r,c,dir" -> min turns seen
    const queue = [];
    for (let d = 0; d < 4; d++) {
      const nr = a.r + DIRS[d][0], nc = a.c + DIRS[d][1];
      if (passable(nr, nc)) queue.push({ r: nr, c: nc, dir: d, turns: 0, parent: { r: a.r, c: a.c, parent: null } });
    }

    let hit = null;
    while (queue.length) {
      const cur = queue.shift();
      const key = cur.r + ',' + cur.c + ',' + cur.dir;
      const seen = visited.get(key);
      if (seen !== undefined && seen <= cur.turns) continue;
      visited.set(key, cur.turns);

      if (cur.r === b.r && cur.c === b.c) { hit = cur; break; }

      // continue straight
      const ns = cur.r + DIRS[cur.dir][0], nc = cur.c + DIRS[cur.dir][1];
      if (passable(ns, nc)) queue.push({ r: ns, c: nc, dir: cur.dir, turns: cur.turns, parent: cur });

      // turn (one extra corner), up to 2 turns total
      if (cur.turns < 2) {
        for (let d = 0; d < 4; d++) {
          if (d === cur.dir) continue;
          const nr = cur.r + DIRS[d][0], nc = cur.c + DIRS[d][1];
          if (passable(nr, nc)) queue.push({ r: nr, c: nc, dir: d, turns: cur.turns + 1, parent: cur });
        }
      }
    }
    if (!hit) return null;

    const pts = [];
    let n = hit;
    while (n) { pts.push({ r: n.r, c: n.c }); n = n.parent; }
    pts.reverse();
    return simplify(pts);
  }

  // Keep only endpoints + points where the direction changes.
  function simplify(pts) {
    if (pts.length <= 2) return pts;
    const out = [pts[0]];
    for (let i = 1; i < pts.length - 1; i++) {
      const p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1];
      const d1 = (p1.r - p0.r) * 1000 + (p1.c - p0.c);
      const d2 = (p2.r - p1.r) * 1000 + (p2.c - p1.c);
      if (d1 !== d2) out.push(p1);
    }
    out.push(pts[pts.length - 1]);
    return out;
  }

  function collectTiles(grid) {
    const tiles = {};
    const R = grid.length, C = grid[0].length;
    for (let r = 1; r < R - 1; r++) {
      for (let c = 1; c < C - 1; c++) {
        const v = grid[r][c];
        if (v !== 0) (tiles[v] = tiles[v] || []).push({ r, c });
      }
    }
    return tiles;
  }

  function findHint(grid) {
    const tiles = collectTiles(grid);
    for (const v in tiles) {
      const arr = tiles[v];
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (canConnect(grid, arr[i], arr[j])) return { a: arr[i], b: arr[j] };
        }
      }
    }
    return null;
  }

  function hasAnyMove(grid) { return findHint(grid) !== null; }

  function shuffleBoard(grid) {
    const R = grid.length, C = grid[0].length;
    const cells = [], vals = [];
    for (let r = 1; r < R - 1; r++) {
      for (let c = 1; c < C - 1; c++) {
        if (grid[r][c] !== 0) { cells.push([r, c]); vals.push(grid[r][c]); }
      }
    }
    let guard = 300;
    do {
      shuffleArr(vals);
      for (let k = 0; k < cells.length; k++) grid[cells[k][0]][cells[k][1]] = vals[k];
    } while (!hasAnyMove(grid) && guard-- > 0);
    return grid;
  }

  function createBoard({ rows, cols, palette }) {
    const grid = Array.from({ length: rows + 2 }, () => Array(cols + 2).fill(0));
    const total = rows * cols; // assumed even by caller
    const bag = [];
    let t = 1;
    while (bag.length < total) {
      bag.push(t); bag.push(t);
      t = (t % palette) + 1;
    }
    shuffleArr(bag);
    let i = 0;
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) grid[r][c] = bag[i++];
    }
    let guard = 300;
    while (!hasAnyMove(grid) && guard-- > 0) shuffleBoard(grid);
    return { grid, rows, cols };
  }

  return { createBoard, canConnect, hasAnyMove, findHint, shuffleBoard };
});
