"use client";

import { useState, useCallback } from "react";
import { parseMeshFile, type MeshStats } from "@/lib/mesh-volume";
import { formatPrice } from "@/lib/utils";

type Material = {
  id: string;
  name: string;
  densityGCm3: string;
  costPerGram: string;
};

type QuoteCalculatorProps = {
  materials: Material[];
  markupMultiplier: number;
  minPrice: number;
  whatsapp: string;
  companyName: string;
};

const infillOptions = [
  { label: "15% (light, decorative)", value: 15 },
  { label: "20% (standard, default)", value: 20 },
  { label: "35% (stronger parts)", value: 35 },
  { label: "50% (heavy duty)", value: 50 },
  { label: "100% (fully solid)", value: 100 },
];

export default function QuoteCalculator({
  materials,
  markupMultiplier,
  minPrice,
  whatsapp,
  companyName,
}: QuoteCalculatorProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [stats, setStats] = useState<MeshStats | null>(null);
  const [materialId, setMaterialId] = useState(materials[0]?.id || "");
  const [infill, setInfill] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setStats(null);
    setLoading(true);
    setFileName(file.name);
    try {
      const result = await parseMeshFile(file);
      if (!result.volumeMm3 || result.volumeMm3 < 1) {
        throw new Error(
          "Couldn't get a usable volume from this file. It may not be a closed (watertight) mesh."
        );
      }
      setStats(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to read this file.");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  const material = materials.find((m) => m.id === materialId);

  let weightG: number | null = null;
  let price: number | null = null;

  if (stats && material) {
    const volumeCm3 = stats.volumeMm3 / 1000;
    const density = parseFloat(material.densityGCm3);
    const costPerGram = parseFloat(material.costPerGram);
    weightG = volumeCm3 * density * (infill / 100);
    const rawCost = weightG * costPerGram;
    price = Math.max(rawCost * markupMultiplier, minPrice);
  }

  const whatsappHref =
    whatsapp && stats && material && price !== null
      ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(
          `Hi ${companyName}, I'd like to get a 3D print quote.\n\nFile: ${fileName}\nMaterial: ${material.name}\nInfill: ${infill}%\nEstimated weight: ${weightG?.toFixed(1)}g\nEstimated price: ${formatPrice(price.toFixed(2), "MYR")}\n\nI'll send over the file next.`
        )}`
      : null;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`reg-corners flex min-h-[220px] flex-col items-center justify-center rounded-md border-2 border-dashed p-8 text-center transition-colors ${
            dragOver
              ? "border-amber bg-amber/5"
              : "border-navy-800/20 bg-navy-800/5"
          }`}
        >
          <p className="font-mono text-xs uppercase tracking-widest-plus text-navy-900/50">
            Drag &amp; drop your file here
          </p>
          <p className="mt-1 font-sans text-sm text-navy-900/60">.stl or .3mf, any size</p>
          <label className="mt-4 cursor-pointer rounded-sm bg-navy-950 px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-widest-plus text-paper hover:bg-navy-900">
            Choose File
            <input
              type="file"
              accept=".stl,.3mf"
              onChange={onInputChange}
              className="hidden"
            />
          </label>
          {fileName && (
            <p className="mt-4 max-w-full truncate font-mono text-xs text-navy-900/70">
              {fileName}
            </p>
          )}
        </div>

        {loading && (
          <p className="mt-3 font-mono text-xs text-navy-900/50">Reading file…</p>
        )}
        {error && (
          <p className="mt-3 rounded-sm border border-red-300 bg-red-50 px-3 py-2 font-mono text-xs text-red-700">
            {error}
          </p>
        )}

        <p className="mt-6 font-sans text-xs leading-relaxed text-navy-900/50">
          This is a rough, automatic estimate based on your file&apos;s solid volume — it
          doesn&apos;t account for supports, walls/shells, or printer-specific settings.
          Final pricing is confirmed by our team once we review the actual file.
        </p>
      </div>

      <div className="reg-corners rounded-md border border-navy-800/15 bg-navy-950 p-6 text-amber">
        {!stats ? (
          <div className="flex h-full min-h-[220px] items-center justify-center">
            <p className="font-mono text-xs uppercase tracking-widest-plus text-paper-dim">
              Upload a file to see your estimate
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div>
              <label className="font-mono text-[11px] uppercase tracking-widest-plus text-paper-dim">
                Material
              </label>
              <select
                value={materialId}
                onChange={(e) => setMaterialId(e.target.value)}
                className="mt-1 w-full rounded-sm border border-line bg-navy-900 px-3 py-2 font-sans text-sm text-paper outline-none focus:border-amber"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase tracking-widest-plus text-paper-dim">
                Infill
              </label>
              <select
                value={infill}
                onChange={(e) => setInfill(Number(e.target.value))}
                className="mt-1 w-full rounded-sm border border-line bg-navy-900 px-3 py-2 font-sans text-sm text-paper outline-none focus:border-amber"
              >
                {infillOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 border-y border-line-soft py-4 font-mono text-xs text-paper-dim">
              <div>
                <p className="text-paper-dim/60">Bounding box</p>
                <p className="mt-0.5 text-paper">
                  {stats.boundingBoxMm.x.toFixed(0)} × {stats.boundingBoxMm.y.toFixed(0)} ×{" "}
                  {stats.boundingBoxMm.z.toFixed(0)} mm
                </p>
              </div>
              <div>
                <p className="text-paper-dim/60">Est. weight</p>
                <p className="mt-0.5 text-paper">{weightG?.toFixed(1)} g</p>
              </div>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest-plus text-amber-strong">
                Estimated Price
              </p>
              <p className="mt-1 font-display text-4xl font-semibold text-paper">
                {price !== null ? formatPrice(price.toFixed(2), "MYR") : "—"}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm bg-amber px-5 py-3 text-center font-mono text-xs font-medium uppercase tracking-widest-plus text-navy-950 hover:bg-amber-strong"
                >
                  Proceed via WhatsApp
                </a>
              )}
              <a
                href="/hubungi"
                className="rounded-sm border border-line px-5 py-3 text-center font-mono text-xs font-medium uppercase tracking-widest-plus text-paper hover:border-amber hover:text-amber"
              >
                Contact Us Instead
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
