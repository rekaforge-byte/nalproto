import LoginForm from "@/components/admin/LoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="blueprint-grid flex min-h-screen items-center justify-center bg-navy-950 px-5">
      <div className="reg-corners w-full max-w-sm rounded-lg border border-line bg-navy-900 p-8 text-amber">
        <div className="flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="NAL PROTO" className="h-14 w-14 rounded-md" />
          <h1 className="mt-4 font-display text-xl font-semibold text-paper">
            Admin Login
          </h1>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-widest-plus text-paper-dim">
            NAL PROTO — Management Panel
          </p>
        </div>

        <LoginForm callbackUrl={callbackUrl || "/admin/produk"} />
      </div>
    </div>
  );
}
