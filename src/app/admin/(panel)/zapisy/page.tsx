import Link from "next/link";
import BackLink from "@/components/admin/BackLink";
import { requireAdmin } from "@/lib/admin";
import type { Registration, RegistrationStatus } from "@/lib/types";
import { formatDate, formatPrice, transferTitle } from "@/lib/utils";
import { saveRegistrationNotes, setDeclarationReceived, setRegistrationStatus } from "../actions";

const FILTERS: { value: string; label: string }[] = [
  { value: "", label: "Wszystkie" },
  { value: "nowe", label: "Czekają na wpłatę" },
  { value: "oplacone", label: "Opłacone" },
  { value: "anulowane", label: "Anulowane" },
];

const STATUS_BADGE: Record<RegistrationStatus, { label: string; cls: string }> = {
  nowe: { label: "Czeka na wpłatę", cls: "bg-yellow-100 text-yellow-900" },
  oplacone: { label: "✓ Opłacone", cls: "bg-green-100 text-green-900" },
  anulowane: { label: "Anulowane", cls: "bg-gray-200 text-gray-700" },
};

export default async function RegistrationsPage({ searchParams }: PageProps<"/admin/zapisy">) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : "";
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const { supabase } = await requireAdmin();

  let query = supabase.from("registrations").select("*").order("created_at", { ascending: false }).limit(500);
  if (status) query = query.eq("status", status);
  if (q) {
    const safe = q.replace(/[%,()]/g, " ");
    query = query.or(
      `last_name.ilike.%${safe}%,first_name.ilike.%${safe}%,email.ilike.%${safe}%,ref_code.ilike.%${safe}%`,
    );
  }
  const { data } = await query;
  const rows = (data ?? []) as Registration[];

  return (
    <div>
      <BackLink href="/admin" label="Panel" />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">👥 Zapisy</h1>
        <a
          href={`/admin/zapisy/eksport${status ? `?status=${status}` : ""}`}
          className="rounded-lg border-2 border-accent bg-white px-5 py-3 text-lg font-semibold text-accent no-underline hover:bg-muted"
        >
          ⬇ Pobierz do Excela
        </a>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/admin/zapisy?status=${f.value}` : "/admin/zapisy"}
            className={`rounded-full border-2 px-4 py-2 text-base font-semibold no-underline ${
              status === f.value
                ? "border-accent bg-accent text-white"
                : "border-gray-300 bg-white text-gray-800 hover:border-accent"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <form className="mb-6 flex gap-2">
        {status && <input type="hidden" name="status" value={status} />}
        <input
          name="q"
          defaultValue={q}
          placeholder="Szukaj: nazwisko, e-mail lub numer zgłoszenia"
          className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-lg focus:border-accent focus:outline-none"
        />
        <button className="rounded-lg bg-accent px-5 py-3 text-lg font-semibold text-white hover:bg-accent-hover">
          Szukaj
        </button>
      </form>

      {rows.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-lg text-gray-600">Brak zgłoszeń.</p>
      ) : (
        <ul className="space-y-4">
          {rows.map((r) => (
            <RegistrationCard key={r.id} r={r} />
          ))}
        </ul>
      )}
    </div>
  );
}

function RegistrationCard({ r }: { r: Registration }) {
  const badge = STATUS_BADGE[r.status];
  return (
    <li className="rounded-xl border-2 border-line bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xl font-bold">
            {r.first_name} {r.last_name}
          </p>
          <p className="text-base text-gray-600">
            {r.ref_code} · zgłoszono {formatDate(r.created_at)}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-base font-semibold ${badge.cls}`}>{badge.label}</span>
      </div>

      <dl className="mt-4 grid gap-x-6 gap-y-1 text-lg sm:grid-cols-2">
        <div>
          <dt className="inline text-gray-600">Trasa: </dt>
          <dd className="inline font-semibold">{r.route_title}</dd>
        </div>
        <div>
          <dt className="inline text-gray-600">Osób: </dt>
          <dd className="inline font-semibold">{r.people}</dd>
        </div>
        <div>
          <dt className="inline text-gray-600">Kwota: </dt>
          <dd className="inline font-semibold">{formatPrice(r.amount)}</dd>
        </div>
        <div>
          <dt className="inline text-gray-600">Tytuł przelewu: </dt>
          <dd className="inline font-mono">{transferTitle(r.ref_code, r.last_name)}</dd>
        </div>
        <div>
          <dt className="inline text-gray-600">E-mail: </dt>
          <dd className="inline">
            <a href={`mailto:${r.email}`} className="text-accent underline">
              {r.email}
            </a>
          </dd>
        </div>
        {r.phone && (
          <div>
            <dt className="inline text-gray-600">Telefon: </dt>
            <dd className="inline">
              <a href={`tel:${r.phone.replace(/\s/g, "")}`} className="text-accent underline">
                {r.phone}
              </a>
            </dd>
          </div>
        )}
      </dl>
      {r.message && (
        <p className="mt-3 rounded-lg bg-muted p-3 text-base">
          <span className="font-semibold">Uwagi uczestnika:</span> {r.message}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        {r.status !== "oplacone" ? (
          <form action={setRegistrationStatus.bind(null, r.id, "oplacone")}>
            <button className="rounded-lg bg-accent px-5 py-3 text-lg font-semibold text-white hover:bg-accent-hover">
              ✓ Oznacz jako opłacone
            </button>
          </form>
        ) : (
          <form action={setRegistrationStatus.bind(null, r.id, "nowe")}>
            <button className="rounded-lg border-2 border-gray-300 px-5 py-3 text-lg font-semibold hover:bg-gray-50">
              ↩ Cofnij „opłacone”
            </button>
          </form>
        )}
        <form action={setDeclarationReceived.bind(null, r.id, !r.declaration_received)}>
          <button
            className={`rounded-lg border-2 px-5 py-3 text-lg font-semibold ${
              r.declaration_received
                ? "border-green-300 bg-green-50 text-green-900"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {r.declaration_received ? "✉ Deklaracja otrzymana ✓" : "✉ Oznacz: deklaracja otrzymana"}
          </button>
        </form>
        {r.status !== "anulowane" && (
          <form action={setRegistrationStatus.bind(null, r.id, "anulowane")}>
            <button className="rounded-lg border-2 border-red-200 px-5 py-3 text-lg font-semibold text-red-700 hover:bg-red-50">
              Anuluj zgłoszenie
            </button>
          </form>
        )}
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-base font-semibold text-gray-700">
          📝 Notatki {r.admin_notes ? "(są)" : ""}
        </summary>
        <form action={saveRegistrationNotes.bind(null, r.id)} className="mt-2 space-y-2">
          <textarea
            name="admin_notes"
            defaultValue={r.admin_notes}
            rows={3}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-accent focus:outline-none"
          />
          <button className="rounded-lg bg-accent px-5 py-2 text-lg font-semibold text-white hover:bg-accent-hover">
            Zapisz notatkę
          </button>
        </form>
      </details>
    </li>
  );
}
