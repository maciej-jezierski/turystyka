import { NextResponse } from "next/server";
import { getSettings } from "@/lib/data";

// Wywoływane codziennie przez Vercel Cron, żeby darmowy projekt Supabase nie był usypiany.
export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ ok: true, club: settings.club_name });
}
