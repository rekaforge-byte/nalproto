"use client";

import { useActionState, useState, useTransition } from "react";
import type { ProductFormState } from "@/lib/actions/products";

type ExistingImage = {
  id: string;
  dataUrl: string;
};

type ProductFormProps = {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  submitLabel: string;
  initial?: {
    name: string;
    category: string;
    description: string;
    price: string;
    sku: string;
    stock: string;
    isFeatured: boolean;
    isActive: boolean;
  };
  existingImages?: ExistingImage[];
  onDeleteImage?: (imageId: string) => Promise<void>;
};

const initialState: ProductFormState = {};

export default function ProductForm({
  action,
  submitLabel,
  initial,
  existingImages,
  onDeleteImage,
}: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  return (
    <form action={formAction} className="mt-8 flex max-w-2xl flex-col gap-6">
      <Field label="Nama Produk">
        <input
          name="name"
          required
          defaultValue={initial?.name}
          className="input"
          placeholder="Cetakan 3D Custom (PLA)"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Kategori">
          <input
            name="category"
            defaultValue={initial?.category}
            className="input"
            placeholder="Cetakan 3D"
          />
        </Field>
        <Field label="SKU (pilihan)">
          <input name="sku" defaultValue={initial?.sku} className="input" placeholder="P3D-001" />
        </Field>
      </div>

      <Field label="Penerangan">
        <textarea
          name="description"
          required
          rows={5}
          defaultValue={initial?.description}
          className="input resize-y"
          placeholder="Terangkan produk atau servis ini..."
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Harga (RM)">
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={initial?.price}
            className="input"
            placeholder="25.00"
          />
        </Field>
        <Field label="Stok (kosongkan jika servis)">
          <input
            name="stock"
            type="number"
            min="0"
            defaultValue={initial?.stock}
            className="input"
            placeholder="100"
          />
        </Field>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest-plus text-navy-900/70">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={initial?.isFeatured}
            className="h-4 w-4 accent-amber-strong"
          />
          Produk Pilihan
        </label>
        <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest-plus text-navy-900/70">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={initial ? initial.isActive : true}
            className="h-4 w-4 accent-amber-strong"
          />
          Papar di Laman Web
        </label>
      </div>

      {existingImages && existingImages.length > 0 && (
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-widest-plus text-navy-900/50">
            Gambar Sedia Ada
          </p>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img) => (
              <div key={img.id} className="group relative h-20 w-20 overflow-hidden rounded-sm border border-navy-800/15">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.dataUrl} alt="" className="h-full w-full object-cover" />
                {onDeleteImage && (
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => startDeleteTransition(() => onDeleteImage(img.id))}
                    className="absolute inset-0 hidden items-center justify-center bg-red-900/70 font-mono text-[10px] uppercase text-white group-hover:flex"
                  >
                    Padam
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Field label="Muat Naik Gambar Baharu (boleh pilih lebih dari satu, had 3MB setiap satu)">
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="input file:mr-4 file:rounded-sm file:border-0 file:bg-navy-950 file:px-3 file:py-2 file:font-mono file:text-xs file:uppercase file:text-paper"
        />
      </Field>

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {previews.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt=""
              className="h-20 w-20 rounded-sm border border-navy-800/15 object-cover"
            />
          ))}
        </div>
      )}

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
        {pending ? "Menyimpan…" : submitLabel}
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
