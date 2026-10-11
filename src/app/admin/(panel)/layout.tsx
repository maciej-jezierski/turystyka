import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import { requireAdmin } from "@/lib/admin";
import { logout } from "../logowanie/actions";

export const metadata: Metadata = { title: "Panel administratora", robots: { index: false } };

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const { user } = await requireAdmin();
  return (
    <div className="flex min-h-full flex-1 flex-col bg-muted">
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link href="/admin" className="flex items-center gap-3 no-underline">
            <Logo />
            <span className="font-display text-xl font-bold text-ink">Panel klubu</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-base">
            <span className="hidden text-gray-600 sm:inline">{user.email}</span>
            <a
              href="/"
              target="_blank"
              className="rounded-lg border-2 border-gray-300 px-4 py-2 font-semibold text-gray-800 no-underline hover:bg-gray-50"
            >
              👁 Zobacz stronę
            </a>
            <form action={logout}>
              <button className="rounded-lg border-2 border-gray-300 px-4 py-2 font-semibold hover:bg-gray-50">
                Wyloguj
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
