export default function MountainIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M2 20 L9 7 L13 13.5 L16 9.5 L22 20Z" fill="currentColor" />
      <path d="M9 7 L11.2 11 L9.7 10.5 L8.4 11.6 L7.4 10Z" fill="#fff" />
    </svg>
  );
}
