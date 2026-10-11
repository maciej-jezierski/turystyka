import Link from "next/link";
import { getSettings } from "@/lib/data";

export default async function SignupInfo() {
  const s = await getSettings();
  return (
    <section className="rounded-2xl border border-line bg-muted p-6">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">Jak się zapisać?</h2>
      <ol className="space-y-4">
        <li className="flex gap-4">
          <Step n={1} />
          <div>
            <p className="font-semibold">Wypełnij formularz zgłoszeniowy na stronie.</p>
            <Link href="/zapisy" className="text-accent underline">
              Przejdź do formularza
            </Link>
          </div>
        </li>
        <li className="flex gap-4">
          <Step n={2} />
          <div>
            <p className="font-semibold">Pobierz deklarację, wydrukuj ją, podpisz i wyślij pocztą.</p>
            {s.declaration_pdf_url ? (
              <a
                href={s.declaration_pdf_url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block rounded-lg border-2 border-accent bg-white px-4 py-2 font-semibold text-accent no-underline hover:bg-muted"
              >
                📄 Pobierz deklarację (PDF)
              </a>
            ) : null}
            {s.postal_address && (
              <p className="mt-2 whitespace-pre-line text-gray-700">
                <span className="font-medium">Adres do wysyłki:</span>
                {"\n"}
                {s.postal_address}
              </p>
            )}
          </div>
        </li>
        <li className="flex gap-4">
          <Step n={3} />
          <p className="font-semibold">
            Opłać udział przelewem. Numer konta i tytuł przelewu zobaczysz po wysłaniu formularza.
          </p>
        </li>
      </ol>
    </section>
  );
}

function Step({ n }: { n: number }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-white">
      {n}
    </span>
  );
}
