import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/", label: "Utama" },
  { href: "/produk", label: "Produk" },
  { href: "/kad-perniagaan", label: "Kad Perniagaan" },
  { href: "/hubungi", label: "Hubungi" },
];

export default function NavBar({ companyName = "NAL PROTO" }: { companyName?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-navy-950/95 backdrop-blur supports-[backdrop-filter]:bg-navy-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt={`Logo ${companyName}`}
            width={40}
            height={40}
            className="rounded-md"
            priority
          />
          <span className="font-display text-lg font-semibold tracking-tight text-paper">
            {companyName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-widest-plus text-paper-dim transition-colors hover:text-amber"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/hubungi"
          className="hidden rounded-sm bg-amber px-4 py-2 font-mono text-xs font-medium uppercase tracking-widest-plus text-navy-950 transition-colors hover:bg-amber-strong md:inline-block"
        >
          Dapatkan Sebut Harga
        </Link>

        <MobileNav companyName={companyName} />
      </div>
    </header>
  );
}

function MobileNav({ companyName }: { companyName: string }) {
  return (
    <details className="relative md:hidden">
      <summary className="list-none cursor-pointer rounded-sm border border-line px-3 py-2 font-mono text-xs uppercase tracking-widest-plus text-paper">
        Menu
      </summary>
      <div className="absolute right-0 top-12 flex w-56 flex-col gap-1 rounded-md border border-line bg-navy-900 p-3 shadow-xl">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-widest-plus text-paper-dim hover:bg-navy-800 hover:text-amber"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/hubungi"
          className="mt-1 rounded-sm bg-amber px-3 py-2 text-center font-mono text-xs font-medium uppercase tracking-widest-plus text-navy-950"
        >
          Dapatkan Sebut Harga — {companyName}
        </Link>
      </div>
    </details>
  );
}
