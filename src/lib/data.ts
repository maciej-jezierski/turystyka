import "server-only";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "./supabase/env";
import type { Page, Route, Settings } from "./types";

// Publiczne dane strony – czytane bez sesji, RLS pokazuje tylko opublikowane treści.
function publicClient() {
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
  });
}

const EMPTY_SETTINGS: Settings = {
  club_name: "Klub Turystyczny",
  tagline: "",
  contact_email: "",
  contact_phone: "",
  postal_address: "",
  bank_recipient: "",
  bank_account: "",
  bank_name: "",
  declaration_pdf_url: "",
  declaration_pdf_name: "",
  footer_text: "",
};

export const getSettings = cache(async (): Promise<Settings> => {
  const { data } = await publicClient().from("settings").select("*").eq("id", 1).maybeSingle();
  return { ...EMPTY_SETTINGS, ...(data ?? {}) };
});

export const getMenuPages = cache(async () => {
  const { data } = await publicClient()
    .from("pages")
    .select("title, slug")
    .eq("published", true)
    .is("deleted_at", null)
    .eq("show_in_menu", true)
    .eq("is_home", false)
    .order("menu_order")
    .order("title");
  return (data ?? []) as Pick<Page, "title" | "slug">[];
});

export async function getHomePage(): Promise<Page | null> {
  const { data } = await publicClient()
    .from("pages")
    .select("*")
    .eq("is_home", true)
    .eq("published", true)
    .is("deleted_at", null)
    .maybeSingle();
  return data as Page | null;
}

export const getPageBySlug = cache(async (slug: string): Promise<Page | null> => {
  const { data } = await publicClient()
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .is("deleted_at", null)
    .maybeSingle();
  return data as Page | null;
});

export const getRoutes = cache(async (): Promise<Route[]> => {
  const { data } = await publicClient()
    .from("routes")
    .select("*")
    .eq("published", true)
    .is("deleted_at", null)
    .order("sort_order")
    .order("title");
  return (data ?? []) as Route[];
});

export const getRouteBySlug = cache(async (slug: string): Promise<Route | null> => {
  const { data } = await publicClient()
    .from("routes")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .is("deleted_at", null)
    .maybeSingle();
  return data as Route | null;
});
