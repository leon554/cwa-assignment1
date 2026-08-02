export type Direction = { dr: number; dc: number };

export type PlacedWord = {
  display: string;
  cleanDisplay: string;
  units: string[];
  found: boolean;
};

export type WordSearchSolution = {
  display: string;
  coords: { r: number; c: number }[];
};

export type WordSearchPuzzle = {
  rows: number;
  cols: number;
  grid: string[][];
  words: PlacedWord[];
  solutions: WordSearchSolution[];
};

export const DIRECTIONS: Direction[] = [
  { dr: 0, dc: 1 },
  { dr: 0, dc: -1 },
  { dr: 1, dc: 0 },
  { dr: -1, dc: 0 },
  { dr: 1, dc: 1 },
  { dr: 1, dc: -1 },
  { dr: -1, dc: 1 },
  { dr: -1, dc: -1 },
];
