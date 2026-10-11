import Link from "next/link";
import { getRoutes } from "@/lib/data";
import type { Block } from "@/lib/types";
import RichText from "./RichText";
import RouteCard from "./RouteCard";
import SignupInfo from "./SignupInfo";

export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-8">
      {blocks.map((block) => (
        <BlockView key={block.id} block={block} />
      ))}
    </div>
  );
}

async function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "heading":
      return block.text ? <h2 className="text-3xl font-bold text-gray-900">{block.text}</h2> : null;
    case "text":
      return (
        <div className="max-w-3xl text-lg">
          <RichText text={block.text} />
        </div>
      );
    case "image":
      if (!block.url) return null;
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.url} alt={block.caption} className="w-full rounded-2xl" />
          {block.caption && (
            <figcaption className="mt-2 text-base text-gray-600">{block.caption}</figcaption>
          )}
        </figure>
      );
    case "file":
      if (!block.url) return null;
      return (
        <a
          href={block.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border-2 border-accent px-5 py-3 font-semibold text-accent no-underline hover:bg-muted"
        >
          📄 {block.label || "Pobierz plik"}
        </a>
      );
    case "button":
      if (!block.href) return null;
      return (
        <Link
          href={block.href}
          className="inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-white no-underline hover:bg-accent-hover"
        >
          {block.label || "Dalej"}
        </Link>
      );
    case "routes": {
      const routes = await getRoutes();
      return (
        <div className="grid gap-6 sm:grid-cols-2">
          {routes.map((r) => (
            <RouteCard key={r.id} route={r} />
          ))}
        </div>
      );
    }
    case "signup":
      return <SignupInfo />;
    default:
      return null;
  }
}
