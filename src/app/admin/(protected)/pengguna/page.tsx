import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import NewAdminForm from "@/components/admin/NewAdminForm";
import DeleteAdminButton from "@/components/admin/DeleteAdminButton";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await auth();
  const admins = await prisma.admin.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest-plus text-amber-strong">
        Akses
      </p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-navy-950">
        Pengguna Admin
      </h1>
      <p className="mt-2 max-w-xl font-sans text-sm text-navy-900/60">
        Urus siapa yang boleh log masuk ke panel admin ini.
      </p>

      <div className="mt-8 max-w-2xl rounded-md border border-navy-800/10 bg-navy-800/5 p-5">
        <p className="font-mono text-[11px] uppercase tracking-widest-plus text-navy-900/50">
          Tambah Admin Baharu
        </p>
        <NewAdminForm />
      </div>

      <div className="mt-8 overflow-x-auto rounded-md border border-navy-800/10">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-navy-800/10 bg-navy-800/5 font-mono text-[11px] uppercase tracking-widest-plus text-navy-900/60">
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Emel</th>
              <th className="px-4 py-3">Ditambah</th>
              <th className="px-4 py-3 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id} className="border-b border-navy-800/5">
                <td className="px-4 py-3 font-medium text-navy-950">
                  {a.name} {a.id === session?.user.id && (
                    <span className="ml-1 font-mono text-[10px] uppercase text-amber-strong">
                      (Anda)
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-navy-900/70">{a.email}</td>
                <td className="px-4 py-3 font-mono text-xs text-navy-900/70">
                  {formatDate(a.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteAdminButton
                    adminId={a.id}
                    disabled={a.id === session?.user.id || admins.length <= 1}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
