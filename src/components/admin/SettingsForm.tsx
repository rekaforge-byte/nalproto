"use client";

import { useState } from "react";
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
    quoteMarkupMultiplier: string;
    quoteMinPrice: string;
    logoUrl: string;
  };
};

export default function SettingsForm({ settings }: SettingsFormProps) {
  const [state, formAction, pending] = useActionState(updateSettings, initialState);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setLogoPreview(null);
      return;
    }
    setLogoPreview(URL.createObjectURL(file));
  }

  return (
    <form action={formAction} className="mt-8 flex max-w-2xl flex-col gap-6">
      <Field label="Company Logo (PNG, JPEG, WEBP, or SVG, max 2MB)">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoPreview || settings.logoUrl}
            alt="Current logo"
            className="h-16 w-16 rounded-md border border-navy-800/15 object-contain bg-white p-1"
          />
          <input
            type="file"
            name="logo"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon"
            onChange={handleLogoChange}
            className="input file:mr-4 file:rounded-sm file:border-0 file:bg-navy-950 file:px-3 file:py-2 file:font-mono file:text-xs file:uppercase file:text-paper"
          />
        </div>
      </Field>

      <Field label="Company Name">
        <input name="companyName" required defaultValue={settings.companyName} className="input" />
      </Field>
      <Field label="Tagline">
        <input name="tagline" defaultValue={settings.tagline} className="input" />
      </Field>
      <Field label="About Us">
        <textarea
          name="aboutText"
          rows={4}
          defaultValue={settings.aboutText}
          className="input resize-y"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Phone">
          <input name="phone" defaultValue={settings.phone} className="input" placeholder="+60 12-345 6789" />
        </Field>
        <Field label="WhatsApp (numbers only, e.g. 60123456789)">
          <input name="whatsapp" defaultValue={settings.whatsapp} className="input" placeholder="60123456789" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Email">
          <input name="email" type="email" defaultValue={settings.email} className="input" />
        </Field>
        <Field label="Google Maps Link (optional)">
          <input name="mapUrl" defaultValue={settings.mapUrl} className="input" placeholder="https://maps.google.com/..." />
        </Field>
      </div>

      <Field label="Address">
        <input name="address" defaultValue={settings.address} className="input" />
      </Field>

      <div className="grid grid-cols-2 gap-4 rounded-md border border-navy-800/10 bg-navy-800/5 p-4">
        <div className="col-span-2">
          <p className="font-mono text-xs uppercase tracking-widest-plus text-amber-strong">
            Quote Calculator Pricing
          </p>
          <p className="mt-1 font-sans text-xs text-navy-900/50">
            Final price = estimated weight × material cost/gram × markup. Set each
            material&apos;s cost/gram under &ldquo;Print Materials&rdquo;.
          </p>
        </div>
        <Field label="Markup multiplier (e.g. 3 = 3x cost)">
          <input
            name="quoteMarkupMultiplier"
            type="number"
            step="0.1"
            min="1"
            required
            defaultValue={settings.quoteMarkupMultiplier}
            className="input"
            placeholder="3"
          />
        </Field>
        <Field label="Minimum quote price (RM)">
          <input
            name="quoteMinPrice"
            type="number"
            step="0.5"
            min="0"
            required
            defaultValue={settings.quoteMinPrice}
            className="input"
            placeholder="5"
          />
        </Field>
      </div>

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
          Settings updated successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-sm bg-amber px-6 py-3 font-mono text-xs font-medium uppercase tracking-widest-plus text-navy-950 hover:bg-amber-strong disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save Settings"}
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
