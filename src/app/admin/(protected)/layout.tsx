import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper text-navy-950 md:flex-row">
      <AdminNav userName={session.user.email || session.user.name || "Admin"} />
      <main className="flex-1 px-5 py-8 md:px-10 md:py-10">{children}</main>
    </div>
  );
}
