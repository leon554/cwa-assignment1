import type { WordSearchPuzzle } from "@/lib/wordsearch/types";

export function generateWordSearchHtml(puzzle: WordSearchPuzzle): string {
  const puzzleJson = JSON.stringify(puzzle);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Phoneme Word Search</title>
  <style>
    :root {
      --primary: #2b5c8f;
      --bg: #f8fafc;
      --card: #ffffff;
      --text: #1e293b;
      --border: #cbd5e1;
      --highlight: #fef08a;
      --found: #bbf7d0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }
    h1 { color: var(--primary); margin-bottom: 20px; }
    .grid {
      display: grid;
      gap: 2px;
      background: var(--card);
      padding: 12px;
      border-radius: 8px;
      border: 1px solid var(--border);
      margin-bottom: 20px;
    }
    .cell {
      display: flex; align-items: center; justify-content: center;
      width: 40px; height: 40px;
      font-family: monospace; font-weight: bold; font-size: 1rem;
      background: #f8fafc; border: 1px solid var(--border);
      cursor: pointer; user-select: none;
    }
    .cell.highlighted { background: var(--highlight) !important; }
    .cell.found { background: var(--found) !important; color: #166534; }
    .word-list {
      background: var(--card); padding: 15px; border-radius: 8px;
      border: 1px solid var(--border); width: 100%; max-width: 500px;
    }
    .word-items { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    .word-item {
      padding: 6px 12px; background: #f1f5f9; border-radius: 6px; font-weight: 500;
    }
    .word-item.found { text-decoration: line-through; color: #94a3b8; background: #f0fdf4; }
    @media (max-width: 480px) {
      .cell { width: 32px; height: 32px; font-size: 0.85rem; }
    }
  </style>
</head>
<body>
  <h1>Phoneme Word Search</h1>
  <div id="grid" class="grid" role="grid" aria-label="Word search grid"></div>
  <div class="word-list">
    <h3>Word List</h3>
    <div id="wordList" class="word-items"></div>
  </div>
  <script>
    const PUZZLE = ${puzzleJson};
    const { rows, cols, grid, words, solutions } = PUZZLE;
    let isSelecting = false;
    let startCell = null;
    const foundDisplays = new Set();

    function cellKey(r, c) { return r + '-' + c; }

    function getPath(r1, c1, r2, c2) {
      const dr = r2 - r1, dc = c2 - c1;
      if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
        const steps = Math.max(Math.abs(dr), Math.abs(dc));
        const stepR = dr === 0 ? 0 : dr / steps;
        const stepC = dc === 0 ? 0 : dc / steps;
        const path = [];
        for (let i = 0; i <= steps; i++) path.push({ r: r1 + stepR * i, c: c1 + stepC * i });
        return path;
      }
      return null;
    }

    function clearHighlights() {
      document.querySelectorAll('.cell.highlighted').forEach(c => c.classList.remove('highlighted'));
    }

    function highlightPath(from, to) {
      clearHighlights();
      const path = getPath(from.r, from.c, to.r, to.c);
      if (!path) return;
      path.forEach(co => {
        const cell = document.querySelector('[data-row="' + co.r + '"][data-col="' + co.c + '"]');
        if (cell) cell.classList.add('highlighted');
      });
    }

    function checkSelection(from, to) {
      const path = getPath(from.r, from.c, to.r, to.c);
      if (!path) return;
      let forward = '', reverse = '';
      path.forEach(co => { forward += grid[co.r][co.c]; });
      for (let i = path.length - 1; i >= 0; i--) reverse += grid[path[i].r][path[i].c];
      words.forEach(w => {
        if (!foundDisplays.has(w.display) && (w.display === forward || w.display === reverse)) {
          foundDisplays.add(w.display);
          path.forEach(co => {
            const cell = document.querySelector('[data-row="' + co.r + '"][data-col="' + co.c + '"]');
            if (cell) cell.classList.add('found');
          });
          const item = document.getElementById('list-' + w.display);
          if (item) item.classList.add('found');
        }
      });
    }

    function render() {
      const gridEl = document.getElementById('grid');
      gridEl.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
      gridEl.innerHTML = '';
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.dataset.row = r;
          cell.dataset.col = c;
          cell.textContent = grid[r][c];
          cell.setAttribute('role', 'gridcell');
          cell.setAttribute('aria-label', 'Phoneme ' + grid[r][c]);
          gridEl.appendChild(cell);
        }
      }
      const listEl = document.getElementById('wordList');
      listEl.innerHTML = '';
      words.forEach(w => {
        const item = document.createElement('div');
        item.className = 'word-item';
        item.id = 'list-' + w.display;
        item.textContent = w.cleanDisplay;
        listEl.appendChild(item);
      });
    }

    const gridEl = document.getElementById('grid');
    gridEl.addEventListener('mousedown', e => {
      const cell = e.target.closest('.cell');
      if (!cell) return;
      isSelecting = true;
      startCell = { r: +cell.dataset.row, c: +cell.dataset.col };
      clearHighlights();
      cell.classList.add('highlighted');
    });
    window.addEventListener('mousemove', e => {
      if (!isSelecting || !startCell) return;
      const cell = document.elementFromPoint(e.clientX, e.clientY);
      if (cell && cell.classList.contains('cell')) {
        highlightPath(startCell, { r: +cell.dataset.row, c: +cell.dataset.col });
      }
    });
    window.addEventListener('mouseup', e => {
      if (!isSelecting || !startCell) return;
      const cell = document.elementFromPoint(e.clientX, e.clientY);
      if (cell && cell.classList.contains('cell')) {
        checkSelection(startCell, { r: +cell.dataset.row, c: +cell.dataset.col });
      }
      isSelecting = false;
      clearHighlights();
      startCell = null;
    });
    gridEl.addEventListener('touchstart', e => {
      const touch = e.touches[0];
      const cell = document.elementFromPoint(touch.clientX, touch.clientY);
      if (!cell || !cell.classList.contains('cell')) return;
      isSelecting = true;
      startCell = { r: +cell.dataset.row, c: +cell.dataset.col };
      clearHighlights();
      cell.classList.add('highlighted');
    });
    window.addEventListener('touchmove', e => {
      if (!isSelecting || !startCell) return;
      const touch = e.touches[0];
      const cell = document.elementFromPoint(touch.clientX, touch.clientY);
      if (cell && cell.classList.contains('cell')) {
        highlightPath(startCell, { r: +cell.dataset.row, c: +cell.dataset.col });
      }
    });
    window.addEventListener('touchend', () => {
      if (!isSelecting || !startCell) return;
      const highlighted = document.querySelectorAll('.cell.highlighted');
      if (highlighted.length > 0) {
        const last = highlighted[highlighted.length - 1];
        checkSelection(startCell, { r: +last.dataset.row, c: +last.dataset.col });
      }
      isSelecting = false;
      clearHighlights();
      startCell = null;
    });

    render();
  </script>
</body>
</html>`;
}
