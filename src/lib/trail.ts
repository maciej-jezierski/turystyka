// Kolory szlaków turystycznych (jak w znakowaniu PTTK). Każdy wariant trasy ma swój kolor.
export const TRAIL_COLORS = {
  czerwony: { name: "Czerwony", hex: "#c62828" },
  niebieski: { name: "Niebieski", hex: "#1e5bb8" },
  zielony: { name: "Zielony", hex: "#2e7d32" },
  zolty: { name: "Żółty", hex: "#e3a600" },
  czarny: { name: "Czarny", hex: "#1c1c1c" },
} as const;

export type TrailColor = keyof typeof TRAIL_COLORS;

export function trailHex(color: string): string {
  return color in TRAIL_COLORS ? TRAIL_COLORS[color as TrailColor].hex : TRAIL_COLORS.zielony.hex;
}
