"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavLink = { href: string; label: string };

export default function SiteNav({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <nav aria-label="Menu główne" className="hidden items-center gap-7 lg:flex">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={isActive(l.href) ? "page" : undefined}
            className={`border-b-[3px] py-1 font-bold no-underline ${
              isActive(l.href) ? "border-accent text-ink" : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {l.label}
          </Link>
        ))}
        <Link href="/zapisy" className="btn btn-primary">
          Zapisz się
        </Link>
      </nav>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="btn btn-secondary lg:hidden"
      >
        {open ? "Zamknij" : "Menu"}
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Menu główne"
          className="absolute inset-x-0 top-full border-b-2 border-ink bg-white px-4 pb-6 pt-2 lg:hidden"
        >
          <ul>
            {links.map((l) => (
              <li key={l.href} className="border-b border-line">
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`block py-4 text-xl font-bold no-underline ${isActive(l.href) ? "text-accent" : "text-ink"}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/zapisy" onClick={() => setOpen(false)} className="btn btn-primary mt-5 w-full">
            Zapisz się
          </Link>
        </nav>
      )}
    </>
  );
}
