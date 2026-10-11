import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { getRoutes, getSettings } from "@/lib/data";
import SignupForm from "./SignupForm";

export const metadata: Metadata = { title: "Zapisy" };

export default async function SignupPage({ searchParams }: PageProps<"/zapisy">) {
  const { trasa } = await searchParams;
  const [routes, settings] = await Promise.all([getRoutes(), getSettings()]);
  const selected = routes.find((r) => r.slug === trasa);

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <PageHeader title="Zapisy" text="Wybierz trasę i podaj swoje dane. Po wysłaniu zobaczysz dane do przelewu i adres do wysłania deklaracji." />
      {routes.length === 0 ? (
        <p className="text-lg">Obecnie nie prowadzimy zapisów.</p>
      ) : (
        <SignupForm
          routes={routes.map((r) => ({ id: r.id, title: r.title, peaks: r.peaks, trail_color: r.trail_color }))}
          defaultRouteId={selected?.id ?? ""}
          settings={settings}
        />
      )}
    </div>
  );
}
