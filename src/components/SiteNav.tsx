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
      <nav aria-label="Menu główne" className="hidden items-center gap-1 lg:flex">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-full px-4 py-2 text-[0.95rem] font-medium no-underline transition ${
              isActive(l.href) ? "bg-accent-soft text-accent" : "text-slate-700 hover:bg-muted hover:text-ink"
            }`}
          >
            {l.label}
          </Link>
        ))}
        <Link href="/zapisy" className="btn btn-primary ml-3 py-2.5 text-[0.95rem]">
          Zapisz się
        </Link>
      </nav>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex items-center gap-2 rounded-full border border-line px-4 py-2 font-semibold lg:hidden"
      >
        <span aria-hidden className="text-xl leading-none">{open ? "✕" : "☰"}</span>
        Menu
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Menu główne"
          className="absolute inset-x-0 top-full border-b border-line bg-white px-4 pb-6 pt-2 shadow-soft lg:hidden"
        >
          <ul className="space-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-lg font-medium no-underline ${
                    isActive(l.href) ? "bg-accent-soft text-accent" : "text-slate-800 hover:bg-muted"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/zapisy" onClick={() => setOpen(false)} className="btn btn-primary mt-4 w-full">
            Zapisz się
          </Link>
        </nav>
      )}
    </>
  );
}
