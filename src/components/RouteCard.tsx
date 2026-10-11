import Link from "next/link";
import type { Route } from "@/lib/types";
import { peaksLabel } from "@/lib/utils";
import RouteVisual from "./RouteVisual";
import MountainIcon from "./MountainIcon";

export default function RouteCard({ route }: { route: Route }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative overflow-hidden">
        <RouteVisual
          route={route}
          className="block aspect-[20/11] w-full transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-sm font-bold text-accent shadow-soft backdrop-blur">
          <MountainIcon /> {peaksLabel(route.peaks)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl font-extrabold">
          <Link href={`/trasy/${route.slug}`} className="text-ink no-underline after:absolute after:inset-0">
            {route.title}
          </Link>
        </h3>
        {route.short_description && <p className="mt-2 text-base text-slate-600">{route.short_description}</p>}
        {route.features.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {route.features.map((f) => (
              <li key={f} className="rounded-full bg-muted px-3 py-1 text-sm text-slate-700">
                {f}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto space-y-3 pt-6">
          <Link
            href={`/zapisy?trasa=${route.slug}`}
            className="btn btn-primary relative z-10 w-full py-3 text-base"
            aria-label={`Zapisz się – ${route.title}`}
          >
            Zapisz się
          </Link>
          <p className="text-center text-base font-semibold text-accent">
            Zobacz szczegóły <span aria-hidden className="inline-block transition group-hover:translate-x-1">→</span>
          </p>
        </div>
      </div>
    </article>
  );
}
