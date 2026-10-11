import Link from "next/link";
import type { Route } from "@/lib/types";
import Peaks from "./Peaks";
import RouteVisual from "./RouteVisual";

export default function RouteCard({ route }: { route: Route }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <RouteVisual route={route} className="block aspect-[20/11] w-full" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-2xl font-bold text-gray-900">{route.title}</h3>
        <Peaks count={route.peaks} />
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
        <div className="mt-auto flex flex-wrap gap-2 pt-3">
          <Link
            href={`/trasy/${route.slug}`}
            className="rounded-lg border-2 border-accent px-4 py-2 font-semibold text-accent no-underline hover:bg-muted"
          >
            Szczegóły
          </Link>
          <Link
            href={`/zapisy?trasa=${route.slug}`}
            className="rounded-lg bg-accent px-4 py-2 font-semibold text-white no-underline hover:bg-accent-hover"
            aria-label={`Zapisz się – ${route.title}`}
          >
            Zapisz się
          </Link>
        </div>
      </div>
    </article>
  );
}
