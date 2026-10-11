import Link from "next/link";
import BackLink from "@/components/admin/BackLink";
import StatusBadge from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/admin";
import type { Page } from "@/lib/types";
import { createPage, restorePage } from "../actions";

export default async function PagesList() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("pages")
    .select("id, title, slug, is_home, published, show_in_menu, deleted_at")
    .order("is_home", { ascending: false })
    .order("menu_order")
    .order("title");
  const pages = (data ?? []) as Page[];
  const active = pages.filter((p) => !p.deleted_at);
  const trashed = pages.filter((p) => p.deleted_at);

  return (
    <div>
      <BackLink href="/admin" label="Panel" />
      <h1 className="mb-6 text-3xl font-bold">📄 Strony</h1>

      <form action={createPage} className="mb-8 rounded-2xl border-2 border-accent bg-white p-5">
        <label htmlFor="title" className="mb-2 block text-xl font-bold">
          Nowa strona
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="title"
            name="title"
            required
            placeholder="Nazwa strony, np. Galeria"
            className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-accent focus:outline-none"
          />
          <button className="rounded-lg bg-accent px-6 py-3 text-lg font-semibold text-white hover:bg-accent-hover">
            + Utwórz stronę
          </button>
        </div>
      </form>

      <ul className="space-y-3">
        {active.map((p) => (
          <li key={p.id}>
            <Link
              href={`/admin/strony/${p.id}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-line bg-white p-5 no-underline hover:border-accent"
            >
              <span>
                <span className="block text-xl font-bold text-gray-900">
                  {p.is_home ? "🏠 " : ""}
                  {p.title}
                </span>
                <span className="text-base text-gray-600">{p.is_home ? "Strona główna" : `/${p.slug}`}</span>
              </span>
              <span className="flex items-center gap-3">
                <StatusBadge published={p.published} />
                <span className="text-lg font-semibold text-accent">Edytuj →</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {trashed.length > 0 && (
        <details className="mt-10">
          <summary className="cursor-pointer text-lg font-semibold text-gray-700">
            🗑 Kosz ({trashed.length})
          </summary>
          <ul className="mt-3 space-y-2">
            {trashed.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-xl bg-white p-4">
                <span className="text-lg">{p.title}</span>
                <form action={restorePage.bind(null, p.id)}>
                  <button className="rounded-lg border-2 border-gray-300 px-4 py-2 font-semibold hover:bg-gray-50">
                    ↩ Przywróć
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
