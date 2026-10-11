import { getSettings } from "@/lib/data";

export default async function SiteFooter() {
  const s = await getSettings();
  return (
    <footer className="mt-16 border-t border-line bg-muted">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 text-base text-gray-700 md:grid-cols-2">
        <div>
          <p className="font-semibold text-gray-900">{s.club_name}</p>
          {s.postal_address && <p className="mt-1 whitespace-pre-line">{s.postal_address}</p>}
        </div>
        <div className="md:text-right">
          {s.contact_phone && (
            <p>
              Tel.: <a href={`tel:${s.contact_phone.replace(/\s/g, "")}`}>{s.contact_phone}</a>
            </p>
          )}
          {s.contact_email && (
            <p>
              E-mail: <a href={`mailto:${s.contact_email}`}>{s.contact_email}</a>
            </p>
          )}
          {s.footer_text && <p className="mt-2 whitespace-pre-line">{s.footer_text}</p>}
        </div>
      </div>
    </footer>
  );
}
