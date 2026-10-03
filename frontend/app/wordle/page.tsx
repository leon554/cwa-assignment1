import type { Metadata } from "next";
import WordlePageClient from "@/components/wordle/WordlePageClient";

export const metadata: Metadata = {
  title: "Wordle",
};

export default function WordlePage() {
  return <WordlePageClient />;
}
