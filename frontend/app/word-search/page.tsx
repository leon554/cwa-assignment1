import type { Metadata } from "next";
import WordSearchPageClient from "@/components/wordsearch/WordSearchPageClient";

export const metadata: Metadata = {
  title: "Word Search",
};

export default function WordSearchPage() {
  return <WordSearchPageClient />;
}
