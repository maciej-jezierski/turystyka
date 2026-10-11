import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-6xl">🧭</p>
      <h1 className="mt-4 text-3xl font-bold">Nie znaleziono strony</h1>
      <p className="mt-2 text-lg text-gray-700">Ta strona nie istnieje lub została ukryta.</p>
      <Link href="/" className="mt-6 rounded-lg bg-accent px-6 py-3 text-lg font-semibold text-white no-underline">
        Wróć na stronę główną
      </Link>
    </main>
  );
}
