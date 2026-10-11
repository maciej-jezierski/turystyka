// Poziomice jak na mapie turystycznej – delikatne tło. Generowane deterministycznie.
function ring(cx: number, cy: number, r: number, seed: number) {
  const pts: string[] = [];
  const steps = 48;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const k =
      1 + 0.12 * Math.sin(3 * a + seed) + 0.07 * Math.sin(5 * a + seed * 1.7) + 0.04 * Math.cos(7 * a + seed * 0.6);
    pts.push(`${(cx + Math.cos(a) * r * k * 1.25).toFixed(1)},${(cy + Math.sin(a) * r * k).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
}

export default function Contours({ className = "" }: { className?: string }) {
  const hills = [
    { cx: 430, cy: 170, rings: 9, seed: 0.4 },
    { cx: 120, cy: 360, rings: 6, seed: 2.1 },
  ];
  return (
    <svg viewBox="0 0 600 480" className={className} aria-hidden preserveAspectRatio="xMidYMid slice">
      {hills.flatMap((h) =>
        Array.from({ length: h.rings }, (_, i) => (
          <path
            key={`${h.cx}-${i}`}
            d={ring(h.cx, h.cy, 18 + i * 22, h.seed + i * 0.15)}
            fill="none"
            stroke="#dce6df"
            strokeWidth={i % 4 === 3 ? 1.6 : 1}
          />
        )),
      )}
    </svg>
  );
}
