import {
  DIRECTIONS,
  type PlacedWord,
  type WordSearchPuzzle,
  type WordSearchSolution,
} from "./types";

function canPlace(grid: (string | null)[][], units: string[], r: number, c: number, d: { dr: number; dc: number }, rows: number,cols: number): boolean {
  const len = units.length;
  const endR = r + d.dr * (len - 1);
  const endC = c + d.dc * (len - 1);
  if (endR < 0 || endR >= rows || endC < 0 || endC >= cols) return false;

  for (let i = 0; i < len; i++) {
    const currR = r + d.dr * i;
    const currC = c + d.dc * i;
    if (grid[currR][currC] && grid[currR][currC] !== units[i]) return false;
  }
  return true;
}

export function generateWordSearch(words: string[], rows: number, cols: number): WordSearchPuzzle {
  const wordsData: PlacedWord[] = [];
  const pool: string[] = [];

  for (const word of words) {
    const characters = word.includes(" ") ? word.split(/\s+/) : word.split("");
    const key = characters.join("");
    wordsData.push({
      display: key,
      cleanDisplay: characters.join(" "),
      units: characters,
      found: false,
    });
    for (const char of characters) {
      if (!pool.includes(char)) pool.push(char);
    }
  }

  if (pool.length === 0) pool.push("æ", "b", "d", "ɪ", "p", "s", "t");

  const gridMatrix: (string | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null),
  );

  const solutions: WordSearchSolution[] = [];

  for (const w of wordsData) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 200) {
      attempts++;
      const d = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);

      if (canPlace(gridMatrix, w.units, r, c, d, rows, cols)) {
        const coords: { r: number; c: number }[] = [];
        for (let i = 0; i < w.units.length; i++) {
          const currR = r + d.dr * i;
          const currC = c + d.dc * i;
          gridMatrix[currR][currC] = w.units[i];
          coords.push({ r: currR, c: currC });
        }
        solutions.push({ display: w.display, coords });
        placed = true;
      }
    }
  }

  const grid: string[][] = gridMatrix.map((row) =>
    row.map((cell) => cell ?? pool[Math.floor(Math.random() * pool.length)]),
  );

  return { rows, cols, grid, words: wordsData, solutions };
}

export function getPath(r1: number, c1: number, r2: number, c2: number): { r: number; c: number }[] | null {
  const dr = r2 - r1;
  const dc = c2 - c1;
  if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    const stepR = dr === 0 ? 0 : dr / steps;
    const stepC = dc === 0 ? 0 : dc / steps;
    const path: { r: number; c: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      path.push({ r: r1 + stepR * i, c: c1 + stepC * i });
    }
    return path;
  }
  return null;
}

export function getSelectionString(
  path: { r: number; c: number }[],
  grid: string[][],
): { forward: string; reverse: string } {
  let forward = "";
  let reverse = "";
  for (const co of path) {
    forward += grid[co.r][co.c];
  }
  for (let i = path.length - 1; i >= 0; i--) {
    reverse += grid[path[i].r][path[i].c];
  }
  return { forward, reverse };
}
