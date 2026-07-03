import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/get-settings";

export const dynamic = "force-dynamic";

type SearchParams = { kategori?: string };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const settings = await getSettings();
  const { kategori } = await searchParams;

  const productsArgs = {
    where: {
      isActive: true,
      ...(kategori ? { category: kategori } : {}),
    },
    include: { images: { orderBy: { position: "asc" as const }, take: 1 } },
    orderBy: [{ isFeatured: "desc" as const }, { createdAt: "desc" as const }],
  };

  let products: Awaited<ReturnType<typeof prisma.product.findMany<typeof productsArgs>>> = [];
  let categories: string[] = [];

  try {
    products = await prisma.product.findMany(productsArgs);
    const all = await prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ["category"],
    });
    categories = all.map((c) => c.category);
  } catch {
    products = [];
    categories = [];
  }

  return (
    <>
      <NavBar companyName={settings.companyName} />
      <main className="flex-1">
        <section className="blueprint-grid border-b border-line bg-navy-950">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
            <p className="font-mono text-xs uppercase tracking-widest-plus text-amber">
              Katalog
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-paper md:text-5xl">
              Produk &amp; Servis Kami
            </h1>
            <p className="mt-3 max-w-xl font-sans text-sm text-paper-dim md:text-base">
              Senarai produk dan perkhidmatan yang tersedia dari {settings.companyName}.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-12 md:px-8">
          {categories.length > 1 && (
            <div className="mb-8 flex flex-wrap gap-2">
              <Link
                href="/produk"
                className={`rounded-sm border px-3 py-1.5 font-mono text-xs uppercase tracking-widest-plus ${
                  !kategori
                    ? "border-amber bg-amber text-navy-950"
                    : "border-navy-800/20 text-navy-900/70 hover:border-amber hover:text-amber-strong"
                }`}
              >
                Semua
              </Link>
              {categories.map((c) => (
                <Link
                  key={c}
                  href={`/produk?kategori=${encodeURIComponent(c)}`}
                  className={`rounded-sm border px-3 py-1.5 font-mono text-xs uppercase tracking-widest-plus ${
                    kategori === c
                      ? "border-amber bg-amber text-navy-950"
                      : "border-navy-800/20 text-navy-900/70 hover:border-amber hover:text-amber-strong"
                  }`}
                >
                  {c}
                </Link>
              ))}
            </div>
          )}

          {products.length === 0 ? (
            <div className="rounded-md border border-dashed border-navy-800/20 p-12 text-center">
              <p className="font-mono text-sm text-navy-900/60">
                Tiada produk untuk dipaparkan buat masa ini.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
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
