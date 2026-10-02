import type { WordListMetric } from "@/types/api-types";

type WordListUsageProps = {
  wordLists: WordListMetric[];
};

export default function WordListUsage({ wordLists }: WordListUsageProps) {
  return (
    <section className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Word lists</h3>
      {wordLists.length === 0 ? (
        <p className="text-sm text-muted">There is nothing to show yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-muted">
              <tr className="border-b border-card-border">
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Words</th>
                <th className="py-2 font-medium">Activities</th>
              </tr>
            </thead>
            <tbody>
              {wordLists.map((wordList) => (
                <tr key={wordList.id} className="border-b border-card-border last:border-b-0">
                  <td className="py-2 pr-4">{wordList.name}</td>
                  <td className="py-2 pr-4">{wordList.wordCount}</td>
                  <td className="py-2">{wordList.activityCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
