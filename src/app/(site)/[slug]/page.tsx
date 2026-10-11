import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Blocks from "@/components/Blocks";
import { getPageBySlug, getSettings } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [page, s] = await Promise.all([getPageBySlug(slug), getSettings()]);
  return { title: page ? `${page.title} – ${s.club_name}` : s.club_name };
}

export default async function CustomPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();
  return <Blocks blocks={page.blocks} />;
}
