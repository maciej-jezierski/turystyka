import type { Metadata } from "next";
import Blocks from "@/components/Blocks";
import { getHomePage, getSettings } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: s.club_name, description: s.tagline };
}

export default async function HomePage() {
  const page = await getHomePage();
  if (!page) {
    return <p className="text-xl">Strona jest w przygotowaniu.</p>;
  }
  return <Blocks blocks={page.blocks} />;
}
