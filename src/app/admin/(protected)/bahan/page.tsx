import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MaterialRowActions from "@/components/admin/MaterialRowActions";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminMaterialsPage() {
  const materials = await prisma.material.findMany({ orderBy: { position: "asc" } });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest-plus text-amber-strong">
            Quote Calculator
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-navy-950">
            Print Materials ({materials.length})
          </h1>
          <p className="mt-2 max-w-xl font-sans text-sm text-navy-900/60">
            Materials customers can choose from on the{" "}
            <Link href="/quote" className="underline hover:text-amber-strong">
              Get a Quote
            </Link>{" "}
            page. Set the site-wide markup in Company Settings.
          </p>
        </div>
        <Link
          href="/admin/bahan/baharu"
          className="rounded-sm bg-navy-950 px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-widest-plus text-paper hover:bg-navy-900"
        >
          + Add Material
        </Link>
      </div>

      {materials.length === 0 ? (
        <div className="mt-8 rounded-md border border-dashed border-navy-800/20 p-12 text-center">
          <p className="font-mono text-sm text-navy-900/60">
            No materials yet. Click &ldquo;Add Material&rdquo; to get started.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-md border border-navy-800/10">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-b border-navy-800/10 bg-navy-800/5 font-mono text-[11px] uppercase tracking-widest-plus text-navy-900/60">
                <th className="px-4 py-3">Material</th>
                <th className="px-4 py-3">Density</th>
                <th className="px-4 py-3">Your Cost / g</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => (
                <tr key={m.id} className="border-b border-navy-800/5 text-sm">
                  <td className="px-4 py-3 font-medium text-navy-950">{m.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-navy-900/70">
                    {m.densityGCm3.toString()} g/cm³
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-navy-900/70">
                    {formatPrice(m.costPerGram.toString(), "MYR")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-sm px-2 py-1 font-mono text-[10px] uppercase tracking-widest-plus ${
                        m.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-navy-800/10 text-navy-900/50"
                      }`}
                    >
                      {m.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <MaterialRowActions
                      materialId={m.id}
                      isActive={m.isActive}
                      editHref={`/admin/bahan/${m.id}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
