import Link from "next/link";
import type { Route } from "@/lib/types";
import { peaksLabel } from "@/lib/utils";
import TrailMark from "./TrailMark";

const ARROW = "polygon(0 0, calc(100% - 1.4rem) 0, 100% 50%, calc(100% - 1.4rem) 100%, 0 100%)";

// Drogowskaz szlaku: każda tabliczka prowadzi do jednego wariantu trasy.
export default function Signpost({ routes }: { routes: Route[] }) {
  return (
    <nav aria-label="Warianty tras" className="relative pl-6 sm:pl-10">
      <span aria-hidden className="absolute bottom-[-2rem] left-6 top-[-1.5rem] w-3 rounded-t-sm bg-[#7d8a82] sm:left-10" />
      <div className="relative space-y-2.5">
        <p className="relative ml-[-0.5rem] inline-block rounded-sm bg-accent px-5 py-2.5 font-display text-xl font-extrabold text-white [font-stretch:75%]">
          Wybierz trasę
        </p>
        {routes.map((r) => (
          <Link
            key={r.id}
            href={`/trasy/${r.slug}`}
            className="group relative block bg-ink p-[2px] no-underline"
            style={{ clipPath: ARROW }}
          >
            <span
              className="flex items-center gap-3 bg-white py-3 pl-3 pr-8 transition-colors group-hover:bg-muted sm:gap-4 sm:pl-4 sm:pr-10"
              style={{ clipPath: ARROW }}
            >
              <TrailMark color={r.trail_color} className="h-8 w-8 sm:h-9 sm:w-9" />
              <span className="flex-1 font-display text-2xl font-extrabold text-ink [font-stretch:75%] sm:text-3xl">
                {r.title}
              </span>
              <span className="whitespace-nowrap text-right font-display text-base font-bold text-ink-soft [font-stretch:75%] sm:text-lg">{peaksLabel(r.peaks)}</span>
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
