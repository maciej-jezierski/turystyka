import Link from "next/link";

export default function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="mb-4 inline-block text-lg font-semibold text-accent underline">
      ← {label}
    </Link>
  );
}
