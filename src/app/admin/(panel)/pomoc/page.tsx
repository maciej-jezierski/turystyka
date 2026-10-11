import BackLink from "@/components/admin/BackLink";

const TOPICS = [
  {
    q: "Jak zmienić tekst na stronie?",
    a: "Wejdź w „Strony”, kliknij „Edytuj” przy wybranej stronie i popraw tekst w polu. Zmiany zapisują się same po chwili – na dole pojawi się napis „✓ Zapisano”.",
  },
  {
    q: "Jak dodać nową stronę?",
    a: "W „Stronach” wpisz nazwę nowej strony i kliknij „Utwórz stronę”. Dodaj treść przyciskiem „+ Dodaj blok”. Gdy strona będzie gotowa, włącz przełącznik „Strona widoczna dla odwiedzających”.",
  },
  {
    q: "Jak dodać zdjęcie?",
    a: "Kliknij „+ Dodaj blok”, wybierz „Zdjęcie”, a potem „Wybierz zdjęcie” i wskaż plik na komputerze lub w telefonie.",
  },
  {
    q: "Jak zmienić kolejność?",
    a: "Użyj strzałek ⬆ i ⬇ w prawym górnym rogu bloku.",
  },
  {
    q: "Jak sprawdzić, jak strona wygląda?",
    a: "Kliknij „👁 Podgląd” na dole ekranu. Otworzy się nowa karta z wyglądem strony.",
  },
  {
    q: "Ktoś przelał pieniądze – co zrobić?",
    a: "Wejdź w „Zapisy”. Znajdź osobę po tytule przelewu (np. TK-2026-0007 Kowalski) i kliknij „✓ Oznacz jako opłacone”.",
  },
  {
    q: "Przyszła deklaracja pocztą – co zrobić?",
    a: "W „Zapisach” znajdź osobę (numer zgłoszenia powinien być na kopercie lub deklaracji) i kliknij „✉ Oznacz: deklaracja otrzymana”.",
  },
  {
    q: "Jak zmienić numer konta lub plik deklaracji?",
    a: "Wejdź w „Ustawienia”, popraw dane i kliknij „💾 Zapisz ustawienia” na dole.",
  },
  {
    q: "Usunąłem coś przez pomyłkę!",
    a: "Usunięte strony i trasy trafiają do kosza na dole listy. Kliknij „↩ Przywróć”. Jeśli usunąłeś blok – dodaj go ponownie.",
  },
];

export default function HelpPage() {
  return (
    <div>
      <BackLink href="/admin" label="Panel" />
      <h1 className="mb-6 text-3xl font-bold">❓ Pomoc</h1>
      <div className="space-y-3">
        {TOPICS.map((t) => (
          <details key={t.q} className="rounded-xl border-2 border-line bg-white p-5">
            <summary className="cursor-pointer text-xl font-semibold">{t.q}</summary>
            <p className="mt-3 text-lg leading-relaxed text-gray-800">{t.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
