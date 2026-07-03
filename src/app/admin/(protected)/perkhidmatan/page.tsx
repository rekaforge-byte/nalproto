import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ServiceRowActions from "@/components/admin/ServiceRowActions";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { position: "asc" } });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest-plus text-amber-strong">
            Homepage Content
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-navy-950">
            Services ({services.length})
          </h1>
          <p className="mt-2 max-w-xl font-sans text-sm text-navy-900/60">
            These show up in the &ldquo;Our core services&rdquo; section on the homepage.
          </p>
        </div>
        <Link
          href="/admin/perkhidmatan/baharu"
          className="rounded-sm bg-navy-950 px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-widest-plus text-paper hover:bg-navy-900"
        >
          + Add Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="mt-8 rounded-md border border-dashed border-navy-800/20 p-12 text-center">
          <p className="font-mono text-sm text-navy-900/60">
            No services yet. Click &ldquo;Add Service&rdquo; to get started.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-md border border-navy-800/10">
          <table className="w-full min-w-[600px] border-collapse text-left">
            <thead>
              <tr className="border-b border-navy-800/10 bg-navy-800/5 font-mono text-[11px] uppercase tracking-widest-plus text-navy-900/60">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-b border-navy-800/5 text-sm">
                  <td className="px-4 py-3 font-mono text-xs text-navy-900/70">
                    {s.position}
                  </td>
                  <td className="px-4 py-3 font-medium text-navy-950">{s.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-sm px-2 py-1 font-mono text-[10px] uppercase tracking-widest-plus ${
                        s.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-navy-800/10 text-navy-900/50"
                      }`}
                    >
                      {s.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ServiceRowActions
                      serviceId={s.id}
                      isActive={s.isActive}
                      editHref={`/admin/perkhidmatan/${s.id}`}
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
