import Link from "next/link";
import { getRoutes } from "@/lib/data";
import type { Block } from "@/lib/types";
import Hero from "./Hero";
import RichText from "./RichText";
import RouteCard from "./RouteCard";
import SignupInfo from "./SignupInfo";

export default function Blocks({ blocks }: { blocks: Block[] }) {
  // Nagłówek i tekst tuż pod nim trzymamy razem, żeby nie rozjeżdżały się odstępy.
  const groups: Block[][] = [];
  blocks.forEach((block, i) => {
    if (block.type === "text" && blocks[i - 1]?.type === "heading") groups[groups.length - 1].push(block);
    else groups.push([block]);
  });

  return (
    <div className="space-y-10 sm:space-y-14">
      {groups.map((group) =>
        group.length === 1 ? (
          <BlockView key={group[0].id} block={group[0]} />
        ) : (
          <div key={group[0].id} className="space-y-4">
            {group.map((block) => (
              <BlockView key={block.id} block={block} />
            ))}
          </div>
        ),
      )}
    </div>
  );
}

async function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "hero":
      return <Hero block={block} />;
    case "heading":
      return block.text ? (
        <h2 className="max-w-3xl text-4xl sm:text-5xl">{block.text}</h2>
      ) : null;
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
          <img src={block.url} alt={block.caption} className="w-full rounded-lg" />
          {block.caption && (
            <figcaption className="mt-2 text-base text-ink-soft">{block.caption}</figcaption>
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
          className="flex max-w-xl items-center gap-4 rounded-lg border-2 border-line bg-white p-4 no-underline hover:border-ink"
        >
          <span className="flex h-14 w-12 shrink-0 items-center justify-center rounded-sm border-2 border-ink text-sm font-bold text-ink">
            PDF
          </span>
          <span className="flex-1">
            <span className="block font-bold text-ink">{block.label || "Pobierz plik"}</span>
            <span className="text-sm text-ink-soft">Otwórz lub pobierz plik</span>
          </span>
        </a>
      );
    case "button":
      if (!block.href) return null;
      return (
        <Link href={block.href} className="btn btn-primary px-7 text-lg">
          {block.label || "Dalej"}
        </Link>
      );
    case "routes": {
      const routes = await getRoutes();
      return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
