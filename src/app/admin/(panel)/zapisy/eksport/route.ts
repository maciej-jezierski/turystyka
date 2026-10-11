import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Registration } from "@/lib/types";

const STATUS_LABEL = { nowe: "Czeka na wpłatę", oplacone: "Opłacone", anulowane: "Anulowane" };

function cell(value: unknown): string {
  let s = String(value ?? "");
  // Ochrona przed formułami w Excelu
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/admin/logowanie", request.url));

  const status = request.nextUrl.searchParams.get("status");
  let query = supabase.from("registrations").select("*").order("created_at");
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) return new NextResponse("Błąd", { status: 500 });

  const header = [
    "Numer", "Data", "Imię", "Nazwisko", "E-mail", "Telefon", "Trasa",
    "Kwota", "Status", "Deklaracja otrzymana", "Data wpłaty", "Uwagi uczestnika", "Notatki",
  ];
  const rows = (data as Registration[]).map((r) => [
    r.ref_code,
    new Date(r.created_at).toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" }),
    r.first_name,
    r.last_name,
    r.email,
    r.phone,
    r.route_title,
    String(r.amount).replace(".", ","),
    STATUS_LABEL[r.status],
    r.declaration_received ? "tak" : "nie",
    r.paid_at ? new Date(r.paid_at).toLocaleDateString("pl-PL", { timeZone: "Europe/Warsaw" }) : "",
    r.message,
    r.admin_notes,
  ]);

  // Średnik i BOM – polski Excel otworzy plik poprawnie dwuklikiem.
  const csv = "﻿" + [header, ...rows].map((row) => row.map(cell).join(";")).join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="zapisy-${date}.csv"`,
    },
  });
}
