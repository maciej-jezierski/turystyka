import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

// Treść pochodzi z bazy i jest zmieniana w panelu – zawsze pokazujemy aktualną wersję.
export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">{children}</main>
      <SiteFooter />
    </>
  );
}
