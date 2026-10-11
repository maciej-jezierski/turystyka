"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import type { Block, RegistrationStatus } from "@/lib/types";
import { RESERVED_SLUGS, slugify } from "@/lib/utils";

export type SaveResult = { ok: true } | { ok: false; error: string };

type Table = "pages" | "routes";

async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  table: Table,
  base: string,
  excludeId?: string,
) {
  const root = slugify(base) || (table === "pages" ? "strona" : "trasa");
  let candidate = root;
  for (let i = 2; ; i++) {
    const reserved = table === "pages" && RESERVED_SLUGS.includes(candidate);
    let query = supabase.from(table).select("id").eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data && !reserved) return candidate;
    candidate = `${root}-${i}`;
  }
}

// ---------- Strony ----------

export async function createPage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim() || "Nowa strona";
  const slug = await uniqueSlug(supabase, "pages", title);
  const blocks: Block[] = [{ id: "b1", type: "heading", text: title }];
  const { data, error } = await supabase
    .from("pages")
    .insert({ title, slug, blocks, published: false })
    .select("id")
    .single();
  if (error) throw new Error("Nie udało się utworzyć strony");
  redirect(`/admin/strony/${data.id}`);
}

export async function savePage(
  id: string,
  input: { title: string; slug: string; blocks: Block[]; published: boolean; show_in_menu: boolean; menu_order: number },
): Promise<SaveResult> {
  const { supabase } = await requireAdmin();
  const { data: current } = await supabase.from("pages").select("is_home").eq("id", id).single();
  const slug = current?.is_home ? "start" : await uniqueSlug(supabase, "pages", input.slug || input.title, id);

  const { error } = await supabase
    .from("pages")
    .update({
      title: input.title.trim() || "Bez tytułu",
      slug,
      blocks: input.blocks,
      published: current?.is_home ? true : input.published,
      show_in_menu: input.show_in_menu,
      menu_order: Math.round(input.menu_order) || 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { ok: false, error: "Nie udało się zapisać. Sprawdź połączenie z internetem." };
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function trashPage(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("pages").update({ deleted_at: new Date().toISOString() }).eq("id", id).eq("is_home", false);
  revalidatePath("/admin", "layout");
  redirect("/admin/strony");
}

export async function restorePage(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("pages").update({ deleted_at: null, published: false }).eq("id", id);
  revalidatePath("/admin", "layout");
}

// ---------- Trasy ----------

export async function createRoute(formData: FormData) {
  const { supabase } = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim() || "Nowa trasa";
  const slug = await uniqueSlug(supabase, "routes", title);
  const { data, error } = await supabase
    .from("routes")
    .insert({ title, slug, published: false })
    .select("id")
    .single();
  if (error) throw new Error("Nie udało się utworzyć trasy");
  redirect(`/admin/trasy/${data.id}`);
}

export async function saveRoute(
  id: string,
  input: {
    title: string;
    slug: string;
    short_description: string;
    peaks: number;
    duration: string;
    distance: string;
    features: string[];
    illustration: string;
    image_url: string;
    blocks: Block[];
    sort_order: number;
    published: boolean;
  },
): Promise<SaveResult> {
  const { supabase } = await requireAdmin();
  const peaks = Number(input.peaks);
  if (!Number.isInteger(peaks) || peaks < 0)
    return { ok: false, error: "Liczba szczytów musi być liczbą całkowitą, np. 28" };
  const slug = await uniqueSlug(supabase, "routes", input.slug || input.title, id);

  const { error } = await supabase
    .from("routes")
    .update({
      title: input.title.trim() || "Bez nazwy",
      slug,
      short_description: input.short_description,
      peaks,
      duration: input.duration,
      distance: input.distance,
      features: input.features.map((f) => f.trim()).filter(Boolean),
      illustration: input.illustration,
      image_url: input.image_url,
      blocks: input.blocks,
      sort_order: Math.round(input.sort_order) || 0,
      published: input.published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { ok: false, error: "Nie udało się zapisać. Sprawdź połączenie z internetem." };
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function trashRoute(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("routes").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin", "layout");
  redirect("/admin/trasy");
}

export async function restoreRoute(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("routes").update({ deleted_at: null, published: false }).eq("id", id);
  revalidatePath("/admin", "layout");
}

// ---------- Ustawienia ----------

const SETTINGS_FIELDS = [
  "club_name",
  "tagline",
  "contact_email",
  "contact_phone",
  "postal_address",
  "bank_recipient",
  "bank_account",
  "bank_name",
  "declaration_pdf_url",
  "declaration_pdf_name",
  "footer_text",
] as const;

export async function saveSettings(_prev: SaveResult | null, formData: FormData): Promise<SaveResult> {
  const { supabase } = await requireAdmin();
  const update: Record<string, string> = { updated_at: new Date().toISOString() };
  for (const field of SETTINGS_FIELDS) update[field] = String(formData.get(field) ?? "").trim();
  if (!update.club_name) return { ok: false, error: "Podaj nazwę klubu." };

  const fee = Number(String(formData.get("fee") ?? "0").replace(/\s/g, "").replace(",", ".") || 0);
  if (!Number.isFinite(fee) || fee < 0) return { ok: false, error: "Opłata musi być liczbą, np. 50" };

  const { error } = await supabase.from("settings").update({ ...update, fee }).eq("id", 1);
  if (error) return { ok: false, error: "Nie udało się zapisać ustawień." };
  revalidatePath("/admin", "layout");
  return { ok: true };
}

// ---------- Zapisy ----------

export async function setRegistrationStatus(id: string, status: RegistrationStatus) {
  const { supabase } = await requireAdmin();
  await supabase
    .from("registrations")
    .update({ status, paid_at: status === "oplacone" ? new Date().toISOString() : null })
    .eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function setDeclarationReceived(id: string, received: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from("registrations").update({ declaration_received: received }).eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function saveRegistrationNotes(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase
    .from("registrations")
    .update({ admin_notes: String(formData.get("admin_notes") ?? "") })
    .eq("id", id);
  revalidatePath("/admin", "layout");
}
