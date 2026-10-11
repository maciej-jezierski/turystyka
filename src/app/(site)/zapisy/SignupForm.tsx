"use client";

import { useActionState, useState } from "react";
import TrailMark from "@/components/TrailMark";
import { trailHex } from "@/lib/trail";
import type { Settings } from "@/lib/types";
import { formatPrice, peaksLabel, transferTitle } from "@/lib/utils";
import { submitSignup, type SignupState } from "./actions";

type RouteOption = { id: string; title: string; peaks: number; trail_color: string };

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
    <form action={formAction} className="space-y-10">
      <fieldset>
        <legend className="mb-4 font-display text-3xl font-extrabold [font-stretch:75%]">Trasa</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {routes.map((r) => {
            const checked = routeId === r.id;
            return (
              <label
                key={r.id}
                className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 ${
                  checked ? "border-ink bg-muted" : "border-line hover:border-[#9fb0a5]"
                }`}
                style={checked ? { boxShadow: `inset 6px 0 0 ${trailHex(r.trail_color)}` } : undefined}
              >
                <input
                  type="radio"
                  name="route_id"
                  value={r.id}
                  required
                  checked={checked}
                  onChange={() => setRouteId(r.id)}
                  className="h-5 w-5 accent-[var(--spruce)]"
                />
                <TrailMark color={r.trail_color} className="h-8 w-8" />
                <span>
                  <span className="block font-display text-2xl font-extrabold leading-tight [font-stretch:75%]">
                    {r.title}
                  </span>
                  <span className="font-display text-lg text-ink-soft [font-stretch:75%]">{peaksLabel(r.peaks)}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-4 font-display text-3xl font-extrabold [font-stretch:75%]">Twoje dane</legend>
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

      <label className="flex items-start gap-3 text-base">
        <input type="checkbox" name="consent" required className="mt-1 h-6 w-6 shrink-0 accent-[var(--spruce)]" />
        <span>
          Wyrażam zgodę na przetwarzanie moich danych osobowych przez {settings.club_name} w celu organizacji
          wycieczek. <span className="font-bold text-red-700">(wymagane)</span>
        </span>
      </label>

      {state.status === "error" && (
        <p role="alert" className="rounded-lg border-2 border-red-700 bg-red-50 p-4 text-lg font-bold text-red-800">
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-4 border-t-2 border-ink pt-6 sm:flex-row sm:items-center sm:justify-between">
        {fee > 0 ? (
          <p className="text-lg">
            Opłata: <strong className="font-display text-3xl [font-stretch:75%]">{formatPrice(fee)}</strong>
          </p>
        ) : (
          <span />
        )}
        <button type="submit" disabled={pending} className="btn btn-primary px-8 text-lg disabled:opacity-60">
          {pending ? "Wysyłanie…" : "Wyślij zgłoszenie"}
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
      <label htmlFor={htmlFor} className="mb-1.5 block font-bold">
        {label}{" "}
        {required ? (
          <span className="font-normal text-red-700">(wymagane)</span>
        ) : (
          <span className="font-normal text-ink-soft">(nieobowiązkowe)</span>
        )}
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
    <div className="space-y-12">
      <div role="status" className="border-l-[6px] border-accent pl-6">
        <h2 className="text-5xl">Zgłoszenie przyjęte</h2>
        <p className="mt-3 text-xl">
          Trasa: <strong>{state.routeTitle}</strong>
        </p>
        <p className="text-xl">
          Numer zgłoszenia: <strong>{state.refCode}</strong>
        </p>
        <p className="mt-3 text-ink-soft">Wydrukuj tę stronę albo zapisz numer zgłoszenia – przyda się przy przelewie.</p>
      </div>

      <section>
        <h2 className="text-3xl">1. Opłać przelewem</h2>
        <dl className="mt-4 divide-y divide-line rounded-lg border-2 border-ink">
          <Row label="Odbiorca" value={settings.bank_recipient || settings.club_name} />
          {settings.bank_name && <Row label="Bank" value={settings.bank_name} />}
          <Row label="Numer konta" value={settings.bank_account || "podamy telefonicznie"} large />
          {state.amount > 0 && <Row label="Kwota" value={formatPrice(state.amount)} large />}
          <Row label="Tytuł przelewu" value={title} large />
        </dl>
      </section>

      <section>
        <h2 className="text-3xl">2. Wyślij deklarację pocztą</h2>
        <p className="mt-3 text-lg">Wydrukuj deklarację, podpisz ją i wyślij na adres:</p>
        <p className="mt-3 whitespace-pre-line text-xl font-bold">{settings.postal_address || settings.club_name}</p>
        <p className="mt-3 text-ink-soft">
          Dopisz na kopercie numer zgłoszenia <strong className="text-ink">{state.refCode}</strong>.
        </p>
        {settings.declaration_pdf_url && (
          <a href={settings.declaration_pdf_url} target="_blank" rel="noreferrer" className="btn btn-secondary mt-5">
            Pobierz deklarację (PDF)
          </a>
        )}
      </section>

      <button type="button" onClick={() => window.print()} className="no-print btn btn-secondary">
        Drukuj tę stronę
      </button>
    </div>
  );
}

function Row({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <div className="grid gap-1 px-5 py-4 sm:grid-cols-[180px_1fr] sm:items-baseline">
      <dt className="text-ink-soft">{label}</dt>
      <dd className={`font-bold ${large ? "text-2xl tracking-wide" : "text-lg"}`}>{value}</dd>
    </div>
  );
}
