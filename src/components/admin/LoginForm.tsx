"use client";

import { useActionState } from "react";
import { loginAction, type LoginFormState } from "@/lib/actions/auth";

const initialState: LoginFormState = {};

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div>
        <label className="font-mono text-[11px] uppercase tracking-widest-plus text-paper-dim">
          Emel
        </label>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-sm border border-line bg-navy-950 px-3 py-2 font-sans text-sm text-paper outline-none focus:border-amber"
          placeholder="admin@nalproto.com"
        />
      </div>

      <div>
        <label className="font-mono text-[11px] uppercase tracking-widest-plus text-paper-dim">
          Kata Laluan
        </label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-sm border border-line bg-navy-950 px-3 py-2 font-sans text-sm text-paper outline-none focus:border-amber"
          placeholder="••••••••"
        />
      </div>

      {state.error && (
        <p className="rounded-sm border border-amber/40 bg-amber/10 px-3 py-2 font-mono text-xs text-amber">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-sm bg-amber px-4 py-3 font-mono text-xs font-medium uppercase tracking-widest-plus text-navy-950 transition-colors hover:bg-amber-strong disabled:opacity-60"
      >
        {pending ? "Sedang log masuk…" : "Log Masuk"}
      </button>
    </form>
  );
}
