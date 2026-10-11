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
    <div className="space-y-10">
      <Link href="/trasy" className="text-accent underline">
        ← Wszystkie trasy
      </Link>
      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">{route.title}</h1>
          {route.short_description && <p className="text-xl text-gray-700">{route.short_description}</p>}
          <RouteVisual route={route} className="block aspect-[20/11] w-full rounded-2xl" />
        </div>
        <aside className="h-fit space-y-4 rounded-2xl border border-line p-6 shadow-sm">
          <Peaks count={route.peaks} large />
          {route.duration && <p>⏱ {route.duration}</p>}
          {route.distance && <p>🥾 {route.distance}</p>}
          {route.features.length > 0 && (
            <ul className="space-y-1">
              {route.features.map((f) => (
                <li key={f}>
                  <span className="text-accent">✓</span> {f}
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`/zapisy?trasa=${route.slug}`}
            className="block rounded-lg bg-accent px-5 py-3 text-center text-lg font-semibold text-white no-underline hover:bg-accent-hover"
          >
            Zapisz się
          </Link>
        </aside>
      </div>
      {route.blocks.length > 0 && <Blocks blocks={route.blocks} />}
      <SignupInfo />
    </div>
  );
}
