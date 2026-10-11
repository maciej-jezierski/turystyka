import Link from "next/link";
import { trailHex } from "@/lib/trail";
import type { Route } from "@/lib/types";
import { peaksLabel } from "@/lib/utils";
import RouteVisual from "./RouteVisual";
import TrailMark from "./TrailMark";

export default function RouteCard({ route }: { route: Route }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border-2 border-line bg-white">
      <RouteVisual route={route} className="block aspect-[20/11] w-full" />
      <div className="h-2" style={{ background: trailHex(route.trail_color) }} aria-hidden />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          <TrailMark color={route.trail_color} className="h-8 w-8" />
          <h3 className="text-3xl">{route.title}</h3>
        </div>
        <p className="mt-3 font-display text-xl font-bold [font-stretch:75%]">{peaksLabel(route.peaks)} do zdobycia</p>
        {route.short_description && <p className="mt-1 text-ink-soft">{route.short_description}</p>}
        {route.features.length > 0 && (
          <ul className="mt-4 space-y-1 border-t border-line pt-4 text-base">
            {route.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span aria-hidden className="font-bold text-accent">✓</span>
                {f}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex flex-col gap-2 pt-6">
          <Link href={`/zapisy?trasa=${route.slug}`} className="btn btn-primary w-full" aria-label={`Zapisz się – ${route.title}`}>
            Zapisz się
          </Link>
          <Link href={`/trasy/${route.slug}`} className="btn btn-secondary w-full">
            Szczegóły trasy
          </Link>
        </div>
      </div>
    </article>
  );
}
