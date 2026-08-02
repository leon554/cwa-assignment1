import { ALL_PHONEME_KEYS } from "@/lib/phonemes";
import type { WordleConfig } from "@/lib/wordle/types";

export function generateWordleHtml(config: WordleConfig): string {
  const keyboardJson = JSON.stringify(ALL_PHONEME_KEYS);
  const configJson = JSON.stringify(config);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Phoneme Wordle — ${config.englishWord}</title>
  <style>
    :root {
      --primary: #2b5c8f;
      --bg: #f8fafc;
      --card: #ffffff;
      --text: #1e293b;
      --border: #cbd5e1;
      --correct: #22c55e;
      --present: #eab308;
      --absent: #94a3b8;
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
    h1 { color: var(--primary); margin-bottom: 20px; font-size: 1.5rem; }
    .grid { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
    .row { display: flex; gap: 6px; justify-content: center; }
    .cell {
      width: 48px; height: 48px;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid var(--border);
      border-radius: 4px;
      font-family: monospace;
      font-weight: bold;
      font-size: 0.9rem;
      background: var(--card);
    }
    .cell.correct { background: var(--correct); border-color: var(--correct); color: white; }
    .cell.present { background: var(--present); border-color: var(--present); color: white; }
    .cell.absent { background: var(--absent); border-color: var(--absent); color: white; }
    .keyboard-wrap { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 12px; }
    .keyboard { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 6px; max-width: 600px; }
    .key {
      min-width: 32px; height: 36px; padding: 0 6px;
      border: 1px solid var(--border); border-radius: 4px;
      background: var(--card); font-family: monospace;
      font-weight: bold; font-size: 0.75rem; cursor: pointer;
    }
    .key:hover { background: #e2e8f0; }
    .key.correct { background: var(--correct); color: white; border-color: var(--correct); }
    .key.present { background: var(--present); color: white; border-color: var(--present); }
    .key.absent { background: var(--absent); color: white; border-color: var(--absent); }
    .key:disabled { opacity: 0.5; cursor: not-allowed; }
    .actions { display: flex; gap: 8px; margin-top: 8px; }
    .btn {
      padding: 8px 16px; border: none; border-radius: 4px;
      font-weight: 600; cursor: pointer; font-size: 0.9rem;
    }
    .btn-enter { background: var(--primary); color: white; }
    .btn-delete { background: var(--card); border: 1px solid var(--border); }
    .status {
      margin-bottom: 16px; padding: 12px; border-radius: 8px;
      text-align: center; display: none;
    }
    .status.win { display: block; background: #bbf7d0; border: 1px solid var(--correct); }
    .status.lose { display: block; background: #f1f5f9; border: 1px solid var(--absent); }
    .message { color: #dc2626; font-size: 0.9rem; margin-bottom: 8px; min-height: 1.2em; }
    @media (max-width: 480px) {
      .cell { width: 40px; height: 40px; font-size: 0.8rem; }
      .key { min-width: 28px; height: 32px; font-size: 0.7rem; }
    }
  </style>
</head>
<body>
  <h1>Phoneme Wordle</h1>
  <div id="status" class="status" role="status"></div>
  <div id="message" class="message" role="alert"></div>
  <div id="grid" class="grid" role="grid" aria-label="Wordle guess grid"></div>
  <div class="keyboard-wrap">
    <div id="keyboard" class="keyboard" role="group" aria-label="Phoneme keyboard"></div>
    <div id="actions" class="actions"></div>
  </div>
  <script>
    const CONFIG = ${configJson};
    const KEYBOARD = ${keyboardJson};
    const target = CONFIG.targetPhonemes;
    const wordLen = target.length;
    let guesses = [];
    let current = [];
    let status = 'playing';

    function evaluateGuess(guess, target) {
      const result = Array(guess.length).fill('absent');
      const counts = {};
      target.forEach(p => counts[p] = (counts[p] || 0) + 1);
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === target[i]) {
          result[i] = 'correct';
          counts[guess[i]]--;
        }
      }
      for (let i = 0; i < guess.length; i++) {
        if (result[i] === 'correct') continue;
        if (counts[guess[i]] > 0) {
          result[i] = 'present';
          counts[guess[i]]--;
        }
      }
      return result;
    }

    function renderGrid() {
      const grid = document.getElementById('grid');
      grid.innerHTML = '';
      guesses.forEach(g => {
        const row = document.createElement('div');
        row.className = 'row';
        for (let i = 0; i < wordLen; i++) {
          const cell = document.createElement('div');
          cell.className = 'cell ' + (g.states[i] || '');
          cell.textContent = g.phonemes[i] || '';
          cell.setAttribute('role', 'gridcell');
          row.appendChild(cell);
        }
        grid.appendChild(row);
      });
      if (status === 'playing' && guesses.length < CONFIG.maxGuesses) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let i = 0; i < wordLen; i++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.textContent = current[i] || '';
          cell.setAttribute('role', 'gridcell');
          row.appendChild(cell);
        }
        grid.appendChild(row);
      }
      const remaining = CONFIG.maxGuesses - guesses.length - (status === 'playing' ? 1 : 0);
      for (let r = 0; r < remaining; r++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let i = 0; i < wordLen; i++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.setAttribute('role', 'gridcell');
          row.appendChild(cell);
        }
        grid.appendChild(row);
      }
    }

    function getKeyStates() {
      const states = {};
      const priority = { correct: 3, present: 2, absent: 1 };
      guesses.forEach(g => {
        g.phonemes.forEach((p, i) => {
          const s = g.states[i];
          if (!states[p] || priority[s] > priority[states[p]]) states[p] = s;
        });
      });
      return states;
    }

    function renderKeyboard() {
      const kb = document.getElementById('keyboard');
      kb.innerHTML = '';
      const keyStates = getKeyStates();
      KEYBOARD.forEach(keyData => {
        const btn = document.createElement('button');
        btn.className = 'key' + (keyStates[keyData.symbol] ? ' ' + keyStates[keyData.symbol] : '');
        btn.textContent = keyData.symbol;
        btn.title = '/' + keyData.symbol + '/ — ' + keyData.label + ' (' + keyData.hint + ')';
        btn.setAttribute('aria-label', btn.title);
        btn.disabled = status !== 'playing';
        btn.onclick = () => { if (current.length < wordLen) { current.push(keyData.symbol); document.getElementById('message').textContent = ''; renderGrid(); }};
        kb.appendChild(btn);
      });

      const actions = document.getElementById('actions');
      actions.innerHTML = '';
      const enterBtn = document.createElement('button');
      enterBtn.className = 'btn btn-enter';
      enterBtn.textContent = 'Enter';
      enterBtn.disabled = status !== 'playing';
      enterBtn.onclick = submitGuess;
      const delBtn = document.createElement('button');
      delBtn.className = 'btn btn-delete';
      delBtn.textContent = 'Delete';
      delBtn.disabled = status !== 'playing';
      delBtn.onclick = () => { current.pop(); renderGrid(); };
      actions.appendChild(enterBtn);
      actions.appendChild(delBtn);
    }

    function submitGuess() {
      if (status !== 'playing') return;
      if (current.length !== wordLen) {
        document.getElementById('message').textContent = 'Enter ' + wordLen + ' phonemes before submitting.';
        return;
      }
      const states = evaluateGuess(current, target);
      guesses.push({ phonemes: [...current], states });
      const won = current.every((p, i) => p === target[i]);
      current = [];
      if (won) {
        status = 'won';
        const el = document.getElementById('status');
        el.className = 'status win';
        el.innerHTML = '<strong>Correct!</strong>' + (CONFIG.showEnglishOnWin ? '<br>English word: <strong>' + CONFIG.englishWord + '</strong>' : '');
      } else if (guesses.length >= CONFIG.maxGuesses) {
        status = 'lost';
        const el = document.getElementById('status');
        el.className = 'status lose';
        el.innerHTML = '<strong>Game over</strong><br>Answer: <strong>' + target.join(' ') + '</strong> (' + CONFIG.englishWord + ')';
      }
      renderGrid();
      renderKeyboard();
    }

    renderGrid();
    renderKeyboard();
  </script>
</body>
</html>`;
}
