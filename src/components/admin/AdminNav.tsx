"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/lib/actions/auth";

const links = [
  { href: "/admin/produk", label: "Products" },
  { href: "/admin/perkhidmatan", label: "Services" },
  { href: "/admin/bahan", label: "Print Materials" },
  { href: "/admin/tetapan", label: "Company Settings" },
  { href: "/admin/pengguna", label: "Admin Users" },
];

export default function AdminNav({
  userName,
  logoUrl = "/logo.png",
}: {
  userName: string;
  logoUrl?: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-b border-line bg-navy-950 text-paper md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="flex items-center gap-3 border-b border-line-soft px-5 py-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt="Logo" className="h-8 w-8 rounded-md object-contain" />
        <div>
          <p className="font-display text-sm font-semibold">Admin Panel</p>
          <p className="font-mono text-[10px] uppercase tracking-widest-plus text-paper-dim">
            NAL PROTO
          </p>
        </div>
      </div>

      <nav className="flex flex-row gap-1 overflow-x-auto px-3 py-3 md:flex-col md:overflow-visible">
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-widest-plus ${
                active
                  ? "bg-amber text-navy-950"
                  : "text-paper-dim hover:bg-navy-800 hover:text-paper"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-line-soft px-5 py-4 md:absolute md:bottom-0 md:w-64">
        <p className="truncate font-mono text-xs text-paper-dim">{userName}</p>
        <form action={signOutAction}>
          <button
            type="submit"
            className="mt-2 font-mono text-xs uppercase tracking-widest-plus text-amber hover:text-amber-strong"
          >
            Log Out
          </button>
        </form>
        <Link
          href="/"
          className="mt-2 block font-mono text-xs uppercase tracking-widest-plus text-paper-dim hover:text-paper"
        >
          ← Back to Home
        </Link>
      </div>
    </aside>
  );
}
