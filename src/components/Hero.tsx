import Link from "next/link";
import { getRoutes } from "@/lib/data";
import type { Block } from "@/lib/types";
import Contours from "./Contours";
import Signpost from "./Signpost";

export default async function Hero({ block }: { block: Extract<Block, { type: "hero" }> }) {
  const routes = await getRoutes();

  return (
    <section className="relative isolate">
      <Contours className="pointer-events-none absolute inset-y-[-3rem] right-[-4rem] z-0 hidden h-[calc(100%+6rem)] w-[70%] lg:block" />
      <div className="relative z-10 grid items-center gap-14 py-4 lg:grid-cols-[1.05fr_1fr] lg:py-10">
        <div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl">{block.title || "Witamy w klubie"}</h1>
          {block.text && <p className="mt-6 max-w-[34ch] text-xl text-ink-soft">{block.text}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={block.buttonHref || "/zapisy"} className="btn btn-primary px-7 text-lg">
              {block.buttonLabel || "Zapisz się"}
            </Link>
            <Link href="/trasy" className="btn btn-secondary px-7 text-lg">
              Porównaj trasy
            </Link>
          </div>
        </div>
        {routes.length > 0 && (
          <div className="pb-8">
            <Signpost routes={routes} />
          </div>
        )}
      </div>
    </section>
  );
}
