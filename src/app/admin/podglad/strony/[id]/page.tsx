import { notFound } from "next/navigation";
import Blocks from "@/components/Blocks";
import { requireAdmin } from "@/lib/admin";
import type { Page } from "@/lib/types";

export default async function PreviewPage({ params }: PageProps<"/admin/podglad/strony/[id]">) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("pages").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <Blocks blocks={(data as Page).blocks} />;
}
