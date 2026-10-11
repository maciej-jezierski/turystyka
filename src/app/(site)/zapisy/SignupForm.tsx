"use client";

import { useActionState, useState } from "react";
import type { Settings } from "@/lib/types";
import { formatPrice, peaksLabel, transferTitle } from "@/lib/utils";
import { submitSignup, type SignupState } from "./actions";
import MountainIcon from "@/components/MountainIcon";

type RouteOption = { id: string; title: string; peaks: number };

export default function SignupForm({
  routes,
  defaultRouteId,
  settings,
}: {
  routes: RouteOption[];
  defaultRouteId: string;
  settings: Settings;
}) {
  const [state, formAction, pending] = useActionState<SignupState, FormData>(submitSignup, {
    status: "idle",
  });
  const [routeId, setRouteId] = useState(defaultRouteId);
  const fee = Number(settings.fee);

  if (state.status === "ok") {
    return <Success state={state} settings={settings} />;
  }

  return (
    <form action={formAction} className="space-y-8 rounded-[2rem] border border-line bg-white p-6 shadow-soft sm:p-10">
      <fieldset>
        <legend className="mb-4 font-display text-xl font-bold text-ink">1. Wybierz trasę</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {routes.map((r) => {
            const checked = routeId === r.id;
            return (
              <label
                key={r.id}
                className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition ${
                  checked ? "border-accent bg-accent-soft" : "border-line hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="route_id"
                  value={r.id}
                  required
                  checked={checked}
                  onChange={() => setRouteId(r.id)}
                  className="h-5 w-5 accent-[var(--accent)]"
                />
                <span>
                  <span className="block text-lg font-bold text-ink">{r.title}</span>
                  <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                    <MountainIcon className="h-4 w-4 text-accent" /> {peaksLabel(r.peaks)}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-4 font-display text-xl font-bold text-ink">2. Twoje dane</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Imię" htmlFor="first_name" required>
            <input id="first_name" name="first_name" required autoComplete="given-name" className="field" />
          </Field>
          <Field label="Nazwisko" htmlFor="last_name" required>
            <input id="last_name" name="last_name" required autoComplete="family-name" className="field" />
          </Field>
          <Field label="E-mail" htmlFor="email" required>
            <input id="email" name="email" type="email" required autoComplete="email" className="field" />
          </Field>
          <Field label="Telefon" htmlFor="phone">
            <input id="phone" name="phone" type="tel" autoComplete="tel" className="field" />
          </Field>
        </div>
        <Field label="Uwagi" htmlFor="message">
          <textarea id="message" name="message" rows={3} className="field" />
        </Field>
      </fieldset>

      {/* pole-pułapka na roboty */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <label className="flex items-start gap-3 rounded-2xl bg-muted p-4 text-base text-slate-700">
        <input type="checkbox" name="consent" required className="mt-1 h-5 w-5 shrink-0 accent-[var(--accent)]" />
        <span>
          Wyrażam zgodę na przetwarzanie moich danych osobowych przez {settings.club_name} w celu organizacji
          wycieczek. <span className="text-red-700">*</span>
        </span>
      </label>

      {state.status === "error" && (
        <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-lg text-red-800">
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        {fee > 0 ? (
          <p className="text-slate-600">
            Opłata: <strong className="font-display text-2xl text-ink">{formatPrice(fee)}</strong>
          </p>
        ) : (
          <span />
        )}
        <button type="submit" disabled={pending} className="btn btn-primary px-8 py-4 text-lg disabled:opacity-60">
          {pending ? "Wysyłanie…" : "Wyślij zgłoszenie →"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-base font-semibold text-slate-800">
        {label} {required ? <span className="text-red-700">*</span> : <span className="font-normal text-slate-400">(opcjonalnie)</span>}
      </label>
      {children}
    </div>
  );
}

function Success({
  state,
  settings,
}: {
  state: Extract<SignupState, { status: "ok" }>;
  settings: Settings;
}) {
  const title = transferTitle(state.refCode, state.lastName);
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-line bg-gradient-to-br from-accent-soft to-white p-8 text-center sm:p-10">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent text-4xl text-white shadow-lift">
          ✓
        </span>
        <h2 className="mt-6 text-3xl font-extrabold">Dziękujemy za zgłoszenie!</h2>
        <p className="mt-2 text-lg text-slate-600">
          Trasa <strong className="text-ink">{state.routeTitle}</strong> · numer zgłoszenia{" "}
          <strong className="text-ink">{state.refCode}</strong>
        </p>
        <p className="mt-2 text-base text-slate-500">Zapisz lub wydrukuj tę stronę – są tu wszystkie potrzebne informacje.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-[2rem] border border-line bg-white p-7 shadow-soft">
          <p className="text-sm font-bold uppercase tracking-wider text-accent">Krok 1</p>
          <h2 className="mb-5 mt-1 text-2xl font-bold">Opłać przelewem</h2>
          <dl className="space-y-4">
            <Row label="Odbiorca" value={settings.bank_recipient || settings.club_name} />
            {settings.bank_name && <Row label="Bank" value={settings.bank_name} />}
            <Row label="Numer konta" value={settings.bank_account || "— podamy telefonicznie —"} mono />
            {state.amount > 0 && <Row label="Kwota" value={formatPrice(state.amount)} big />}
            <Row label="Tytuł przelewu" value={title} mono />
          </dl>
        </section>

        <section className="rounded-[2rem] border border-line bg-white p-7 shadow-soft">
          <p className="text-sm font-bold uppercase tracking-wider text-accent">Krok 2</p>
          <h2 className="mb-5 mt-1 text-2xl font-bold">Wyślij deklarację pocztą</h2>
          {settings.declaration_pdf_url && (
            <a href={settings.declaration_pdf_url} target="_blank" rel="noreferrer" className="btn btn-secondary">
              ↓ Pobierz deklarację (PDF)
            </a>
          )}
          <p className="mt-5 text-slate-600">Wydrukuj, podpisz i wyślij na adres:</p>
          <p className="mt-2 whitespace-pre-line rounded-2xl bg-muted p-4 text-lg font-semibold text-ink">
            {settings.postal_address || settings.club_name}
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Dopisz na kopercie numer zgłoszenia: <strong className="text-ink">{state.refCode}</strong>
          </p>
        </section>
      </div>

      <div className="text-center">
        <button type="button" onClick={() => window.print()} className="no-print btn btn-secondary">
          🖨 Drukuj tę stronę
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, mono, big }: { label: string; value: string; mono?: boolean; big?: boolean }) {
  return (
    <div className="rounded-2xl bg-muted px-4 py-3">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className={`${mono ? "font-mono tracking-wide" : ""} ${big ? "font-display text-2xl" : "text-lg"} font-bold text-ink`}>
        {value}
      </dd>
    </div>
  );
}
