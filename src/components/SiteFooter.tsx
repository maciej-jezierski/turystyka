import Link from "next/link";
import { getMenuPages, getSettings } from "@/lib/data";
import Logo from "./Logo";

export default async function SiteFooter() {
  const [s, pages] = await Promise.all([getSettings(), getMenuPages()]);
  return (
    <footer className="mt-24 border-t border-line bg-muted">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-display text-lg font-bold text-ink">{s.club_name}</span>
          </div>
          {s.tagline && <p className="text-slate-600">{s.tagline}</p>}
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Na skróty</h2>
          <ul className="space-y-2">
            <li><Link href="/trasy" className="text-slate-700 no-underline hover:text-accent">Trasy</Link></li>
            <li><Link href="/zapisy" className="text-slate-700 no-underline hover:text-accent">Zapisy</Link></li>
            {pages.map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`} className="text-slate-700 no-underline hover:text-accent">{p.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2 text-slate-700">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Kontakt</h2>
          {s.postal_address && <p className="whitespace-pre-line">{s.postal_address}</p>}
          {s.contact_phone && (
            <p>
              <a href={`tel:${s.contact_phone.replace(/\s/g, "")}`} className="no-underline hover:text-accent">
                📞 {s.contact_phone}
              </a>
            </p>
          )}
          {s.contact_email && (
            <p>
              <a href={`mailto:${s.contact_email}`} className="no-underline hover:text-accent">
                ✉️ {s.contact_email}
              </a>
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 py-5 text-sm text-slate-500 sm:px-6">
          <span>© {new Date().getFullYear()} {s.club_name}</span>
          {s.footer_text && <span className="whitespace-pre-line">{s.footer_text}</span>}
        </div>
      </div>
    </footer>
  );
}
