"use client";

import { useActionState } from "react";
import type { MaterialFormState } from "@/lib/actions/materials";

type MaterialFormProps = {
  action: (state: MaterialFormState, formData: FormData) => Promise<MaterialFormState>;
  submitLabel: string;
  initial?: {
    name: string;
    densityGCm3: string;
    costPerGram: string;
    position: number;
    isActive: boolean;
  };
};

const initialState: MaterialFormState = {};

export default function MaterialForm({ action, submitLabel, initial }: MaterialFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="mt-8 flex max-w-xl flex-col gap-6">
      <Field label="Material Name">
        <input
          name="name"
          required
          defaultValue={initial?.name}
          className="input"
          placeholder="PLA"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Density (g/cm³)">
          <input
            name="densityGCm3"
            type="number"
            step="0.001"
            min="0"
            required
            defaultValue={initial?.densityGCm3}
            className="input"
            placeholder="1.24"
          />
        </Field>
        <Field label="Your cost per gram (RM)">
          <input
            name="costPerGram"
            type="number"
            step="0.0001"
            min="0"
            required
            defaultValue={initial?.costPerGram}
            className="input"
            placeholder="0.08"
          />
        </Field>
      </div>
      <p className="-mt-3 font-sans text-xs text-navy-900/50">
        Density is a physical property of the filament (look it up per brand/material).
        Cost per gram is what the raw filament costs <em>you</em> — the site markup
        (set in Company Settings) is applied on top of this automatically.
      </p>

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
        Available in Quote Calculator
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
