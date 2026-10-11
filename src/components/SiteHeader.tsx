import Link from "next/link";
import { getMenuPages, getSettings } from "@/lib/data";

export default async function SiteHeader() {
  const [settings, pages] = await Promise.all([getSettings(), getMenuPages()]);
  const links = [
    { href: "/", label: "Strona główna" },
    { href: "/trasy", label: "Trasy" },
    ...pages.map((p) => ({ href: `/${p.slug}`, label: p.title })),
    { href: "/zapisy", label: "Zapisy" },
  ];

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-5 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="no-underline">
          <span className="block text-2xl font-bold text-accent">{settings.club_name}</span>
          {settings.tagline && (
            <span className="block text-base text-gray-600">{settings.tagline}</span>
          )}
        </Link>
        <nav aria-label="Menu główne">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-base font-medium">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-gray-800 hover:text-accent hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
