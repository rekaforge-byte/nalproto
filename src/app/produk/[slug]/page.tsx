import Link from "next/link";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/get-settings";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const settings = await getSettings();

  const product = await prisma.product
    .findUnique({
      where: { slug },
      include: { images: { orderBy: { position: "asc" } } },
    })
    .catch(() => null);

  if (!product || !product.isActive) notFound();

  const whatsappMsg = encodeURIComponent(
    `Hi ${settings.companyName}, I'm interested in the product "${product.name}".`
  );
  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp}?text=${whatsappMsg}`
    : null;

  return (
    <>
      <NavBar companyName={settings.companyName} />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
          <Link
            href="/produk"
            className="font-mono text-xs uppercase tracking-widest-plus text-navy-900/50 hover:text-amber-strong"
          >
            ← Back to Products
          </Link>

          <div className="mt-6 grid gap-10 md:grid-cols-2">
            <div className="reg-corners overflow-hidden rounded-md border border-navy-800/15 bg-navy-900 text-amber">
              {product.images.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`data:${product.images[0].mimeType};base64,${product.images[0].data}`}
                  alt={product.name}
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center font-mono text-sm text-paper-dim">
                  No Image
                </div>
              )}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-px bg-line-soft">
                  {product.images.slice(1, 5).map((img) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={img.id}
                      src={`data:${img.mimeType};base64,${img.data}`}
                      alt={product.name}
                      className="aspect-square w-full object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-widest-plus text-amber-strong">
                {product.category}
                {product.sku ? ` · SKU ${product.sku}` : ""}
              </p>
              <h1 className="mt-2 font-display text-3xl font-semibold text-navy-950 md:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 font-mono text-2xl font-semibold text-navy-950">
                {formatPrice(product.price.toString(), product.currency)}
              </p>

              <p className="mt-6 whitespace-pre-line font-sans text-sm leading-relaxed text-navy-900/75 md:text-base">
                {product.description}
              </p>

              {product.stock !== null && (
                <p className="mt-4 font-mono text-xs uppercase tracking-widest-plus text-navy-900/50">
                  Stock: {product.stock > 0 ? `${product.stock} unit${product.stock === 1 ? "" : "s"}` : "Out of stock"}
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-sm bg-amber px-5 py-3 font-mono text-xs font-medium uppercase tracking-widest-plus text-navy-950 hover:bg-amber-strong"
                  >
                    Ask via WhatsApp
                  </a>
                )}
                <Link
                  href="/hubungi"
                  className="rounded-sm border border-navy-800/20 px-5 py-3 font-mono text-xs font-medium uppercase tracking-widest-plus text-navy-900 hover:border-amber hover:text-amber-strong"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
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
