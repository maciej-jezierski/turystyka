"use client";

import { useState } from "react";
import type { Block, BlockType } from "@/lib/types";
import { newId } from "@/lib/utils";
import FileUpload from "./FileUpload";

const BLOCK_INFO: Record<BlockType, { icon: string; name: string; hint: string }> = {
  heading: { icon: "🔤", name: "Nagłówek", hint: "Duży tytuł sekcji" },
  text: { icon: "📝", name: "Tekst", hint: "Zwykły tekst, akapity" },
  image: { icon: "🖼", name: "Zdjęcie", hint: "Zdjęcie z komputera lub telefonu" },
  file: { icon: "📎", name: "Plik PDF", hint: "Przycisk do pobrania pliku" },
  button: { icon: "🔘", name: "Przycisk", hint: "Przycisk prowadzący do innej strony" },
  routes: { icon: "🧭", name: "Lista tras", hint: "Karty wszystkich opublikowanych tras" },
  signup: { icon: "✍️", name: "Jak się zapisać", hint: "Instrukcja zapisu, deklaracja PDF i adres" },
};

const ORDER: BlockType[] = ["heading", "text", "image", "file", "button", "routes", "signup"];

function emptyBlock(type: BlockType): Block {
  const id = newId();
  switch (type) {
    case "heading":
    case "text":
      return { id, type, text: "" };
    case "image":
      return { id, type, url: "", caption: "" };
    case "file":
      return { id, type, url: "", label: "" };
    case "button":
      return { id, type, label: "", href: "" };
    case "routes":
    case "signup":
      return { id, type };
  }
}

const inputClass =
  "w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-lg focus:border-accent focus:outline-none";

export default function BlockEditor({
  blocks,
  onChange,
  allowed = ORDER,
}: {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  allowed?: BlockType[];
}) {
  const [pickerAt, setPickerAt] = useState<number | null>(null);

  function update(index: number, block: Block) {
    onChange(blocks.map((b, i) => (i === index ? block : b)));
  }
  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }
  function remove(index: number) {
    const info = BLOCK_INFO[blocks[index].type];
    if (!confirm(`Czy na pewno usunąć blok „${info.name}”?`)) return;
    onChange(blocks.filter((_, i) => i !== index));
  }
  function add(type: BlockType, at: number) {
    const next = [...blocks];
    next.splice(at, 0, emptyBlock(type));
    onChange(next);
    setPickerAt(null);
  }

  return (
    <div className="space-y-4">
      {blocks.length === 0 && (
        <p className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center text-lg text-gray-600">
          Strona jest pusta. Kliknij „Dodaj blok”, aby dodać treść.
        </p>
      )}

      {blocks.map((block, index) => {
        const info = BLOCK_INFO[block.type];
        return (
          <div key={block.id}>
            <section className="rounded-xl border-2 border-line bg-white p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-bold">
                  <span aria-hidden>{info.icon}</span> {info.name}
                </h3>
                <div className="flex gap-2">
                  <IconButton label="Przesuń w górę" onClick={() => move(index, -1)} disabled={index === 0}>
                    ⬆
                  </IconButton>
                  <IconButton
                    label="Przesuń w dół"
                    onClick={() => move(index, 1)}
                    disabled={index === blocks.length - 1}
                  >
                    ⬇
                  </IconButton>
                  <IconButton label="Usuń blok" onClick={() => remove(index)} danger>
                    🗑
                  </IconButton>
                </div>
              </div>
              <BlockFields block={block} onChange={(b) => update(index, b)} />
            </section>
            <AddButton
              open={pickerAt === index + 1}
              onToggle={() => setPickerAt(pickerAt === index + 1 ? null : index + 1)}
              onPick={(type) => add(type, index + 1)}
              allowed={allowed}
              small={index < blocks.length - 1}
            />
          </div>
        );
      })}

      {blocks.length === 0 && (
        <AddButton
          open={pickerAt === 0}
          onToggle={() => setPickerAt(pickerAt === 0 ? null : 0)}
          onPick={(type) => add(type, 0)}
          allowed={allowed}
        />
      )}
    </div>
  );
}

function BlockFields({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  switch (block.type) {
    case "heading":
      return (
        <input
          className={`${inputClass} text-2xl font-bold`}
          value={block.text}
          placeholder="Wpisz tytuł…"
          aria-label="Treść nagłówka"
          onChange={(e) => onChange({ ...block, text: e.target.value })}
        />
      );
    case "text":
      return (
        <div>
          <textarea
            className={inputClass}
            rows={Math.max(5, block.text.split("\n").length + 1)}
            value={block.text}
            placeholder="Wpisz tekst…"
            aria-label="Treść tekstu"
            onChange={(e) => onChange({ ...block, text: e.target.value })}
          />
          <p className="mt-1 text-base text-gray-600">
            Wskazówka: pusta linia rozpoczyna nowy akapit. Adresy stron (https://…) same staną się linkami.
          </p>
        </div>
      );
    case "image":
      return (
        <div className="space-y-3">
          <FileUpload kind="image" value={block.url} onChange={(url) => onChange({ ...block, url })} />
          <label className="block">
            <span className="mb-1 block font-semibold">Podpis pod zdjęciem (opcjonalnie)</span>
            <input
              className={inputClass}
              value={block.caption}
              onChange={(e) => onChange({ ...block, caption: e.target.value })}
            />
          </label>
        </div>
      );
    case "file":
      return (
        <div className="space-y-3">
          <FileUpload
            kind="pdf"
            value={block.url}
            onChange={(url, name) =>
              onChange({ ...block, url, label: block.label || name.replace(/\.pdf$/i, "") })
            }
          />
          <label className="block">
            <span className="mb-1 block font-semibold">Napis na przycisku</span>
            <input
              className={inputClass}
              value={block.label}
              placeholder="np. Pobierz regulamin"
              onChange={(e) => onChange({ ...block, label: e.target.value })}
            />
          </label>
        </div>
      );
    case "button":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-semibold">Napis na przycisku</span>
            <input
              className={inputClass}
              value={block.label}
              placeholder="np. Zapisz się"
              onChange={(e) => onChange({ ...block, label: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-semibold">Dokąd prowadzi</span>
            <input
              className={inputClass}
              value={block.href}
              placeholder="np. /zapisy lub /trasy"
              onChange={(e) => onChange({ ...block, href: e.target.value })}
            />
          </label>
        </div>
      );
    case "routes":
      return (
        <p className="text-lg text-gray-700">
          Tutaj pojawią się karty wszystkich opublikowanych tras. Trasy zmieniasz w zakładce „Trasy”.
        </p>
      );
    case "signup":
      return (
        <p className="text-lg text-gray-700">
          Tutaj pojawi się instrukcja zapisu: link do formularza, deklaracja PDF i adres do wysyłki.
          Te dane zmieniasz w „Ustawieniach”.
        </p>
      );
  }
}

function AddButton({
  open,
  onToggle,
  onPick,
  allowed,
  small,
}: {
  open: boolean;
  onToggle: () => void;
  onPick: (type: BlockType) => void;
  allowed: BlockType[];
  small?: boolean;
}) {
  return (
    <div className="py-3">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={
          small && !open
            ? "w-full rounded-lg border-2 border-dashed border-gray-300 py-2 text-base text-gray-600 hover:border-accent hover:text-accent"
            : "w-full rounded-lg border-2 border-dashed border-accent bg-white py-4 text-xl font-semibold text-accent hover:bg-muted"
        }
      >
        {open ? "✕ Anuluj" : small ? "+ Wstaw blok tutaj" : "+ Dodaj blok"}
      </button>
      {open && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {allowed.map((type) => {
            const info = BLOCK_INFO[type];
            return (
              <button
                key={type}
                type="button"
                onClick={() => onPick(type)}
                className="flex items-center gap-4 rounded-xl border-2 border-line bg-white p-4 text-left hover:border-accent"
              >
                <span className="text-3xl" aria-hidden>
                  {info.icon}
                </span>
                <span>
                  <span className="block text-lg font-bold">{info.name}</span>
                  <span className="block text-base text-gray-600">{info.hint}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`h-12 w-12 rounded-lg border-2 text-xl disabled:opacity-30 ${danger ? "border-red-200 hover:bg-red-50" : "border-gray-300 hover:bg-gray-50"}`}
    >
      {children}
    </button>
  );
}
