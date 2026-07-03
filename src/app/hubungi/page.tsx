import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/get-settings";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSettings();

  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
        `Hai ${settings.companyName}, saya nak tanya tentang servis anda.`
      )}`
    : null;

  const channels = [
    {
      label: "Telefon",
      value: settings.phone,
      href: settings.phone ? `tel:${settings.phone.replace(/\s+/g, "")}` : null,
    },
    {
      label: "Emel",
      value: settings.email,
      href: settings.email ? `mailto:${settings.email}` : null,
    },
    {
      label: "WhatsApp",
      value: settings.whatsapp ? `+${settings.whatsapp}` : null,
      href: whatsappHref,
    },
    {
      label: "Alamat",
      value: settings.address,
      href: settings.mapUrl || null,
    },
  ].filter((c) => c.value);

  return (
    <>
      <NavBar companyName={settings.companyName} />
      <main className="flex-1">
        <section className="blueprint-grid border-b border-line bg-navy-950">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
            <p className="font-mono text-xs uppercase tracking-widest-plus text-amber">
              Hubungi Kami
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-paper md:text-5xl">
              Mari kita bina sesuatu bersama
            </h1>
            <p className="mt-3 max-w-xl font-sans text-sm text-paper-dim md:text-base">
              Ada projek, soalan tentang produk, atau nak minta sebut harga? Pilih cara
              paling mudah untuk anda di bawah.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14 md:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {channels.map((c) => (
              <div
                key={c.label}
                className="reg-corners flex flex-col justify-between gap-4 rounded-md border border-navy-800/15 bg-navy-800/5 p-6 text-amber-strong"
              >
                <p className="font-mono text-xs uppercase tracking-widest-plus text-amber-strong">
                  {c.label}
                </p>
                <p className="font-display text-lg font-semibold text-navy-950">
                  {c.value}
                </p>
                {c.href && (
                  <a
                    href={c.href}
                    target={c.label === "Alamat" || c.label === "WhatsApp" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="font-mono text-xs uppercase tracking-widest-plus text-navy-900/60 hover:text-amber-strong"
                  >
                    Buka →
                  </a>
                )}
              </div>
            ))}
          </div>

          {channels.length === 0 && (
            <div className="rounded-md border border-dashed border-navy-800/20 p-12 text-center">
              <p className="font-mono text-sm text-navy-900/60">
                Maklumat hubungi belum ditetapkan. Sila kemas kini di panel admin.
              </p>
            </div>
          )}
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
