import { notFound } from "next/navigation";
import BackLink from "@/components/admin/BackLink";
import { requireAdmin } from "@/lib/admin";
import type { Page } from "@/lib/types";
import PageEditor from "./PageEditor";

export default async function EditPage({ params }: PageProps<"/admin/strony/[id]">) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("pages").select("*").eq("id", id).maybeSingle();
  if (!data || data.deleted_at) notFound();

  return (
    <div>
      <BackLink href="/admin/strony" label="Wszystkie strony" />
      <PageEditor page={data as Page} />
    </div>
  );
}
