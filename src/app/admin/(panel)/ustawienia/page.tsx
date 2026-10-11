import BackLink from "@/components/admin/BackLink";
import { requireAdmin } from "@/lib/admin";
import type { Settings } from "@/lib/types";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("settings").select("*").eq("id", 1).single();
  return (
    <div>
      <BackLink href="/admin" label="Panel" />
      <h1 className="mb-6 text-3xl font-bold">⚙️ Ustawienia</h1>
      <SettingsForm settings={data as Settings} />
    </div>
  );
}
