import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

export default async function Dashboard() {
  const { supabase } = await requireAdmin();
  const { count: newCount } = await supabase
    .from("registrations")
    .select("id", { count: "exact", head: true })
    .eq("status", "nowe");

  const tiles = [
    { href: "/admin/strony", icon: "📄", title: "Strony", text: "Twórz i zmieniaj strony" },
    { href: "/admin/trasy", icon: "🧭", title: "Trasy", text: "Opisy, ceny i zdjęcia tras" },
    {
      href: "/admin/zapisy",
      icon: "👥",
      title: "Zapisy",
      text: newCount ? `Nowe zgłoszenia: ${newCount}` : "Lista zgłoszeń i wpłat",
      badge: newCount ?? 0,
    },
    { href: "/admin/ustawienia", icon: "⚙️", title: "Ustawienia", text: "Konto bankowe, adres, deklaracja" },
    { href: "/admin/pomoc", icon: "❓", title: "Pomoc", text: "Jak korzystać z panelu" },
  ];

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Dzień dobry!</h1>
      <p className="mb-8 text-lg text-gray-700">Co chcesz dzisiaj zrobić?</p>
      <div className="grid gap-5 sm:grid-cols-2">
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="relative flex items-center gap-5 rounded-2xl border-2 border-line bg-white p-6 no-underline shadow-sm transition hover:border-accent hover:shadow-md"
          >
            <span className="text-5xl" aria-hidden>
              {t.icon}
            </span>
            <span>
              <span className="block text-2xl font-bold text-gray-900">{t.title}</span>
              <span className="block text-lg text-gray-600">{t.text}</span>
            </span>
            {t.badge ? (
              <span className="absolute right-4 top-4 rounded-full bg-red-600 px-3 py-1 text-base font-bold text-white">
                {t.badge}
              </span>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
