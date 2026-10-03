import Link from "next/link";
import MainNavClient from "./MainNavClient";
import MobileMenu from "./MobileMenu";

export default function Header() {
  return (
    <header className="z-40 border-b border-card-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="min-w-0">
          <h1 className="truncate text-lg font-bold text-primary sm:text-xl">
            HCE Phoneme Activity Builder
          </h1>
        </Link>
        <MainNavClient />
        <MobileMenu />
      </div>
    </header>
  );
}
