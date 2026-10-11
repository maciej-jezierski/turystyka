import type { Metadata } from "next";
import { getRoutes, getSettings } from "@/lib/data";
import SignupForm from "./SignupForm";

export const metadata: Metadata = { title: "Zapisy" };

export default async function SignupPage({ searchParams }: PageProps<"/zapisy">) {
  const { trasa } = await searchParams;
  const [routes, settings] = await Promise.all([getRoutes(), getSettings()]);
  const selected = routes.find((r) => r.slug === trasa);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">Zapisy</h1>
      {routes.length === 0 ? (
        <p className="text-lg">Obecnie nie prowadzimy zapisów.</p>
      ) : (
        <SignupForm
          routes={routes.map((r) => ({ id: r.id, title: r.title }))}
          defaultRouteId={selected?.id ?? ""}
          settings={settings}
        />
      )}
    </div>
  );
}
