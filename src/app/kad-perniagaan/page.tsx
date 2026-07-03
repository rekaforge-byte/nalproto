import Image from "next/image";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/get-settings";

export const dynamic = "force-dynamic";

export default async function BusinessCardPage() {
  const settings = await getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const cardUrl = `${siteUrl}/kad-perniagaan`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&color=16213F&bgcolor=F4F6FA&data=${encodeURIComponent(
    cardUrl
  )}`;

  const contactRows = [
    { label: "Telefon", value: settings.phone },
    { label: "Emel", value: settings.email },
    { label: "Alamat", value: settings.address },
  ].filter((r) => r.value);

  return (
    <>
      <NavBar companyName={settings.companyName} />
      <main className="flex-1">
        <section className="blueprint-grid border-b border-line bg-navy-950">
          <div className="mx-auto max-w-6xl px-5 py-14 text-center md:px-8 md:py-20">
            <p className="font-mono text-xs uppercase tracking-widest-plus text-amber">
              Kad Perniagaan Digital
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-paper md:text-5xl">
              Simpan kenalan kami
            </h1>
            <p className="mx-auto mt-3 max-w-lg font-sans text-sm text-paper-dim md:text-base">
              Imbas kod QR atau muat turun kad ini terus ke telefon anda.
            </p>
          </div>
        </section>

        <section className="mx-auto flex max-w-md flex-col items-center px-5 py-14 md:px-8">
          <div className="reg-corners w-full rounded-lg border border-navy-800/15 bg-navy-900 p-8 text-amber shadow-xl">
            <div className="flex flex-col items-center text-center">
              <Image
                src="/logo.png"
                alt={settings.companyName}
                width={88}
                height={88}
                className="rounded-md"
              />
              <h2 className="mt-4 font-display text-2xl font-semibold text-paper">
                {settings.companyName}
              </h2>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest-plus text-amber">
                {settings.tagline}
              </p>
            </div>

            <div className="mt-6 space-y-2 border-y border-line-soft py-5 font-mono text-sm text-paper-dim">
              {contactRows.map((row) => (
                <div key={row.label} className="flex justify-between gap-4">
                  <span className="text-paper-dim/60">{row.label}</span>
                  <span className="text-right text-paper">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrSrc}
                alt="Kod QR kad perniagaan"
                width={180}
                height={180}
                className="rounded-md bg-paper p-2"
              />
              <a
                href="/api/vcard"
                className="w-full rounded-sm bg-amber px-5 py-3 text-center font-mono text-xs font-medium uppercase tracking-widest-plus text-navy-950 hover:bg-amber-strong"
              >
                Muat Turun Kenalan (.vcf)
              </a>
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-sm border border-line px-5 py-3 text-center font-mono text-xs font-medium uppercase tracking-widest-plus text-paper hover:border-amber hover:text-amber"
                >
                  WhatsApp Kami
                </a>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer
        companyName={settings.companyName}
        phone={settings.phone}
        email={settings.email}
        address={settings.address}
        instagram={settings.instagram}
        facebook={settings.facebook}
        tiktok={settings.tiktok}
      />
    </>
  );
}
