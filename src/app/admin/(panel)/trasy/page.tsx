import Link from "next/link";
import BackLink from "@/components/admin/BackLink";
import StatusBadge from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/admin";
import type { Route } from "@/lib/types";
import RouteVisual from "@/components/RouteVisual";
import TrailMark from "@/components/TrailMark";
import { peaksLabel } from "@/lib/utils";
import { createRoute, restoreRoute } from "../actions";

export default async function RoutesList() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("routes")
    .select("id, title, peaks, published, deleted_at, image_url, illustration, trail_color")
    .order("sort_order")
    .order("title");
  const routes = (data ?? []) as Route[];
  const active = routes.filter((r) => !r.deleted_at);
  const trashed = routes.filter((r) => r.deleted_at);

  return (
    <div>
      <BackLink href="/admin" label="Panel" />
      <h1 className="mb-6 text-3xl font-bold">🧭 Trasy</h1>

      <form action={createRoute} className="mb-8 rounded-2xl border-2 border-accent bg-white p-5">
        <label htmlFor="title" className="mb-2 block text-xl font-bold">
          Nowa trasa
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="title"
            name="title"
            required
            placeholder="Nazwa trasy, np. Szlak Orlich Gniazd"
            className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-accent focus:outline-none"
          />
          <button className="rounded-lg bg-accent px-6 py-3 text-lg font-semibold text-white hover:bg-accent-hover">
            + Utwórz trasę
          </button>
        </div>
      </form>

      <ul className="space-y-3">
        {active.map((r) => (
          <li key={r.id}>
            <Link
              href={`/admin/trasy/${r.id}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-line bg-white p-5 no-underline hover:border-accent"
            >
              <span className="flex items-center gap-4">
                {r.image_url || r.illustration ? (
                  <RouteVisual route={r} className="block h-16 w-24 shrink-0 overflow-hidden rounded-lg" />
                ) : (
                  <span className="flex h-16 w-24 items-center justify-center rounded-lg bg-muted text-3xl">⛰</span>
                )}
                <span>
                  <span className="flex items-center gap-2 text-xl font-bold text-gray-900"><TrailMark color={r.trail_color} />{r.title}</span>
                  <span className="text-base text-gray-600">
                    {peaksLabel(r.peaks)} do zdobycia
                  </span>
                </span>
              </span>
              <span className="flex items-center gap-3">
                <StatusBadge published={r.published} />
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
            {trashed.map((r) => (
              <li key={r.id} className="flex items-center justify-between rounded-xl bg-white p-4">
                <span className="text-lg">{r.title}</span>
                <form action={restoreRoute.bind(null, r.id)}>
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
