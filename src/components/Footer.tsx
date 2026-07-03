import Link from "next/link";

type FooterProps = {
  companyName: string;
  phone?: string;
  email?: string;
  address?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
};

export default function Footer({
  companyName,
  phone,
  email,
  address,
  instagram,
  facebook,
  tiktok,
}: FooterProps) {
  const year = new Date().getFullYear();
  const socials = [
    { label: "Instagram", href: instagram },
    { label: "Facebook", href: facebook },
    { label: "TikTok", href: tiktok },
  ].filter((s) => s.href);

  return (
    <footer className="blueprint-grid mt-24 border-t border-line bg-navy-950 text-paper">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-semibold">{companyName}</p>
            <p className="mt-2 max-w-xs font-sans text-sm text-paper-dim">
              Reka bentuk, cetakan 3D dan fabrikasi prototaip — dari idea ke objek sebenar.
            </p>
          </div>

          <div className="font-mono text-sm text-paper-dim">
            <p className="mb-3 text-xs uppercase tracking-widest-plus text-amber">Hubungi</p>
            <ul className="space-y-1.5">
              {phone && <li>{phone}</li>}
              {email && <li>{email}</li>}
              {address && <li>{address}</li>}
            </ul>
          </div>

          <div className="font-mono text-sm text-paper-dim">
            <p className="mb-3 text-xs uppercase tracking-widest-plus text-amber">Pautan</p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/produk" className="hover:text-amber">
                  Produk &amp; Servis
                </Link>
              </li>
              <li>
                <Link href="/kad-perniagaan" className="hover:text-amber">
                  Kad Perniagaan Digital
                </Link>
              </li>
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line-soft pt-6 font-mono text-xs text-paper-dim/70 md:flex-row md:items-center md:justify-between">
          <span>© {year} {companyName}. Hak cipta terpelihara.</span>
          <span>Dibina dengan Next.js</span>
        </div>
      </div>
    </footer>
  );
}
