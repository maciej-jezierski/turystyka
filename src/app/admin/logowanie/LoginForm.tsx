"use client";

import { useActionState } from "react";
import { login } from "./actions";

const inputClass =
  "w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-xl focus:border-accent focus:outline-none";

export default function LoginForm() {
  const [error, formAction, pending] = useActionState(login, null);
  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-1 block text-lg font-semibold">
          E-mail
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-lg font-semibold">
          Hasło
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-lg text-red-800">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-accent px-6 py-4 text-xl font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Logowanie…" : "Zaloguj się"}
      </button>
    </form>
  );
}
