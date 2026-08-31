"use client";

import type { WordSearchPuzzle } from "@/lib/wordsearch/types";
import { getPath } from "@/lib/wordsearch/generator";
import { useCallback, useEffect, useRef, useState } from "react";
import WordList from "./WordList";

type WordSearchGridProps = {
  puzzle: WordSearchPuzzle;
  showAnswers?: boolean;
};

export default function WordSearchGrid({puzzle, showAnswers = false}: WordSearchGridProps) {
  const { rows, cols, grid, words } = puzzle;
  const [foundDisplays, setFoundDisplays] = useState<Set<string>>(new Set());
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const isSelecting = useRef(false);
  const startCell = useRef<{ r: number; c: number } | null>(null);

  useEffect(() => {
    setFoundDisplays(new Set());
    setHighlighted(new Set());
    setFoundCells(new Set());
  }, [puzzle]);

  const cellKey = (r: number, c: number) => `${r}-${c}`;

  const highlightPath = useCallback(
    (from: { r: number; c: number }, to: { r: number; c: number }) => {
      const path = getPath(from.r, from.c, to.r, to.c);
      if (!path) {
        setHighlighted(new Set());
        return;
      }
      setHighlighted(new Set(path.map((cell) => cellKey(cell.r, cell.c))));
    },
    [],
  );

  const checkSelection = useCallback(
    (from: { r: number; c: number }, to: { r: number; c: number }) => {
      const path = getPath(from.r, from.c, to.r, to.c);
      if (!path) return;

      let forward = "";
      let reverse = "";
      for (const cell of path) forward += grid[cell.r][cell.c];
      for (let i = path.length - 1; i >= 0; i--)
        reverse += grid[path[i].r][path[i].c];

      const matched = words.filter(
        (w) => w.display === forward || w.display === reverse,
      );
      if (matched.length === 0) return;

      setFoundDisplays((prev) => {
        const next = new Set(prev);
        matched.forEach((w) => next.add(w.display));
        return next;
      });
      setFoundCells((prev) => {
        const next = new Set(prev);
        path.forEach((cell) => next.add(cellKey(cell.r, cell.c)));
        return next;
      });
    },
    [grid, words],
  );

  function handlePointerDown(r: number, c: number) {
    isSelecting.current = true;
    startCell.current = { r, c };
    setHighlighted(new Set([cellKey(r, c)]));
  }

  function handlePointerMove(r: number, c: number) {
    if (!isSelecting.current || !startCell.current) return;
    highlightPath(startCell.current, { r, c });
  }

  function handlePointerUp(r: number, c: number) {
    if (!isSelecting.current || !startCell.current) return;
    isSelecting.current = false;
    checkSelection(startCell.current, { r, c });
    setHighlighted(new Set());
    startCell.current = null;
  }

  const answerCells = new Set<string>();

  if (showAnswers) {
    for (const solutionPath of puzzle.solutions) {
      for (const cell of solutionPath.coords) {
        answerCells.add(cellKey(cell.r, cell.c));
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="inline-grid gap-0.5 rounded-lg border border-card-border bg-background p-3"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
        role="grid"
        aria-label="Word search grid"
        onMouseLeave={() => {
          if (isSelecting.current) {
            isSelecting.current = false;
            setHighlighted(new Set());
          }
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const key = cellKey(r, c);
            const isHighlighted = highlighted.has(key);
            const isFound = foundCells.has(key);
            const isAnswer = answerCells.has(key);
            return (
              <div
                key={key}
                role="gridcell"
                aria-label={`Phoneme ${cell}`}
                data-row={r}
                data-col={c}
                className={`flex h-9 w-9 cursor-pointer select-none items-center justify-center border border-card-border font-mono text-sm font-bold sm:h-10 sm:w-10 ${
                  isFound
                    ? "bg-(--found) text-green-900"
                    : isAnswer
                      ? "bg-pink-200 dark:bg-pink-900"
                      : isHighlighted
                        ? "bg-(--highlight)"
                        : "bg-card"
                }`}
                onMouseDown={() => handlePointerDown(r, c)}
                onMouseEnter={() => handlePointerMove(r, c)}
                onMouseUp={() => handlePointerUp(r, c)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handlePointerDown(r, c);
                }}
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  const el = document.elementFromPoint(touch.clientX, touch.clientY);
                  if (el instanceof HTMLElement && el.dataset.row !== undefined) {
                    handlePointerMove(Number(el.dataset.row), Number(el.dataset.col));
                  }
                }}
                onTouchEnd={() => handlePointerUp(r, c)}
              >
                {cell}
              </div>
            );
          }),
        )}
      </div>
      <WordList words={words} foundDisplays={foundDisplays} />
    </div>
  );
}
