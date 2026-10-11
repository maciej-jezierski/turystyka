import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Podgląd", robots: { index: false } };

export default async function PreviewLayout({ children }: LayoutProps<"/admin/podglad">) {
  await requireAdmin();
  return (
    <>
      <div className="bg-yellow-100 px-4 py-3 text-center text-lg font-semibold text-yellow-900">
        👁 To jest podgląd. Zamknij tę kartę, aby wrócić do edycji.
      </div>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">{children}</main>
      <SiteFooter />
    </>
  );
}
