// Znak klubu: znak szlaku w kolorze świerku.
export default function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect x="1" y="1" width="38" height="38" rx="4" fill="#fff" stroke="#17251d" strokeWidth="2" />
      <rect x="2" y="13.5" width="36" height="13" fill="#1f5134" />
    </svg>
  );
}
