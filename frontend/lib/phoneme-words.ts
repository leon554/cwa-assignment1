export type PhonemeWord = {
  english: string;
  phonemes: string[];
};

export const WORDLE_PRESETS: PhonemeWord[] = [
  { english: "chin", phonemes: ["tʃ", "ɪ", "n"] },
  { english: "thin", phonemes: ["θ", "ɪ", "n"] },
  { english: "jam", phonemes: ["dʒ", "æ", "m"] },
  { english: "bad", phonemes: ["b", "æ", "d"] },
  { english: "boot", phonemes: ["b", "ʉː", "t"] },
  { english: "log", phonemes: ["l", "ɔ", "ɡ"] },
  { english: "ring", phonemes: ["ɹ", "ɪ", "ŋ"] },
  { english: "ship", phonemes: ["ʃ", "ɪ", "p"] },
  { english: "bed", phonemes: ["b", "e", "d"] },
  { english: "fan", phonemes: ["f", "æ", "n"] },
];

export const DEFAULT_WORDLE_WORD = WORDLE_PRESETS[0];

export const DEFAULT_WORD_SEARCH_WORDS: PhonemeWord[] = [
  { english: "chin", phonemes: ["tʃ", "ɪ", "n"] },
  { english: "jam", phonemes: ["dʒ", "æ", "m"] },
  { english: "bad", phonemes: ["b", "æ", "d"] },
  { english: "boot", phonemes: ["b", "ʉː", "t"] },
  { english: "log", phonemes: ["l", "ɔ", "ɡ"] },
];

export function phonemeWordToLine(word: PhonemeWord): string {
  return word.phonemes.join(" ");
}

export function defaultWordSearchText(): string {
  return DEFAULT_WORD_SEARCH_WORDS.map(phonemeWordToLine).join("\n");
}

export function parseWordSearchLines(text: string): PhonemeWord[] {
  return text
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line, index) => {
      const phonemes = line.includes(" ")
        ? line.split(/\s+/)
        : line.split("");
      return {
        english: `word-${index + 1}`,
        phonemes,
      };
    });
}
