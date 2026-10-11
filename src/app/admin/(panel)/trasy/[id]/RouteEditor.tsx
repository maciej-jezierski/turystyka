"use client";

import { useState } from "react";
import BlockEditor from "@/components/admin/BlockEditor";
import FileUpload from "@/components/admin/FileUpload";
import SaveBar from "@/components/admin/SaveBar";
import Toggle from "@/components/admin/Toggle";
import { useAutosave } from "@/components/admin/useAutosave";
import type { Route } from "@/lib/types";
import { DIFFICULTY_LABELS } from "@/lib/utils";
import { saveRoute, trashRoute } from "../../actions";

const inputClass =
  "w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-lg focus:border-accent focus:outline-none";

export default function RouteEditor({ route }: { route: Route }) {
  const [form, setForm] = useState({
    title: route.title,
    slug: route.slug,
    short_description: route.short_description,
    difficulty: route.difficulty,
    duration: route.duration,
    distance: route.distance,
    price: String(route.price).replace(".", ","),
    features: route.features.join("\n"),
    image_url: route.image_url,
    blocks: route.blocks,
    sort_order: route.sort_order,
    published: route.published,
  });
  const set = (patch: Partial<typeof form>) => setForm({ ...form, ...patch });

  const { status, error, saveNow } = useAutosave(form, (v) =>
    saveRoute(route.id, {
      ...v,
      price: Number(v.price.replace(/\s/g, "").replace(",", ".")),
      features: v.features.split("\n"),
    }),
  );

  return (
    <div className="space-y-6">
      <Section title="Podstawowe informacje">
        <Field label="Nazwa trasy">
          <input
            className={`${inputClass} text-2xl font-bold`}
            value={form.title}
            onChange={(e) => set({ title: e.target.value })}
          />
        </Field>
        <Field label="Krótki opis (widoczny na karcie trasy)">
          <textarea
            className={inputClass}
            rows={3}
            value={form.short_description}
            onChange={(e) => set({ short_description: e.target.value })}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Cena za osobę (zł)">
            <input
              className={inputClass}
              inputMode="decimal"
              value={form.price}
              onChange={(e) => set({ price: e.target.value })}
            />
          </Field>
          <Field label="Czas trwania">
            <input
              className={inputClass}
              placeholder="np. 3 dni"
              value={form.duration}
              onChange={(e) => set({ duration: e.target.value })}
            />
          </Field>
          <Field label="Długość trasy">
            <input
              className={inputClass}
              placeholder="np. 45 km"
              value={form.distance}
              onChange={(e) => set({ distance: e.target.value })}
            />
          </Field>
        </div>
      </Section>

      <Section title="Poziom trudności">
        <div className="grid gap-3 sm:grid-cols-4" role="radiogroup" aria-label="Poziom trudności">
          {[1, 2, 3, 4].map((level) => (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={form.difficulty === level}
              onClick={() => set({ difficulty: level })}
              className={`rounded-xl border-2 p-4 text-lg font-semibold ${
                form.difficulty === level
                  ? "border-accent bg-accent text-white"
                  : "border-gray-300 bg-white hover:border-accent"
              }`}
            >
              {"●".repeat(level)}
              {"○".repeat(4 - level)}
              <span className="block">{DIFFICULTY_LABELS[level]}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Co obejmuje cena">
        <Field label="Każda pozycja w osobnej linii">
          <textarea
            className={inputClass}
            rows={5}
            placeholder={"Przewodnik PDF\nMapa trasy\nOpieka przewodnika"}
            value={form.features}
            onChange={(e) => set({ features: e.target.value })}
          />
        </Field>
      </Section>

      <Section title="Zdjęcie główne">
        <FileUpload kind="image" value={form.image_url} onChange={(image_url) => set({ image_url })} />
      </Section>

      <Section title="Widoczność">
        <Toggle
          checked={form.published}
          onChange={(published) => set({ published })}
          label="Trasa widoczna dla odwiedzających"
          hint={form.published ? "Można się na nią zapisać." : "Szkic – nikt jej nie widzi."}
        />
      </Section>

      <div>
        <h2 className="mb-1 text-2xl font-bold">Szczegółowy opis trasy</h2>
        <p className="mb-3 text-lg text-gray-600">Pojawi się na stronie trasy, pod ceną.</p>
        <BlockEditor
          blocks={form.blocks}
          onChange={(blocks) => set({ blocks })}
          allowed={["heading", "text", "image", "file", "button"]}
        />
      </div>

      <details className="rounded-xl border-2 border-line bg-white p-5">
        <summary className="cursor-pointer text-lg font-semibold">Ustawienia dodatkowe</summary>
        <div className="mt-4 space-y-4">
          <Field label="Adres strony trasy">
            <span className="flex items-center gap-1 text-lg">
              /trasy/
              <input
                className="flex-1 rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-accent focus:outline-none"
                value={form.slug}
                onChange={(e) => set({ slug: e.target.value })}
              />
            </span>
          </Field>
          <Field label="Kolejność na liście (mniejsza liczba = wyżej)">
            <input
              type="number"
              className="w-32 rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-accent focus:outline-none"
              value={form.sort_order}
              onChange={(e) => set({ sort_order: Number(e.target.value) })}
            />
          </Field>
          <form
            action={trashRoute.bind(null, route.id)}
            onSubmit={(e) => {
              if (!confirm("Przenieść trasę do kosza? Można ją później przywrócić.")) e.preventDefault();
            }}
          >
            <button className="rounded-lg border-2 border-red-300 px-5 py-3 text-lg font-semibold text-red-700 hover:bg-red-50">
              🗑 Przenieś trasę do kosza
            </button>
          </form>
        </div>
      </details>

      <SaveBar status={status} error={error} onSave={saveNow} previewHref={`/admin/podglad/trasy/${route.id}`} />
    </div>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-semibold">{label}</span>
      {children}
    </label>
  );
}
