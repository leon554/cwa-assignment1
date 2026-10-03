import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PageTimeTracker from "@/components/layout/PageTimeTracker";
import "./globals.css";
import { WordsProvider } from "@/providers/WordsContext";
import { getGlobalSettings } from "@/service/api-service";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({children,}: Readonly<{ children: React.ReactNode;}>) {
  const settings = await getGlobalSettings();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased ${settings.theme === "dark" ? "dark" : ""}`}
      data-layout={settings.layout}
    >
      <body className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
        <Header />
        <PageTimeTracker />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <WordsProvider>
           <main className="flex flex-1 flex-col">{children}</main>
          </WordsProvider>
          <Footer />
        </div>
      </body>
    </html>
  );
}
