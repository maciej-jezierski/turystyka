import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import RouteCard from "@/components/RouteCard";
import SignupInfo from "@/components/SignupInfo";
import { getRoutes } from "@/lib/data";

export const metadata: Metadata = { title: "Trasy" };

export default async function RoutesPage() {
  const routes = await getRoutes();
  return (
    <div className="space-y-14">
      <PageHeader
        title="Trasy"
        text="Cztery warianty różnią się liczbą szczytów do zdobycia. Kolor znaku szlaku oznacza wariant w całym serwisie."
      />
      {routes.length === 0 ? (
        <p className="text-lg">Wkrótce pojawią się tu nowe trasy.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {routes.map((r) => (
            <RouteCard key={r.id} route={r} />
          ))}
        </div>
      )}
      <SignupInfo />
    </div>
  );
}
