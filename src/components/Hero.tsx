import Link from "next/link";
import { getRoutes } from "@/lib/data";
import type { Block } from "@/lib/types";
import HeroIllustration from "./HeroIllustration";

export default async function Hero({ block }: { block: Extract<Block, { type: "hero" }> }) {
  const routes = await getRoutes();
  const totalPeaks = routes.reduce((sum, r) => sum + r.peaks, 0);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-accent-soft via-white to-white px-6 py-10 sm:px-10 sm:py-14">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-accent shadow-soft">
            <span className="h-2 w-2 rounded-full bg-accent-bright" aria-hidden />
            Zapisy otwarte
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">
            {block.title || "Witamy w klubie"}
          </h1>
          {block.text && (
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">{block.text}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={block.buttonHref || "/zapisy"} className="btn btn-primary px-7 py-3.5 text-lg">
              {block.buttonLabel || "Zapisz się"} <span aria-hidden>→</span>
            </Link>
            <Link href="/trasy" className="btn btn-secondary px-7 py-3.5 text-lg">
              Zobacz trasy
            </Link>
          </div>
          {routes.length > 0 && (
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              <Stat value={routes.length} label={routes.length === 1 ? "trasa" : routes.length < 5 ? "trasy" : "tras"} />
              <Stat value={totalPeaks} label="szczytów łącznie" />
            </dl>
          )}
        </div>
        <HeroIllustration className="w-full drop-shadow-xl" />
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="block font-display text-4xl font-extrabold text-accent">{value}</span>
        <span className="text-slate-600">{label}</span>
      </dd>
    </div>
  );
}
