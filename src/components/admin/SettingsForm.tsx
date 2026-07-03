"use client";

import { useActionState } from "react";
import { updateSettings, type SettingsFormState } from "@/lib/actions/settings";

const initialState: SettingsFormState = {};

type SettingsFormProps = {
  settings: {
    companyName: string;
    tagline: string;
    aboutText: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    mapUrl: string;
    instagram: string;
    facebook: string;
    tiktok: string;
  };
};

export default function SettingsForm({ settings }: SettingsFormProps) {
  const [state, formAction, pending] = useActionState(updateSettings, initialState);

  return (
    <form action={formAction} className="mt-8 flex max-w-2xl flex-col gap-6">
      <Field label="Nama Syarikat">
        <input name="companyName" required defaultValue={settings.companyName} className="input" />
      </Field>
      <Field label="Tagline">
        <input name="tagline" defaultValue={settings.tagline} className="input" />
      </Field>
      <Field label="Tentang Kami">
        <textarea
          name="aboutText"
          rows={4}
          defaultValue={settings.aboutText}
          className="input resize-y"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Telefon">
          <input name="phone" defaultValue={settings.phone} className="input" placeholder="+60 12-345 6789" />
        </Field>
        <Field label="WhatsApp (nombor sahaja, cth 60123456789)">
          <input name="whatsapp" defaultValue={settings.whatsapp} className="input" placeholder="60123456789" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Emel">
          <input name="email" type="email" defaultValue={settings.email} className="input" />
        </Field>
        <Field label="Pautan Google Maps (pilihan)">
          <input name="mapUrl" defaultValue={settings.mapUrl} className="input" placeholder="https://maps.google.com/..." />
        </Field>
      </div>

      <Field label="Alamat">
        <input name="address" defaultValue={settings.address} className="input" />
      </Field>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Instagram">
          <input name="instagram" defaultValue={settings.instagram} className="input" placeholder="https://instagram.com/..." />
        </Field>
        <Field label="Facebook">
          <input name="facebook" defaultValue={settings.facebook} className="input" placeholder="https://facebook.com/..." />
        </Field>
        <Field label="TikTok">
          <input name="tiktok" defaultValue={settings.tiktok} className="input" placeholder="https://tiktok.com/@..." />
        </Field>
      </div>

      {state.error && (
        <p className="rounded-sm border border-red-300 bg-red-50 px-3 py-2 font-mono text-xs text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-sm border border-emerald-300 bg-emerald-50 px-3 py-2 font-mono text-xs text-emerald-700">
          Tetapan berjaya dikemaskini.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-sm bg-amber px-6 py-3 font-mono text-xs font-medium uppercase tracking-widest-plus text-navy-950 hover:bg-amber-strong disabled:opacity-60"
      >
        {pending ? "Menyimpan…" : "Simpan Tetapan"}
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
