import Link from "next/link";
import { getSettings } from "@/lib/data";

// Zapis to trzy kroki po kolei – pokazujemy je jak punkty na szlaku.
export default async function SignupInfo() {
  const s = await getSettings();
  return (
    <section className="border-t-2 border-ink pt-10">
      <h2 className="text-4xl sm:text-5xl">Jak się zapisać</h2>
      <ol className="relative mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
        <span
          aria-hidden
          className="absolute left-[1.35rem] top-6 bottom-6 border-l-[3px] border-dashed border-[#9fb0a5] md:left-6 md:right-6 md:top-[1.35rem] md:bottom-auto md:border-l-0 md:border-t-[3px]"
        />
        <Step n={1} title="Wypełnij formularz">
          <p>Imię, nazwisko, e-mail i wybrana trasa. To zajmuje dwie minuty.</p>
          <Link href="/zapisy" className="btn btn-primary mt-4">
            Otwórz formularz
          </Link>
        </Step>
        <Step n={2} title="Wyślij deklarację pocztą">
          <p>Wydrukuj deklarację, podpisz ją i wyślij na adres klubu.</p>
          {s.declaration_pdf_url && (
            <a href={s.declaration_pdf_url} target="_blank" rel="noreferrer" className="btn btn-secondary mt-4">
              Pobierz deklarację (PDF)
            </a>
          )}
          {s.postal_address && <p className="mt-4 whitespace-pre-line font-bold text-ink">{s.postal_address}</p>}
        </Step>
        <Step n={3} title="Opłać przelewem">
          <p>Numer konta i tytuł przelewu zobaczysz od razu po wysłaniu formularza.</p>
        </Step>
      </ol>
    </section>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="relative flex gap-5 md:block">
      <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-white font-display text-2xl font-extrabold [font-stretch:75%]">
        {n}
      </span>
      <div className="md:mt-5">
        <h3 className="text-2xl">{title}</h3>
        <div className="mt-2 text-ink-soft">{children}</div>
      </div>
    </li>
  );
}
