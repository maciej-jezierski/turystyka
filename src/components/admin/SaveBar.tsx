"use client";

import type { SaveStatus } from "./useAutosave";

export default function SaveBar({
  status,
  error,
  onSave,
  previewHref,
}: {
  status: SaveStatus;
  error: string;
  onSave: () => void;
  previewHref?: string;
}) {
  const label = {
    saved: { text: "✓ Zapisano", cls: "text-green-800" },
    dirty: { text: "Zmiany czekają na zapis…", cls: "text-gray-600" },
    saving: { text: "Zapisuję…", cls: "text-gray-600" },
    error: { text: `⚠ ${error}`, cls: "text-red-700" },
  }[status];

  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-8 border-t border-line bg-white/95 px-4 py-4 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={`text-lg font-semibold ${label.cls}`} role="status">
          {label.text}
        </p>
        <div className="flex flex-wrap gap-3">
          {previewHref && (
            <a
              href={previewHref}
              target="_blank"
              className="rounded-lg border-2 border-gray-300 px-5 py-3 text-lg font-semibold text-gray-800 no-underline hover:bg-gray-50"
            >
              👁 Podgląd
            </a>
          )}
          <button
            type="button"
            onClick={onSave}
            disabled={status === "saving"}
            className="rounded-lg bg-accent px-6 py-3 text-lg font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
          >
            💾 Zapisz
          </button>
        </div>
      </div>
    </div>
  );
}
