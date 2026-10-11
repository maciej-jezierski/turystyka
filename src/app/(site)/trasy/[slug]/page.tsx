import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Blocks from "@/components/Blocks";
import Peaks from "@/components/Peaks";
import RouteVisual from "@/components/RouteVisual";
import SignupInfo from "@/components/SignupInfo";
import { getRouteBySlug } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/trasy/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const route = await getRouteBySlug(slug);
  return { title: route?.title ?? "Trasa", description: route?.short_description };
}

export default async function RoutePage({ params }: PageProps<"/trasy/[slug]">) {
  const { slug } = await params;
  const route = await getRouteBySlug(slug);
  if (!route) notFound();

  return (
    <div className="space-y-14">
      <div>
        <Link href="/trasy" className="text-base font-semibold text-slate-500 no-underline hover:text-accent">
          ← Wszystkie trasy
        </Link>
        <h1 className="mt-4 text-4xl font-extrabold sm:text-6xl">{route.title}</h1>
        {route.short_description && (
          <p className="mt-4 max-w-2xl text-lg text-slate-600 sm:text-xl">{route.short_description}</p>
        )}
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
        <RouteVisual route={route} className="block aspect-[20/11] w-full overflow-hidden rounded-[2rem] shadow-soft" />
        <aside className="space-y-6 rounded-[2rem] border border-line bg-white p-7 shadow-soft lg:sticky lg:top-24">
          <Peaks count={route.peaks} />
          {(route.duration || route.distance) && (
            <dl className="grid grid-cols-2 gap-3">
              {route.duration && <Info label="Czas" value={route.duration} />}
              {route.distance && <Info label="Długość" value={route.distance} />}
            </dl>
          )}
          {route.features.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">W pakiecie</h2>
              <ul className="space-y-2">
                {route.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm text-accent" aria-hidden>
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Link href={`/zapisy?trasa=${route.slug}`} className="btn btn-primary w-full py-4 text-lg">
            Zapisz się na tę trasę →
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
    <div className="rounded-2xl bg-muted p-3">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  );
}
