export default function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="12" fill="#166534" />
      <circle cx="29" cy="12" r="4" fill="#f5c451" />
      <path d="M6 31 L16 15 L21 22 L25 17 L34 31Z" fill="#ffffff" />
      <path d="M16 15 L19 19.8 L17 19.2 L15.4 20.6 L14 19Z" fill="#bcdcc5" />
    </svg>
  );
}
