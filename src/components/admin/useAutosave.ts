"use client";

import { useEffect, useRef, useState } from "react";
import type { SaveResult } from "@/app/admin/(panel)/actions";

export type SaveStatus = "saved" | "dirty" | "saving" | "error";

// Zapisuje automatycznie chwilę po ostatniej zmianie.
export function useAutosave<T>(value: T, save: (value: T) => Promise<SaveResult>, delay = 1500) {
  const [status, setStatus] = useState<SaveStatus>("saved");
  const [error, setError] = useState("");
  const first = useRef(true);
  const latest = useRef(value);
  const saveRef = useRef(save);

  useEffect(() => {
    saveRef.current = save;
  });

  async function saveNow() {
    setStatus("saving");
    const result = await saveRef.current(latest.current);
    if (result.ok) {
      setStatus("saved");
      setError("");
    } else {
      setStatus("error");
      setError(result.error);
    }
  }

  useEffect(() => {
    latest.current = value;
    if (first.current) {
      first.current = false;
      return;
    }
    setStatus("dirty");
    const t = setTimeout(saveNow, delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  // Ostrzeżenie przy zamykaniu karty z niezapisanymi zmianami.
  useEffect(() => {
    if (status === "saved") return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [status]);

  return { status, error, saveNow };
}
