"use client";

import { useId, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

const MAX_MB = 20;

export default function FileUpload({
  kind,
  value,
  onChange,
}: {
  kind: "image" | "pdf";
  value: string;
  onChange: (url: string, fileName: string) => void;
}) {
  const inputId = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Plik jest za duży (maksymalnie ${MAX_MB} MB).`);
      return;
    }
    setBusy(true);
    const dot = file.name.lastIndexOf(".");
    const ext = dot > 0 ? file.name.slice(dot + 1).toLowerCase() : kind === "pdf" ? "pdf" : "jpg";
    const base = slugify(dot > 0 ? file.name.slice(0, dot) : file.name) || "plik";
    const path = `${kind === "pdf" ? "dokumenty" : "zdjecia"}/${Date.now()}-${base}.${ext}`;

    const supabase = createClient();
    const { error: uploadError } = await supabase.storage
      .from("pliki")
      .upload(path, file, { contentType: file.type || undefined });
    setBusy(false);
    if (uploadError) {
      setError("Nie udało się wgrać pliku. Spróbuj ponownie.");
      return;
    }
    const { data } = supabase.storage.from("pliki").getPublicUrl(path);
    onChange(data.publicUrl, file.name);
  }

  return (
    <div className="space-y-3">
      {value && kind === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="max-h-64 rounded-lg border border-line" />
      )}
      {value && kind === "pdf" && (
        <a href={value} target="_blank" rel="noreferrer" className="block text-lg text-accent underline">
          📄 Otwórz wgrany plik
        </a>
      )}
      <div className="flex flex-wrap gap-3">
        <label
          htmlFor={inputId}
          className={`cursor-pointer rounded-lg border-2 border-accent bg-white px-5 py-3 text-lg font-semibold text-accent hover:bg-muted ${busy ? "pointer-events-none opacity-60" : ""}`}
        >
          {busy
            ? "Wgrywanie…"
            : value
              ? kind === "image"
                ? "🖼 Zmień zdjęcie"
                : "📎 Zmień plik"
              : kind === "image"
                ? "🖼 Wybierz zdjęcie"
                : "📎 Wybierz plik PDF"}
        </label>
        {value && !busy && (
          <button
            type="button"
            onClick={() => onChange("", "")}
            className="rounded-lg border-2 border-gray-300 px-5 py-3 text-lg hover:bg-gray-50"
          >
            Usuń
          </button>
        )}
      </div>
      <input
        id={inputId}
        type="file"
        className="sr-only"
        accept={kind === "image" ? "image/*" : "application/pdf"}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {error && <p className="text-lg text-red-700">{error}</p>}
    </div>
  );
}
