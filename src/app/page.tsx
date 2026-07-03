import Link from "next/link";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/get-settings";

export const dynamic = "force-dynamic";

const services = [
  {
    code: "01",
    title: "Cetakan 3D",
    desc: "Prototaip dan part custom, dari fail STL ke objek dalam tangan anda.",
  },
  {
    code: "02",
    title: "Reka Bentuk Produk",
    desc: "CAD, lakaran teknikal, dan semakan reka bentuk sebelum fabrikasi.",
  },
  {
    code: "03",
    title: "Fabrikasi Prototaip",
    desc: "Dari konsep ke model fungsional yang sedia untuk diuji.",
  },
  {
    code: "04",
    title: "Pembaikan Teknikal",
    desc: "Diagnostik dan pembaikan litar, hardware, dan peranti IoT.",
  },
];

export default async function HomePage() {
  const settings = await getSettings();

  const featuredArgs = {
    where: { isActive: true, isFeatured: true },
    include: { images: { orderBy: { position: "asc" as const }, take: 1 } },
    orderBy: { createdAt: "desc" as const },
    take: 3,
  };

  let featured: Awaited<ReturnType<typeof prisma.product.findMany<typeof featuredArgs>>> = [];
  try {
    featured = await prisma.product.findMany(featuredArgs);
  } catch {
    featured = [];
  }

  return (
    <>
      <NavBar companyName={settings.companyName} />
      <main className="flex-1">
        {/* HERO */}
        <section className="blueprint-grid relative overflow-hidden border-b border-line bg-navy-950">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-24">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest-plus text-amber">
                {settings.address || "Malaysia"} · Studio Fabrikasi &amp; Prototaip
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.08] text-paper md:text-6xl">
                {settings.tagline || "Prototaip. Fabrikasi. Selesai."}
              </h1>
              <p className="mt-5 max-w-md font-sans text-base leading-relaxed text-paper-dim">
                {settings.aboutText}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/produk"
                  className="rounded-sm bg-amber px-5 py-3 font-mono text-xs font-medium uppercase tracking-widest-plus text-navy-950 hover:bg-amber-strong"
                >
                  Lihat Produk
                </Link>
                <Link
                  href="/kad-perniagaan"
                  className="rounded-sm border border-line px-5 py-3 font-mono text-xs font-medium uppercase tracking-widest-plus text-paper hover:border-amber hover:text-amber"
                >
                  Kad Perniagaan Digital
                </Link>
              </div>
            </div>

            <div className="reg-corners relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center rounded-md border border-line bg-navy-900/60 p-8 text-amber">
              <Image
                src="/logo.png"
                alt={settings.companyName}
                width={340}
                height={340}
                className="h-full w-full object-contain"
                priority
              />
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-sm bg-navy-950 px-3 py-1 font-mono text-[10px] uppercase tracking-widest-plus text-paper-dim">
                {settings.companyName} — Rev. 01
              </span>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <p className="font-mono text-xs uppercase tracking-widest-plus text-amber">
            Apa Kami Buat
          </p>
          <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold text-navy-950 md:text-4xl">
            Servis teras kami
          </h2>

          <div className="mt-10 grid gap-px overflow-hidden rounded-md border border-navy-800/10 bg-navy-800/10 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.code} className="flex flex-col gap-3 bg-paper p-6">
                <span className="font-mono text-xs text-amber-strong">{s.code}</span>
                <h3 className="font-display text-lg font-semibold text-navy-950">
                  {s.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-navy-900/70">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        {featured.length > 0 && (
          <section className="border-t border-navy-800/10 bg-navy-950">
            <div className="blueprint-grid mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest-plus text-amber">
                    Katalog
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-semibold text-paper md:text-4xl">
                    Produk pilihan
                  </h2>
                </div>
                <Link
                  href="/produk"
                  className="font-mono text-xs uppercase tracking-widest-plus text-paper-dim hover:text-amber"
                >
                  Lihat semua produk →
                </Link>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((p) => (
                  <ProductCard
                    key={p.id}
                    slug={p.slug}
                    name={p.name}
                    category={p.category}
                    price={p.price.toString()}
                    currency={p.currency}
                    sku={p.sku}
                    isFeatured={p.isFeatured}
                    imageDataUrl={
                      p.images[0]
                        ? `data:${p.images[0].mimeType};base64,${p.images[0].data}`
                        : null
                    }
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA STRIP */}
        <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <div className="reg-corners flex flex-col items-start gap-6 rounded-md border border-navy-800/15 bg-navy-800/5 p-8 text-navy-950 md:flex-row md:items-center md:justify-between md:p-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest-plus text-amber-strong">
                Ada idea untuk direalisasikan?
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">
                Mari bincang keperluan prototaip anda.
              </h2>
            </div>
            <Link
              href="/hubungi"
              className="rounded-sm bg-navy-950 px-6 py-3 font-mono text-xs font-medium uppercase tracking-widest-plus text-paper hover:bg-navy-900"
            >
              Hubungi Kami
            </Link>
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
