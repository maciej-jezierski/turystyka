"use client";

import { useState } from "react";
import BlockEditor from "@/components/admin/BlockEditor";
import SaveBar from "@/components/admin/SaveBar";
import Toggle from "@/components/admin/Toggle";
import { useAutosave } from "@/components/admin/useAutosave";
import type { Page } from "@/lib/types";
import { savePage, trashPage } from "../../actions";

export default function PageEditor({ page }: { page: Page }) {
  const [form, setForm] = useState({
    title: page.title,
    slug: page.slug,
    blocks: page.blocks,
    published: page.published,
    show_in_menu: page.show_in_menu,
    menu_order: page.menu_order,
  });
  const { status, error, saveNow } = useAutosave(form, (v) => savePage(page.id, v));

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="page-title" className="mb-1 block text-lg font-semibold">
          Nazwa strony (widoczna w menu)
        </label>
        <input
          id="page-title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-2xl font-bold focus:border-accent focus:outline-none"
        />
      </div>

      {!page.is_home && (
        <div className="space-y-3 rounded-xl border-2 border-line bg-white p-5">
          <Toggle
            checked={form.published}
            onChange={(published) => setForm({ ...form, published })}
            label="Strona widoczna dla odwiedzających"
            hint={form.published ? "Każdy może ją zobaczyć." : "Szkic – widzisz ją tylko Ty."}
          />
          <Toggle
            checked={form.show_in_menu}
            onChange={(show_in_menu) => setForm({ ...form, show_in_menu })}
            label="Pokaż w menu na górze strony"
          />
        </div>
      )}

      <div>
        <h2 className="mb-3 text-2xl font-bold">Treść strony</h2>
        <BlockEditor blocks={form.blocks} onChange={(blocks) => setForm({ ...form, blocks })} />
      </div>

      {!page.is_home && (
        <details className="rounded-xl border-2 border-line bg-white p-5">
          <summary className="cursor-pointer text-lg font-semibold">Ustawienia dodatkowe</summary>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-1 block font-semibold">Adres strony</span>
              <span className="flex items-center gap-1 text-lg">
                /
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="flex-1 rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-accent focus:outline-none"
                />
              </span>
            </label>
            <label className="block">
              <span className="mb-1 block font-semibold">Kolejność w menu (mniejsza liczba = bardziej z lewej)</span>
              <input
                type="number"
                value={form.menu_order}
                onChange={(e) => setForm({ ...form, menu_order: Number(e.target.value) })}
                className="w-32 rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-accent focus:outline-none"
              />
            </label>
            <form
              action={trashPage.bind(null, page.id)}
              onSubmit={(e) => {
                if (!confirm("Przenieść stronę do kosza? Można ją później przywrócić.")) e.preventDefault();
              }}
            >
              <button className="rounded-lg border-2 border-red-300 px-5 py-3 text-lg font-semibold text-red-700 hover:bg-red-50">
                🗑 Przenieś stronę do kosza
              </button>
            </form>
          </div>
        </details>
      )}

      <SaveBar status={status} error={error} onSave={saveNow} previewHref={`/admin/podglad/strony/${page.id}`} />
    </div>
  );
}
