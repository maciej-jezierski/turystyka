import { notFound } from "next/navigation";
import BackLink from "@/components/admin/BackLink";
import { requireAdmin } from "@/lib/admin";
import type { Route } from "@/lib/types";
import RouteEditor from "./RouteEditor";

export default async function EditRoute({ params }: PageProps<"/admin/trasy/[id]">) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("routes").select("*").eq("id", id).maybeSingle();
  if (!data || data.deleted_at) notFound();

  return (
    <div>
      <BackLink href="/admin/trasy" label="Wszystkie trasy" />
      <RouteEditor route={data as Route} />
    </div>
  );
}
