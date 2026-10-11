import Link from "next/link";
import { getMenuPages, getSettings } from "@/lib/data";
import Logo from "./Logo";

export default async function SiteFooter() {
  const [s, pages] = await Promise.all([getSettings(), getMenuPages()]);
  return (
    <footer className="mt-24 border-t-2 border-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-display text-xl font-extrabold [font-stretch:75%]">
              {s.club_name}
            </span>
          </div>
          {s.tagline && <p className="text-ink-soft">{s.tagline}</p>}
        </div>
        <div>
          <h2 className="mb-3 font-sans text-base font-bold [font-stretch:100%]">
            Strony
          </h2>
          <ul className="space-y-2">
            <li>
              <Link href="/trasy" className="text-ink-soft hover:text-ink">
                Trasy
              </Link>
            </li>
            <li>
              <Link href="/zapisy" className="text-ink-soft hover:text-ink">
                Zapisy
              </Link>
            </li>
            {pages.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/${p.slug}`}
                  className="text-ink-soft hover:text-ink"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {(s.postal_address || s.contact_phone || s.contact_email) && (
          <div className="space-y-2 text-ink-soft">
            <h2 className="mb-3 font-sans text-base font-bold text-ink [font-stretch:100%]">
              Kontakt
            </h2>
            {s.postal_address && (
              <p className="whitespace-pre-line">{s.postal_address}</p>
            )}
            {s.contact_phone && (
              <p>
                Tel.{" "}
                <a
                  href={`tel:${s.contact_phone.replace(/\s/g, "")}`}
                  className="text-ink"
                >
                  {s.contact_phone}
                </a>
              </p>
            )}
            {s.contact_email && (
              <p>
                <a href={`mailto:${s.contact_email}`} className="text-ink">
                  {s.contact_email}
                </a>
              </p>
            )}
          </div>
        )}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 py-5 text-sm text-ink-soft sm:px-6">
          <span>
            © {new Date().getFullYear()} {s.club_name}
          </span>
          {s.footer_text && (
            <span className="whitespace-pre-line">{s.footer_text}</span>
          )}
        </div>
      </div>
    </footer>
  );
}
