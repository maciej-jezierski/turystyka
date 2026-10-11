import Link from "next/link";
import type { Route } from "@/lib/types";
import { DIFFICULTY_LABELS, formatPrice } from "@/lib/utils";
import Difficulty from "./Difficulty";

export default function RouteCard({ route }: { route: Route }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      {route.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={route.image_url} alt="" className="h-44 w-full object-cover" />
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-xl font-bold text-gray-900">{route.title}</h3>
        <Difficulty level={route.difficulty} />
        {route.short_description && <p className="text-gray-700">{route.short_description}</p>}
        {(route.duration || route.distance) && (
          <p className="text-base text-gray-600">
            {[route.duration, route.distance].filter(Boolean).join(" · ")}
          </p>
        )}
        {route.features.length > 0 && (
          <ul className="space-y-1 text-base">
            {route.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span aria-hidden className="text-accent">✓</span>
                {f}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-3">
          <p className="mb-3 text-2xl font-bold text-accent">
            {formatPrice(route.price)} <span className="text-base font-normal text-gray-600">/ osoba</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/trasy/${route.slug}`}
              className="rounded-lg border-2 border-accent px-4 py-2 font-semibold text-accent no-underline hover:bg-muted"
            >
              Szczegóły
            </Link>
            <Link
              href={`/zapisy?trasa=${route.slug}`}
              className="rounded-lg bg-accent px-4 py-2 font-semibold text-white no-underline hover:bg-accent-hover"
              aria-label={`Zapisz się – ${route.title} (${DIFFICULTY_LABELS[route.difficulty]})`}
            >
              Zapisz się
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
