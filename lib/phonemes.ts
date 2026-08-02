export type PhonemeKey = {
  symbol: string;
  label: string;
  hint: string;
};

export const PHONEME_KEYBOARD_ROWS: PhonemeKey[][] = [
  [
    { symbol: "p", label: "P", hint: "as in pin" },
    { symbol: "t", label: "T", hint: "as in tin" },
    { symbol: "k", label: "K", hint: "as in kin" },
  ],
  [
    { symbol: "b", label: "B", hint: "as in bin" },
    { symbol: "d", label: "D", hint: "as in din" },
    { symbol: "g", label: "G", hint: "as in go" },
  ],
  [
    { symbol: "n", label: "N", hint: "as in no" },
    { symbol: "m", label: "M", hint: "as in me" },
    { symbol: "ŋ", label: "NG", hint: "as in ring" },
  ],
  [
    { symbol: "f", label: "F", hint: "as in fan" },
    { symbol: "s", label: "S", hint: "as in sun" },
    { symbol: "θ", label: "TH", hint: "as in thin" },
    { symbol: "ʃ", label: "SH", hint: "as in ship" },
  ],
  [
    { symbol: "v", label: "V", hint: "as in van" },
    { symbol: "z", label: "Z", hint: "as in zip" },
    { symbol: "ð", label: "TH", hint: "as in then" },
    { symbol: "ʒ", label: "ZH", hint: "as in measure" },
  ],
  [
    { symbol: "l", label: "L", hint: "as in log" },
    { symbol: "ɹ", label: "R", hint: "as in ring" },
    { symbol: "w", label: "W", hint: "as in win" },
    { symbol: "j", label: "Y", hint: "as in yes" },
    { symbol: "h", label: "H", hint: "as in hat" },
  ],
  [
    { symbol: "tʃ", label: "CH", hint: "as in chin" },
    { symbol: "dʒ", label: "J", hint: "as in jam" },
  ],
  [
    { symbol: "iː", label: "EE", hint: "as in see" },
    { symbol: "ɪ", label: "I", hint: "as in bit" },
    { symbol: "e", label: "E", hint: "as in bed" },
    { symbol: "eː", label: "AY", hint: "as in bait" },
    { symbol: "æ", label: "A", hint: "as in bad" },
  ],
  [
    { symbol: "ɐ", label: "U", hint: "as in bud" },
    { symbol: "ɐː", label: "AR", hint: "as in bark" },
    { symbol: "ɜː", label: "ER", hint: "as in bird" },
    { symbol: "ʉː", label: "OO", hint: "as in boot" },
    { symbol: "ɔ", label: "AW", hint: "as in log" },
  ],
  [
    { symbol: "oː", label: "OR", hint: "as in fork" },
    { symbol: "ʊ", label: "OO", hint: "as in book" },
    { symbol: "æɪ", label: "AI", hint: "as in bait" },
    { symbol: "ɑe", label: "IE", hint: "as in bike" },
    { symbol: "oɪ", label: "OY", hint: "as in boil" },
  ],
  [
    { symbol: "əʉ", label: "OA", hint: "as in boat" },
    { symbol: "æɔ", label: "OW", hint: "as in cloud" },
    { symbol: "ɪə", label: "EAR", hint: "as in beard" },
    { symbol: "ə", label: "UH", hint: "as in about" },
  ],
];

export const ALL_PHONEME_KEYS: PhonemeKey[] = PHONEME_KEYBOARD_ROWS.flat();

export function getPhonemeHint(symbol: string): string {
  const key = ALL_PHONEME_KEYS.find((k) => k.symbol === symbol);
  if (!key) return `/${symbol}/`;
  return `/${key.symbol}/ — ${key.label} (${key.hint})`;
}

export function formatPhonemeWord(phonemes: string[]): string {
  return phonemes.join(" ");
}
