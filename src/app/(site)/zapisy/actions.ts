"use server";

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/supabase/env";

export type SignupState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | {
      status: "ok";
      refCode: string;
      amount: number;
      routeTitle: string;
      lastName: string;
    };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitSignup(_prev: SignupState, formData: FormData): Promise<SignupState> {
  // Pole-pułapka na roboty spamujące – człowiek go nie widzi.
  if (String(formData.get("website") ?? "")) {
    return { status: "error", message: "Nie udało się wysłać formularza." };
  }

  const routeId = String(formData.get("route_id") ?? "");
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!routeId) return { status: "error", message: "Wybierz trasę." };
  if (!firstName || !lastName) return { status: "error", message: "Podaj imię i nazwisko." };
  if (!EMAIL_RE.test(email)) return { status: "error", message: "Podaj poprawny adres e-mail." };
  if (formData.get("consent") !== "on")
    return { status: "error", message: "Zaznacz zgodę na przetwarzanie danych osobowych." };

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .rpc("create_registration", {
      p_route_id: routeId,
      p_first_name: firstName,
      p_last_name: lastName,
      p_email: email,
      p_phone: phone,
      p_message: message,
    })
    .single<{ ref_code: string; amount: number; route_title: string }>();

  if (error || !data) {
    console.error("create_registration", error);
    return {
      status: "error",
      message: "Nie udało się zapisać zgłoszenia. Spróbuj ponownie lub zadzwoń do nas.",
    };
  }

  return {
    status: "ok",
    refCode: data.ref_code,
    amount: Number(data.amount),
    routeTitle: data.route_title,
    lastName,
  };
}
