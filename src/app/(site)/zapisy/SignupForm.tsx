"use client";

import { useActionState, useState } from "react";
import type { Settings } from "@/lib/types";
import { formatPrice, transferTitle } from "@/lib/utils";
import { submitSignup, type SignupState } from "./actions";

type RouteOption = { id: string; title: string };

const inputClass =
  "w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-accent focus:outline-none";

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
    <form action={formAction} className="space-y-5">
      <p className="text-lg text-gray-700">
        Wypełnij formularz. Pola oznaczone gwiazdką (*) są obowiązkowe.
      </p>

      <Field label="Trasa *" htmlFor="route_id">
        <select
          id="route_id"
          name="route_id"
          required
          value={routeId}
          onChange={(e) => setRouteId(e.target.value)}
          className={inputClass}
        >
          <option value="">— wybierz trasę —</option>
          {routes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Imię *" htmlFor="first_name">
          <input id="first_name" name="first_name" required autoComplete="given-name" className={inputClass} />
        </Field>
        <Field label="Nazwisko *" htmlFor="last_name">
          <input id="last_name" name="last_name" required autoComplete="family-name" className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="E-mail *" htmlFor="email">
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </Field>
        <Field label="Telefon" htmlFor="phone">
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
        </Field>
      </div>

      <Field label="Uwagi (opcjonalnie)" htmlFor="message">
        <textarea id="message" name="message" rows={3} className={inputClass} />
      </Field>

      {/* pole-pułapka na roboty */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <label className="flex items-start gap-3 text-base">
        <input type="checkbox" name="consent" required className="mt-1 h-6 w-6 shrink-0 accent-accent" />
        <span>
          Wyrażam zgodę na przetwarzanie moich danych osobowych przez {settings.club_name} w celu
          organizacji wycieczki. *
        </span>
      </label>

      {fee > 0 && (
        <p className="rounded-lg bg-muted p-4 text-lg">
          Opłata: <strong>{formatPrice(fee)}</strong>
        </p>
      )}

      {state.status === "error" && (
        <p role="alert" className="rounded-lg border-2 border-red-300 bg-red-50 p-4 text-lg text-red-800">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-accent px-6 py-4 text-xl font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Wysyłanie…" : "Wyślij zgłoszenie"}
      </button>
    </form>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block font-semibold">
        {label}
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
      <div className="rounded-2xl border-2 border-green-300 bg-green-50 p-6">
        <p className="text-2xl font-bold text-green-900">✓ Dziękujemy! Zgłoszenie zostało przyjęte.</p>
        <p className="mt-2 text-lg">
          Numer zgłoszenia: <strong>{state.refCode}</strong>
        </p>
        <p className="text-lg">Trasa: {state.routeTitle}</p>
        <p className="mt-2 text-base text-gray-700">
          Zapisz lub wydrukuj tę stronę – znajdziesz tu wszystkie potrzebne informacje.
        </p>
      </div>

      <section className="rounded-2xl border border-line p-6">
        <h2 className="mb-4 text-2xl font-bold">1. Opłać udział przelewem</h2>
        <dl className="grid gap-x-6 gap-y-3 text-lg sm:grid-cols-[auto_1fr]">
          <dt className="text-gray-600">Odbiorca:</dt>
          <dd className="font-semibold">{settings.bank_recipient || settings.club_name}</dd>
          {settings.bank_name && (
            <>
              <dt className="text-gray-600">Bank:</dt>
              <dd className="font-semibold">{settings.bank_name}</dd>
            </>
          )}
          <dt className="text-gray-600">Numer konta:</dt>
          <dd className="font-mono text-xl font-bold tracking-wide">
            {settings.bank_account || "— numer konta zostanie podany telefonicznie —"}
          </dd>
          {state.amount > 0 && (
            <>
              <dt className="text-gray-600">Kwota:</dt>
              <dd className="text-xl font-bold">{formatPrice(state.amount)}</dd>
            </>
          )}
          <dt className="text-gray-600">Tytuł przelewu:</dt>
          <dd className="font-mono text-xl font-bold">{title}</dd>
        </dl>
      </section>

      <section className="rounded-2xl border border-line p-6">
        <h2 className="mb-4 text-2xl font-bold">2. Wyślij podpisaną deklarację pocztą</h2>
        {settings.declaration_pdf_url && (
          <a
            href={settings.declaration_pdf_url}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-lg border-2 border-accent px-5 py-3 text-lg font-semibold text-accent no-underline hover:bg-muted"
          >
            📄 Pobierz deklarację (PDF)
          </a>
        )}
        <p className="mt-4 text-lg">Wydrukuj deklarację, podpisz ją i wyślij na adres:</p>
        <p className="mt-2 whitespace-pre-line text-lg font-semibold">
          {settings.postal_address || settings.club_name}
        </p>
        <p className="mt-2 text-base text-gray-700">
          Na kopercie lub deklaracji dopisz numer zgłoszenia: <strong>{state.refCode}</strong>
        </p>
      </section>

      <button
        type="button"
        onClick={() => window.print()}
        className="no-print rounded-lg border-2 border-gray-400 px-5 py-3 text-lg font-semibold hover:bg-gray-50"
      >
        🖨 Drukuj tę stronę
      </button>
    </div>
  );
}
