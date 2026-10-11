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

// 1 szczyt, 2–4 szczyty, 5+ szczytów (z wyjątkiem 12–14)
export function peaksLabel(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (n === 1) return "1 szczyt";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} szczyty`;
  return `${n} szczytów`;
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function transferTitle(refCode: string, lastName: string): string {
  return `${refCode} ${lastName}`.trim();
}
