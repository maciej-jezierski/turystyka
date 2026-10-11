import Link from "next/link";
import { getSettings } from "@/lib/data";

export default async function SignupInfo() {
  const s = await getSettings();
  return (
    <section className="rounded-[2rem] bg-muted p-6 sm:p-10">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-wider text-accent">Krok po kroku</p>
        <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Jak się zapisać?</h2>
      </div>
      <ol className="grid gap-5 md:grid-cols-3">
        <Step n={1} icon="📝" title="Wypełnij formularz">
          <p>Zajmie to tylko chwilę – wystarczy imię, nazwisko i e-mail.</p>
          <Link href="/zapisy" className="btn btn-ghost mt-3">
            Przejdź do formularza →
          </Link>
        </Step>
        <Step n={2} icon="✉️" title="Wyślij deklarację pocztą">
          <p>Pobierz deklarację, wydrukuj, podpisz i wyślij na adres klubu.</p>
          {s.declaration_pdf_url && (
            <a href={s.declaration_pdf_url} target="_blank" rel="noreferrer" className="btn btn-secondary mt-4 px-4 py-2 text-base">
              ↓ Pobierz deklarację (PDF)
            </a>
          )}
          {s.postal_address && (
            <p className="mt-4 whitespace-pre-line rounded-xl bg-muted p-3 text-sm text-slate-700">
              {s.postal_address}
            </p>
          )}
        </Step>
        <Step n={3} icon="🏦" title="Opłać przelewem">
          <p>Numer konta i tytuł przelewu zobaczysz zaraz po wysłaniu formularza.</p>
        </Step>
      </ol>
    </section>
  );
}

function Step({ n, icon, title, children }: { n: number; icon: string; title: string; children: React.ReactNode }) {
  return (
    <li className="relative rounded-3xl border border-line bg-white p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-2xl" aria-hidden>
          {icon}
        </span>
        <span className="font-display text-5xl font-extrabold text-accent-soft" aria-hidden>
          {n}
        </span>
      </div>
      <h3 className="mb-2 text-xl font-bold">
        <span className="sr-only">Krok {n}: </span>
        {title}
      </h3>
      <div className="text-base text-slate-600">{children}</div>
    </li>
  );
}
