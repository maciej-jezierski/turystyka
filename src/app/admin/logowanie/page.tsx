import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Logowanie – panel", robots: { index: false } };

export default async function LoginPage({ searchParams }: PageProps<"/admin/logowanie">) {
  const params = await searchParams;
  return (
    <main className="flex flex-1 items-center justify-center bg-muted px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold">Panel administratora</h1>
        {"brak-uprawnien" in params && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-800">
            To konto nie ma uprawnień administratora.
          </p>
        )}
        <LoginForm />
      </div>
    </main>
  );
}
