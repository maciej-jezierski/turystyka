import { notFound } from "next/navigation";
import Blocks from "@/components/Blocks";
import RouteCard from "@/components/RouteCard";
import { requireAdmin } from "@/lib/admin";
import type { Route } from "@/lib/types";

export default async function PreviewRoute({ params }: PageProps<"/admin/podglad/trasy/[id]">) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("routes").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const route = data as Route;
  return (
    <div className="space-y-10">
      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-600">Karta trasy na liście:</h2>
        <div className="max-w-md">
          <RouteCard route={route} />
        </div>
      </div>
      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-600">Szczegółowy opis:</h2>
        <Blocks blocks={route.blocks} />
      </div>
    </div>
  );
}
