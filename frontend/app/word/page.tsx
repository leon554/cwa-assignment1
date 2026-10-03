import type { Metadata } from "next";
import WordPageClient from "@/components/shared/WordPageClient";

export const metadata: Metadata = {
  title: "Manage Words",
};

export default function page() {
  return (<WordPageClient/>)
}
