import type { Metadata } from "next";
import RouteCard from "@/components/RouteCard";
import SignupInfo from "@/components/SignupInfo";
import { getRoutes } from "@/lib/data";

export const metadata: Metadata = { title: "Trasy" };

export default async function RoutesPage() {
  const routes = await getRoutes();
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Nasze trasy</h1>
        <p className="mt-2 text-lg text-gray-700">Wybierz trasę dopasowaną do swoich możliwości.</p>
      </div>
      {routes.length === 0 ? (
        <p className="text-lg">Wkrótce pojawią się tu nowe trasy.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {routes.map((r) => (
            <RouteCard key={r.id} route={r} />
          ))}
        </div>
      )}
      <SignupInfo />
    </div>
  );
}
