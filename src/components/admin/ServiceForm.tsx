"use client";

import { useActionState } from "react";
import type { ServiceFormState } from "@/lib/actions/services";

type ServiceFormProps = {
  action: (state: ServiceFormState, formData: FormData) => Promise<ServiceFormState>;
  submitLabel: string;
  initial?: {
    title: string;
    description: string;
    position: number;
    isActive: boolean;
  };
};

const initialState: ServiceFormState = {};

export default function ServiceForm({ action, submitLabel, initial }: ServiceFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="mt-8 flex max-w-xl flex-col gap-6">
      <Field label="Title">
        <input
          name="title"
          required
          defaultValue={initial?.title}
          className="input"
          placeholder="3D Printing"
        />
      </Field>

      <Field label="Description">
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={initial?.description}
          className="input resize-y"
          placeholder="Custom prototypes and parts, from STL file to object in your hands."
        />
      </Field>

      <Field label="Display order (lower numbers appear first)">
        <input
          name="position"
          type="number"
          defaultValue={initial?.position ?? 0}
          className="input"
        />
      </Field>

      <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest-plus text-navy-900/70">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={initial ? initial.isActive : true}
          className="h-4 w-4 accent-amber-strong"
        />
        Show on Website
      </label>

      {state.error && (
        <p className="rounded-sm border border-red-300 bg-red-50 px-3 py-2 font-mono text-xs text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-sm bg-amber px-6 py-3 font-mono text-xs font-medium uppercase tracking-widest-plus text-navy-950 hover:bg-amber-strong disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] uppercase tracking-widest-plus text-navy-900/50">
        {label}
      </span>
      {children}
    </label>
  );
}
