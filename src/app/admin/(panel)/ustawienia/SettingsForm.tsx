"use client";

import { useActionState, useState } from "react";
import FileUpload from "@/components/admin/FileUpload";
import type { Settings } from "@/lib/types";
import { saveSettings, type SaveResult } from "../actions";

const inputClass =
  "w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-lg focus:border-accent focus:outline-none";

export default function SettingsForm({ settings }: { settings: Settings }) {
  const [result, formAction, pending] = useActionState<SaveResult | null, FormData>(saveSettings, null);
  const [pdf, setPdf] = useState({ url: settings.declaration_pdf_url, name: settings.declaration_pdf_name });

  return (
    <form action={formAction} className="space-y-6">
      <Section title="Klub">
        <Field label="Nazwa klubu" name="club_name" value={settings.club_name} required />
        <Field label="Hasło pod nazwą (opcjonalnie)" name="tagline" value={settings.tagline} />
      </Section>

      <Section title="Kontakt">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Telefon" name="contact_phone" value={settings.contact_phone} />
          <Field label="E-mail" name="contact_email" value={settings.contact_email} type="email" />
        </div>
        <Field
          label="Adres pocztowy (tu uczestnicy wysyłają deklaracje)"
          name="postal_address"
          value={settings.postal_address}
          multiline
          placeholder={"Klub Turystyczny\nul. Przykładowa 1\n00-001 Warszawa"}
        />
      </Section>

      <Section title="Dane do przelewu">
        <Field label="Odbiorca przelewu" name="bank_recipient" value={settings.bank_recipient} />
        <Field
          label="Numer konta"
          name="bank_account"
          value={settings.bank_account}
          placeholder="00 0000 0000 0000 0000 0000 0000"
        />
        <Field label="Nazwa banku (opcjonalnie)" name="bank_name" value={settings.bank_name} />
        <Field
          label="Opłata za zapis w zł (0 = bez kwoty)"
          name="fee"
          value={String(settings.fee ?? 0).replace(".", ",")}
        />
      </Section>

      <Section title="Deklaracja do podpisania (PDF)">
        <p className="text-lg text-gray-700">
          Ten plik uczestnicy pobierają, drukują, podpisują i wysyłają pocztą.
        </p>
        <FileUpload kind="pdf" value={pdf.url} onChange={(url, name) => setPdf({ url, name })} />
        <input type="hidden" name="declaration_pdf_url" value={pdf.url} />
        <input type="hidden" name="declaration_pdf_name" value={pdf.name} />
      </Section>

      <Section title="Stopka strony">
        <Field label="Dodatkowy tekst w stopce (opcjonalnie)" name="footer_text" value={settings.footer_text} multiline />
      </Section>

      <div className="sticky bottom-0 z-10 -mx-4 border-t border-line bg-white/95 px-4 py-4 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" className="text-lg font-semibold">
            {result?.ok && <span className="text-green-800">✓ Zapisano</span>}
            {result && !result.ok && <span className="text-red-700">⚠ {result.error}</span>}
          </p>
          <button
            disabled={pending}
            className="rounded-lg bg-accent px-6 py-3 text-lg font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
          >
            {pending ? "Zapisuję…" : "💾 Zapisz ustawienia"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-xl border-2 border-line bg-white p-5">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  name,
  value,
  type = "text",
  multiline,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  multiline?: boolean;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-semibold">{label}</span>
      {multiline ? (
        <textarea name={name} defaultValue={value} rows={4} placeholder={placeholder} className={inputClass} />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={value}
          required={required}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </label>
  );
}
