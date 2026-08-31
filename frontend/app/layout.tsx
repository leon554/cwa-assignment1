import { cookies } from "next/headers";
import { getLayoutFromCookie, getThemeFromCookie } from "@/lib/cookies";
import { LAYOUT_COOKIE, THEME_COOKIE } from "@/types/settings";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HCE Phoneme Activity Builder",
  description:
    "Build and preview phoneme-based Wordle and Word Search activities for Speech Pathology classrooms.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = getThemeFromCookie(cookieStore.get(THEME_COOKIE)?.value);
  const layout = getLayoutFromCookie(cookieStore.get(LAYOUT_COOKIE)?.value);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased ${theme === "dark" ? "dark" : ""}`}
      data-layout={layout}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
