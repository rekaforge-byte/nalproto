"use client";

import { useActionState, useRef, useEffect } from "react";
import { createAdmin, type AdminFormState } from "@/lib/actions/admins";

const initialState: AdminFormState = {};

export default function NewAdminForm() {
  const [state, formAction, pending] = useActionState(createAdmin, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
      <label className="flex flex-1 flex-col gap-1.5">
        <span className="font-mono text-[11px] uppercase tracking-widest-plus text-navy-900/50">
          Name
        </span>
        <input name="name" required className="input" placeholder="Admin name" />
      </label>
      <label className="flex flex-1 flex-col gap-1.5">
        <span className="font-mono text-[11px] uppercase tracking-widest-plus text-navy-900/50">
          Email
        </span>
        <input name="email" type="email" required className="input" placeholder="admin@nalproto.com" />
      </label>
      <label className="flex flex-1 flex-col gap-1.5">
        <span className="font-mono text-[11px] uppercase tracking-widest-plus text-navy-900/50">
          Password
        </span>
        <input name="password" type="password" required minLength={8} className="input" placeholder="Min. 8 characters" />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="h-fit rounded-sm bg-navy-950 px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-widest-plus text-paper hover:bg-navy-900 disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add Admin"}
      </button>

      {state.error && (
        <p className="w-full rounded-sm border border-red-300 bg-red-50 px-3 py-2 font-mono text-xs text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="w-full rounded-sm border border-emerald-300 bg-emerald-50 px-3 py-2 font-mono text-xs text-emerald-700">
          New admin added successfully.
        </p>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 2px;
          border: 1px solid rgba(15, 24, 48, 0.15);
          background: white;
          padding: 0.6rem 0.75rem;
          font-family: var(--font-sans);
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: var(--amber-strong);
        }
      `}</style>
    </form>
  );
}
