import { trailHex } from "@/lib/trail";

// Znak szlaku: biały – kolor – biały, jak na drzewach przy szlakach górskich.
export default function TrailMark({ color, className = "h-6 w-6" }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} aria-hidden>
      <rect x="0.75" y="0.75" width="22.5" height="22.5" rx="2" fill="#fff" stroke="#c9d3cc" strokeWidth="1.5" />
      <rect x="1.5" y="8" width="21" height="8" fill={trailHex(color)} />
    </svg>
  );
}
