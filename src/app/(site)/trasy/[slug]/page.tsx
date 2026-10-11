import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Blocks from "@/components/Blocks";
import Peaks from "@/components/Peaks";
import RouteVisual from "@/components/RouteVisual";
import SignupInfo from "@/components/SignupInfo";
import TrailMark from "@/components/TrailMark";
import { getRouteBySlug } from "@/lib/data";
import { TRAIL_COLORS, trailHex, type TrailColor } from "@/lib/trail";

export async function generateMetadata({ params }: PageProps<"/trasy/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const route = await getRouteBySlug(slug);
  return { title: route?.title ?? "Trasa", description: route?.short_description };
}

export default async function RoutePage({ params }: PageProps<"/trasy/[slug]">) {
  const { slug } = await params;
  const route = await getRouteBySlug(slug);
  if (!route) notFound();
  const colorName = TRAIL_COLORS[route.trail_color as TrailColor]?.name.toLowerCase();

  return (
    <div className="space-y-16">
      <div>
        <Link href="/trasy" className="font-bold text-ink-soft">
          Wszystkie trasy
        </Link>
        <div className="mt-5 flex items-center gap-4">
          <TrailMark color={route.trail_color} className="h-14 w-14" />
          <h1 className="text-6xl sm:text-7xl">{route.title}</h1>
        </div>
        {route.short_description && <p className="mt-4 max-w-[50ch] text-xl text-ink-soft">{route.short_description}</p>}
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
        <div className="overflow-hidden rounded-lg border-2 border-line">
          <RouteVisual route={route} className="block aspect-[20/11] w-full" />
          <div className="h-2" style={{ background: trailHex(route.trail_color) }} aria-hidden />
        </div>
        <aside className="space-y-6 rounded-lg border-2 border-ink bg-white p-6 lg:sticky lg:top-24">
          <Peaks count={route.peaks} />
          {colorName && <p className="text-ink-soft">Znak szlaku: {colorName}</p>}
          {(route.duration || route.distance) && (
            <dl className="grid grid-cols-2 gap-4 border-t border-line pt-4">
              {route.duration && <Info label="Czas" value={route.duration} />}
              {route.distance && <Info label="Długość" value={route.distance} />}
            </dl>
          )}
          {route.features.length > 0 && (
            <div className="border-t border-line pt-4">
              <h2 className="mb-2 font-sans text-base font-bold [font-stretch:100%]">W pakiecie</h2>
              <ul className="space-y-1">
                {route.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span aria-hidden className="font-bold text-accent">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Link href={`/zapisy?trasa=${route.slug}`} className="btn btn-primary w-full text-lg">
            Zapisz się na tę trasę
          </Link>
        </aside>
      </div>

      {route.blocks.length > 0 && (
        <div className="max-w-3xl">
          <Blocks blocks={route.blocks} />
        </div>
      )}
      <SignupInfo />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd className="text-lg font-bold">{value}</dd>
    </div>
  );
}
