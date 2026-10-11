import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      
      <h1 className="text-5xl">Nie znaleziono strony</h1>
      <p className="mt-2 text-lg text-ink-soft">Ta strona nie istnieje lub została ukryta.</p>
      <Link href="/" className="btn btn-primary mt-8">
        Wróć na stronę główną
      </Link>
    </main>
  );
}
