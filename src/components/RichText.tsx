import { Fragment } from "react";

const URL_RE = /(https?:\/\/[^\s]+)/g;

function Linkify({ text }: { text: string }) {
  return text.split(URL_RE).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} className="text-accent underline" target="_blank" rel="noreferrer">
        {part}
      </a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

// Zwykły tekst: pusta linia = nowy akapit, Enter = nowa linia, adresy www stają się linkami.
export default function RichText({ text }: { text: string }) {
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim());
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className="mb-4 leading-relaxed text-slate-600 last:mb-0">
          {p.split("\n").map((line, j) => (
            <Fragment key={j}>
              {j > 0 && <br />}
              <Linkify text={line} />
            </Fragment>
          ))}
        </p>
      ))}
    </>
  );
}
