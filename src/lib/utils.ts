const PL_CHARS: Record<string, string> = {
  ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z",
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (c) => PL_CHARS[c])
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// Adresy zajęte przez stałe części serwisu.
export const RESERVED_SLUGS = ["admin", "trasy", "zapisy", "api", "start"];

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(Number(value));
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Warsaw",
  }).format(new Date(value));
}

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Łatwa",
  2: "Średnia",
  3: "Trudna",
  4: "Bardzo trudna",
};

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function transferTitle(refCode: string, lastName: string): string {
  return `${refCode} ${lastName}`.trim();
}
