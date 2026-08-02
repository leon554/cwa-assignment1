import type { PlacedWord } from "@/lib/wordsearch/types";

type WordListProps = {
  words: PlacedWord[];
  foundDisplays: Set<string>;
};

export default function WordList({ words, foundDisplays }: WordListProps) {
  return (
    <div className="w-full rounded-lg border border-card-border bg-background p-4">
      <h4 className="mb-2 text-sm font-semibold">Word list</h4>
      <ul className="flex flex-wrap gap-2">
        {words.map((word) => (
          <li
            key={word.display}
            className={`rounded-md px-3 py-1 text-sm font-medium ${
              foundDisplays.has(word.display)
                ? "bg-(--found) line-through"
                : "bg-card"
            }`}
          >
            {word.cleanDisplay}
          </li>
        ))}
      </ul>
    </div>
  );
}
