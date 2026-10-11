import Link from "next/link";
import { getMenuPages, getSettings } from "@/lib/data";
import Logo from "./Logo";
import SiteNav from "./SiteNav";

export default async function SiteHeader() {
  const [settings, pages] = await Promise.all([getSettings(), getMenuPages()]);
  const links = [
    { href: "/", label: "Start" },
    { href: "/trasy", label: "Trasy" },
    ...pages.map((p) => ({ href: `/${p.slug}`, label: p.title })),
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <Logo />
          <span className="leading-tight">
            <span className="block font-display text-xl font-extrabold text-ink [font-stretch:75%]">
              {settings.club_name}
            </span>
            {settings.tagline && <span className="hidden text-sm text-ink-soft sm:block">{settings.tagline}</span>}
          </span>
        </Link>
        <SiteNav links={links} />
      </div>
    </header>
  );
}
